import { Metadata } from 'next';
import { buildProjectsBreadcrumbJsonLd, SITE_URL } from '@/lib/breadcrumb-utils';

export const metadata: Metadata = {
    title: "Projects | Aman Suryavanshi",
    description: "Explore my portfolio of AI automation projects, Next.js web apps, and system architectures. Case studies on generating revenue and reducing manual work.",
    alternates: {
        canonical: `${SITE_URL}/projects`,
    },
    openGraph: {
        title: "Projects | Aman Suryavanshi",
        description: "Explore my portfolio of AI automation projects, Next.js web apps, and system architectures.",
        url: `${SITE_URL}/projects`,
        images: [{
            url: `${SITE_URL}/og-image.png`,
            width: 1200,
            height: 630,
            alt: 'Aman Suryavanshi - AI Automation Projects Portfolio',
            type: 'image/png',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Projects | Aman Suryavanshi",
        description: "Explore my portfolio of AI automation projects, Next.js web apps, and system architectures.",
        images: [`${SITE_URL}/og-image.png`],
    },
};

const breadcrumbJsonLd = buildProjectsBreadcrumbJsonLd();

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
            />
            {children}
        </>
    );
}
