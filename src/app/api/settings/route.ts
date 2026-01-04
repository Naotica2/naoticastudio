import { NextRequest, NextResponse } from "next/server";

// In-memory settings store (in production, use database)
// This will persist during server runtime
let settings = {
    aiChatMaintenance: true,
    imageToolsMaintenance: true,
    downloaderMaintenance: false,
    // Contact info
    contactEmail: "hello@naotica.studio",
    githubUrl: "https://github.com",
    instagramUrl: "https://instagram.com",
};

// GET - Fetch current settings
export async function GET() {
    return NextResponse.json({
        success: true,
        settings,
    });
}

// POST - Update settings (admin only)
export async function POST(request: NextRequest) {
    try {
        // Check admin session
        const isAdmin = request.cookies.get("admin_session")?.value === "authenticated";

        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Update maintenance settings
        if (typeof body.aiChatMaintenance === "boolean") {
            settings.aiChatMaintenance = body.aiChatMaintenance;
        }
        if (typeof body.imageToolsMaintenance === "boolean") {
            settings.imageToolsMaintenance = body.imageToolsMaintenance;
        }
        if (typeof body.downloaderMaintenance === "boolean") {
            settings.downloaderMaintenance = body.downloaderMaintenance;
        }

        // Update contact info
        if (typeof body.contactEmail === "string") {
            settings.contactEmail = body.contactEmail;
        }
        if (typeof body.githubUrl === "string") {
            settings.githubUrl = body.githubUrl;
        }
        if (typeof body.instagramUrl === "string") {
            settings.instagramUrl = body.instagramUrl;
        }

        console.log("[Settings] Updated:", settings);

        return NextResponse.json({
            success: true,
            settings,
        });
    } catch (error) {
        console.error("[Settings] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update settings" },
            { status: 500 }
        );
    }
}

