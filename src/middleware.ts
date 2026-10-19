import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only apply basic auth to the /admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      // atob is available in Edge Runtime
      const [user, pwd] = atob(authValue).split(':');

      const expectedUser = 'yug';
      const expectedPwd = '12345678';

      if (user === expectedUser && pwd === expectedPwd) {
        return NextResponse.next();
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
