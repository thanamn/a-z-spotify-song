import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = new URL(request.url);
  const proto = request.headers.get('x-forwarded-proto');
  // Enforce HTTPS only if behind proxy indicates HTTP
  if (proto && proto !== 'https') {
    url.protocol = 'https:';
    return NextResponse.redirect(url.toString(), 308);
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';");
  return response;
}

export const config = {
  matcher: '/:path*',
};
