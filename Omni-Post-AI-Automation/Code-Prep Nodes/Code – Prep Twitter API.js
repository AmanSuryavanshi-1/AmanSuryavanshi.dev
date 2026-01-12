// ════════════════════════════════════════════════════════════════════════════
// TWITTER PAYLOAD ARCHITECT (vFINAL - THREAD ENFORCER)
// Target: "Twitter Draft"
// ════════════════════════════════════════════════════════════════════════════

const input = $input.first().json;
const notionData = $('Notion – Get Ready Content').first().json;

function sanitizeText(text) {
    if (!text) return "";
    return String(text).replace(/\u0000/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '').normalize('NFC');
}

// --- 1. EXTRACT ---
let rawStr = "";
if (input.content?.parts?.[0]?.text) rawStr = input.content.parts[0].text;
else if (typeof input.text === 'string') rawStr = input.text;
else if (typeof input === 'string') rawStr = input;

const firstBrace = rawStr.indexOf('{');
const lastBrace = rawStr.lastIndexOf('}');
let jsonCandidate = (firstBrace !== -1 && lastBrace !== -1) ? rawStr.substring(firstBrace, lastBrace + 1) : rawStr;

let extractedText = "";
try {
    const parsed = JSON.parse(jsonCandidate);
    extractedText = parsed.formatted_markdown || parsed.markdown || parsed.text || "";

    // Handle threaded object array if AI returned that instead of markdown
    if (!extractedText && parsed.structured_data?.threads) {
        const thread = parsed.structured_data.threads[0].tweets;
        extractedText = thread.map(t => t.content + (t.image_marker ? '\n\n' + t.image_marker : '')).join('\n\n---\n\n');
    }
} catch (e) {
    extractedText = rawStr.replace(/```json/g, '').replace(/```/g, '').trim();
}

// --- 2. THREAD VALIDATION ---
let cleanText = sanitizeText(extractedText);
// If text is long (>280) and missing separators, warn the user
if (cleanText.length > 280 && !cleanText.includes('---')) {
    cleanText = "⚠️ WARNING: Thread detected but no '---' separators found. Please format manually.\n\n" + cleanText;
}

// --- 3. CHUNKING ---
const MAX_CHARS = 1900;
const richTextArray = [];
for (let i = 0; i < cleanText.length; i += MAX_CHARS) {
    richTextArray.push({ type: "text", text: { content: cleanText.substring(i, i + MAX_CHARS) } });
}

// --- 4. PAYLOAD ---
return {
    json: {
        notionPageId: notionData.id,
        finalApiBody: {
            properties: {
                "Twitter Draft": { "rich_text": richTextArray.slice(0, 95) }
            }
        }
    }
};