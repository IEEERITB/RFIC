import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only apply basic auth to the /admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');
    
    if (basicAuth) {
      try {
        const parts = basicAuth.split(' ');
        if (parts.length === 2 && parts[0].toLowerCase() === 'basic') {
          // atob is available in Edge Runtime
          const decoded = atob(parts[1]);
          const colonIndex = decoded.indexOf(':');
          if (colonIndex !== -1) {
            const user = decoded.substring(0, colonIndex);
            const pwd = decoded.substring(colonIndex + 1);

            const expectedUser = process.env.ADMIN_USERNAME || 'yug';
            const expectedPwd = process.env.ADMIN_PASSWORD || '12345678';

            if (user === expectedUser && pwd === expectedPwd) {
              return NextResponse.next();
            }
          }
        }
      } catch {
        // Malformed base64 or authorization header, continue to 401 challenge
      }
    }

    // Never send WWW-Authenticate header to background prefetch requests
    const isPrefetch =
      req.headers.get('purpose') === 'prefetch' ||
      req.headers.get('next-router-prefetch') === '1' ||
      req.headers.get('x-middleware-prefetch') === '1';

    if (isPrefetch) {
      return new NextResponse('Auth required', { status: 401 });
    }

    return new NextResponse('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
