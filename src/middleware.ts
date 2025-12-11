import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // simple domain detection
    let vertical = 'quiz' // default

    if (hostname.includes('horoskop') || hostname.includes('horoscope')) {
        vertical = 'horoscope'
    }

    // Prevent rewrite loops and exclude statics
    if (
        !url.pathname.startsWith('/verticals') &&
        !url.pathname.startsWith('/_next') &&
        !url.pathname.startsWith('/api') &&
        !url.pathname.includes('.') // exclude files
    ) {
        const newUrl = url.clone()
        newUrl.pathname = `/verticals/${vertical}${url.pathname}`
        return NextResponse.rewrite(newUrl)
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
