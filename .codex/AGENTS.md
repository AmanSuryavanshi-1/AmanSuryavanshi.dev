#  Agent Directives - UAPM Standard (COMPILED  DO NOT EDIT BY HAND)
# PROJECT: AmanSuryavanshi.dev
# Edit .ai/ files, then re-run: powershell -File .ai/bin/compile.ps1

Before writing any code, read these .ai/ files:
1. .ai/MEMORY.md (active goals)
2. .ai/ARCHITECTURE.md (non-obvious gotchas)
3. .ai/DECISIONS.md (committed architectural decisions)
4. .ai/GOTCHAS.md (known pitfalls)
5. .ai/skills/ (task-specific workflows â€” load before executing)

---

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## OmniPost Asset Sync Rule
- **CRITICAL:** Whenever a new image or video asset is added to `public/Project`, you MUST immediately update `A:\_SecondBrain\04-Knowledge\mcp-asset-index.md` to reflect the addition. Include the semantic context, asset ID, and any YouTube/Local timestamp mapping. This ensures the OmniPost AI pipeline always has access to the latest visuals.


# System Architecture

## Overview

**AmanSuryavanshi.dev** is a modern, full-stack portfolio and blog platform built with Next.js 15, specialized for performance, SEO, and AI-driven automation. It serves as a personal brand showcase, a technical blog, and a playground for automation experiments.

## ðŸ—ï¸ High-Level Architecture

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

## ðŸ§© Core Components

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
-   **FallbackImageManager**: Custom class (`src/lib/fallback-image-manager.ts`) and hook (`useFallbackImage.ts`) guaranteeing 100% image availability for external/dynamic markdown content via categorical, contextual, and random programmatic fallbacks.
-   **JSDelivr CDN**: Serves project screenshots from GitHub repositories for global caching and versioning.
-   **Sanity CDN**: Hosts blog assets with on-the-fly transformation capabilities.

### 4. Styling System & Components
-   **Tailwind CSS**: Utility-first styling for rapid development and low bundle size.
-   **UI Library**: Custom system based on Radix UI primitives and Shadcn/UI for accessible, headless components.
-   **Icon Architecture**: Centralized dynamic string-to-React-Icon mapping in `src/data/icons/icon-map.ts` to prevent massive global imports.
-   **Theming**: Dark mode native support via `next-themes`.
-   **Markdown Integration**: Uses custom `MarkdownViewer` to map parsed `src/content/projects/` markdown into Tailwind styled components (prose-invert), tightly integrated with `FallbackImageManager` for bulletproof asset rendering.

## ðŸ¤– Automation Integration
The "Omni-Post" system connects the portfolio to the creator's productivity workflow.
-   **Input**: Ideas logged in Notion.
-   **Processing**: n8n workflow triggers AI generation.
-   **Output**: Content is formatted for Blog (posted to Sanity) and Social Media.
-   *Note*: The portfolio website purely *displays* the output (Blog posts) and links to the automation docs; it does not trigger the automation itself.

## ðŸ”’ Security & Performance
-   **CSP**: Strict Content Security Policy.
-   **Environment Variables**: Secure credential management for API keys.
-   **Edge Caching**: Vercel's global edge network caches static assets and ISR pages.
-   **Rate Limiting**: Applied to API routes (Contact Form) to prevent abuse.

## ðŸ“‚ Key Directories
-   `src/app`: Routes & Pages.
-   `src/components`: UI building blocks.
-   `src/lib`: Core logic & utilities (Fallbacks, API wrappers).
-   `src/sanity`: CMS definitions.

For detailed implementation specifics, refer to `docs/PORTFOLIO-DOCUMENTATION.md`.


# Architectural Decisions (ADR)

1. **Frontend**: Next.js 15 App Router with Tailwind CSS and Radix UI / Shadcn.
2. **Content Management**: Hybrid approach using Sanity CMS for dynamic blogs and Static Data for portfolio elements.
3. **Automation**: Self-hosted n8n workflows integrated with Gemini API.
4. **Rendering**: RSC by default, SSG for blog posts.
5. **Asset Resilience (ADR 5)**: Custom `FallbackImageManager` ensures 100% image load success for all external markdown projects, deliberately overriding default next/image `<Image onError>` for better architectural separation.
6. **Stateless Portfolio (ADR 6)**: The core Next.js portfolio intentionally avoids global state managers (like Redux). *Note: Redux is heavily mentioned in the codebase, but only within static project documentation (e.g., Foodah, AV NewsStream) as strings.*
7. **Centralized Icon Mapping (ADR 7)**: React Icons are globally mapped to string keys inside `src/data/icons/icon-map.ts` to allow dynamic badge rendering without bloating individual components with huge imports.


# Gotchas
- **Gotcha 1 - Missing Icons**: If you add a new "techStack" or "badge" to `src/data/content/projects.ts`, it will crash or fail to render unless you manually map the string to an imported react-icon in `src/data/icons/icon-map.ts`.
- **Gotcha 2 - The Redux Mirage**: A simple `grep` will find many references to Redux Toolkit and `createSlice`. **Do not attempt to use Redux in this Next.js codebase.** These are purely markdown/string descriptions of past past projects like "Foodah" or "AV NewsStream". The Next.js portfolio itself is stateless.
- **Gotcha 3 - OmniPost Synchronicity**: Updating anything in `public/Project` means you MUST update the vault's `mcp-asset-index.md` as per the `AGENTS.md` rules, otherwise the n8n AI Content pipeline will have broken/missing asset context.


