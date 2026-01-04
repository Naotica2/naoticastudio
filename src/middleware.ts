import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith("/naoticastudioadmin")) {
        const isAuthenticated = request.cookies.get("admin_session")?.value === "authenticated";

        // Allow access to login page
        if (pathname === "/naoticastudioadmin/login") {
            if (isAuthenticated) {
                return NextResponse.redirect(new URL("/naoticastudioadmin", request.url));
            }
            return NextResponse.next();
        }

        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/naoticastudioadmin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/naoticastudioadmin/:path*"],
};
