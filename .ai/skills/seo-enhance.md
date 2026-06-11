---
description: Enhance SEO for blog posts using AI analysis - run with /seo-enhance
---

# SEO Enhancement Workflow

This workflow analyzes ALL published blog posts and enhances their SEO & AI fields for maximum visibility to attract job offers, freelance clients, and networking opportunities.

## What It Does

1. Fetches all published posts from Sanity
2. Reads each blog content thoroughly
3. Uses AI (Perplexity) to analyze and generate:
   - Primary keyword (high-intent for recruiters/clients)
   - Secondary keywords (LSI for AI engine discovery)
   - Quotable snippet (for AI citation by Perplexity/ChatGPT)
   - Content summary (2-3 sentences for AI engines)
   - AI SEO score (0-100)
4. Updates Sanity documents with enhancements
5. Reports results

## Prerequisites

Ensure these are set in `.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_WRITE_TOKEN`

## Steps

### Step 1: Pre-Enhancement Questions

Before starting, ask the user:
1. "Are there any specific posts you want to prioritize?"
2. "Any recent context I should know (new skills, project completions, target roles)?"
3. "Should I focus on any specific audience (recruiters, clients, developers)?"

### Step 2: Fetch All Published Posts

```javascript
// GROQ Query
const query = `*[_type == "post" && status == "published"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  body,
  excerpt,
  tags,
  primaryKeyword,
  aiSeoScore,
  lastSeoEnhanced
}`;
```

### Step 3: Analyze Each Post

For each post, use the `mcp_perplexity-ask_perplexity_ask` tool with this prompt:

```
You are an expert SEO consultant for developers seeking job offers and freelance clients in 2026.

Author: Aman Suryavanshi, AI Solutions Architect & Full-Stack Agentic Developer
Goal: Attract job offers (₹15-25L), quality freelance clients, and grow professional network

Analyze this blog post:

TITLE: {post.title}
CONTENT: {extractedText}

Provide a JSON response with:
{
  "primaryKeyword": "high-intent keyword that recruiters/clients search (3-4 words)",
  "secondaryKeywords": ["6-8 LSI keywords mixing technical skills + business outcomes"],
  "quotableSnippet": "1-2 sentence quotable statement that AI engines would cite, mentioning Aman Suryavanshi",
  "contentSummary": "2-3 sentence summary for AI citation with author name and specific results",
  "aiSeoScore": number (0-100),
  "targetAudience": ["who should find this"]
}

Focus on keywords that:
1) Recruiters searching for automation engineers use
2) Business owners seeking solutions search
3) Demonstrate ROI and business impact
```

### Step 4: Update Sanity Documents

```javascript
await client
  .patch(post._id)
  .set({
    primaryKeyword: analysis.primaryKeyword,
    secondaryKeywords: analysis.secondaryKeywords,
    quotableSnippet: analysis.quotableSnippet,
    contentSummary: analysis.contentSummary,
    aiSeoScore: analysis.aiSeoScore,
    lastSeoEnhanced: new Date().toISOString()
  })
  .commit();
```

### Step 5: Report Results

After processing all posts, display:
- Posts enhanced: X
- Average SEO score: Y
- Top keywords generated
- Recommended next actions

## Quick Run

For a quick enhancement, run the script:
```bash
node scripts/seo-enhance-all.js
```

## Notes

- Focus on GEO (Generative Engine Optimization) for AI search engines
- Include quotable snippets that Perplexity/ChatGPT would cite
- Always mention "Aman Suryavanshi" in summaries for author attribution
- Target keywords recruiters and clients actually search
- Update regularly after publishing new content
