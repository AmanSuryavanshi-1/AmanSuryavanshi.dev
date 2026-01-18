---
description: Audit and enhance SEO/AEO/GEO for project documentation - run with /project-seo-audit
---

# Project SEO/AEO/GEO Audit Workflow

This workflow audits ALL project documentation (Technical Docs & Executive Summaries) for maximum visibility to land freelance clients, job offers, and build your network.

## Goals
- 🎯 Freelancing clients & job offers
- 🎯 AI search visibility (ChatGPT, Perplexity, Claude, Gemini)
- 🎯 Google featured snippets & rich results
- 🎯 Social sharing optimization

## What It Does

1. Scans `projects.ts` for all registered projects
2. Checks `DOCS_MAP` in `[slug]/page.tsx` for documentation coverage
3. Fetches and analyzes each documentation file from GitHub
4. Identifies SEO/AEO/GEO gaps
5. Provides actionable recommendations
6. Updates structured data if needed

## Prerequisites

Ensure you have access to:
- `src/data/content/projects.ts` - Project definitions
- `src/app/projects/[slug]/page.tsx` - Documentation mappings

## Steps

### Step 1: Pre-Audit Questions

Ask the user:
1. "Have you added any new projects recently that need documentation?"
2. "Are there specific projects you want to prioritize?"
3. "Any recent achievements or metrics to highlight (revenue, clients, etc.)?"

### Step 2: Scan Project Registry

Read and analyze `src/data/content/projects.ts`:

```javascript
// Extract project IDs and check for:
const auditChecklist = {
  hasExecutiveSummary: false,  // Business transformation story
  hasTechnicalDoc: false,      // Architecture deep-dive
  hasMetrics: false,           // Revenue, leads, automation %
  hasGallery: false,           // Multiple images for social
  hasVideoYouTubeId: false,    // Video demo
  hasBlogUrl: false,           // Cross-linked blog post
};
```

### Step 3: Check Documentation Coverage

Read `src/app/projects/[slug]/page.tsx` and verify:

1. **DOCS_MAP entries** - Does each project have documentation URLs?
2. **DOC_TO_PROJECT_ID** - Are mappings correct?
3. **TITLES_MAP** - Are titles optimized for SEO (include metrics, outcomes)?
4. **HOWTO_SCHEMAS** - Do technical docs have HowTo schema?

### Step 4: Fetch & Analyze Each Documentation

For each documentation URL in DOCS_MAP:

1. Fetch the raw markdown from GitHub
2. Analyze for SEO/AEO/GEO:

```markdown
## SEO Analysis Checklist

### Traditional SEO
- [ ] Title includes outcome/metric ("₹300K", "80% reduction")
- [ ] First paragraph answers "What does this do?"
- [ ] H2 headings are question-based ("How does X work?")
- [ ] Contains 3+ internal links to related content
- [ ] Includes author attribution "Aman Suryavanshi"

### AEO (Answer Engine Optimization)
- [ ] Has quotable 1-2 sentence summary in first 100 words
- [ ] Contains "bottom line" or TL;DR section
- [ ] Metrics are cited with specific numbers
- [ ] Author expertise is mentioned

### GEO (Generative Engine Optimization)
- [ ] Content is structured with clear headers
- [ ] Has FAQ or Q&A format sections
- [ ] Contains unique insights not found elsewhere
- [ ] Includes specific technology stack details
- [ ] Has comparison or "alternatives" section
```

### Step 5: Use AI for Deep Analysis

Use `search_web` or `mcp_perplexity-ask_perplexity_ask` with this prompt:

```
You are an SEO/AEO/GEO expert analyzing developer portfolio documentation for 2026.

Author: Aman Suryavanshi, AI Solutions Architect & n8n Expert
Goal: Attract job offers (₹15-25L), freelance clients, build professional network

Analyze this documentation:

TITLE: {title}
TYPE: {Executive Summary | Technical Documentation}
CONTENT: {first 3000 chars of markdown}

Provide analysis:
{
  "seoScore": number (0-100),
  "aeoScore": number (0-100),  // Answer Engine Optimization
  "geoScore": number (0-100),  // Generative Engine Optimization
  "missingElements": ["list of missing SEO elements"],
  "suggestedTitle": "SEO-optimized title with metrics",
  "suggestedQuotableSnippet": "1-2 sentences that AI would cite",
  "targetKeywords": ["5-8 high-intent keywords"],
  "improvements": ["3-5 specific actionable improvements"],
  "competitorGap": "What unique angle differentiates this from competitors"
}

Focus on keywords that:
1) Recruiters searching for n8n/automation engineers use
2) Business owners seeking automation solutions search
3) Demonstrate ROI and business transformation
```

### Step 6: Check Metadata & Structured Data

Verify in `[slug]/page.tsx`:

1. **openGraph.images** - Each doc has project image
2. **twitter.card** - summary_large_image set
3. **alternates.canonical** - Canonical URL set
4. **HOWTO_SCHEMAS** - Technical docs have HowTo schema

### Step 7: Update llms.txt

Check if `public/llms.txt` includes:
- All new projects
- All documentation links
- Updated services/skills

### Step 8: Generate Report

Create a report with:

```markdown
## Project SEO Audit Report

### Coverage Summary
| Project | Exec Summary | Tech Doc | HowTo Schema | OG Image |
|---------|--------------|----------|--------------|----------|
| aviators-training-centre | ✅ | ✅ | ✅ | ✅ |
| n8n-automation-suite | ✅ | ✅ | ✅ | ✅ |
...

### Scores
| Project | SEO | AEO | GEO | Overall |
|---------|-----|-----|-----|---------|
...

### Priority Fixes
1. [HIGH] Add HowTo schema for XYZ
2. [MEDIUM] Update title to include metrics
3. [LOW] Add FAQ section

### Missing Documentation
- Project X needs Executive Summary
- Project Y needs Technical Documentation
```

## Quick Checks

Run these commands to verify:

```bash
# Check for projects without documentation
grep -E "^    id:" src/data/content/projects.ts | wc -l
grep -E "'[a-z-]+':" src/app/projects/[slug]/page.tsx | wc -l

# Verify llms.txt is up to date
cat public/llms.txt | grep "/projects/"
```

## Automated Fixes

When issues are found, offer to:
1. Add missing DOCS_MAP entries
2. Create HowTo schema for technical docs
3. Update TITLES_MAP with SEO-optimized titles
4. Update llms.txt with new projects
5. Add missing OG images to metadata

## Notes

- Run this after adding new projects
- Complement with `/seo-enhance` for blog posts
- Update quarterly for best results
- Focus on "quotable snippets" that AI engines cite
- Always include metrics (₹, %, numbers) in titles
- Cross-link between projects and blog posts

## Example Run

```
/project-seo-audit

> Scanning 8 projects...
> Found 9 documentation files in DOCS_MAP
> Missing: portfolio-website (no exec summary)
> Missing: ecommerce-platform (no technical doc)

> Analyzing documentation content...
> aviators-training-centre: SEO 92 | AEO 88 | GEO 85
> n8n-github-backup: SEO 89 | AEO 91 | GEO 87
> barkat-enterprise: SEO 78 | AEO 72 | GEO 70 ⚠️

> Priority Fixes:
> 1. [HIGH] barkat-enterprise needs quotable snippet in first paragraph
> 2. [MEDIUM] Add FAQ section to foodah technical doc
> 3. [LOW] Update omni-post title to "74-Node Workflow That..."

> Shall I apply these fixes?
```
