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
        'Next.js', 'React', 'TypeScript',
        'n8n Automation', 'LangGraph', 'Agentic AI',
        'SEO/AEO/GEO', 'Full-Stack Development'
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
        primary: 'Build authority that attracts job offers (target: 15-25L) and freelance clients',
        secondary: 'Establish thought leadership in agentic AI and automation space',
        engagement: 'Generate inbound opportunities through demonstrated expertise'
    },
    brand_position: 'I build intelligent multi-agent systems AND the frontend interfaces that let non-technical people control them'
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