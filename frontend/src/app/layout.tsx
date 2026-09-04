import type { Metadata } from "next";
import "./globals.css";
import SessionTimeout from "@/components/SessionTimeout";
import ScrollToTopBottom from "@/components/ScrollToTopBottom";
import { headers } from "next/headers";

const geistSans = {
  variable: "geist-sans",
};

const geistMono = {
  variable: "geist-mono",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rbptech.co.za'),
  title: "rbptech | Next-Gen AI Resume Compiler",
  description: "Scan target job requirements, tailor CV experience bullet points on the fly, audit ATS keyword scores, and compile print-ready PDFs instantly.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'rbptech | Next-Gen AI Resume Compiler',
    description: 'Scan target job requirements, tailor CV experience bullet points on the fly, audit ATS keyword scores, and compile print-ready PDFs instantly.',
    url: 'https://rbptech.co.za',
    siteName: 'rbptech',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 630,
        alt: 'rbptech Resume Builder Preview',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'rbptech | Next-Gen AI Resume Compiler',
    description: 'Scan target job requirements, tailor CV experience bullet points on the fly, and compile print-ready PDFs instantly.',
    images: ['/favicon.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the nonce injected by proxy.ts so the JSON-LD inline script is
  // allowed by the Content-Security-Policy without needing 'unsafe-inline'.
  const nonce = (await headers()).get("x-nonce") ?? "";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "rbptech",
    "url": process.env.NEXT_PUBLIC_APP_URL || 'https://rbptech.co.za',
    "logo": "https://rbptech.co.za/favicon.ico",
    "image": "https://rbptech.co.za/favicon.png",
    "description": "Next-Gen AI Resume Compiler"
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Nonce passed here so the CSP allows this inline script */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SessionTimeout />
        <ScrollToTopBottom />
        {children}
      </body>
    </html>
  );
}
