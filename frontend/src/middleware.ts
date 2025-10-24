import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/src/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathWithoutLocale = pathname.replace(/^\/(tr|en)(\/|$)/, '/');

    const isAdminRoute =
        pathWithoutLocale === '/admin' ||
        pathWithoutLocale.startsWith('/admin/') ||
        pathWithoutLocale === '/login' ||
        pathWithoutLocale === '/register' ||
        pathWithoutLocale === '/dashboard' ||
        pathWithoutLocale.startsWith('/dashboard/') ||
        pathWithoutLocale === '/pages' ||
        pathWithoutLocale.startsWith('/pages/') ||
        pathWithoutLocale === '/media' ||
        pathWithoutLocale.startsWith('/media/') ||
        pathWithoutLocale === '/settings' ||
        pathWithoutLocale.startsWith('/settings/') ||
        pathWithoutLocale === '/layout' ||
        pathWithoutLocale.startsWith('/layout/') ||
        pathWithoutLocale === '/home' ||
        pathWithoutLocale.startsWith('/home/');

    if (isAdminRoute) {
        const token = request.cookies.get('token')?.value ?? null;

        if ((pathWithoutLocale === '/login' ||
            pathWithoutLocale === '/register' ||
            pathWithoutLocale === '/admin/login' ||
            pathWithoutLocale === '/admin/register') && token) {
            const localeMatch = pathname.match(/^\/(tr|en)(\/|$)/);
            const localePrefix = localeMatch ? `/${localeMatch[1]}` : '';
            return NextResponse.redirect(new URL(`${localePrefix}/dashboard`, request.url));
        }

        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/login',
        '/register',
        '/dashboard/:path*',
        '/pages/:path*',
        '/media/:path*',
        '/settings/:path*',
        '/home/:path*',
        '/layout/:path*',
        '/((?!login|register|dashboard|pages|media|settings|home|admin|layout|api|_next|_vercel|.*\\..*).*)',
        '/',
        '/(tr|en)/:path*',
    ],
};