// ════════════════════════════════════════════════════════════════════════════
// LINKEDIN PAYLOAD ARCHITECT (v2.0 - PRODUCTION READY)
// Target: "LinkedIn Draft"
// Input: Gemini AI Output JSON with formatted_markdown
// Output: Clean human-readable post text
// ════════════════════════════════════════════════════════════════════════════

const input = $input.first().json;
const notionData = $('Notion – Get Ready Content').first().json;

// ═══════════════════════════════════════════════════════════════════════════
// 1. UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function sanitizeText(text) {
    if (!text) return "";
    return String(text)
        .replace(/\u0000/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .normalize('NFC')
        .replace(/\r\n/g, '\n');
}

function unescapeNewlines(text) {
    if (!text) return "";
    return text
        .replace(/\\n\\n\\n/g, '\n\n\n')
        .replace(/\\n\\n/g, '\n\n')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"');  // Unescape quotes
}

function robustJSONParse(rawStr) {
    if (!rawStr) return null;
    if (typeof rawStr !== 'string') return rawStr;

    let cleanStr = rawStr
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/g, '')
        .trim();

    try {
        return JSON.parse(cleanStr);
    } catch (e) { }

    const jsonMatch = cleanStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            const cleaned = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '');
            try { return JSON.parse(cleaned); } catch (e2) { }
        }
    }

    return null;
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
                            let remaining = line;
                            while (remaining.length > 0) {
                                chunks.push(remaining.substring(0, maxChars));
                                remaining = remaining.substring(maxChars);
                            }
                        } else {
                            currentChunk = line;
                        }
                    }
                }
            }
        }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks.length > 0 ? chunks : [""];
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════

let rawStr = "";

if (input.generated_content) {
    rawStr = input.generated_content;
} else if (input.content?.parts?.[0]?.text) {
    rawStr = input.content.parts[0].text;
} else if (input.text) {
    rawStr = input.text;
} else if (typeof input === 'string') {
    rawStr = input;
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. PARSING
// ═══════════════════════════════════════════════════════════════════════════

let extractedText = "";
const parsedJSON = robustJSONParse(rawStr);

if (parsedJSON) {
    // Priority 1: formatted_markdown
    if (parsedJSON.formatted_markdown) {
        extractedText = parsedJSON.formatted_markdown;
    }
    // Priority 2: markdown
    else if (parsedJSON.markdown) {
        extractedText = parsedJSON.markdown;
    }
    // Priority 3: structured_data.posts[0].content
    else if (parsedJSON.structured_data?.posts?.[0]?.content) {
        extractedText = parsedJSON.structured_data.posts[0].content;
    }
    // Priority 4: content
    else if (parsedJSON.content) {
        extractedText = parsedJSON.content;
    }
    // Priority 5: text
    else if (parsedJSON.text) {
        extractedText = parsedJSON.text;
    }
} else {
    // JSON parsing failed - try regex extraction
    const markdownMatch = rawStr.match(/"formatted_markdown"\s*:\s*"([\s\S]*?)(?<!\\)"/);
    if (markdownMatch) {
        extractedText = markdownMatch[1];
    } else {
        const fenceMatch = rawStr.match(/```(?:markdown)?\s*([\s\S]*?)```/);
        if (fenceMatch) {
            extractedText = fenceMatch[1];
        } else {
            extractedText = rawStr
                .replace(/^Here is the.*?:\s*/i, '')
                .replace(/^Sure.*?:\s*/i, '');
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. CLEANING
// ═══════════════════════════════════════════════════════════════════════════

let cleanText = unescapeNewlines(extractedText);
cleanText = sanitizeText(cleanText).trim();

// Remove AI-generated headers
cleanText = cleanText
    .replace(/^#\s*LinkedIn\s*Draft\s*\n+/i, '')
    .replace(/^---\s*\n+/, '')
    .trim();

// Handle extraction failure
if (!cleanText || cleanText.length < 10) {
    cleanText = "⚠️ Error: Content extraction failed.\n\n" +
        "Raw input preview:\n" +
        rawStr.substring(0, 500).replace(/"/g, "'");
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

const finalChunks = semanticChunking(cleanText, 1900);
const richTextArray = finalChunks.map(chunk => ({
    type: "text",
    text: { content: chunk }
}));

return {
    json: {
        notionPageId: notionData.id,
        finalApiBody: {
            properties: {
                "LinkedIn Draft": { "rich_text": richTextArray.slice(0, 95) }
            }
        },
        _debug: {
            rawLength: rawStr.length,
            extractedLength: cleanText.length,
            chunksCount: finalChunks.length,
            parsedSuccessfully: !!parsedJSON
        }
    }
};