// ════════════════════════════════════════════════════════════════════════════
// IMAGE TASKLIST ARCHITECT (vFINAL - GOD TIER ROBUSTNESS)
// Target: "Image Task List"
// ════════════════════════════════════════════════════════════════════════════

const input = $input.first().json;
const notionData = $('Notion – Get Ready Content').first().json;

// --- 1. CORE UTILITIES ---

function sanitizeText(text) {
    if (!text) return "";
    return String(text)
        .replace(/\u0000/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .normalize('NFC')
        .replace(/\r\n/g, '\n');
}

function semanticChunking(text, maxChars = 1900) {
    const chunks = [];
    let currentChunk = "";
    const paragraphs = text.split('\n\n');

    for (const paragraph of paragraphs) {
        if ((currentChunk.length + paragraph.length + 2) <= maxChars) {
            currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        } else {
            if (currentChunk) { chunks.push(currentChunk); currentChunk = ""; }
            if (paragraph.length <= maxChars) {
                currentChunk = paragraph;
            } else {
                const lines = paragraph.split('\n');
                for (const line of lines) {
                    if ((currentChunk.length + line.length + 1) <= maxChars) {
                        currentChunk += (currentChunk ? '\n' : '') + line;
                    } else {
                        if (currentChunk) { chunks.push(currentChunk); currentChunk = ""; }
                        if (line.length > maxChars) {
                            let tempLine = line;
                            while (tempLine.length > 0) {
                                chunks.push(tempLine.substring(0, maxChars));
                                tempLine = tempLine.substring(maxChars);
                            }
                        } else { currentChunk = line; }
                    }
                }
            }
        }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}

// --- 2. STRATEGY PARSING ---

let extractedText = "";

// The previous node sends `strategy` inside input
if (input.strategy && input.strategy.image_strategy) {
    const strategy = input.strategy.image_strategy;
    const prompts = strategy.specific_prompts || [];
    const title = input.sourceContent?.title || "Content";

    if (prompts.length > 0) {
        let md = `# 🖼️ Image Tasklist for: ${title}\n\n`;
        md += `**Reason:** ${strategy.rationale || "Enhance content"}\n\n---\n\n`;

        prompts.forEach((task, index) => {
            const assetNum = index + 1;
            md += `## Asset ${assetNum}: ${task.purpose || 'Visual Asset'}\n\n`;
            md += `**➡️ Action Required:**\n`;
            md += `- **Type:** ${task.asset_type === 'real_asset' ? '📸 Real Asset (Screenshot/File)' : '🤖 Generative AI (Midjourney/DALL-E)'}\n`;
            md += `- **Description:** ${task.description}\n`;
            md += `- **Placement:** ${task.position}\n`;
            md += `- **Marker:** \`${task.marker || `<<IMAGE_${assetNum}>>`}\`\n\n`;

            if (task.asset_type !== 'real_asset' && task.fallback_prompt) {
                md += `**💡 GenAI Prompt:**\n> ${task.fallback_prompt}\n\n`;
            }
            md += `---\n\n`;
        });
        extractedText = md;
    } else {
        extractedText = "⚠️ Strategy found, but 'specific_prompts' array was empty. No images required.";
    }
} else {
    // Fallback if raw text or no strategy
    extractedText = input.text || "⚠️ No Image Tasks Generated (No Strategy Object Found)";
}

// --- 3. CLEANING & FORMATTING ---
let cleanText = sanitizeText(extractedText);

// --- 4. SEMANTIC CHUNKING ---
const finalChunks = semanticChunking(cleanText, 1900);
const richTextArray = finalChunks.map(chunk => ({
    type: "text",
    text: { content: chunk }
}));

// --- 5. PAYLOAD GENERATION ---
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