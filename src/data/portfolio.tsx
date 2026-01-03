import React from 'react';
import {
    // Lucide React
    MessageCircle, ArrowRight, Sparkles,
    Workflow, Bot, Brain, Zap, Code2, Layout, Database, Server, Rocket, Search, Globe, Puzzle, Palette, Terminal, FileText, Users, Cpu, Layers, LineChart, GitBranch, Lock, Smartphone, MessageSquare, Mic,
    Route, FileJson, Webhook, Component, PenTool, Cloud, Code
} from 'lucide-react';

import {
    // React Icons
    FaReact, FaHtml5, FaCss3Alt, FaJsSquare, FaGithub, FaYoutube, FaNewspaper, FaLanguage, FaPencilRuler, FaGlobe, FaMobileAlt, FaChartLine, FaFileArchive, FaIcons, FaDocker, FaNodeJs
} from 'react-icons/fa';

import {
    SiRedux, SiTailwindcss, SiPostcss, SiNetlify, SiDaisyui, SiVite, SiMui, SiTypescript, SiNextdotjs, SiShadcnui, SiFramer, SiIcon, SiFirebase, SiSanity, SiN8N, SiOpenai, SiAirtable, SiTelegram, SiPostgresql, SiNginx, SiDigitalocean, SiGreensock
} from 'react-icons/si';

import { MdEmail, MdViewInAr } from 'react-icons/md';
import { AiOutlineDeploymentUnit } from 'react-icons/ai';

// --- Interfaces ---

export interface HeroData {
    name: string;
    title: string;
    subtitle: string;
    tagline: string;
    description: string;
    descriptionHighlight: string;
    stats: string[];
    buttons: {
        primary: {
            label: string;
            href: string;
        };
        secondary: {
            label: string;
            href: string;
        };
    };
    meta: {
        name: string;
        description: string;
    };
}

export interface AboutData {
    title: string;
    intro: string;
    journey: string[];
    philosophy: string;
    differentiators: string[];
    cta: string;
    keywords: string[];
    personalInfo: {
        name: string;
        title: string;
        description: string;
        phone: string;
        email: string;
        education: string;
        address: string;
        languages: string[];
    };
    qualificationsData: {
        qualifications: {
            EducationData: Array<{
                title: string;
                institution: string;
                year: string;
                icon: string;
            }>;
            CertificationData: Array<{
                title: string;
                institution: string;
                year: string;
                icon: string;
            }>;
        };
    };
}

export interface SkillItem {
    label?: string;
    name?: string;
    value?: string;
    details?: string;
    projectTitle?: string;
    projectUrl?: string;
    relatedProjects?: {
        title: string;
        url: string;
    }[];
}

export interface SkillGroup {
    title: string;
    items: SkillItem[];
}

export interface SkillCategory {
    id: string;
    title: string;
    icon: string;
    description: string;
    groups: SkillGroup[];
    footer?: string;
}

export interface SpecializedAchievement {
    title: string;
    icon: string;
    items: string[];
}

export interface ProficiencyLevel {
    title: string;
    skills: string[];
}

export interface SkillsData {
    mainTitle: string;
    subTitle: string;
    coreSpecialty: {
        title: string;
        icon: string;
        description: string;
        skills: SkillItem[];
        impact: string;
    };
    categories: SkillCategory[];
    specializedAchievements: SpecializedAchievement[];
    proficiencySummary: {
        expert: ProficiencyLevel;
        advanced: ProficiencyLevel;
        intermediate: ProficiencyLevel;
        familiar: ProficiencyLevel;
    };
    currentlyLearning: string[];
}

// Landing Page Skills - Solution Architect Stack
export interface LandingSkillItem {
    name: string;
    level: 'Expert' | 'Advanced' | 'Production' | 'Intermediate';
    projects: string;
    relatedProjects?: {
        title: string;
        url: string;
    }[];
}

export interface LandingSkillCategory {
    title: string;
    skills: LandingSkillItem[];
}

export interface LandingSkillsData {
    categories: LandingSkillCategory[];
    keywords: string[];
}

export interface Project {
    id: string;
    title: string;
    tagLine: string;
    category: 'featured' | 'freelance' | 'personal' | 'tech' | 'utility' | 'web' | 'automation';
    type: string;
    shortDescription: string;
    description: string; // Full description
    challenge: string;
    solution: string;
    impact: readonly string[];
    technicalOverview: string;
    techStack: readonly string[];
    badges: readonly string[];
    imageUrl: string;
    liveUrl: string;
    codeUrl: string;
    blogUrl?: string | null;
    featured: boolean;
    metrics?: Record<string, string>;

    // Compatibility / Computed Fields
    image: string; // mapped from imageUrl
    video?: string;
    videoYouTubeId?: string; // YouTube video ID for embed
    links: {
        live: string;
        github: string;
    };
    technologies: Array<{
        name: string;
        icon: React.ElementType;
    }>;
    impactMetrics?: Array<{ label: string; value: string }>; // mapped from metrics
    detailedDescription?: string; // mapped from description
    documentation?: readonly {
        title: string;
        url: string;
    }[];
    gallery?: readonly {
        src: string;
        alt: string;
        type: 'image' | 'video';
    }[];
}

export interface ServiceData {
    id: number;
    title: string;
    subtitle: string;
    problem: string;
    solution: string;
    outcomes: string[];
    tech: string[];
    idealClient: string;
    icon: React.ReactNode;
    image: string;
    relatedProjects?: {
        title: string;
        url: string;
    }[];
}

export interface ExperienceProject {
    title: string;
    url?: string;
    github?: string;
}

export interface ExperienceItem {
    role: string;
    type: string;
    period: string;
    duration: string;
    achievements: string[];
    keyProjects: ExperienceProject[];
}

export interface PortfolioData {
    hero: HeroData;
    about: AboutData;
    skills: SkillsData;
    landingSkills: LandingSkillsData;
    projects: Project[];
    services: ServiceData[];
    experience: ExperienceItem[];
    workBanner: Array<{
        id: number;
        label: string;
        icon: string;
    }>;
}

// --- Data Definitions ---

const heroData: HeroData = {
    name: "Aman Suryavanshi",
    title: "Aman Suryavanshi",
    subtitle: "AI Workflow Architect & Full-Stack Systems Builder",
    tagline: "I Build Self-Healing AI Systems That Drive Revenue",
    description: "My systems have generated ₹300K+ ($3.5K+) in client revenue and reduced manual operations by 80%. I architect end-to-end solutions: autonomous n8n workflows with deterministic state management, LangGraph agent pipelines, and the Next.js dashboards that control them.",
    descriptionHighlight: "₹300K+ Revenue Impact | 80% Task Automation | Production-Grade Systems",
    stats: [
        "₹300K+ Revenue Generated",
        "80% Manual Work Eliminated",
        "15+ Production Workflows"
    ],
    buttons: {
        primary: {
            label: "See My Business Transformations",
            href: "/projects"
        },
        secondary: {
            label: "Book a Discovery Call",
            href: "#contact"
        }
    },
    meta: {
        name: "Aman Suryavanshi",
        description: "AI Workflow Architect building production systems that generate ₹300K+ revenue. Self-healing n8n automation, LangGraph agents, Next.js dashboards. Book a discovery call for your system audit."
    }
};

const aboutData: AboutData = {
    title: "I Architect Systems That Generate Revenue & Scale Operations",
    intro: "From manual chaos to intelligent automation—I build production-grade agentic systems with deterministic state management, closed-loop feedback mechanisms, and self-healing error recovery. My solutions have generated ₹300K+ while eliminating 80% of manual work.",
    journey: [
        "Started building web apps → Discovered n8n automation → Realized 90% of business problems are integration problems → Now architect complete AI-orchestrated systems with production-grade reliability"
    ],
    philosophy: "I don't just code—I architect systems. My strength is building end-to-end solutions that combine intelligent AI agents with robust infrastructure that enterprises can trust.",
    differentiators: [
        "✅ Self-Healing Automation (Dead-Letter Queues, Automatic Retries, Fallback Paths)",
        "✅ Production n8n Expertise (74-node workflows, Docker, Security-Hardened)",
        "✅ Real Revenue Impact (₹300K+ generated, 80% cost reduction)",
        "✅ Complete Systems (Frontend → Automation → AI Agents → Monitoring)"
    ],
    cta: "",
    keywords: [
        "hire AI automation developer",
        "n8n expert business automation",
        "technical solutions architect",
        "automation product owner India"
    ],
    personalInfo: {
        name: "Aman Suryavanshi",
        title: "AI Automation Engineer + Full-Stack Developer",
        description:
            "Building Next.js apps with intelligent n8n automation backends. I create complete solutions where beautiful UIs meet powerful AI-powered workflows. Specializing in LangChain, OpenAI integration, and workflow orchestration that delivers measurable business impact.",
        phone: "", // Removed for privacy
        email: "amansurya.work@gmail.com",
        education: "B.Tech in Electronics and Communication",
        address: "Bengaluru & Delhi, India | Remote",
        languages: ["English", "Hindi"],
    },

    qualificationsData: {
        qualifications: {
            EducationData: [
                {
                    title: "Bachelor of Technology - Electronics",
                    institution: "Maharaja Surajmal Institute of Technology",
                    year: "2020 - 2024 (GGSIPU)",
                    icon: "graduation-cap"
                },
                {
                    title: "12th from CBSE Board - Science",
                    institution: "Army Public School Delhi Cantt",
                    year: "2019 - 2020",
                    icon: "school"
                },
                {
                    title: "10th from CBSE Board",
                    institution: "Army Public School Delhi Cantt",
                    year: "2017 - 2018",
                    icon: "school"
                },
            ],
            CertificationData: [
                {
                    title: "React JS Certification",
                    institution: "Namaste React by Akshay Saini",
                    year: "2024 Feb - May",
                    icon: "code-2"
                },
                {
                    title: "JavaScript Certification",
                    institution: "Udemy",
                    year: "2023 July - December",
                    icon: "code"
                },
                {
                    title: "HTML & CSS Certification",
                    institution: "Cisco ThingQbator",
                    year: "2022 - 2023",
                    icon: "layout-template"
                },
            ],
        },
    },
};

const workBanner: Array<{ id: number; label: string; icon: string }> = [
    // Existing lists
    { id: 1, label: "Full Stack Developer", icon: "Briefcase" },
    { id: 2, label: "UI/UX Designer", icon: "Globe" },
    { id: 3, label: "Agile Practitioner", icon: "Clock" },
    { id: 4, label: "JavaScript Enthusiast", icon: "Code" },
    { id: 5, label: "Next.js Developer", icon: "Layers" },
    { id: 6, label: "API Integration", icon: "Server" },
    { id: 7, label: "Frontend Engineer", icon: "Monitor" },
    { id: 8, label: "Creative Technologist", icon: "Zap" },
    { id: 9, label: "Content Writer", icon: "Feather" },
    { id: 10, label: "Performance Optimizer", icon: "Settings" },
    { id: 11, label: "Figma Designer", icon: "Figma" },
    { id: 12, label: "Database Handling", icon: "Database" },
    { id: 13, label: "SEO Enthusiast", icon: "TrendingUp" },
    { id: 14, label: "AI Video Creator", icon: "Film" },
    { id: 15, label: "AI Image Generator", icon: "ImageIcon" },
    { id: 16, label: "Technical Writer", icon: "Edit3" },
    { id: 17, label: "AI Multimedia Developer", icon: "PenTool" },
    { id: 18, label: "AI Creative Technologist", icon: "Brain" },
    { id: 19, label: "Lifelong Learner", icon: "Book" },
    { id: 20, label: "User-Centered Designer", icon: "PenTool" },
    { id: 21, label: "Web Performance Optimizer", icon: "Package" },
    { id: 22, label: "Tech Blogger", icon: "BookOpen" },
    // New additions based on skills
    { id: 23, label: "n8n Automation Expert", icon: "Workflow" },
    { id: 24, label: "AI Agent Builder", icon: "Bot" },
    { id: 25, label: "RAG Systems", icon: "Database" },
    { id: 26, label: "Prompt Engineering", icon: "MessageSquare" },
    { id: 27, label: "Web Scraping", icon: "Search" },
    { id: 28, label: "React.js Expert", icon: "Code2" },
    { id: 29, label: "TypeScript Wizard", icon: "FileJson" },
    { id: 30, label: "Tailwind CSS", icon: "Palette" },
    { id: 31, label: "Backend Architecture", icon: "Server" },
    { id: 32, label: "DevOps", icon: "Cloud" },
];

const skillsData: SkillsData = {
    mainTitle: "Comprehensive Skills & Expertise",
    subTitle: "A detailed breakdown of my technical capabilities and professional achievements",

    coreSpecialty: {
        title: "AI & Automation Engineering",
        icon: "Bot",
        description: "Core Specialty - Designing and implementing intelligent workflows that operate autonomously",
        skills: [
            {
                name: "n8n (Advanced)",
                details: "Webhook triggers, HTTP requests, binary handling, JSON parsing, SplitInBatches, loops, conditional branching, error handling/retries",
                relatedProjects: [
                    { title: "Omni-Post AI Automation", url: "/projects#n8n-automation-suite" },
                    { title: "Aviators Training Centre", url: "/projects#aviators-training-centre" }
                ]
            },
            {
                name: "Multi-LLM & API Integration",
                details: "GPT-4, Claude, Google Gemini (Pro & Flash), OpenRouter API, Llama, Perplexity, Groq",
                relatedProjects: [
                    { title: "Omni-Post AI Automation", url: "/projects#n8n-automation-suite" }
                ]
            },
            {
                name: "RAG & Vector DBs",
                details: "Retrieval-augmented generation, vector stores, PGVector, Supabase vector features",
                relatedProjects: [
                    { title: "Omni-Post AI Automation", url: "/projects#n8n-automation-suite" }
                ]
            },
            {
                name: "Prompt Engineering",
                details: "Chain-of-Thought, few-shot, role prompting, structured JSON outputs",
                relatedProjects: [
                    { title: "Omni-Post AI Automation", url: "/projects#n8n-automation-suite" }
                ]
            },
            {
                name: "MCP (Model Context Protocol)",
                details: "Documented implementations connecting LLMs to external tools",
                relatedProjects: [
                    { title: "Omni-Post AI Automation", url: "/projects#n8n-automation-suite" }
                ]
            },
            {
                name: "Web Scraping & Automation",
                details: "Firecrawl, Apify for data extraction workflows",
                relatedProjects: [
                    { title: "Omni-Post AI Automation", url: "/projects#n8n-automation-suite" }
                ]
            },
            {
                name: "Speech & Audio APIs",
                details: "Web Speech API (STT/TTS) for voice-controlled apps",
                relatedProjects: [
                    { title: "AV NewsStream", url: "/projects#av-newsstream" },
                    { title: "AV NewsStream", url: "/projects#av-newsstream" }
                ]
            }
        ],
        impact: "Reduced manual processes by 80% through intelligent automation"
    },

    categories: [
        {
            id: "frontend",
            title: "Frontend Development",
            icon: "Layout",
            description: "Building responsive, accessible, and performant user interfaces",
            groups: [
                {
                    title: "Core Frameworks",
                    items: [
                        {
                            label: "React.js",
                            value: "Hooks, Context, Custom Components, Suspense",
                            relatedProjects: [
                                { title: "Foodah", url: "/projects#foodah" },
                                { title: "AV NewsStream", url: "/projects#av-newsstream" },

                                { title: "Barkat Enterprise", url: "/projects#barkat-enterprise" }
                            ]
                        },
                        {
                            label: "Next.js (App Router)",
                            value: "SSR/CSR, Server Actions, ISR, Dynamic Routes",
                            relatedProjects: [
                                { title: "Aviators Training Centre", url: "/projects#aviators-training-centre" },
                                { title: "Portfolio", url: "/projects#portfolio-website" }
                            ]
                        },
                        {
                            label: "TypeScript",
                            value: "Strict typing, Interfaces, Generics",
                            relatedProjects: [
                                { title: "Aviators Training Centre", url: "/projects#aviators-training-centre" },
                                { title: "Portfolio", url: "/projects#portfolio-website" }
                            ]
                        },
                        {
                            label: "JavaScript (ES6+)",
                            value: "Node context for code nodes, data transforms, regex, buffer manipulation",
                            relatedProjects: [
                                { title: "All Projects", url: "/projects" }
                            ]
                        }
                    ]
                },
                {
                    title: "Styling & UI Libraries",
                    items: [
                        {
                            label: "Tailwind CSS",
                            value: "Custom configs, Dark mode, Responsive design",
                            relatedProjects: [
                                { title: "Portfolio", url: "/projects#portfolio-website" },
                                { title: "Foodah", url: "/projects#foodah" },
                                { title: "Barkat Enterprise", url: "/projects#barkat-enterprise" }
                            ]
                        },
                        {
                            label: "Redux Toolkit",
                            value: "State management, Slices, Thunks",
                            relatedProjects: [
                                { title: "Foodah", url: "/projects#foodah" },
                                { title: "AV NewsStream", url: "/projects#av-newsstream" }
                            ]
                        },
                        {
                            label: "Shadcn UI & Framer Motion",
                            value: "UI components and animations",
                            relatedProjects: [
                                { title: "Portfolio", url: "/projects#portfolio-website" },
                                { title: "Aviators", url: "/projects#aviators-training-centre" }
                            ]
                        },
                        {
                            label: "Material UI / DaisyUI",
                            value: "Component libraries for rapid development",
                            relatedProjects: [
                                { title: "E-commerce", url: "/projects#ecommerce-platform" },
                                { title: "AV NewsStream", url: "/projects#av-newsstream" }
                            ]
                        }
                    ]
                }
            ],
            footer: "Focus on pixel-perfect implementation and 95+ Lighthouse scores"
        },
        {
            id: "backend",
            title: "Backend & Infrastructure",
            icon: "Server",
            description: "Robust server-side solutions and cloud infrastructure",
            groups: [
                {
                    title: "Server & Databases",
                    items: [
                        {
                            label: "Node.js & Express.js",
                            value: "Proxy servers, API backends, middleware",
                            projectTitle: "AV NewsStream, CloudNote",
                            projectUrl: "/projects#av-newsstream"
                        },
                        {
                            label: "Firebase (Firestore, Auth, Realtime DB)",
                            value: "Authentication, real-time data, cloud functions",
                            projectTitle: "Aviators Training Centre",
                            projectUrl: "/projects#aviators-training-centre"
                        },
                        {
                            label: "Supabase (Postgres + Vector)",
                            value: "Database memory for AI agents, vector features",
                            projectTitle: "Job Matching Automation",
                            projectUrl: "/projects#n8n-automation-suite"
                        },
                        {
                            label: "Sanity CMS",
                            value: "Schema design, GROQ queries, Portable Text",
                            projectTitle: "Portfolio, Aviators",
                            projectUrl: "/projects#portfolio-website"
                        }
                    ]
                },
                {
                    title: "DevOps & Cloud",
                    items: [
                        {
                            label: "Docker",
                            value: "Containerized n8n, PGVector, self-hosting",
                            projectTitle: "Personal Efficiency Agent",
                            projectUrl: "/projects#n8n-automation-suite"
                        },
                        {
                            label: "Vercel & Netlify",
                            value: "Deployments, Edge Functions, Analytics",
                            projectTitle: "Portfolio, Aviators",
                            projectUrl: "/projects#portfolio-website"
                        },
                        {
                            label: "Cloudflare Workers & Hono",
                            value: "Edge compute, Cloudflare Tunnel for secure local exposure",
                            projectTitle: "Edge Experiments",
                            projectUrl: "/projects#n8n-automation-suite"
                        },
                        {
                            label: "Git & GitHub",
                            value: "CI/CD workflows, Version control",
                            projectTitle: "All Projects",
                            projectUrl: "/projects"
                        }
                    ]
                }
            ],
            footer: "Building scalable, secure, and cost-effective backend solutions"
        },
        {
            id: "ai-engineering",
            title: "Advanced AI Engineering",
            icon: "Brain",
            description: "Leveraging cutting-edge AI models and tools",
            groups: [
                {
                    title: "LLM Orchestration",
                    items: [
                        {
                            label: "LangChain",
                            value: "Chains, Agents, Memory",
                            projectTitle: "RAG Assistant",
                            projectUrl: "/projects#n8n-automation-suite"
                        },
                        {
                            label: "Groq",
                            value: "High-speed inference integration",
                            projectTitle: "Omni-Post AI",
                            projectUrl: "/projects#n8n-automation-suite"
                        },
                        {
                            label: "SerpApi",
                            value: "Real-time search data integration",
                            projectTitle: "Job Scrapers",
                            projectUrl: "/projects#n8n-automation-suite"
                        }
                    ]
                },
                {
                    title: "Tools & APIs",
                    items: [
                        { label: "OpenAI API", value: "GPT-4o, Assistants API" },
                        { label: "Anthropic API", value: "Claude 3.5 Sonnet integration" },
                        { label: "Perplexity API", value: "Online research automation" }
                    ]
                }
            ],
            footer: "Creating intelligent systems that understand and act on data"
        },
        {
            id: "tools",
            title: "Tools & Workflow",
            icon: "Terminal",
            description: "Essential tools for modern development",
            groups: [
                {
                    title: "Development & Testing",
                    items: [
                        {
                            label: "VS Code",
                            value: "Advanced extensions & config",
                            projectTitle: "All Projects",
                            projectUrl: "/projects"
                        },
                        {
                            label: "Postman & Jest",
                            value: "API testing, Unit testing",
                            projectTitle: "AV NewsStream",
                            projectUrl: "/projects#av-newsstream"
                        },
                        {
                            label: "Figma",
                            value: "UI/UX design & prototyping",
                            projectTitle: "Aviators, Portfolio",
                            projectUrl: "/projects#aviators-training-centre"
                        }
                    ]
                },
                {
                    title: "Specialized Libraries",
                    items: [
                        {
                            label: "PDF.js",
                            value: "PDF processing & rendering",
                            projectTitle: "Barkat Enterprise",
                            projectUrl: "/projects#barkat-enterprise"
                        },
                        {
                            label: "QuillJS & Excalidraw",
                            value: "Rich text editors & visual tools",
                            projectTitle: "AI Notion Clone",
                            projectUrl: "/projects#n8n-automation-suite"
                        },
                        {
                            label: "Markdown & Portable Text",
                            value: "Programmatic content formats for Sanity",
                            projectTitle: "Portfolio, Aviators",
                            projectUrl: "/projects#portfolio-website"
                        }
                    ]
                }
            ],
            footer: "Optimizing developer experience and productivity"
        },
        {
            id: "seo",
            title: "SEO & Performance Optimization",
            icon: "Search",
            description: "Achieving top rankings and optimal web vitals",
            groups: [
                {
                    title: "Top Google Rankings & Web Vitals",
                    items: [
                        {
                            label: "Strategies",
                            value: "Advanced SEO Optimization, Core Web Vitals (95+ scores)",
                            projectTitle: "Aviators Training Centre",
                            projectUrl: "/projects#aviators-training-centre"
                        },
                        {
                            label: "Technical",
                            value: "Code Splitting, Tree Shaking, Lazy Loading, Suspense",
                            projectTitle: "Portfolio",
                            projectUrl: "/projects#portfolio-website"
                        },
                        {
                            label: "Content",
                            value: "Schema Markup, Rich Snippets, Meta Tags, Open Graph",
                            projectTitle: "Aviators Training Centre",
                            projectUrl: "/projects#aviators-training-centre"
                        },
                        {
                            label: "Assets",
                            value: "Image Optimization (WebP, lazy loading), Responsive images",
                            projectTitle: "Barkat Enterprise",
                            projectUrl: "/projects#barkat-enterprise"
                        },
                        {
                            label: "Lighthouse Optimization",
                            value: "95+ scores, Performance audits",
                            projectTitle: "Aviators, Portfolio",
                            projectUrl: "/projects#aviators-training-centre"
                        }
                    ]
                }
            ]
        },
        {
            id: "api",
            title: "API Integrations & Third-Party Services",
            icon: "Globe",
            description: "Connecting systems with external services and data sources",
            groups: [
                {
                    title: "Social & Media APIs",
                    items: [
                        {
                            label: "Twitter/X API",
                            value: "v1.1 & v2, OAuth1.0a/OAuth2, media uploads, threading",
                            relatedProjects: [
                                { title: "Omni-Post AI", url: "/projects#n8n-automation-suite" }
                            ]
                        },
                        {
                            label: "LinkedIn API",
                            value: "Multi-image galleries, content distribution",
                            relatedProjects: [
                                { title: "Omni-Post AI", url: "/projects#n8n-automation-suite" }
                            ]
                        },
                        {
                            label: "YouTube API v3",
                            value: "Video embedding, channel data",
                            relatedProjects: [
                                { title: "AV NewsStream", url: "/projects#av-newsstream" }
                            ]
                        }
                    ]
                },
                {
                    title: "Productivity & Auth",
                    items: [
                        {
                            label: "Notion, Airtable, Google Drive",
                            value: "Content management, database integration",
                            relatedProjects: [
                                { title: "Omni-Post AI", url: "/projects#n8n-automation-suite" },
                                { title: "Aviators", url: "/projects#aviators-training-centre" }
                            ]
                        },
                        {
                            label: "Cal.com, Gmail, Resend",
                            value: "Scheduling, email automation",
                            relatedProjects: [
                                { title: "Aviators Training Centre", url: "/projects#aviators-training-centre" }
                            ]
                        },
                        {
                            label: "Clerk, OAuth, Stripe",
                            value: "Auth & payments integration",
                            relatedProjects: [
                                { title: "E-commerce", url: "/projects#ecommerce-platform" }
                            ]
                        },
                        {
                            label: "Swiggy, NewsAPI, Fake Store",
                            value: "Commerce & content APIs",
                            relatedProjects: [
                                { title: "Foodah", url: "/projects#foodah" },
                                { title: "AV NewsStream", url: "/projects#av-newsstream" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "cs",
            title: "Programming & CS Fundamentals",
            icon: "Terminal",
            description: "Strong foundation in computer science principles",
            groups: [
                {
                    title: "Strong Foundation",
                    items: [
                        {
                            label: "Languages",
                            value: "C++, C (Competitive Programming)",
                            projectTitle: "LeetCode Solutions",
                            projectUrl: "/projects"
                        },
                        {
                            label: "DSA",
                            value: "Data Structures & Algorithms (LeetCode)",
                            projectTitle: "LeetCode Solutions",
                            projectUrl: "/projects"
                        },
                        { label: "Concepts", value: "OOP, Computer Networks, System Design basics" },
                        { label: "Problem Solving", value: "Algorithmic thinking, Optimization techniques" }
                    ]
                }
            ]
        },
        {
            id: "communication",
            title: "Content & Communication",
            icon: "FileText",
            description: "Translating technical complexity into clear documentation",
            groups: [
                {
                    title: "Technical Writing & Documentation",
                    items: [
                        {
                            label: "Technical Writing",
                            value: "API docs, README files, User guides, Cataloging",
                            projectTitle: "All Projects",
                            projectUrl: "/projects"
                        },
                        {
                            label: "Content Strategy",
                            value: "SEO keyword research, slug/meta optimization, structured data",
                            projectTitle: "Portfolio, Aviators",
                            projectUrl: "/projects#portfolio-website"
                        },
                        {
                            label: "Build-in-Public",
                            value: "Authentic storytelling, content repurposing, multi-platform distribution",
                            projectTitle: "Omni-Post AI",
                            projectUrl: "/projects#n8n-automation-suite"
                        }
                    ]
                }
            ]
        },
        {
            id: "soft",
            title: "Strategic & Product Skills",
            icon: "Users",
            description: "Personal attributes that drive project success",
            groups: [
                {
                    title: "Product Thinking",
                    items: [
                        {
                            label: "End-to-End Design",
                            value: "Feature design, automation for lead/content workflows",
                            projectTitle: "Aviators, Omni-Post",
                            projectUrl: "/projects#aviators-training-centre"
                        },
                        {
                            label: "Business Mindset",
                            value: "ROI focus, ₹300K+ revenue, 80% cost reduction",
                            projectTitle: "Aviators Training Centre",
                            projectUrl: "/projects#aviators-training-centre"
                        },
                        { label: "Core", value: "Problem Solving, Time Management, Adaptability" },
                        { label: "Team", value: "Teamwork, Collaboration, Leadership, Mentoring" }
                    ]
                }
            ]
        }
    ],

    specializedAchievements: [
        {
            title: "Performance Engineering",
            icon: "Zap",
            items: [
                "Achieved 95+ Lighthouse scores across multiple production sites",
                "Optimized Core Web Vitals (LCP, FID, CLS)",
                "Reduced page load times by 60% through strategic optimization"
            ]
        },
        {
            title: "Automation Mastery",
            icon: "Bot",
            items: [
                "Built multi-LLM RAG systems for intelligent document querying",
                "Created automated social media posting workflows",
                "Achieved 80% reduction in manual processes (Aviators Training Centre)"
            ]
        },
        {
            title: "SEO Excellence",
            icon: "Search",
            items: [
                "Secured top Google rankings for competitive keywords",
                "Implemented comprehensive technical SEO strategies",
                "Schema markup & rich snippets implementation"
            ]
        },
        {
            title: "Real-Time Applications",
            icon: "Cpu",
            items: [
                "Live data synchronization with Firebase",
                "Real-time collaboration features",
                "Voice-controlled interfaces (hands-free navigation)"
            ]
        },
        {
            title: "User Experience Innovation",
            icon: "Palette",
            items: [
                "Shimmer UI & loading state patterns",
                "Smooth animations with Framer Motion",
                "Accessibility-first design approach",
                "Mobile-first responsive design"
            ]
        }
    ],

    proficiencySummary: {
        expert: {
            title: "Expert (Production-Ready, 3+ Projects)",
            skills: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "Firebase", "n8n", "Git", "SEO", "Performance Optimization"]
        },
        advanced: {
            title: "Advanced (Strong Working Knowledge, 2-3 Projects)",
            skills: ["Redux Toolkit", "Node.js", "Express.js", "Sanity CMS", "Supabase", "LLM Integration", "Vercel", "Material UI"]
        },
        intermediate: {
            title: "Intermediate (Solid Understanding, 1-2 Projects)",
            skills: ["Python", "RAG Systems", "Framer Motion", "Bootstrap", "DaisyUI", "Webhooks", "OAuth2", "QuillJS"]
        },
        familiar: {
            title: "Familiar (Learning/Used Once)",
            skills: ["C++", "DSA", "Webpack", "Parcel", "Alan AI", "ExcaliDraw"]
        }
    },

    currentlyLearning: [
        "Advanced Product Management frameworks",
        "Microservices architecture patterns",
        "WebSockets & real-time communication",
        "Advanced TypeScript patterns",
        "Testing strategies (Jest, React Testing Library)",
        "Docker & containerization",
        "CI/CD pipeline optimization"
    ]
};

// --- Landing Page Skills (Solution Architect Stack) ---

const landingSkillsData: LandingSkillsData = {
    categories: [
        {
            title: "AI & Automation Orchestration",
            skills: [
                {
                    name: "n8n Workflows",
                    level: "Production",
                    projects: "15+ workflows deployed",
                    relatedProjects: [
                        { title: "Omni-Post AI", url: "/projects#n8n-automation-suite" },
                        { title: "Aviators", url: "/projects#aviators-training-centre" }
                    ]
                },
                {
                    name: "Multi-LLM APIs",
                    level: "Expert",
                    projects: "GPT-4, Claude, Gemini, OpenRouter",
                    relatedProjects: [
                        { title: "Omni-Post AI", url: "/projects#n8n-automation-suite" }
                    ]
                },
                // TODO: Uncomment when RAG project is ready
                // {
                //     name: "LangChain + RAG",
                //     level: "Advanced",
                //     projects: "Personal RAG Agent",
                //     relatedProjects: [
                //         { title: "Omni-Post AI", url: "/projects#n8n-automation-suite" }
                //     ]
                // },
                {
                    name: "Agentic Workflows",
                    level: "Production",
                    projects: "Multi-step automations",
                    relatedProjects: [
                        { title: "Omni-Post AI", url: "/projects#n8n-automation-suite" }
                    ]
                }
            ]
        },
        {
            title: "Frontend Systems",
            skills: [
                {
                    name: "Next.js 15",
                    level: "Expert",
                    projects: "Aviators Training Centre",
                    relatedProjects: [
                        { title: "Aviators", url: "/projects#aviators-training-centre" },
                        { title: "Portfolio", url: "/projects#portfolio-website" }
                    ]
                },
                {
                    name: "React 18 + TypeScript",
                    level: "Expert",
                    projects: "8+ production apps",
                    relatedProjects: [
                        { title: "Foodah", url: "/projects#foodah" },
                        { title: "AV NewsStream", url: "/projects#av-newsstream" }
                    ]
                },
                {
                    name: "ShadcnUI + Tailwind",
                    level: "Expert",
                    projects: "95+ Lighthouse scores",
                    relatedProjects: [
                        { title: "Portfolio", url: "/projects#portfolio-website" },
                        { title: "Aviators", url: "/projects#aviators-training-centre" }
                    ]
                }
            ]
        },
        {
            title: "Backend & Integration",
            skills: [
                {
                    name: "Firebase + Firestore",
                    level: "Production",
                    projects: "Real-time systems",
                    relatedProjects: [
                        { title: "AV NewsStream", url: "/projects#av-newsstream" }
                    ]
                },
                {
                    name: "Supabase + PostgreSQL",
                    level: "Advanced",
                    projects: "Modern backends",
                    relatedProjects: [
                        { title: "Aviators", url: "/projects#aviators-training-centre" }
                    ]
                },
                {
                    name: "API Orchestration",
                    level: "Expert",
                    projects: "50+ integrations",
                    relatedProjects: [
                        { title: "Omni-Post AI", url: "/projects#n8n-automation-suite" },
                        { title: "Aviators", url: "/projects#aviators-training-centre" }
                    ]
                }
            ]
        }
    ],
    keywords: [
        "n8n automation specialist",
        "AI workflow orchestration",
        "Next.js solutions architect",
        "technical product manager skills"
    ]
};

// --- Projects Data ---

const TechIconMap: Record<string, React.ElementType> = {
    "React": FaReact,
    "React 18": FaReact,
    "Next.js": SiNextdotjs,
    "Next.js 14": SiNextdotjs,
    "Next.js 15": SiNextdotjs,
    "TypeScript": SiTypescript,
    "JavaScript": FaJsSquare,
    "JavaScript ES6+": FaJsSquare,
    "Firebase": SiFirebase,
    "Firestore": Database,
    "Sanity": SiSanity,
    "Sanity CMS": SiSanity,
    "n8n": SiN8N,
    "Tailwind CSS": SiTailwindcss,
    "Tailwind": SiTailwindcss,
    "Shadcn UI": SiShadcnui,
    "Framer Motion": SiFramer,
    "Resend": MdEmail,
    "Cal.com API": FaGlobe,
    "Airtable API": SiAirtable,
    "Telegram Bot API": SiTelegram,
    "Vercel": FaGlobe,
    "Docker": FaDocker,
    "Node.js": FaNodeJs,
    "Vite": SiVite,
    "React Router": Route,
    "PDFJS": MdViewInAr,
    "EmailJS": MdEmail,
    "React LazyLoad": FaMobileAlt,
    "Vercel Analytics": FaChartLine,
    "PostCSS": SiPostcss,
    "React Icons": FaIcons,
    "Redux Toolkit": SiRedux,
    "Redux": SiRedux,
    "Express": Server,
    "DaisyUI": SiDaisyui,
    "Alan AI": FaLanguage,
    "NewsAPI": FaNewspaper,
    "GNews": Webhook,
    "YouTube API": FaYoutube,
    "REST API": Cloud,
    "Parcel": AiOutlineDeploymentUnit,
    "Swiggy API": FaGlobe,
    "GitHub API": FaGithub,
    "OpenAI API": SiOpenai,
    "GPT-4": SiOpenai,
    "LinkedIn API": FaGlobe,
    "Twitter API": FaGlobe,
    "PostgreSQL": SiPostgresql,
    "Nginx": SiNginx,
    "MDX": FileJson,
    "Prism.js": FaPencilRuler,
    "GROQ": Database,
    "Web Speech API": FaLanguage,
    "LocalStorage API": Database,
    "LocalStorage": Database,
    "Material-UI": SiMui,
    "PWA": FaMobileAlt,
    "HTML": FaHtml5,
    "CSS": FaCss3Alt,
    "API Integration": Webhook,
    "SPA": FaGlobe,
    "Performance": FaChartLine,
    "Automation": AiOutlineDeploymentUnit,
    "CRM": Database,
    "Workflow": Route,
    "Client Work": FaGlobe,
    "Personal": FaGlobe,
    "OAuth2": FaGlobe,
    "Full-Stack": Server,
    "Real-time": FaGlobe,
    "Voice": FaLanguage,
    "News": FaNewspaper,
    "E-Commerce": FaGlobe,
    "B2B": FaGlobe,
    "JAMstack": FaGlobe,
    "PDF": MdViewInAr,
    "Utility": PenTool,
    "Text Processing": FaPencilRuler
};

const getIcon = (name: string) => TechIconMap[name] || FaGlobe;

const rawProjects = [
    {
        id: "aviators-training-centre",
        title: "Aviators Training Centre",
        tagLine: "AI-Powered Aviation Training & Business Management Platform",
        category: "featured",
        type: "freelance",
        shortDescription: "Production-ready flight training platform combining Next.js 15, AI automation, and enterprise integrations. Generated ₹300,000+ in sales through 50+ organic leads with 80% reduction in manual tasks.",
        description: "A comprehensive aviation training management ecosystem built with Next.js 15, TypeScript, and AI-driven automation. The platform integrates Sanity CMS for dynamic content management, Firebase for real-time analytics, and n8n for intelligent workflow orchestration. Features automated email sequences via Resend, Cal.com meeting scheduling, Airtable CRM integration, and AI-powered SEO scoring achieving 96/100 average optimization. The system handles course registrations, student tracking, instructor management, and automated business intelligence-transforming a traditional flight school into a data-driven operation that maintains 95+ Lighthouse scores across all metrics.",
        challenge: "Flight training businesses struggle with manual lead tracking, fragmented communication systems, poor online visibility, and inefficient administrative workflows. Traditional websites fail to capture and nurture leads effectively, resulting in lost revenue opportunities and operational bottlenecks that limit business growth and scalability.",
        solution: "Architected a full-stack Next.js platform with TypeScript, combining server-side rendering for SEO dominance, Firebase for real-time data synchronization, and n8n automation workflows for intelligent lead nurturing. Implemented AI-powered content optimization with automated email sequences, calendar integration via Cal.com, Airtable CRM for lead management, and comprehensive analytics dashboards-all while maintaining exceptional performance with 95+ Lighthouse scores. The modular architecture enables independent scaling of content management, analytics, and automation systems.",
        impact: [
            "Generated ₹300,000+ in direct sales from automated lead pipeline",
            "50+ organic leads captured through #1 Google rankings for niche aviation queries",
            "80% reduction in manual CRM and administrative tasks through n8n automation",
            "40K+ Google Search impressions with 235+ organic clicks demonstrating SEO dominance",
            "95+ Lighthouse performance score across all pages with sub-2 second load times",
            "96/100 average SEO optimization score with AI-powered recommendations",
            "6,000+ total project views demonstrating strong market validation"
        ],
        technicalOverview: "Built on Next.js 15 with App Router architecture, leveraging TypeScript for complete type safety and enhanced developer experience. Sanity CMS powers the headless content management system with scheduled publishing, versioning, and real-time preview capabilities. Firebase Firestore and Realtime Database handle analytics and user data with millisecond-level synchronization. n8n orchestrates complex automation workflows including Cal.com meeting scheduling with timezone conversion, Airtable CRM updates with duplicate detection, Resend email campaigns with dynamic templating, and Telegram notifications for real-time business alerts. Advanced features include React Server Components for optimal performance, automatic image optimization with Next/Image and WebP conversion, lazy loading with Suspense boundaries, code splitting for faster initial loads, role-based access control with Firebase Auth, and comprehensive security measures. Deployed on Vercel with edge functions for global low-latency access and automatic CI/CD pipelines integrated with GitHub.",
        techStack: ["Next.js 15", "TypeScript", "React 18", "Firebase", "Firestore", "Sanity CMS", "n8n", "Tailwind CSS", "Shadcn UI", "Framer Motion", "Resend", "Cal.com API", "Airtable API", "Telegram Bot API", "Vercel", "Docker", "Node.js"],
        badges: ["Next.js", "TypeScript", "Firebase", "AI/Automation", "n8n", "Production", "Freelance", "CRM", "SEO", "Full-Stack"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-13 Homepage Screenshot.webp",
        imageUrlFallback: "https://res.cloudinary.com/dr0lrme36/image/upload/v1764768016/aviators-training-centre/docs-assets/ASSET-13_Homepage_Screenshot.png",
        videoYouTubeId: "7NSVxMqWUGU",
        video: "",
        liveUrl: "https://www.aviatorstrainingcentre.in",
        codeUrl: "https://github.com/AmanSuryavanshi-1/Aviators_Training_Centre",
        blogUrl: "https://www.amansuryavanshi.me/blogs/aviators-training-centre",
        featured: true,
        metrics: {
            revenue: "₹300,000+",
            leads: "50+",
            automation: "80%",
            lighthouse: "95+",
            seo: "96/100",
            views: "6,000+"
        },
        documentation: [
            {
                title: "Executive Summary",
                url: "/projects/aviators-training-centre-executive-summary"
            },
            {
                title: "Technical Documentation",
                url: "/projects/aviators-training-centre-technical-documentation"
            }
        ],
        gallery: [
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/www.aviatorstrainingcentre.in_Blog.webp", alt: "Blog Section", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-14 Contact Form Screenshot.webp", alt: "Contact Form", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-16 Google Search Console Performance.webp", alt: "Google Search Console Performance", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-17 n8n Workflow Canvas - Firebase Trigger.webp", alt: "n8n Workflow - Firebase Trigger", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-18 n8n Workflow Canvas - Cal.com Trigger.webp", alt: "n8n Workflow - Cal.com Trigger", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-19 Mobile Homepage.webp", alt: "Mobile Homepage View", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-20 AvaitorsTrainingCenter_LighthouseScores.webp", alt: "Lighthouse Performance Scores", type: "image" }
        ]
    },
    {
        id: "barkat-enterprise",
        title: "Barkat Enterprise",
        tagLine: "Premium Tiles & Marbles E-Commerce Platform",
        category: "featured",
        type: "freelance",
        shortDescription: "Full-scale React marketplace for tiles and marbles distributor, serving 3,000+ viewers with modern UI/UX and interactive PDF catalogues. Implements JAMstack architecture with WebP optimization and mobile-first design.",
        description: "A sophisticated e-commerce solution built for a premium tiles and marbles business, showcasing 10+ product categories with dynamic filtering and advanced search capabilities. Features auto-rotating hero carousel with hardware-accelerated animations, PDF catalogue viewer with in-browser rendering using PDFJS, EmailJS contact integration for lead capture, and comprehensive product showcases with lazy-loaded image galleries. Optimized for performance with Vite build tool achieving sub-2 second initial load times, React LazyLoad for intersection observer-based image loading, and Vercel Analytics for comprehensive user behavior tracking. The platform demonstrates enterprise-level attention to detail with custom category management, subcategory filtering hierarchies, smooth CSS animations with GPU acceleration, WCAG 2.1 accessibility compliance, and mobile-first responsive design optimized for Indian device landscape.",
        challenge: "Traditional tile showrooms struggle to showcase vast product inventories online effectively. Customers need high-quality imagery, detailed specifications, and easy catalogue access-all while maintaining fast load times across mobile networks in India. The challenge was to create an engaging digital experience that matches the tactile showroom experience while handling hundreds of product images efficiently.",
        solution: "Developed a React 18 + Vite powered single-page application with TailwindCSS utility-first styling and custom design system. Implemented dynamic product filtering system with category/subcategory hierarchies, real-time keyword search with debouncing, and lazy-loaded image galleries using intersection observer API. Integrated PDFJS for in-browser catalogue viewing and download capabilities, EmailJS for serverless contact form submissions with validation, and React Router for seamless client-side navigation. Applied mobile-first design principles with responsive breakpoints specifically optimized for Indian mobile devices. Converted all images to WebP format achieving 30-50% size reduction while maintaining visual quality.",
        impact: [
            "3,000+ viewers with strong engagement metrics and low bounce rate",
            "60+ organic leads generated through contact forms and direct inquiries",
            "Sub-2 second initial load time via WebP compression and lazy loading",
            "Mobile conversion rate improvement through responsive design optimization",
            "Reduced catalogue distribution costs via digital PDF system",
            "Measurable B2B conversions and repeat customer inquiries"
        ],
        technicalOverview: "React 18.3.1 with functional components and custom hooks architecture, built with Vite 5.4.1 for lightning-fast hot module replacement and optimized production builds with automatic code splitting. TailwindCSS 3.4.10 provides utility-first styling with custom design tokens for brand consistency and dark mode support. React Router DOM 6.27.0 handles client-side routing with smooth page transitions and nested routes. PDFJS-Dist enables full-featured in-browser PDF rendering without external downloads. EmailJS Browser 4.4.1 powers serverless contact forms with email template management. React LazyLoad 3.2.1 implements intersection observer-based image loading with placeholder components. Vercel Analytics tracks user behavior, conversion funnels, and performance metrics. PostCSS with Autoprefixer ensures cross-browser compatibility across legacy browsers. ESLint and Prettier maintain code quality standards throughout development.",
        techStack: ["React 18", "Vite", "Tailwind CSS", "JavaScript ES6+", "React Router", "PDFJS", "EmailJS", "React LazyLoad", "Vercel Analytics", "PostCSS", "React Icons"],
        badges: ["React", "Vite", "Tailwind", "Freelance", "E-Commerce", "PDF", "B2B", "Production", "JAMstack"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/BarkatEnterprise/Enterprise.webp",
        imageUrlFallback: "https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/BarkatEnterprise/Enterprise",
        videoYouTubeId: "jBLsJyNLVcA",
        video: "https://youtu.be/jBLsJyNLVcA?si=lJD-UdtayphOBRlH",
        liveUrl: "https://barkat-enterprise-copy.vercel.app/",
        codeUrl: "https://github.com/AmanSuryavanshi-1/BarkatEnterprise",
        blogUrl: "https://www.amansuryavanshi.me/blogs/a-freelance-project-for-an-enterprise",
        featured: false,
        metrics: {
            viewers: "3,000+",
            leads: "50+",
            loadTime: "< 2s",
            imageOptimization: "30-50%"
        },
        gallery: [
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/BarkatEnterprise/Enterprise.webp", alt: "Desktop Homepage", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/BarkatEnterprise/Enterprise-mobile.webp", alt: "Mobile View", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/BarkatEnterprise/barkat-enterprise-Header.webp", alt: "Header Section", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/BarkatEnterprise/barkat-enterprise-AboutUs.webp", alt: "About Us Section", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/BarkatEnterprise/barkat-enterprise-Catalogues.webp", alt: "Catalogues Section", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/BarkatEnterprise/barkat-enterprise-Products.webp", alt: "Products Section", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/BarkatEnterprise/barkat-enterprise-Contact Page.webp", alt: "Contact Section", type: "image" }
        ],
        documentation: [
            {
                title: "Technical Documentation",
                url: "/projects/barkat-enterprise-technical-documentation"
            }
        ]
    },
    {
        id: "av-newsstream",
        title: "AV NewsStream",
        tagLine: "Real-Time Multi-Source News Aggregator with Voice Control",
        category: "featured",
        type: "personal",
        shortDescription: "Production-ready news aggregation platform with intelligent API key rotation across 9 keys and 10-minute caching. Features voice-enabled navigation via Alan AI and text-to-speech-reducing API calls by 90%.",
        description: "An enterprise-grade news platform solving the API rate limit challenge through smart key rotation across 9 API keys (3 per service). Aggregates articles and videos from NewsAPI, GNews, and YouTube into a unified real-time feed with advanced duplicate detection algorithms. Alan AI voice integration enables hands-free control for multitasking users with custom intent recognition. Custom Node.js/Express backend manages intelligent API rotation, implements 10-minute response caching with TTL management, and provides health monitoring endpoints for system status. Redux Toolkit manages application state including saved articles with persistence, search filters, and category preferences. Advanced features include load-more pagination for infinite scroll, cross-source search with relevance ranking, graceful degradation when APIs fail with automatic fallback, and real-time API health tracking dashboard.",
        challenge: "Free-tier API limits (100 requests/day per key) make real-time news aggregation impossible without intelligent management. Users need fresh content from multiple sources while developers face rate limiting, high API costs, and complex state management across diverse data structures from different APIs with inconsistent schemas.",
        solution: "Engineered a dual-architecture system: React frontend with Redux Toolkit for global state management, and Node.js/Express API server implementing intelligent key rotation with health tracking. Built custom ApiKeyManager.js handling automatic failover on rate limits with 15-minute cooldown periods, health metrics per key with success/failure tracking, and smart load distribution. Implemented 10-minute cache using in-memory storage with TTL reducing redundant API calls by 90%. Added Alan AI voice SDK for hands-free navigation with custom commands and Web Speech API for text-to-speech article reading. Created duplicate detection system using content hashing to merge similar articles from different sources.",
        impact: [
            "90% reduction in API calls through intelligent caching and deduplication",
            "300+ requests/day capacity across rotated keys vs 100 single-key limit",
            "Seamless user experience even during API failures with automatic fallback",
            "Voice control enables accessibility and multitasking for users on-the-go",
            "Production-ready architecture handling 1,000+ daily users without issues",
            "Zero downtime during API rate limit situations"
        ],
        technicalOverview: "React 18 frontend built with Vite for optimal development experience and minimal bundle size. Redux Toolkit manages global state with createSlice API for articles, filters, saved content, and user preferences. Node.js/Express backend implements RESTful API proxy with custom middleware for key rotation, in-memory caching with TTL expiration, CORS handling, and request logging. NewsAPI provides top headlines and search, GNews supplies global news coverage, YouTube Data API v3 fetches video content with metadata. Alan AI Studio integration enables voice commands with custom intents for navigation, search, article playback. DaisyUI component library built on TailwindCSS provides responsive, accessible UI components. Health check endpoint monitors API key status and system performance. Deployed on Vercel (frontend) with Vercel Serverless Functions and separate Node.js hosting (backend) with environment variable management for API keys and security.",
        techStack: ["React 18", "Redux Toolkit", "Node.js", "Express", "Vite", "DaisyUI", "Tailwind CSS", "Alan AI", "NewsAPI", "GNews", "YouTube API", "REST API", "Vercel"],
        badges: ["React", "Node.js", "AI", "Voice", "News", "API Integration", "Production", "Personal", "Real-time"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AV-NewsStream/AV-NewsStream.webp",
        imageUrlFallback: "https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/AV-NewsStream/AV-NewsStream",
        videoYouTubeId: "IkFf7UnI2U4",
        video: "https://youtu.be/IkFf7UnI2U4?si=q6VRi0EjbrmBhnZM",
        liveUrl: "https://avnews.vercel.app",
        codeUrl: "https://github.com/AmanSuryavanshi-1/AV-News-Stream",
        blogUrl: "https://www.amansuryavanshi.me/blogs/av-news-stream",
        featured: false,
        metrics: {
            apiReduction: "90%",
            capacity: "300/day",
            uptime: "99.9%",
            users: "1,000+"
        },
        gallery: [
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AV-NewsStream/AV-NewsStream.webp", alt: "Desktop Homepage", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AV-NewsStream/AV-NewsStream-mobile.webp", alt: "Mobile View", type: "image" }
        ],
        documentation: [
            {
                title: "Technical Documentation",
                url: "/projects/av-newsstream-technical-documentation"
            }
        ]
    },
    {
        id: "foodah",
        title: "Foodah",
        tagLine: "Live Restaurant Discovery Platform with Swiggy API Integration",
        category: "featured",
        type: "personal",
        shortDescription: "High-performance food ordering platform with real-time Swiggy API integration and custom React hooks. Implements lazy loading and shimmer UI to handle 14,000+ JSON lines-achieving 40% reduction in initial load time.",
        description: "A sophisticated restaurant discovery and food ordering interface demonstrating advanced React patterns and API integration mastery. Fetches live data directly from Swiggy's hosted API with over 14,000 lines of JSON restaurant data, implementing optional chaining for graceful error handling across deeply nested restaurant objects. Custom hooks include useOnlineStatus for network detection with visual indicators, useRestaurantMenu for optimized menu data fetching with AbortController, and useFallbackImage for handling missing images with intelligent random alternatives. GitHub API integration dynamically populates the About Developer section with real-time profile data. Features include category-based filtering with smooth animations, real-time search functionality with debouncing, restaurant details pages with nested menu accordions, shopping cart management with Redux Toolkit, and contact form via EmailJS with validation. Built with Parcel bundler for zero-config hot module replacement and automatic code splitting.",
        challenge: "Food ordering apps struggle with large dataset rendering (14,000+ JSON lines), API inconsistencies with frequently changing data structures, missing or broken images affecting user experience, and poor offline handling leaving users confused. Users expect instant loading and smooth 60fps scrolling across thousands of restaurant listings without performance degradation or layout shifts.",
        solution: "Architected a React application leveraging Parcel bundler for automatic code splitting and tree shaking. Implemented React.lazy() with Suspense for route-level code splitting reducing initial bundle size. Created custom useOnlineStatus hook detecting navigator.online events to display clear network error messages. Built useFallbackImage hook replacing broken images with random alternatives from curated fallback array with smooth transitions. Applied shimmer UI patterns during data loading for enhanced perceived performance. Used React Context for cart management with localStorage persistence and Redux Toolkit for global state. Optimized re-renders with React.memo and useCallback for expensive operations. Implemented intersection observer for lazy loading restaurant cards as user scrolls.",
        impact: [
            "40% reduction in initial page load time via code splitting and lazy loading",
            "Smooth 60fps scrolling through thousands of restaurant cards without lag",
            "Zero broken images through intelligent fallback system with preloaded alternatives",
            "Graceful offline handling with clear user feedback and retry mechanisms",
            "Production-ready error boundaries preventing app crashes from API issues",
            "Enhanced user engagement with seamless infinite scroll experience"
        ],
        technicalOverview: "React 18 with functional components and hooks-based state management, following modern React patterns. Parcel bundler provides zero-config development environment with hot module replacement, automatic Babel transforms, PostCSS processing with Autoprefixer, and aggressive tree shaking for minimal production bundles. React Router DOM handles client-side routing with nested routes for restaurant details and lazy loading for code splitting. TailwindCSS utility classes enable rapid UI development with custom responsive design system. React Icons provide scalable SVG icon components for consistent iconography. EmailJS Browser enables serverless contact form submissions with email templates. Custom hooks abstract complex logic: useOnlineStatus monitors window online/offline events with state persistence, useRestaurantMenu fetches and caches menu data with AbortController for request cancellation and stale data handling, useFallbackImage implements onError handlers with fallback queue management. Deployed on Vercel with automatic HTTPS, global CDN distribution, and edge caching.",
        techStack: ["React 18", "JavaScript ES6+", "Parcel", "Tailwind CSS", "React Router", "Redux Toolkit", "EmailJS", "PostCSS", "React Icons", "Swiggy API", "GitHub API"],
        badges: ["React", "JavaScript", "Redux", "Tailwind", "API Integration", "SPA", "Personal", "Performance"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Foodah/Foodah.webp",
        imageUrlFallback: "https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/Foodah/Foodah",
        videoYouTubeId: "GwJz9MRstuU",
        video: "https://youtu.be/GwJz9MRstuU?si=zzajq4uzGzrCnssT",
        liveUrl: "https://foodah.vercel.app",
        codeUrl: "https://github.com/AmanSuryavanshi-1/Foodah",
        blogUrl: "https://www.amansuryavanshi.me/blogs/foodah",
        featured: false,
        metrics: {
            loadReduction: "40%",
            performance: "60fps",
            dataSize: "14,000+ lines"
        },
        gallery: [
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Foodah/Foodah.webp", alt: "Desktop Homepage", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Foodah/Foodah-mobile.webp", alt: "Mobile View", type: "image" }
        ],
        documentation: [
            {
                title: "Technical Documentation",
                url: "/projects/foodah-technical-documentation"
            }
        ]
    },
    {
        id: "n8n-automation-suite",
        title: "Omni-Post AI Automation",
        tagLine: "One-Click Multi-Platform Content Repurposing & AI-Powered Social Distribution",
        category: "featured",
        type: "automation",
        shortDescription: "A fully automated, AI-driven workflow (orchestrated in n8n) that ingests long-form content (blog/article/YouTube/video/Notion), intelligently summarizes and repurposes it for multiple social channels, and publishes on LinkedIn and Twitter/X-all in a single click, with analytics, error recovery, and audit trail. Purpose-built for build-in-public founders, creators, and marketers who want to go viral and compound their audience with minimal friction.",
        description: "A fully automated, AI-driven workflow (orchestrated in n8n) that ingests long-form content (blog/article/YouTube/video/Notion), intelligently summarizes and repurposes it for multiple social channels, and publishes on LinkedIn and Twitter/X-all in a single click, with analytics, error recovery, and audit trail. Purpose-built for build-in-public founders, creators, and marketers who want to go viral and compound their audience with minimal friction. Core Features include: Multi-Source Content Support (Markdown, Notion, YouTube, Web), AI-Powered Repurposing using GPT-4 for platform-native posts (Twitter threads, LinkedIn articles), Automated Distribution via OAuth2 APIs with error recovery, Single-Click Workflow execution, and Advanced Logging & Analytics in Notion/Google Sheets. The system is developer-ready with open-sourced workflows, modular nodes, and robust fallback logic.",
        challenge: "Build-in-public founders and creators struggle to maintain consistent, high-quality presence across multiple platforms (LinkedIn, Twitter/X) while focusing on building. Manual repurposing is time-consuming, error-prone, and often leads to burnout. Existing tools lack deep customization for 'voice' and specific formatting needs of each platform, resulting in generic, low-engagement content.",
        solution: "Engineered a comprehensive Omni-Post AI Automation workflow in n8n that acts as a personal content team. It ingests content from any source, uses prompt-tuned GPT-4 to generate platform-native posts, and handles distribution via official APIs. Features include intelligent error handling, rate limit management, and a centralized dashboard for analytics. The system preserves the creator's unique voice while maximizing reach through strategic formatting and timing.",
        impact: [
            "Used daily to power a build-in-public content flywheel with zero manual copy-pasting",
            "Contributed to 6,000+ total views and dozens of direct inbound leads/sales",
            "Frictionless, omnichannel distribution with single-click execution",
            "Helps creators break out of single-platform silos and build cross-network reputation",
            "Fully open-sourced workflow for community use and customization"
        ],
        technicalOverview: "Built entirely in n8n with a modular node architecture. Leverages OpenAI GPT-4 for intelligent content processing with custom prompt engineering for platform-specific tone and formatting. Integrates Twitter/X API v2 and LinkedIn API via OAuth2 for authenticated publishing. Uses Notion API for content archiving and logging. Implements robust error handling with retry logic, exponential backoff, and fallback mechanisms. Features custom HTTP nodes for data fetching and transformation, and Telegram/Email integrations for real-time notifications.",
        techStack: ["n8n", "OpenAI GPT-4", "Twitter API", "LinkedIn API", "Notion API", "Telegram API", "Node.js", "HTTP/REST", "OAuth2", "Webhooks"],
        badges: ["n8n", "AI", "Automation", "Content", "Build-in-Public", "Open Source", "Workflow", "GPT-4"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Part_1_Generation_Workflow.webp",
        imageUrlFallback: "https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/Omni_post_Ai_autoamtion/omni_post_ai_assets/Part_1_Generation_Workflow",
        liveUrl: "https://n8n.aviatorstrainingcentre.in",
        codeUrl: "https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/tree/main/Omni-Post-AI-Automation",
        blogUrl: "https://www.amansuryavanshi.me/blogs/n8n-automation",
        featured: true,
        metrics: {
            views: "6,000+",
            leads: "Dozens",
            friction: "Zero",
            distribution: "Omnichannel"
        },
        gallery: [
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Part_1_Generation_Workflow.webp", alt: "Part 1: Generation Workflow", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Part_2_Distribution_Workflow.webp", alt: "Part 2: Distribution Workflow", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_2_Notion_Database_Schema_FullSize_Screenshot_zoomable.webp", alt: "Notion Database Schema", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_3_Metrics_Dashboard.webp", alt: "Metrics Dashboard", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_4_Error_Handling_Architecture.webp", alt: "Error Handling Architecture", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_5_LLM_Routing.webp", alt: "LLM Routing Architecture", type: "image" }
        ],
        documentation: [
            {
                title: "Executive Summary",
                url: "/projects/omni-post-ai-executive-summary"
            },
            {
                title: "Technical Documentation",
                url: "/projects/omni-post-ai-technical-documentation"
            }
        ]
    },
    {
        id: "portfolio-website",
        title: "AmanSuryavanshi.dev",
        tagLine: "Modern Developer Portfolio & Technical Blog Platform",
        category: "featured",
        type: "personal",
        shortDescription: "SEO-optimized developer portfolio built with Next.js 14, TypeScript, and Sanity CMS-achieving 6,000+ project views and 95+ Lighthouse scores. Features automated social media distribution via n8n workflows.",
        description: "A meticulously crafted personal brand platform showcasing technical expertise through interactive project galleries, detailed case studies, and in-depth technical blog articles. Sanity CMS enables markdown-based content authoring with real-time preview, version control, and scheduled publishing capabilities. Dynamic project pages pull from centralized projectsData.tsx with advanced filtering by technology tags, project type, and featured status. Blog system supports full MDX with code syntax highlighting via Prism.js, auto-generated table of contents with smooth scroll anchoring, estimated reading time calculations, related post suggestions using content similarity algorithms, and social sharing optimization with Open Graph meta tags. Omni-Post AI Automation workflow (n8n) ingests published blog posts via webhooks, generates platform-specific summaries via OpenAI GPT-4 with tone optimization, and distributes to LinkedIn and Twitter automatically-amplifying reach while maintaining consistent posting schedule. Implements advanced SEO with structured data, meta tag generation, sitemap automation, and RSS feed.",
        challenge: "Developer portfolios often become outdated static pages that don't reflect current skills, project evolution, or technical growth. Manual social media promotion is time-consuming, inconsistent, and limits content reach. Traditional blog platforms lack technical depth and code presentation quality required for developer audiences. Maintaining multiple platforms (portfolio, blog, social media) creates fragmentation and inconsistent branding.",
        solution: "Built with Next.js 14 App Router for optimal SEO through server-side rendering and automatic performance optimizations. Implemented Sanity CMS headless architecture allowing content updates without redeployment and enabling non-technical collaboration. Created reusable component library with Shadcn UI and TailwindCSS for consistent design language and rapid development. Developed custom MDX renderer with code syntax highlighting, responsive image embeds with Next/Image optimization, and interactive code playgrounds. Integrated Framer Motion for smooth page transitions, scroll-triggered animations, and micro-interactions. Built Omni-Post n8n workflow automating content distribution: webhook trigger on Sanity blog publish → OpenAI API summarization with platform-specific prompts → LinkedIn/Twitter OAuth posting with media upload → Google Drive archival for records. Implemented comprehensive analytics with Vercel Analytics and custom event tracking.",
        impact: [
            "6,000+ total project views demonstrating strong reach and engagement",
            "95+ Lighthouse scores across Performance, Accessibility, SEO, Best Practices",
            "Automated social media presence with 70% time savings on content distribution",
            "Direct source of freelance client inquiries and job opportunities from portfolio",
            "Established technical authority through consistent, high-quality blog content",
            "Improved SEO rankings for target keywords in developer space"
        ],
        technicalOverview: "Next.js 14.2.5 with App Router enables file-based routing, React Server Components for optimal performance, automatic code splitting, and built-in image optimization. TypeScript 5.5.2 provides complete type safety across 100% of codebase with strict mode enabled. TailwindCSS 3.4.10 with custom design tokens ensures brand consistency and supports dark mode with system preference detection. Shadcn UI components built on Radix UI primitives offer accessible, customizable UI elements with keyboard navigation support. Framer Motion 11.5.4 powers declarative animations with spring physics and gesture recognition. Sanity.io (v3.88.2) serves as headless CMS with GROQ query language for efficient content fetching, real-time collaboration, and content versioning. Next.js Image component handles automatic WebP/AVIF conversion, lazy loading with blur placeholders, and responsive srcsets for optimal delivery. Vercel deployment provides global edge functions, automatic HTTPS with SSL, and CDN distribution. Omni-Post workflow uses n8n with OpenAI GPT-4 API for intelligent summarization considering platform context, Twitter API v2 and LinkedIn API for OAuth-authenticated posting with media upload, and Google Drive API for content archival.",
        techStack: ["Next.js 14", "TypeScript", "React 18", "Sanity CMS", "Tailwind CSS", "Shadcn UI", "Framer Motion", "MDX", "Prism.js", "n8n", "OpenAI API", "Vercel", "GROQ"],
        badges: ["Next.js", "TypeScript", "Sanity", "Blog", "SEO", "Automation", "Personal", "Portfolio", "MDX"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Portfolio/amansuryavanshi-dev.vercel.app_Header.webp",
        imageUrlFallback: "https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/Portfolio/amansuryavanshi-dev_vercel_app_Header",
        liveUrl: "https://www.amansuryavanshi.me",
        codeUrl: "https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev",
        blogUrl: "https://www.amansuryavanshi.me/blogs",
        featured: false,
        metrics: {
            views: "6,000+",
            lighthouse: "95+",
            automation: "70%",
            seo: "96/100"
        },
        gallery: [
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Portfolio/amansuryavanshi-dev.vercel.app_Header.webp", alt: "Homepage Header", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Portfolio/amansuryavanshi-dev.vercel.app_Projects.webp", alt: "Projects Section", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Portfolio/amansuryavanshi-dev.vercel.app_blogs.webp", alt: "Blogs Section", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Portfolio/amansuryavanshi-dev.vercel.app_contact_us.webp", alt: "Contact Section", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Portfolio/Portfolio-blog.webp", alt: "Blog Page", type: "image" }
        ]
    },
    {
        id: "ecommerce-platform",
        title: "E-Commerce Platform",
        tagLine: "Full-Stack Shopping Platform with Cart Management",
        category: "web",
        type: "personal",
        shortDescription: "React-based e-commerce clone with multiple responsive pages, product search, shopping cart, and checkout flow. Demonstrates API integration, state management, and modern e-commerce UX patterns.",
        description: "A comprehensive e-commerce web application mimicking modern shopping platforms with full product browsing, search, and checkout functionality. Features include multi-page architecture with product listings and detail pages, advanced product search with filters and sorting, shopping cart management with Redux Toolkit for persistent state, product detail pages with image galleries and specifications, checkout flow with form validation, and responsive design optimized for mobile shopping experiences. Implements Material-UI components for consistent design language, React Router for seamless navigation, and API integration for dynamic product data.",
        challenge: "E-commerce platforms require complex state management across product catalogs, user carts, and checkout processes. Building smooth user experiences with real-time cart updates, product filtering, and responsive design presents significant technical challenges for frontend developers.",
        solution: "Built a scalable React application using Redux Toolkit for global cart state management with persistent localStorage. Implemented React Router for multi-page navigation with lazy loading for improved performance. Used Material-UI component library for consistent, accessible UI elements. Created custom hooks for product filtering, sorting, and search functionality. Applied responsive design patterns for optimal mobile shopping experience.",
        impact: [
            "Seamless shopping experience across devices with responsive design",
            "Persistent cart management across sessions using Redux + localStorage",
            "Advanced product filtering and search improving user experience",
            "Production-ready e-commerce patterns and best practices"
        ],
        technicalOverview: "React 18 application with Redux Toolkit for state management and Redux Persist for localStorage integration. React Router DOM handles multi-page navigation with nested routes. Material-UI provides component library with theming support. Custom hooks manage product filtering logic, cart calculations, and API data fetching. Deployed on Vercel with automatic builds and preview deployments.",
        techStack: ["React 18", "Redux Toolkit", "Material-UI", "React Router", "JavaScript ES6+", "LocalStorage", "Vercel"],
        badges: ["React", "Redux", "Material-UI", "E-Commerce", "Personal", "Full-Stack"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Ecommerce/E-coomerce.webp",
        imageUrlFallback: "https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/Ecommerce/E-coomerce",
        liveUrl: "https://ase-commerce.netlify.app",
        codeUrl: "https://github.com/AmanSuryavanshi-1/E-commerce-App",
        blogUrl: null,
        featured: false,
        metrics: {
            pages: "Multiple",
            stateManagement: "Redux"
        },
        gallery: [
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Ecommerce/E-coomerce.webp", alt: "Homepage", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/Ecommerce/Ecommerce-Mobile.webp", alt: "Mobile View", type: "image" }
        ]
    }
] as const;

const projectsData: Project[] = rawProjects.map(p => ({
    ...p,
    description: p.shortDescription,
    detailedDescription: p.description,
    image: p.imageUrl,
    links: {
        live: p.liveUrl,
        github: p.codeUrl
    },
    technologies: p.techStack.map(name => ({
        name,
        icon: getIcon(name)
    })),
    impactMetrics: p.metrics ? Object.entries(p.metrics).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        value
    })) : [],
    videoYouTubeId: 'videoYouTubeId' in p ? (p as any).videoYouTubeId : undefined
}));

// --- Services Data ---

const servicesData: ServiceData[] = [
    {
        id: 1,
        title: "Autonomous Revenue Operations",
        subtitle: "AI agents that find, qualify, and nurture leads 24/7",
        problem: "Your sales team spends 70% of time on research and data entry instead of closing deals.",
        solution: "I build LangGraph-powered SDR agents with multi-agent orchestration, memory systems, and human-in-the-loop approval gates. Autonomous lead research, CRM enrichment, and personalized outreach—all running in production.",
        outcomes: ["Lead research on autopilot", "CRM enrichment at scale", "Personalized outreach drafts", "24/7 autonomous operation"],
        tech: ["LangGraph", "n8n", "OpenAI GPT-4", "Supabase Vector", "Airtable"],
        idealClient: "B2B SaaS founders, agencies, sales teams processing 10+ leads/day",
        icon: <GitBranch className="w-5 h-5" />,
        image: "/services/revenue-ops.png",
        relatedProjects: [
            { title: "Case Study: ₹300K Revenue via Automation", url: "/projects/aviators-training-centre-executive-summary" }
        ]
    },
    {
        id: 2,
        title: "Self-Healing Business Automation",
        subtitle: "Production workflows with deterministic state management",
        problem: "Your Zapier workflows crash silently. You find out days later when a customer complains.",
        solution: "I architect 74-node n8n production systems with Dead-Letter Queues (DLQ), automatic retry logic with exponential backoff, closed-loop feedback mechanisms, and real-time Telegram/Slack health alerts. Self-healing means zero silent failures.",
        outcomes: ["99.7% uptime guarantee", "Automatic error recovery", "Real-time health monitoring", "Dead-letter queue processing"],
        tech: ["n8n (Self-Hosted)", "Docker", "PostgreSQL", "Telegram API", "Webhooks", "Redis"],
        idealClient: "Operations teams, content creators, e-commerce businesses needing reliability",
        icon: <Zap className="w-5 h-5" />,
        image: "/services/self-healing.png",
        relatedProjects: [
            { title: "Case Study: 74-Node Content Automation", url: "/projects/omni-post-ai-executive-summary" }
        ]
    },
    {
        id: 3,
        title: "AI Control Center Dashboards",
        subtitle: "Frontend interfaces that let non-technical teams command AI",
        problem: "Your AI agent is powerful but only developers can use it. Your operations team is locked out.",
        solution: "I build Next.js 15 dashboards with real-time state monitoring, approval workflows, and one-click override controls. Non-technical users can pause, approve, and audit AI decisions without touching code. Full observability into agent behavior.",
        outcomes: ["Non-tech user access", "Real-time monitoring", "One-click AI control", "Complete audit trails"],
        tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Firebase Realtime", "Supabase"],
        idealClient: "AI-first startups, internal tools teams, agencies managing AI agents",
        icon: <Layout className="w-5 h-5" />,
        image: "/services/dashboard.png",
        relatedProjects: [
            { title: "Case Study: 95+ Lighthouse Dashboard", url: "/projects/aviators-training-centre-technical-documentation" }
        ]
    },
    {
        id: 4,
        title: "AI Search Dominance Systems",
        subtitle: "Get cited by ChatGPT & Perplexity, not just indexed by Google",
        problem: "Traditional SEO is dying. Your competitors rank on Google, but you're invisible to AI search engines where high-intent buyers now search.",
        solution: "I implement Entity Optimization strategies that influence LLM outputs: structured data that AI engines cite, FAQ schemas for featured snippets, and authority content that makes you the source AI references. Technical SEO + AEO + GEO combined.",
        outcomes: ["40K+ Search Impressions", "AEO Visibility (ChatGPT/Perplexity)", "12% Organic Lead Conversion", "95+ Lighthouse Scores"],
        tech: ["JSON-LD Schema", "Entity Optimization", "FAQ Markup", "Structured Data", "Core Web Vitals"],
        idealClient: "SaaS founders, consultants, and B2B businesses wanting AI-era organic visibility",
        icon: <Search className="w-5 h-5" />,
        image: "/services/seo-dominance.png",
        relatedProjects: [
            { title: "Case Study: 40K+ Impressions via Entity SEO", url: "/projects/aviators-training-centre-executive-summary" }
        ]
    }
];

// --- Experience Data ---

const experienceData: ExperienceItem[] = [
    {
        role: "AI Workflow Architect & Systems Builder",
        type: "Freelance & Indie",
        period: "Jan 2024 - Present",
        duration: "1+ years",
        achievements: [
            "₹300K+ ($3.5K+) revenue generated through self-healing n8n automation systems",
            "15+ workflows deployed with deterministic state management and DLQ architecture",
            "8+ production applications built (Next.js, React, Firebase, AI integration)",
            "50+ active users served across enterprise & startup projects"
        ],
        keyProjects: [
            { title: "Aviators Training Centre", url: "/projects#aviators-training-centre" },
            { title: "Omni-Post AI Automation", url: "/projects#n8n-automation-suite" },
            { title: "Barkat Enterprise", url: "/projects#barkat-enterprise" }
        ]
    },
    {
        role: "React Developer & Frontend Engineer",
        type: "Intensive Skill Building",
        period: "2023 - 2024",
        duration: "1 year",
        achievements: [
            "Built production-grade React apps handling 14,000+ JSON records with 60fps performance",
            "Engineered complex API integrations: intelligent key rotation, caching, rate-limit handling",
            "Mastered React patterns: Redux Toolkit, Custom Hooks, Context API, Lazy Loading, Suspense",
            "Developed full-stack MERN applications with authentication, CRUD operations & Express backends"
        ],
        keyProjects: [
            { title: "Foodah - Food Ordering Platform", url: "/projects#foodah" },
            { title: "AV NewsStream - News Aggregator", url: "/projects#av-newsstream" },
            { title: "E-Commerce Platform", url: "/projects#ecommerce-platform" }
        ]
    }

];

// --- Export ---

export const portfolioData: PortfolioData = {
    hero: heroData,
    about: aboutData,
    skills: skillsData,
    landingSkills: landingSkillsData,
    projects: projectsData,
    services: servicesData,
    experience: experienceData,
    workBanner: workBanner
};

