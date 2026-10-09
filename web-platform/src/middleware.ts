import NextAuth from "next-auth"
import { auth } from "@/auth"
import { caravanaNoAr } from "@/lib/caravana"

// páginas da caravana (os arquivos de imagem continuam acessíveis)
const PAGINAS_CARAVANA = ['/caravana', '/caravana/', '/caravana/index.html']

export default auth((req) => {
    // depois do evento, quem abrir o link da caravana cai na home
    if (PAGINAS_CARAVANA.includes(req.nextUrl.pathname) && !caravanaNoAr()) {
        return Response.redirect(new URL('/', req.nextUrl), 307)
    }

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
