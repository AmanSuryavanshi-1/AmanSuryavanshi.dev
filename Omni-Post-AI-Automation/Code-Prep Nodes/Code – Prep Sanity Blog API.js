// ════════════════════════════════════════════════════════════════════════════
// SANITY BLOG PAYLOAD ARCHITECT (v2.0 - PRODUCTION READY)
// Target: "Sanity Blog Draft" + SEO Metadata
// Input: Gemini AI Output JSON with formatted_markdown + structured_data.seo
// Output: Clean markdown + SEO fields
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
        .replace(/\\"/g, '"');
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
let seoData = {};
const parsedJSON = robustJSONParse(rawStr);

if (parsedJSON) {
    // Extract formatted markdown
    if (parsedJSON.formatted_markdown) {
        extractedText = parsedJSON.formatted_markdown;
    } else if (parsedJSON.markdown) {
        extractedText = parsedJSON.markdown;
    } else if (parsedJSON.content) {
        extractedText = parsedJSON.content;
    } else if (parsedJSON.text) {
        extractedText = parsedJSON.text;
    }

    // Extract SEO metadata
    if (parsedJSON.structured_data?.seo) {
        seoData = parsedJSON.structured_data.seo;
    } else if (parsedJSON.seo) {
        seoData = parsedJSON.seo;
    }
} else {
    // JSON parsing failed - try regex
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

// Remove generic headers (but keep actual article titles)
cleanText = cleanText
    .replace(/^#\s*Blog\s*Draft\s*\n+/i, '')
    .replace(/^#\s*Sanity\s*Blog\s*Draft\s*\n+/i, '')
    .replace(/^---\s*\n+/, '')
    .trim();

// Handle extraction failure
if (!cleanText || cleanText.length < 10) {
    cleanText = "⚠️ Error: Content extraction failed.\n\n" +
        "Raw input preview:\n" +
        rawStr.substring(0, 500).replace(/"/g, "'");
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. SEO METADATA PROCESSING
// ═══════════════════════════════════════════════════════════════════════════

const seoTitle = seoData.title || "";
const seoSlug = seoData.slug || "";
const seoDescription = seoData.meta_description || seoData.description || "";
const seoKeywords = Array.isArray(seoData.keywords)
    ? seoData.keywords.join(", ")
    : (seoData.keywords || "");
const seoTags = Array.isArray(seoData.tags)
    ? seoData.tags.join(", ")
    : (seoData.tags || "");

// ═══════════════════════════════════════════════════════════════════════════
// 6. OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

const finalChunks = semanticChunking(cleanText, 1900);
const richTextArray = finalChunks.map(chunk => ({
    type: "text",
    text: { content: chunk }
}));

// Build properties object
const properties = {
    "Sanity Blog Draft": { "rich_text": richTextArray.slice(0, 95) }
};

// Add SEO fields if available
if (seoTitle) {
    properties["SEO Title"] = { "rich_text": [{ type: "text", text: { content: seoTitle.substring(0, 2000) } }] };
}
if (seoSlug) {
    properties["SEO Slug"] = { "rich_text": [{ type: "text", text: { content: seoSlug.substring(0, 2000) } }] };
}
if (seoDescription) {
    properties["SEO Meta Description"] = { "rich_text": [{ type: "text", text: { content: seoDescription.substring(0, 2000) } }] };
}
if (seoKeywords) {
    properties["SEO Keywords"] = { "rich_text": [{ type: "text", text: { content: seoKeywords.substring(0, 2000) } }] };
}

return {
    json: {
        notionPageId: notionData.id,
        finalApiBody: {
            properties: properties
        },
        _debug: {
            rawLength: rawStr.length,
            extractedLength: cleanText.length,
            hasSeoData: Object.keys(seoData).length > 0,
            parsedSuccessfully: !!parsedJSON
        }
    }
};