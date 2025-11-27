import React from 'react';
import { notFound } from 'next/navigation';
import MarkdownViewer from '@/components/docs/MarkdownViewer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Map slugs to GitHub raw URLs
const DOCS_MAP: Record<string, string> = {
    'aviators-training-centre-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-executive-summary.md',
    'aviators-training-centre-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-technical-documentation.md',
};

// Map slugs to readable titles for metadata or breadcrumbs
const TITLES_MAP: Record<string, string> = {
    'aviators-training-centre-executive-summary': 'Aviators Training Centre - Executive Summary',
    'aviators-training-centre-technical-documentation': 'Aviators Training Centre - Technical Documentation',
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

    return (
        <main className="min-h-screen bg-forest-950 text-forest-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/projects"
                        className="inline-flex items-center text-lime-400 hover:text-lime-300 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Projects
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {TITLES_MAP[slug]}
                    </h1>
                    <div className="h-1 w-20 bg-lime-500 rounded-full"></div>
                </div>

                <div className="bg-forest-900/30 rounded-xl p-6 md:p-10 border border-forest-800/50 shadow-xl backdrop-blur-sm">
                    <MarkdownViewer content={content} />
                </div>
            </div>
        </main>
    );
}
