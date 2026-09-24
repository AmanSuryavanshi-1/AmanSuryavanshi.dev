import { ExperienceItem } from '../types';

export const experienceData: ExperienceItem[] = [
    {
        role: "AI Workflow & Automation Engineer | Technical Solutions Engineer",
        type: "Production & Open Source",
        period: "Jan 2024 - Present",
        duration: "1.5+ years",
        achievements: [
            "Generated ₹300K+ ($3.5K+) client revenue via programmatic SEO, Next.js 15, and 74-node n8n CRM automation (110K+ GSC impressions)",
            "Merged Core PR #276 (+1,483 / -353 lines) in notebooklm-py (16.5k★) fixing domain cookie preservation and Windows asyncio event loops",
            "Architected Vivek-OnPoint platform with Next.js 16, Headless Notion CMS (8 DBs), and an 11-layer defense system (0.67 req/s throttler, bypass snapshots)",
            "Built OmniPost-Core: 122-node self-healing n8n engine with FastMCP (:3010) knowledge gateway and 300 DPI Playwright carousel compiler"
        ],
        keyProjects: [
            { title: "Aviators Training Centre", url: "/projects#aviators-training-centre" },
            { title: "Vivek-OnPoint Platform", url: "/projects#vivek-onpoint-platform" },
            { title: "notebooklm-py PR #276 (16.5k★)", url: "https://github.com/tomaarsen/notebooklm-py/pull/276" },
            { title: "OmniPost-Core", url: "/projects#n8n-automation-suite" }
        ]
    },
    {
        role: "Full-Stack & Systems Engineer | React Developer",
        type: "Full-Stack Engineering",
        period: "2023 - 2024",
        duration: "1 year",
        achievements: [
            "Engineered production React & Next.js web applications handling 14,000+ JSON records with 60fps rendering",
            "Built resilient API proxy servers with automated key rotation across 9 keys and 10-minute caching (AV NewsStream)",
            "Shipped Barkat Enterprise e-commerce catalog with client-side PDF.js rendering and WebP optimization (3,000+ viewers)",
            "Mastered TypeScript, Redux Toolkit, React Server Components, and zero-downtime deployment pipelines"
        ],
        keyProjects: [
            { title: "Barkat Enterprise", url: "/projects#barkat-enterprise" },
            { title: "AV NewsStream", url: "/projects#av-newsstream" },
            { title: "Foodah", url: "/projects#foodah" }
        ]
    }
];
