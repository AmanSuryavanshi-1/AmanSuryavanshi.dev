// ════════════════════════════════════════════════════════════════════════════
// TWITTER PAYLOAD ARCHITECT (v2.0 - PRODUCTION READY)
// Target: "Twitter Draft" 
// Input: Gemini AI Output JSON with formatted_markdown
// Output: Clean human-readable thread text with --- separators
// ════════════════════════════════════════════════════════════════════════════

const input = $input.first().json;
const notionData = $('Notion – Get Ready Content').first().json;

// ═══════════════════════════════════════════════════════════════════════════
// 1. UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sanitizes text by removing zero-width characters and normalizing linebreaks
 */
function sanitizeText(text) {
    if (!text) return "";
    return String(text)
        .replace(/\u0000/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .normalize('NFC')
        .replace(/\r\n/g, '\n');
}

/**
 * Converts escaped newlines to actual newlines
 * AI often returns \\n instead of actual line breaks
 */
function unescapeNewlines(text) {
    if (!text) return "";
    return text
        .replace(/\\n\\n\\n/g, '\n\n\n')  // Triple newlines first
        .replace(/\\n\\n/g, '\n\n')        // Double newlines
        .replace(/\\n/g, '\n')              // Single newlines
        .replace(/\\r/g, '\r')              // Carriage returns
        .replace(/\\t/g, '\t');             // Tabs
}

/**
 * Robust JSON parser that handles:
 * - Markdown code fences (```json ... ```)
 * - Embedded JSON strings
 * - Malformed JSON with recovery
 */
function robustJSONParse(rawStr) {
    if (!rawStr) return null;
    if (typeof rawStr !== 'string') return rawStr; // Already an object

    // Step 1: Strip markdown fences
    let cleanStr = rawStr
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/g, '')
        .trim();

    // Step 2: Try to parse directly first
    try {
        return JSON.parse(cleanStr);
    } catch (e) {
        // Continue to recovery
    }

    // Step 3: Find the largest JSON object
    const jsonMatch = cleanStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            // Try removing any remaining code fences inside
            const cleaned = jsonMatch[0]
                .replace(/```json/g, '')
                .replace(/```/g, '');
            try {
                return JSON.parse(cleaned);
            } catch (e2) {
                // Final attempt: fix common issues
            }
        }
    }

    return null; // Failed to parse
}

/**
 * Chunks text into Notion-compatible segments (<2000 chars each)
 */
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
                // Split long paragraphs by lines
                const lines = paragraph.split('\n');
                for (const line of lines) {
                    if ((currentChunk.length + line.length + 1) <= maxChars) {
                        currentChunk += (currentChunk ? '\n' : '') + line;
                    } else {
                        if (currentChunk) { chunks.push(currentChunk); currentChunk = ""; }
                        if (line.length > maxChars) {
                            // Force split very long lines
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
    return chunks.length > 0 ? chunks : [""]; // Ensure at least one chunk
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. EXTRACTION - Get raw text from Gemini response
// ═══════════════════════════════════════════════════════════════════════════

let rawStr = "";

// Priority order for extraction
if (input.generated_content) {
    rawStr = input.generated_content;
} else if (input.content?.parts?.[0]?.text) {
    // Gemini API format: { content: { parts: [{ text: "..." }] } }
    rawStr = input.content.parts[0].text;
} else if (input.text) {
    rawStr = input.text;
} else if (typeof input === 'string') {
    rawStr = input;
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. PARSING - Extract formatted_markdown from JSON
// ═══════════════════════════════════════════════════════════════════════════

let extractedText = "";
const parsedJSON = robustJSONParse(rawStr);

if (parsedJSON) {
    // Priority 1: formatted_markdown (the primary field we want)
    if (parsedJSON.formatted_markdown) {
        extractedText = parsedJSON.formatted_markdown;
    }
    // Priority 2: markdown field
    else if (parsedJSON.markdown) {
        extractedText = parsedJSON.markdown;
    }
    // Priority 3: Stitch from structured_data.threads
    else if (parsedJSON.structured_data?.threads) {
        const threads = parsedJSON.structured_data.threads;
        const mainThread = Array.isArray(threads) ? threads[0] : threads;

        if (mainThread && mainThread.tweets) {
            extractedText = mainThread.tweets
                .map(t => {
                    let content = t.content || "";
                    // Append image marker if present
                    if (t.image_marker && !content.includes(t.image_marker)) {
                        content += "\n\n" + t.image_marker;
                    }
                    return content;
                })
                .join('\n\n---\n\n');
        }
    }
    // Priority 4: Fallback to text
    else if (parsedJSON.text) {
        extractedText = parsedJSON.text;
    }
} else {
    // JSON parsing failed - try regex extraction
    const markdownMatch = rawStr.match(/"formatted_markdown"\s*:\s*"([\s\S]*?)(?<!\\)"/);
    if (markdownMatch) {
        extractedText = markdownMatch[1];
    } else {
        // Try fence extraction
        const fenceMatch = rawStr.match(/```(?:markdown)?\s*([\s\S]*?)```/);
        if (fenceMatch) {
            extractedText = fenceMatch[1];
        } else {
            // Last resort: use raw with cleanup
            extractedText = rawStr
                .replace(/^Here is the.*?:\s*/i, '')
                .replace(/^Sure.*?:\s*/i, '');
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. CLEANING - Make it human-readable
// ═══════════════════════════════════════════════════════════════════════════

// First: Unescape newlines (AI returns \\n instead of actual newlines)
let cleanText = unescapeNewlines(extractedText);

// Second: Sanitize (remove zero-width chars, normalize unicode)
cleanText = sanitizeText(cleanText).trim();

// Third: Remove AI-generated headers
cleanText = cleanText
    .replace(/^#\s*Twitter\s*Draft\s*\n+/i, '')     // "# Twitter Draft\n"
    .replace(/^Thread\s*\d*\s*\n+/i, '')            // "Thread 1\n"
    .replace(/^Tweet\s*\d+\/\d+\s*\n+/gi, '')       // "Tweet 1/6\n" (if at start)
    .replace(/^---\s*\n+/, '')                       // Leading separator
    .trim();

// Fourth: Handle extraction failure
if (!cleanText || cleanText.length < 10) {
    cleanText = "⚠️ Error: Content extraction failed.\n\n" +
        "Raw input preview:\n" +
        rawStr.substring(0, 500).replace(/"/g, "'");
}

// Fifth: Validate thread structure (informational, no truncation)
if (cleanText.length > 280 && !cleanText.includes('---')) {
    console.warn('⚠️ Twitter thread may be missing separators');
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. OUTPUT - Format for Notion
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
                "Twitter Draft": { "rich_text": richTextArray.slice(0, 95) }
            }
        },
        // Debug info (remove in production)
        _debug: {
            rawLength: rawStr.length,
            extractedLength: cleanText.length,
            chunksCount: finalChunks.length,
            parsedSuccessfully: !!parsedJSON
        }
    }
};