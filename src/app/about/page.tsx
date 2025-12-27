import React from 'react';
import { Metadata } from 'next';
import ProfileImage from '@/components/about-page/ProfileImage';
import ContentCard from '@/components/about-page/ContentCard';
import GithubProfile from '@/components/about-page/Github/GithubProfile';
import { GithubCalendarComponent } from '@/components/about-page/Github/GithubCalendar';
import ComprehensiveSkills from '@/components/skills/ComprehensiveSkills';
import AboutContent from '@/components/about-page/Content';
import CTA from '@/components/about-page/CTA';
import SectionTitle from '@/components/about/SectionTitle';
import ScrollToHash from '@/components/ui/ScrollToHash';

// Site Constants
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amansuryavanshi-dev.vercel.app/";
const ABOUT_TITLE = "About Aman Suryavanshi - AI Automation Engineer + Integration Specialist";
const ABOUT_DESCRIPTION = "Learn about Aman Suryavanshi, an AI Automation Engineer specializing in gluing tools together. Expert at connecting apps, APIs, and services with n8n automation, LangChain, and OpenAI. Building Next.js apps with intelligent automation backends.";

// Metadata configuration
export const metadata: Metadata = {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    alternates: {
        canonical: `${SITE_URL}/about`,
    },
    openGraph: {
        title: ABOUT_TITLE,
        description: ABOUT_DESCRIPTION,
        url: `${SITE_URL}/about`,
        images: [
            {
                url: '/Profile/me main.png',
                width: 1200,
                height: 630,
                alt: 'Aman Suryavanshi - AI Automation Engineer and Integration Specialist',
            },
        ],
        type: 'profile',
    },
    twitter: {
        card: 'summary_large_image',
        title: ABOUT_TITLE,
        description: ABOUT_DESCRIPTION,
        images: ['/Profile/me main.png'],
        creator: '@_AmanSurya',
    },
    robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
    },
};

// Structured data for the about page
const aboutStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": `${SITE_URL}/about#webpage`,
            url: `${SITE_URL}/about`,
            name: ABOUT_TITLE,
            description: ABOUT_DESCRIPTION,
            isPartOf: {
                "@id": `${SITE_URL}#website`
            },
            breadcrumb: {
                "@id": `${SITE_URL}/about#breadcrumb`
            },
            inLanguage: "en-US",
        },
        {
            "@type": "BreadcrumbList",
            "@id": `${SITE_URL}/about#breadcrumb`,
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    item: {
                        "@id": SITE_URL,
                        name: "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    item: {
                        "@id": `${SITE_URL}/about`,
                        name: "About"
                    }
                }
            ]
        },
        {
            "@type": "Person",
            "@id": `${SITE_URL}/about#person`,
            name: "Aman Suryavanshi",
            givenName: "Aman",
            familyName: "Suryavanshi",
            url: `${SITE_URL}/about`,
            image: {
                "@type": "ImageObject",
                url: "/Images/about-preview.png",
                width: 1200,
                height: 630
            },
            description: ABOUT_DESCRIPTION,
            jobTitle: "AI Automation Engineer & Integration Specialist",
            sameAs: [
                "https://github.com/AmanSuryavanshi-1",
                "https://www.linkedin.com/in/amansuryavanshi-ai/"
            ],
            knowsAbout: [
                "AI Automation",
                "Integration Specialist",
                "n8n",
                "Next.js",
                "TypeScript",
                "Workflow Optimization",
                "Business Process Automation"
            ],
            worksFor: {
                "@type": "Organization",
                name: "Freelance"
            },
            skills: [
                "AI Automation",
                "Integration Specialist",
                "n8n",
                "Next.js",
                "TypeScript",
                "Workflow Optimization"
            ]
        }
    ]
};

export default function AboutPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(aboutStructuredData)
                }}
            />

            <ScrollToHash />

            <main className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-sage-100 to-lime-500">
                {/* Hero Section - Fits in 100vh */}
                <section className="relative pt-12 pb-0 lg:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-center">
                    <SectionTitle />

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                        {/* Profile Image - Left Side */}
                        <div className="lg:col-span-5 order-1 lg:order-1">
                            <ProfileImage />
                        </div>

                        {/* Content - Right Side */}
                        <div className="lg:col-span-7 order-2 lg:order-2">
                            <AboutContent />
                        </div>
                    </div>
                </section>

                {/* Details Grid Section */}
                <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
                    <ContentCard />
                </section>

                {/* Github Section */}
                <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
                    <GithubProfile />
                </section>

                {/* GitHub Calendar */}
                <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
                    <GithubCalendarComponent />
                </section>

                {/* Skills Section */}
                <section id="skills">
                    <ComprehensiveSkills />
                </section>

                {/* CTA Section */}
                <CTA />
            </main>
        </>
    );
}
