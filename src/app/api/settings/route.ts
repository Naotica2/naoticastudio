import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

// Settings interface matching database schema
interface SettingsRow {
    id: string;
    total_hits: number;
    site_name: string;
    contact_email: string;
    github_url: string;
    instagram_url: string;
    ai_chat_maintenance: boolean;
    image_tools_maintenance: boolean;
    downloader_maintenance: boolean;
    updated_at: string;
}

// GET - Fetch current settings from Supabase
export async function GET() {
    try {
        const supabase = createSupabaseAdmin();

        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .eq("id", "main")
            .single();

        if (error) {
            console.error("[Settings] Supabase error:", error.message);
            // Return default values if database fails
            return NextResponse.json({
                success: true,
                settings: {
                    aiChatMaintenance: true,
                    imageToolsMaintenance: true,
                    downloaderMaintenance: false,
                    contactEmail: "hello@naotica.studio",
                    githubUrl: "https://github.com",
                    instagramUrl: "https://instagram.com",
                },
            });
        }

        const settings = data as SettingsRow;

        return NextResponse.json({
            success: true,
            settings: {
                aiChatMaintenance: settings.ai_chat_maintenance,
                imageToolsMaintenance: settings.image_tools_maintenance,
                downloaderMaintenance: settings.downloader_maintenance,
                contactEmail: settings.contact_email,
                githubUrl: settings.github_url,
                instagramUrl: settings.instagram_url,
            },
        });
    } catch (error) {
        console.error("[Settings] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

// POST - Update settings in Supabase (admin only)
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
        const supabase = createSupabaseAdmin();

        // Build update object - only include fields that are provided
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        if (typeof body.aiChatMaintenance === "boolean") {
            updateData.ai_chat_maintenance = body.aiChatMaintenance;
        }
        if (typeof body.imageToolsMaintenance === "boolean") {
            updateData.image_tools_maintenance = body.imageToolsMaintenance;
        }
        if (typeof body.downloaderMaintenance === "boolean") {
            updateData.downloader_maintenance = body.downloaderMaintenance;
        }
        if (typeof body.contactEmail === "string") {
            updateData.contact_email = body.contactEmail;
        }
        if (typeof body.githubUrl === "string") {
            updateData.github_url = body.githubUrl;
        }
        if (typeof body.instagramUrl === "string") {
            updateData.instagram_url = body.instagramUrl;
        }

        const { data, error } = await supabase
            .from("settings")
            .update(updateData)
            .eq("id", "main")
            .select()
            .single();

        if (error) {
            console.error("[Settings] Supabase update error:", error.message);
            return NextResponse.json(
                { success: false, error: "Failed to update settings in database" },
                { status: 500 }
            );
        }

        const settings = data as SettingsRow;

        console.log("[Settings] Updated in database:", updateData);

        return NextResponse.json({
            success: true,
            settings: {
                aiChatMaintenance: settings.ai_chat_maintenance,
                imageToolsMaintenance: settings.image_tools_maintenance,
                downloaderMaintenance: settings.downloader_maintenance,
                contactEmail: settings.contact_email,
                githubUrl: settings.github_url,
                instagramUrl: settings.instagram_url,
            },
        });
    } catch (error) {
        console.error("[Settings] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
