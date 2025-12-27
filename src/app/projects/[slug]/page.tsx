import React from 'react';
import { notFound } from 'next/navigation';
import DocPageClient from '@/components/docs/DocPageClient';

// Map slugs to GitHub raw URLs
const DOCS_MAP: Record<string, string> = {
    // Executive Summaries
    'aviators-training-centre-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-executive-summary.md',
    'omni-post-ai-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/main/Omni-Post-AI-Automation/OMNI-POST-AI-EXECUTIVE-SUMMARY.md',
    // Technical Documentation
    'aviators-training-centre-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-technical-documentation.md',
    'omni-post-ai-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/main/Omni-Post-AI-Automation/OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md',
};

// Map slugs to readable titles for metadata
const TITLES_MAP: Record<string, string> = {
    // Executive Summaries
    'aviators-training-centre-executive-summary': 'Aviators Training Centre - Executive Summary',
    'omni-post-ai-executive-summary': 'Omni-Post AI - Executive Summary',
    // Technical Documentation
    'aviators-training-centre-technical-documentation': 'Aviators Training Centre - Technical Documentation',
    'omni-post-ai-technical-documentation': 'Omni-Post AI - Technical Documentation',
};

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getDocContent(slug: string) {
    const url = DOCS_MAP[slug];
    if (!url) return null;

    try {
        const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
        if (!res.ok) throw new Error('Failed to fetch document');
        return await res.text();
    } catch (error) {
        console.error('Error fetching document:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const title = TITLES_MAP[slug] || 'Project Documentation';
    const isExecutiveSummary = slug.includes('executive-summary');
    const projectName = title.split(' - ')[0];

    const description = isExecutiveSummary
        ? `Executive summary and business impact analysis for ${projectName}. Key metrics, architecture decisions, and results.`
        : `Comprehensive technical documentation for ${projectName}. In-depth architecture, implementation details, and code examples.`;

    return {
        title: `${title} | Aman Suryavanshi Portfolio`,
        description,
        keywords: ['portfolio', 'case study', 'technical documentation', projectName, 'Aman Suryavanshi'],
        openGraph: {
            title: title,
            description,
            type: 'article',
        },
    };
}

export default async function ProjectDocPage({ params }: PageProps) {
    const { slug } = await params;
    const content = await getDocContent(slug);

    if (!content) {
        notFound();
    }

    return <DocPageClient title={TITLES_MAP[slug]} content={content} slug={slug} />;
}
