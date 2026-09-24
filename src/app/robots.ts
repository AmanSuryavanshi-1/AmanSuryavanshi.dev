import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amansuryavanshi.me';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/private/', '/api/admin/', '/drafts/'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'PerplexityBot',
                    'ClaudeBot',
                    'CCBot',
                    'Google-Extended',
                    'Amazonbot',
                    'FacebookBot',
                    'Bytespider',
                    'Google-InspectionTool'
                ],
                allow: ['/', '/projects/', '/blogs/', '/docs/', '/llms.txt', '/llms-full.txt'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
