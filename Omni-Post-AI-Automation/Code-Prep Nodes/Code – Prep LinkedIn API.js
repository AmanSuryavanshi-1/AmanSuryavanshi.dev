// ════════════════════════════════════════════════════════════════════════════
// LINKEDIN PAYLOAD ARCHITECT (v3.0 - BATTLE-TESTED PRODUCTION)
// Target: "LinkedIn Draft"
// Input: Gemini AI Output JSON with formatted_markdown
// Output: Clean human-readable post text
// 
// HANDLES:
// - Multiple levels of escaped newlines (\\n, \\\\n, \\\\\\\\n)
// - Truncated AI responses (MAX_TOKENS)
// - JSON wrapped in markdown fences
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

function unescapeContent(text) {
    if (!text) return "";

    let result = text;

    // Process from most escaped to least escaped
    result = result.replace(/\\\\\\\\n/g, '\n');
    result = result.replace(/\\\\\\n/g, '\n');
    result = result.replace(/\\\\n/g, '\n');
    result = result.replace(/\\n/g, '\n');
    result = result.replace(/\\\\r/g, '\r');
    result = result.replace(/\\r/g, '\r');
    result = result.replace(/\\\\t/g, '\t');
    result = result.replace(/\\t/g, '\t');
    result = result.replace(/\\\\"/g, '"');
    result = result.replace(/\\"/g, '"');
    result = result.replace(/\\\\/g, '\\');

    return result;
}

function robustJSONParse(rawStr) {
    if (!rawStr) return null;
    if (typeof rawStr === 'object') return rawStr;

    let cleanStr = rawStr.trim();
    cleanStr = cleanStr.replace(/^```(?:json)?\s*/i, '');
    cleanStr = cleanStr.replace(/```\s*$/g, '');
    cleanStr = cleanStr.trim();

    try {
        return JSON.parse(cleanStr);
    } catch (e) { }

    const firstBrace = cleanStr.indexOf('{');
    const lastBrace = cleanStr.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonCandidate = cleanStr.substring(firstBrace, lastBrace + 1);
        try {
            return JSON.parse(jsonCandidate);
        } catch (e) { }
    }

    const markdownMatch = cleanStr.match(/"formatted_markdown"\s*:\s*"([\s\S]*?)(?:(?<!\\)"(?:\s*,|\s*})|$)/);
    if (markdownMatch && markdownMatch[1]) {
        return {
            formatted_markdown: markdownMatch[1],
            _recovered: true
        };
    }

    return null;
}

function chunkForNotion(text, maxCharsPerChunk = 1900) {
    if (!text) return [{ type: "text", text: { content: "" } }];

    const chunks = [];
    let remaining = text;

    while (remaining.length > 0) {
        if (remaining.length <= maxCharsPerChunk) {
            chunks.push(remaining);
            break;
        }

        let breakPoint = maxCharsPerChunk;
        const paragraphBreak = remaining.lastIndexOf('\n\n', maxCharsPerChunk);
        if (paragraphBreak > maxCharsPerChunk - 200 && paragraphBreak > 0) {
            breakPoint = paragraphBreak + 2;
        } else {
            const lineBreak = remaining.lastIndexOf('\n', maxCharsPerChunk);
            if (lineBreak > maxCharsPerChunk - 100 && lineBreak > 0) {
                breakPoint = lineBreak + 1;
            } else {
                const spaceBreak = remaining.lastIndexOf(' ', maxCharsPerChunk);
                if (spaceBreak > maxCharsPerChunk - 50 && spaceBreak > 0) {
                    breakPoint = spaceBreak + 1;
                }
            }
        }

        chunks.push(remaining.substring(0, breakPoint));
        remaining = remaining.substring(breakPoint);
    }

    return chunks.slice(0, 95).map(chunk => ({
        type: "text",
        text: { content: chunk }
    }));
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
} else {
    try { rawStr = JSON.stringify(input); } catch (e) { rawStr = ""; }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. PARSING
// ═══════════════════════════════════════════════════════════════════════════

let extractedText = "";
let debugInfo = {
    rawLength: rawStr.length,
    parseSuccess: false,
    extractionMethod: "none"
};

const parsedJSON = robustJSONParse(rawStr);

if (parsedJSON) {
    debugInfo.parseSuccess = true;

    if (parsedJSON.formatted_markdown) {
        extractedText = parsedJSON.formatted_markdown;
        debugInfo.extractionMethod = "formatted_markdown";
    } else if (parsedJSON.markdown) {
        extractedText = parsedJSON.markdown;
        debugInfo.extractionMethod = "markdown";
    } else if (parsedJSON.structured_data?.posts?.[0]?.content) {
        extractedText = parsedJSON.structured_data.posts[0].content;
        debugInfo.extractionMethod = "structured_data_posts";
    } else if (parsedJSON.content) {
        extractedText = parsedJSON.content;
        debugInfo.extractionMethod = "content";
    } else if (parsedJSON.text) {
        extractedText = parsedJSON.text;
        debugInfo.extractionMethod = "text";
    }

} else {
    debugInfo.parseSuccess = false;

    const markdownMatch = rawStr.match(/"formatted_markdown"\s*:\s*"([\s\S]*?)(?:(?<!\\)"(?:\s*,|\s*\})|$)/);
    if (markdownMatch && markdownMatch[1]) {
        extractedText = markdownMatch[1];
        debugInfo.extractionMethod = "regex_formatted_markdown";
    } else {
        const fenceMatch = rawStr.match(/```(?:markdown)?\s*([\s\S]*?)```/);
        if (fenceMatch) {
            extractedText = fenceMatch[1];
            debugInfo.extractionMethod = "markdown_fence";
        } else {
            extractedText = rawStr.replace(/^```json\s*/i, '').replace(/```$/g, '').trim();
            debugInfo.extractionMethod = "raw_cleaned";
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. CLEANING
// ═══════════════════════════════════════════════════════════════════════════

let cleanText = unescapeContent(extractedText);
cleanText = sanitizeText(cleanText).trim();

// Remove LinkedIn-specific headers
cleanText = cleanText
    .replace(/^#\s*LinkedIn\s*Draft\s*\n+/i, '')
    .replace(/^---\s*\n+/, '')
    .trim();

// Handle extraction failure
if (!cleanText || cleanText.length < 20) {
    cleanText = "⚠️ Error: Content extraction failed.\n\n" +
        "Debug Info:\n" +
        "- Raw Length: " + rawStr.length + " chars\n" +
        "- Parse Success: " + debugInfo.parseSuccess + "\n" +
        "- Extraction Method: " + debugInfo.extractionMethod + "\n\n" +
        "Raw input preview:\n" +
        rawStr.substring(0, 800).replace(/"/g, "'");
}

debugInfo.cleanedLength = cleanText.length;

// ═══════════════════════════════════════════════════════════════════════════
// 5. OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

const richTextArray = chunkForNotion(cleanText, 1900);

return {
    json: {
        notionPageId: notionData.id,
        finalApiBody: {
            properties: {
                "LinkedIn Draft": { "rich_text": richTextArray }
            }
        },
        _debug: {
            ...debugInfo,
            richTextChunks: richTextArray.length
        }
    }
};