# AmanSuryavanshi.dev - Technical Documentation

> **Last Updated**: December 29, 2025  
> **Version**: 1.0.0  
> **Purpose**: Comprehensive documentation of portfolio website architecture, data flows, and implementation decisions

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Sources & Flow](#data-sources--flow)
4. [Component Hierarchy](#component-hierarchy)
5. [Page Structure](#page-structure)
6. [Core Systems](#core-systems)
7. [API Routes](#api-routes)
8. [Design Decisions](#design-decisions)
9. [Environment Variables](#environment-variables)
10. [Quick Reference](#quick-reference)

---

## Overview

### What This Website Does

A production-ready portfolio website featuring:
- **Personal Portfolio**: Projects, skills, experience, services
- **Blog System**: Powered by Sanity CMS with Portable Text
- **Project Documentation**: Markdown-based technical docs fetched from GitHub
- **Contact System**: Email via Resend with rate limiting
- **AI Content Automation**: Omni-Post AI for social media distribution

### Tech Stack Summary

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS + Shadcn/UI |
| **CMS** | Sanity.io (blog content) |
| **Animations** | Framer Motion |
| **Email** | Resend API |
| **Analytics** | Vercel Analytics + Google Analytics 4 |
| **Hosting** | Vercel |

---

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (composes all sections)
│   ├── layout.tsx         # Root layout (SEO, fonts, analytics)
│   ├── blogs/             # Blog listing + [slug] dynamic pages
│   ├── projects/          # Project listing + [slug] documentation pages
│   ├── about/             # About page
│   ├── studio/            # Sanity Studio (CMS admin)
│   └── api/               # API routes
│       ├── contact/       # Contact form email sending
│       ├── increment-views/ # Blog view counter
│       └── portfolio/     # Portfolio data endpoints
│
├── components/            # React components
│   ├── hero/              # Hero section
│   ├── about/             # About section  
│   ├── skills/            # Skills display
│   ├── projects/          # Project cards, carousel, detailed views
│   ├── services/          # Services offered
│   ├── blog/              # Blog components (TOC, share, images)
│   ├── docs/              # Documentation viewer (Markdown renderer)
│   ├── sanity/            # Sanity-specific (PortableText components)
│   └── ui/                # Reusable UI (buttons, cards, video player)
│
├── data/
│   ├── portfolio.tsx      # ⚠️ CENTRAL DATA FILE - All portfolio content
│   └── centralized-assets.json # Asset URLs mapping
│
├── lib/                   # Utility functions
│   ├── fallback-image-manager.ts # Image fallback system
│   ├── email-templates.ts # Email HTML templates
│   ├── metadata-utils.ts  # SEO metadata generation
│   └── utils.ts           # General utilities (cn function)
│
├── sanity/                # Sanity CMS configuration
│   ├── lib/               # Sanity client, image builder
│   └── schemaTypes/       # Content schemas (post, author, tag)
│
└── context/               # React Context
    └── ImageGalleryContext.tsx # Lightbox state management
```

---

## Data Sources & Flow

### Primary Data Source: `portfolio.tsx`

**Location**: `src/data/portfolio.tsx` (1662 lines)

This is the **single source of truth** for all portfolio content. It exports `portfolioData` containing:

```typescript
portfolioData = {
  hero: HeroData,           // Landing page hero section
  about: AboutData,         // About section + qualifications  
  skills: SkillsData,       // Skills with categories
  landingSkills: LandingSkillsData, // Compact skills for homepage
  projects: Project[],      // ALL project data (7 projects)
  services: ServiceData[],  // Services offered
  experience: ExperienceItem[], // Work experience
  workBanner: WorkBannerItem[]  // Scrolling banner items
}
```

### Project Data Structure

Each project in `portfolioData.projects` contains:

```typescript
interface Project {
  id: string;                    // URL-friendly identifier (e.g., "aviators-training-centre")
  title: string;                 // Display name
  tagLine: string;               // Short description
  category: 'featured' | 'freelance' | 'personal' | 'automation';
  type: string;                  // "freelance" | "personal" | "automation"
  shortDescription: string;      // Card preview text
  description: string;           // Full description
  challenge: string;             // Problem statement
  solution: string;              // How it was solved
  impact: string[];              // Key achievements
  technicalOverview: string;     // Deep technical details
  techStack: string[];           // Technologies used
  badges: string[];              // Display badges
  imageUrl: string;              // Primary image (JSDelivr CDN)
  imageUrlFallback: string;      // Cloudinary fallback
  videoYouTubeId?: string;       // YouTube video ID for embed
  liveUrl: string;               // Live demo URL
  codeUrl: string;               // GitHub repository
  blogUrl?: string;              // Related blog post
  featured: boolean;             // Show in featured carousel
  metrics?: Record<string, string>; // Key metrics
  documentation?: {              // ⚠️ Links to doc pages
    title: string;
    url: string;                 // e.g., "/projects/aviators-training-centre-executive-summary"
  }[];
  gallery?: {                    // Image/video gallery
    src: string;
    alt: string;
    type: 'image' | 'video';
  }[];
}
```

### Data Flow Diagrams

#### 1. Homepage Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        src/app/page.tsx                              │
│                                                                      │
│  imports portfolioData from @/data/portfolio                        │
│                                                                      │
│  ┌──────────────┐ ┌────────────────┐ ┌──────────────┐              │
│  │    <Hero/>   │ │<AboutMe        │ │<MySkills/>   │              │
│  │              │ │ personalInfo=  │ │              │              │
│  │ Uses:        │ │ {...}          │ │ Uses:        │              │
│  │ heroData     │ │ qualifications=│ │ skillsData   │              │
│  │              │ │ {...}/>        │ │ landingSkills│              │
│  └──────────────┘ └────────────────┘ └──────────────┘              │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │           <FeaturedProjectsSection/>                        │     │
│  │                                                             │     │
│  │   Uses: portfolioData.projects (sorted by PROJECT_ORDER)  │     │
│  │   Renders: <FeaturedHero/> carousel with project data      │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌──────────────┐ ┌────────────────┐ ┌──────────────┐              │
│  │<Experience   │ │   <Services/>  │ │  <Contact/>  │              │
│  │ Cards/>      │ │                │ │              │              │
│  │              │ │ Uses:          │ │ POSTs to     │              │
│  │ Uses:        │ │ servicesData   │ │ /api/contact │              │
│  │ experienceData│ │               │ │              │              │
│  └──────────────┘ └────────────────┘ └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

#### 2. Blog Page Data Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                      src/app/blogs/[slug]/page.tsx                          │
│                                                                             │
│  1. getPost(slug) - Fetches from Sanity CMS via GROQ query                 │
│                                                                             │
│     GROQ Query retrieves:                                                   │
│     ├── title, slug, body[], excerpt                                       │
│     ├── mainImage with asset metadata                                      │
│     ├── author-> {name, image, bio}                                        │
│     ├── tags[]-> {name, slug, color}                                       │
│     └── views, status, seoTitle, metaDescription                           │
│                                                                             │
│  2. Related posts query - Finds posts with matching tags                   │
│                                                                             │
│  3. Components receive data:                                               │
│     ┌────────────────────────────────────────────────────────────────────┐ │
│     │ <BlogHeaderImage post={post}/> - Renders header with fallback     │ │
│     │ <PortableText value={post.body}/> - Renders rich content          │ │
│     │ <TableOfContents/> - Auto-generated from headings                 │ │
│     │ <FloatingActions title slug/> - Share/save buttons                │ │
│     │ <RelatedPosts posts={relatedPosts}/> - Similar articles           │ │
│     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 3. Project Documentation Data Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     src/app/projects/[slug]/page.tsx                        │
│                                                                             │
│  1. Maps slug to GitHub raw URL via DOCS_MAP:                              │
│     ┌─────────────────────────────────────────────────────────────────────┐│
│     │ 'aviators-training-centre-executive-summary':                       ││
│     │   github.com/.../docs/aviators-training-centre-executive-summary.md ││
│     │                                                                     ││
│     │ 'omni-post-ai-technical-documentation':                             ││
│     │   github.com/.../Omni-Post-AI-Automation/TECHNICAL-DOCS.md          ││
│     └─────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  2. Maps slug to project ID via DOC_TO_PROJECT_ID                          │
│                                                                             │
│  3. Fetches:                                                                │
│     ├── Markdown content from GitHub (cached 1 hour)                       │
│     └── Project data from portfolioData.projects                           │
│                                                                             │
│  4. Renders:                                                                │
│     <DocPageClient project={project} content={markdown} slug={slug}/>      │
│                                                                             │
│     DocPageClient features:                                                 │
│     ├── Hero header with project.imageUrl                                  │
│     ├── YouTube embed if project.videoYouTubeId exists                     │
│     ├── <MarkdownViewer content={content}/> - Renders markdown             │
│     ├── Auto-generated Table of Contents                                    │
│     ├── Tech stack sidebar                                                  │
│     └── Navigation to related docs (exec summary ↔ tech docs)              │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Homepage Section Components

| Component | Location | Data Source | Purpose |
|-----------|----------|-------------|---------|
| `<Hero/>` | `components/hero/Hero.tsx` | `heroData` | Landing hero with CTA |
| `<FeaturedProjectsSection/>` | `components/home/FeaturedProjectsSection.tsx` | `projects[]` | Carousel of projects |
| `<WorkBanner/>` | `components/WorkBanner.tsx` | `workBanner[]` | Scrolling skills banner |
| `<AboutMe/>` | `components/about/AboutMe.tsx` | `aboutData.personalInfo` | About section |
| `<MySkills/>` | `components/skills/MySkills.tsx` | `skillsData` | Skills accordion |
| `<ExperienceCards/>` | `components/ExperienceCards.tsx` | `experience[]` | Work history |
| `<Services/>` | `components/services/services.tsx` | `servicesData[]` | Service offerings |
| `<Contact/>` | `components/contact.tsx` | N/A | Contact form |

### Project Components

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `<FeaturedHero/>` | Full-width project showcase | `projects[], activeIndex` |
| `<FeaturedCarousel/>` | Thumbnail navigation | `projects[], activeIndex` |
| `<ProjectCard/>` | Grid card display | `project` |
| `<ProjectMediaCarousel/>` | Gallery lightbox | `gallery[]` |
| `<DocPageClient/>` | Documentation page layout | `project, content, slug` |
| `<MarkdownViewer/>` | Renders markdown to JSX | `content` |

### Blog Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `<BlogHeaderImage/>` | Header image with fallback | Priority 1: mainImage → extracted first image → FallbackImageManager |
| `<PortableText/>` | Sanity rich text renderer | Custom components for code, images, videos |
| `<TableOfContents/>` | Auto-generated TOC | Scroll spy, heading extraction |
| `<FloatingActions/>` | Desktop share/save actions | Copy link, Twitter, LinkedIn |
| `<MobileActionBar/>` | Mobile action buttons | Fixed bottom bar |
| `<RelatedPosts/>` | Similar articles | Matched by shared tags |

### UI Components (`components/ui/`)

| Component | Purpose |
|-----------|---------|
| `<YouTubeEmbed/>` | YouTube iframe with poster overlay, viewport detection |
| `<CustomVideoPlayer/>` | Enhanced video player wrapper |
| `<Lightbox/>` | Image zoom modal |
| `<Skeleton/>` | Loading placeholder |
| `CountUp` | Animated number counter |

---

## Page Structure

### Route Map

```
/                          → Homepage (page.tsx)
/blogs                     → Blog listing (blogs/page.tsx)
/blogs/[slug]              → Individual blog post (blogs/[slug]/page.tsx)
/projects                  → All projects grid (projects/page.tsx)
/projects/[slug]           → Project documentation (projects/[slug]/page.tsx)
/about                     → Detailed about page (about/page.tsx)
/studio                    → Sanity CMS admin (studio/[[...tool]]/page.tsx)
```

### Documentation Slug Mapping

| Slug | GitHub Raw URL | Project ID |
|------|----------------|------------|
| `aviators-training-centre-executive-summary` | Aviators repo `/docs/...md` | `aviators-training-centre` |
| `aviators-training-centre-technical-documentation` | Aviators repo `/docs/...md` | `aviators-training-centre` |
| `omni-post-ai-executive-summary` | Portfolio repo `/Omni-Post-AI-Automation/...md` | `n8n-automation-suite` |
| `omni-post-ai-technical-documentation` | Portfolio repo `/Omni-Post-AI-Automation/...md` | `n8n-automation-suite` |
| `barkat-enterprise-technical-documentation` | BarkatEnterprise repo `/docs/...md` | `barkat-enterprise` |
| `av-newsstream-technical-documentation` | AV-News-Stream repo `/docs/...md` | `av-newsstream` |
| `foodah-technical-documentation` | Foodah repo `/docs/...md` | `foodah` |

---

## Core Systems

### 1. Fallback Image System

**Location**: `src/lib/fallback-image-manager.ts`

**Purpose**: Provides contextual fallback images when primary images fail to load.

```typescript
FallbackImageManager {
  // Categories: code, dashboard, mobile, server, workflow, default
  
  getRandomFallback(): FallbackImage        // Random selection
  getFallbackByCategory(cat): FallbackImage // Category-specific
  getContextualFallback(context): FallbackImage // Infers from project data
  getUltimateFallback(): string             // Inline SVG data URL
}
```

**Fallback files** (in `/public/fallbacks/`):
- `fallback-code.svg`
- `fallback-dashboard.svg`
- `fallback-mobile.svg`
- `fallback-server.svg`
- `fallback-workflow.svg`

**Category Inference**: Keywords in project title/techStack determine fallback:
- "n8n", "automation", "workflow" → `fallback-workflow.svg`
- "mobile", "app", "pwa" → `fallback-mobile.svg`
- "dashboard", "analytics" → `fallback-dashboard.svg`

### 2. Image Gallery Context

**Location**: `src/context/ImageGalleryContext.tsx`

**Purpose**: Global state for lightbox functionality across blog posts and documentation.

```typescript
ImageGalleryProvider {
  images: GalleryImage[]      // Registered images
  isOpen: boolean             // Lightbox visible
  currentIndex: number        // Active image
  registerImage(image)        // Add to gallery
  openGallery(index)          // Show lightbox
  closeGallery()              // Hide lightbox
  nextImage() / prevImage()   // Navigation
}
```

**Usage**: Components call `registerImage()` on mount, `openGallery(index)` on click.

### 3. Markdown Viewer

**Location**: `src/components/docs/MarkdownViewer.tsx`

**Purpose**: Renders markdown documentation with custom styling and features.

**Features**:
- GitHub Flavored Markdown (remarkGfm)
- Raw HTML support (rehypeRaw)
- Syntax highlighting (Prism - vscDarkPlus theme)
- Auto-generated heading IDs for TOC linking
- Image fallback support
- Responsive tables
- Code copy button

### 4. YouTube Embed

**Location**: `src/components/ui/YouTubeEmbed.tsx`

**Purpose**: Seamless YouTube embed that looks like native video.

**Key Features**:
- Poster image overlay until video plays (hides loading spinner)
- Viewport detection for autoplay
- CSS object-cover technique (hides letterbox)
- Interactive mode toggle (controls vs background)
- Uses `youtube-nocookie.com` for privacy

---

## API Routes

### 1. Contact Form (`/api/contact`)

**Location**: `src/app/api/contact/route.ts`

**Method**: POST

**Features**:
- Zod validation (name ≥2 chars, valid email, non-empty message)
- In-memory rate limiting (5 requests/hour per IP)
- Sends two emails via Resend:
  1. Admin notification → `amansurya.work@gmail.com`
  2. User confirmation → submitter's email

**Request Body**:
```json
{
  "from_name": "John Doe",
  "reply_to": "john@example.com",
  "message": "Hello..."
}
```

### 2. Increment Views (`/api/increment-views`)

**Location**: `src/app/api/increment-views/route.ts`

**Purpose**: Increments blog post view count in Sanity.

**Requires**: `NEXT_PUBLIC_SANITY_API_WRITE_TOKEN`

### 3. Portfolio API (`/api/portfolio`)

**Location**: `src/app/api/portfolio/`

**Purpose**: Exposes portfolio data as JSON endpoints (for external consumption).

---

## Design Decisions

### Why `portfolio.tsx` Instead of CMS for Projects?

**Decision**: Static TypeScript data file vs Sanity CMS

**Rationale**:
1. **Type Safety**: Full TypeScript interfaces with autocomplete
2. **Build-Time Optimization**: No runtime API calls for project data
3. **Version Control**: Changes tracked in Git
4. **Complexity**: Projects rarely change; blog posts change frequently
5. **Icons**: Projects use React component icons (`FaReact`, `SiNextdotjs`) which can't be stored in CMS

**Trade-off**: Requires code deployment to update projects (acceptable for portfolio).

### Why GitHub Raw URLs for Documentation?

**Decision**: Fetch markdown from GitHub at request time (cached 1 hour)

**Rationale**:
1. **Single Source of Truth**: Docs live with project code
2. **No Sync Issues**: Always reflects current GitHub state
3. **Open Source Friendly**: Contributors can update docs via PRs
4. **Fallback**: Cloudinary as secondary image CDN

### Why JSDelivr CDN for Images?

**Path Pattern**: `https://cdn.jsdelivr.net/gh/{user}/{repo}@main/{path}`

**Rationale**:
1. **Free**: No bandwidth costs
2. **Global CDN**: Fast delivery worldwide
3. **Git-Based**: Versioned with code
4. **Fallback**: Cloudinary (`imageUrlFallback`) for reliability

### Why Sanity for Blog Only?

**Decision**: Use Sanity CMS for blog, static data for portfolio

**Rationale**:
1. **Content Frequency**: Blog needs frequent updates without deploys
2. **Rich Text**: Portable Text enables complex formatting
3. **Media Management**: Sanity handles image hosting
4. **SEO**: Dynamic metadata from CMS fields

### Why Custom YouTube Embed?

**Decision**: Build custom wrapper instead of using react-youtube

**Rationale**:
1. **Performance**: Lazy iframe loading on viewport enter
2. **Visual Polish**: Poster overlay hides YouTube loading spinner
3. **Flexibility**: Background video mode vs interactive mode
4. **Privacy**: Uses `youtube-nocookie.com`

---

## Environment Variables

**Required** (in `.env.local`):

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_WRITE_TOKEN=skXXX...  # For view counts

# Site
NEXT_PUBLIC_SITE_URL=https://amansuryavanshi.me

# Email (Resend)
RESEND_API_KEY=re_XXXXX...

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=XXXXX
```

---

## Quick Reference

### Adding a New Project

1. **Edit** `src/data/portfolio.tsx`
2. **Add** new object to `rawProjects` array
3. **Map** tech stack strings to icons in `TechIconMap`
4. **Update** `PROJECT_ORDER` in `FeaturedProjectsSection.tsx` if needed
5. **Add** documentation URLs to `DOCS_MAP` in `projects/[slug]/page.tsx`
6. **Create** markdown docs in project repo's `/docs/` folder

### Adding Documentation for Existing Project

1. **Create** markdown file in project's GitHub repo (e.g., `docs/project-name-technical-documentation.md`)
2. **Add** slug mapping in `src/app/projects/[slug]/page.tsx`:
   - `DOCS_MAP`: slug → GitHub raw URL
   - `DOC_TO_PROJECT_ID`: slug → project.id
   - `TITLES_MAP`: slug → display title
3. **Update** project in `portfolio.tsx` to include `documentation` array

### Updating Project Images

1. **Upload** images to `portfolio-assets` repo on GitHub
2. **Update** `imageUrl` in `portfolio.tsx` with JSDelivr CDN URL
3. **Add** Cloudinary fallback to `imageUrlFallback`

### Adding Blog Post

1. **Go to** `/studio` (Sanity Studio)
2. **Create** new Post document
3. **Fill** required fields: title, slug, body, status
4. **Add** optional: mainImage, tags, excerpt, author
5. **Set** status to "published"

---

## File Reference Card

| What You Need | File Location |
|---------------|---------------|
| Add/edit project data | `src/data/portfolio.tsx` |
| Add project documentation URL | `src/app/projects/[slug]/page.tsx` |
| Modify blog post rendering | `src/components/sanity/PortableTextComponents.tsx` |
| Change markdown styling | `src/components/docs/MarkdownViewer.tsx` |
| Add fallback image category | `src/lib/fallback-image-manager.ts` |
| Modify contact form | `src/app/api/contact/route.ts` + `src/components/contact.tsx` |
| Change SEO metadata | `src/app/layout.tsx` |
| Add Sanity content type | `src/sanity/schemaTypes/` |
| Modify email templates | `src/lib/email-templates.ts` |

---

*This documentation reflects the codebase state as of December 2025. For the latest changes, refer to the Git commit history.*
