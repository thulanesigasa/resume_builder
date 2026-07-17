import { NextRequest, NextResponse } from "next/server";

// NOTE: This file uses the Web Crypto API (not Node.js 'crypto' module)
// because Next.js proxy/middleware runs in the Edge Runtime.

const isDev = process.env.NODE_ENV === "development";

export function proxy(request: NextRequest) {
  let csp: string;

  if (isDev) {
    // ─── Development: relaxed CSP ────────────────────────────────────────────
    // Next.js HMR, error overlays, and React DevTools all inject inline scripts
    // that cannot carry a nonce. We allow unsafe-inline only in dev so that
    // the local dev server works normally. This policy NEVER ships to production.
    csp = [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `img-src 'self' blob: data: https://www.payfast.co.za https://sandbox.payfast.co.za`,
      `font-src 'self' data: https://fonts.gstatic.com`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self' https://www.payfast.co.za https://sandbox.payfast.co.za`,
      `frame-ancestors 'none'`,
      `connect-src 'self' http://localhost:8000 ws://localhost:* wss://*.supabase.co https://*.supabase.co https://*.supabase.in`,
    ].join("; ");

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Content-Security-Policy", csp);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  // ─── Production: strict nonce-based CSP ────────────────────────────────────
  // A fresh nonce is generated per request. 'strict-dynamic' lets Next.js load
  // its own JS chunks (which are trusted because they are loaded by a
  // nonce-bearing script). No unsafe-inline or unsafe-eval.
  const nonce = crypto.randomUUID().replace(/-/g, "");

  csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    `img-src 'self' blob: data: https://www.payfast.co.za https://sandbox.payfast.co.za`,
    `font-src 'self' data: https://fonts.gstatic.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self' https://www.payfast.co.za https://sandbox.payfast.co.za`,
    `frame-ancestors 'none'`,
    `connect-src 'self' https://rbptech-backend.onrender.com wss://*.supabase.co https://*.supabase.co https://*.supabase.in`,
    `upgrade-insecure-requests`,
  ].join("; ");

  // Pass the nonce to the layout via a request header so it can be applied
  // to inline <script> tags (e.g. the JSON-LD schema block in layout.tsx).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

// Run on all HTML page routes; skip static assets and prefetch requests
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
