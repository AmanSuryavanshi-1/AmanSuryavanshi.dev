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
const SITE_TITLE = "Aman Suryavanshi | AI Workflow Architect & Systems Builder";
const SITE_DESCRIPTION = "I build self-healing AI systems that drive revenue. ₹300K+ generated, 80% manual work eliminated. n8n automation, LangGraph agents, Next.js dashboards. Book a discovery call for your system audit.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amansuryavanshi.me";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        // ELITE AUTHORITY: High-Ticket Intent
        "AI Agent Developer for SaaS",
        "n8n Automation Expert for Agencies",
        "Next.js AI Dashboard Architect",
        "Freelance AI Engineer",
        "Hire n8n Expert",
        // TECHNICAL SPECIALTIES (KnowsAbout)
        "Agentic Workflows",
        "Deterministic Automation",
        "Multi-LLM Orchestration",
        "Self-Healing Workflows",
        "RAG Pipeline Architecture",
        "LangGraph Developer",
        "Vector Database Integration",
        // OUTCOMES
        "Reduce Operational Costs with AI",
        "Automate Revenue Operations",
        "Enterprise Process Automation",
        // STACK
        "Next.js App Router",
        "TypeScript",
        "OpenAI GPT-4 Integration",
        "Anthropic Claude API",
        "Google Gemini API"
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
            "@type": ["Person", "SoftwareEngineer"],
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
            jobTitle: "AI Workflow Architect & Systems Builder",
            worksFor: {
                "@type": "Organization",
                "name": "Freelance"
            },
            knowsAbout: [
                {
                    "@type": "Thing",
                    "name": "Agentic Workflows",
                    "description": "Designing autonomous AI agent systems using LangGraph"
                },
                {
                    "@type": "Thing",
                    "name": "Deterministic Automation",
                    "description": "Building reliable, state-managed workflows in n8n"
                },
                {
                    "@type": "Thing",
                    "name": "Multi-LLM Orchestration",
                    "description": "Routing tasks to optimal models (GPT-4o, Claude 3.5 Sonnet, Gemini)"
                },
                {
                    "@type": "Thing",
                    "name": "n8n Production Architecture",
                    "description": "Self-hosted, high-scale n8n deployments with self-healing capabilities"
                },
                "RAG Systems",
                "Next.js AI Dashboards",
                "Dead-Letter Queue Architecture",
                "TypeScript",
                "Revenue Operations Automation"
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
            "@type": "ProfessionalService",
            "@id": `${SITE_URL}#service`,
            name: "Aman Suryavanshi — AI Workflow Architecture",
            description: "Production-grade AI automation systems: self-healing n8n workflows, LangGraph agent pipelines, and Next.js control dashboards. Specializing in systems that generate revenue and reduce manual work.",
            url: SITE_URL,
            provider: {
                "@id": `${SITE_URL}#person`
            },
            areaServed: ["Global", "USA", "UK", "India"],
            priceRange: "₹50,000 - ₹5,00,000",
            image: "/Images/profile-pic.png",
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
                            description: "Complex n8n workflows with DLQ, retry logic, and health monitoring"
                        }
                    },
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "AI-Powered SaaS Architecture",
                            description: "Next.js + AI Agent backends for scalable SaaS applications"
                        }
                    }
                ]
            }
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How to hire an n8n automation expert?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Look for engineers who specialize in 'deterministic automation' and 'self-healing workflows' rather than just connecting APIs. My service includes a full architecture audit, custom n8n node development, and guaranteed error handling protocols to ensure 99.9% uptime."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is an AI Workflow Architect?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "An AI Workflow Architect doesn't just write prompts; they build the infrastructure (RAG, Vector DBs, n8n orchestrators) that makes AI agents reliable in production. I combine Next.js full-stack skills with advanced agent frameworks like LangGraph to build complete business systems."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Cost of building custom AI agents?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Professional AI agent development typically ranges from ₹75,000 to ₹5,00,000 depending on complexity (e.g., single-task bot vs. multi-agent orchestration). My pricing is value-based, focusing on the revenue generated or hours saved by the system."
                    }
                }
            ]
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