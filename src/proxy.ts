import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Unified Proxy (Next.js 16)
 * Combines:
 * - Multi-domain vertical routing (quiz/horoscope)
 * - i18n locale redirects
 */
export function proxy(request: NextRequest) {
    const url = request.nextUrl
    const { pathname } = url
    const hostname = request.headers.get('host') || ''

    // 1. Skip static assets and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // 2. i18n: Check if path already has a locale prefix
    const hasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    // If no locale, redirect to default locale
    if (!hasLocale && !pathname.startsWith('/verticals')) {
        const redirectUrl = url.clone()
        redirectUrl.pathname = `/${defaultLocale}${pathname}`
        return NextResponse.redirect(redirectUrl)
    }

    // 3. Multi-domain vertical routing
    let vertical = 'quiz' // default

    if (hostname.includes('horoskop') || hostname.includes('horoscope')) {
        vertical = 'horoscope'
    }

    // Rewrite to vertical paths (but not if already in verticals, or excluded paths)
    const excludedPaths = [
        '/verticals',
        '/character',
        '/astrosheet',
        '/login',
        '/auth',
        '/onboarding',
    ]

    const shouldRewrite = !excludedPaths.some(p => pathname.startsWith(p)) &&
        !locales.some(l => pathname.startsWith(`/${l}/verticals`))

    if (shouldRewrite && !pathname.startsWith('/verticals')) {
        // Extract locale if present
        const localeMatch = locales.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)

        if (localeMatch) {
            const pathWithoutLocaleRaw = pathname.replace(`/${localeMatch}`, '') || '/'
            const pathWithoutLocale = pathWithoutLocaleRaw === '/' ? '' : pathWithoutLocaleRaw
            const newUrl = url.clone()
            newUrl.pathname = `/${localeMatch}/verticals/${vertical}${pathWithoutLocale}`
            return NextResponse.rewrite(newUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
