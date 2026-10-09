# Implementation Plan — Native Blog Series Support & UI System

**Plan Version:** v1  
**Created:** 2026-10-07  
**Plan Folder:** `.ai/plans/002-native-blog-series-system/`  
**Related Research:** `.ai/plans/002-native-blog-series-system/RESEARCH.md`  

---

## 1. Problem & Goal

### Problem Statement
Technical articles on AmanSuryavanshi.dev currently render as standalone individual posts without structured continuity. For multi-part foundational topics (such as "Building Production AI Agents" or "Enterprise Automation with n8n"), readers and prospective enterprise clients cannot easily navigate between sequential parts, view the entire syllabus of a masterclass series, or identify cornerstone/pillar posts. This limits reading depth, reduces session engagement, and degrades user retention.

### Success Metrics
- **Zero Breaking Changes:** 100% backwards compatibility with all existing posts (posts without series continue rendering identically).
- **TypeScript Integrity:** `npx tsc --noEmit` exits with status `0` and zero type errors.
- **Test Integrity:** All existing and new Jest integration tests in `src/app/blogs/[slug]/__tests__/page.integration.test.tsx` pass cleanly (100% green).
- **UI & UX Precision:** Series syllabus accordion and previous/next navigation cards match the site's Forest/Sage/Lime design tokens with zero layout shift (CLS = 0) and full mobile responsiveness.

### Explicit Scope Fences (Out of Scope)
- No migration or mutation of existing live Sanity database documents during this implementation.
- No modifications to external n8n webhook payloads; existing payload structures are fully respected via optional field schemas.
- No custom URL routing rewrites (articles remain accessible at `/blogs/[slug]`; series navigation links directly to existing post slugs).

---

## 2. Requirements & Acceptance Criteria

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-1 | Sanity Schema Extension | **AC-1.1:** `postType.ts` defines `series` (string), `series_part` (number), and `pillar_post` (boolean, default false) under the `meta` group.<br>**AC-1.2:** All 3 fields are non-required/optional to preserve backwards compatibility for existing documents. |
| REQ-2 | TypeScript Type Safety | **AC-2.1:** `src/sanity/sanity.ts` exports `SeriesPostSibling` interface with `_id`, `title`, `slug`, `series_part?`, `pillar_post?`.<br>**AC-2.2:** `Post` interface contains `series?`, `series_part?`, `pillar_post?`, and `seriesPosts?: SeriesPostSibling[]`. |
| REQ-3 | Sibling Query & GROQ Resolution | **AC-3.1:** `getPost(slug)` in `src/app/blogs/[slug]/page.tsx` projects `series`, `series_part`, `pillar_post`, and fetches sibling posts matching `*[_type == "post" && defined(series) && series == ^.series && status == "published"] \| order(series_part asc)`.<br>**AC-3.2:** `POSTS_QUERY` in `src/components/sanity/BlogList.tsx` projects `series`, `series_part`, `pillar_post` so cards on the blog listing page have access to series metadata. |
| REQ-4 | Series UI Components | **AC-4.1:** `src/components/blog/SeriesSyllabus.tsx` renders a high-contrast Radix Accordion titled `Series: [series] (Part [current] of [total])` ONLY if `series` and `seriesPosts.length > 1` exist. Sibling sorting deterministically orders by `series_part asc` (falling back to title for ties), matching current post by slug and highlighting it with an "Active" badge. Displays a "Pillar" badge if `pillar_post` is true.<br>**AC-4.2:** `src/components/blog/SeriesNav.tsx` renders dual Previous/Next cards styled with Forest/Sage tokens at the bottom of the article before `RelatedPosts` if sequential siblings exist (returns `null` for single-part series).<br>**AC-4.3:** Breadcrumb hierarchy in `page.tsx` includes `post.series` when present, without breaking existing category/subcategory query-param links, and JSON-LD `BreadcrumbList` resolves intermediate non-link series items to canonical or clean URLs without duplicating `/blogs`.<br>**AC-4.4:** `BlogPostCard.tsx` renders an elegant pill badge `[series] · Part [part]` (with optional `Pillar` tag) when `post.series` is present in both list and grid view modes. |

---

## 2.5. Codebase Intelligence & Context References (Cole Medin R-PIV)

### Relevant Codebase Files
- `src/sanity/schemaTypes/postType.ts` (lines 260-275) — Existing `meta` group fields (`primary_category`, `subcategory`). Series fields must be inserted cleanly adjacent to these.
- `src/sanity/sanity.ts` (lines 88-130) — Canonical `Post` interface declaration.
- `src/app/blogs/[slug]/page.tsx` (lines 40-125 & 200-240) — `getPost(slug)` GROQ query and `breadcrumbItems` calculation.
- `src/components/ui/accordion.tsx` (lines 1-59) — Radix UI Accordion wrapper (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`).
- `src/components/sanity/BlogPostCard.tsx` (lines 135-145 & 200-210) — Title rendering in List and Grid views.
- `src/app/blogs/[slug]/__tests__/page.integration.test.tsx` (lines 165-252) — Canonical integration test harness.

### Extracted Codebase Patterns
- **Styling Tokens:** Backgrounds `bg-white/90 dark:bg-forest-950/90`, borders `border-sage-200 dark:border-forest-800`, text `text-forest-900 dark:text-sage-100`, accents `text-lime-600 dark:text-lime-400`, hover states `hover:border-lime-500 hover:shadow-md`.
- **Client vs Server Components:** Page `src/app/blogs/[slug]/page.tsx` is an async Server Component (RSC); interactive widgets (`SeriesSyllabus`, `Breadcrumbs`) are isolated `'use client'` components.
- **Breadcrumb Link Pattern:** Breadcrumb links support category filtering (`/blogs?category=ai-automation`). When `series` exists, it is inserted into the sequence: Category / Blogs > Series > Current Post Title.

---

## 3. Architecture & Design

### Data Flow & Component Topology

```mermaid
graph TD
    subgraph Data Layer [Sanity CMS & GROQ]
        SanityPost[Sanity Post Document] -->|GROQ getPost slug| BlogPage[src/app/blogs/[slug]/page.tsx RSC]
        SanityPost -->|Sibling Query series == ^.series| SeriesPosts[seriesPosts: SeriesPostSibling[]]
    end

    subgraph Presentation Layer [App Router UI]
        BlogPage --> Breadcrumbs[Breadcrumbs with Series]
        BlogPage --> HeaderImage[BlogHeaderImage]
        BlogPage --> Syllabus[SeriesSyllabus.tsx Accordion]
        BlogPage --> ArticleBody[PortableText Body]
        BlogPage --> SeriesNav[SeriesNav.tsx Prev/Next Cards]
        BlogPage --> RelatedPosts[RelatedPosts Section]
    end

    subgraph Listing Views [/blogs]
        BlogList[BlogList.tsx POSTS_QUERY] --> BlogPostCard[BlogPostCard.tsx with Series Badge]
    end
```

### Design Alternatives Considered & Rejected
- **Alternative 1: Separate Sanity Document Type `seriesType` with references:**  
  *Rejected:* Over-engineers content authoring in Sanity. A lightweight string field `series` + `series_part` allows instant grouping without multi-document relational overhead in Sanity Studio or n8n automated sync.
- **Alternative 2: Fetching sibling posts in a separate client-side hook:**  
  *Rejected:* Violates Next.js 15 RSC principles and introduces layout shift (CLS). Fetching inline via GROQ in `getPost(slug)` ensures sibling data is present at render time with zero client waterfall.
- **Alternative 3: Hard-replacing category breadcrumbs with series breadcrumbs:**  
  *Rejected:* Breaks existing SEO category breadcrumb hierarchy and causes test regressions in `page.integration.test.tsx`. Instead, `series` seamlessly sits as the final hierarchy level before the post title.

---

## 4. Tech Stack & Dependencies

- **Framework:** Next.js 16.0.7 (App Router, Server Components).
- **Language & Types:** TypeScript 5.x.
- **CMS Client:** `@sanity/client` 7.13.0, `next-sanity` 11.6.8, `sanity` 4.18.0.
- **UI Primitives:** `@radix-ui/react-accordion` 1.2.12 via `@/components/ui/accordion`.
- **Icons:** `lucide-react` 0.455.0 (`ChevronRight`, `ChevronDown`, `BookOpen`, `ArrowLeft`, `ArrowRight`, `CheckCircle2`, `Layers`).
- **Zero New Dependencies:** 100% leverages pre-existing installed packages.

---

## 5. Security Considerations

- **Injection Defense:** All series names and titles rendered in JSX are escaped by React's standard rendering engine.
- **GROQ Parameterization:** Sibling query uses GROQ `^.series` reference operator bound to the server-evaluated document; no raw string interpolation in GROQ.
- **Sanity RLS & Permissions:** All fields are public read-only for published documents, matching existing blog posts.
- **XSS & Link Hijacking:** All navigation links use internal Next.js `<Link>` with sanitized slug routes (`/blogs/${encodeURIComponent(post.slug.current)}`).

---

## 6. Scalability & Performance

- **Query Cost:** Sibling query runs within the same GROQ fetch as the main post; zero additional HTTP roundtrips to Sanity API.
- **Cache Strategy:** Inherits standard Next.js / Vercel Edge caching and Sanity CDN caching.
- **Bundle Impact:** `SeriesSyllabus.tsx` reuses the already-imported `@/components/ui/accordion`. Zero net new bundle libraries.
- **Zero CLS:** Series syllabus container has pre-rendered server dimensions; Radix Accordion handles CSS height animations without layout thrashing.

---

## 7. Error Handling, Fallbacks & Rollback

- **Missing / Empty Series:** If `post.series` is undefined or `seriesPosts` is empty/null, `SeriesSyllabus` and `SeriesNav` return `null` and do not render.
- **Single-Part Series:** If a series contains only 1 part, `SeriesSyllabus` displays `(Part 1 of 1)` or hides if `seriesPosts.length <= 1`, and `SeriesNav` gracefully renders `null`.
- **Sparse Part Numbers:** If `series_part` is missing on some sibling posts, the syllabus safely falls back to array index order (`idx + 1`).
- **Rollback Plan:** All fields are non-destructive and optional. If rolled back via `git revert`, Sanity and the frontend continue operating without data corruption.

---

## 8. 6-Level Testing & Verification Strategy

- **Level 1: Syntax & Type Safety:** Run `node node_modules/typescript/bin/tsc --noEmit` asserting exit code `0`.
- **Level 2: Unit / Integration Tests:** Run `node ./node_modules/jest/bin/jest.js --runInBand src/app/blogs/[slug]/__tests__/page.integration.test.tsx` verifying:
  - Existing 5 test cases pass without regression.
  - New test case: Renders `SeriesSyllabus` with active post and parts when `series` and `seriesPosts` are present.
  - New test case: Renders `SeriesNav` with previous and next links.
  - New test case: Breadcrumbs include series title when `series` is present.
- **Level 3: Component Isolation:** Validate `SeriesSyllabus.tsx` and `SeriesNav.tsx` handle edge cases (empty siblings, missing parts, single-part series).
- **Level 4: Capstone Review:** Headless OpenCode verifiers (Meta Muse Spark 1.3 & GPT-6 Luna at xhigh) audit diffs for zero critical/major findings.

---

## 9. Execution Phasing & Task Breakdown

| Task | Action | Target File | Depends on | ACs | Effort |
|------|--------|-------------|-----------|-----|--------|
| T-1 | UPDATE | `src/sanity/schemaTypes/postType.ts` | — | AC-1.1, AC-1.2 | S |
| T-2 | UPDATE | `src/sanity/sanity.ts` | T-1 | AC-2.1, AC-2.2 | S |
| T-3 | CREATE | `src/components/blog/SeriesSyllabus.tsx` | T-2 | AC-4.1 | M |
| T-4 | CREATE | `src/components/blog/SeriesNav.tsx` | T-2 | AC-4.2 | M |
| T-5 | UPDATE | `src/app/blogs/[slug]/page.tsx` | T-3, T-4 | AC-3.1, AC-4.3 | M |
| T-6 | UPDATE | `src/components/sanity/BlogPostCard.tsx` & `BlogList.tsx` | T-2 | AC-3.2, AC-4.4 | S |
| T-7 | UPDATE | `src/app/blogs/[slug]/__tests__/page.integration.test.tsx` | T-5 | AC-1 to AC-4 | M |

### Detailed Executor Task Checklists

#### Task T-1: UPDATE `src/sanity/schemaTypes/postType.ts`
- **IMPLEMENT**: Add `series`, `series_part`, `pillar_post` field definitions under `group: 'meta'`.
- **PATTERN**: Mirror existing `primary_category` and `subcategory` definitions around line 265-275.
- **VALIDATE**: `node node_modules/typescript/bin/tsc --noEmit`
- [ ] Fields added cleanly to `postType.ts`
- [ ] Zero TypeScript errors

#### Task T-2: UPDATE `src/sanity/sanity.ts`
- **IMPLEMENT**: Export `SeriesPostSibling` interface; add `series`, `series_part`, `pillar_post`, `seriesPosts` to `Post` interface.
- **PATTERN**: Follow `Tag` / `Category` interface structures.
- **VALIDATE**: `node node_modules/typescript/bin/tsc --noEmit`
- [ ] Types defined and exported in `sanity.ts`
- [ ] Zero TypeScript errors

#### Task T-3: CREATE `src/components/blog/SeriesSyllabus.tsx`
- **IMPLEMENT**: Build client component with Radix Accordion, displaying series title, total parts, active badge, and sibling links.
- **PATTERN**: Use `@/components/ui/accordion` primitives and Forest/Sage tokens.
- **VALIDATE**: `node node_modules/typescript/bin/tsc --noEmit`
- [ ] Component handles active part highlighting and clean links
- [ ] Zero TypeScript errors

#### Task T-4: CREATE `src/components/blog/SeriesNav.tsx`
- **IMPLEMENT**: Build component rendering previous / next part navigation cards with arrows and titles.
- **PATTERN**: Forest/Sage cards matching `RelatedPosts.tsx` aesthetic.
- **VALIDATE**: `node node_modules/typescript/bin/tsc --noEmit`
- [ ] Previous and Next cards render correctly based on part order
- [ ] Zero TypeScript errors

#### Task T-5: UPDATE `src/app/blogs/[slug]/page.tsx`
- **IMPLEMENT**: Add series fields and sibling projection to `getPost(slug)` query. Insert `post.series` into `breadcrumbItems`. Render `<SeriesSyllabus>` above post content and `<SeriesNav>` before RelatedPosts.
- **VALIDATE**: `node node_modules/typescript/bin/tsc --noEmit`
- [ ] Sibling GROQ query integrated
- [ ] Components integrated into layout
- [ ] Zero TypeScript errors

#### Task T-6: UPDATE `src/components/sanity/BlogPostCard.tsx` & `BlogList.tsx`
- **IMPLEMENT**: Add series badge `[series] · Part [series_part]` above/below post title in `BlogPostCard.tsx`. Add series fields to `POSTS_QUERY` in `BlogList.tsx`.
- **VALIDATE**: `node node_modules/typescript/bin/tsc --noEmit`
- [ ] Series badge renders in list and grid views
- [ ] Zero TypeScript errors

#### Task T-7: UPDATE `src/app/blogs/[slug]/__tests__/page.integration.test.tsx`
- **IMPLEMENT**: Add tests for series syllabus rendering, series nav rendering, and series breadcrumbs.
- **VALIDATE**: `node ./node_modules/jest/bin/jest.js --runInBand src/app/blogs/[slug]/__tests__/page.integration.test.tsx`
- [ ] All tests pass cleanly

---

## 10. Pre-Mortem & Risk Analysis (Gary Klein)

| Failure Mode | Likelihood | Impact | Pre-Emptive Mitigation |
|--------------|------------|--------|------------------------|
| **1. GROQ Sibling Query Failure on Posts Without Series** | Low | Med | When `series` is undefined, `^.series` is null. In GROQ, `defined(series) && series == ^.series` safely evaluates to false, returning `[]`. Handled gracefully in code by guarding with `post.series && post.seriesPosts?.length > 0`. |
| **2. Breadcrumb Test Regression in Existing CI** | Med | High | Existing integration test checks exact category links. Plan keeps category hierarchy intact and nests series hierarchically: `[Category] > ([Subcategory] >) [Series] > [Post Title]`. |
| **3. Mobile Overflow on Series Nav Cards** | Low | Med | SeriesNav cards use `grid grid-cols-1 sm:grid-cols-2 gap-4` to stack vertically on mobile screens. |
| **4. Missing / Out-of-Order Series Parts** | Low | Low | Syllabus and Nav sort by `series_part asc`, falling back to array index order if explicit part numbers are missing. |

---

## 11. Verification Gate Criteria

A plan is APPROVED only when:
1. Composite score **≥ 9.0/10** on the 10-dimension rubric.
2. **No dimension < 8/10**.
3. **Zero critical-severity or major-severity findings**.
4. Full out-of-lineup headless verification conducted with Meta Muse Spark 1.3 (xhigh) and GPT-6 Luna (xhigh).

---

## 12. Appendices & References
- Sanity Schema: `src/sanity/schemaTypes/postType.ts`
- Blog Detail Route: `src/app/blogs/[slug]/page.tsx`
- Blog Card Component: `src/components/sanity/BlogPostCard.tsx`
- Radix Accordion: `src/components/ui/accordion.tsx`
