/**
 * Sanity Blog Post Creator for Omni-Post AI Technical Documentation
 * Run: node scripts/create-omni-post-blog.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
    console.error('Missing Sanity credentials in .env.local');
    process.exit(1);
}

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;

// Helper to create unique keys
const createKey = () => Math.random().toString(36).substring(2, 12);

// Create a text block
function textBlock(text, style = 'normal', markDefs = []) {
    return {
        _type: 'block',
        _key: createKey(),
        style,
        markDefs,
        children: [{ _type: 'span', _key: createKey(), text, marks: [] }]
    };
}

// Create heading block
function heading(text, level) {
    return textBlock(text, `h${level}`);
}

// Create code block
function codeBlock(code, language = 'javascript', filename = '') {
    return {
        _type: 'code',
        _key: createKey(),
        language,
        code,
        filename
    };
}

// Create image block with Cloudinary URL  
function imageBlock(url, alt, caption = '') {
    return {
        _type: 'image',
        _key: createKey(),
        asset: { _type: 'reference', _ref: url }, // Will need special handling
        alt,
        caption
    };
}

// Create table block
function tableBlock(rows) {
    return {
        _type: 'table',
        _key: createKey(),
        rows: rows.map(cells => ({
            _type: 'row',
            _key: createKey(),
            cells
        }))
    };
}

// Create bullet list item
function bulletItem(text) {
    return {
        _type: 'block',
        _key: createKey(),
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [{ _type: 'span', _key: createKey(), text, marks: [] }]
    };
}

// Create numbered list item  
function numberItem(text, level = 1) {
    return {
        _type: 'block',
        _key: createKey(),
        style: 'normal',
        listItem: 'number',
        level,
        markDefs: [],
        children: [{ _type: 'span', _key: createKey(), text, marks: [] }]
    };
}

// Build the complete blog post body
function buildBlogBody() {
    const body = [];

    // Part I: Project Overview
    body.push(heading('Part I: Project Overview', 2));

    body.push(heading('1. Introduction', 3));
    body.push(textBlock('I built this automation system to solve a specific problem: consistent, high-quality content distribution across multiple platforms without manual repetition. The challenge wasn\'t creating content-I had hundreds of technical notes in Notion. The challenge was transforming those notes into platform-optimized posts for Twitter, LinkedIn, and my blog, which was consuming 15-20 hours per month.'));

    body.push(textBlock('Business Impact:'));
    body.push(bulletItem('Cost Savings: $0/month operational cost vs. $60-300/month for commercial tools (Buffer, Zapier, Make)'));
    body.push(bulletItem('Time Savings: 15-20 hours/month automated (previously manual content creation)'));
    body.push(bulletItem('Reliability: 99.7% success rate across 1000+ production executions'));
    body.push(bulletItem('Quality: 85% engagement rate (up from 60% with manual posting)'));
    body.push(bulletItem('Scalability: Handles 100+ content pieces/month within free-tier API limits'));

    body.push(textBlock('System Overview:'));
    body.push(textBlock('This is a production-grade, bi-part n8n automation consisting of 74 nodes orchestrating 5 external APIs. The system:'));
    body.push(numberItem('Extracts hierarchical content from Notion (3-4 levels deep)'));
    body.push(numberItem('Generates platform-specific content using AI (Gemini 2.5 Pro with XML-structured prompts)'));
    body.push(numberItem('Stores drafts in Google Drive for human review'));
    body.push(numberItem('Distributes approved content to Twitter (threads), LinkedIn (single posts), and Blog (Sanity CMS)'));
    body.push(numberItem('Tracks all operations with session-based architecture for concurrent execution safety'));

    // Evolution Timeline Table
    body.push(tableBlock([
        ['Version', 'Features', 'Result', 'Learning'],
        ['v1 (Twitter-Only)', 'Simple Telegram bot, no AI', '60% engagement', 'Automation basics'],
        ['v2 (Twitter + AI)', 'Added Gemini, XML prompts', '70% engagement', 'Prompt engineering'],
        ['v3 (Multi-Platform)', 'LinkedIn + Blog, 50+ nodes', '15% failure rate', 'Need separation'],
        ['v4 (Production)', 'Bi-part system, sessions', '99.7% reliability', 'Architecture matters']
    ]));

    // The Problem Section
    body.push(heading('2. The Problem I Solved', 3));
    body.push(textBlock('The core problem: I had valuable technical content in Notion, but distributing it across platforms was consuming 15-20 hours per month. This wasn\'t a content creation problem-it was a distribution and adaptation problem.'));

    body.push(tableBlock([
        ['Challenge', 'My Reality', 'Traditional Solution', 'Cost'],
        ['Time Intensive', '15-20 hours/month for 1-2 pieces/week', 'Hire freelancer', '$500-2000/mo'],
        ['Manual Repetition', 'Rewrite same idea 3 ways', 'Buffer/Zapier/Make', '$60-300/mo'],
        ['Burnout Risk', 'Consistent posting → creator fatigue', 'Outsource', '$2000+/mo'],
        ['Low Authenticity', 'Generic templates feel impersonal', 'Premium AI tools', '$50-200/mo']
    ]));

    // Metrics Section
    body.push(heading('3. Project Metrics & Results', 3));

    body.push(codeBlock(`System Architecture:
Total Nodes: 74
├─ Part 1 (Generation): 28 nodes
├─ Part 2 (Distribution): 46 nodes
└─ External APIs: 5 (Notion, Gemini, Perplexity, Twitter/LinkedIn, Google Drive)

Reliability Metrics:
Success Rate: 99.7% (997/1000 executions)
├─ Part 1 Success: 99.8%
├─ Part 2 Success: 99.7%
├─ Concurrent Execution: 100% (zero cross-contamination)
└─ Silent Failures: <0.1%`, 'text'));

    body.push(codeBlock(`Performance Benchmarks:
End-to-End Processing Time: 65-111 seconds (avg: 88s)

Part 1 (Generation Pipeline):
├─ Notion extraction: 2-3s
├─ Content processing: 3-5s
├─ Perplexity research: 8-12s
├─ LLM generation (parallel): 35-60s
└─ Subtotal: 48-80s (avg: 64s)

Part 2 (Distribution Pipeline):
├─ Content retrieval: 2-3s
├─ Twitter posting: 5-10s
├─ LinkedIn posting: 5-10s
├─ Blog publishing: 3-5s
└─ Subtotal: 17-31s (avg: 24s)`, 'text'));

    // Technology Stack
    body.push(heading('4. Technology Stack', 3));
    body.push(textBlock('Core Infrastructure:'));
    body.push(bulletItem('Automation Platform: n8n (self-hosted via Cloudflare Tunnel)'));
    body.push(bulletItem('Primary LLM: Google Gemini 2.5 Pro (free tier, 1000 requests/day)'));
    body.push(bulletItem('Research API: Perplexity Sonar (free tier)'));
    body.push(bulletItem('Content Management: Notion API, Google Drive, Sanity CMS'));
    body.push(bulletItem('Distribution APIs: Twitter/X, LinkedIn (OAuth2)'));

    // Part II: System Architecture
    body.push(heading('Part II: System Architecture', 2));

    body.push(heading('5. High-Level Architecture', 3));
    body.push(codeBlock(`┌──────────────────┐
│  Notion Database │ ← I write my ideas here
│  (Source)        │
└────────┬─────────┘
         │
         ▼
    ┌─────────────┐
    │  PART 1:    │ ← AI generates platform-specific content
    │ Generation  │    (28 nodes, 48-80 sec)
    │ Pipeline    │
    └──────┬──────┘
           │
           ▼
    ┌──────────────┐
    │ Google Drive │ ← Drafts stored for review
    │  (Drafts)    │
    └──────┬───────┘
           │
           ▼
    ┌─────────────┐
    │  PART 2:    │ ← Distributes to platforms
    │Distribution │    (46+ nodes, 17-31 sec)
    │ Pipeline    │
    └──────┬──────┘
           │
    ┌──────┴──────────────┬────────────┐
    ▼                     ▼            ▼
 Twitter/X           LinkedIn       Blog/Sanity`, 'text'));

    body.push(textBlock('Why Two Separate Workflows?'));
    body.push(numberItem('Human Review Gate: I can review AI-generated content before posting'));
    body.push(numberItem('Debugging: Easier to isolate issues (generation vs. distribution)'));
    body.push(numberItem('Flexibility: Can regenerate content without re-posting'));
    body.push(numberItem('Safety: Prevents accidental posts during testing'));

    // Part III: AI & Prompting Strategy
    body.push(heading('Part III: AI & Prompting Strategy', 2));

    body.push(heading('9. Prompting Techniques', 3));
    body.push(tableBlock([
        ['Technique', 'What I Tried', 'Result', 'Why'],
        ['Simple Instructions', '"Write a tweet about {topic}"', 'Generic, no voice', 'Too little context'],
        ['Few-Shot Prompting', 'Provide 3-5 examples', 'Expensive, inflexible', 'Uses more tokens'],
        ['Chain-of-Thought', '"Let\'s think step by step..."', 'Slow, verbose', 'Unnecessary latency'],
        ['XML-Structured', 'Full context in XML tags', '✅ Authentic, consistent', 'Clear hierarchy']
    ]));

    body.push(heading('10. XML-Based Context Injection', 3));
    body.push(codeBlock(`<systemContext>
  <userProfile>
    <name>Aman Suryavanshi</name>
    <role>Fresh Graduate & AI/Automation Developer</role>
    <expertise>n8n, Next.js, AI/ML, Automation</expertise>
    <personality>Authentic, curious, growth-minded</personality>
    <goals>
      <primary>Build technical credibility for AI PM roles</primary>
      <secondary>Help fellow developers learn</secondary>
    </goals>
  </userProfile>
  
  <contentContext>
    <title>{sourceTitle}</title>
    <category>{contentCategory}</category>
    <summary>{intelligentSummary}</summary>
  </contentContext>
  
  <task>
    <platform>Twitter</platform>
    <requirements>
      <format>4-tweet thread</format>
      <charLimit>280 per tweet</charLimit>
      <structure>Hook → Problem → Solution → CTA</structure>
    </requirements>
  </task>
</systemContext>`, 'xml'));

    // Part IV: API Integration
    body.push(heading('Part IV: API Integration & Authentication', 2));

    body.push(heading('16. Free-Tier API Strategy', 3));
    body.push(textBlock('How I Keep Costs at $0/Month:'));
    body.push(tableBlock([
        ['Service', 'Free Tier', 'My Usage', 'Cost'],
        ['Gemini 2.5 Pro', '1000 requests/day', '~20-30/day', '$0'],
        ['Perplexity Sonar', '5 requests/day', '1-2/day', '$0'],
        ['Twitter API', '450 posts/month', '~20-30/month', '$0'],
        ['LinkedIn API', 'Unlimited organic', '~20-30/month', '$0'],
        ['Google Drive', '1TB storage', '<1GB', '$0'],
        ['Sanity CMS', '100K requests/month', '~30/month', '$0']
    ]));

    // Part V: Technical Challenges
    body.push(heading('Part V: Technical Challenges & Solutions', 2));

    body.push(heading('17. Challenge 1: Multi-Platform Asset Management', 3));
    body.push(textBlock('Each platform has different image requirements: LinkedIn (1 image max), Twitter (unlimited), Blog (unlimited). I built a three-tier decision system:'));

    body.push(codeBlock(`function determineImagePlan(platformMarkers, isSocialPlatform = false) {
  // TIER 1: Trust the AI-generated markers
  if (platformMarkers.length > 0) {
    return platformMarkers;
  }
  
  // TIER 2: Fallback to manifest
  if (allDiscoveredMarkers.length > 0 || manifestHasImages) {
    if (isSocialPlatform) {
      return [1]; // Social: Primary image only
    } else {
      return expectedImages || []; // Blog: All images
    }
  }
  
  // TIER 3: No images intended
  return [];
}`, 'javascript'));

    body.push(heading('19. Challenge 3: Session-Based File Management', 3));
    body.push(codeBlock(`// Session ID Generation
const sessionId = \`session_\${Date.now()}_\${notionId.substring(0, 8)}\`;
// Example: session_1731234567890_abc12345

// File Naming Convention
Twitter:  twitter_draft_session_1731234567890_abc12345.md
LinkedIn: linkedin_draft_session_1731234567890_abc12345.md
Blog:     blog_draft_session_1731234567890_abc12345.md
Images:   asset-1-session_1731234567890_abc12345.png`, 'javascript'));

    body.push(heading('21. Challenge 5: Error Handling & Reliability', 3));
    body.push(textBlock('46 nodes × 5 APIs = hundreds of potential failure points. I implemented multi-layer error handling:'));
    body.push(bulletItem('Layer 1: Retry for transient errors (retryOnFail: true)'));
    body.push(bulletItem('Layer 2: Graceful degradation for optional data'));
    body.push(bulletItem('Layer 3: Fail-fast for critical data'));
    body.push(bulletItem('Layer 4: Detailed error context logging'));
    body.push(bulletItem('Layer 5: Partial success tracking'));

    // Part VI: Results
    body.push(heading('Part VI: Results & Performance', 2));

    body.push(heading('22. Content Quality Transformation', 3));
    body.push(textBlock('BEFORE (Manual, v1) - Generic, low engagement:'));
    body.push(codeBlock(`Tweet 1: "Just built something cool with APIs. Pretty excited about it 🚀"
Tweet 2: "Tech is amazing. Love working with automation tools."
Tweet 3: "If you're interested in coding, check out my blog!"
Metrics: 60% engagement, Time to write: 20 minutes`, 'text'));

    body.push(textBlock('AFTER (Automated, v4) - Specific, technical, authentic:'));
    body.push(codeBlock(`Tweet 1/4: "The N x M integration problem is a nightmare. Connecting 10 AI clients to 20 tools used to mean 200 custom builds. I've started using MCP, which is like a USB-C for AI. It turns N*M integrations into N+M."

Tweet 2/4: "Here's how I'm using it with @n8n_io. I can expose my automation workflows as tools for an LLM. An AI agent can now take an unstructured Slack message, understand it, and trigger my n8n workflow."

Metrics: 85% engagement (+42%), Time: Automated (64 seconds)`, 'text'));

    // Part VII: Lessons & Future
    body.push(heading('Part VII: Lessons & Future Work', 2));

    body.push(heading('25. Key Architectural Decisions', 3));
    body.push(numberItem('Session-Based Architecture - Enables concurrent execution without cross-contamination'));
    body.push(numberItem('Hierarchical Decision Logic - Handles complex business rules'));
    body.push(numberItem('Platform-Specific Parsers - Dedicated logic for each platform'));
    body.push(numberItem('Recursive Data Processing - Handles arbitrary nesting depth'));
    body.push(numberItem('Multi-Layer Error Handling - Retry, graceful degradation, fail-fast'));

    body.push(heading('26. What Worked & What Didn\'t', 3));
    body.push(textBlock('✅ What Worked:'));
    body.push(bulletItem('XML-Based Prompting: Rich context produces authentic output'));
    body.push(bulletItem('Gemini 2.5 Pro: Cost-effective ($0/month vs. $1.60-2.40 with GPT-4)'));
    body.push(bulletItem('n8n Visual Workflow: Rapid iteration and debugging'));
    body.push(bulletItem('Session-Based Architecture: Zero cross-contamination'));

    body.push(textBlock('❌ What Didn\'t Work:'));
    body.push(bulletItem('Generic Markdown-to-All-Platforms Converters: Needed platform-specific parsers'));
    body.push(bulletItem('Flat File Storage: Files mixed together, 15% failure rate'));
    body.push(bulletItem('Binary Success/Failure: Needed partial success tracking'));

    // Conclusion
    body.push(heading('28. Conclusion', 3));
    body.push(textBlock('I built this automation system to solve a real problem: consistent, high-quality content distribution without burning out. After 1000+ executions, it\'s proven to be reliable, cost-effective, and quality-preserving.'));

    body.push(textBlock('Key Takeaways:'));
    body.push(numberItem('Session-based architecture prevents cross-contamination in concurrent workflows'));
    body.push(numberItem('Hierarchical decision logic handles complex business rules elegantly'));
    body.push(numberItem('Platform-specific parsers are essential for multi-platform systems'));
    body.push(numberItem('Recursive algorithms solve nested data structure problems'));
    body.push(numberItem('Multi-layer error handling ensures reliability at scale'));

    body.push(textBlock('Project Status: Production Ready | Total Executions: 1000+ | Success Rate: 99.7% | Monthly Cost: $0 | Time Saved: 15-20 hours/month'));

    return body;
}

async function createBlogPost() {
    const body = buildBlogBody();

    const document = {
        _type: 'post',
        title: 'Omni-Post AI: Intelligent Multi-Platform Content Distribution Engine',
        slug: { _type: 'slug', current: 'omni-post-ai-technical-documentation' },
        excerpt: 'A production-grade automation system that transforms Notion content into platform-optimized posts for Twitter, LinkedIn, and Blog. 99.7% reliability, $0/month cost, 15-20 hours saved monthly.',
        status: 'published',
        featured: true,
        focusKeyword: 'AI content automation',
        seoTitle: 'Omni-Post AI: Build Your Own Content Distribution Engine',
        metaDescription: 'Learn how I built a 74-node automation that generates and distributes content across 3 platforms with 99.7% reliability at zero cost.',
        body
    };

    const mutations = [{ create: document }];

    try {
        const response = await fetch(SANITY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ mutations })
        });

        const result = await response.json();

        if (result.error) {
            console.error('Sanity API Error:', result.error);
            process.exit(1);
        }

        console.log('✅ Blog post created successfully!');
        console.log('Document ID:', result.results?.[0]?.id);
        console.log('View at: https://amansuryavanshi.dev/blogs/omni-post-ai-technical-documentation');
    } catch (error) {
        console.error('Error creating blog post:', error.message);
        process.exit(1);
    }
}

createBlogPost();
