import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

// Watchlist item interface matching database schema
interface WatchlistRow {
    id: string;
    title: string;
    type: "movie" | "series";
    genre: string | null;
    year: number | null;
    rating: number | null;
    recommended: boolean;
    poster_url: string | null;
    notes: string | null;
    display_order: number;
    created_at: string;
    updated_at: string;
}

// Transform database row to API format
function transformWatchlistItem(row: WatchlistRow) {
    return {
        id: row.id,
        title: row.title,
        type: row.type,
        genre: row.genre,
        year: row.year,
        rating: row.rating,
        recommended: row.recommended,
        posterUrl: row.poster_url,
        notes: row.notes,
        createdAt: row.created_at,
    };
}

// GET - Fetch all watchlist items from Supabase
export async function GET() {
    try {
        const supabase = createSupabaseAdmin();

        const { data, error } = await supabase
            .from("watchlist")
            .select("*")
            .order("recommended", { ascending: false })
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[Watchlist] Supabase error:", error.message);
            return NextResponse.json({
                success: true,
                watchlist: [],
                count: 0,
            });
        }

        const watchlist = (data as WatchlistRow[]).map(transformWatchlistItem);

        return NextResponse.json({
            success: true,
            watchlist,
            count: watchlist.length,
        });
    } catch (error) {
        console.error("[Watchlist] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch watchlist" },
            { status: 500 }
        );
    }
}

// POST - Add new watchlist item to Supabase (admin only)
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

        const supabase = createSupabaseAdmin();

        const { data, error } = await supabase
            .from("watchlist")
            .insert({
                title: body.title,
                type: body.type || "movie",
                genre: body.genre || null,
                year: body.year ? parseInt(body.year) : null,
                rating: body.rating ? parseFloat(body.rating) : null,
                recommended: body.recommended || false,
                poster_url: body.posterUrl || null,
                notes: body.notes || null,
            })
            .select()
            .single();

        if (error) {
            console.error("[Watchlist] Supabase insert error:", error.message);
            return NextResponse.json(
                { success: false, error: "Failed to add watchlist item to database" },
                { status: 500 }
            );
        }

        const newItem = transformWatchlistItem(data as WatchlistRow);

        console.log("[Watchlist] Added to database:", newItem.title);

        return NextResponse.json({
            success: true,
            item: newItem,
        });
    } catch (error) {
        console.error("[Watchlist] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to add watchlist item" },
            { status: 500 }
        );
    }
}

// PUT - Update watchlist item in Supabase (admin only)
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
                { success: false, error: "Watchlist item ID is required" },
                { status: 400 }
            );
        }

        const supabase = createSupabaseAdmin();

        // Build update object
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        if (body.title) updateData.title = body.title;
        if (body.type) updateData.type = body.type;
        if (body.genre !== undefined) updateData.genre = body.genre || null;
        if (body.year !== undefined) updateData.year = body.year ? parseInt(body.year) : null;
        if (body.rating !== undefined) updateData.rating = body.rating ? parseFloat(body.rating) : null;
        if (typeof body.recommended === "boolean") updateData.recommended = body.recommended;
        if (body.posterUrl !== undefined) updateData.poster_url = body.posterUrl || null;
        if (body.notes !== undefined) updateData.notes = body.notes || null;

        const { data, error } = await supabase
            .from("watchlist")
            .update(updateData)
            .eq("id", body.id)
            .select()
            .single();

        if (error) {
            console.error("[Watchlist] Supabase update error:", error.message);
            if (error.code === "PGRST116") {
                return NextResponse.json(
                    { success: false, error: "Watchlist item not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { success: false, error: "Failed to update watchlist item in database" },
                { status: 500 }
            );
        }

        const updatedItem = transformWatchlistItem(data as WatchlistRow);

        console.log("[Watchlist] Updated in database:", updatedItem.title);

        return NextResponse.json({
            success: true,
            item: updatedItem,
        });
    } catch (error) {
        console.error("[Watchlist] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update watchlist item" },
            { status: 500 }
        );
    }
}

// DELETE - Remove watchlist item from Supabase (admin only)
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
                { success: false, error: "Watchlist item ID is required" },
                { status: 400 }
            );
        }

        const supabase = createSupabaseAdmin();

        const { error } = await supabase
            .from("watchlist")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("[Watchlist] Supabase delete error:", error.message);
            return NextResponse.json(
                { success: false, error: "Failed to delete watchlist item from database" },
                { status: 500 }
            );
        }

        console.log("[Watchlist] Deleted from database ID:", id);

        return NextResponse.json({
            success: true,
            message: "Watchlist item deleted",
        });
    } catch (error) {
        console.error("[Watchlist] Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete watchlist item" },
            { status: 500 }
        );
    }
}
