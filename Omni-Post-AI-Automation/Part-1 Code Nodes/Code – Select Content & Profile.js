// ════════════════════════════════════════════════════════════════════════════
// CONTENT SELECTION & PROFILE SETUP (V2 - Updated Feb 2026)
// ════════════════════════════════════════════════════════════════════════════
const items = $input.all();

if (!items || items.length === 0) {
    console.log('❌ No content ready for processing');
    return [];
}

// Get first item (priority + FIFO)
const item = items[0].json;
console.log('🎯 Processing item:', item.id);

// Enhanced property extraction with fallbacks
const getProperty = (obj, path, defaultValue = '') => {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            return defaultValue;
        }
    }
    return result || defaultValue;
};

const title = getProperty(item, 'properties.Content Pages.title.0.plain_text') ||
    getProperty(item, 'properties.title.title.0.plain_text') ||
    getProperty(item, 'properties.Name.title.0.plain_text') ||
    getProperty(item, 'name') ||
    'Untitled Content';

const category = getProperty(item, 'properties.Category.select.name') ||
    'Learning';

const priority = getProperty(item, 'properties.Priority.select.name') ||
    'normal';

// ── User Profile (Single Source of Truth) ──────────────────────────────────
// Keep in sync with GEMINI.md and prompt <role> sections
const userProfile = {
    name: 'Aman Suryavanshi',
    role: 'AI Solutions Architect | Full-Stack Agentic Developer',
    focus: 'Building intelligent multi-agent systems AND the frontend interfaces that let non-technical people control them',
    personality: 'High-agency, authentic, builder-mindset, detail-oriented',
    expertise: [
        'Next.js 15', 'React 18', 'TypeScript',
        'n8n Automation', 'LangGraph', 'Agentic AI',
        'SEO/AEO/GEO', 'Multi-LLM Integration', 'API Orchestration', 'Full-Stack Development'
    ],
    audience: 'Tech community, hiring managers, AI enthusiasts, developers, startup founders',
    timezone: 'Asia/Kolkata',
    location: 'Delhi/NCR, India',
    writing_style: {
        twitter: 'Punchy, confident, thread-friendly, opinionated, no fluff',
        linkedin: 'Professional, story-driven, results-oriented, high-agency voice',
        blog: 'Authoritative, technically deep, reference-quality, SEO-optimized'
    },
    content_goals: {
        primary: 'Build authority that attracts job offers (target: 15-25L) and freelance clients via Build-in-Public content',
        secondary: 'Establish thought leadership in agentic AI and automation space in Indian market',
        engagement: 'Generate inbound opportunities through demonstrated expertise - jobs AND freelance clients'
    },
    brand_position: 'I build intelligent multi-agent systems AND the frontend interfaces that let non-technical people control them',

    // ── Strategic Positioning (for LinkedIn & career-focused content) ──────────
    // Source of truth: _ME.db/Core/Me.md + T_Stack_Strategy.md
    // Use these facts to frame ALL career-positioning content correctly.
    strategic: {
        // CRITICAL FRAMING: Aman is listed as fresher/early-career (0-2 yrs) but
        // delivers proven senior-level output. The LinkedIn angle is VELOCITY, not experience.
        // Every post should signal: "Get 5 years of output for a 0-year price."
        careerStage: {
            label: 'Fresher / Early Career (0-2 Years)',
            framingAngle: 'Velocity Hire - senior-level output at early-career cost',
            keyMessage: 'My projects prove the output, not my years. Aviators generated revenue. Omni-Post runs in production. I think in systems, not just code.',
            banPhrase: 'Never frame content as "I am learning X" or "As a fresher..." - always frame as "I implemented X in production."'
        },

        // Tier 1 target roles - apply immediately. Content should subtly speak to these decision-makers.
        targetRoles: [
            { title: 'Technical Solutions Engineer (TSE)', salaryBand: '₹10-16L', whyFit: 'Combines tech depth + business impact. Aviators = perfect case study for TSE interviews.' },
            { title: 'Associate Product Manager (APM)', salaryBand: '₹12-18L', whyFit: 'I think in systems and products, not just code. Omni-Post proves product sense.' },
            { title: 'Developer Relations (DevRel)', salaryBand: '₹9-15L', whyFit: 'Build-in-public strategy is a natural fit. Writing + coding + community.' },
            { title: 'AI Automation Engineer', salaryBand: '₹8-12L', whyFit: 'Pure n8n/workflow orchestration. Already delivering senior-level here.' }
        ],

        // Hard proof points - ALWAYS use at least one in LinkedIn posts. Exact numbers only.
        proofPoints: [
            { metric: '₹300K revenue impact', context: 'Aviators Training Centre - Next.js + n8n + SEO, #1 Google rankings' },
            { metric: '74-node production workflow', context: 'Omni-Post AI - Multi-LLM content automation running on 8+ platforms' },
            { metric: '99.7% reliability', context: 'Self-healing n8n workflows with DLQ architecture and retry logic' },
            { metric: '80% time reduction', context: 'Manual content tasks automated via Omni-Post AI end-to-end pipeline' },
            { metric: '95+ Lighthouse score', context: 'Next.js 15 performance optimization with sub-2s load times' }
        ],

        // T-shaped differentiator - the unique combination that makes Aman rare
        uniquePositioning: 'Most AI developers cannot build UIs. Most frontend developers cannot build agents. I do BOTH - end-to-end.',

        // Freelance services offered (for freelance-targeting content accuracy)
        freelanceServices: [
            'n8n Automation Builds - complex workflow orchestration for businesses (₹30K-150K per project)',
            'AI SEO/GEO Optimization - make websites rank in AI search engines like Perplexity/ChatGPT',
            'Domain-Specific AI Agents - content automation, customer support, lead generation'
        ],

        // Current & completed projects - ONLY include these. Never commit to future deliverables.
        projects: [
            {
                name: 'Aviators Training Centre',
                status: 'Completed',
                stack: 'Next.js 15 + n8n + SEO',
                impact: '₹300K revenue impact, #1 Google rankings, 95+ Lighthouse score'
            },
            {
                name: 'Omni-Post AI Automation',
                status: 'In Progress (Build-in-Public)',
                stack: '74-node n8n + Multi-LLM (GPT-4/Claude/Gemini) + Notion + 8 platforms',
                impact: '80% time reduction in content workflow, 99.7% automation reliability'
            },
            {
                name: 'Portfolio Website',
                status: 'Completed',
                stack: 'Next.js 15 + TypeScript',
                impact: 'Production-grade UI, sub-2s load times, 95+ Lighthouse'
            }
        ],

        // Future roadmap (for "What I am building next" hooks - sneak peek only, no commitments)
        buildingNext: 'Actively exploring agentic AI patterns with LangGraph - documenting everything in public.'
    }
};

const sessionId = `session_${Date.now()}_${(item.id || '').toString().substring(0, 8)}`;

return [{
    json: {
        id: item.id,
        title: title,
        category: category,
        priority: priority,
        sessionId: sessionId,
        userProfile: userProfile,
        processingStartTime: new Date().toISOString(),
        remainingItems: items.length - 1,
        originalId: item.id
    }
}];