import { ServiceData } from '../types';

export const servicesData: ServiceData[] = [
    {
        id: 1,
        title: "Autonomous Revenue Operations",
        subtitle: "AI agents that find, qualify, and nurture leads 24/7",
        problem: "Your sales team spends 70% of time on research and data entry instead of closing deals.",
        solution: "I build LangGraph-powered SDR agents with multi-agent orchestration, memory systems, and human-in-the-loop approval gates. Autonomous lead research, CRM enrichment, and personalized outreach—all running in production.",
        outcomes: ["Lead research on autopilot", "CRM enrichment at scale", "Personalized outreach drafts", "24/7 autonomous operation"],
        tech: ["LangGraph", "n8n", "OpenAI GPT-4", "Supabase Vector", "Airtable"],
        idealClient: "B2B SaaS founders, agencies, sales teams processing 10+ leads/day",
        icon: "GitBranch",
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
        icon: "Zap",
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
        icon: "Layout",
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
        icon: "Search",
        image: "/services/seo-dominance.png",
        relatedProjects: [
            { title: "Case Study: 40K+ Impressions via Entity SEO", url: "/projects/aviators-training-centre-executive-summary" }
        ]
    }
];
