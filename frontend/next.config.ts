import type { NextConfig } from "next";

// Fallback static CSP — applied to /_next/static/** files and other static routes
// that are NOT processed by middleware. The nonce-based CSP for HTML pages is
// applied dynamically via src/middleware.ts.
//
// For static assets we can be very strict: no script execution needed at all.
const staticCsp = [
  `default-src 'self'`,
  `script-src 'none'`,
  `style-src 'self' https://fonts.googleapis.com`,
  `img-src 'self' blob: data: https://www.payfast.co.za https://sandbox.payfast.co.za`,
  `font-src 'self' data: https://fonts.gstatic.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["100.65.194.153", "10.251.84.215"],

  async headers() {
    return [
      {
        // Apply to all routes — middleware overrides this on HTML responses
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Strict static-asset headers (no inline scripts allowed here anyway)
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: staticCsp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
