import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const config = {
    // Сужаем область действия — только реально приватные пути
    matcher: [
        "/dashboard/:path*",
        "/brands/:path*",
        "/news/:path*",
        "/partners/:path*",
        "/products/:path*",
        "/settings/:path*",
        "/translate/:path*",
    ],
}

export function middleware(req: NextRequest) {
    const url = req.nextUrl
    // Cookie, которые ставит Auth.js v5 при session: "jwt"
    const cookie = req.headers.get("cookie") || ""
    const hasSession =
        cookie.includes("__Secure-authjs.session-token=") ||
        cookie.includes("authjs.session-token=")

    if (!hasSession) {
        const redirectTo = new URL("/sign-in", url.origin)
        redirectTo.searchParams.set("callbackUrl", url.pathname + url.search)
        return NextResponse.redirect(redirectTo)
    }

    return NextResponse.next()
}
