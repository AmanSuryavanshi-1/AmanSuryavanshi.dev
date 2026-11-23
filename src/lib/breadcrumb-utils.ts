export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://amansuryavanshi.com').replace(/\/$/, '');

export interface DocBreadcrumbParams {
    projectShortTitle: string;
    docTitle: string;
    slug: string[];
}

/**
 * Builds Google Search Central compliant BreadcrumbList schema (1-indexed, canonical URLs, no fragment #)
 */
export function buildDocBreadcrumbJsonLd({ projectShortTitle, docTitle, slug }: DocBreadcrumbParams) {
    const canonicalUrl = `${SITE_URL}/docs/${slug.join('/')}`;

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": SITE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Projects",
                "item": `${SITE_URL}/projects`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": `${projectShortTitle}: ${docTitle}`,
                "item": canonicalUrl
            }
        ]
    };
}

/**
 * Builds BreadcrumbList schema for the Projects archive page (/projects)
 */
export function buildProjectsBreadcrumbJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": SITE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Projects",
                "item": `${SITE_URL}/projects`
            }
        ]
    };
}
