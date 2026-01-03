import { AboutData } from '../types';

export const aboutData: AboutData = {
    hero: {
        badge: "Available for new projects",
        title: "Full-Stack Agentic Developer",
        subtitle: "Production n8n Architect • LangGraph Orchestrator • Next.js Systems Builder",
        pitch: "\"I build intelligent multi-agent systems AND the frontend interfaces that let non-technical people control them—end-to-end.\"",
        skills: [
            { icon: "Workflow", label: "Production n8n" },
            { icon: "Brain", label: "Multi-LLM Orchestration" },
            { icon: "Layers", label: "LangGraph Agents" },
            { icon: "Rocket", label: "Next.js Systems" },
        ]
    },
    bentoGrid: {
        badge: "The Expert-Builder Profile",
        title: "Building Intelligent Systems End-to-End",
        origins: {
            title: "Engineering Origins",
            subtitle: "ECE → AI",
            description: "Electronics & Communication background shaped my systems thinking—building digital nervous systems that connect, adapt, and self-correct.",
            icon: "GraduationCap"
        },
        tStack: {
            title: "The T-Shaped Stack",
            subtitle: "My Unfair Advantage",
            descriptionPart1: "Most AI developers build the brain but not the body.",
            descriptionPart2: "I do both.",
            highlight: "I do both.",
            icon: "Layers",
            layers: [
                {
                    label: 'Multi-Agent Orchestration',
                    detail: 'LangGraph + CrewAI + n8n AI Agents',
                    type: 'depth'
                },
                {
                    label: 'Frontend Excellence',
                    detail: 'Next.js 15, 95+ Lighthouse',
                    type: 'breadth'
                },
                {
                    label: 'Workflow Automation',
                    detail: '74-node production n8n',
                    type: 'breadth'
                },
                {
                    label: 'Technical SEO/GEO',
                    detail: '#1 Rankings, AI Search',
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
            subtitle: "Business Transformations, Not Just Projects",
            icon: "Code2",
            items: [
                {
                    title: 'How I Used Next.js + SEO to Generate ₹300K',
                    project: 'Aviators Training Centre',
                    year: '2025',
                    metrics: ['#1 Google', '95+ Lighthouse', '₹300K Revenue'],
                    url: '/projects/aviators-training-centre-executive-summary',
                    color: 'lime',
                },
                {
                    title: 'How I Built a 74-Node Self-Healing Pipeline',
                    project: 'Omni-Post AI',
                    year: '2025',
                    metrics: ['80% Time Saved', '99.7% Reliable', '8+ Platforms'],
                    url: '/projects/omni-post-ai-automation',
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
