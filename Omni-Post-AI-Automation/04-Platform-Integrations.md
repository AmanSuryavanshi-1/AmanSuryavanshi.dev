# 04. Platform Integrations

This document explains the specific parsers and logic required to correctly format unified markdown drafts for each unique social and blogging platform. Unified markdown doesn't work out-of-the-box due to API constraints.

## Decision Engine V5.0 (Image Management)

**The Challenge:** Part 2 needs to know which images go to which platform—but the AI might have embedded markers like `<<IMAGE_1>>` in the drafts, or images might exist in the folder without explicit references.

**The Solution:** Three-tier hierarchical decision system in `Code – Detect Images Needed vs Available`:

```text
Tier 1 (Highest Priority): Trust AI Markers
├─ Scan each draft for <<IMAGE_N>> patterns
├─ Extract exact numbers and positions
└─ Build platform-specific image assignments

Tier 2 (Fallback): Manifest Analysis
├─ Parse Image Tasklist for expected assets
├─ Match against available files in Drive folder
├─ Apply defaults: primary→social, all→blog
└─ If no manifest, assume all images are for all platforms (legacy support)

Tier 3 (Safety): No Images
├─ No markers + no manifest = text-only post
└─ System gracefully removes unused <<IMAGE_N>> placeholders
```

**Result:** Handles 0-10 images per content piece automatically. Never fails on missing images—gracefully degrades to text-only.

## Platform Character Limits & Content Rights

When the AI writers generate drafts, they must adhere strictly to these platform-specific constraints. Failing to do so breaks the API parsers downstream:

- **Notion (System of Record)**: 2000 character limit per rich text block. *See [Developer Journal - Insight D](05-Developer-Journal.md) for how we solve this via semantic chunking.*
- **Twitter / X**: 280 characters hard limit per tweet (we enforce a 265-character soft limit buffer). Requires strict parent-child threading.
- **LinkedIn**: 2800 character hard limit (target 1200-1800 for optimal engagement). Requires stripping ALL markdown formatting.
- **Threads**: ~500 characters per post. Carousel image publication requires a 30-second wait after container creation.
- **Dev.to / Hashnode**: Unlimited length. Requires canonical URLs back to the Blog to avoid SEO cannibalization.

## Platform-Specific Constraints and Parsers

### LinkedIn Parser V7.0

**Evolution: S-Tier HTTP Pipeline**
Previously restricted to a 1-image limit via the default n8n node, the workflow now utilizes an advanced HTTP pipeline (`initializeUpload` → Binary Upload → `posts` endpoint) to support multiple images and PDF carousels.

```javascript
// Node: "Code – Parse & Attach LinkedIn Post V7"
const markersInThisBlock = Array.from(
  block.matchAll(/<<IMAGE_(\d+)>>/g), 
  m => parseInt(m[1])
);

let imageNumbersToAttach = [];

if (markersInThisBlock.length > 0) {
  // LinkedIn S-Tier HTTP Pipeline: Multi-image / Carousel support
  imageNumbersToAttach = markersInThisBlock; // Take all mapped images
}

// Strip ALL markdown (LinkedIn does not support markdown API rendering)
const cleanText = block.replace(/<<IMAGE_\d+>>/g, '').trim();
```
*Note:* Line breaks require `\n\n` for paragraphs and `\n\n\n` before numbered lists. Target 1200-1800 characters for engagement limit.

### Twitter / X Parser

**Critical Limitation: 280 Characters (265 Soft Limit), Thread Structure.**

```javascript
// Node: "Code – Parse & Attach Tweets"
const tweetBlocks = markdownText.match(
  /\d+\/\d+[\s\S]*?(?=\n\n---\n\nTweet \d+\/\d+|\n\n---\n\n$|$)/g
);

const tweets = tweetBlocks.map((block, index) => {
  // Finds image markers
  // Cleans the text block
  return {
    json: {
      order: index + 1,
      text: cleanText,
      inReplyTo: index > 0, // Informs n8n to thread to the parentTweetId
      imageBinary: imageBinary
    }
  };
});
```
*Note:* Strip quotes and whitespace from the returned tweet ID before using it as a reply target in subsequent tweets.

### Sanity CMS (Blog) Parser V12.0

**Requirement: Portable Text Format.**

Markdown must be converted to Portable Text before publishing.
```javascript
// Node: "Code – Parse Blog Content"
const finalBlocks = [];
blocks.forEach(block => {
  if (block.type === 'text') {
    finalBlocks.push({
      _type: 'block',
      style: 'normal',
      children: parseInlineFormatting(block.content)
    });
  } else if (block.type === 'image') {
    // Images must be uploaded first and referenced by ID
    finalBlocks.push({
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId }
    });
  }
});
```
*Note:* Slugs must be unique. Code blocks require a `language` property. If cross-posting, ALWAYS set the `canonical_url` pointing back to the Sanity blog.

### Threads Lane Publisher

**Critical Limitation: 30-Second Media Wait Time.**

Threads publishing uses a specific multi-step carousel container pattern. Media must process fully before publishing.
- **Contract:** Uses `THREADS_USER_ID` from n8n ENV variables (NEVER hardcoded).
- **Wait Node:** Requires an explicit 30s Wait node (`Wait 30000ms`) after container creation. Failure to wait results in immediate failure to publish.
- **Lane Architecture:** Modeled identically to Twitter/LinkedIn (IF → Prep Code → HTTP), ensuring it runs concurrently as a first-class citizen.
