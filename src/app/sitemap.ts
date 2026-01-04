import { MetadataRoute } from 'next';
import { portfolioData } from '@/data/portfolio';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amansuryavanshi.me';

    // Static pages
    const routes = [
        '',
        '/projects',
        '/blogs',
        // Add other static routes if any
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic Project pages
    const projects = portfolioData.projects.map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(), // Ideally this comes from the project data/CMS
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Dynamic Blog pages (if you have blog data source, map it here)
    // Assuming blog data matches a similar structure or fetching it:
    // const blogs = blogData.map((blog) => ({ ... }));

    return [...routes, ...projects];
}
