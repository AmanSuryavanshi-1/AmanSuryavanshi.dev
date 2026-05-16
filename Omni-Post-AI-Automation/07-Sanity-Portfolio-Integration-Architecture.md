# Omni-Post AI to Sanity Portfolio Integration Architecture

> **Role:** Technical Specification
> **Scope:** Omni-Post AI Automation Engine (Part 2) connection to `amansuryavanshi.dev` Portfolio Sanity CMS.
> **Last Updated:** April 2026

---

## 1. Overview & Architecture Flow

![Sanity Data Transformation Sequence](https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/sanity-data-transformation.webp)


The Omni-Post AI Automation Engine operates in two phases. Part 1 acts as the **Generative Engine**, utilizing AI and Obsidian MCP context to write platform-specific drafts. Part 2 acts as the **Distribution Engine**, taking approved drafts from Notion and pushing them to multiple platforms, including the primary portfolio blog managed via Sanity CMS.

### Data Lifecycle
1. **Generation (Part 1)**: AI writes the blog draft containing SEO strategies ("Career Engineer" framework) and injects it into Notion. Properties and drafts are saved using the Notion API.
2. **Staging**: Notion acts as the source of truth and review gate. Once marked "Approved", Part 2 is triggered.
3. **Extraction & Parsing (Part 2)**: The automation pulls the Notion payload. The `Code - Parse Blog Content` (Blog Parser V16) extracts Markdown, images, and custom SEO fields.
4. **Transformation**: The `Code - Rebuild Blog Blocks with Image References` script tokenizes Markdown and converts it into a Sanity Portable Text mutation structure.
5. **Publishing**: The formatted payload is sent to the Sanity API to create/update the `post` document.

---

## 2. Source Data: Notion Properties

Part 1 stores highly structured metadata directly in Notion alongside the raw markdown text. 

Key SEO & Organization properties extracted:
- `property_shared_seo_title`
- `property_shared_slug`
- `property_shared_seo_description`
- `property_shared_tags`
- `property_shared_focus_keyword`
- `property_shared_article_type`
- `property_shared_quotable_snippet`
- `property_shared_content_summary`
- `property_shared_faq_json` (AEO strategy)
- `property_shared_key_takeaways` (AEO strategy)
- `property_internal_links`
- `property_breadcrumb`
- `property_cta_type` & `property_cta_text`
- `property_series_part` & `property_pillar_post`
- `property_primary_category` & `property_subcategory`

---

## 3. Transformation: Omni-Post Part 2 Nodes

The connection logic resides in two essential Code Nodes in Part 2.

### A. Blog Parser V16.0 (`Code - Parse Blog Content.js`)
- **Block Splitting**: Splits the monolithic Markdown draft into distinct `text` and `image` blocks based on the `<IMAGE_N>` marker pattern.
- **Asset Attachment**: Cross-references image markers with downloaded binaries (falling back to multiple sources) ensuring that images in the content body match the required assets.
- **Validation**: Sanitizes fields and parses JSON structures for FAQs and Takeaways, outputting a consolidated JSON payload.

### B. Portable Text Rebuilder V14.0 (`Code - Rebuild Blog Blocks with Image References.js`)
Sanity requires the strict "Portable Text" JSON specification instead of Markdown.
- **Tokenization**: Parses headers (`#`, `##`), lists (ordered, unordered), fenced code blocks, and inline formatting (`**`, `__`, `*`, `_`, `\``).
- **UUID Generation**: Generates unique `_key` identifiers for every block and inline text span as required by Sanity.
- **Image Mapping**: Converts `type: 'image'` blocks into Sanity `_type: 'image'` blocks referencing the pre-uploaded asset IDs.
- **Sanity Payload Construction**: Maps all SEO fields, constructs the body array, and shapes the final `mutations` payload for the Sanity API.

---

## 4. Destination: Sanity `post` Schema Mapping

The portfolio codebase (`amansuryavanshi.dev/src/sanity/schemaTypes/postType.ts`) defines the `post` document. Below is the precise mapping from the automation output to the Sanity schema.

### Core Content (`content` group)
| Notion / Omni-Post Field | Sanity Field (`post` schema) | Type |
|--------------------------|-------------------------------|------|
| `title` | `title` | `string` |
| `slug` | `slug.current` | `slug` |
| `description` / `excerpt`| `excerpt` | `text` |
| `focusKeyword` | `focusKeyword` | `string` |
| `keywords` / `tags` | `tags[]` | `array` (label & slug) |
| *Calculated* | `publishedAt` | `datetime` |
| `blocks` (Markdown) | `body` | `blockContent` |

### Answer Engine Optimization (AEO) & SEO (`seo` group)
Optimized by the "Career Engineer" AI framework to maximize semantic visibility and feature snippets in platforms like Perplexity and ChatGPT.

| Omni-Post Field | Sanity Field | Description |
|-----------------|--------------|-------------|
| `seoTitle` | `seoTitle` | Optimized title for search engines. |
| `description` | `metaDescription` | Short meta description (max 160 chars). |
| `quotableSnippet` | `quotableSnippet` | Short, quotable answer designed for AI engine extraction. |
| `contentSummary` | `contentSummary` | 2-3 sentence overview optimized for AI citation. |
| `focusKeyword` | `primaryKeyword` | Target primary search term. |
| `secondaryKeywords` | `secondaryKeywords` | LSI terms for semantic context. |
| `faqItems` | `faqItems` | Question/Answer pairs mapped to FAQ schema. |
| `keyTakeaways` | `keyTakeaways` | List of actionable bullet points. |
| `internalLinks` | `internal_links` | Semantic internal linking mapping. |
| `ctaType` / `ctaText` | `cta_type` / `cta_text`| Strategy-based CTA mapping. |
| *Calculated* | `canonicalUrl` | Crucial for Dev.to / Hashnode cross-posting (`https://amansuryavanshi.me/blogs/${slug}`). |

### Structural Metadata (`meta` group)
| Omni-Post Field | Sanity Field | Note |
|-----------------|--------------|------|
| `primaryCategory` | `primary_category` | Reference mapping. |
| `subcategory` | `subcategory` | String identifier. |
| `articleType` | `articleType` | Categorization for Schema.org (e.g., tutorial, guide). |

---

## 5. Security & Operations

- **API Authorization**: Uses a Sanity API Token configured as a credential inside n8n.
- **Image Pipeline Constraint**: Sanity requires images to be uploaded *first*. The automation uploads images yielding an `assetId`, which is then referenced in the Portable Text mutation payload (`Code - Rebuild Blog Blocks`).
- **Idempotency**: Drafts are merged into Sanity via `create` mutation, leveraging unique slugs. Cross-posted versions (Dev.to, Hashnode) utilize the generated Sanity `canonicalUrl` to avoid SEO cannibalization and maintain authority on `amansuryavanshi.me`.

---
*Document automatically generated by AI Execution Agent.*