import { NextRequest, NextResponse } from "next/server";

// Service interface
interface Service {
    id: string;
    placeName: string;
    description: string;
    startYear: number;
    endYear: number | null; // null means "Now"/ongoing
    link: string | null;
    createdAt: string;
}

// In-memory services store (in production, use Supabase)
let services: Service[] = [
    {
        id: "1",
        placeName: "Freelance Developer",
        description: "Building web applications and tools for various clients",
        startYear: 2024,
        endYear: null, // Ongoing
        link: null,
        createdAt: new Date().toISOString(),
    },
];

// GET - Fetch all services
export async function GET() {
    // Sort by startYear descending (newest first)
    const sortedServices = [...services].sort((a, b) => b.startYear - a.startYear);

    return NextResponse.json({
        success: true,
        services: sortedServices,
        count: services.length,
    });
}

// POST - Add new service (admin only)
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
        if (!body.placeName || !body.startYear) {
            return NextResponse.json(
                { success: false, error: "Place name and start year are required" },
                { status: 400 }
            );
        }

        const newService: Service = {
            id: Date.now().toString(),
            placeName: body.placeName,
            description: body.description || "",
            startYear: parseInt(body.startYear),
            endYear: body.endYear ? parseInt(body.endYear) : null,
            link: body.link || null,
            createdAt: new Date().toISOString(),
        };

        services.push(newService);

        console.log("[Services] Added:", newService.placeName);

        return NextResponse.json({
            success: true,
            service: newService,
        });
    } catch (error) {
        console.error("[Services] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to add service" },
            { status: 500 }
        );
    }
}

// PUT - Update service (admin only)
export async function PUT(request: NextRequest) {
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

        if (!body.id) {
            return NextResponse.json(
                { success: false, error: "Service ID is required" },
                { status: 400 }
            );
        }

        const serviceIndex = services.findIndex(s => s.id === body.id);

        if (serviceIndex === -1) {
            return NextResponse.json(
                { success: false, error: "Service not found" },
                { status: 404 }
            );
        }

        // Update the service
        services[serviceIndex] = {
            ...services[serviceIndex],
            placeName: body.placeName || services[serviceIndex].placeName,
            description: body.description ?? services[serviceIndex].description,
            startYear: body.startYear ? parseInt(body.startYear) : services[serviceIndex].startYear,
            endYear: body.endYear === "" || body.endYear === null ? null : (body.endYear ? parseInt(body.endYear) : services[serviceIndex].endYear),
            link: body.link ?? services[serviceIndex].link,
        };

        console.log("[Services] Updated:", services[serviceIndex].placeName);

        return NextResponse.json({
            success: true,
            service: services[serviceIndex],
        });
    } catch (error) {
        console.error("[Services] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update service" },
            { status: 500 }
        );
    }
}

// DELETE - Remove service (admin only)
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
                { success: false, error: "Service ID is required" },
                { status: 400 }
            );
        }

        const initialLength = services.length;
        services = services.filter(s => s.id !== id);

        if (services.length === initialLength) {
            return NextResponse.json(
                { success: false, error: "Service not found" },
                { status: 404 }
            );
        }

        console.log("[Services] Deleted ID:", id);

        return NextResponse.json({
            success: true,
            message: "Service deleted",
        });
    } catch (error) {
        console.error("[Services] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete service" },
            { status: 500 }
        );
    }
}
