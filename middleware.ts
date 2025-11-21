import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Route app.inflammai.com to /inflamm-ai
  if (hostname.startsWith('app.inflammai.com')) {
    // If user is on app subdomain but not on /inflamm-ai path, redirect them
    if (!url.pathname.startsWith('/inflamm-ai') && url.pathname === '/') {
      return NextResponse.redirect(new URL('/inflamm-ai', request.url));
    }
  }

  // Route inflammai.com to marketing homepage
  if (hostname === 'inflammai.com' || hostname === 'www.inflammai.com') {
    // If user tries to access /inflamm-ai on main domain, allow it
    // This keeps the app accessible at inflammai.com/inflamm-ai as well
    if (url.pathname.startsWith('/inflamm-ai')) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
