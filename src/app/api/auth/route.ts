import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Secure admin password (should be in env variables in production)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "naotica-admin-2024";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        if (password === ADMIN_PASSWORD) {
            // Set secure HTTP-only cookie
            const cookieStore = await cookies();
            cookieStore.set("admin_session", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { success: false, error: "Invalid password" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("[Auth] Error:", error);
        return NextResponse.json(
            { success: false, error: "Authentication failed" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("admin_session");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Auth] Logout error:", error);
        return NextResponse.json(
            { success: false, error: "Logout failed" },
            { status: 500 }
        );
    }
}
