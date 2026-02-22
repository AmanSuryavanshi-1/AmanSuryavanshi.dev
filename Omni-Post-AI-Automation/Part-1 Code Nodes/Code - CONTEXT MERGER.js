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

// Perplexity research block—parse its result
let research = {};
try {
    if (
        Array.isArray(perplexityChoices) &&
        perplexityChoices.length > 0 &&
        typeof perplexityChoices[0] === 'object'
    ) {
        let rawContent = perplexityChoices[0].message?.content ?? '';
        rawContent = rawContent.replace(/``````/g, '').trim();
        if (rawContent) {
            research = JSON.parse(rawContent);
            console.log('✅ Parsed Perplexity JSON.');
        } else {
            throw new Error('Empty content in Perplexity choices.');
        }
    } else {
        throw new Error('Perplexity choices incomplete.');
    }
} catch (err) {
    console.warn(`⚠️ Perplexity parsing failed: ${err.message}. Using fallback research.`);
    research = {
        authenticHashtags: {
            twitter: ['#BuildInPublic', `#${primaryCategory}`, '#Automation', '#NoCode', '#n8n'],
            linkedin: ['#ProcessAutomation', `#${primaryCategory}`, '#SystemsThinking', '#AI'],
        },
        optimalTimesIST: {
            twitter_primary_ist: "9:00-11:00 am IST",
            twitter_secondary_ist: "8:30-9:30 pm IST (US/EU overlap)",
            linkedin_ist: "10:00-12:00 am IST (Tue-Thu)"
        },
        authenticHooks: {
            twitter_example: "Solving a weird API quirk in n8n today—here's the step that finally worked. Anyone else get stuck on webhook reliability?",
            linkedin_example: "Client automated 50% manual onboarding steps using n8n, saving 10 hours/week. Why did we choose modular flows?"
        },
        developerPainPoints: [
            "Lack of reliable content scheduling tools for Indian time zones",
            "Complicated OAuth flows between LinkedIn, X and custom APIs"
        ]
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
