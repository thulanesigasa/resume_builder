import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rbptech.co.za';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/home/', '/editor/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
