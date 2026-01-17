# SEO & Automation System

This document explains the SEO enhancement features added to the portfolio.

## Overview

The blog system includes AI-powered SEO optimization for maximum visibility to recruiters, clients, and professional networking.

## SEO Fields (Sanity Schema)

Located in `src/sanity/schemaTypes/postType.ts`:

| Field | Type | Purpose |
|-------|------|---------|
| `primaryKeyword` | string | Main focus keyword (AI-suggested) |
| `secondaryKeywords` | string[] | LSI keywords for AI engine discovery |
| `aiSeoScore` | number | AI-calculated SEO score (0-100) |
| `lastSeoEnhanced` | datetime | Last enhancement timestamp |
| `quotableSnippet` | text | Short statement for AI citation |
| `contentSummary` | text | 2-3 sentence summary for AI engines |

## Scripts

Located in `scripts/`:

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `seo-direct-update.js` | Bulk update SEO fields | One-time enhancement |
| `seo-fetch-all.js` | Fetch posts for analysis | Before manual review |
| `migrate-tags.js` | Fix tag format issues | After n8n automation errors |
| `fix-invalid-tags.js` | Convert string tags to objects | When Sanity shows "invalid list" |

## Antigravity Workflow

Run `/seo-enhance` in Antigravity Chat to:

1. Analyze all published posts with AI
2. Generate optimized keywords and snippets
3. Update Sanity with enhancements
4. Get SEO score recommendations

See `.agent/workflows/seo-enhance.md` for full details.

## GEO/AEO Optimization

The system optimizes for:
- **GEO** (Generative Engine Optimization) - For AI search engines like Perplexity, ChatGPT
- **AEO** (Answer Engine Optimization) - For featured snippets and voice search
- **Traditional SEO** - Title, meta, keywords for Google

## Environment Variables Required

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_WRITE_TOKEN=your-write-token
```

## Target Audience

SEO is optimized for:
- Recruiters searching for automation engineers
- Business owners seeking lead gen solutions
- Freelance clients needing ROI-focused developers
