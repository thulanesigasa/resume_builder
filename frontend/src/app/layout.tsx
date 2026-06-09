import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionTimeout from "@/components/SessionTimeout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        url: '/favicon.png', // We will need to add this image
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SessionTimeout />
        {children}
      </body>
    </html>
  );
}
