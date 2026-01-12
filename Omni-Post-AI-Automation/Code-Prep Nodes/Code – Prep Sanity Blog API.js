// ════════════════════════════════════════════════════════════════════════════
// BLOG PAYLOAD ARCHITECT (vFINAL - MASTER METADATA EXTRACTOR)
// Target Properties: "Sanity Blog Draft", "Shared_SEO_Title", "Shared_SEO_Description", "Shared_Slug", "Shared_Tags"
// ════════════════════════════════════════════════════════════════════════════

const input = $input.first().json;
const notionData = $('Notion – Get Ready Content').first().json;

// --- 1. ROBUST JSON EXTRACTION ---
function getRawString(data) {
    if (data.content?.parts?.[0]?.text) return data.content.parts[0].text;
    if (typeof data.text === 'string') return data.text;
    if (typeof data === 'string') return data;
    return "";
}

function parseAndExtract(rawStr) {
    if (!rawStr) return { text: "", data: {} };

    // Locate JSON boundaries
    const firstBrace = rawStr.indexOf('{');
    const lastBrace = rawStr.lastIndexOf('}');
    let jsonCandidate = (firstBrace !== -1 && lastBrace !== -1) ? rawStr.substring(firstBrace, lastBrace + 1) : rawStr;

    try {
        const parsed = JSON.parse(jsonCandidate);

        // Extract Markdown
        let md = parsed.formatted_markdown || parsed.markdown || parsed.text || "";

        // Return both MD and the Structured Data object
        return {
            text: md,
            data: parsed.structured_data || {}
        };
    } catch (e) {
        // Fallback: Return raw string, empty data
        return {
            text: rawStr.replace(/```json/g, '').replace(/```/g, '').trim(),
            data: {}
        };
    }
}

const extracted = parseAndExtract(getRawString(input));
const metadata = extracted.data.seo || {};

// --- 2. METADATA PROCESSING ---

// A. Slug Strategy: Persist existing, or generate from AI, or fallback to Title
const existingSlug = notionData.properties?.['Shared_Slug']?.rich_text?.[0]?.plain_text || "";
let finalSlug = existingSlug;
if (!finalSlug) {
    finalSlug = metadata.slug ||
        (extracted.data.seo?.title || "post").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// B. Tag Processing: Combine keywords and tags into one unique list
const aiTags = [...(metadata.tags || []), ...(metadata.keywords || [])];
const uniqueTags = [...new Set(aiTags)].slice(0, 10); // Limit to top 10 unique tags
const notionTags = uniqueTags.map(tag => ({ name: tag.replace(/^#/, '').trim() })); // Notion needs objects, remove #

// --- 3. NOTION CHUNKING (Content) ---
const MAX_CHARS = 1900;
const richTextArray = [];
const safeText = String(extracted.text).replace(/\u0000/g, '');

for (let i = 0; i < safeText.length; i += MAX_CHARS) {
    richTextArray.push({ type: "text", text: { content: safeText.substring(i, i + MAX_CHARS) } });
}

// --- 4. FINAL PAYLOAD ---
// We push the content AND the Master Metadata
return {
    json: {
        notionPageId: notionData.id,
        finalApiBody: {
            properties: {
                "Sanity Blog Draft": { "rich_text": richTextArray.slice(0, 95) },
                "Shared_SEO_Title": { "rich_text": [{ "text": { "content": metadata.title || "" } }] },
                "Shared_SEO_Description": { "rich_text": [{ "text": { "content": metadata.meta_description || "" } }] },
                "Shared_Slug": { "rich_text": [{ "text": { "content": finalSlug } }] },
                "Shared_Tags": { "multi_select": notionTags }
            }
        }
    }
};