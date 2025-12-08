import React from 'react';
import { notFound } from 'next/navigation';
import DocPageClient from '@/components/docs/DocPageClient';

// Map slugs to GitHub raw URLs
const DOCS_MAP: Record<string, string> = {
    'aviators-training-centre-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-executive-summary.md',
    'aviators-training-centre-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-technical-documentation.md',
    'omni-post-ai-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/main/Omni-Post-AI-Automation/OMNI-POST-AI-EXECUTIVE-SUMMARY.md',
};

// Map slugs to readable titles for metadata or breadcrumbs
const TITLES_MAP: Record<string, string> = {
    'aviators-training-centre-executive-summary': 'Aviators Training Centre - Executive Summary',
    'aviators-training-centre-technical-documentation': 'Aviators Training Centre - Technical Documentation',
    'omni-post-ai-executive-summary': 'Omni-Post AI - Executive Summary',
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
    const title = TITLES_MAP[slug] || 'Documentation';
    return {
        title: `${title} | Aman Suryavanshi`,
        description: `Technical documentation for ${title}`,
    };
}

export default async function DocPage({ params }: PageProps) {
    const { slug } = await params;
    const content = await getDocContent(slug);

    if (!content) {
        notFound();
    }

    // Note: Project lookup is done in DocPageClient to avoid serialization issues
    // (project.technologies contains React component icons that can't be serialized)
    return <DocPageClient title={TITLES_MAP[slug]} content={content} slug={slug} />;
}
