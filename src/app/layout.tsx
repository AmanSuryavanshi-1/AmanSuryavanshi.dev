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
const SITE_TITLE = "Aman Suryavanshi | AI Workflow & Automation Engineer | Technical Solutions Engineer";
const SITE_DESCRIPTION = "AI Workflow & Automation Engineer and Technical Solutions Engineer in Bengaluru & Delhi NCR (Open to Remote). Architecting Next.js 15/16 web apps, self-healing 122-node n8n automations, FastMCP knowledge bridges, and programmatic SEO platforms generating ₹300K+ revenue.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amansuryavanshi.me";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        // TARGET ROLES (P0, P1, P2)
        "AI Workflow Engineer",
        "AI Automation Engineer",
        "Technical Solutions Engineer",
        "Associate Solutions Engineer",
        "Full-Stack Growth Engineer",
        "Programmatic SEO Engineer",
        // CORE TECHNICAL SPECIALTIES
        "Next.js 15 Developer",
        "Next.js 16 App Router",
        "n8n Automation Expert",
        "Self-Healing n8n Workflows",
        "Dead-Letter Queue Architecture",
        "FastMCP Knowledge Bridge",
        "Headless Notion CMS Defense",
        "Python AsyncIO EventLoop",
        "httpx Cookie Jar Architecture",
        "Playwright Automation",
        // PROVEN OUTCOMES & RECEIPTS
        "₹300K Revenue Case Study",
        "110K Search Impressions",
        "notebooklm-py PR 276",
        "Aviators Training Centre",
        "OmniPost Core",
        "Vivek OnPoint Platform",
        // LOCATIONS
        "AI Engineer Bengaluru",
        "Technical Solutions Engineer Delhi NCR",
        "Remote AI Workflow Engineer",
        "AI Internship India"
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
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Aman Suryavanshi - AI Workflow & Solutions Engineer",
                type: "image/png",
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
        images: ["/og-image.png"],
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
        google: "YTi2T-zaP-PmKYqKKZ--FNQgEnEM8JQo-HNxqLqQ6gk",
    },
    icons: {
        icon: '/Profile/PFP-Cricular.webp',
        apple: [
            { url: '/Profile/PFP-Cricular.webp', sizes: '180x180', type: 'image/webp' },
        ],
    },
    manifest: '/manifest.json',
};

// Structured data for enhanced SEO / AEO / GEO
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
                url: `${SITE_URL}/Images/profile-pic.png`,
                width: 1200,
                height: 630,
            },
            description: "Aman Suryavanshi is an AI Workflow & Automation Engineer and Associate Technical Solutions Engineer based in Delhi NCR and Bengaluru (available for Remote, Hybrid, and In-Office roles). He architects production Next.js 15/16 web applications, 122-node self-healing n8n systems with Dead-Letter Queues, FastMCP knowledge gateways, and programmatic SEO platforms generating verified commercial revenue.",
            jobTitle: "AI Workflow & Automation Engineer | Technical Solutions Engineer",
            worksFor: {
                "@type": "Organization",
                "name": "Independent Contractor & Solutions Engineer"
            },
            address: {
                "@type": "PostalAddress",
                "addressLocality": "Bengaluru & Delhi NCR",
                "addressCountry": "IN"
            },
            knowsAbout: [
                {
                    "@type": "Thing",
                    "name": "Autonomous Workflow Orchestration",
                    "description": "Designing deterministic, self-healing 122-node pipelines in n8n with Dead-Letter Queues"
                },
                {
                    "@type": "Thing",
                    "name": "FastMCP Knowledge Gateways",
                    "description": "Streaming living codebase and Second Brain context via Model Context Protocol (:3010)"
                },
                {
                    "@type": "Thing",
                    "name": "Next.js 15 & 16 App Router Systems",
                    "description": "Full-stack architectures, Server Components, and sub-second Vercel edge deployments"
                },
                {
                    "@type": "Thing",
                    "name": "Core Open-Source Architecture",
                    "description": "Author of Merged Core PR #276 (+1,483 lines) in notebooklm-py (16.5k★) fixing cookie jars & Windows asyncio"
                },
                "Programmatic SEO (pSEO)",
                "Headless Notion CMS 11-Layer Defense",
                "Python & Asyncio",
                "Upstash Redis Rate Limiting",
                "Multi-LLM Routing (GPT-4o, Claude 3.5 Sonnet, Gemini 2.5)",
                "Playwright Headless Graphics Compilation"
            ],
            sameAs: [
                "https://github.com/AmanSuryavanshi-1",
                "https://www.linkedin.com/in/amansuryavanshi-ai/",
                "https://twitter.com/_AmanSurya"
            ],
        },
        {
            "@type": "Organization",
            "@id": `${SITE_URL}#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            sameAs: [
                "https://github.com/AmanSuryavanshi-1",
                "https://www.linkedin.com/in/amansuryavanshi-ai/",
                "https://twitter.com/_AmanSurya"
            ],
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/Profile/PFP-Cricular.webp`
            }
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}#website`,
            url: SITE_URL,
            name: SITE_TITLE,
            description: SITE_DESCRIPTION,
            publisher: {
                "@id": `${SITE_URL}#organization`
            },
        },
        {
            "@type": "ProfilePage",
            "@id": `${SITE_URL}#profile`,
            url: SITE_URL,
            name: `${SITE_NAME} Professional Engineering Profile`,
            mainEntity: {
                "@id": `${SITE_URL}#person`
            }
        },
        {
            "@type": "ProfessionalService",
            "@id": `${SITE_URL}#service`,
            name: "Aman Suryavanshi — AI Workflow & Solutions Engineering",
            description: "Production-grade AI automation systems, self-healing n8n workflows (122 nodes, DLQ), FastMCP knowledge gateways, Next.js 15/16 platforms, and programmatic SEO architectures.",
            url: SITE_URL,
            provider: {
                "@id": `${SITE_URL}#person`
            },
            areaServed: ["Bengaluru", "Delhi NCR", "India", "USA", "Remote"],
            priceRange: "₹50,000 - ₹5,00,000 / $60,000 - $100,000",
            image: `${SITE_URL}/og-image.png`,
            serviceType: [
                "AI Workflow & Automation Engineering",
                "Technical Solutions Engineering (TSE)",
                "Programmatic SEO & Organic Growth Systems",
                "Self-Healing n8n Orchestration (122 nodes, DLQ)",
                "Next.js 15/16 Full-Stack Control Dashboards"
            ],
            hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Engineering & Solutions Offerings",
                itemListElement: [
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Autonomous Revenue Operations & SDR Pipelines",
                            description: "LangGraph and n8n autonomous lead research, CRM enrichment, and verified outreach"
                        }
                    },
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Self-Healing Business Automation (122-Node n8n)",
                            description: "Enterprise workflows with Dead-Letter Queues, retry backoff, and FastMCP knowledge bridges"
                        }
                    },
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Programmatic SEO & High-Performance Next.js Platforms",
                            description: "Sub-2s page speed, 95+ Lighthouse, 110K+ GSC impressions, and AEO/GEO dominance"
                        }
                    }
                ]
            }
        },
        {
            "@type": "FAQPage",
            "@id": `${SITE_URL}#faq`,
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Who is Aman Suryavanshi?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Aman Suryavanshi is an AI Workflow & Automation Engineer and Associate Technical Solutions Engineer based in Delhi NCR and Bengaluru (available for Remote, Hybrid, and In-Office roles). He architects production-grade Next.js 15/16 web applications, 122-node self-healing n8n automation systems with Dead-Letter Queues, FastMCP knowledge gateways, and programmatic SEO platforms that generate verified commercial revenue."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What are Aman Suryavanshi's core receipts and technical achievements?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Aman's four flagship receipts include: (1) Aviators Training Centre: Next.js 15 + pSEO platform generating ₹300,000+ ($3.5K+) revenue, 110K+ GSC impressions, and 95+ Lighthouse score. (2) Vivek-OnPoint Platform: Next.js 16 + Headless Notion CMS (8 relational DBs) with an 11-Layer Defense System eliminating API limits. (3) notebooklm-py (16.5k★): Merged Core PR #276 (+1,483 / -353 lines) fixing short-lived auth cookie drops on cross-domain 302 redirects and Windows asyncio event loop policy. (4) OmniPost-Core: 122-node self-healing n8n engine connected to an Obsidian Second Brain via FastMCP (:3010)."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What target roles and compensation tiers is Aman Suryavanshi open to?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Aman is targeting: Primary [P0] AI Workflow & Automation Engineer (₹6L–₹14L LPA / ₹50k–₹1.2L/mo); Secondary [P1] Associate Technical Solutions Engineer (TSE) (₹7.5L–₹18L LPA / $60k–$100k Remote); Tertiary [P2] Full-Stack Growth & pSEO Engineer (₹6L–₹15L LPA / ₹50k–₹1.25L/mo); and Wedge high-paying remote AI internships (≥₹50k/mo net). He is available for in-office/hybrid in Bengaluru (HSR, Koramangala, Indiranagar), Delhi NCR (Cyber City, Noida), and Remote."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How does Aman ensure 99.9% uptime in automation systems?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "By designing deterministic workflows rather than naive API scripts. He implements Dead-Letter Queues (DLQ) for failed payload retention, exponential backoff with jitter, semaphore throttling (such as 0.67 req/s for rate-sensitive APIs), version-controlled static emergency bypass snapshots, and closed-loop alert webhooks."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is Aman Suryavanshi's experience with open source and Google NotebookLM?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Aman authored and merged Core PR #276 (+1,483 / -353 lines) in notebooklm-py (16.5k+ stars on GitHub), resolving silent authentication cookie dropouts on cross-domain redirects to accounts.google.com via an httpx cookie jar, atomic token storage (tempfile + chmod 0o600), and fixing Windows ProactorEventLoop policies."
                    }
                }
            ]
        },
        {
            "@type": "SoftwareSourceCode",
            "@id": `${SITE_URL}#notebooklm-py-pr276`,
            name: "notebooklm-py PR #276: Core Auth Cookie Jar & Windows Asyncio Fix",
            programmingLanguage: "Python",
            runtimePlatform: "Python 3.10+, Windows, Linux, macOS",
            codeRepository: "https://github.com/tomaarsen/notebooklm-py/pull/276",
            author: {
                "@id": `${SITE_URL}#person`
            },
            description: "Merged core architectural pull request in Google NotebookLM's leading Python library (16.5k stars), implementing domain-preserving cookie jars and resolving Windows asyncio ProactorEventLoop policies."
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