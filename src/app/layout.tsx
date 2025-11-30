import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import GoogleAnalyticsWrapper from "../components/GoogleAnalyticsWrapper";
import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"
import { cn } from "@/lib/utils";

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
const SITE_TITLE = "Aman Suryavanshi | AI Automation Engineer + Full-Stack Developer";
const SITE_DESCRIPTION = "AI Automation Engineer specializing in gluing tools together. Expert at connecting apps, APIs, and services with n8n automation, LangChain, and OpenAI. I make different tools work together seamlessly to create powerful automation workflows.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amansuryavanshi-dev.vercel.app/";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        // Primary positioning
        "AI automation engineer",
        "full-stack developer",
        "n8n automation expert",
        "n8n consultant",
        "n8n workflow automation",
        "intelligent automation",
        "AI-powered workflows",
        "LangChain developer",
        "OpenAI integration",
        "AI workflow orchestration",
        // Core technologies
        "Next.js developer",
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
        icon: '/Profile/PFP-Cricular.png',
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
            jobTitle: "AI Automation Engineer and Full-Stack Developer",
            hasOccupation: {
                "@type": "Occupation",
                "name": "AI Automation Engineer",
                "description": "Building intelligent automation workflows with n8n and AI integration",
                "skills": [
                    "n8n Automation",
                    "Next.js Development",
                    "AI Integration",
                    "LangChain",
                    "OpenAI API",
                    "Workflow Orchestration",
                    "TypeScript",
                    "React",
                    "Firebase"
                ]
            },
            knowsAbout: [
                "AI Automation",
                "n8n",
                "Next.js",
                "LangChain",
                "OpenAI",
                "Workflow Automation",
                "Full-Stack Development",
                "TypeScript",
                "React",
                "Firebase",
                "Sanity CMS",
                "API Integration"
            ],
            sameAs: [
                "https://github.com/AmanSuryavanshi-1",
                "https://www.linkedin.com/in/aman-suryavanshi-6b0aba347/",
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
        }
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
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
                    "antialiased min-h-screen flex flex-col",
                    "bg-gradient-to-br from-sage-100 to-lime-500",
                )}
            >
                <Header />
                <main className="flex-grow bg-gradient-to-br from-sage-100 to-lime-500">
                    {children}
                    <footer className="mt-auto">
                        <Footer />
                    </footer>
                </main>

                <Analytics />
                <GoogleAnalyticsWrapper />
            </body>
        </html>
    );
}