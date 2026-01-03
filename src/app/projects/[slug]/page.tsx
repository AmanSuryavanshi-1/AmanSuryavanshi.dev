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
    'foodah-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Foodah/main/docs/FOODAH-TECHNICAL-DOCUMENTATION.md',
};

// Map documentation slugs to Project IDs
const DOC_TO_PROJECT_ID: Record<string, string> = {
    'aviators-training-centre-executive-summary': 'aviators-training-centre',
    'aviators-training-centre-technical-documentation': 'aviators-training-centre',
    'omni-post-ai-executive-summary': 'n8n-automation-suite',
    'omni-post-ai-technical-documentation': 'n8n-automation-suite',
    'barkat-enterprise-technical-documentation': 'barkat-enterprise',
    'av-newsstream-technical-documentation': 'av-newsstream',
    'foodah-technical-documentation': 'foodah',
};

// Map slugs to readable titles for metadata - Business Transformation framing
const TITLES_MAP: Record<string, string> = {
    // Executive Summaries → Business Transformation titles
    'aviators-training-centre-executive-summary': 'Aviators: How I Used n8n + Next.js to Generate ₹300K ($3.5K+) in Revenue',
    'omni-post-ai-executive-summary': 'Omni-Post AI: How I Built a 74-Node Workflow That Reduced Manual Work by 80%',
    // Technical Documentation → Architecture deep-dives
    'aviators-training-centre-technical-documentation': 'Aviators Architecture: Self-Healing n8n, Firebase, and Production Workflows',
    'omni-post-ai-technical-documentation': 'Omni-Post AI Architecture: Multi-LLM Orchestration with n8n and GPT-4',
    'barkat-enterprise-technical-documentation': 'Barkat Enterprise: React E-Commerce with 3,000+ Viewers & 60+ Leads',
    'av-newsstream-technical-documentation': 'AV NewsStream: API Key Rotation System Handling 300+ Requests/Day',
    'foodah-technical-documentation': 'Foodah: 40% Load Time Reduction with Custom React Hooks',
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
    const projectId = DOC_TO_PROJECT_ID[slug];

    // Client-focused descriptions with metrics
    const description = isExecutiveSummary
        ? `Business transformation case study. See how I used n8n, LangGraph, and Next.js to deliver measurable results: ₹300K revenue, 80% automation, 40K+ impressions.`
        : `Technical deep-dive into production architecture. Self-healing workflows, deterministic state management, Dead-Letter Queues, and deployment strategies.`;

    // Project-specific keywords for high-intent searches
    const projectKeywords: Record<string, string[]> = {
        'aviators-training-centre': ['n8n automation case study', 'Next.js SEO results', '₹300K revenue automation', 'aviation SaaS'],
        'n8n-automation-suite': ['content automation workflow', 'multi-LLM orchestration', 'n8n GPT-4 integration', '74-node workflow'],
        'barkat-enterprise': ['React e-commerce India', 'B2B tiles website', 'PDF catalogue integration'],
        'av-newsstream': ['API key rotation', 'news aggregator architecture', 'rate limit handling'],
        'foodah': ['React performance optimization', 'custom hooks architecture', 'lazy loading implementation'],
    };

    return {
        title: `${title} | Aman Suryavanshi`,
        description,
        keywords: [
            'n8n case study',
            'AI automation results',
            'self-healing workflows',
            '₹300K revenue impact',
            ...(projectKeywords[projectId || ''] || ['portfolio', 'case study'])
        ],
        openGraph: {
            title,
            description,
            type: 'article',
            authors: ['Aman Suryavanshi — AI Workflow Architect'],
        },
    };
}

// HowTo schema for technical documentation (ranks for "How to build" queries)
const HOWTO_SCHEMAS: Record<string, object> = {
    'aviators-training-centre-technical-documentation': {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Build a Self-Healing n8n Automation System",
        "description": "Step-by-step guide to building production n8n workflows with Dead-Letter Queues, automatic retries, and health monitoring.",
        "step": [
            { "@type": "HowToStep", "name": "Setup n8n with Docker", "text": "Configure self-hosted n8n using Docker Compose with PostgreSQL for persistence." },
            { "@type": "HowToStep", "name": "Configure Dead-Letter Queues", "text": "Implement DLQ pattern for failed executions with automatic retry logic." },
            { "@type": "HowToStep", "name": "Add Health Monitoring", "text": "Set up Telegram/Slack notifications for real-time workflow health alerts." },
            { "@type": "HowToStep", "name": "Connect to Firebase", "text": "Integrate Firebase triggers for real-time data sync and event processing." }
        ],
        "totalTime": "PT4H"
    },
    'omni-post-ai-technical-documentation': {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Build a Multi-LLM Content Automation Pipeline",
        "description": "Architecture guide for building a 74-node n8n workflow with GPT-4 integration for multi-platform content distribution.",
        "step": [
            { "@type": "HowToStep", "name": "Design Node Architecture", "text": "Structure the workflow into content ingestion, AI processing, and distribution phases." },
            { "@type": "HowToStep", "name": "Integrate Multi-LLM Routing", "text": "Connect OpenAI GPT-4 with fallback to Claude for intelligent content generation." },
            { "@type": "HowToStep", "name": "Configure OAuth2 APIs", "text": "Set up authenticated connections to LinkedIn and Twitter/X for automated publishing." },
            { "@type": "HowToStep", "name": "Implement Error Recovery", "text": "Add retry logic, dead-letter queues, and notification systems for failure handling." }
        ],
        "totalTime": "PT6H"
    },
    'barkat-enterprise-technical-documentation': {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Build a B2B E-Commerce Catalogue with React",
        "description": "Technical guide on building a high-performance React application for browsing 3000+ tile products with PDF integration.",
        "step": [
            { "@type": "HowToStep", "name": "Setup Product Schema", "text": "Define structured JSON data for tile categories, dimensions, and finish types." },
            { "@type": "HowToStep", "name": "Implement PDF Viewer", "text": "Integrate a lightweight PDF viewer for rendering digital product catalogues directly in the browser." },
            { "@type": "HowToStep", "name": "Optimize Image Loading", "text": "Implement lazy loading and blur-up placeholders for grid views containing hundreds of product images." },
            { "@type": "HowToStep", "name": "Deploy to Vercel", "text": "Configure build pipelines and CDN caching for optimal delivery in the Indian market." }
        ],
        "totalTime": "PT12H"
    },
    'av-newsstream-technical-documentation': {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Implement API Key Rotation for High-Volume Scraping",
        "description": "Strategies for handling rate limits and ensuring 100% uptime when aggregating news from multiple restricted APIs.",
        "step": [
            { "@type": "HowToStep", "name": "Design Rotation Logic", "text": "Create a round-robin algorithm to cycle through a pool of available API keys." },
            { "@type": "HowToStep", "name": "Handle Rate Limit Headers", "text": "Parse 'X-RateLimit-Remaining' headers to preemptively switch keys before exhaustion." },
            { "@type": "HowToStep", "name": "Implement Caching Layer", "text": "Use Redis or in-memory caching to serve repeated requests without hitting the upstream API." }
        ],
        "totalTime": "PT5H"
    },
    'foodah-technical-documentation': {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Reduce React App Load Time by 40%",
        "description": "Performance optimization guide using custom hooks, code splitting, and memoization strategies.",
        "step": [
            { "@type": "HowToStep", "name": "Audit Bundle Size", "text": "Use webpack-bundle-analyzer to identify large dependencies and unnecessary code." },
            { "@type": "HowToStep", "name": "Refactor with Custom Hooks", "text": "Extract complex logic into reusable hooks to prevent unnecessary re-renders." },
            { "@type": "HowToStep", "name": "Implement Code Splitting", "text": "Use React.lazy and Suspense to load route components only when needed." }
        ],
        "totalTime": "PT8H"
    }
};

export default async function ProjectDocPage({ params }: PageProps) {
    const { slug } = await params;
    const content = await getDocContent(slug);
    const projectId = DOC_TO_PROJECT_ID[slug];
    const project = portfolioData.projects.find(p => p.id === projectId);

    if (!content || !project) {
        notFound();
    }

    const { technologies, ...serializableProject } = project;
    const isTechnicalDoc = slug.includes('technical-documentation');
    const howToSchema = HOWTO_SCHEMAS[slug];

    return (
        <>
            {isTechnicalDoc && howToSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
                />
            )}
            <DocPageClient project={serializableProject as any} content={content} slug={slug} />
        </>
    );
}
