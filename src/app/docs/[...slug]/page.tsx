import React from 'react';
import { notFound } from 'next/navigation';
import { getAllDocs, getCanonicalDocSlug, getDocBySlug, getDocsByProjectId } from '@/lib/docs-engine';
import { portfolioData } from '@/data/portfolio';
import DocPageClient from '@/components/docs/DocPageClient';
import { Metadata } from 'next';
import { buildDocBreadcrumbJsonLd, SITE_URL } from '@/lib/breadcrumb-utils';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateStaticParams() {
    const docs = getAllDocs();
    const params: { slug: string[] }[] = [];

    docs.forEach(doc => {
        // Physical full slug (e.g. ['projects', 'clientele', 'aviators-training-centre', 'executive-summary'])
        params.push({ slug: doc.slug });

        // Short clean slug (e.g. ['aviators-training-centre', 'executive-summary'])
        const projectSlug = doc.meta.projectId || (doc.slug.length >= 2 ? doc.slug[doc.slug.length - 2] : '');
        const docSlug = doc.slug[doc.slug.length - 1];
        if (projectSlug && docSlug) {
            params.push({ slug: [projectSlug, docSlug] });
        }
    });

    const seen = new Set<string>();
    return params.filter(p => {
        const key = p.slug.join('/');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
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
    const canonicalSlug = getCanonicalDocSlug(doc);
    const canonicalUrl = `${SITE_URL}/docs/${canonicalSlug.join('/')}`;
    const project = portfolioData.projects.find(p => p.id === meta.projectId);
    const projectImage = project?.imageUrl || project?.image || '/og-image.png';

    return {
        title: `${meta.title} | Aman Suryavanshi`,
        description: meta.seoDescription,
        keywords: meta.keywords || ['Aman Suryavanshi', 'Documentation', 'Portfolio'],
        authors: [{ name: 'Aman Suryavanshi', url: SITE_URL }],
        creator: 'Aman Suryavanshi',
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: meta.title,
            description: meta.seoDescription,
            type: 'article',
            authors: ['Aman Suryavanshi — AI Workflow Architect'],
            url: canonicalUrl,
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

    const { technologies: _technologies, ...serializableProject } = project;

    const canonicalSlug = getCanonicalDocSlug(doc);
    const canonicalUrl = `${SITE_URL}/docs/${canonicalSlug.join('/')}`;
    const projectShortTitle = serializableProject.title.split(':')[0].trim();
    const docCleanTitle = meta.title.replace(/^\d+\.\s*/, '');
    const isTechnicalDoc = slug.join('-').includes('technical') || meta.title.toLowerCase().includes('technical');
    const docCategory = meta.type === 'series'
        ? 'Series Documentation'
        : (isTechnicalDoc || meta.type === 'technical-documentation')
            ? 'Technical Documentation'
            : 'Executive Summary';

    // Build the specific JSON-LD schemas
    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": meta.schemaType || 'Article',
        "name": meta.title,
        "headline": meta.title,
        "description": meta.seoDescription,
        "author": { "@type": "Person", "name": "Aman Suryavanshi", "url": SITE_URL },
        "publisher": { 
            "@type": "Organization", 
            "name": "Aman Suryavanshi Portfolio",
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/Profile/Logo.webp`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
        }
    };

    // Google Search Central compliant BreadcrumbList schema (1-indexed, canonical URLs, no fragment #)
    const breadcrumbJsonLd = buildDocBreadcrumbJsonLd({
        projectShortTitle,
        docTitle: meta.title,
        slug: canonicalSlug
    });

    // Populate multiDocs for all projects with multiple documentation files
    const projectDocs = getDocsByProjectId(meta.projectId);
    let multiDocs: { id: string; title: string; href: string }[] | undefined;
    if (projectDocs.length > 1) {
        multiDocs = projectDocs.map(d => {
            let label = d.meta.title;
            if (d.meta.type === 'series') {
                label = d.meta.title.replace(/^\d+\.\s*/, '');
            } else if (d.slug[d.slug.length - 1].includes('technical') || d.meta.type === 'technical-documentation') {
                label = 'Technical Documentation';
            } else if (d.slug[d.slug.length - 1].includes('executive') || d.meta.type === 'executive-summary') {
                label = 'Executive Summary';
            }
            return {
                id: d.slug[d.slug.length - 1],
                title: label,
                href: `/docs/${getCanonicalDocSlug(d).join('/')}`
            };
        });
    }

    // Keep project.title as the genuine project entity; use meta.seoDescription for series tagline
    const displayProject: Omit<typeof project, 'technologies'> = {
        ...serializableProject,
        tagLine: meta.type === 'series' ? meta.seoDescription : serializableProject.tagLine
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
            />
            <DocPageClient 
                project={displayProject} 
                content={content} 
                slug={slug.join('-')} 
                multiDocs={multiDocs}
                currentDocId={slug[slug.length - 1]}
                docTitle={meta.title}
                docCleanTitle={docCleanTitle}
                projectShortTitle={projectShortTitle}
                docCategory={docCategory}
                docType={meta.type}
            />
        </>
    );
}
