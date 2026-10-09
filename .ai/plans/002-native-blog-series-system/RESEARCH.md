# Research Digest — Native Blog Series System

**Date:** 2026-10-07  
**Project:** AmanSuryavanshi.dev  
**Scope:** Sanity Schema, TypeScript contracts, GROQ queries, Next.js 15 App Router components, Breadcrumbs, BlogPostCard, and Jest integration tests.

---

## 1. Existing System Analysis

### Sanity Schema & Studio
- `src/sanity/schemaTypes/postType.ts`:
  - Contains groups: `content` (default), `seo`, `meta`.
  - Field `categories` is deprecated and hidden (line 79).
  - Field `primary_category` (line 263) and `subcategory` (line 270) live under `meta`.
  - Adding `series` (string), `series_part` (number), and `pillar_post` (boolean) under `meta` preserves group organization and is fully optional and backwards-compatible with all existing posts in Sanity.

### TypeScript Definitions
- `src/sanity/sanity.ts`:
  - `Post` interface defines post shape used across components and pages.
  - Adding optional fields:
    ```typescript
    export interface SeriesPostSibling {
      _id: string;
      title: string;
      slug: { current: string; _type: 'slug' };
      series_part?: number;
      pillar_post?: boolean;
    }
    ```
  - Appending to `Post`: `series?: string; series_part?: number; pillar_post?: boolean; seriesPosts?: SeriesPostSibling[];`
  - Guarantees zero regression on existing pages.

### GROQ Querying & Resolution
- `src/app/blogs/[slug]/page.tsx`:
  - `getPost(slug)` queries `*[_type == "post" && slug.current == $slug][0]`.
  - Sibling series posts query:
    ```groq
    series,
    series_part,
    pillar_post,
    "seriesPosts": *[_type == "post" && defined(series) && series == ^.series && status == "published"] | order(series_part asc) {
      _id,
      title,
      slug,
      series_part,
      pillar_post
    },
    ```
  - When `series` is undefined or null, `series == ^.series` evaluates to false against any post with `defined(series)`, returning `[]` or `null`.
- `src/components/sanity/BlogList.tsx`:
  - `POSTS_QUERY` fetches cards for `/blogs`.
  - Adding `series, series_part, pillar_post` ensures the blog index displays series badges immediately.

### UI Architecture & Design System
- Aesthetic: Forest / Sage / Lime design tokens (`forest-900`, `forest-800`, `forest-950`, `sage-100`, `sage-300`, `lime-400`, `lime-500`, `lime-600`).
- Accordion Primitive: `@radix-ui/react-accordion` already styled and wrapped in `src/components/ui/accordion.tsx` (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`).
- `Breadcrumbs.tsx`:
  - Generic presentation component taking `items: { label: string; href?: string; }[]`.
  - `page.tsx` constructs `breadcrumbItems` and JSON-LD `BreadcrumbList`.
  - Existing integration test in `page.integration.test.tsx` line 245 asserts:
    ```typescript
    expect(screen.getByRole('link', { name: 'AI Automation' })).toHaveAttribute('href', '/blogs?category=ai-automation');
    expect(screen.getByRole('link', { name: 'SEO Systems' })).toHaveAttribute('href', '/blogs?category=ai-automation&sub=seo-systems');
    ```
  - Invariant: When `post.series` is present, prepend/nest without stripping category links.

### Baseline Validation
- TypeScript `node node_modules/typescript/bin/tsc --noEmit`: 0 errors (Pass).
- Jest `node ./node_modules/jest/bin/jest.js --runInBand page.integration.test.tsx`: 5/5 passed (Pass).
