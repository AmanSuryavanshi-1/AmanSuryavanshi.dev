import { SkillsData, LandingSkillsData } from '../types';

export const skillsData: SkillsData = {
    mainTitle: "My Technical Ecosystem",
    subTitle: "A living knowledge graph of tools, frameworks, and concepts I use to build production-grade software.",
    coreSpecialty: {
        title: "The Agentic Stack",
        icon: "Brain",
        description: "My primary tech stack for building autonomous AI agents and intelligent workflows.",
        skills: [
            { name: "n8n", value: "Orchestration" },
            { name: "LangChain", value: "Agent Logic" },
            { name: "Supabase", value: "Vector Memory" },
            { name: "Next.js", value: "Control Plane" }
        ],
        impact: "Enables single-person teams to build enterprise-scale operations."
    },

    categories: [
        {
            id: "ai-automation",
            title: "AI & Automation Engineering",
            icon: "Workflow",
            description: "Designing deterministic workflows and autonomous agents",
            groups: [
                {
                    title: "Workflow Orchestration",
                    items: [
                        {
                            label: "n8n (Self-Hosted)",
                            value: "Complex execution pipelines, Error handling, Custom nodes",
                            projectTitle: "Omni-Post AI",
                            projectUrl: "/projects#n8n-automation-suite"
                        },
                        {
                            label: "Webhooks & API Integ",
                            value: "Event-driven architecture, REST/GraphQL",
                            projectTitle: "All Projects",
                            projectUrl: "/projects"
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

export const landingSkillsData: LandingSkillsData = {
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
