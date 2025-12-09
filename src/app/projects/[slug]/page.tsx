import React from 'react';
import { notFound } from 'next/navigation';
import DocPageClient from '@/components/docs/DocPageClient';

// Map slugs to GitHub raw URLs (Executive Summaries only)
const DOCS_MAP: Record<string, string> = {
    'aviators-training-centre-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-executive-summary.md',
    'omni-post-ai-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/main/Omni-Post-AI-Automation/OMNI-POST-AI-EXECUTIVE-SUMMARY.md',
};

// Map slugs to readable titles for metadata
const TITLES_MAP: Record<string, string> = {
    'aviators-training-centre-executive-summary': 'Aviators Training Centre - Executive Summary',
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
    const title = TITLES_MAP[slug] || 'Executive Summary';
    return {
        title: `${title} | Aman Suryavanshi`,
        description: `Executive summary for ${title}`,
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
