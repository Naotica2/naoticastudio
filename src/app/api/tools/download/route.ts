import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { incrementStat } from "@/app/api/stats/route";

// Zod schema - accept any non-empty string as URL
// Let the download API handle URL validation
const downloadSchema = z.object({
    url: z.string().min(1, "Please enter a URL").refine(
        (val) => val.includes("http") || val.includes(".") || val.includes("/"),
        "Please enter a valid URL"
    ),
});

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute

// VKrDownloader response types
interface VKrFormat {
    url: string;
    format_id: string;
    ext: string;
    size?: string;
}

interface VKrDataPayload {
    title?: string;
    source?: string;
    description?: string | null;
    thumbnail?: string;
    formats?: VKrFormat[];
    // Downloads array - contains actual video download links
    downloads?: Array<{ url?: string; type?: string; quality?: string; ext?: string }>;
    // Legacy single fields
    download?: string;
    download_url?: string;
    video_hd?: string;
    video_sd?: string;
    video?: string;
    audio?: string;
    music?: string;
}

interface VKrResponse {
    success?: boolean;
    data?: VKrDataPayload;
    // Direct fields (fallback for different API versions)
    title?: string;
    source?: string;
    thumbnail?: string;
    formats?: VKrFormat[];
    downloads?: Array<{ url?: string; type?: string; quality?: string; ext?: string }>;
    download?: string;
    download_url?: string;
    video_hd?: string;
    video_sd?: string;
    video?: string;
    audio?: string;
    music?: string;
    error?: string;
    message?: string;
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

// Auto-fix URL format
function normalizeUrl(url: string): string {
    let normalized = url.trim();

    // Add https:// if no protocol
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
        normalized = "https://" + normalized;
    }

    return normalized;
}

export async function POST(request: NextRequest) {
    try {
        // VKrDownloader API configuration
        // Default API key is "vkrdownloader" (free tier)
        const apiKey = process.env.DOWNLOAD_API_KEY || "vkrdownloader";
        const apiBaseUrl = process.env.DOWNLOAD_API_URL || "https://vkrdownloader.org/server/";

        // Get client IP for rate limiting
        const ip = request.headers.get("x-forwarded-for") || "unknown";

        // Check rate limit
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { success: false, error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = downloadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        // Normalize the URL
        const url = normalizeUrl(validation.data.url);

        console.log(`[Download] Processing URL: ${url}`);

        // Call VKrDownloader API
        // Format: GET https://vkrdownloader.org/server/?api_key=API-KEY&vkr=VIDEO_URL
        const apiUrl = `${apiBaseUrl}?api_key=${apiKey}&vkr=${encodeURIComponent(url)}`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-api-key": apiKey, // Also send via header for compatibility
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                return NextResponse.json(
                    { success: false, error: "API authentication failed" },
                    { status: 401 }
                );
            }
            throw new Error(`API returned ${response.status}`);
        }

        const data: VKrResponse = await response.json();

        console.log("[Download] API Response:", JSON.stringify(data).substring(0, 500));

        // Handle VKrDownloader response format
        // Response can be: { success, data: { title, source, ... } } OR direct { title, source, ... }

        // Extract the payload - handle nested data structure
        const payload = data.data || data;

        console.log("[Download] API Response received, processing...");

        if (data.error || data.message) {
            const errorMsg = data.error || data.message || "Failed to fetch download link";
            console.error("[Download] API Error:", errorMsg);
            return NextResponse.json(
                { success: false, error: errorMsg },
                { status: 400 }
            );
        }

        const title = payload.title || "Download";
        const thumbnail = payload.thumbnail || null;

        // Get download URL - check downloads array first (VKrDownloader format)
        let downloadUrl: string | null = null;
        let formats: { quality: string; url: string; ext: string; size?: string }[] = [];

        // Check downloads array first (this is where VKrDownloader puts the actual video URLs)
        if (payload.downloads && Array.isArray(payload.downloads) && payload.downloads.length > 0) {
            // Find video download (prefer HD)
            const videoDownload = payload.downloads.find((d) => d.type?.includes('video') || d.url?.includes('.mp4'));
            if (videoDownload?.url) {
                downloadUrl = videoDownload.url;
            } else if (payload.downloads[0]?.url) {
                downloadUrl = payload.downloads[0].url;
            }

            // Build formats from downloads array
            formats = payload.downloads
                .filter((d) => d.url)
                .map((d) => ({
                    quality: d.quality || d.type || 'download',
                    url: d.url!,
                    ext: d.ext || 'mp4',
                }));
        }

        // Fallback to single download fields
        if (!downloadUrl) {
            downloadUrl = payload.download ||
                payload.download_url ||
                payload.video_hd ||
                payload.video_sd ||
                payload.video ||
                null;
        }

        // Parse formats array if available and no downloads found
        if (!downloadUrl && payload.formats && Array.isArray(payload.formats) && payload.formats.length > 0) {
            formats = payload.formats.map((f) => ({
                quality: f.format_id,
                url: f.url,
                ext: f.ext,
                size: f.size,
            }));

            // Try to get highest quality
            const qualityOrder = ["1080p", "720p", "480p", "360p", "audio"];
            for (const q of qualityOrder) {
                const found = formats.find((f) => f.quality.includes(q));
                if (found) {
                    downloadUrl = found.url;
                    break;
                }
            }
            // Fallback to first format
            if (!downloadUrl && formats.length > 0) {
                downloadUrl = formats[0].url;
            }
        }

        // Additional fallback: check for audio/music if no video found
        if (!downloadUrl && (payload.audio || payload.music)) {
            downloadUrl = payload.audio || payload.music || null;
        }

        if (downloadUrl) {
            console.log(`[Download] Success - Title: ${title}, Formats: ${formats.length}`);

            // Track stats
            incrementStat("downloader");

            return NextResponse.json({
                success: true,
                downloadUrl,
                title,
                thumbnail,
                formats: formats.length > 0 ? formats : undefined,
            });
        } else {
            console.error("[Download] No download URL found in response");
            return NextResponse.json(
                { success: false, error: "Failed to fetch download link. Please check the URL." },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("[Download] Error:", error);
        return NextResponse.json(
            { success: false, error: "Connection error. Please try again." },
            { status: 500 }
        );
    }
}
