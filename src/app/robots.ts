import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.amansuryavanshi.dev';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/private/', '/api/admin/'], // illustrative disallows
            },
            {
                userAgent: ['GPTBot', 'PerplexityBot', 'Google-InspectionTool'],
                allow: ['/', '/projects/', '/blogs/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
