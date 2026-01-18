import React from 'react';
import { notFound } from 'next/navigation';
import DocPageClient from '@/components/docs/DocPageClient';
import { portfolioData } from '@/data/portfolio';

// Map slugs to GitHub raw URLs
const DOCS_MAP: Record<string, string> = {
    // Executive Summaries
    'aviators-training-centre-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-executive-summary.md',
    'omni-post-ai-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/main/Omni-Post-AI-Automation/OMNI-POST-AI-EXECUTIVE-SUMMARY.md',
    'n8n-github-backup-executive-summary': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/n8n-production-workflows/main/%5BProd%5D%20N8N_GitHub_Backup_V5_Unified/02-EXECUTIVE-SUMMARY.md',
    // Technical Documentation
    'aviators-training-centre-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-technical-documentation.md',
    'omni-post-ai-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/main/Omni-Post-AI-Automation/OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md',
    'n8n-github-backup-technical-documentation': 'https://raw.githubusercontent.com/AmanSuryavanshi-1/n8n-production-workflows/main/%5BProd%5D%20N8N_GitHub_Backup_V5_Unified/01-TECHNICAL-DOCUMENTATION.md',
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
    'n8n-github-backup-executive-summary': 'n8n-github-backup',
    'n8n-github-backup-technical-documentation': 'n8n-github-backup',
    'barkat-enterprise-technical-documentation': 'barkat-enterprise',
    'av-newsstream-technical-documentation': 'av-newsstream',
    'foodah-technical-documentation': 'foodah',
};

// Map slugs to readable titles for metadata - Business Transformation framing
const TITLES_MAP: Record<string, string> = {
    // Executive Summaries → Business Transformation titles
    'aviators-training-centre-executive-summary': 'Aviators: How I Used n8n + Next.js to Generate ₹300K ($3.5K+) in Revenue',
    'omni-post-ai-executive-summary': 'Omni-Post AI: How I Built a 74-Node Workflow That Reduced Manual Work by 80%',
    'n8n-github-backup-executive-summary': 'GitHub Backup V5: How I Built a Self-Healing n8n System with 99.9% Recovery Rate',
    // Technical Documentation → Architecture deep-dives
    'aviators-training-centre-technical-documentation': 'Aviators Architecture: Self-Healing n8n, Firebase, and Production Workflows',
    'omni-post-ai-technical-documentation': 'Omni-Post AI Architecture: Multi-LLM Orchestration with n8n and GPT-4',
    'n8n-github-backup-technical-documentation': 'GitHub Backup Architecture: Dual-Stream Webhook Design with Zero-Trust Security',
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
    const formatSlug = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const title = TITLES_MAP[slug] || formatSlug(slug);
    const isExecutiveSummary = slug.includes('executive-summary');
    const projectId = DOC_TO_PROJECT_ID[slug];

    // Get parent project for image
    const project = portfolioData.projects.find(p => p.id === projectId);
    const projectImage = project?.imageUrl || project?.image || '/Profile/me main.png';

    // Document-specific descriptions optimized for SEO/AEO/GEO
    const DESCRIPTIONS: Record<string, string> = {
        // Executive Summaries - Business transformation focus
        'aviators-training-centre-executive-summary': 'Case study: How Aman Suryavanshi generated ₹300K+ revenue using n8n automation workflows, Next.js 15, and AI-powered SEO for a flight training business. 50+ organic leads, 12% conversion rate, zero ad spend.',
        'omni-post-ai-executive-summary': 'Case study: 74-node n8n workflow that reduced manual content work by 80%. Multi-LLM orchestration with GPT-4, automated LinkedIn/Twitter publishing, and production-grade error handling by Aman Suryavanshi.',
        'n8n-github-backup-executive-summary': 'Case study: Enterprise n8n backup system with 99.9% recovery rate. Dual-stream webhook architecture, zero-trust credential scrubbing, and self-healing retry logic by Aman Suryavanshi.',
        // Technical Documentation - Architecture focus
        'aviators-training-centre-technical-documentation': 'Technical deep-dive: Production n8n architecture with Dead-Letter Queues, Firebase real-time triggers, Cal.com integration, and self-healing workflows. By Aman Suryavanshi, AI Workflow Architect.',
        'omni-post-ai-technical-documentation': 'Technical architecture: Multi-LLM content pipeline using n8n, GPT-4, and Claude. Image processing, platform-specific formatting, OAuth2 API integration. By Aman Suryavanshi.',
        'n8n-github-backup-technical-documentation': 'Technical guide: Dual-stream n8n backup with webhook orchestration, recursive credential redaction, rate limit compliance (30 req/min), and 422/409 self-healing. By Aman Suryavanshi.',
        'barkat-enterprise-technical-documentation': 'Technical documentation: React 18 e-commerce platform with PDF catalogue integration, lazy loading, and WebP optimization. Generated 3,000+ viewers and 60+ B2B leads. By Aman Suryavanshi.',
        'av-newsstream-technical-documentation': 'Technical guide: API key rotation system handling 300+ daily requests. News aggregation from NewsAPI, GNews, YouTube with intelligent caching and failover. By Aman Suryavanshi.',
        'foodah-technical-documentation': 'Technical deep-dive: React performance optimization achieving 40% load time reduction. Custom hooks, code splitting, shimmer UI, and handling 14,000+ line JSON datasets. By Aman Suryavanshi.',
    };

    // Expanded keywords targeting recruiters, clients, and AI search
    const KEYWORDS: Record<string, string[]> = {
        'aviators-training-centre-executive-summary': [
            'n8n automation case study', 'freelance n8n developer', 'Next.js SEO expert India',
            '₹300K revenue automation', 'AI workflow architect portfolio', 'hire n8n expert',
            'production n8n workflows', 'flight training software', 'lead generation automation'
        ],
        'omni-post-ai-executive-summary': [
            'n8n GPT-4 integration', 'content automation workflow', 'multi-LLM orchestration',
            'social media automation n8n', 'AI content repurposing', '74-node workflow architecture',
            'hire AI automation engineer', 'LinkedIn automation n8n', 'Twitter automation workflow'
        ],
        'n8n-github-backup-executive-summary': [
            'n8n backup automation', 'GitHub workflow backup', 'self-healing n8n system',
            'enterprise n8n solution', 'credential scrubbing automation', 'workflow disaster recovery',
            'n8n production best practices', 'hire n8n consultant', 'rate limit handling n8n'
        ],
        'aviators-training-centre-technical-documentation': [
            'n8n Dead-Letter Queue tutorial', 'Firebase n8n integration', 'production n8n architecture',
            'self-healing workflow design', 'Next.js Firebase tutorial', 'n8n webhook patterns',
            'Cal.com automation', 'Airtable CRM automation', 'Telegram notification n8n'
        ],
        'omni-post-ai-technical-documentation': [
            'n8n multi-LLM routing', 'GPT-4 Claude fallback', 'content pipeline architecture',
            'OAuth2 social media automation', 'n8n image processing', 'AI content distribution',
            'Notion to social media automation', 'prompt engineering n8n', 'LLM orchestration pattern'
        ],
        'n8n-github-backup-technical-documentation': [
            'n8n webhook loop pattern', 'GitHub API rate limiting', 'credential redaction regex',
            'dual-stream workflow architecture', 'n8n self-healing pattern', 'SHA conflict resolution',
            '422 error handling n8n', 'workflow backup strategy', 'n8n DevOps automation'
        ],
        'barkat-enterprise-technical-documentation': [
            'React e-commerce India', 'B2B tiles website development', 'PDF catalogue React',
            'lazy loading React tutorial', 'WebP image optimization', 'Vite React performance',
            'EmailJS contact form', 'freelance React developer India', 'product catalogue website'
        ],
        'av-newsstream-technical-documentation': [
            'API key rotation pattern', 'rate limit handling JavaScript', 'news aggregator architecture',
            'Redux Toolkit tutorial', 'Web Speech API React', 'API caching strategy',
            'multi-source API aggregation', 'failover API design', 'Node.js API proxy'
        ],
        'foodah-technical-documentation': [
            'React performance optimization', 'custom hooks tutorial', 'code splitting React',
            'lazy loading best practices', 'Parcel bundler React', 'shimmer UI implementation',
            'large JSON handling React', 'React.memo optimization', 'intersection observer React'
        ],
    };

    const description = DESCRIPTIONS[slug] || (isExecutiveSummary
        ? `Business transformation case study by Aman Suryavanshi. See measurable results: ₹300K revenue, 80% automation, 40K+ impressions using n8n, LangGraph, and Next.js.`
        : `Technical architecture deep-dive by Aman Suryavanshi. Production-grade workflows, self-healing systems, and deployment strategies.`);

    const keywords = KEYWORDS[slug] || [
        'n8n case study', 'AI automation portfolio', 'Aman Suryavanshi',
        'hire n8n developer', 'freelance automation expert', 'self-healing workflows'
    ];

    return {
        title: `${title} | Aman Suryavanshi`,
        description,
        keywords,
        authors: [{ name: 'Aman Suryavanshi', url: 'https://amansuryavanshi.me' }],
        creator: 'Aman Suryavanshi',
        alternates: {
            canonical: `https://amansuryavanshi.me/projects/${slug}`,
        },
        openGraph: {
            title,
            description,
            type: 'article',
            authors: ['Aman Suryavanshi — AI Workflow Architect'],
            url: `https://amansuryavanshi.me/projects/${slug}`,
            siteName: 'Aman Suryavanshi Portfolio',
            locale: 'en_US',
            images: [{
                url: projectImage,
                width: 1200,
                height: 630,
                alt: title,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
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
    },
    'n8n-github-backup-technical-documentation': {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Build an Enterprise n8n Workflow Backup System",
        "description": "Architecture guide for building a dual-stream n8n backup system with automatic GitHub synchronization, credential redaction, and failure isolation.",
        "step": [
            { "@type": "HowToStep", "name": "Design Dual-Stream Architecture", "text": "Create Manager stream for orchestration and Worker stream for isolated workflow processing via webhooks." },
            { "@type": "HowToStep", "name": "Implement Zero-Trust Scrubbing", "text": "Add recursive JSON traversal to redact all credential patterns before GitHub commits." },
            { "@type": "HowToStep", "name": "Configure Rate Limiting", "text": "Enforce 2-second delays between GitHub API calls to guarantee 30 requests/minute compliance." },
            { "@type": "HowToStep", "name": "Add Self-Healing Logic", "text": "Implement 422/409 error detection with automatic SHA refresh and retry mechanisms." }
        ],
        "totalTime": "PT4H"
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
