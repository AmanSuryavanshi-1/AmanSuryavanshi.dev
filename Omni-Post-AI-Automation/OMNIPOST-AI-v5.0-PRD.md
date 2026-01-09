# OMNI-POST AI v5.0 - PRODUCT REQUIREMENTS DOCUMENT

**Status**: Ready for Implementation  
**Author**: Aman Suryavanshi  
**Date**: January 9, 2026  
**Target Completion**: 8 weeks  
**Build Approach**: n8n-mcp with AI agent implementation

---

## 🎯 EXECUTIVE SUMMARY

Refactor OMNI-POST-AI Part 1 (Content Generation) from monolithic workflow into modular manager + employee architecture using webhooks. Add Portfolio API integration, autonomous image generation via Longcat AI, and expand to dev.to/Medium platforms. Maintain 99.7% reliability while improving maintainability and enabling non-technical users to understand the workflow.

---

## 📊 CURRENT STATE vs TARGET STATE

### ALREADY IMPLEMENTED ✅
```
v4.2 Working Features:
✅ Notion → Content extraction (hierarchical parsing)
✅ Gemini 2.5 Flash AI content generation
✅ Platform-specific formatting (X, LinkedIn, Blog/Hashnode)
✅ Google Drive storage for drafts
✅ Human review gate (Notion status update)
✅ Part 2: Multi-platform posting (concurrent)
✅ Error handling + retry logic
✅ 99.7% success rate on 1000+ executions
✅ $0/month operational cost
✅ 88 seconds average execution time
✅ 85% engagement rate
```

### TO IMPLEMENT 🆕
```
v5.0 New Features:
🆕 Webhook-based Manager orchestrator (entry point)
🆕 Modular Employee workflows (5 separate, callable)
🆕 Portfolio API integration (dynamic author data)
🆕 Longcat AI image generation (autonomous)
🆕 Image prompt generation workflow (Employee 3)
🆕 dev.to platform support
🆕 Enhanced LinkedIn algorithm optimization
🆕 Enhanced Twitter thread expansion (8-12 tweets)
🆕 Professional breakdown architecture (easy to understand)
```

---

## 🏗️ ARCHITECTURE: MANAGER + EMPLOYEES MODEL

### Manager Workflow (Webhook Entry Point)
**Responsibility**: Orchestrate all employees, manage session state  
**Trigger**: POST to `/omnipost/generate`  
**Input**:
```json
{
  "content_id": "notion_page_id",
  "platforms": ["x", "linkedin", "blog", "dev_to"],
  "notion_db_id": "your_notion_db_id"
}
```

**Operations**:
1. Validate input (content_id, platforms exist)
2. Fetch Portfolio API once (author_profile)
3. Create session_id for tracking
4. Set shared variables (author_profile, platforms, content_id)
5. Invoke Employee 1 (Content Extractor)
6. Loop: Invoke Employee 2 (AI Generator) for each platform
7. Invoke Employee 3 (Image Prompt Generator)
8. Invoke Employee 4 (Image Generator)
9. Invoke Employee 5 (Draft Stager)
10. Aggregate results → Return JSON response (200 OK)

**Output**:
```json
{
  "session_id": "uuid",
  "status": "success",
  "content_generated": { "x": {...}, "linkedin": {...}, "blog": {...}, "dev_to": {...} },
  "images_generated": { "x": "url", "linkedin": "url", "blog": "url", "dev_to": "url" },
  "draft_url": "google_drive_link",
  "notion_updated": true,
  "execution_time": "87 seconds"
}
```

---

## 👔 EMPLOYEE WORKFLOWS (5 MODULAR FLOWS)

### EMPLOYEE 1: Content Extractor
**Triggered by**: Manager  
**Input**: `{ content_id, notion_db_id }`  
**Output**: `{ content_structure, word_count, headers, bullets, code_blocks }`

**Implementation Steps**:
1. Query Notion database using content_id (use Notion integration)
2. Parse returned page content (hierarchical - up to 4 levels)
3. Extract structure:
   - Headers (H1, H2, H3 if exist)
   - Bullet points/lists
   - Code blocks (language-specific)
   - Paragraphs (chunk by 500 words)
4. Calculate total word count
5. Return structured object
6. Error handling: Retry Notion query 3x on failure, then throw error
7. **DO NOT MODIFY**: Current extraction logic if working - only refactor into employee

**Constraints**:
- Max execution time: 10 seconds
- Notion rate limit: Generous (no issues)
- Must preserve original formatting tags (```language for code blocks)

---

### EMPLOYEE 2: AI Content Generator
**Triggered by**: Manager (once per platform: X, LinkedIn, Blog, dev.to)  
**Input**: `{ content_structure, platform, author_profile }`  
**Output**: `{ platform_content, platform_type }`

**Platform-Specific Requirements**:

#### X/Twitter Content
```
Requirements:
- 8-12 tweets (INCREASED from 5-7 for more engagement)
- Each tweet 0-280 characters
- Thread format with threading continuation
- Each tweet: Hook → Value → CTA/Curiosity
- Must NOT use generic motivation content
- Include 1-2 data points if applicable
- Ending tweet MUST ask discussion question
- Use platform-specific emojis
```

**Prompt Template Structure** (XML format - DO NOT CHANGE):
```xml
<system>
You are a technical content expert writing for software engineers on X/Twitter.
</system>
<user_profile>
Name: {author_profile.name}
Title: {author_profile.title}
Expertise: {author_profile.expertise.join(', ')}
Voice: {author_profile.voice}
Social: @{author_profile.twitter}
</user_profile>
<instruction>
Generate a Twitter thread of 8-12 tweets (INCREASE from 5-7).
Each tweet must be concise (0-280 chars).
Start with surprising insight or contrarian take.
Include technical depth but accessible language.
End with specific discussion question (not generic).
Format: Tweet 1/8\nContent\n---\nTweet 2/8\nContent
</instruction>
<content_structure>
{content_structure}
</content_structure>
```

#### LinkedIn Content
```
Requirements:
- 180-250 words (optimal for algorithm)
- Professional tone (B2B, thought leadership)
- Start: Surprising insight (NOT "Let me share..." or "I learned that...")
- Middle: Specific data/insight/methodology (2-3 paragraphs)
- End: Discussion question (specific, not generic)
- AVOID: Motivational clichés, generic CTAs, hashtag spam
- Include: 1 specific insight from content
- Format: Plain text with paragraph breaks (markdown if needed)
```

**Prompt Template Structure** (XML format - DO NOT CHANGE):
```xml
<system>
You are a thought leader writing professional insights for LinkedIn decision-makers.
</system>
<user_profile>
Name: {author_profile.name}
Title: {author_profile.title}
Expertise: {author_profile.expertise.join(', ')}
Voice: {author_profile.voice}
Social: linkedin.com/in/{author_profile.linkedin}
</user_profile>
<instruction>
Generate a LinkedIn post (180-250 words exactly).
Algorithm optimization rules:
- Start with surprising or contrarian insight (first 20 words critical)
- Avoid generic openings (remove: "Let me share", "I recently learned")
- Include specific data point, metric, or methodology
- End with targeted discussion question that invites comments
- Write in conversational but professional tone
- NO hashtags, NO emoji spam, NO CTAs like "DM for details"
LinkedIn favors: discussion questions > external links > hashtags
</instruction>
<content_structure>
{content_structure}
</content_structure>
```

#### Blog/Hashnode Content
```
Requirements:
- 800-1200 words (long-form, SEO-friendly)
- Markdown format with H2/H3 headers
- Include: Introduction, 3-4 sections, conclusion
- Code blocks preserved from original (with language tags)
- Metadata: Title (SEO), description (160 chars)
- Include author bio at end linking to social profiles
- Format: Markdown (proper heading hierarchy)
```

**Prompt Template Structure** (XML format - DO NOT CHANGE):
```xml
<system>
You are a technical writer creating SEO-optimized blog content for developers.
</system>
<user_profile>
Name: {author_profile.name}
Title: {author_profile.title}
Bio: {author_profile.bio}
Website: {author_profile.website}
</user_profile>
<instruction>
Generate blog post (800-1200 words) in Markdown.
Structure:
- H1: Title (SEO keyword)
- Introduction (100 words)
- H2: Section 1, H2: Section 2, H2: Section 3
- Conclusion (50-100 words)
- Code blocks: Preserve original with ```language tags
- Author bio at end (2-3 lines with links)
Metadata format:
---
title: "SEO Title Here"
description: "160 chars max for meta description"
---
</instruction>
<content_structure>
{content_structure}
</content_structure>
```

#### dev.to Content
```
Requirements:
- 600-1000 words (dev.to favors practical tutorials/stories)
- Markdown format
- Front matter: title, description, tags (max 4)
- Include: Intro hook, practical steps/insights, conclusion
- Code blocks preserved (```language)
- Engagement: Include question or "what's your approach?"
- Format: Markdown with dev.to front matter
```

**Prompt Template Structure** (XML format - DO NOT CHANGE):
```xml
<system>
You are a developer writing practical, engagement-focused content for dev.to community.
</system>
<user_profile>
Name: {author_profile.name}
Title: {author_profile.title}
Github: {author_profile.github}
</user_profile>
<instruction>
Generate dev.to post (600-1000 words) in Markdown.
Include front matter:
---
title: "Engaging Title Here"
description: "Short description"
tags: tech, automation, ai, workflow
---
dev.to algorithm: Favors practical tutorials, personal stories, community engagement
- Start with relatable hook or question
- Provide actionable insights/steps
- Include code examples with ```language tags
- End with: "What's your approach to [topic]?" or "Have you tried...?"
- Avoid: Generic motivational content, link spam
</instruction>
<content_structure>
{content_structure}
</content_structure>
```

**Implementation Steps**:
1. Receive platform type from Manager
2. Select correct prompt template (XML above)
3. Inject author_profile data into template
4. Call Gemini 2.5 Flash API:
   - Temperature: 0.7
   - Max tokens: 2000 (adjust by platform)
   - Stop sequences: ["---\n\n", "END OF"]
5. Parse response (strip markdown fence if present)
6. Validate constraints:
   - X: Between 8-12 tweets, each ≤280 chars
   - LinkedIn: 180-250 words exactly
   - Blog: 800-1200 words
   - dev.to: 600-1000 words
7. If validation fails: Retry generation 1x, if still fails → return error
8. Return `{ platform_content, platform_type }`
9. **CRITICAL**: DO NOT change prompt structure - only update instructions within existing XML tags

**Constraints**:
- Max execution time: 30 seconds per platform
- Must use Gemini 2.5 Flash (free tier)
- Temperature must stay 0.7 (consistent quality)
- Keep author_profile injection pattern EXACTLY as template shows

---

### EMPLOYEE 3: Image Prompt Generator
**Triggered by**: Manager (once total, but receives all platform content)  
**Input**: `{ platform_content (all), author_profile }`  
**Output**: `{ image_prompt, color_scheme }`

**Responsibility**: Generate ONE visual/image prompt usable for all platforms (we'll generate one hero image)

**Implementation Steps**:
1. Extract 3-5 key concepts/keywords from content
2. Determine topic category (AI, web dev, automation, design, etc.)
3. Map color scheme by topic:
   ```javascript
   const colorScheme = {
     "AI": "blues and purples with neon accents",
     "Web Dev": "modern gradients, tech blues",
     "Automation": "greens and grays with tech elements",
     "Design": "vibrant pastels or high contrast",
     "Career": "professional blues and warm tones"
   };
   ```
4. Generate visual brief combining:
   - Main subject (based on topic)
   - Style (modern, minimal, technical, artistic)
   - Color palette
   - Composition (landscape - 1024x512)
   - Mood/tone
5. Create Flux-optimized prompt with:
   - Technical quality descriptors
   - Style tags (e.g., "professional illustration", "high-detail render")
   - Color specifications
   - Aspect ratio hint
6. Return structured object

**Prompt Template** (DO NOT CHANGE - only fill variables):
```
Create a {style} illustration of {main_subject}.
Style: {style_tags}, professional, modern, high-detail
Colors: {color_palette} with professional accents
Mood: {mood}
Quality: cinematic lighting, detailed, polished
Format: landscape illustration (1024x512)
Technical focus: {technical_focus}
Avoid: people, logos, text overlays, watermarks
```

**Example Output**:
```json
{
  "image_prompt": "Create a technical illustration of an AI automation workflow. Style: modern minimalist technical illustration with professional depth. Colors: blues and purples with neon cyan accents. Mood: sophisticated, professional, innovative. Quality: cinematic lighting, detailed nodes and connections. Format: landscape (1024x512). Technical focus: data flow visualization. Avoid: people, logos, text overlays, watermarks.",
  "color_scheme": "blues and purples"
}
```

**Constraints**:
- Max execution time: 5 seconds
- Prompt must be under 200 words
- Must NOT include people or logos
- Output format MUST be JSON with image_prompt and color_scheme keys

---

### EMPLOYEE 4: Image Generator (AUTONOMOUS)
**Triggered by**: Manager  
**Input**: `{ image_prompt, platform }`  
**Output**: `{ image_url, platform }`

**Responsibility**: Generate image using Longcat AI (free API) with fallback strategy

**Implementation Steps**:
1. Call Longcat AI API:
   ```
   API: https://api.longcat.ai/generate
   Method: POST
   Body: {
     "prompt": {image_prompt},
     "model": "flux-pro",
     "format": "png",
     "size": "1024x512"
   }
   Headers: Authorization: Bearer {LONGCAT_API_KEY}
   Timeout: 15 seconds
   ```
2. On success: Get image URL from response
3. On timeout/failure (after 15 sec):
   - Generate fallback image (solid color + centered text)
   - Use color_scheme from Employee 3
   - Add text: "Visual Coming Soon" (professional)
   - Return fallback image URL
4. Upload generated image to Google Drive:
   - Folder: `/OMNI-POST-AI/Generated-Images/{session_id}/`
   - File name: `{platform}_asset.png`
   - Share link: Get public sharing link
5. Return image URL (either generated or fallback)

**Fallback Image Generation** (if Longcat fails):
```
Solid color background: {color_scheme}
Text overlay: "{platform.upper()} | Visual Generating"
Font: Professional sans-serif
Size: 1024x512
Effect: Subtle gradient overlay
```

**Constraints**:
- Max execution time: 20 seconds (15 sec API + 5 sec upload)
- Longcat free tier: 3 months unlimited, then ~$5-10/month
- Must have fallback for reliability
- Image MUST be uploaded to Google Drive for persistence
- Must return public-accessible URL

**Error Handling**:
- Longcat timeout → Use fallback (CONTINUE, don't fail)
- Google Drive upload fails → Return direct image URL (CONTINUE)
- Color scheme invalid → Use default blue (CONTINUE)

---

### EMPLOYEE 5: Draft Stager
**Triggered by**: Manager (final step)  
**Input**: `{ all_platform_content, all_images, author_profile, session_id }`  
**Output**: `{ draft_url, notion_updated, status }`

**Responsibility**: Package everything, save drafts, update Notion status

**Implementation Steps**:
1. Create preview markdown document:
   ```markdown
   # Content Draft - {session_id}
   Generated: {timestamp}
   
   ## Platform: X/Twitter
   [Tweet content here]
   ![Image]({twitter_image_url})
   
   ## Platform: LinkedIn
   [LinkedIn content here]
   ![Image]({linkedin_image_url})
   
   ## Platform: Blog/Hashnode
   [Blog content here]
   ![Image]({blog_image_url})
   
   ## Platform: dev.to
   [dev.to content here]
   ![Image]({devto_image_url})
   
   ---
   Author: {author_profile.name}
   Session: {session_id}
   Status: Ready for Review
   ```

2. Save to Google Drive:
   - Folder: `/OMNI-POST-AI/Drafts/{date}/`
   - File: `draft_{session_id}.md`
   - Get shareable link

3. Update Notion record (content_id):
   - Set status: "Pending Approval"
   - Add fields:
     - draft_preview_url: {google_drive_link}
     - session_id: {session_id}
     - images: {json array of image URLs}
     - generated_at: {timestamp}
     - x_content: {tweets}
     - linkedin_content: {post}
     - blog_content: {article}
     - devto_content: {post}

4. Return success status:
   ```json
   {
     "draft_url": "https://drive.google.com/...",
     "notion_updated": true,
     "status": "success",
     "message": "Draft ready for review in Notion"
   }
   ```

5. Error handling:
   - Google Drive save fails → Retry 3x, then store in Notion as text
   - Notion update fails → Retry 3x, continue anyway (alert user)
   - Missing content → Use placeholder, mark in draft

**Constraints**:
- Max execution time: 15 seconds
- Google Drive rate limit: Generous (no issues)
- Notion rate limit: Generous (no issues)
- Must NOT post to social (that's Part 2 - different workflow)

---

## 🔌 WEBHOOK INTEGRATION

**Manager Webhook Entry Point**:
```
POST /omnipost/generate
Content-Type: application/json

{
  "content_id": "abc123def456",
  "platforms": ["x", "linkedin", "blog", "dev_to"],
  "notion_db_id": "your_db_id"
}

Response (200 OK):
{
  "session_id": "uuid-here",
  "status": "success",
  "content_generated": {...},
  "images_generated": {...},
  "draft_url": "https://...",
  "execution_time": "87 seconds"
}
```

**Worker Invocations** (within n8n):
- Manager → Employee 1: Execute workflow "omnipost-employee-1-extractor"
- Manager → Employee 2: Execute workflow "omnipost-employee-2-generator-{platform}" (4 times)
- Manager → Employee 3: Execute workflow "omnipost-employee-3-image-prompt"
- Manager → Employee 4: Execute workflow "omnipost-employee-4-image-generator"
- Manager → Employee 5: Execute workflow "omnipost-employee-5-draft-stager"

**Data Passing Between Workflows**:
Use n8n's "Execute Workflow" node with mapped inputs:
```json
{
  "input": {
    "content_id": "{{ $node['Manager'].data.input.content_id }}",
    "notion_db_id": "{{ $node['Manager'].data.input.notion_db_id }}",
    "session_id": "{{ $node['Manager'].data.session_id }}",
    "author_profile": "{{ $node['Manager'].data.author_profile }}"
  }
}
```

---

## 🔌 PORTFOLIO API INTEGRATION

**Purpose**: Fetch dynamic author profile (REMOVE hardcoded data)

**API Endpoint**:
```
GET https://your-portfolio-api.com/profile
Response:
{
  "name": "Aman Suryavanshi",
  "title": "AI Automation Specialist",
  "expertise": ["AI Automation", "n8n", "No-code/Low-code"],
  "voice": "technical, casual, direct",
  "bio": "Building automation workflows...",
  "website": "https://amansuryavanshi.com",
  "social": {
    "twitter": "aman_codes",
    "linkedin": "amansuryavanshi",
    "github": "AmanSuryavanshi-1",
    "email": "aman@portfolio.com"
  }
}
```

**Implementation**:
- Call in Manager (once per execution)
- Cache for 12 hours (if API fails)
- Pass to all employees automatically
- Use in content generation (Employee 2) for authentic voice
- Use in image generation (Employee 3) for bio/links
- Use in draft staging (Employee 5) for attribution

**Constraints**:
- Must succeed on first try (retry 2x if fails)
- Timeout: 5 seconds
- Required fields: name, title, expertise, voice, social
- Optional fields: bio, website, email

---

## 🖼️ PLATFORM EXPANSION: dev.to ADDITION

**Why Add dev.to**:
- High SEO value (600K+ developers monthly)
- Organic reach potential similar to Hashnode
- Cross-promote technical content (portfolio builder)
- Existing blog audience may read dev.to

**Implementation**:
1. Employee 2 generates dev.to specific content (600-1000 words, see above)
2. Employee 4 generates image asset for dev.to
3. Employee 5 stages dev.to content for review
4. Part 2 workflow: Add dev.to posting logic
   - Endpoint: dev.to API
   - Method: Create article via API
   - Include: Front matter, images, canonical URL
   - Delay: 2-3 hours after blog (avoid duplicate content penalty)

**dev.to API Integration** (Part 2 - Future):
```
POST https://dev.to/api/articles
Headers: api-key: {DEV_TO_API_KEY}
Body: {
  "article": {
    "title": "...",
    "body_markdown": "...",
    "description": "...",
    "tags": ["tag1", "tag2"],
    "series": null,
    "published": true,
    "main_image": "{image_url}"
  }
}
```

**Canonical URL**: Link back to your blog/portfolio (for SEO)

---

## 📈 ENHANCEMENT #2: LINKEDIN ALGORITHM OPTIMIZATION

**Current Issue**: Generic content underperforms on LinkedIn

**Enhancements to Implement**:

1. **Opening Hook** (first 20 words critical):
   - Remove: "Let me share...", "I learned...", "Recently..."
   - Use: Question, contrarian take, surprising statistic
   - Example: "You're probably automating this wrong. Here's why..."

2. **Discussion Question** (end of post):
   - Remove: "DM for details", "Check comments"
   - Use: Specific question inviting debate
   - Example: "What's your biggest bottleneck with n8n?"

3. **Content Structure**:
   - Line breaks between ideas (easier on mobile)
   - 180-250 words (algorithm sweet spot)
   - 1-2 specific data points
   - Professional tone (no emojis or hashtags)

4. **Image Strategy**:
   - Single image only (LinkedIn limit)
   - Professional visual (not generic stock photo)
   - Relevant to topic
   - Text-free (algorithm favors this)

**Prompt Modification** (see Employee 2 LinkedIn section above):
- Already includes these optimizations
- DO NOT REMOVE the algorithm optimization instructions
- Can enhance if you test and validate improvements

---

## 📈 ENHANCEMENT #3: TWITTER THREAD EXPANSION

**Current Issue**: 5-7 tweets underperform vs 8-12

**Change**:
- Old: 5-7 tweets per thread
- New: 8-12 tweets per thread
- Why: More engagement surface, better reach, higher likelihood of retweets

**Implementation** (see Employee 2 X section above):
- Already set to 8-12
- Keep this change
- Validate with 3 test runs vs 5-7 version

---

## ❌ DO NOT CHANGE (BREAKING CHANGES RISK)

```
❌ DO NOT modify:
  - Employee prompt XML structure (only values inside tags)
  - Notion database field names (use exact names)
  - Notion status field values (use "Pending Approval", "Ready", "Published")
  - Content extraction logic (if working - refactor only)
  - Part 2 workflow (it's separate, don't touch yet)
  - Google Drive folder structure (breaks file matching)
  - API authentication patterns
  - Error handling logic (keep 3x retry pattern)
  - Timeout values (critical for reliability)

❌ DO NOT add:
  - Browser storage (n8n sandbox blocks this)
  - External API calls not listed here
  - Complex database joins (stick to simple queries)
  - Hardcoded user data (use Portfolio API instead)

⚠️ CHANGE ONLY IF TESTED:
  - Temperature value (0.7 is optimal - test if changing)
  - Token limits (may impact quality)
  - Platform-specific word counts (validate against live posting)
  - Color schemes (test first, then commit)
```

---

## 🎯 WORKFLOW BREAKDOWNS (HOW TO STRUCTURE IN n8n)

### Option A: Separate Workflows (RECOMMENDED)
```
Manager Workflow:
├─ Webhook trigger
├─ Validate input
├─ Fetch Portfolio API
├─ Set variables
├─ Execute Workflow: Employee-1-Extractor
├─ Execute Workflow: Employee-2-Generator-X
├─ Execute Workflow: Employee-2-Generator-LinkedIn
├─ Execute Workflow: Employee-2-Generator-Blog
├─ Execute Workflow: Employee-2-Generator-DevTo
├─ Execute Workflow: Employee-3-Image-Prompt
├─ Execute Workflow: Employee-4-Image-Generator
├─ Execute Workflow: Employee-5-Draft-Stager
├─ Aggregate results
└─ Return response (200 OK)

Employee-1-Extractor.workflow:
├─ Webhook trigger (from Manager)
├─ Query Notion
├─ Parse content
└─ Return structured data

Employee-2-Generator-X.workflow:
├─ Webhook trigger (platform: X)
├─ Build XML prompt
├─ Call Gemini
├─ Validate tweets
└─ Return content

[Similarly for LinkedIn, Blog, DevTo]

Employee-3-Image-Prompt.workflow:
├─ Receive all content
├─ Extract concepts
├─ Generate prompt
└─ Return image_prompt

Employee-4-Image-Generator.workflow:
├─ Call Longcat AI
├─ On fail: Generate fallback
├─ Upload to Google Drive
└─ Return URL

Employee-5-Draft-Stager.workflow:
├─ Receive all content
├─ Create markdown preview
├─ Save to Google Drive
├─ Update Notion
└─ Return status
```

**Advantages**:
- Easy to debug individual employees
- Can test each workflow independently
- Clear separation of concerns
- Easier for new people to understand
- Modular (reuse employees in other workflows)

**Build Time**: ~30-40 hours total

---

### Option B: Sub-workflows (ALTERNATIVE)
```
Manager Workflow:
├─ Webhook trigger
├─ Validate input
├─ Fetch Portfolio API
├─ Call Sub-workflow: Content-Generation
│  └─ This contains all 5 employees as sub-flows
├─ Aggregate results
└─ Return response
```

**Advantages**:
- Single workflow file to manage
- Faster to build initially

**Disadvantages**:
- Harder to debug
- Can't reuse employees elsewhere
- Slower execution (nested overhead)

**Recommendation**: Use Option A (Separate Workflows) - better for maintenance and scaling

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Foundation (Weeks 1-2)
```
✅ Create Manager workflow structure
✅ Create Employee 1 (Content Extractor)
✅ Test Manager + Employee 1 integration
✅ Validate Notion querying works
✅ Success: Can extract content from Notion
Target: 2 test runs successful
```

### Phase 2: Content Generation (Weeks 2-3)
```
✅ Create Employee 2 (AI Generator) - X platform
✅ Test with Manager
✅ Duplicate for LinkedIn variant
✅ Duplicate for Blog variant
✅ Duplicate for dev.to variant
✅ Add Portfolio API integration to Manager
✅ Test all 4 platform generators
Success: All 4 generators produce valid content
Target: 5 test runs per platform successful
```

### Phase 3: Image Generation (Weeks 3-4)
```
✅ Create Employee 3 (Image Prompt Generator)
✅ Create Employee 4 (Image Generator via Longcat)
✅ Test with Manager
✅ Test fallback image generation
✅ Test Google Drive upload
Success: Images generate and upload successfully
Target: 5 test runs with 80%+ success rate
```

### Phase 4: Draft Staging (Weeks 4-5)
```
✅ Create Employee 5 (Draft Stager)
✅ Test Notion updates
✅ Test Google Drive preview creation
✅ Test data aggregation
✅ Test error handling
Success: Notion shows all generated content in readable format
Target: 3 full end-to-end tests successful
```

### Phase 5: Quality Assurance (Weeks 5-6)
```
✅ Run 10 full end-to-end tests
✅ Compare outputs with v4.2 samples
✅ Validate all constraints (word counts, tweet counts, etc.)
✅ Test error scenarios (API failures, timeouts)
✅ Performance check (execution time < 100 sec)
✅ Reliability check (99%+ success rate)
Success: Output matches v4.2 quality, all tests pass
Target: 10/10 test runs successful
```

### Phase 6: Production Deployment (Week 6-7)
```
✅ Deploy all workflows to production
✅ Keep v4.2 active as fallback
✅ Run 3 side-by-side tests (v5.0 vs v4.2)
✅ Monitor error logs for 48 hours
✅ Gather feedback from first 5 real runs
Success: v5.0 working reliably in production
Target: 48 hours, 0 errors
```

### Phase 7: Optimization & Handoff (Week 7-8)
```
✅ Fine-tune prompts based on feedback
✅ Optimize execution time
✅ Document everything for AI agents
✅ Create runbook for troubleshooting
✅ Deactivate v4.2 when confident
Success: v5.0 is primary workflow, documented
Target: Ready for long-term maintenance
```

---

## 📋 SUCCESS METRICS

```
v5.0 is DONE when:
✅ All 5 employee workflows created + tested
✅ Manager orchestrator working flawlessly
✅ Portfolio API integrated (dynamic author data)
✅ Longcat AI image generation working (with fallback)
✅ dev.to content generation working
✅ LinkedIn optimizations implemented
✅ Twitter threads: 8-12 tweets per thread
✅ Output quality ≥ v4.2 standards
✅ Execution time < 100 seconds
✅ Success rate ≥ 99.7%
✅ Cost: $0/month (still free tier only)
✅ New person can understand workflow in 30 mins
✅ Bug fix time < 1 hour
✅ All code documented in this PRD
✅ Notion shows "Pending Approval" status after generation
✅ Images auto-generate and upload to Google Drive
✅ Part 2 posting workflow still works (untouched)
```

---

## 🧠 QUICK REFERENCE FOR AI AGENTS

### "What should I build first?"
→ Start with Phase 1: Manager + Employee 1 (Content Extractor)

### "Can I change the prompt structure?"
→ NO - Only change values inside existing XML tags. Structure is frozen.

### "Should I create sub-workflows or separate workflows?"
→ SEPARATE WORKFLOWS (Option A) - better for maintenance.

### "What if Longcat AI times out?"
→ CONTINUE with fallback image (solid color + text). Don't fail.

### "How do I pass data between workflows?"
→ Use "Execute Workflow" node with mapped inputs (see Webhook Integration section).

### "Can I add more platforms in v5.0?"
→ NO - Only X, LinkedIn, Blog, dev.to in v5.0. Plan more for v5.1.

### "Where does v5.0 stop and Part 2 begins?"
→ v5.0 stops at "Notion updated to Pending Approval". Part 2 starts when human approves and changes status to "Ready".

### "Is Part 2 changing?"
→ NO - Part 2 workflow (posting) stays the same. Only v5.0 (generation) is refactored.

### "What if the Portfolio API fails?"
→ Retry 2x, then use fallback hardcoded profile. Continue (don't fail).

### "Can I break up workflows further?"
→ NO - The 5 employee workflows are the minimum viable breakdown. Don't split further.

---

## 📞 COMMON ISSUES & SOLUTIONS

### Issue: Content extraction is slow
**Solution**: Check Notion rate limits. Add pagination if content > 10K words.

### Issue: Gemini API returns incomplete content
**Solution**: Increase max_tokens to 2500. Increase temperature to 0.8 for creative content.

### Issue: Image generation fails consistently
**Solution**: Check Longcat API key. Check free tier quota. Use fallback (it's working).

### Issue: Notion updates don't show
**Solution**: Verify field names match exactly (case-sensitive). Check Notion API token permissions.

### Issue: Google Drive upload fails
**Solution**: Check folder permissions. Verify folder path exists. Retry 3x with exponential backoff.

### Issue: Execution takes >120 seconds
**Solution**: Parallelize Employee 2 calls (run all 4 platforms simultaneously). Check API timeouts.

---

## 📄 DELIVERABLES CHECKLIST

```
When handing to AI agent, provide:
☐ This PRD file (complete reference)
☐ Existing Part 1 workflow JSON (your current automation)
☐ Portfolio API docs + endpoint
☐ Longcat AI API docs + key
☐ Notion database schema (field names, types)
☐ Google Drive folder structure
☐ Test dataset (5 sample Notion pages)

AI agent should deliver:
☐ 5 Employee workflow files (ready to import to n8n)
☐ 1 Manager workflow file
☐ Webhook integration configured
☐ All API keys/credentials configured
☐ Test results (10 full runs logged)
☐ Deployment checklist completed
☐ Documentation of any deviations
☐ Runbook for troubleshooting
```

---

## 🎯 FINAL NOTES

**This PRD is the single source of truth.** Share it with your AI agent and don't create additional documents. Everything they need is here.

**Build incrementally**: Complete Phase 1, validate, move to Phase 2. Don't try to build everything at once.

**Test constantly**: Each employee workflow should be tested independently before integration.

**Preserve what works**: Don't refactor Part 2 (posting) or Part 1 core logic unless absolutely necessary.

**Document as you go**: If you deviate from this PRD, document why. Future you will appreciate it.

---

**Document Status**: Complete & Ready for Implementation  
**Last Updated**: January 9, 2026  
**Audience**: AI Agents, Developers, Project Managers  
**Version**: v5.0 PRD