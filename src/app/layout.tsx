import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import GoogleAnalyticsWrapper from "../components/GoogleAnalyticsWrapper";
import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

// Font configurations with performance optimizations
const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
    display: 'swap',
});

const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
    display: 'swap',
});

// Site Constants
const SITE_NAME = "Aman Suryavanshi";
const SITE_TITLE = "Aman Suryavanshi | AI Workflow Architect | ₹300K+ Revenue Impact";
const SITE_DESCRIPTION = "I build self-healing AI systems that drive revenue. ₹300K+ generated, 80% manual work eliminated. n8n automation, LangGraph agents, Next.js dashboards. Book a discovery call for your system audit.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amansuryavanshi-dev.vercel.app/";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        // PRIMARY: Client Pain Keywords (High-Intent)
        "reduce operational costs with AI",
        "automate manual data entry",
        "n8n vs Zapier for business",
        "AI agents for lead generation",
        "self-healing workflow automation",
        "hire n8n automation expert",
        // SECONDARY: Technical Authority
        "AI workflow architect",
        "n8n automation expert India",
        "LangGraph production architecture",
        "Next.js AI dashboard developer",
        "full-stack systems builder",
        "AI automation engineer",
        "Next.js automation",
        "React automation solutions",
        "TypeScript developer",
        "Firebase integration",
        "Sanity CMS developer",
        "headless CMS automation",
        // AI & Automation stack
        "Groq AI",
        "Anthropic Claude",
        "GPT-4 integration",
        "Perplexity AI",
        "SerpAPI integration",
        "RAG systems",
        "vector databases",
        "AI agents",
        "multi-LLM integration",
        // Automation specialties
        "workflow automation specialist",
        "business process automation",
        "API integration expert",
        "integration specialist",
        "systems integration",
        "app integration expert",
        "tool connector",
        "service orchestration",
        "no-code automation",
        "low-code development",
        "automation consultant",
        // Development
        "full-stack automation",
        "UI/UX developer",
        "modern web apps",
        "progressive web apps",
        "responsive design",
        // Location-based
        "automation developer India",
        "n8n expert India",
        "remote automation engineer",
        "freelance automation developer",
        // Personal brand
        "Aman Suryavanshi",
        "Aman Suryavanshi developer",
        "Aman Suryavanshi AI automation"
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        siteName: SITE_NAME,
        images: [
            {
                url: "/Profile/me main.png",
                width: 1200,
                height: 630,
                alt: "Aman Suryavanshi - AI Automation Engineer Portfolio",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        creator: "@_AmanSurya",
        images: ["/Images/profile-pic.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
    icons: {
        icon: '/Profile/PFP-Cricular.webp',
        apple: [
            { url: '/Profile/PFP-Cricular.webp', sizes: '180x180', type: 'image/webp' },
        ],
    },
    manifest: '/manifest.json',
};

// Structured data for enhanced SEO
const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": `${SITE_URL}#person`,
            name: SITE_NAME,
            url: SITE_URL,
            image: {
                "@type": "ImageObject",
                "@id": `${SITE_URL}#image`,
                url: "/Images/profile-pic.png",
                width: 1200,
                height: 630,
            },
            description: SITE_DESCRIPTION,
            jobTitle: "AI Workflow Architect & Full-Stack Systems Builder",
            hasOccupation: {
                "@type": "Occupation",
                "name": "AI Workflow Architect",
                "description": "Building self-healing AI automation systems that generate revenue. Specializing in n8n production workflows with deterministic state management, LangGraph agent pipelines, and Next.js control dashboards.",
                "skills": [
                    "Self-Healing n8n Automation",
                    "LangGraph Agent Orchestration",
                    "Next.js AI Dashboards",
                    "Deterministic State Management",
                    "Dead-Letter Queue Architecture",
                    "Multi-LLM Integration",
                    "TypeScript",
                    "React",
                    "Firebase"
                ]
            },
            knowsAbout: [
                "Self-Healing Workflow Automation",
                "n8n Production Deployment",
                "LangGraph Multi-Agent Systems",
                "Next.js Dashboard Development",
                "AI Agent Orchestration",
                "Revenue Operations Automation",
                "Dead-Letter Queues",
                "TypeScript",
                "React",
                "Firebase",
                "Sanity CMS",
                "API Integration"
            ],
            sameAs: [
                "https://github.com/AmanSuryavanshi-1",
                "https://www.linkedin.com/in/amansuryavanshi-ai/",
                "https://twitter.com/_AmanSurya"
            ],
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}#website`,
            url: SITE_URL,
            name: SITE_TITLE,
            description: SITE_DESCRIPTION,
            publisher: {
                "@id": `${SITE_URL}#person`
            },
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How can AI agents reduce my operational costs?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "AI agents built with n8n and LangGraph can automate research, data entry, and customer outreach—reducing manual work by 80%. My systems have saved clients 40+ hours/week and generated ₹300K+ in revenue through autonomous lead operations."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Can n8n replace my manual data entry team?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. I build self-healing n8n workflows with Dead-Letter Queues and automatic retry logic that process forms, enrich CRM data, and sync across tools automatically. One client reduced their admin workload by 80% with a 74-node automation system."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How much does custom AI automation cost in India?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Production n8n + LangGraph automation projects range from ₹50K-₹2L ($900-$2,500) depending on complexity. I offer free discovery calls to scope requirements and provide fixed-price quotes with guaranteed deliverables."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What's the difference between Zapier and n8n?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "n8n is self-hosted, infinitely customizable, and supports AI agents via LangChain integration. Unlike Zapier, n8n has no task limits, supports complex logic like loops and conditionals, and allows deterministic state management with Dead-Letter Queues. I specialize in production n8n deployments."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I get my business to show up in ChatGPT and Perplexity?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "AI search engines prioritize structured data (JSON-LD schemas), FAQ markup, and authoritative content with specific metrics. I implement AEO (Answer Engine Optimization) strategies including client-pain FAQ schemas and achievement entities that have helped clients get cited in AI search results."
                    }
                }
            ]
        },
        {
            "@type": "ProfessionalService",
            "@id": `${SITE_URL}#service`,
            name: "Aman Suryavanshi — AI Workflow Architecture",
            description: "Production-grade AI automation systems: self-healing n8n workflows, LangGraph agent pipelines, and Next.js control dashboards. Specializing in systems that generate revenue and reduce manual work.",
            provider: {
                "@id": `${SITE_URL}#person`
            },
            areaServed: ["Global", "India", "USA", "Remote"],
            priceRange: "₹75,000 - ₹5,00,000",
            serviceType: [
                "AI Workflow Automation",
                "n8n Production Deployment",
                "LangGraph Agent Development",
                "Next.js Dashboard Development",
                "SEO/AEO/GEO Optimization"
            ],
            hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "AI Automation Services",
                itemListElement: [
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Autonomous Revenue Operations",
                            description: "LangGraph-powered lead research, CRM enrichment, and outreach automation"
                        }
                    },
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Self-Healing Business Automation",
                            description: "74-node n8n workflows with DLQ, retry logic, and health monitoring"
                        }
                    }
                ]
            }
        }
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData)
                    }}
                />
            </head>
            <body
                className={cn(
                    `${geistSans.variable} ${geistMono.variable}`,
                    "antialiased min-h-screen flex flex-col transition-colors duration-300",
                    "bg-[#D3E6BB] dark:bg-[#0a1f15]",
                    "text-[#12372A] dark:text-[#D3E6BB]"
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    <Header />
                    <main className="flex-grow">
                        {children}
                        <footer className="mt-auto">
                            <Footer />
                        </footer>
                    </main>
                </ThemeProvider>

                <Analytics />
                <GoogleAnalyticsWrapper />
            </body>
        </html>
    );
}