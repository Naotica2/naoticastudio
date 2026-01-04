import { NextRequest, NextResponse } from "next/server";

// In-memory projects store (in production, use Supabase)
let projects = [
    {
        id: "1",
        title: "Naotica Studio",
        description: "Personal portfolio website with integrated tools and services. Built with Next.js, Tailwind CSS, and TypeScript.",
        tags: ["Next.js", "TypeScript", "Tailwind"],
        category: "Web App",
        liveUrl: "/",
        githubUrl: "https://github.com",
        createdAt: new Date().toISOString(),
    },
];

// GET - Fetch all projects
export async function GET() {
    return NextResponse.json({
        success: true,
        projects,
        count: projects.length,
    });
}

// POST - Add new project (admin only)
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

        // Validate required fields
        if (!body.title) {
            return NextResponse.json(
                { success: false, error: "Title is required" },
                { status: 400 }
            );
        }

        const newProject = {
            id: Date.now().toString(),
            title: body.title,
            description: body.description || "",
            tags: body.tags || [],
            category: body.category || "Web App",
            liveUrl: body.liveUrl || null,
            githubUrl: body.githubUrl || null,
            createdAt: new Date().toISOString(),
        };

        projects.push(newProject);

        console.log("[Projects] Added:", newProject.title);

        return NextResponse.json({
            success: true,
            project: newProject,
        });
    } catch (error) {
        console.error("[Projects] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to add project" },
            { status: 500 }
        );
    }
}

// DELETE - Remove project (admin only)
export async function DELETE(request: NextRequest) {
    try {
        // Check admin session
        const isAdmin = request.cookies.get("admin_session")?.value === "authenticated";

        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Project ID is required" },
                { status: 400 }
            );
        }

        const initialLength = projects.length;
        projects = projects.filter(p => p.id !== id);

        if (projects.length === initialLength) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        console.log("[Projects] Deleted ID:", id);

        return NextResponse.json({
            success: true,
            message: "Project deleted",
        });
    } catch (error) {
        console.error("[Projects] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
