import React from 'react';
import { notFound } from 'next/navigation';
import DocPageClient from '@/components/docs/DocPageClient';
import { portfolioData } from '@/data/portfolio';

// Map slugs to GitHub raw URLs
const DOCS_MAP: Record<string, string> = {
    // Executive Summaries
    'aviators-training-centre-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-executive-summary.md',
    'omni-post-ai-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/main/Omni-Post-AI-Automation/OMNI-POST-AI-EXECUTIVE-SUMMARY.md',
    // Technical Documentation
    'aviators-training-centre-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-technical-documentation.md',
    'omni-post-ai-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/main/Omni-Post-AI-Automation/OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md',
    // Barkat Enterprise
    'barkat-enterprise-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/BarkatEnterprise/main/docs/BARKAT-ENTERPRISE-TECHNICAL-DOCUMENTATION.md',
    // AV News Stream
    'av-newsstream-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/AV-News-Stream/main/docs/AV-NEWSSTREAM-TECHNICAL-DOCUMENTATION.md',
};

// Map documentation slugs to Project IDs
const DOC_TO_PROJECT_ID: Record<string, string> = {
    'aviators-training-centre-executive-summary': 'aviators-training-centre',
    'aviators-training-centre-technical-documentation': 'aviators-training-centre',
    'omni-post-ai-executive-summary': 'n8n-automation-suite',
    'omni-post-ai-technical-documentation': 'n8n-automation-suite',
    'barkat-enterprise-technical-documentation': 'barkat-enterprise',
    'av-newsstream-technical-documentation': 'av-newsstream',
};

// Map slugs to readable titles for metadata
const TITLES_MAP: Record<string, string> = {
    // Executive Summaries
    'aviators-training-centre-executive-summary': 'Aviators Training Centre - Executive Summary',
    'omni-post-ai-executive-summary': 'Omni-Post AI - Executive Summary',
    // Technical Documentation
    'aviators-training-centre-technical-documentation': 'Aviators Training Centre - Technical Documentation',
    'omni-post-ai-technical-documentation': 'Omni-Post AI - Technical Documentation',
    'barkat-enterprise-technical-documentation': 'Barkat Enterprise - Technical Documentation',
    'av-newsstream-technical-documentation': 'AV News Stream - Technical Documentation',
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
    const projectId = DOC_TO_PROJECT_ID[slug];
    const project = portfolioData.projects.find(p => p.id === projectId);

    if (!content || !project) {
        notFound();
    }

    const { technologies, ...serializableProject } = project;

    return <DocPageClient project={serializableProject as any} content={content} slug={slug} />;
}
