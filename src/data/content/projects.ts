import { Project } from '../types';
import { getIcon } from '../icons/icon-map';

const rawProjects = [
    {
        id: "aviators-training-centre",
        title: "Aviators Training Centre",
        tagLine: "High-Performance Next.js 15 Platform + 74-Node n8n Lead Automation",
        category: "featured",
        type: "freelance",
        shortDescription: "Production-ready flight training platform combining Next.js 15, programmatic SEO, and 74-node n8n workflow automation. Generated ₹300,000+ in sales through 50+ organic leads with 110K+ Google Search Console impressions and 95+ Lighthouse scores.",
        description: "A comprehensive aviation training management ecosystem built with Next.js 15, TypeScript, and AI-driven automation. The platform integrates Sanity CMS for dynamic content management, Firebase for real-time analytics, and n8n for intelligent workflow orchestration. Features automated email sequences via Resend, Cal.com meeting scheduling, Airtable CRM integration, and AI-powered SEO scoring achieving 96/100 average optimization. The system handles course registrations, student tracking, instructor management, and automated business intelligence-transforming a traditional flight school into a data-driven operation that maintains 95+ Lighthouse scores across all metrics.",
        heroImageAlt: "Aviators Training Centre AI dashboard showing flight training KPIs, automated lead capture, and instructor scheduling",
        seo: {
            title: "Aviators Training Centre – AI workflow that generated ₹300K+",
            description: "See how Aman Suryavanshi built a 74-node AI automation stack for Aviators Training Centre to eliminate 80% manual work and convert high-ticket aviation leads.",
            keywords: [
                "aviation workflow automation",
                "AI training platform",
                "n8n aviation case study",
                "Aman Suryavanshi portfolio"
            ],
            canonicalPath: "/projects/aviators-training-centre"
        },
        challenge: "Flight training businesses struggle with manual lead tracking, fragmented communication systems, poor online visibility, and inefficient administrative workflows. Traditional websites fail to capture and nurture leads effectively, resulting in lost revenue opportunities and operational bottlenecks that limit business growth and scalability.",
        solution: "Architected a full-stack Next.js platform with TypeScript, combining server-side rendering for SEO dominance, Firebase for real-time data synchronization, and n8n automation workflows for intelligent lead nurturing. Implemented AI-powered content optimization with automated email sequences, calendar integration via Cal.com, Airtable CRM for lead management, and comprehensive analytics dashboards-all while maintaining exceptional performance with 95+ Lighthouse scores. The modular architecture enables independent scaling of content management, analytics, and automation systems.",
        impact: [
            "Generated ₹300,000+ in direct sales from automated lead pipeline",
            "50+ organic leads captured through #1 Google rankings for niche aviation queries",
            "80% reduction in manual CRM and administrative tasks through n8n automation",
            "110K+ Google Search Console impressions demonstrating organic SEO dominance",
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
            impressions: "110,000+",
            leads: "50+",
            automation: "80%",
            lighthouse: "95+",
            seo: "96/100"
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
        id: "vivek-onpoint-platform",
        title: "Vivek OnPoint Creator Platform",
        tagLine: "Next.js 16 + Headless Notion CMS (8 Relational DBs) & 11-Layer Defense System",
        category: "featured",
        type: "client",
        shortDescription: "Static-first educational platform for financial creator Vivek OnPoint. Integrates 8 relational Notion databases with an 11-layer defense system: semaphore throttling (0.67 req/s), jittered exponential backoff, static emergency bypass snapshots, draft leakage guards, and edge rate limiting with Upstash Redis.",
        description: "An enterprise-grade creator platform built on Next.js 16 App Router and Tailwind CSS v4, utilizing Notion as a headless CMS across 8 relational databases (Sources, Bookshelf, FAQ, Newsletter, Sponsors, Corrections). To eliminate Notion API rate limits and draft leaks, architected an 11-Layer Notion CMS Defense: 0.67 req/s Semaphore Throttler, jittered exponential backoff for transient 429/5xx errors, emergency bypass mode serving version-controlled static fallback snapshots, post-Zod draft leakage validation, and ISR freshness health probes (/api/health/isr-freshness). Enforces strict compliance guardrails (SEBI educational boundaries, ASCI sponsor disclosures, DPDP minimal consent).",
        heroImageAlt: "Vivek OnPoint Creator Hub Architecture and Notion CMS Dashboard",
        seo: {
            title: "Vivek OnPoint Platform – Next.js 16 & 11-Layer Notion CMS Case Study",
            description: "How Aman Suryavanshi engineered a static-first Next.js 16 platform with 8 relational Notion databases and an 11-layer defense system against API limits.",
            keywords: [
                "Next.js 16 App Router",
                "Headless Notion CMS",
                "11-Layer Defense System",
                "Upstash Redis Rate Limiting",
                "Aman Suryavanshi portfolio"
            ],
            canonicalPath: "/projects/vivek-onpoint-platform"
        },
        challenge: "Creator platforms relying on Notion as a headless CMS face severe API bottlenecks: strict 3 req/s rate limits causing build crashes, accidental leakage of draft content, empty page rendering during outages, and compliance violations when displaying financial educational content without strict disclosure boundaries.",
        solution: "Engineered an 11-Layer Notion CMS Defense System with a semaphore throttler (0.67 req/s), AWS-style jittered backoff, and static emergency bypass snapshots. Coupled with Upstash Redis edge rate limiting, strict Zod schema validation, and edge middleware that normalizes tracking parameters to avoid CDN cache fragmentation.",
        impact: [
            "100% build reliability with 0 Notion API 429 rate-limit breaches across all deployments",
            "Zero content loss via emergency static fallback snapshots during Notion downtime",
            "99.9% uptime with sub-second page loads powered by Vercel edge caching",
            "Full SEBI / ASCI / DPDP compliance enforced through server-side validation rules",
            "Seamless headless authoring workflow for 8 relational databases"
        ],
        technicalOverview: "Next.js 16 App Router application styled with Tailwind CSS v4 and OKLCH color tokens. Integrates the Notion JavaScript SDK with custom throttling wrappers. Edge rate limiting is powered by @upstash/ratelimit on Upstash Redis. Runtime schema validation is enforced via Zod v3. Features automated ISR caching with freshness health probes (/api/health/isr-freshness) and edge middleware for cache-key normalization.",
        techStack: ["Next.js 16", "Notion API", "TypeScript", "Tailwind CSS", "Upstash Redis", "Zod", "Vercel", "Docker", "Node.js"],
        badges: ["Next.js 16", "Notion CMS", "TypeScript", "Redis", "Security", "Production", "Client", "Full-Stack"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/omnipost-v2-architecture.webp",
        imageUrlFallback: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/omnipost-v2-architecture.webp",
        videoYouTubeId: "",
        video: "",
        liveUrl: "https://vivekonpoint.com",
        codeUrl: "https://github.com/AmanSuryavanshi-1/Vivek-OnPoint-Web",
        blogUrl: null,
        featured: true,
        metrics: {
            databases: "8 Notion DBs",
            defenseLayers: "11 Layers",
            rateLimit: "0.67 req/s",
            uptime: "99.9%",
            buildReliability: "100%"
        }
    },
    {
        id: "notebooklm-py-pr276",
        title: "notebooklm-py (16.5k★) — Core Auth & Asyncio Architecture PR #276",
        tagLine: "Merged Core Architecture PR (+1,483 / -353 Lines) in Google NotebookLM Python Client",
        category: "featured",
        type: "open-source",
        shortDescription: "Engineered domain-preserving httpx cookie jar architecture resolving silent auth drops on cross-domain 302-redirects to accounts.google.com when short-lived tokens expire. Implemented atomic token storage (tempfile + chmod 0o600) and resolved Windows asyncio ProactorEventLoop policies.",
        description: "Google's NotebookLM web interface relies on short-lived authentication cookies (~10 minutes) that redirect to accounts.google.com upon expiry. In notebooklm-py (the leading community Python API with 16.5k+ stars), the existing client passed raw Cookie headers that were silently dropped by httpx upon cross-domain redirects, causing catastrophic session termination. Aman architected and merged Core PR #276 (+1,483 / -353 lines): created a domain-preserving httpx cookie jar constructor (build_cookie_jar), introduced the DomainCookieMap type, wired atomic cookie persistence (save_cookies_to_storage using tempfile and chmod 0o600), and fixed Windows asyncio event loop policy mismatches.",
        heroImageAlt: "notebooklm-py Core Architecture PR #276 GitHub Merge and Cookie Jar Architecture",
        seo: {
            title: "notebooklm-py PR #276 – Core Auth & Windows Asyncio Fix Case Study",
            description: "How Aman Suryavanshi re-architected auth cookie management and Windows asyncio loops in the 16.5k-star notebooklm-py open-source library.",
            keywords: [
                "notebooklm-py PR 276",
                "httpx cookie jar",
                "Windows asyncio ProactorEventLoop",
                "open source contribution",
                "Aman Suryavanshi portfolio"
            ],
            canonicalPath: "/projects/notebooklm-py-pr276"
        },
        challenge: "When Google auth cookies expire every 10 minutes, API requests receive a 302 redirect to accounts.google.com. Standard HTTP clients strip raw 'Cookie' request headers on cross-domain redirects for security reasons, instantly killing long-running CLI sessions. On Windows, default asyncio event loop policies caused fatal Subprocess/RPC transport crashes during cookie retrieval.",
        solution: "Engineered an authoritative httpx.Cookies jar implementation that binds cookies to specific domains (allowing cross-domain redirect preservation). Built atomic storage synchronization using temporary files and 0o600 file permissions to ensure multi-process CLI safety. Resolved Windows ProactorEventLoop policy handling.",
        impact: [
            "Merged into core repository of notebooklm-py (16.5k+ GitHub stars)",
            "+1,483 lines added, -353 lines refactored across 8 core architecture files",
            "Eliminated 100% of session dropouts on 10-minute token expiration cycles",
            "Restored full Windows compatibility across all async CLI commands",
            "Enforced atomic file locking to prevent storage_state corruption across parallel jobs"
        ],
        technicalOverview: "Python 3.10+ async architecture utilizing httpx, asyncio, and Playwright for headless token harvesting. Implements custom cookie normalization logic, domain mapping, atomic file writing with os.replace, and automated unit test suites using pytest and pytest-asyncio.",
        techStack: ["Python", "asyncio", "httpx", "Playwright", "pytest", "GitHub Actions"],
        badges: ["Open Source", "Python", "AsyncIO", "Auth Architecture", "16.5k★", "Production"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/obsidian-mcp-network-topology.webp",
        imageUrlFallback: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/obsidian-mcp-network-topology.webp",
        videoYouTubeId: "",
        video: "",
        liveUrl: "https://github.com/tomaarsen/notebooklm-py/pull/276",
        codeUrl: "https://github.com/AmanSuryavanshi-1/notebooklm-py/commit/5c3f325391eef248b94b885972e032212be009ca",
        blogUrl: null,
        featured: true,
        metrics: {
            githubStars: "16.5k+",
            codeDiff: "+1,483 / -353",
            sessionDrops: "0%",
            platform: "Python / Asyncio",
            testsPassing: "100%"
        }
    },
    {
        id: "barkat-enterprise",
        title: "Barkat Enterprise",
        tagLine: "Premium Tiles & Marbles E-Commerce Platform",
        category: "featured",
        type: "freelance",
        shortDescription: "Full-scale React marketplace for tiles and marbles distributor, serving 3,000+ viewers with modern UI/UX and interactive PDF catalogues. Features in-browser PDF rendering with PDFJS, WebP optimization, and mobile-first design.",
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
        badges: ["React", "Vite", "Tailwind", "Freelance", "E-Commerce", "PDF", "B2B", "Production", "WebP Optimization"],
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
        tagLine: "Real-Time Multi-Source News Aggregator with API Key Rotation",
        category: "featured",
        type: "personal",
        shortDescription: "Production-ready news aggregation platform with intelligent API key rotation across 9 keys and 10-minute caching. Features text-to-speech via Web Speech API and duplicate detection—reducing API calls by 90%.",
        description: "An enterprise-grade news platform solving the API rate limit challenge through smart key rotation across 9 API keys (3 per service). Aggregates articles and videos from NewsAPI, GNews, and YouTube into a unified real-time feed with advanced duplicate detection algorithms. Web Speech API enables text-to-speech article reading for accessibility and multitasking users. Custom Node.js/Express backend manages intelligent API rotation, implements 10-minute response caching with TTL management, and provides health monitoring endpoints for system status. Redux Toolkit manages application state including saved articles with persistence, search filters, and category preferences. Advanced features include load-more pagination for infinite scroll, cross-source search with relevance ranking, graceful degradation when APIs fail with automatic fallback, and real-time API health tracking dashboard.",
        challenge: "Free-tier API limits (100 requests/day per key) make real-time news aggregation impossible without intelligent management. Users need fresh content from multiple sources while developers face rate limiting, high API costs, and complex state management across diverse data structures from different APIs with inconsistent schemas.",
        solution: "Engineered a dual-architecture system: React frontend with Redux Toolkit for global state management, and Node.js/Express API server implementing intelligent key rotation with health tracking. Built custom ApiKeyManager.js handling automatic failover on rate limits with 15-minute cooldown periods, health metrics per key with success/failure tracking, and smart load distribution. Implemented 10-minute cache using in-memory storage with TTL reducing redundant API calls by 90%. Integrated Web Speech API for text-to-speech article reading enabling accessibility and hands-free consumption. Created duplicate detection system using content hashing to merge similar articles from different sources.",
        impact: [
            "90% reduction in API calls through intelligent caching and deduplication",
            "300+ requests/day capacity across rotated keys vs 100 single-key limit",
            "Seamless user experience even during API failures with automatic fallback",
            "Text-to-speech enables accessibility and multitasking for users on-the-go",
            "Production-ready architecture handling 1,000+ daily users without issues",
            "Zero downtime during API rate limit situations"
        ],
        technicalOverview: "React 18 frontend built with Vite for optimal development experience and minimal bundle size. Redux Toolkit manages global state with createSlice API for articles, filters, saved content, and user preferences. Node.js/Express backend implements RESTful API proxy with custom middleware for key rotation, in-memory caching with TTL expiration, CORS handling, and request logging. NewsAPI provides top headlines and search, GNews supplies global news coverage, YouTube Data API v3 fetches video content with metadata. Web Speech API enables text-to-speech for article reading with adjustable speech rate and voice selection. DaisyUI component library built on TailwindCSS provides responsive, accessible UI components. Health check endpoint monitors API key status and system performance. Deployed on Vercel (frontend) with Vercel Serverless Functions and separate Node.js hosting (backend) with environment variable management for API keys and security.",
        techStack: ["React 18", "Redux Toolkit", "Node.js", "Express", "Vite", "DaisyUI", "Tailwind CSS", "Web Speech API", "NewsAPI", "GNews", "YouTube API", "REST API", "Vercel"],
        badges: ["React", "Node.js", "TTS", "API Rotation", "News", "API Integration", "Production", "Personal", "Real-time"],
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
        title: "OmniPost-Core: Autonomous Multi-Platform Content Engine",
        tagLine: "122-Node n8n Workflow Engine + FastMCP (:3010) Second Brain Knowledge Bridge",
        category: "featured",
        type: "automation",
        shortDescription: "Production-grade multi-agent content distribution system orchestrating 122 n8n nodes. Connects local Obsidian Second Brain via FastMCP (:3010) and Google NotebookLM via FastAPI (:3012). Features a 5-layer anti-slop linter, 300 DPI Playwright carousel compiler, and multi-platform publishing across 7+ networks.",
        description: "A production-grade, multi-agent content distribution operating system designed to eliminate 100% of repetitive formatting, context extraction, and manual cross-posting overhead. Pulls living project context from a local Obsidian Second Brain via FastMCP (:3010), consults a zero-token NotebookLM research oracle via FastAPI (:3012), formats platform-native copy through an adversarial 5-Layer Slop Linter (banning 39 AI tells), compiles 300 DPI multi-slide carousels using headless Playwright, and autonomously publishes across 7+ distribution networks (LinkedIn, Twitter/X, Threads, Sanity, Dev.to, Hashnode, Reddit) on a $0/month operational budget.",
        challenge: "Build-in-public founders and creators struggle to maintain consistent, high-quality presence across multiple platforms while writing deep technical code. Manual cross-posting is time-consuming and error-prone, while conventional tools output generic, low-engagement AI slop that lacks deep code context and fails platform-specific formatting constraints.",
        solution: "Engineered a 122-node dual-workflow engine in n8n (Part 1 Generation Engine + Part 2 Distribution Router). Implemented FastMCP (:3010) streaming gateway to inject verified project telemetry from Obsidian, an adversarial 5-layer slop linter in JavaScript/Node.js, headless Playwright carousel generation, and robust Dead-Letter Queues with retry backoff.",
        impact: [
            "122 n8n nodes orchestrated with zero-loss Dead-Letter Queue (DLQ) retry architecture",
            "Eliminated 100% of manual social copy-pasting across 7+ distribution channels",
            "FastMCP (:3010) live context bridge ground prompts in real code—zero AI hallucinations",
            "300 DPI Playwright automated carousel generation for high-engagement LinkedIn slide decks",
            "Contributed to 6,000+ total views and direct inbound lead conversions with $0/mo tool costs"
        ],
        technicalOverview: "Dual-stream n8n v1.x architecture combining multi-LLM routing (Gemini 2.5 Flash, GPT-4o, Claude 3.5 Sonnet) with custom Node.js code nodes for regex sanitization. FastMCP gateway running on Python FastMCP (:3010) streams Markdown notes from Obsidian. FastAPI bridge (:3012) queries Google NotebookLM. Playwright + Jinja2 scripts compile JSON specifications into 2160x2700 4:5 PNG carousels. Uses OAuth2 and REST APIs for publishing with automatic rate-limit cooldowns.",
        techStack: ["n8n", "FastMCP", "FastAPI", "Python", "Playwright", "Docker", "GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.5 Flash", "Twitter API", "LinkedIn API", "Notion API", "Node.js"],
        badges: ["n8n", "AI/Automation", "FastMCP", "Open Source", "Playwright", "Production", "Multi-Agent"],
        imageUrl: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/omnipost-l1-macro.webp",
        imageUrlFallback: "https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/Omni_post_Ai_autoamtion/omni_post_ai_assets/Part_1_Generation_Workflow",
        liveUrl: "https://n8n.aviatorstrainingcentre.in",
        codeUrl: "https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/tree/main/Omni-Post-AI-Automation",
        blogUrl: "https://www.amansuryavanshi.me/blogs/n8n-automation",
        featured: true,
        metrics: {
            workflows: "122 Nodes",
            platforms: "7+ Networks",
            bridge: "FastMCP :3010",
            cost: "$0/month",
            views: "6,000+"
        },
        gallery: [
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/omnipost-l1-macro.webp", alt: "Part 1: Generation Workflow", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Part_2_Distribution_Workflow.webp", alt: "Part 2: Distribution Workflow", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_2_Notion_Database_Schema_FullSize_Screenshot_zoomable.webp", alt: "Notion Database Schema", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_3_Metrics_Dashboard.webp", alt: "Metrics Dashboard", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_4_Error_Handling_Architecture.webp", alt: "Error Handling Architecture", type: "image" },
            { src: "https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_5_LLM_Routing.webp", alt: "LLM Routing Architecture", type: "image" }
        ],
        documentation: [
            { title: "01. Executive Summary", url: "/docs/omnipost/01-executive-summary" },
            { title: "02. Architecture and Flow", url: "/docs/omnipost/02-architecture-and-flow" },
            { title: "03. Prompt Engineering", url: "/docs/omnipost/03-prompt-engineering" },
            { title: "04. Platform Integrations", url: "/docs/omnipost/04-platform-integrations" },
            { title: "05. Developer Journal", url: "/docs/omnipost/05-developer-journal" },
            { title: "06. API and Infrastructure", url: "/docs/omnipost/06-api-and-infrastructure" },
            { title: "07. Sanity Portfolio Integration Architecture", url: "/docs/omnipost/07-sanity-portfolio-integration-architecture" },
            { title: "08. Obsidian MCP Setup Guide", url: "/docs/omnipost/08-obsidian-mcp-setup-guide" },
            { title: "09. Notion Database Schema", url: "/docs/omnipost/09-notion-database-schema" },
            { title: "10. AI Model Routing and Settings", url: "/docs/omnipost/10-ai-model-routing-and-settings" },
            { title: "11. LinkedIn Carousel Implementation", url: "/docs/omnipost/11-linkedin-carousel-implementation" },
            { title: "12. Portfolio API Reference", url: "/docs/omnipost/12-portfolio-api-reference" }
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
    },
    {
        id: "dental-ai-automation",
        title: "Dental AI Automation Suite",
        tagLine: "AI-Powered Document Processing & Verification Workflows",
        category: "featured",
        type: "freelance",
        shortDescription: "A comprehensive AI-powered document automation suite using n8n and Gemini Vision 2.0. Solved three critical bottlenecks: product label generation, clinic compliance verification, and thermal invoice OCR.",
        description: "Built a comprehensive AI-powered document automation suite for a mid-size dental supplies e-commerce operation, solving three critical operational bottlenecks through intelligent workflow orchestration. The system combines computer vision, OCR, and automated document generation to eliminate manual data entry and streamline inventory management. Three production-grade n8n workflows powered by Google Gemini Vision 2.0 Flash execute specific tasks while maintaining a unified, scalable architecture.",
        heroImageAlt: "Dental AI Automation Suite Dashboard",
        seo: {
            title: "Dental AI Automation Suite – n8n & Gemini Vision Case Study",
            description: "Case study of an AI-powered document automation suite for a dental e-commerce operation using n8n and Google Gemini Vision 2.0 by Aman Suryavanshi.",
            keywords: [
                "n8n automation",
                "Gemini Vision API",
                "OCR automation",
                "document processing AI"
            ],
            canonicalPath: "/projects/dental-ai-automation"
        },
        challenge: "The operations team was drowning in manual work—generating product labels from spreadsheets, verifying clinic images for compliance, and extracting data from supplier invoices. Each task consumed hours daily and introduced human error into critical business processes. Pink thermal invoices were particularly challenging for traditional OCR.",
        solution: "Developed three independent n8n workflows using Google Gemini Vision 2.0 Flash. The Label Generator automates PNG barcode creation from Google Sheets. The Clinic Verifier uses computer vision to extract pincodes, coordinates, and person counts from images. The Invoice Extractor leverages specialized prompt engineering and regex to parse challenging pink thermal invoices into structured JSON.",
        impact: [
            "Reduced label generation from 5-10 minutes to ~5 seconds per label",
            "Slashed clinic verification time from 5+ minutes to under 10 seconds",
            "Automated 90%+ of invoice data entry with 98% PIN extraction accuracy",
            "Eliminated 100% of manual label creation work"
        ],
        technicalOverview: "Modular n8n workflow architecture with self-hosted Docker deployment. Utilizes Google Gemini 2.0 Flash API for high-speed, structured JSON computer vision and OCR. Custom Node.js nodes handle pre-flight validation, HTML-to-Image rendering, and regex-based data cleaning. Implemented fail-safe architectures with validation layers, rate limiting (2-second intervals), and graceful degradation for partial OCR success.",
        techStack: ["n8n", "Google Gemini Vision", "Node.js", "Google Sheets API", "HTML-to-Image", "Docker", "REST API", "OCR"],
        badges: ["AI/ML", "n8n", "Freelance", "Computer Vision", "OCR"],
        imageUrl: "https://img.youtube.com/vi/tbtadaI_mow/maxresdefault.jpg",
        imageUrlFallback: "https://img.youtube.com/vi/tbtadaI_mow/0.jpg",
        videoYouTubeId: "tbtadaI_mow",
        video: "",
        liveUrl: "",
        codeUrl: "https://github.com/AmanSuryavanshi-1/Dental-AI-Automation-Suite",
        blogUrl: "",
        featured: true,
        metrics: {
            speed: "<10s/doc",
            accuracy: "98%",
            automation: "90%+"
        },
        documentation: [
            { title: "Executive Summary", url: "/projects/dental-ai-executive-summary" },
            { title: "Technical Documentation", url: "/projects/dental-ai-technical-documentation" }
        ],
        gallery: [
            { src: "https://img.youtube.com/vi/tbtadaI_mow/maxresdefault.jpg", alt: "Label Generator", type: "image" },
            { src: "https://img.youtube.com/vi/tlI2jZw_VVA/maxresdefault.jpg", alt: "Clinic Compliance", type: "image" },
            { src: "https://img.youtube.com/vi/KAO0HJNRlGU/maxresdefault.jpg", alt: "Invoice OCR", type: "image" }
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
