# LinkedIn Carousel — Part-2 Workflow Implementation Guide

> **Purpose:** Reference notes for enhancing the OmniPost Part-2 n8n workflow to support LinkedIn carousel PDF posts.  
> **Last Updated:** 2026-04-17

---

## Architecture Overview

```
Part-1 (n8n automation)
  └─ Node 5 (LinkedIn Content Generation)
       └─ Outputs:
           ├─ formatted_markdown (text caption for the post)
           ├─ content_format: "text" | "carousel"
           ├─ carousel_data.slide_outlines (structured slide content)
           └─ carousel_data.carousel_generation_prompt (AI image generation prompt)

Manual Step (Aman via Claude Desktop)
  └─ Take carousel_generation_prompt → Claude Desktop Project (with brand kit)
  └─ Generate carousel slide images
  └─ Export as PDF
  └─ Upload to Google Drive (same folder as other images)

Part-2 (n8n posting automation)
  └─ Reads content_format field
  └─ IF "carousel" → post with PDF document attachment from Drive
  └─ IF "text" → post with single image (existing flow)
```

---

## Notion Schema Additions Required

Add the following fields to the **Social Content Queue** database:

| Field | Type | Description | Options |
|-------|------|-------------|---------|
| `LinkedIn_Content_Format` | `select` | Format of the LinkedIn post | `text`, `image`, `carousel` |
| `LinkedIn_Carousel_Prompt` | `rich_text` | The AI-generated prompt to create carousel slides in Claude Desktop | — |
| `LinkedIn_Carousel_PDF_URL` | `url` | Google Drive URL of the generated carousel PDF | — |
| `LinkedIn_Slide_Count` | `number` | Number of slides in the carousel | — |

---

## Part-1 Changes (Already Handled by V4.1 Delta Upgrade)

Node 5 (LinkedIn prompt) now outputs:
```json
{
  "formatted_markdown": "...",
  "structured_data": {
    "posts": [...],
    "content_format": "text | image | carousel",
    "carousel_data": {
      "recommended": true,
      "slide_count": 7,
      "slide_outlines": [
        {
          "slide_number": 1,
          "headline": "Hook statement",
          "body_points": ["point 1", "point 2"],
          "visual_note": "Bold text on dark gradient background"
        }
      ],
      "carousel_generation_prompt": "Create a 7-slide LinkedIn carousel with my brand colors (dark navy #0A1628, accent blue #3B82F6, white text). Slide 1: ..."
    },
    "metadata": {...}
  }
}
```

### What Part-1 n8n Workflow Needs to Store in Notion

After Node 5 runs, the Notion update node should map:

| Notion Field | Source |
|---|---|
| `LinkedIn Draft` | `structured_data.posts[0].content` (the text caption) |
| `LinkedIn_Content_Format` | `structured_data.content_format` |
| `LinkedIn_Carousel_Prompt` | `structured_data.carousel_data.carousel_generation_prompt` |
| `LinkedIn_Slide_Count` | `structured_data.carousel_data.slide_count` |

---

## Part-2 Implementation Notes

### Decision Router
Add a **Switch** node after reading the Notion entry:

```
IF LinkedIn_Content_Format == "carousel"
  → Carousel posting branch (API Document post)
ELSE IF LinkedIn_Content_Format == "image"
  → Standard image posting branch (API Image post)
ELSE
  → Standard text-only posting branch (API Text post)
```

### Carousel Posting Branch

1. **Read Drive Folder:** Use the existing Google Drive connection to find the carousel PDF in the entry's Drive folder
2. **Download PDF:** Download the file as binary data
3. **LinkedIn API Post with Document:**
   - LinkedIn's API supports document posts (PDF uploads) via the `ugcPosts` endpoint
   - The `formatted_markdown` text becomes the post caption
   - The PDF is uploaded as a document attachment
   - Reference: LinkedIn Document Share API

### Manual Workflow (Interim)
Until Part-2 carousel automation is built:
1. Check Notion for entries where `LinkedIn_Content_Format = carousel`
2. Copy the `LinkedIn_Carousel_Prompt` 
3. Paste into Claude Desktop (with your brand project active)
4. Generate slide images, compile into PDF
5. Upload PDF to the entry's Google Drive folder
6. Update `LinkedIn_Carousel_PDF_URL` in Notion
7. Post manually or trigger Part-2

---

## Brand Project Setup (Claude Desktop)

Create a Claude Desktop Project called **"OmniPost LinkedIn Carousels"** with these persistent instructions:

```
You are a LinkedIn carousel designer for Aman Suryavanshi.

Brand tokens:
- Primary: #0A1628 (dark navy background)
- Accent: #3B82F6 (electric blue for highlights)
- Text: #FFFFFF (white) and #94A3B8 (muted gray for secondary)
- Font: Inter or equivalent clean sans-serif
- Logo/Avatar: Include on Slide 1 and Final Slide

Design rules:
- Each slide is 1080x1080px (square format for LinkedIn)
- Slide 1: Hook headline, large bold text, Aman's name + title
- Slides 2-N: One insight per slide, headline + 2-3 bullet points max
- Final Slide: CTA + LinkedIn profile URL + "Follow for more AI automation insights"
- Keep text large enough to read on mobile (min 24px equivalent)
- Use visual hierarchy: headline in white/accent, body in lighter weight
- Include slide numbers (e.g., "3/7") in bottom corner
```

---

## Verification Checklist

Before considering Part-2 carousel support complete:

- [ ] Notion schema has all 4 new fields added
- [ ] Part-1 n8n workflow maps Node 5 carousel fields to Notion correctly
- [ ] Claude Desktop brand project is configured with design tokens
- [ ] Test: Run Part-1 on a source with 4+ technical points, verify `content_format: carousel` is output
- [ ] Test: Take `carousel_generation_prompt`, generate slides in Claude Desktop, verify quality
- [ ] Part-2 IF/Switch node routes carousel entries correctly
- [ ] Part-2 can post PDF documents via LinkedIn API (or manual posting is documented)
