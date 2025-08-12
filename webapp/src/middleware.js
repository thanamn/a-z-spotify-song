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
  // Temporarily set CSP in report-only mode to avoid blocking essential assets while debugging
  response.headers.set(
    'Content-Security-Policy-Report-Only',
    [
      "default-src 'self'",
      // Next.js uses inline scripts for bootstrapping and sometimes eval in dev; allow https sources as well
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      // Allow styles and inline styles
      "style-src 'self' 'unsafe-inline' https:",
      // Images from self, data, blob, and https (e.g., Spotify images)
      "img-src 'self' data: blob: https:",
      // Fonts
      "font-src 'self' data: https:",
      // Allow API/WebSocket connections to same-origin and https endpoints
      "connect-src 'self' https: wss:",
      // Disallow framing
      "frame-ancestors 'none'",
      // Restrict base URI
      "base-uri 'self'",
    ].join('; ')
  );
  return response;
}

export const config = {
  // Run on all paths except Next.js internals and the favicon
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
};
