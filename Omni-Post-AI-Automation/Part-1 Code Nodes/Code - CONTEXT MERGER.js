// ═══════════════════════════════════════════════════════════════
// CONTEXT MERGER (fetches from previous node, merges with Perplexity)
// Place after Perplexity node, queries previous (Personal Context Builder) node
// ═══════════════════════════════════════════════════════════════

console.log('🔗 Starting final context merger...');

// 1. Fetch JSON data from the previous Personal Context Builder node
// const previous = $('Code – Personal Context Builder').first().json || {};
const previous = $('Code – Personal Context Builder').first().json;

// 2. Get Perplexity output directly – comes as $json in this node
// const perplexity = $json || {};
const perplexity = $json;

// 3. Merge key blocks: always prefer Perplexity for "research", but get everything else from previous
// const personalContext = previous.personalContext || {};
const personalContext = previous.personalContext;
const sourceContent = previous.sourceContent || {};
const contentSummary = previous.contentSummary || {};
const perplexityChoices = perplexity.choices;

// Use fallback/default for every key field!
const name = personalContext.name || 'Unknown User';
const title = sourceContent.name || 'Untitled Content';
const categories = Array.isArray(sourceContent.categories) ? sourceContent.categories : ['General'];
const primaryCategory = categories[0] || 'General';
const summary = contentSummary.summary || '';
const wordCount = contentSummary.wordCount || 0;
const structure = contentSummary.structure || 'linear';
const complexity = contentSummary.complexity || 'unknown';
const fullText = sourceContent.fullText || '';

// Perplexity/Tavily research block—parse its result
let research = {};
try {
    // Check if the input is an array (Perplexity style: choices[0].message.content)
    if (
        Array.isArray(perplexityChoices) &&
        perplexityChoices.length > 0 &&
        typeof perplexityChoices[0] === 'object'
    ) {
        let rawContent = perplexityChoices[0].message?.content ?? '';
        rawContent = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
        if (rawContent) {
            research = JSON.parse(rawContent);
            console.log('✅ Parsed AI Research JSON from choices array.');
        } else {
            throw new Error('Empty content in AI Research choices.');
        }
    }
    // Check if the input is a direct array of objects containing stringified "output" (Tavily Agent style)
    else if (
        Array.isArray(perplexity) &&
        perplexity.length > 0 &&
        perplexity[0].output
    ) {
        let rawContent = perplexity[0].output;
        rawContent = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
        research = JSON.parse(rawContent);
        console.log('✅ Parsed AI Research JSON from direct output field.');
    }
    // Check if the input is already a direct object (clean Tavily/Webhook style)
    else if (
        typeof perplexity === 'object' &&
        !Array.isArray(perplexity) &&
        Object.keys(perplexity).length > 0 &&
        perplexity.market_pulse // Check for a known key to verify it's the expected object
    ) {
        research = perplexity;
        console.log('✅ AI Research JSON was already parsed correctly.');
    }
    else {
        throw new Error('AI Research output format is unrecognized.');
    }
} catch (err) {
    console.warn(`⚠️ AI Research parsing failed: ${err.message}. Using fallback research.`);
    research = {
        market_pulse: {
            urgency_trigger: "No recent updates found. Focus on evergreen automation challenges.",
            community_sentiment: "Developers are increasingly seeking reliable, scalable alternatives to complex manual workflows.",
            the_gap: "There is a significant gap in detailed, actionable implementation guides for advanced automation.",
            sources: []
        },
        twitter: {
            hashtags: ["#BuildInPublic", `#${primaryCategory.replace(/\s+/g, '')}`],
            optimal_posting_times_ist: ["09:00 AM", "06:00 PM"],
            hook_inspiration: "Are you still doing [Task] manually? Here's the automated setup that saved me 5 hours this week."
        },
        linkedin: {
            hashtags: ["#ProcessAutomation", `#${primaryCategory.replace(/\s+/g, '')}`, "#Productivity"],
            optimal_posting_times_ist: ["10:00 AM", "02:00 PM"],
            business_value_stat: "[UNVERIFIED] Automating this workflow typically saves 10+ hours per week for engineering teams."
        },
        blog: {
            seo_keywords_primary: [
                { keyword: `${primaryCategory.toLowerCase()} automation guide`, volume: "medium", rationale: "Evergreen search intent" }
            ],
            seo_keywords_longtail: [
                { keyword: `how to automate ${primaryCategory.toLowerCase()} workflows`, volume: "low", rationale: "High intent tutorial search" }
            ],
            competitor_gap: "Current articles focus on theory. This post will provide the exact implementation steps."
        }
    };
}

// Optional IDs/session info
const originalId = previous.originalId ?? null;
const sessionId = previous.sessionId ?? null;
const notionPageId = sourceContent.id ?? null;
const extractionStats = sourceContent.extractionStats ?? {};
const hasImages = Array.isArray(sourceContent.images) && sourceContent.images.length > 0;
const processingTime = new Date().toISOString();

// Master context object (robust, merged)
const masterContext = {
    personalContext: {
        ...personalContext,
        name
    },
    sourceContent: {
        title,
        categories,
        primaryCategory,
        summary,
        wordCount,
        structure,
        complexity,
        fullText
    },
    contentSummary: {
        summary,
        wordCount,
        structure,
        complexity
    },
    research,
    originalId,
    sessionId,
    workflowMetadata: {
        notionPageId,
        extractionStats,
        hasImages,
        processingTime
    }
};

console.log('✅ Master context object created successfully!');
return [{ json: masterContext }];
