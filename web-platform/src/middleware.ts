import NextAuth from "next-auth"
import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')
    const isOnLogin = req.nextUrl.pathname.startsWith('/admin/login')

    if (isOnAdmin && !isOnLogin) {
        if (!isLoggedIn) {
            return Response.redirect(new URL('/admin/login', req.nextUrl))
        }
        return
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
