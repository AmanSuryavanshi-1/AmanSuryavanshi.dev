# 📋 Notion Content Calendar Properties Reference

> **Database Name:** Social Content Queue  
> **Purpose:** Central hub for managing content lifecycle across multiple social platforms  
> **Last Updated:** January 12, 2026

---

## 📖 Table of Contents

- [Overview](#overview)
- [Property Categories](#property-categories)
- [All Properties (Detailed)](#all-properties-detailed)
  - [Core Content Properties](#1-core-content-properties)
  - [Publishing Control Properties](#2-publishing-control-properties)
  - [SEO & Metadata Properties](#3-seo--metadata-properties)
  - [Platform-Specific Draft Properties](#4-platform-specific-draft-properties)
  - [Asset Management Properties](#5-asset-management-properties)
  - [Scheduling & Timing Properties](#6-scheduling--timing-properties)
  - [System & Tracking Properties](#7-system--tracking-properties)
- [Quick Reference Table](#quick-reference-table)

---

## Overview

The **Social Content Queue** database is the backbone of the Omni-Post AI automation system. It manages the entire content lifecycle from ideation to multi-platform publishing. This document provides a complete reference of all properties for use in n8n automations.

**Total Properties:** 31

---

## Property Categories

| Category | Count | Purpose |
|----------|-------|---------|
| Core Content | 3 | Title and categorization |
| Publishing Control | 3 | Status tracking and platform selection |
| SEO & Metadata | 6 | Search optimization and canonical URLs |
| Platform-Specific Drafts | 5 | Generated content for each platform |
| Asset Management | 5 | Images and file handling |
| Scheduling & Timing | 4 | Posting times and dates |
| System & Tracking | 5 | Internal IDs and logs |

---

## All Properties (Detailed)

### 1. Core Content Properties

---

#### 📝 Content Pages
| Attribute | Value |
|-----------|-------|
| **Type** | Title |
| **Description** | The primary name/title of the content entry. This is the main identifier for each content piece. |
| **Usage in Automation** | Used to identify the content item being processed. Appears as the row name in the database. |
| **Example Values** | `ATC-01: ₹3 Lakh Organic Revenue Case Study`, `Agentic AI` |

---

#### 📂 Category
| Attribute | Value |
|-----------|-------|
| **Type** | Multi-select |
| **Description** | Categorizes the content by topic/theme. Multiple categories can be assigned to a single entry. |
| **Available Options** | |

| Option | Color | Description |
|--------|-------|-------------|
| `Learnings` | Yellow | Personal learning insights and takeaways |
| `Projects` | Pink | Project-related content and case studies |
| `AI` | Red | Artificial Intelligence related content |
| `Web Development` | Blue | Web dev tutorials and insights |
| `Technical Documentation` | Gray | Technical deep-dives and documentation |
| `n8n` | Purple | N8N automation-specific content |

---

#### ⭐ Priority
| Attribute | Value |
|-----------|-------|
| **Type** | Select |
| **Description** | Indicates the priority level for content creation and publishing. |
| **Available Options** | |

| Option | Color | Description |
|--------|-------|-------------|
| `High` | Red | Urgent content that should be prioritized |
| `Medium` | Yellow | Standard priority content |
| `Low` | Green | Can be scheduled for later |

---

### 2. Publishing Control Properties

---

#### 📤 Post To
| Attribute | Value |
|-----------|-------|
| **Type** | Multi-select |
| **Description** | Specifies which platforms this content should be published to. Acts as the target platform selector. |
| **Available Options** | |

| Option | Color | Description |
|--------|-------|-------------|
| `X` | Black | Twitter/X platform |
| `LinkedIn` | Blue | LinkedIn platform |
| `Blog` | Green | Personal Sanity.io blog |
| `Dev.to` | Purple | Dev.to blogging platform |
| `Hashnode` | Blue | Hashnode blogging platform |

---

#### 🔄 Status
| Attribute | Value |
|-----------|-------|
| **Type** | Select |
| **Description** | The overall workflow status of the content piece. Tracks where the content is in the generation/approval pipeline. |
| **Available Options** | |

| Option | Color | Description |
|--------|-------|-------------|
| `Pending Approval` | Yellow | Content generated, awaiting review |
| `Needs Edit` | Orange | Content requires manual edits |
| `Posted To All Platforms` | Green | Successfully published everywhere |

---

#### ✅ Post Status
| Attribute | Value |
|-----------|-------|
| **Type** | Multi-select |
| **Description** | Granular status tracking for each individual platform posting. Shows which platforms have received the content. |
| **Available Options** | |

| Option | Color | Description |
|--------|-------|-------------|
| `LinkedInPostGenerated` | Blue | Draft created for LinkedIn |
| `Posted at X` | Black | Successfully posted to Twitter/X |
| `Posted at LinkedIn` | Blue | Successfully posted to LinkedIn |
| `Posted at Portfolio Blog` | Green | Successfully posted to Sanity blog |
| `Posted at Dev.to` | Purple | Successfully posted to Dev.to |
| `Posted at Hashnode` | Teal | Successfully posted to Hashnode |

---

### 3. SEO & Metadata Properties

---

#### 🔗 Shared_Slug
| Attribute | Value |
|-----------|-------|
| **Type** | Text |
| **Description** | URL-friendly slug used across all blog platforms. Ensures consistent URLs across Sanity, Dev.to, and Hashnode. |
| **Format** | Lowercase, hyphen-separated (e.g., `nextjs-n8n-automation-revenue-case-study`) |
| **Example Values** | `nextjs-n8n-automation-revenue-case-study` |

---

#### 🏷️ Shared_SEO_Title
| Attribute | Value |
|-----------|-------|
| **Type** | Text |
| **Description** | The SEO-optimized title used in meta tags across all blog platforms. |
| **Example Values** | `₹3 Lakh Organic Revenue Case Study: Next.js & n8n Automation` |

---

#### 📄 Shared_SEO_Description
| Attribute | Value |
|-----------|-------|
| **Type** | Text |
| **Description** | Meta description for SEO purposes. Used in search engine snippets and social sharing previews. |
| **Character Limit** | Recommended 150-160 characters |
| **Example Values** | `How I built a zero-cost lead generation machine using Next.js 14 and n8n that generated ₹3,00,000+ in organic revenue for an aviation institute.` |

---

#### 🌐 Shared_Canonical_URL
| Attribute | Value |
|-----------|-------|
| **Type** | URL / Formula |
| **Description** | The canonical URL pointing to the primary blog version. Used to prevent duplicate content issues across platforms. |
| **Format** | Full URL to the primary blog post |
| **Example Values** | `https://amansuryavanshi.me/blog/nextjs-n8n-automation-revenue-case-study` |

---

#### 🏷️ Shared_Tags
| Attribute | Value |
|-----------|-------|
| **Type** | Multi-select |
| **Description** | Technical tags and topics used across all platforms for categorization and discoverability. Extensive list of technology and topic tags. |
| **Available Options (Extensive List)** | |

| Tag | Category |
|-----|----------|
| `Nextjs` | Framework |
| `n8n` | Automation |
| `Automation` | General |
| `SEO` | Marketing |
| `CaseStudy` | Content Type |
| `Next.js 14 automation` | Framework |
| `n8n lead generation` | Automation |
| `organic revenue case study` | Content Type |
| `zero-cost tech stack` | Architecture |
| `business automation specialist` | Professional |
| `React optimization` | Framework |
| `Core Web Vitals` | Performance |
| `code splitting` | Performance |
| `lazy loading` | Performance |
| `WebP` | Performance |
| `Tailwind CSS optimization` | Performance |
| `React.memo` | Performance |
| `useMemo` | Performance |
| `next/dynamic` | Framework |

---

#### 📂 hasImages / Assets
| Attribute | Value |
|-----------|-------|
| **Type** | Checkbox |
| **Description** | Boolean flag indicating whether this content has associated images or assets. |
| **Values** | `true` (checked) / `false` (unchecked) |
| **Usage in Automation** | Used to conditionally fetch and process images in the workflow. |

---

### 4. Platform-Specific Draft Properties

---

#### 🐦 Twitter Draft
| Attribute | Value |
|-----------|-------|
| **Type** | Text (Long) |
| **Description** | Generated content optimized for Twitter/X. Contains the full thread or tweet content. |
| **Format** | Twitter-optimized text with hashtags, mentions, and thread formatting |
| **Example Content** | `#NextJS #n8n #automation #SEO` (hashtag section) + thread content |

---

#### 💼 LinkedIn Draft
| Attribute | Value |
|-----------|-------|
| **Type** | Text (Long) |
| **Description** | Generated content optimized for LinkedIn's professional audience. Longer-form, professional tone. |
| **Format** | LinkedIn-style post with section headers, bullet points, and professional formatting |
| **Example Structure** | Hook → Problem → Solution → Results → Technical Details → CTA |

---

#### 📝 Sanity Blog Draft
| Attribute | Value |
|-----------|-------|
| **Type** | Text (Rich Text / Long) |
| **Description** | Full blog article content for the Sanity.io-powered personal blog. Contains complete article with all sections. |
| **Format** | Markdown or Portable Text compatible format |
| **Sections Typically Included** | Introduction, Problem Statement, The Workflow Logic, Technical Hurdles, Pro Tips, Conclusion |

---

#### 💻 DevTo Draft
| Attribute | Value |
|-----------|-------|
| **Type** | Text (Long) |
| **Description** | Blog content formatted for Dev.to's markdown-based platform. |
| **Format** | Markdown with Dev.to frontmatter compatibility |
| **Special Features** | Mermaid diagram support, code syntax highlighting |

---

#### 🟦 Hashnode Draft
| Attribute | Value |
|-----------|-------|
| **Type** | Text (Long) |
| **Description** | Blog content formatted for Hashnode's publishing platform. |
| **Format** | Markdown with Hashnode-specific formatting |
| **Special Features** | Mermaid diagrams, implementation deep-dives |

---

#### 📰 Hashnode_Subtitle
| Attribute | Value |
|-----------|-------|
| **Type** | Text |
| **Description** | Subtitle/deck text specifically for Hashnode articles. Appears below the main title. |
| **Example Values** | `## Implementation Deep Dive: The Non-Blocking Webhook Strategy` |

---

### 5. Asset Management Properties

---

#### 🖼️ imagesURL
| Attribute | Value |
|-----------|-------|
| **Type** | Text / URL |
| **Description** | URL(s) to the images associated with this content. Can contain multiple comma-separated URLs. |
| **Format** | Single URL or comma-separated list of URLs |

---

#### 📎 images
| Attribute | Value |
|-----------|-------|
| **Type** | Files & Media |
| **Description** | Direct file attachments for images associated with the content. |
| **Supported Formats** | PNG, JPG, WebP, GIF |

---

#### 📋 Image Task List
| Attribute | Value |
|-----------|-------|
| **Type** | Text |
| **Description** | List of image-related tasks or descriptions for image generation. |
| **Usage** | Planning image assets needed for the content |

---

#### 📁 Drive Folder Link
| Attribute | Value |
|-----------|-------|
| **Type** | URL |
| **Description** | Direct link to the Google Drive folder containing all assets for this content piece. Session-based organization. |
| **Format** | Google Drive folder URL |

---

#### 📝 Notes
| Attribute | Value |
|-----------|-------|
| **Type** | Text (Long) |
| **Description** | General notes, reminders, or additional context for the content piece. |
| **Usage** | Manual notes, special instructions, or context for future reference |

---

### 6. Scheduling & Timing Properties

---

#### ⏰ Processing Started
| Attribute | Value |
|-----------|-------|
| **Type** | Date & Time |
| **Description** | Timestamp when the automation workflow started processing this content item. |
| **Format** | `Month DD, YYYY HH:MM AM/PM` |
| **Example Values** | `January 12, 2026 7:21 AM`, `October 23, 2025 7:30 AM` |

---

#### 📅 PostedAt
| Attribute | Value |
|-----------|-------|
| **Type** | Date & Time |
| **Description** | Timestamp when the content was actually published to the platforms. |
| **Format** | Date and time |

---

#### 💼 LinkedIn Best Time To Post
| Attribute | Value |
|-----------|-------|
| **Type** | Text |
| **Description** | Recommended optimal posting time for LinkedIn based on audience engagement data. |
| **Format** | Time recommendation or schedule |

---

#### 🐦 Twitter Best Time to post
| Attribute | Value |
|-----------|-------|
| **Type** | Text |
| **Description** | Recommended optimal posting time for Twitter/X based on audience engagement data. |
| **Format** | Time recommendation or schedule |

---

### 7. System & Tracking Properties

---

#### 🔢 ManualOrder
| Attribute | Value |
|-----------|-------|
| **Type** | Number |
| **Description** | Manual ordering/sorting value for arranging content in a specific sequence. |
| **Usage** | Override automatic sorting when needed |

---

#### 🆔 SessionID
| Attribute | Value |
|-----------|-------|
| **Type** | Text |
| **Description** | Unique session identifier generated during workflow execution. Used for session-based file organization and preventing cross-contamination in concurrent runs. |
| **Format** | UUID or timestamp-based identifier |

---

#### 📊 Engagement Score
| Attribute | Value |
|-----------|-------|
| **Type** | Number |
| **Description** | Metric tracking the engagement level of posted content. Can be manually updated or calculated. |
| **Usage** | Track content performance post-publishing |

---

#### ⚠️ ErrorLog
| Attribute | Value |
|-----------|-------|
| **Type** | Text (Long) |
| **Description** | Error messages and logs captured during automation execution. Used for debugging failed workflows. |
| **Usage** | Debugging, error tracking, workflow monitoring |

---

## Quick Reference Table

| Property Name | Type | Required | Used in Part 1 | Used in Part 2 |
|---------------|------|----------|----------------|----------------|
| Content Pages | Title | ✅ Yes | ✅ | ✅ |
| Post To | Multi-select | ✅ Yes | ✅ | ✅ |
| Status | Select | ✅ Yes | ✅ | ✅ |
| Post Status | Multi-select | ❌ No | ✅ | ✅ |
| Category | Multi-select | ❌ No | ✅ | ❌ |
| Priority | Select | ❌ No | ✅ | ❌ |
| Processing Started | Date & Time | ❌ No | ✅ | ❌ |
| Shared_Slug | Text | ✅ Yes | ✅ | ✅ |
| Shared_SEO_Title | Text | ✅ Yes | ✅ | ✅ |
| Shared_SEO_Description | Text | ✅ Yes | ✅ | ✅ |
| Shared_Canonical_URL | URL | ✅ Yes | ✅ | ✅ |
| Shared_Tags | Multi-select | ❌ No | ✅ | ✅ |
| hasImages / Assets | Checkbox | ❌ No | ✅ | ✅ |
| imagesURL | Text | ❌ No | ✅ | ✅ |
| images | Files | ❌ No | ❌ | ✅ |
| Image Task List | Text | ❌ No | ✅ | ❌ |
| Notes | Text | ❌ No | ❌ | ❌ |
| ErrorLog | Text | ❌ No | ✅ | ✅ |
| Drive Folder Link | URL | ❌ No | ✅ | ✅ |
| PostedAt | Date & Time | ❌ No | ❌ | ✅ |
| Engagement Score | Number | ❌ No | ❌ | ❌ |
| Twitter Draft | Text | ✅ Yes | ✅ | ✅ |
| LinkedIn Draft | Text | ✅ Yes | ✅ | ✅ |
| Sanity Blog Draft | Text | ✅ Yes | ✅ | ✅ |
| DevTo Draft | Text | ✅ Yes | ✅ | ✅ |
| Hashnode Draft | Text | ✅ Yes | ✅ | ✅ |
| Hashnode_Subtitle | Text | ❌ No | ✅ | ✅ |
| SessionID | Text | ✅ Yes | ✅ | ✅ |
| ManualOrder | Number | ❌ No | ❌ | ❌ |
| LinkedIn Best Time To Post | Text | ❌ No | ❌ | ✅ |
| Twitter Best Time to post | Text | ❌ No | ❌ | ✅ |

---

## 🔧 Usage Notes for Automations

### Fetching Content from Notion
When building n8n workflows that interact with this database:

1. **Filter by Status**: Use `Status = Pending Approval` to get items ready for publishing
2. **Filter by Post To**: Check `Post To` contains the target platform
3. **Check hasImages**: Conditionally process images only when `hasImages / Assets` is true
4. **Update Post Status**: Add platform-specific status after successful posting

### Updating Properties via API
```javascript
// Example: Update Status after posting
{
  "Status": { "select": { "name": "Posted To All Platforms" } },
  "Post Status": { 
    "multi_select": [
      { "name": "Posted at X" },
      { "name": "Posted at LinkedIn" },
      { "name": "Posted at Portfolio Blog" }
    ]
  },
  "PostedAt": { "date": { "start": "2026-01-12T08:00:00.000+05:30" } }
}
```

### Session Management
- Always generate a unique `SessionID` at the start of each workflow run
- Use `SessionID` to organize Google Drive folders and track related files
- Reference `SessionID` when logging errors to `ErrorLog`

---

> **Document Version:** 1.0  
> **Created:** January 12, 2026  
> **Maintained by:** Omni-Post AI Automation System  
> **Related Docs:** [README.md](./README.md) | [Technical Documentation](./OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md)
