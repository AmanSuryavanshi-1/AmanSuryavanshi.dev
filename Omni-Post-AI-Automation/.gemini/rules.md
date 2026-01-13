---
version: "1.0.0"
updated: "2026-01-13"
stack: [n8n, notion-api, twitter-api, linkedin-api, sanity-cms, devto-api, hashnode-graphql, gemini-api, perplexity-api, google-drive-api]
inherits: "GEMINI.md"
project: "Omni-Post-AI-Automation"
architecture: "bi-part-workflow"
hosting: "self-hosted-docker-cloudflare-tunnel"
---

# Omni-Post AI - Project Rules

> Multi-platform content automation: Notion → AI → X, LinkedIn, Blog, Dev.to, Hashnode

## 1. Architecture Overview

```
Part 1 (Generation): Notion → AI Strategy → Platform Drafts → Google Drive
Part 2 (Distribution): Approved Drafts → Platform APIs → Status Update
```

**Key Patterns:**
- **Session-based execution**: Every content piece gets `session_${Date.now()}_${id.substring(0,8)}`
- **Notion-centric**: All drafts stored as Notion properties, Drive used for images only
- **Platform selection**: `property_post_to` multi-select controls routing

---

## 2. Critical Files

| File | Purpose | ⚠️ Warning |
|------|---------|------------|
| `PART-1 finalised.json` | Production Part 1 workflow | Backup before ANY edit |
| `Part 2 - X. Linkedin, Blog...json` | Production Part 2 workflow | Backup before ANY edit |
| `Code-Prep Nodes/*.js` | Platform parsers (6 files) | Test after changes |
| `NOTION-CONTENT-CALENDAR-PROPERTIES.md` | Database schema | Keep in sync |
| `OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md` | Full system docs | Reference for AI context |

---

## 3. API Rate Limits & Retry Strategies

| API | Limit | Strategy | Credential Name |
|-----|-------|----------|-----------------|
| **Notion** | 3 req/sec | `retryOnFail: true`, `wait: 2000ms` | `Notion account 2` |
| **Twitter/X** | 450 posts/month, 50/15min | OAuth2 auto-refresh, 5s delay | `X Main account - _AmanSurya BIP` |
| **LinkedIn** | ~100 req/24hrs | 10s recovery wait, **1 image max** | LinkedIn OAuth2 |
| **Hashnode** | 500 req/min (auth) | GraphQL batching | API key |
| **Dev.to** | Check docs | Exponential backoff | API key |
| **Sanity** | 100K req/month | Effectively unlimited | `Sanity API Token` |
| **Gemini** | 1000 req/day | `maxTries: 3`, `wait: 2000ms` | Multiple keys rotated |
| **Perplexity** | 5 req/day (free) | Cache results, use sparingly | `Perplexity Anki` |
| **Google Drive** | Unlimited (1TB quota) | OAuth2 | `Google Drive Adude` |

---

## 4. Code Conventions

### Node Naming
```
[Service] – [Action]
Examples: "Notion – Get Ready Content", "Gemini - AI CONTENT STRATEGIST"
```

### Session IDs
```javascript
const sessionId = `session_${Date.now()}_${notionId.substring(0, 8)}`;
// Example: session_1731234567890_abc12345
```

### File Naming
```
twitter_draft_session_TIMESTAMP_ID.md
linkedin_draft_session_TIMESTAMP_ID.md
asset-1-session_TIMESTAMP_ID.png
```

### Image Markers
```
<<IMAGE_1>> <<IMAGE_2>> <<IMAGE_3>>
⚠️ MUST use DOUBLE angle brackets, not single
```

### Standard Utility Functions
```javascript
// Always use in Code-Prep nodes
function sanitizeText(text) { /* Remove null chars, normalize */ }
function robustJSONParse(rawStr) { /* Handle AI output with fences */ }
function semanticChunking(text, maxChars = 1900) { /* Notion limit */ }
```

---

## 5. Platform-Specific Gotchas

### Notion API
- Image URLs expire in **~15 minutes**—download immediately
- Rich text limited to **95 chunks** (2000 chars each)
- Block fetching: set `fetchNestedBlocks: true` for hierarchical content
- Filter by `Status|select` not `Status` (pipe notation)

### Twitter/X
- **265 char limit** per tweet (not 280—buffer for automation)
- Thread replies need `parentTweetId` from previous tweet
- Media upload uses OAuth 1.1, posting uses OAuth 2.0
- Clean tweet ID: remove quotes, whitespace before using

### LinkedIn
- **Maximum 1 image per post** (API enforced—will fail silently)
- Line breaks: use `\\n\\n` for paragraphs, `\\n\\n\\n` **before numbered lists**
- 2800 char hard limit, target 1200-1800 for engagement
- No markdown—strip all formatting before posting

### Sanity CMS
- Portable Text format required (not raw markdown)
- Images must be uploaded first, then referenced by `_ref`
- Slug must be unique—check `existingSlug` before generating
- Code blocks need `language` property

### Dev.to / Hashnode
- Use `canonical_url` pointing to primary blog (Sanity)
- Tags must exist on platform or post fails
- Hashnode needs `subtitle` property separately

---

## 6. Error Workflow Setup (TODO)

Create workflow: **"Error Handler - Omni-Post AI"**

```
1. Error Trigger node (catches workflow failures)
2. Code node: Extract error context
   - Workflow name, node name, error message
   - Session ID from execution data
3. Telegram/Email notification with context
4. Notion Update: Write error to ErrorLog property
```

Set as Error Workflow in n8n Settings → Workflows.

---

## 7. Never Do Rules

```
❌ NEVER edit workflow JSONs without backup first
❌ NEVER use more than 1 image for LinkedIn
❌ NEVER skip retryOnFail on critical API nodes
❌ NEVER hardcode Notion database IDs in code nodes
❌ NEVER exceed 265 chars per tweet
❌ NEVER trust AI output without robustJSONParse() validation
❌ NEVER skip session ID for concurrent execution safety
❌ NEVER use single angle brackets for image markers
❌ NEVER deploy without testing "Ready to Generate" filter
❌ NEVER assume Notion image URLs persist—download immediately
❌ NEVER post to LinkedIn with markdown formatting
❌ NEVER skip error handling in Code nodes (use try-catch)
```

---

## 8. Testing Checklist

Before deploying workflow changes:

- [ ] Backup current workflow JSON
- [ ] Test with single "Ready to Generate" item
- [ ] Verify session ID generation
- [ ] Check image marker replacement
- [ ] Confirm platform-specific formatting
- [ ] Validate Notion status updates
- [ ] Review error handling paths

---

## 9. Portfolio API Integration

**Endpoint:** `https://www.amansuryavanshi.me/api/portfolio`

**Query Params:** `?sections=about,skills,experience,services,projects`

**Usage in Part 1:** `Context - Fetch Portfolio` node fetches dynamic context for AI content generation.

---

## 10. Key Node References

### Part 1 (Generation)
- `Notion – Get Ready Content`: Entry point, filters by Status
- `Code – Select Content & Profile`: Builds session, user profile
- `Gemini - AI CONTENT STRATEGIST`: Strategy generation
- `Gemini - Twitter/LinkedIn/Blog Content Generation`: Parallel writers

### Part 2 (Distribution)
- `Code - Master Data Extractor`: Parses Notion properties
- `Detect Images Needed vs Present`: Decision engine V5.0
- `Code - Parse & Attach Tweets`: Thread builder
- `Code - Rebuild Blog Blocks with Image References`: Sanity PT builder

---

## 11. Glossary

| Term | Definition |
|------|------------|
| **HITL** | **Human-in-the-Loop**. Steps requiring manual approval (e.g., checking "Ready to Post"). |
| **PT** | **Portable Text**. Sanity's proprietary JSON specific rich text format. |
| **Chunking** | Splitting text into <2000 character segments to strictly comply with Notion's API limits. |
| **Session ID** | Unique string (`session_TIMESTAMP_ID`) tracking one content piece through the entire pipeline. |
| **URN** | LinkedIn's Uniform Resource Name (ID) for assets (e.g., `urn:li:image:123`). |

---

## 12. Known Failure Modes

| Symptom | Probable Cause | Fix |
|---------|----------------|-----|
| **Drafts don't appear in Notion** | Content exceeds **2000 chars** and wasn't chunked. | Ensure `semanticChunking()` is active in *Code-Prep* nodes. |
| **LinkedIn post fails** | Binary image issue OR sending >1 image via basic API. | Use `MultiImage` API flow (Upload -> Get URN -> Post) or limit to 1 image. |
| **Twitter post fails** | Thread tweet > 265 chars. | Force hard slice at 260 chars in *Code-Prep* or retry AI. |
| **Notion error 400** | Invalid property type (e.g., sending Text to Select). | Validate JSON structure against `NOTION-CONTENT-CALENDAR-PROPERTIES.md`. |

---

## 13. Configuration Reference

### Notion "Ready to Generate" Filter
```json
{
  "filter": {
    "property": "Status",
    "select": {
      "equals": "Ready to Generate"
    }
  },
  "sorts": [
    { "timestamp": "created_time", "direction": "ascending" }
  ]
}
```

### Social Media Image Constraints
- **Twitter**: Up to 4 images (PNG/JPG/GIF). < 5MB each.
- **LinkedIn**: 
  - **Single Image**: Simple binary upload.
  - **Multi-Image (Carousel)**: Requires `images` URN array via `com.linkedin.ugc.ShareContent`. **Complex implementation.**
  - **PDF**: Treated as a document.

---

## Version History

| Ver | Date | Changes |
|-----|------|---------|
| 1.0.0 | 2026-01-13 | Initial production release. |

