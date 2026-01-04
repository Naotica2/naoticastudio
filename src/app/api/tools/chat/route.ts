import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { incrementStat } from "@/app/api/stats/route";

// Zod schema for input validation
const chatSchema = z.object({
    message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
});

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute

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

export async function POST(request: NextRequest) {
    try {
        // Check API key configuration
        const apiKey = process.env.CHAT_API_KEY;
        const apiBaseUrl = process.env.CHAT_API_URL || "https://api.hamsoffc.me/ai/deepseek";

        if (!apiKey) {
            console.error("[Chat] API key not configured");
            return NextResponse.json(
                { success: false, error: "Service temporarily unavailable" },
                { status: 503 }
            );
        }

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
        const validation = chatSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { message } = validation.data;

        // Call external AI API using environment variables
        const apiUrl = `${apiBaseUrl}?apikey=${apiKey}&prompt=${encodeURIComponent(message)}`;

        console.log("[Chat] Calling API:", apiBaseUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("[Chat] API Response:", JSON.stringify(data).substring(0, 200));

        // Handle different response formats
        let aiResponse = null;

        // Format 1: { status: true, result: "..." }
        if (data.status && data.result) {
            aiResponse = data.result;
        }
        // Format 2: { success: true, data: "..." }
        else if (data.success && data.data) {
            aiResponse = data.data;
        }
        // Format 3: { response: "..." }
        else if (data.response) {
            aiResponse = data.response;
        }
        // Format 4: { message: "..." } (not error)
        else if (data.message && !data.error && response.ok) {
            aiResponse = data.message;
        }
        // Format 5: { result: { text: "..." } }
        else if (data.result?.text) {
            aiResponse = data.result.text;
        }
        // Format 6: { result: { response: "..." } }
        else if (data.result?.response) {
            aiResponse = data.result.response;
        }
        // Format 7: Direct string result
        else if (typeof data.result === "string") {
            aiResponse = data.result;
        }

        if (aiResponse) {
            console.log(`[Chat] Success - Response length: ${aiResponse.length}`);

            // Track stats
            incrementStat("aiChat");

            return NextResponse.json({
                success: true,
                response: aiResponse,
            });
        } else {
            console.error("[Chat] Unknown response format:", data);
            return NextResponse.json(
                { success: false, error: data.message || data.error || "Failed to get AI response" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("[Chat] Error:", error);
        return NextResponse.json(
            { success: false, error: "Connection error. Please try again." },
            { status: 500 }
        );
    }
}
