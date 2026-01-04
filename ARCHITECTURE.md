# System Architecture

## Overview

**AmanSuryavanshi.dev** is a modern, full-stack portfolio and blog platform built with Next.js 15, specialized for performance, SEO, and AI-driven automation. It serves as a personal brand showcase, a technical blog, and a playground for automation experiments.

## 🏗️ High-Level Architecture

The system is composed of three main pillars:
1.  **Frontend**: Next.js App Router application hosted on Vercel.
2.  **Content Management**: Hybrid approach using Sanity CMS (Headless) and Static Data (`portfolio.tsx`).
3.  **Automation & Distribution**: Self-hosted n8n workflows for content generation and social distribution.

```mermaid
graph TD
    User[User] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|Next.js App| App[Frontend Application]
    
    subgraph "Data Layer"
        App -->|Fetch| Sanity[Sanity CMS (Blog Data)]
        App -->|Import| Static[Static Data (Portfolio Data)]
        App -->|Fetch| GitHub[GitHub API (Documentation)]
    end
    
    subgraph "Automation Layer (External)"
        Notion[Notion Workspace] -->|Webhook| n8n[n8n Workflow Engine]
        n8n -->|Gemini API| AI[Gemini 2.5 Pro]
        n8n -->|Review| GDrive[Google Drive]
        n8n -->|Publish| Sanity
        n8n -->|Post| Twitter[X / Twitter]
        n8n -->|Post| LinkedIn[LinkedIn]
    end
```

## 🧩 Core Components

### 1. Hybrid Data Strategy
-   **Static Data (`src/data/portfolio.tsx`)**: Used for "permanent" content like Projects, Experience, and Skills.
    -   *Reason*: Typesafety, version control, zero latency.
-   **Headless CMS (Sanity)**: Used for dynamic Blog posts.
    -   *Reason*: Rich text editing, frequent updates, media management.
-   **External Docs (GitHub)**: Technical documentation is fetched raw from GitHub repositories.
    -   *Reason*: Documentation lives with the code, single source of truth.

### 2. Rendering Strategy
-   **Server Components (RSC)**: Default for all pages (`page.tsx`) to ensure optimal SEO and initial load performance.
-   **Client Components**: Used only for interactive islands (Carousels, Framer Motion animations, Lightboxes).
-   **Static Generation (SSG)**: Blog posts are statically generated at build time (or revalidated incrementally) for speed.

### 3. Asset Management
-   **Next.js Image**: Automatic optimization (format, size) for local assets.
-   **JSDelivr CDN**: Serves project screenshots from GitHub repositories for global caching and versioning.
-   **Sanity CDN**: Hosts blog assets with on-the-fly transformation capabilities.

### 4. Styling System
-   **Tailwind CSS**: Utility-first styling for rapid development and low bundle size.
-   **UI Library**: Custom system based on Radix UI primitives and Shadcn/UI for accessible, headless components.
-   **Theming**: Dark mode native support via `next-themes`.

## 🤖 Automation Integration
The "Omni-Post" system connects the portfolio to the creator's productivity workflow.
-   **Input**: Ideas logged in Notion.
-   **Processing**: n8n workflow triggers AI generation.
-   **Output**: Content is formatted for Blog (posted to Sanity) and Social Media.
-   *Note*: The portfolio website purely *displays* the output (Blog posts) and links to the automation docs; it does not trigger the automation itself.

## 🔒 Security & Performance
-   **CSP**: Strict Content Security Policy.
-   **Environment Variables**: Secure credential management for API keys.
-   **Edge Caching**: Vercel's global edge network caches static assets and ISR pages.
-   **Rate Limiting**: Applied to API routes (Contact Form) to prevent abuse.

## 📂 Key Directories
-   `src/app`: Routes & Pages.
-   `src/components`: UI building blocks.
-   `src/lib`: Core logic & utilities (Fallbacks, API wrappers).
-   `src/sanity`: CMS definitions.

For detailed implementation specifics, refer to `docs/PORTFOLIO-DOCUMENTATION.md`.
