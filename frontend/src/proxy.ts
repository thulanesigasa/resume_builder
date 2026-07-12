import { NextRequest, NextResponse } from "next/server";

// NOTE: This file must use the Web Crypto API (not Node.js 'crypto' module)
// because Next.js proxy/middleware runs in the Edge Runtime.

export function proxy(request: NextRequest) {
  // Generate a cryptographically secure nonce using the Web Crypto API
  // (available globally in the Edge Runtime)
  const nonce = crypto.randomUUID().replace(/-/g, "");

  // Strict Content-Security-Policy — no unsafe-inline, no unsafe-eval
  const csp = [
    `default-src 'self'`,
    // 'strict-dynamic' allows scripts loaded by nonce-bearing scripts to run,
    // which is required for Next.js chunk loading
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    `img-src 'self' blob: data: https://www.payfast.co.za https://sandbox.payfast.co.za`,
    `font-src 'self' data: https://fonts.gstatic.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self' https://www.payfast.co.za https://sandbox.payfast.co.za`,
    `frame-ancestors 'none'`,
    // Allow connections to Supabase (realtime + REST) and backend API
    `connect-src 'self' https://rbptech-backend.onrender.com wss://*.supabase.co https://*.supabase.co https://*.supabase.in`,
    `upgrade-insecure-requests`,
  ].join("; ");

  // Pass the nonce to layouts/pages via a request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Also set it on the response so browsers enforce it
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

// Run on all HTML page routes; skip static files and prefetch requests
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
