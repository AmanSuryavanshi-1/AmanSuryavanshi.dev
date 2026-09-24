import { AboutData } from '../types';

export const aboutData: AboutData = {
    hero: {
        badge: "Open to Hybrid/In-Office (Bengaluru, Delhi NCR) & Remote",
        title: "AI Workflow & Automation Engineer",
        subtitle: "Technical Solutions Engineer • Next.js 15/16 • 122-Node n8n Workflows • FastMCP",
        pitch: "\"I architect self-healing AI automations, programmatic SEO platforms, and resilient API integrations that drive verifiable revenue and zero-defect operations.\"",
        skills: [
            { icon: "Workflow", label: "122-Node n8n Workflows" },
            { icon: "Brain", label: "FastMCP & LangGraph" },
            { icon: "Rocket", label: "Next.js 15/16 App Router" },
            { icon: "Layers", label: "Core PR #276 Contributor" },
        ]
    },
    bentoGrid: {
        badge: "The Technical Solutions Profile",
        title: "Building Resilient AI & Full-Stack Systems End-to-End",
        origins: {
            title: "Engineering Origins",
            subtitle: "ECE → AI & Systems",
            description: "Electronics & Communication background shaped my deterministic systems thinking—building digital nervous systems that connect, adapt, and self-correct with zero data loss.",
            icon: "GraduationCap"
        },
        tStack: {
            title: "The T-Shaped Stack",
            subtitle: "My Competitive Edge",
            descriptionPart1: "Most AI builders script prompts but cannot engineer production infrastructure.",
            descriptionPart2: "I engineer the workflows, the API bridges, and the full-stack control plane.",
            highlight: "I engineer the entire ecosystem.",
            icon: "Layers",
            layers: [
                {
                    label: 'Workflow & Agent Orchestration',
                    detail: '122-Node n8n, FastMCP (:3010), LangGraph, DLQs',
                    type: 'depth'
                },
                {
                    label: 'Full-Stack Performance',
                    detail: 'Next.js 15/16, Tailwind CSS, 95+ Lighthouse',
                    type: 'breadth'
                },
                {
                    label: 'Resilient CMS & API Defense',
                    detail: 'Notion API (8 DBs), 11 Defense Layers, Upstash Redis',
                    type: 'breadth'
                },
                {
                    label: 'Programmatic SEO & GEO',
                    detail: '110K+ Impressions, #1 Google Rankings, llms.txt',
                    type: 'breadth'
                },
            ]
        },
        philosophy: {
            title: "Philosophy",
            icon: "Sparkles",
            items: [
                { icon: "Target", label: 'ROI-First Automation', detail: 'Every workflow must drive revenue' },
                { icon: "Workflow", label: 'Systems Over Scripts', detail: 'Self-healing, production-grade' },
                { icon: "Zap", label: 'Ship Fast, Scale Smart', detail: 'MVP to enterprise in weeks' },
            ]
        },
        systemArchitecture: {
            title: "System Architecture",
            subtitle: "99.7% Reliability in Production",
            icon: "Cpu",
            tags: [
                { label: "Deterministic State", icon: "CheckCircle" },
                { label: "Dead Letter Queues", icon: "CheckCircle" },
                { label: "Self-Healing", icon: "Zap" }
            ]
        },
        proofOfWork: {
            title: "Proof of Work",
            subtitle: "Business Transformations & Core Receipts",
            icon: "Code2",
            items: [
                {
                    title: 'Next.js 15 + pSEO & 74-Node n8n Lead Funnel',
                    project: 'Aviators Training Centre',
                    year: '2025',
                    metrics: ['#1 Google', '95+ Lighthouse', '110K+ Impressions', '₹300K Revenue'],
                    url: '/projects/aviators-training-centre-executive-summary',
                    color: 'lime',
                },
                {
                    title: 'Next.js 16 + Headless Notion CMS 11-Layer Defense',
                    project: 'Vivek OnPoint Platform',
                    year: '2025',
                    metrics: ['8 Notion DBs', '0.67 req/s Limit', '99.9% Uptime', 'Zero Content Loss'],
                    url: '/projects#vivek-onpoint-platform',
                    color: 'blue',
                },
                {
                    title: 'notebooklm-py (16.5k★) Core Architecture PR #276',
                    project: 'Google NotebookLM Client',
                    year: '2025',
                    metrics: ['16.5k+ Stars', '+1,483 / -353 Lines', '100% Asyncio Fix', 'Merged'],
                    url: 'https://github.com/tomaarsen/notebooklm-py/pull/276',
                    color: 'purple',
                },
                {
                    title: '122-Node n8n Engine + FastMCP (:3010) Knowledge Bridge',
                    project: 'OmniPost-Core',
                    year: '2025',
                    metrics: ['122 Nodes', 'FastMCP :3010', 'Playwright 300 DPI', '$0/mo Stack'],
                    url: '/projects#n8n-automation-suite',
                    color: 'amber',
                },
            ]
        }
    },
    timeline: {
        badge: "The Journey",
        title: "From ECE to Agentic Systems",
        items: [
            {
                id: 'ece',
                year: '2020',
                title: 'Electronics & Communication Engineering',
                description: 'Started exploring how signals flow through systems—from sensor input to actuator output. This foundation shaped my systems-thinking approach.',
                category: 'education',
            },
            {
                id: 'first-code',
                year: '2021-22',
                title: 'First Lines of Code',
                description: 'Discovered web development. Built my first projects and fell in love with the idea of making computers do the boring work.',
                category: 'milestone',
            },
            {
                id: 'fullstack',
                year: '2023',
                title: 'Full-Stack Development',
                description: 'Mastered React, Next.js, and TypeScript. Started building production-grade applications with 95+ Lighthouse scores.',
                category: 'career',
            },
            {
                id: 'fooda-barkat',
                year: '2024',
                title: 'First Freelance Projects',
                description: 'Delivered Foodah (live restaurant platform with Swiggy API) and Barkat Enterprise (3,000+ viewers, 50+ leads). First taste of client impact.',
                category: 'project',
            },
            {
                id: 'aviators',
                year: '2025',
                title: 'Aviators Training Centre',
                description: '₹300K+ revenue impact through SEO-optimized web presence. Achieved #1 Google rankings. Major client success validation.',
                category: 'project',
                highlight: true,
            },
            {
                id: 'automation',
                year: '2025',
                title: 'n8n & Multi-LLM Mastery',
                description: 'Built 74-node production workflows with 99.7% reliability for Omni-Post AI. Mastered self-healing automation architecture.',
                category: 'career',
                highlight: true,
            },
            {
                id: 'agentic',
                year: '2026',
                title: 'Agentic Systems Era',
                description: 'Combining LangGraph, CrewAI, and n8n AI Agents. The T-Stack: depth in orchestration, breadth across the stack.',
                category: 'milestone',
                highlight: true,
            },
        ]
    },
    // Legacy fields kept for compatibility if needed, or can be deprecated
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
    cta: {
        title: "Let's Create Something Amazing Together!",
        subtitle: "Whether you have a project in mind or just want to connect, I'm always excited to collaborate and bring ideas to life.",
        actionLabel: "Let's Work Together"
    },
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
