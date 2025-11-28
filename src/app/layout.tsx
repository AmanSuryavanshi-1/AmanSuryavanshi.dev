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
const SITE_TITLE = "Aman Suryavanshi | Solutions Architect & Full-Stack Developer";
const SITE_DESCRIPTION = "Solutions Architect specializing in Next.js full-stack development and AI automation. Built production systems generating ₹300K+ revenue. Available for remote projects and consulting.";
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
        "solutions architect",
        "full-stack developer",
        "AI automation specialist",
        "AI automation consultant",
        "N8N consultant",
        "N8N expert",
        "workflow automation",
        "system integration",
        "technical architect India",
        "remote automation specialist",
        // Core skills
        "web developer",
        "freelance web developer",
        "Next.js expert",
        "Next.js portfolio",
        "JavaScript developer",
        "TypeScript developer",
        "React developer",
        "React developer India",
        "frontend developer",
        "Firebase expert",
        "Supabase developer",
        "remote developer",
        "UI/UX designer",
        "web development blog",
        // Location-based
        "web developer india",
        "freelance web developer india",
        "best web developer in delhi",
        // Personal brand
        "Aman Suryavanshi"
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
                alt: "Aman Suryavanshi Portfolio Preview",
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
            jobTitle: "Web Developer",
            sameAs: [
                "https://github.com/AmanSuryavanshi-1",
                "https://www.linkedin.com/in/aman-suryavanshi-6b0aba347/",
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
            {/* <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      > */}
            {/* added custom scrollbar for site */}
            <body
                className={cn(
                    `${geistSans.variable} ${geistMono.variable}`,
                    "antialiased min-h-screen flex flex-col",
                    "bg-gradient-to-br from-sage-100 to-lime-500", // or whatever background you want
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