import { NextResponse } from "next/server";

// Real stats store (in-memory, resets on server restart)
// In production, use database like Supabase
export const realStats = {
    downloaderHits: 0,
    aiChatHits: 0,
    imageToolsHits: 0,
    dailyTraffic: [
        { date: "Mon", visits: 0 },
        { date: "Tue", visits: 0 },
        { date: "Wed", visits: 0 },
        { date: "Thu", visits: 0 },
        { date: "Fri", visits: 0 },
        { date: "Sat", visits: 0 },
        { date: "Sun", visits: 0 },
    ],
    lastUpdated: new Date().toISOString(),
};

// Helper to increment stats
export function incrementStat(tool: "downloader" | "aiChat" | "imageTools") {
    if (tool === "downloader") {
        realStats.downloaderHits++;
    } else if (tool === "aiChat") {
        realStats.aiChatHits++;
    } else if (tool === "imageTools") {
        realStats.imageToolsHits++;
    }

    // Update daily traffic for current day
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = days[new Date().getDay()];
    const dayEntry = realStats.dailyTraffic.find(d => d.date === today);
    if (dayEntry) {
        dayEntry.visits++;
    }

    realStats.lastUpdated = new Date().toISOString();
}

export async function GET() {
    try {
        const totalHits = realStats.downloaderHits + realStats.aiChatHits + realStats.imageToolsHits;

        // Calculate growth (comparing to yesterday - simplified)
        const todayIndex = new Date().getDay();
        const yesterdayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const todayVisits = realStats.dailyTraffic.find(d => d.date === days[todayIndex])?.visits || 0;
        const yesterdayVisits = realStats.dailyTraffic.find(d => d.date === days[yesterdayIndex])?.visits || 1;
        const growth = yesterdayVisits > 0
            ? Math.round(((todayVisits - yesterdayVisits) / yesterdayVisits) * 100)
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalHits,
                toolUsage: [
                    { tool: "Downloader", hits: realStats.downloaderHits, color: "#6366f1" },
                    { tool: "AI Chat", hits: realStats.aiChatHits, color: "#818cf8" },
                    { tool: "Image Tools", hits: realStats.imageToolsHits, color: "#a855f7" },
                ],
                dailyTraffic: realStats.dailyTraffic,
                growth: growth >= 0 ? `+${growth}%` : `${growth}%`,
                lastUpdated: realStats.lastUpdated,
            },
        });
    } catch (error) {
        console.error("[Stats] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
