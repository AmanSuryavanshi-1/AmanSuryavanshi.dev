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

// Site Constants - Entity-Driven Keywords for AEO/GEO
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amansuryavanshi.me";
const ABOUT_TITLE = "About Aman Suryavanshi | Production n8n Architect & LangGraph Orchestrator";
const ABOUT_DESCRIPTION = "Full-Stack Agentic Developer building self-healing automation systems with Multi-LLM Orchestration. Expert in Next.js Systems, n8n Production Workflows (74-node, 99.7% reliability), and Technical SEO/GEO. ₹300K+ revenue impact through AI-powered solutions.";


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

// Enhanced Structured Data with ProfessionalService, SoftwareSourceCode, and FAQ Schema
const aboutStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
        // AboutPage
        {
            "@type": "AboutPage",
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
            mainEntity: {
                "@id": `${SITE_URL}/about#person`
            }
        },
        // Breadcrumb
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
        // Enhanced Person Schema
        {
            "@type": "Person",
            "@id": `${SITE_URL}/about#person`,
            name: "Aman Suryavanshi",
            givenName: "Aman",
            familyName: "Suryavanshi",
            url: `${SITE_URL}/about`,
            image: {
                "@type": "ImageObject",
                url: `${SITE_URL}/Profile/me main.png`,
                width: 1200,
                height: 630
            },
            description: "Full-Stack Agentic Developer specializing in self-healing automation systems, Multi-LLM Orchestration, and Production n8n Architecture. ECE background bridging hardware and software.",
            jobTitle: "Production n8n Architect & LangGraph Orchestrator",
            alumniOf: {
                "@type": "EducationalOrganization",
                name: "Electronics & Communication Engineering"
            },
            sameAs: [
                "https://github.com/AmanSuryavanshi-1",
                "https://www.linkedin.com/in/amansuryavanshi-ai/",
                "https://twitter.com/_AmanSurya"
            ],
            knowsAbout: [
                // High-Intent Keywords from 2026 Research
                "n8n automation expert",
                "AI workflow architect",
                "LangGraph specialist",
                "CrewAI automation",
                "agentic workflow specialist",
                "enterprise n8n workflows",
                "n8n AI agents",
                // Technical Depth
                "Multi-LLM Orchestration",
                "Production n8n Architecture",
                "Self-Healing Automations",
                "Deterministic State Machines",
                "Closed-Loop Feedback Systems",
                "Dead Letter Queues (DLQs)",
                // Stack
                "Next.js Systems Building",
                "TypeScript",
                "LangChain",
                "Technical SEO/GEO",
                // AEO/GEO Long-Tail
                "hire n8n freelancer India",
                "AI SEO workflows n8n"
            ],
            hasOccupation: {
                "@type": "Occupation",
                name: "Full-Stack Agentic Developer",
                skills: [
                    "n8n Workflow Automation",
                    "Next.js Development",
                    "Multi-LLM Orchestration",
                    "LangGraph",
                    "TypeScript",
                    "Technical SEO"
                ]
            },
            makesOffer: {
                "@type": "Offer",
                itemOffered: {
                    "@type": "ProfessionalService",
                    name: "AI Automation & Systems Architecture",
                    description: "Building production-grade self-healing automation systems with n8n, LangGraph, and Next.js",
                    areaServed: {
                        "@type": "Place",
                        name: "Global"
                    },
                    serviceType: [
                        "n8n Automation Architecture",
                        "Multi-LLM Orchestration",
                        "Next.js Systems Development",
                        "AI/SEO Optimization"
                    ]
                }
            }
        },
        // SoftwareSourceCode Schema (Reliability Block - Deterministic Engineering)
        {
            "@type": "SoftwareSourceCode",
            "@id": `${SITE_URL}/about#sourceCode`,
            name: "Self-Healing Automation Architecture",
            description: "Production n8n workflows featuring Deterministic State Machines, Closed-Loop Feedback Systems, and Dead Letter Queues for 99.7% reliability",
            codeRepository: "https://github.com/AmanSuryavanshi-1",
            programmingLanguage: ["TypeScript", "JavaScript", "Python"],
            runtimePlatform: ["n8n", "Node.js", "Next.js"],
            author: {
                "@id": `${SITE_URL}/about#person`
            }
        },
        // FAQ Schema for Career-Related Queries
        {
            "@type": "FAQPage",
            "@id": `${SITE_URL}/about#faq`,
            mainEntity: [
                {
                    "@type": "Question",
                    name: "What is Aman's approach to AI automation?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "I design closed-loop, self-healing automation systems using n8n and multi-agent orchestration. Every workflow features deterministic state transitions, dead letter queues for graceful failure handling, and monitoring dashboards for non-technical stakeholders. My systems achieve 99.7% reliability in production."
                    }
                },
                {
                    "@type": "Question",
                    name: "What makes Aman different from other developers?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "I bridge the gap between AI agents and usable products. Most AI developers build intelligence but can't create interfaces. Most frontend developers build UIs but don't understand orchestration. I deliver complete solutions—from LangGraph agents to the Next.js dashboard that controls them."
                    }
                },
                {
                    "@type": "Question",
                    name: "What results has Aman achieved?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "₹300K+ revenue impact for Aviators Training Centre through SEO-optimized web presence. 80% time reduction in content workflows via 74-node n8n automation (Omni-Post AI). #1 Google rankings for client projects through Technical SEO/GEO optimization."
                    }
                },
                {
                    "@type": "Question",
                    name: "What is Aman's T-Shaped Stack?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Depth in Multi-Agent Orchestration (LangGraph + CrewAI + n8n AI Agents), with breadth across Frontend (Next.js), Automation (n8n + API), and Technical SEO. This combination is rare—most developers specialize in only one layer."
                    }
                }
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

            <main className="min-h-screen w-full overflow-x-hidden bg-sage-50 dark:bg-forest-950">
                {/* Hero Section - Fits in 100vh */}
                <section className="relative py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-center">
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

                {/* Details Grid Section - Bento Grid */}
                <section className="w-full py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
                    <ContentCard />
                </section>

                {/* Github Section */}
                <section className="w-full py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
                    <GithubProfile />
                </section>

                {/* GitHub Calendar */}
                <section className="w-full py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
                    <GithubCalendarComponent />
                </section>

                {/* Skills Section */}
                <section id="skills" className="py-12 lg:py-16">
                    <ComprehensiveSkills />
                </section>

                {/* CTA Section */}
                <CTA />
            </main>
        </>
    );
}
