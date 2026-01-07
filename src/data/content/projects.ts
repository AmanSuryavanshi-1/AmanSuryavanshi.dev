import { Project } from '../types';
import { getIcon } from '../icons/icon-map';

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
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-13%20Homepage%20Screenshot.webp",
        imageUrlFallback: "https://res.cloudinary.com/dr0lrme36/image/upload/v1764768016/aviators-training-centre/docs-assets/ASSET-13_Homepage_Screenshot.png",
        videoYouTubeId: "lk35G_YVbSo",
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
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-14%20Contact%20Form%20Screenshot.webp", alt: "Contact Form", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-16%20Google%20Search%20Console%20Performance.webp", alt: "Google Search Console Performance", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-17%20n8n%20Workflow%20Canvas%20-%20Firebase%20Trigger.webp", alt: "n8n Workflow - Firebase Trigger", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-18%20n8n%20Workflow%20Canvas%20-%20Cal.com%20Trigger.webp", alt: "n8n Workflow - Cal.com Trigger", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-19%20Mobile%20Homepage.webp", alt: "Mobile Homepage View", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/Docs_Assets/ASSET-20%20AvaitorsTrainingCenter_LighthouseScores.webp", alt: "Lighthouse Performance Scores", type: "image" }
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
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/BarkatEnterprise/barkat-enterprise-Contact%20Page.webp", alt: "Contact Section", type: "image" }
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
        description: "A sophisticated restaurant discovery and food ordering interface demonstrating advanced React patterns and API integration mastery. Fetches live data directly from Swiggy's hosted API with over 14,000 lines of JSON restaurant data, implementing optional chaining for graceful error handling across deeply nested restaurant objects. Custom hooks include useOnlineStatus for network detection with visual indicators, useRestaurantMenu for optimized menu data fetching with AbortController, and useFallbackImage for handling missing images with intelligent random alternatives. GitHub API integration dynamically populates the About Developer section with real-time profile data. Features include category-based filtering with smooth animations, real-time search functionality with debouncing, restaurant details pages with nested menu accordions, shopping cart management with Redux Toolkit for persistent state, and contact form via EmailJS with validation. Built with Parcel bundler for zero-config hot module replacement and automatic code splitting.",
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
        id: "n8n-github-backup",
        title: "N8N GitHub Backup V5",
        tagLine: "Enterprise-Grade Automated Workflow Backup with Zero-Trust Security",
        category: "featured",
        type: "automation",
        shortDescription: "Production-grade n8n workflow backup system using dual-stream Loop-to-Webhook architecture. Features 100% rate limit compliance, failure isolation, location-agnostic sync, and recursive credential scrubbing-achieving 99.9% recovery rate with zero manual intervention.",
        description: "A revolutionary approach to n8n workflow backup that breaks the traditional monolithic pattern. The Loop-to-Webhook dual-stream architecture separates orchestration (Manager) from execution (Worker) within a single n8n workflow file, enabling mathematical guarantees on rate limit compliance and complete failure isolation. The system tracks workflows by ID rather than path, automatically relocating files when reorganized on GitHub. Zero-trust security is achieved through recursive JSON traversal that redacts all credential patterns before commits, making repositories auditable and public-safe. Split-tag nesting enables infinite folder depth for monorepo structures without character limits. Self-healing retry logic handles 422/409 conflicts with automatic SHA refresh, achieving 99.9% recovery success rate.",
        challenge: "Traditional backup automations follow a monolithic, linear pattern: they execute sequentially, hit GitHub's 30-request/minute API rate limits, crash on single errors blocking entire queues, and create duplicate 'ghost files' when workflows are reorganized. Credentials scattered throughout workflow JSON (in nodes, settings, OAuth tokens, nested configs) leak into Git history if not manually redacted. These aren't edge cases-they're daily operational realities for teams running 50+ automations.",
        solution: "Architected a dual-stream 'Loop-to-Webhook' system that runs orchestration and execution independently within a single n8n workflow file. The Manager stream dispatches workflows via webhook URLs to isolated Worker instances, each processing independently with 2-second delays mathematically guaranteeing 30 requests/minute (GitHub's limit). Implemented ID-based file tracking with smart search to relocate moved files without creating duplicates. Built recursive credential scrubbing that traverses the entire JSON tree-nodes, parameters, settings, pinData-replacing sensitive patterns with ***REDACTED***. Added self-healing retry loop for 422/409 conflicts with automatic SHA refresh, achieving 99.9% recovery rate.",
        impact: [
            "99.9% recovery success rate with self-healing retry logic (up from ~85% with traditional approaches)",
            "100% GitHub API rate limit compliance via mathematically proven 2-second delay pattern",
            "Zero credential leaks through recursive zero-trust scrubbing of entire workflow JSON",
            "Complete failure isolation-one workflow error doesn't block remaining queue",
            "Location-agnostic sync that finds and updates moved files without creating duplicates",
            "5-minute setup time with immediate ROI on first backup",
            "Handles 1000+ workflows with linear scaling"
        ],
        technicalOverview: "Built entirely in n8n using dual-stream architecture: Stream A (Manager) orchestrates by fetching all workflows via n8n API, filtering by tags, and dispatching each to Stream B via webhook with 2-second delays. Stream B (Worker) processes each workflow independently-scrubbing credentials recursively, checking GitHub for existing file by ID (not path), computing diff to avoid empty commits, and pushing via GitHub API with self-healing SHA conflict resolution. Split-tag system concatenates multiple tags for unlimited folder nesting (e.g., 'Project: Internal' + 'Sub: Ops/Critical' → 'Internal/Ops/Critical/WorkflowName/'). Credential redaction uses regex patterns for keywords (password, token, api_key, bearer, secret, credentials, auth) with recursive JSON traversal covering nodes[], settings, parameters, and pinData. Idempotency check compares scrubbed JSON with remote content to prevent meaningless commits. Error handling implements exponential backoff with automatic retry on 422 (SHA mismatch) and 409 (conflict) responses.",
        techStack: ["n8n", "GitHub API", "Node.js", "Webhooks", "REST API", "JSON", "Regex", "Rate Limiting"],
        badges: ["n8n", "Automation", "GitHub", "Security", "DevOps", "Open Source", "Self-Healing", "Production"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/v5_canvas_overview.webp",
        imageUrlFallback: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/v5_dual_stream_architecture.webp",
        liveUrl: "https://github.com/AmanSuryavanshi-1/n8n-production-workflows",
        codeUrl: "https://github.com/AmanSuryavanshi-1/n8n-production-workflows/tree/main/%5BProd%5D%20N8N_GitHub_Backup_V5_Unified",
        blogUrl: "https://www.amansuryavanshi.me/blogs/n8n-automation",
        featured: true,
        metrics: {
            recovery: "99.9%",
            rateLimit: "100%",
            setupTime: "5 min",
            scalability: "1000+ workflows"
        },
        gallery: [
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/v5_canvas_overview.webp", alt: "V5 Workflow Canvas Overview", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/v5_dual_stream_architecture.webp", alt: "Dual-Stream Architecture Diagram", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/v5_recursive_scrubbing_flow.webp", alt: "Recursive Credential Scrubbing Flow", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/v5_smart_search_logic_flow.webp", alt: "Smart Search Logic for File Location", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/self_healing_logic_diagram.webp", alt: "Self-Healing Retry Logic", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/split_tag_organization_flow.webp", alt: "Split-Tag Organization Strategy", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/zero_trust_security_scrubbing.webp", alt: "Zero-Trust Security Model", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/commit_efficiency_comparison.webp", alt: "Commit Efficiency Comparison", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/N8N-GithubBackup/v5_real_repo_structure.webp", alt: "Real Repository Structure", type: "image" }
        ],
        documentation: [
            {
                title: "Executive Summary",
                url: "/projects/n8n-github-backup-executive-summary"
            },
            {
                title: "Technical Documentation",
                url: "/projects/n8n-github-backup-technical-documentation"
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

export const projectsData: Project[] = rawProjects.map(p => ({
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
