import { NextRequest } from "next/server";

export const runtime = "edge"; // Use edge runtime for better streaming

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const downloadUrl = searchParams.get("url");
        const filename = searchParams.get("filename") || "download";
        const format = searchParams.get("format") || "mp4";

        if (!downloadUrl) {
            return new Response(JSON.stringify({ error: "Download URL is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        console.log(`[Proxy Download] Fetching: ${downloadUrl}`);

        // Fetch the file with proper headers for TikTok CDN
        const response = await fetch(downloadUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "identity",
                "Connection": "keep-alive",
                "Referer": "https://www.tiktok.com/",
                "Origin": "https://www.tiktok.com",
                "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "video",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
                status: 502,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Determine extension
        let extension = ".mp4";
        let contentType = "video/mp4";

        if (format === "mp3") {
            extension = ".mp3";
            contentType = "audio/mpeg";
        }

        // Clean filename
        const safeFilename = filename
            .replace(/[^a-zA-Z0-9_\-\s]/g, "_")
            .substring(0, 50)
            .trim()
            .replace(/\.(mp4|mp3|m4a|webm)$/i, "") + extension;

        // Get content length if available
        const contentLength = response.headers.get("content-length");

        // Stream the response body directly
        const headers: HeadersInit = {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${safeFilename}"`,
            "Cache-Control": "no-cache",
        };

        if (contentLength) {
            headers["Content-Length"] = contentLength;
        }

        // Return streaming response
        return new Response(response.body, {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error("[Proxy Download] Error:", error);
        return new Response(JSON.stringify({ error: "Download failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
