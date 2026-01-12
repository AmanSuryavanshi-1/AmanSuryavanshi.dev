// ════════════════════════════════════════════════════════════════════════════
// DEV.TO PAYLOAD ARCHITECT (vFINAL - CONTENT ONLY)
// Target: "DevTo Draft"
// ════════════════════════════════════════════════════════════════════════════

const input = $input.first().json;
let extractedMarkdown = "";

function getRawString(data) {
    if (data.content?.parts?.[0]?.text) return data.content.parts[0].text;
    if (typeof data.text === 'string') return data.text;
    return "";
}

function parseContentOnly(rawStr) {
    if (!rawStr) return "";
    const firstBrace = rawStr.indexOf('{');
    const lastBrace = rawStr.lastIndexOf('}');
    let jsonCandidate = (firstBrace !== -1 && lastBrace !== -1) ? rawStr.substring(firstBrace, lastBrace + 1) : rawStr;

    try {
        const parsed = JSON.parse(jsonCandidate);
        return parsed.formatted_markdown || parsed.markdown || parsed.text || "";
    } catch (e) {
        return rawStr.replace(/```json/g, '').replace(/```/g, '').trim();
    }
}

extractedMarkdown = parseContentOnly(getRawString(input));

// --- SAFETY & CHUNKING ---
const MAX_CHARS = 1900;
const richTextArray = [];
const safeText = String(extractedMarkdown || "⚠️ Error extraction").replace(/\u0000/g, '');

for (let i = 0; i < safeText.length; i += MAX_CHARS) {
    richTextArray.push({ type: "text", text: { content: safeText.substring(i, i + MAX_CHARS) } });
}

return {
    json: {
        notionPageId: $('Notion – Get Ready Content').first().json.id,
        finalApiBody: {
            properties: {
                "DevTo Draft": { "rich_text": richTextArray.slice(0, 95) }
            }
        }
    }
};