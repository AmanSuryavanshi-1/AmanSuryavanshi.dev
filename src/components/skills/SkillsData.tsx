import {
  Workflow,
  Bot,
  Brain,
  Zap,
  Code2,
  Layout,
  Database,
  Server,
  Rocket,
  Search,
  Globe,
  Puzzle,
  Palette,
  Terminal,
  FileText,
  Users,
  Cpu,
  Layers,
  LineChart,
  GitBranch,
  Lock,
  Smartphone,
  MessageSquare,
  Mic
} from 'lucide-react';

export const skillsData = {
  mainTitle: "Comprehensive Skills & Expertise",
  subTitle: "A detailed breakdown of my technical capabilities and professional achievements",

  coreSpecialty: {
    title: "AI & Automation Engineering",
    icon: "Bot",
    description: "Core Specialty - Designing and implementing intelligent workflows that operate autonomously",
    skills: [
      {
        name: "n8n (Advanced)",
        details: "80% process reduction achieved in production",
        projectTitle: "Omni-Post AI Automation",
        projectUrl: "https://github.com/AmanSuryavanshi-1/Omni-Post-AI-Automation"
      },
      {
        name: "Multi-LLM Integration",
        details: "OpenAI GPT-4, Claude 3.5, Gemini Pro, Perplexity",
        projectTitle: "Omni-Post AI Automation",
        projectUrl: "https://github.com/AmanSuryavanshi-1/Omni-Post-AI-Automation"
      },
      {
        name: "RAG Systems",
        details: "Document intelligence & contextual querying",
        projectTitle: "Omni-Post AI Automation",
        projectUrl: "https://github.com/AmanSuryavanshi-1/Omni-Post-AI-Automation"
      },
      { name: "Prompt Engineering", details: "Advanced techniques for optimal LLM outputs" },
      { name: "MCP (Model Context Protocol)", details: "Cutting-edge AI tooling" },
      { name: "OAuth2 & Webhooks", details: "Secure API integrations" },
      {
        name: "Python",
        details: "Automation scripts & AI workflows",
        projectTitle: "Omni-Post AI Automation",
        projectUrl: "https://github.com/AmanSuryavanshi-1/Omni-Post-AI-Automation"
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
              label: "Next.js",
              value: "App Router, Server Actions, SSR/ISR",
              projectTitle: "AmanSuryavanshi.dev",
              projectUrl: "https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev"
            },
            {
              label: "React",
              value: "Hooks, Context, Custom Components",
              projectTitle: "BarkatEnterprise",
              projectUrl: "https://github.com/AmanSuryavanshi-1/BarkatEnterprise"
            },
            {
              label: "TypeScript",
              value: "Strict typing, Interfaces, Generics",
              projectTitle: "Omni-Post AI Automation",
              projectUrl: "https://github.com/AmanSuryavanshi-1/Omni-Post-AI-Automation"
            }
          ]
        },
        {
          title: "Styling & UI",
          items: [
            {
              label: "Tailwind CSS",
              value: "Custom configs, Dark mode, Responsive design",
              projectTitle: "AmanSuryavanshi.dev",
              projectUrl: "https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev"
            },
            { label: "Framer Motion", value: "Complex animations, Page transitions" },
            { label: "Shadcn/UI", value: "Customized accessible components" }
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
          title: "Server & API",
          items: [
            { label: "Node.js", value: "REST APIs, Middleware, Auth" },
            {
              label: "Firebase",
              value: "Auth, Firestore, Cloud Functions",
              projectTitle: "Omni-Post AI Automation",
              projectUrl: "https://github.com/AmanSuryavanshi-1/Omni-Post-AI-Automation"
            },
            {
              label: "Sanity CMS",
              value: "Schema design, GROQ queries",
              projectTitle: "AmanSuryavanshi.dev",
              projectUrl: "https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev"
            }
          ]
        },
        {
          title: "DevOps & Cloud",
          items: [
            {
              label: "Vercel",
              value: "Deployments, Edge Functions, Analytics",
              projectTitle: "AmanSuryavanshi.dev",
              projectUrl: "https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev"
            },
            {
              label: "PowerShell",
              value: "Automation scripting",
              projectTitle: "N8N Repo",
              projectUrl: "https://github.com/AmanSuryavanshi-1/N8N"
            },
            { label: "Git & GitHub", value: "CI/CD workflows, Version control" }
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
              projectTitle: "Omni-Post AI Automation",
              projectUrl: "https://github.com/AmanSuryavanshi-1/Omni-Post-AI-Automation"
            },
            {
              label: "Groq",
              value: "High-speed inference integration",
              projectTitle: "Omni-Post AI Automation",
              projectUrl: "https://github.com/AmanSuryavanshi-1/Omni-Post-AI-Automation"
            },
            {
              label: "SerpApi",
              value: "Real-time search data integration",
              projectTitle: "Omni-Post AI Automation",
              projectUrl: "https://github.com/AmanSuryavanshi-1/Omni-Post-AI-Automation"
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
          title: "Development",
          items: [
            { label: "VS Code", value: "Advanced extensions & config" },
            { label: "Postman", value: "API testing & documentation" },
            { label: "Figma", value: "UI/UX design & prototyping" }
          ]
        },
        {
          title: "Libraries",
          items: [
            {
              label: "pdfjs-dist",
              value: "PDF processing & rendering",
              projectTitle: "BarkatEnterprise",
              projectUrl: "https://github.com/AmanSuryavanshi-1/BarkatEnterprise"
            },
            {
              label: "React Icons",
              value: "Icon integration",
              projectTitle: "BarkatEnterprise",
              projectUrl: "https://github.com/AmanSuryavanshi-1/BarkatEnterprise"
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
            { label: "Strategies", value: "Advanced SEO Optimization, Core Web Vitals (95+ scores)" },
            { label: "Technical", value: "Code Splitting, Tree Shaking, Lazy Loading, Suspense" },
            { label: "Content", value: "Schema Markup, Rich Snippets, Meta Tags, Open Graph" },
            { label: "Assets", value: "Image Optimization (WebP, lazy loading), Responsive images" },
            { label: "Config", value: "Sitemap, Robots.txt, Accessibility (WCAG 2.1 AA)" }
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
          title: "External Services & Data Sources",
          items: [
            { label: "News & Content", value: "News API, GNews.io, Notion API" },
            { label: "Social Media", value: "YouTube API v3, Twitter API, GitHub API" },
            { label: "AI/Voice", value: "Alan AI, Web Speech API (Text-to-Speech, Speech Recognition)" },
            { label: "Commerce", value: "Swiggy API, Fake Store API" },
            { label: "Security", value: "CORS handling, Rate limiting, API security" }
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
            { label: "Languages", value: "C++, C (Competitive Programming)" },
            { label: "DSA", value: "Data Structures & Algorithms (LeetCode)" },
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
            { label: "Writing", value: "Technical Writing, Content Writing, Copywriting" },
            { label: "Docs", value: "API docs, README files, User guides, Cataloging" },
            { label: "Community", value: "Building in Public, Sharing knowledge" }
          ]
        }
      ]
    },
    {
      id: "soft",
      title: "Professional Skills & Qualities",
      icon: "Users",
      description: "Personal attributes that drive project success",
      groups: [
        {
          title: "What Makes Me Effective",
          items: [
            { label: "Core", value: "Problem Solving, Time Management, Adaptability" },
            { label: "Team", value: "Teamwork, Collaboration, Leadership, Mentoring" },
            { label: "Mindset", value: "Creativity, Business Mindset (ROI focus), Building in Public" }
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

export default skillsData;