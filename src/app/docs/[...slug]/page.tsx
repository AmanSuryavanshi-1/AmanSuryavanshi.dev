import React from 'react';
import { notFound } from 'next/navigation';
import { getAllDocs, getDocBySlug, getDocsByProjectId } from '@/lib/docs-engine';
import { portfolioData } from '@/data/portfolio';
import DocPageClient from '@/components/docs/DocPageClient';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateStaticParams() {
    const docs = getAllDocs();
    return docs.map((doc) => ({
        slug: doc.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const doc = getDocBySlug(slug);

    if (!doc) {
        return {
            title: 'Document Not Found',
        };
    }

    const { meta } = doc;
    const project = portfolioData.projects.find(p => p.id === meta.projectId);
    const projectImage = project?.imageUrl || project?.image || '/og-image.png';

    return {
        title: `${meta.title} | Aman Suryavanshi`,
        description: meta.seoDescription,
        keywords: meta.keywords || ['Aman Suryavanshi', 'Documentation', 'Portfolio'],
        authors: [{ name: 'Aman Suryavanshi', url: 'https://amansuryavanshi.me' }],
        creator: 'Aman Suryavanshi',
        alternates: {
            canonical: `https://amansuryavanshi.me/docs/${slug.join('/')}`,
        },
        openGraph: {
            title: meta.title,
            description: meta.seoDescription,
            type: 'article',
            authors: ['Aman Suryavanshi — AI Workflow Architect'],
            url: `https://amansuryavanshi.me/docs/${slug.join('/')}`,
            siteName: 'Aman Suryavanshi Portfolio',
            locale: 'en_US',
            images: [{
                url: projectImage,
                width: 1200,
                height: 630,
                alt: meta.title,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.title,
            description: meta.seoDescription,
            creator: '@_AmanSurya',
            images: [projectImage],
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    };
}

export default async function DocsPage({ params }: PageProps) {
    const { slug } = await params;
    const doc = getDocBySlug(slug);

    if (!doc) {
        notFound();
    }

    const { meta, content } = doc;
    const project = portfolioData.projects.find(p => p.id === meta.projectId);

    if (!project) {
        // Fallback if project is missing, though unlikely in a properly configured codebase
        return <div>Project not found for document</div>;
    }

    const { technologies, ...serializableProject } = project;

    // Build the specific JSON-LD schemas
    const jsonLd: any = {
        "@context": "https://schema.org",
        "@type": meta.schemaType || 'Article',
        "name": meta.title,
        "headline": meta.title,
        "description": meta.seoDescription,
        "author": { "@type": "Person", "name": "Aman Suryavanshi", "url": "https://amansuryavanshi.me" },
        "publisher": { 
            "@type": "Organization", 
            "name": "Aman Suryavanshi Portfolio",
            "logo": {
                "@type": "ImageObject",
                "url": "https://amansuryavanshi.me/Profile/Logo.webp"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://amansuryavanshi.me/docs/${slug.join('/')}`
        }
    };

    // If it's a series like OmniPost, we need to pass `multiDocs` for the sidebar.
    let multiDocs: { id: string; title: string }[] | undefined;
    if (meta.type === 'series') {
        const seriesDocs = getDocsByProjectId(meta.projectId);
        multiDocs = seriesDocs.map(d => ({
            id: d.slug[d.slug.length - 1], // Just the final filename segment like "01-executive-summary"
            title: d.meta.title
        }));
    }

    // Overwrite the title and tagline for series docs (like OmniPost) so the header renders nicely
    const displayProject = {
        ...serializableProject,
        title: meta.type === 'series' ? meta.title : serializableProject.title,
        tagLine: meta.type === 'series' ? meta.seoDescription : serializableProject.tagLine
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DocPageClient 
                project={displayProject as any} 
                content={content} 
                slug={slug.join('-')} 
                multiDocs={multiDocs}
                currentDocId={slug[slug.length - 1]}
            />
        </>
    );
}
