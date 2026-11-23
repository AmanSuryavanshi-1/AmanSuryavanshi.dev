import { MetadataRoute } from 'next';
import { getAllDocs, getCanonicalDocSlug } from '@/lib/docs-engine';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amansuryavanshi.com';

    // Static pages
    const routes = [
        '',
        '/projects',
        '/blogs',
        '/about',
        // Add other static routes if any
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic Documentation pages (canonical 2-segment URLs without internal folder prefixes)
    let docsEntries: MetadataRoute.Sitemap = [];
    try {
        const docs = getAllDocs();
        docsEntries = docs.map((doc) => ({
            url: `${baseUrl}/docs/${getCanonicalDocSlug(doc).join('/')}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error("Failed to generate docs routes for sitemap:", error);
    }

    // Dynamic Blog pages from Sanity
    const postsQuery = `*[_type == "post" && defined(slug.current) && status == "published"] {
        "slug": slug.current,
        _updatedAt
    }`;

    // We need to import client dynamically or assume it works in this context
    // Since we can't easily import the client if it's not exported for edge/node specifically, 
    // we'll try to import it. If it fails, we fall back to empty array.
    // However, looking at the codebase, '@/sanity/lib/client' is available.

    let blogs: any[] = [];
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { client } = require('@/sanity/lib/client');
        const posts = await client.fetch(postsQuery);
        blogs = posts
            .map((post: any) => {
                const slug = typeof post.slug === 'string' ? post.slug : post.slug?.current;
                if (!slug) return null;
                return {
                    url: `${baseUrl}/blogs/${slug}`,
                    lastModified: new Date(post._updatedAt),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                };
            })
            .filter(Boolean);
    } catch (error) {
        console.error("Failed to fetch blog posts for sitemap:", error);
    }

    return [...routes, ...docsEntries, ...blogs];
}
