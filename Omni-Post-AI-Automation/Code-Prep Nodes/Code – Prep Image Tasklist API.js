// ════════════════════════════════════════════════════════════════════════════
// IMAGE TASKLIST ARCHITECT (vFINAL)
// Target: "Image Task List"
// ════════════════════════════════════════════════════════════════════════════

const input = $input.first().json;
const notionData = $('Notion – Get Ready Content').first().json;

function sanitizeText(text) {
    if (!text) return "";
    return String(text).replace(/\u0000/g, '').normalize('NFC');
}

let extractedText = "";

// --- 1. STRATEGY PARSING ---
// Input comes from "Are Images Needed?" node which passes the strategy object
if (input.strategy && input.strategy.image_strategy) {
    const strategy = input.strategy.image_strategy;
    const prompts = strategy.specific_prompts || [];
    const title = input.sourceContent?.title || "Content";

    if (prompts.length > 0) {
        let md = `# 🖼️ Image Tasklist for: ${title}\n\n`;
        md += `**Reason:** ${strategy.rationale || "Enhance content"}\n\n---\n\n`;

        prompts.forEach((task, index) => {
            const assetNum = index + 1;
            md += `## Asset ${assetNum}: ${task.purpose}\n`;
            md += `**➡️ Action Required:**\n`;
            md += `* **Type:** ${task.asset_type === 'real_asset' ? '📸 Real Asset' : '🤖 Generative AI'}\n`;
            md += `* **Instructions:** ${task.description}\n`;
            md += `**💡 Fallback Prompt:**\n \`${task.fallback_prompt || "N/A"}\`\n`;
            md += `**Placement:** ${task.position}\n`;
            md += `**Marker:** \`${task.marker || `<<IMAGE_${assetNum}>>`}\`\n\n---\n\n`;
        });
        extractedText = md;
    } else {
        extractedText = "⚠️ Strategy found, but 'specific_prompts' array was empty. No images required.";
    }
} else {
    // Fallback if raw text
    extractedText = input.text || "⚠️ No Image Tasks Generated";
}

let cleanText = sanitizeText(extractedText);

// --- 2. CHUNK ---
const MAX_CHARS = 1900;
const richTextArray = [];
for (let i = 0; i < cleanText.length; i += MAX_CHARS) {
    richTextArray.push({ type: "text", text: { content: cleanText.substring(i, i + MAX_CHARS) } });
}

// --- 3. PAYLOAD ---
return {
    json: {
        notionPageId: notionData.id,
        finalApiBody: {
            properties: {
                "Image Task List": { "rich_text": richTextArray.slice(0, 95) }
            }
        }
    }
};