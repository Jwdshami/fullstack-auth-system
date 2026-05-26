// proxy.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export async function proxy(request: NextRequest) {  // ← renamed from "middleware"
    const path = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value || '';

    const publicPaths = path === "/login" || path === "/signUp" || path === "/verifyemail";

    if (!token && !publicPaths) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    if (token && publicPaths) {
        return NextResponse.redirect(new URL("/profile", request.nextUrl));
    }
}

export const config = {
    matcher: ["/", "/login", "/signUp", "/profile", "/verifyemail"],
};