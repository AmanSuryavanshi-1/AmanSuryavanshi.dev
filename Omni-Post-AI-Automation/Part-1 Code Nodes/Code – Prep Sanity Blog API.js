// ════════════════════════════════════════════════════════════════════════════
// SANITY BLOG PAYLOAD ARCHITECT (v3.0 - BATTLE-TESTED PRODUCTION)
// Target: "Sanity Blog Draft" + SEO Metadata
// Input: Gemini AI Output JSON with formatted_markdown + structured_data.seo
// Output: Clean markdown + SEO fields
// 
// HANDLES:
// - Escaped newlines (\\n, \\\\n, etc.)
// - Truncated AI responses (MAX_TOKENS)
// - JSON wrapped in markdown fences
// - Very long content (proper Notion chunking)
// - Malformed JSON recovery
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
 * CRITICAL: Properly unescape newlines from JSON strings
 * AI returns content like: "Line 1\\n\\nLine 2" which needs to become actual newlines
 * Must handle multiple levels of escaping
 */
function unescapeContent(text) {
    if (!text) return "";

    let result = text;

    // Handle quadruple escaping first (\\\\n -> \\n)
    result = result.replace(/\\\\\\\\n/g, '\n');

    // Handle triple escaping (rare but possible)
    result = result.replace(/\\\\\\n/g, '\n');

    // Handle double escaping (\\n -> newline) - most common in JSON
    result = result.replace(/\\\\n/g, '\n');

    // Handle single escaping (\n -> newline) - already actual newlines in most cases
    // But if still escaped as literal backslash-n, convert
    result = result.replace(/\\n/g, '\n');

    // Handle other escape sequences
    result = result.replace(/\\\\r/g, '\r');
    result = result.replace(/\\r/g, '\r');
    result = result.replace(/\\\\t/g, '\t');
    result = result.replace(/\\t/g, '\t');
    result = result.replace(/\\\\"/g, '"');
    result = result.replace(/\\"/g, '"');

    // Clean up any remaining double backslashes
    result = result.replace(/\\\\/g, '\\');

    return result;
}

/**
 * Robust JSON parser that handles:
 * - Markdown code fences (```json ... ```)
 * - Embedded JSON strings
 * - Malformed JSON with recovery
 * - Truncated JSON (MAX_TOKENS)
 */
function robustJSONParse(rawStr) {
    if (!rawStr) return null;
    if (typeof rawStr === 'object') return rawStr; // Already parsed

    // Step 1: Clean the input string - remove markdown fences
    let cleanStr = rawStr.trim();

    // Remove leading ```json or ``` fences
    cleanStr = cleanStr.replace(/^```(?:json)?\s*/i, '');
    // Remove trailing ``` fences
    cleanStr = cleanStr.replace(/```\s*$/g, '');
    cleanStr = cleanStr.trim();

    // Step 2: Try direct parse
    try {
        return JSON.parse(cleanStr);
    } catch (e) {
        // Continue to recovery
    }

    // Step 3: Find the outermost JSON object
    const firstBrace = cleanStr.indexOf('{');
    const lastBrace = cleanStr.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonCandidate = cleanStr.substring(firstBrace, lastBrace + 1);
        try {
            return JSON.parse(jsonCandidate);
        } catch (e) {
            // Continue to more aggressive recovery
        }
    }

    // Step 4: Handle truncated JSON (common with MAX_TOKENS)
    // Try to extract formatted_markdown even from broken JSON
    const markdownMatch = cleanStr.match(/"formatted_markdown"\s*:\s*"([\s\S]*?)(?:(?<!\\)"(?:\s*,|\s*})|$)/);
    if (markdownMatch && markdownMatch[1]) {
        // Also try to extract SEO data via regex since JSON is truncated
        const seoData = {};

        // Extract SEO title
        const titleMatch = cleanStr.match(/"title"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
        if (titleMatch) seoData.title = titleMatch[1].replace(/\\"/g, '"');

        // Extract SEO slug
        const slugMatch = cleanStr.match(/"slug"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
        if (slugMatch) seoData.slug = slugMatch[1];

        // Extract SEO meta_description
        const descMatch = cleanStr.match(/"meta_description"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
        if (descMatch) seoData.meta_description = descMatch[1].replace(/\\"/g, '"');

        // Extract tags array - look for the pattern ["tag1", "tag2", ...]
        const tagsMatch = cleanStr.match(/"tags"\s*:\s*\[([\s\S]*?)\]/);
        if (tagsMatch) {
            // Parse individual tags from the array
            const tagStrings = tagsMatch[1].match(/"([^"]+)"/g);
            if (tagStrings) {
                seoData.tags = tagStrings.map(t => t.replace(/"/g, ''));
            }
        }

        // Return a synthetic object with markdown AND recovered SEO data
        return {
            formatted_markdown: markdownMatch[1],
            structured_data: Object.keys(seoData).length > 0 ? { seo: seoData } : undefined,
            _recovered: true,
            _warning: "JSON was truncated, extracted markdown and SEO via regex"
        };
    }

    return null;
}

/**
 * CRITICAL: Proper chunking for Notion API
 * - Each rich_text element can be max 2000 chars
 * - Max 100 elements in a rich_text array
 * - We use 1900 to leave buffer for unicode expansion
 */
function chunkForNotion(text, maxCharsPerChunk = 1900) {
    if (!text) return [{ type: "text", text: { content: "" } }];

    const chunks = [];
    let remaining = text;

    while (remaining.length > 0) {
        if (remaining.length <= maxCharsPerChunk) {
            chunks.push(remaining);
            break;
        }

        // Find a good break point - prefer paragraph breaks, then line breaks, then spaces
        let breakPoint = maxCharsPerChunk;

        // Look for paragraph break (\n\n) within last 200 chars of chunk
        const paragraphBreak = remaining.lastIndexOf('\n\n', maxCharsPerChunk);
        if (paragraphBreak > maxCharsPerChunk - 200 && paragraphBreak > 0) {
            breakPoint = paragraphBreak + 2; // Include the newlines
        } else {
            // Look for line break
            const lineBreak = remaining.lastIndexOf('\n', maxCharsPerChunk);
            if (lineBreak > maxCharsPerChunk - 100 && lineBreak > 0) {
                breakPoint = lineBreak + 1;
            } else {
                // Look for space
                const spaceBreak = remaining.lastIndexOf(' ', maxCharsPerChunk);
                if (spaceBreak > maxCharsPerChunk - 50 && spaceBreak > 0) {
                    breakPoint = spaceBreak + 1;
                }
            }
        }

        chunks.push(remaining.substring(0, breakPoint));
        remaining = remaining.substring(breakPoint);
    }

    // Convert to Notion rich_text format, limiting to 95 chunks (Notion allows 100)
    return chunks.slice(0, 95).map(chunk => ({
        type: "text",
        text: { content: chunk }
    }));
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. EXTRACTION - Get raw text from Gemini response
// ═══════════════════════════════════════════════════════════════════════════

let rawStr = "";

// Priority order for extraction from Gemini response
if (input.generated_content) {
    rawStr = input.generated_content;
} else if (input.content?.parts?.[0]?.text) {
    // Standard Gemini API format
    rawStr = input.content.parts[0].text;
} else if (input.text) {
    rawStr = input.text;
} else if (typeof input === 'string') {
    rawStr = input;
} else {
    // Try to stringify if it's an object we can't parse
    try {
        rawStr = JSON.stringify(input);
    } catch (e) {
        rawStr = "";
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. PARSING - Extract formatted_markdown from JSON
// ═══════════════════════════════════════════════════════════════════════════

let extractedText = "";
let seoData = {};
let debugInfo = {
    rawLength: rawStr.length,
    parseAttempted: false,
    parseSuccess: false,
    recoveryUsed: false,
    extractionMethod: "none"
};

const parsedJSON = robustJSONParse(rawStr);
debugInfo.parseAttempted = true;

if (parsedJSON) {
    debugInfo.parseSuccess = true;

    if (parsedJSON._recovered) {
        debugInfo.recoveryUsed = true;
        debugInfo.warning = parsedJSON._warning;
    }

    // Extract formatted markdown - check multiple possible locations
    if (parsedJSON.formatted_markdown) {
        extractedText = parsedJSON.formatted_markdown;
        debugInfo.extractionMethod = "formatted_markdown";
    } else if (parsedJSON.markdown) {
        extractedText = parsedJSON.markdown;
        debugInfo.extractionMethod = "markdown";
    } else if (parsedJSON.content) {
        extractedText = parsedJSON.content;
        debugInfo.extractionMethod = "content";
    } else if (parsedJSON.text) {
        extractedText = parsedJSON.text;
        debugInfo.extractionMethod = "text";
    }

    // Extract SEO metadata
    if (parsedJSON.structured_data?.seo) {
        seoData = parsedJSON.structured_data.seo;
    } else if (parsedJSON.seo) {
        seoData = parsedJSON.seo;
    }

} else {
    // JSON parsing failed completely - try direct regex extraction
    debugInfo.parseSuccess = false;
    debugInfo.extractionMethod = "regex_fallback";

    // Try to extract formatted_markdown via regex
    const markdownMatch = rawStr.match(/"formatted_markdown"\s*:\s*"([\s\S]*?)(?:(?<!\\)"(?:\s*,|\s*\})|$)/);
    if (markdownMatch && markdownMatch[1]) {
        extractedText = markdownMatch[1];
    } else {
        // Last resort: try extracting content from markdown fence
        const fenceMatch = rawStr.match(/```(?:markdown)?\s*([\s\S]*?)```/);
        if (fenceMatch) {
            extractedText = fenceMatch[1];
            debugInfo.extractionMethod = "markdown_fence";
        } else {
            // Absolute last resort: clean the raw string
            extractedText = rawStr
                .replace(/^```json\s*/i, '')
                .replace(/```$/g, '')
                .replace(/^Here is the.*?:\s*/i, '')
                .replace(/^Sure.*?:\s*/i, '')
                .trim();
            debugInfo.extractionMethod = "raw_cleaned";
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. CLEANING - Make it human-readable
// ═══════════════════════════════════════════════════════════════════════════

// Step 1: Unescape all newlines and other escape sequences
let cleanText = unescapeContent(extractedText);

// Step 2: Sanitize (remove zero-width chars, normalize unicode)
cleanText = sanitizeText(cleanText).trim();

// Step 3: Remove AI-generated platform headers
cleanText = cleanText
    .replace(/^#\s*Blog\s*Draft\s*\n+/i, '')
    .replace(/^#\s*Sanity\s*Blog\s*Draft\s*\n+/i, '')
    .replace(/^---\s*\n+/, '')
    .trim();

// Step 4: Handle extraction failure
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
// 5. SEO METADATA PROCESSING
// ═══════════════════════════════════════════════════════════════════════════

const seoTitle = seoData.title || "";
const seoSlug = seoData.slug || "";
const seoDescription = seoData.meta_description || seoData.description || "";
const seoKeywords = Array.isArray(seoData.keywords)
    ? seoData.keywords.join(", ")
    : (seoData.keywords || "");

// Handle tags - can be array or string
const seoTagsArray = Array.isArray(seoData.tags)
    ? seoData.tags
    : (typeof seoData.tags === 'string' ? seoData.tags.split(',').map(t => t.trim()) : []);

// ═══════════════════════════════════════════════════════════════════════════
// 6. OUTPUT - Build Notion API Payload
// ═══════════════════════════════════════════════════════════════════════════

const richTextArray = chunkForNotion(cleanText, 1900);

// Build properties object
const properties = {
    "Sanity Blog Draft": { "rich_text": richTextArray }
};

// Add SHARED SEO fields for all platforms (matching Notion property names)
if (seoTitle) {
    properties["Shared_SEO_Title"] = {
        "rich_text": [{ type: "text", text: { content: seoTitle.substring(0, 2000) } }]
    };
}
if (seoSlug) {
    properties["Shared_Slug"] = {
        "rich_text": [{ type: "text", text: { content: seoSlug.substring(0, 2000) } }]
    };
}
if (seoDescription) {
    properties["Shared_SEO_Description"] = {
        "rich_text": [{ type: "text", text: { content: seoDescription.substring(0, 2000) } }]
    };
}
// Shared_Tags is a MULTI-SELECT property in Notion, not Text!
if (seoTagsArray.length > 0) {
    properties["Shared_Tags"] = {
        "multi_select": seoTagsArray.map(tag => ({ name: tag.trim() }))
    };
}

return {
    json: {
        notionPageId: notionData.id,
        finalApiBody: {
            properties: properties
        },
        // Debug info for troubleshooting (can be removed in production)
        _debug: {
            ...debugInfo,
            richTextChunks: richTextArray.length,
            hasSeoData: Object.keys(seoData).length > 0,
            seoDataExtracted: {
                title: seoTitle ? seoTitle.substring(0, 50) + "..." : null,
                slug: seoSlug || null,
                description: seoDescription ? seoDescription.substring(0, 50) + "..." : null,
                tagsCount: seoTagsArray.length
            }
        }
    }
};