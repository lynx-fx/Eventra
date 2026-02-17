import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("auth")?.value;
    const url = req.nextUrl.clone();

    const isAuthPage = url.pathname.startsWith("/auth") || url.pathname === "/admin/login";
    const isDashboardPage = url.pathname.startsWith("/dashboard");

    if (isAuthPage) {
        if (token) {
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
    }

    if (isDashboardPage) {
        if (!token) {
            url.pathname = "/auth/login";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*", "/admin/login"],
};