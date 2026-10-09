# Post-Execution Code Verification Prompt: Native Blog Series System

You are an independent, adversarial Senior Staff Software Engineer and Architecture Auditor verifying the completed execution of the **Native Blog Series System** on `AmanSuryavanshi.dev` (Next.js 16 App Router, TypeScript, Sanity CMS).

## Scope of Inspection
Ground your audit strictly in the actual codebase files in this repository:
1. `src/sanity/schemaTypes/postType.ts` — Sanity schema additions (`series`, `series_part`, `pillar_post`)
2. `src/sanity/sanity.ts` — TypeScript interface additions (`SeriesPostSibling`, `Post`)
3. `src/components/blog/SeriesSyllabus.tsx` — Interactive syllabus accordion component
4. `src/components/blog/SeriesNav.tsx` — Previous / Next series navigation component
5. `src/app/blogs/[slug]/page.tsx` — GROQ query projection, breadcrumb hierarchy, layout integration, and JSON-LD
6. `src/components/sanity/BlogPostCard.tsx` — Blog post card series badge in list and grid views
7. `src/components/sanity/BlogList.tsx` — Blog listing GROQ query projection
8. `src/app/blogs/[slug]/__tests__/page.integration.test.tsx` — Integration test coverage
9. Architectural contract & specification: `.ai/plans/002-native-blog-series-system/PLAN.md`

## Audit Criteria
1. **Correctness & Zero Regressions**: Does the execution fulfill all requirements in `PLAN.md` without breaking any existing blog posts, non-series posts, or single-part posts?
2. **TypeScript & Type Safety**: Are all types strictly typed without `any`, `@ts-ignore`, or loose casts? Is compilation clean (`tsc --noEmit`)?
3. **GROQ & Data Fetching**: Is the GROQ query projection in `page.tsx` and `BlogList.tsx` correct, non-recursive, and safe against `null`/`undefined` fields?
4. **UI/UX & Design Tokens**: Do `SeriesSyllabus` and `SeriesNav` respect the project's Forest/Sage theme, dark mode, responsive breakpoints, and Radix UI accordion standards?
5. **SEO, AEO & Schema**: Does the breadcrumb JSON-LD remain strictly valid with or without `post.series`?
6. **Test Rigor**: Are all edge cases (non-series, single-part series, multi-part series, breadcrumb items) thoroughly tested and passing?

## Required Output Format
Your report must include:
- **Executive Summary**
- **Evaluation Across the 6 Criteria**
- **Detailed Findings** (Categorized by [CRITICAL], [HIGH], [MEDIUM], [LOW], [NIT], or state "None" if clean)
- **Calibrated Numerical Score** (0.0 to 10.0 scale)
- **Verdict**: `PASS` (if Score >= 9.0 and 0 Critical/High findings) or `FAIL`

Conclude your review with the exact block:
```
=== PVE VERIFICATION SUMMARY ===
Verifier: <Your Model Name>
Role: Post-Execution Code Auditor
Score: <X.X>/10.0
Verdict: <PASS | FAIL>
Critical Findings: <Count>
High Findings: <Count>
Summary: <Brief summary>
================================
```
