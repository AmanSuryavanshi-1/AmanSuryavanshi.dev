import {
  // React Icons - React/Framework
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaGithub,
  FaYoutube,
  FaNewspaper,
  FaLanguage,
  FaPencilRuler,
  FaGlobe,
  FaMobileAlt,
  FaChartLine,
  FaFileArchive,
  FaIcons,
  FaDocker,
  FaNodeJs
} from 'react-icons/fa';

import {
  SiRedux,
  SiTailwindcss,
  SiPostcss,
  SiNetlify,
  SiDaisyui,
  SiVite,
  SiMui,
  SiTypescript,
  SiNextdotjs,
  SiShadcnui,
  SiFramer,
  SiIcon,
  SiFirebase,
  SiSanity,
  SiN8N,
  SiOpenai,
  SiAirtable,
  SiTelegram,
  SiPostgresql,
  SiNginx,
  SiDigitalocean,
  SiGreensock
} from 'react-icons/si';

import {
  // Lucide React - Fallback Icons
  Route,
  FileJson,
  Webhook,
  Component,
  PenTool,
  Database,
  Server,
  Cloud,
  Cpu
} from 'lucide-react';

import { MdEmail, MdViewInAr } from 'react-icons/md';
import { AiOutlineDeploymentUnit } from 'react-icons/ai';

// --- Types ---

export type Project = {
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
};

// --- Icon Mapping ---

const TechIconMap: Record<string, React.ElementType> = {
  "React": FaReact,
  "React 18": FaReact,
  "Next.js": SiNextdotjs,
  "Next.js 14": SiNextdotjs,
  "Next.js 15": SiNextdotjs,
  "TypeScript": SiTypescript,
  "JavaScript": FaJsSquare,
  "JavaScript ES6+": FaJsSquare,
  "Firebase": SiFirebase, // Need to ensure SiFirebase is available or use FaGlobe
  "Firestore": Database,
  "Sanity": SiSanity, // Need to ensure SiSanity is available
  "Sanity CMS": SiSanity,
  "n8n": SiN8N, // Need to ensure SiN8N is available or use AiOutlineDeploymentUnit
  "Tailwind CSS": SiTailwindcss,
  "Tailwind": SiTailwindcss,
  "Shadcn UI": SiShadcnui,
  "Framer Motion": SiFramer,
  "Resend": MdEmail,
  "Cal.com API": FaGlobe,
  "Airtable API": SiAirtable,
  "Telegram Bot API": SiTelegram,
  "Vercel": FaGlobe, // or SiVite/SiNextdotjs related
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

// Helper to get icon
const getIcon = (name: string) => TechIconMap[name] || FaGlobe;

// --- Data ---

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
      "95+ Lighthouse performance score across all pages with sub-2 second load times",
      "96/100 average SEO optimization score with AI-powered recommendations",
      "6,000+ total project views demonstrating strong market validation"
    ],
    technicalOverview: "Built on Next.js 15 with App Router architecture, leveraging TypeScript for complete type safety and enhanced developer experience. Sanity CMS powers the headless content management system with scheduled publishing, versioning, and real-time preview capabilities. Firebase Firestore and Realtime Database handle analytics and user data with millisecond-level synchronization. n8n orchestrates complex automation workflows including Cal.com meeting scheduling with timezone conversion, Airtable CRM updates with duplicate detection, Resend email campaigns with dynamic templating, and Telegram notifications for real-time business alerts. Advanced features include React Server Components for optimal performance, automatic image optimization with Next/Image and WebP conversion, lazy loading with Suspense boundaries, code splitting for faster initial loads, role-based access control with Firebase Auth, and comprehensive security measures. Deployed on Vercel with edge functions for global low-latency access and automatic CI/CD pipelines integrated with GitHub.",
    techStack: ["Next.js 15", "TypeScript", "React 18", "Firebase", "Firestore", "Sanity CMS", "n8n", "Tailwind CSS", "Shadcn UI", "Framer Motion", "Resend", "Cal.com API", "Airtable API", "Telegram Bot API", "Vercel", "Docker", "Node.js"],
    badges: ["Next.js", "TypeScript", "Firebase", "AI/Automation", "n8n", "Production", "Freelance", "CRM", "SEO", "Full-Stack"],
    imageUrl: "/aviators.png",
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
        url: "/docs/aviators-training-centre-executive-summary"
      },
      {
        title: "Technical Documentation",
        url: "/docs/aviators-training-centre-technical-documentation"
      }
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
      "50+ organic leads generated through contact forms and direct inquiries",
      "Sub-2 second initial load time via WebP compression and lazy loading",
      "Mobile conversion rate improvement through responsive design optimization",
      "Reduced catalogue distribution costs via digital PDF system",
      "Measurable B2B conversions and repeat customer inquiries"
    ],
    technicalOverview: "React 18.3.1 with functional components and custom hooks architecture, built with Vite 5.4.1 for lightning-fast hot module replacement and optimized production builds with automatic code splitting. TailwindCSS 3.4.10 provides utility-first styling with custom design tokens for brand consistency and dark mode support. React Router DOM 6.27.0 handles client-side routing with smooth page transitions and nested routes. PDFJS-Dist enables full-featured in-browser PDF rendering without external downloads. EmailJS Browser 4.4.1 powers serverless contact forms with email template management. React LazyLoad 3.2.1 implements intersection observer-based image loading with placeholder components. Vercel Analytics tracks user behavior, conversion funnels, and performance metrics. PostCSS with Autoprefixer ensures cross-browser compatibility across legacy browsers. ESLint and Prettier maintain code quality standards throughout development.",
    techStack: ["React 18", "Vite", "Tailwind CSS", "JavaScript ES6+", "React Router", "PDFJS", "EmailJS", "React LazyLoad", "Vercel Analytics", "PostCSS", "React Icons"],
    badges: ["React", "Vite", "Tailwind", "Freelance", "E-Commerce", "PDF", "B2B", "Production", "JAMstack"],
    imageUrl: "/Project/Enterprise.webp",
    video: "/Project/Videos/BarkatEnterprise-Walkthrough.mp4",
    liveUrl: "https://barkat-enterprise-copy.vercel.app/",
    codeUrl: "https://github.com/AmanSuryavanshi-1/BarkatEnterprise",
    blogUrl: "https://www.amansuryavanshi.me/blogs/a-freelance-project-for-an-enterprise",
    featured: true,
    metrics: {
      viewers: "3,000+",
      leads: "50+",
      loadTime: "< 2s",
      imageOptimization: "30-50%"
    }
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
    imageUrl: "/Project/AV-NewsStream.webp",
    video: "/Project/Videos/AVNewsStream.webm",
    liveUrl: "https://avnews.vercel.app",
    codeUrl: "https://github.com/AmanSuryavanshi-1/AV-News-Stream",
    blogUrl: "https://www.amansuryavanshi.me/blogs/av-news-stream",
    featured: true,
    metrics: {
      apiReduction: "90%",
      capacity: "300/day",
      uptime: "99.9%",
      users: "1,000+"
    }
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
    imageUrl: "/Project/Foodah.webp",
    video: "/Project/Videos/Foodah.webm",
    liveUrl: "https://foodah.vercel.app",
    codeUrl: "https://github.com/AmanSuryavanshi-1/Foodah",
    blogUrl: "https://www.amansuryavanshi.me/blogs/foodah",
    featured: true,
    metrics: {
      loadReduction: "40%",
      performance: "60fps",
      dataSize: "14,000+ lines"
    }
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
    imageUrl: "/n8n-automation.png",
    liveUrl: "https://n8n.aviatorstrainingcentre.in",
    codeUrl: "https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/tree/main/Omni-Post-AI-Automation",
    blogUrl: "https://www.amansuryavanshi.me/blogs/n8n-automation",
    featured: true,
    metrics: {
      views: "6,000+",
      leads: "Dozens",
      friction: "Zero",
      distribution: "Omnichannel"
    }
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
    imageUrl: "/Project/Portfolio.webp",
    liveUrl: "https://www.amansuryavanshi.me",
    codeUrl: "https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev",
    blogUrl: "https://www.amansuryavanshi.me/blogs",
    featured: true,
    metrics: {
      views: "6,000+",
      lighthouse: "95+",
      automation: "70%",
      seo: "Optimized"
    }
  },
  {
    id: "textwise",
    title: "TextWise",
    tagLine: "Multi-Functional Text Manipulation & Note-Taking Tool",
    category: "utility",
    type: "personal",
    shortDescription: "Comprehensive text utility application offering text transformations, word counting, reading time estimation, text-to-speech, and note-taking with localStorage persistence. Features dark/light theme toggle and mobile-first design.",
    description: "A feature-rich text utility and note-taking application built with React, offering comprehensive text manipulation capabilities. Includes uppercase/lowercase/title case transformations with real-time preview, word and character counting with statistics, reading time estimation based on average reading speed, text-to-speech functionality using Web Speech API with voice selection and speed control, and note-taking with localStorage persistence for offline access. Implements dark/light theme toggle with system preference detection, fully responsive mobile-first design optimized for touch interactions, and keyboard shortcuts for power users. Additional features include text reversal, copy to clipboard with visual feedback, extra spaces removal, and text clearing with confirmation dialogs.",
    challenge: "Users need quick, accessible text utilities without installing desktop applications or navigating complex interfaces. Existing tools lack integration, require internet connectivity, or sacrifice user experience for functionality. Students and professionals require reliable text analysis tools for writing efficiency.",
    solution: "Developed a Progressive Web App using React with offline-first architecture. Implemented Web Speech API for text-to-speech with voice selection, pitch control, and playback speed adjustment. Used localStorage for persistent note saving with automatic draft recovery. Created responsive UI with TailwindCSS supporting touch gestures and keyboard shortcuts. Added real-time character counting, word frequency analysis, and reading time calculation using industry-standard reading speeds.",
    impact: [
      "Fast, accessible text utilities without installation requirements",
      "Offline functionality with localStorage persistence",
      "Mobile-optimized interface for on-the-go text manipulation",
      "Accessibility features including text-to-speech and keyboard navigation"
    ],
    technicalOverview: "React 18 with functional components and hooks for state management. Web Speech API provides text-to-speech capabilities with voice synthesis. localStorage API enables persistent data storage with JSON serialization. TailwindCSS provides utility-first styling with dark mode support. Deployed on Vercel with PWA capabilities for offline access.",
    techStack: ["React 18", "JavaScript", "Tailwind CSS", "Web Speech API", "LocalStorage API", "Vercel"],
    badges: ["React", "JavaScript", "Utility", "PWA", "Personal", "Text Processing"],
    imageUrl: "/Project/TextWise.webp",
    liveUrl: "https://text-wise.vercel.app",
    codeUrl: "https://github.com/AmanSuryavanshi-1/TextWise-TextUtilityAPP",
    blogUrl: null,
    featured: false,
    metrics: {
      features: "10+",
      offline: "Yes"
    }
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
    imageUrl: "/Project/E-coomerce.webp",
    liveUrl: "https://ase-commerce.netlify.app",
    codeUrl: "https://github.com/AmanSuryavanshi-1/E-commerce-App",
    blogUrl: null,
    featured: false,
    metrics: {
      pages: "Multiple",
      stateManagement: "Redux"
    }
  }
] as const;

// --- Exported Data with Mapped Fields ---

export const projects: Project[] = rawProjects.map(p => ({
  ...p,
  // Map new fields to old fields for compatibility
  description: p.shortDescription, // Use short description for cards/hero
  detailedDescription: p.description, // Use full description for details
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
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), // CamelCase to Title Case
    value
  })) : []
}));