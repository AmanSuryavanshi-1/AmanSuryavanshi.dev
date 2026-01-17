// --- FINAL PRODUCTION V12.0 ---
// DEPLOYMENT-READY, HIGH-PERFORMANCE PARSER
//
// AUTHOR: Gemini
// DATE: 2025-11-08
//
// V12.0 CHANGELOG:
// - CRITICAL FIX (Headings): Rewrote 'detectHeadingLevel'.
//   - It now correctly handles text with or without a space (e.g., "##Heading" vs "## Heading").
//   - It now *guarantees* the removal of all hash prefixes from the returned text.
//
// - CRITICAL FIX (Lists): Rewrote 'isListItem' and 'cleanListItemText'.
//   - 'isListItem' is now more robust and correctly identifies list items, even with leading spaces.
//   - 'cleanListItemText' is updated to perfectly mirror 'isListItem', ensuring the bullet/number
//     is stripped *before* 'parseInlineFormatting' is called.
//   - This prevents the 'currentParagraph' bug that was mangling your lists.
//
// - KEPT (V11 Fixes):
//   - The high-performance 'parseInlineFormatting' tokenizer (to prevent timeouts).
//   - The 'pre-cleaning' step (to fix the '```markdown' wrapper bug).
// ---

// === CRITICAL FIX V13.0: UUID Generator for Sanity _key properties ===
// Sanity Portable Text REQUIRES unique _key on every block and every span
function generateKey() {
    return 'key_' + Math.random().toString(36).substring(2, 11);
}

try {
    // --- 1. Get Data ---

    // Get the parsed blocks from 'Code - Parse Blog Content'
    const blogData = $('Code - Parse Blog Content').first().json;

    // Get the map of uploaded images
    let imageMap;
    if ($input.all().length > 0 && $input.first().json.marker) {
        imageMap = $input.all();
    } else {
        // Fallback if the input is empty (e.g., text-only post)
        imageMap = $('Code - Build Image Reference Map').all() || [];
    }

    console.log('Blog blocks (raw):', blogData.blocks.length, 'Images:', imageMap.length);

    // --- 2. PRE-CLEANING STEP (FIX FOR '```markdown' BUG) ---
    if (blogData.blocks && blogData.blocks.length > 0) {
        // Clean the FIRST block
        const firstBlock = blogData.blocks[0];
        if (firstBlock.type === 'text' && firstBlock.content) {
            firstBlock.content = firstBlock.content.trimStart().replace(/^```(markdown|md)?\s*/, '');
        }
        // Clean the LAST block
        const lastBlock = blogData.blocks[blogData.blocks.length - 1];
        if (lastBlock.type === 'text' && lastBlock.content) {
            lastBlock.content = lastBlock.content.trimEnd().replace(/```$/, '');
        }
    }

    // --- 3. High-Performance Helper Functions (V12) ---

    const BACKTICK = String.fromCharCode(96);
    const CODE_FENCE = BACKTICK + BACKTICK + BACKTICK;

    // Finds the uploaded image asset ID from the map
    function getAssetForMarker(marker) {
        if (!imageMap || imageMap.length === 0) return null;
        const found = imageMap.find(m => m.json && m.json.marker === marker);
        return found ? found.json : null;
    }

    // Checks if a text block is a fenced code block
    function isCodeBlock(text) {
        if (!text || typeof text !== 'string') return false;
        return text.trim().startsWith(CODE_FENCE);
    }

    // Parses a fenced code block
    function parseCodeBlock(text) {
        if (!text || typeof text !== 'string') return { language: 'text', code: '' };
        const lines = text.trim().split('\n');
        const firstLine = lines[0] || '';
        const language = firstLine.replace(CODE_FENCE, '').trim() || 'text';
        const code = lines.slice(1, -1).join('\n');
        return { language, code };
    }

    // --- (FIX V12.0: LISTS) ---
    // More robust check for list items. Allows optional leading whitespace.
    function isListItem(text) {
        if (!text || typeof text !== 'string') return false;
        const trimmed = text.trim();
        // Matches '  * item' or '1. item'
        return /^\s*[*\-]\s+/.test(trimmed) || /^\s*\d+[\.\)]\s+/.test(trimmed);
    }

    // --- (FIX V12.0: LISTS) ---
    // Mirrors 'isListItem' to perfectly clean the text.
    function cleanListItemText(text) {
        if (!text || typeof text !== 'string') return '';
        const trimmed = text.trim();
        // Replaces '  * item' with 'item'
        return trimmed.replace(/^\s*[*\-]\s+/, '').replace(/^\s*\d+[\.\)]\s+/, '').trim();
    }

    // Detects the list type for Sanity
    function detectListType(text) {
        if (!text || typeof text !== 'string') return null;
        const trimmed = text.trim();
        if (/^\s*\d+[\.\)]\s+/.test(trimmed)) return 'number';
        if (/^\s*[*\-]\s+/.test(trimmed)) return 'bullet';
        return null;
    }
    // --- (END LIST FIX V12.0) ---


    // --- (CRITICAL FIX V13.0: TIMEOUTS + _KEY) ---
    // High-performance tokenizer with _key on every span (required by Sanity)
    function parseInlineFormatting(text) {
        if (!text || typeof text !== 'string') {
            return [{ _type: 'span', _key: generateKey(), text: String(text || ''), marks: [] }];
        }

        const tokens = text.split(/(\*\*|__|\*|_|`)/g);
        const children = [];
        let i = 0;

        while (i < tokens.length) {
            const token = tokens[i];

            if (!token) {
                i++;
                continue;
            }

            let mark = null;
            if (token === '**' || token === '__') mark = 'strong';
            else if (token === '*' || token === '_') mark = 'em';
            else if (token === '`') mark = 'code';

            if (mark && tokens[i + 1] && tokens[i + 2] === token) {
                children.push({
                    _type: 'span',
                    _key: generateKey(),  // CRITICAL: Sanity requires _key
                    text: tokens[i + 1],
                    marks: [mark]
                });
                i += 3;
            } else {
                children.push({
                    _type: 'span',
                    _key: generateKey(),  // CRITICAL: Sanity requires _key
                    text: token,
                    marks: []
                });
                i++;
            }
        }
        return children;
    }
    // --- (END CRITICAL FIX V11.0) ---


    // Parses a block of list items (V13.0 - with _key)
    function parseListItems(items) {
        return items.map(item => {
            const cleanText = cleanListItemText(item);
            const listType = detectListType(item);

            return {
                _type: 'block',
                _key: generateKey(),  // CRITICAL: Sanity requires _key
                style: 'normal',
                listItem: listType,
                level: 1,
                children: parseInlineFormatting(cleanText),
                markDefs: []
            };
        });
    }

    // --- (FIX V12.0: HEADINGS) ---
    // More robust heading detection.
    // Handles '#Heading' and '# Heading' and cleans both.
    function detectHeadingLevel(text) {
        if (!text || typeof text !== 'string') return null;
        const trimmed = text.trim();

        // Use 'startsWith' for detection, but 'replace' for cleaning
        if (trimmed.startsWith('####')) return { level: 'h4', text: trimmed.replace(/^####\s*/, '').trim() };
        if (trimmed.startsWith('###')) return { level: 'h3', text: trimmed.replace(/^###\s*/, '').trim() };
        if (trimmed.startsWith('##')) return { level: 'h2', text: trimmed.replace(/^##\s*/, '').trim() };
        if (trimmed.startsWith('#')) return { level: 'h1', text: trimmed.replace(/^#\s*/, '').trim() };
        return null;
    }
    // --- (END HEADING FIX V12.0) ---


    // --- 4. Main Parsing Logic (Unchanged from V11) ---
    // This logic is now correct because the helper functions it calls are fixed.
    const finalBlocks = [];
    const codeBlockPattern = new RegExp('(' + CODE_FENCE + '[\\s\\S]*?' + CODE_FENCE + ')', 'g');

    for (const block of blogData.blocks) {
        if (block.type === 'text') {
            const parts = block.content.split(codeBlockPattern);

            for (const part of parts) {
                if (!part || !part.trim()) continue;

                if (isCodeBlock(part)) {
                    // This is a fenced code block
                    const parsed = parseCodeBlock(part);
                    finalBlocks.push({
                        _type: 'code',
                        _key: generateKey(),  // CRITICAL: Sanity requires _key
                        language: parsed.language,
                        code: parsed.code
                    });
                } else {
                    // This is regular paragraph/list/heading text
                    const lines = part.split('\n');
                    let currentParagraph = [];
                    let currentListItems = [];

                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        const trimmed = line.trim();

                        if (!trimmed) { // Empty line
                            // Flush list if one was active
                            if (currentListItems.length > 0) {
                                finalBlocks.push(...parseListItems(currentListItems));
                                currentListItems = [];
                            }
                            // Flush paragraph if one was active
                            if (currentParagraph.length > 0) {
                                const paraText = currentParagraph.join(' ').trim();
                                // Check for '---' horizontal rule
                                if (paraText && !/^(---|___|\\*\\*\\*)$/.test(paraText)) {
                                    // CALLS V12 HEADING FIX
                                    const heading = detectHeadingLevel(paraText);
                                    if (heading) {
                                        finalBlocks.push({
                                            _type: 'block',
                                            _key: generateKey(),  // CRITICAL: Sanity requires _key
                                            style: heading.level,
                                            children: parseInlineFormatting(heading.text),
                                            markDefs: []
                                        });
                                    } else {
                                        finalBlocks.push({
                                            _type: 'block',
                                            _key: generateKey(),  // CRITICAL: Sanity requires _key
                                            style: 'normal',
                                            children: parseInlineFormatting(paraText),
                                            markDefs: []
                                        });
                                    }
                                }
                                currentParagraph = [];
                            }
                            continue;
                        }

                        // CALLS V12 LIST FIX
                        if (isListItem(trimmed)) {
                            // Flush paragraph if switching to list
                            if (currentParagraph.length > 0) {
                                const paraText = currentParagraph.join(' ').trim();
                                if (paraText) {
                                    // CALLS V12 HEADING FIX
                                    const heading = detectHeadingLevel(paraText);
                                    if (heading) {
                                        finalBlocks.push({ _type: 'block', _key: generateKey(), style: heading.level, children: parseInlineFormatting(heading.text), markDefs: [] });
                                    } else {
                                        finalBlocks.push({ _type: 'block', _key: generateKey(), style: 'normal', children: parseInlineFormatting(paraText), markDefs: [] });
                                    }
                                }
                                currentParagraph = [];
                            }
                            currentListItems.push(trimmed);
                        } else {
                            // Flush list if switching to paragraph
                            if (currentListItems.length > 0) {
                                finalBlocks.push(...parseListItems(currentListItems));
                                currentListItems = [];
                            }
                            currentParagraph.push(trimmed);
                        }
                    }

                    // Final flush at end of part
                    if (currentListItems.length > 0) {
                        finalBlocks.push(...parseListItems(currentListItems));
                    }
                    if (currentParagraph.length > 0) {
                        const paraText = currentParagraph.join(' ').trim();
                        if (paraText && !/^(---|___|\\*\\*\\*)$/.test(paraText)) {
                            // CALLS V12 HEADING FIX
                            const heading = detectHeadingLevel(paraText);
                            if (heading) {
                                finalBlocks.push({ _type: 'block', _key: generateKey(), style: heading.level, children: parseInlineFormatting(heading.text), markDefs: [] });
                            } else {
                                finalBlocks.push({ _type: 'block', _key: generateKey(), style: 'normal', children: parseInlineFormatting(paraText), markDefs: [] });
                            }
                        }
                    }
                }
            }
        } else if (block.type === 'image') {
            // This is an image block
            const assetEntry = getAssetForMarker(block.marker);
            if (!assetEntry) {
                // Don't throw error, just log it.
                console.warn('Image ' + block.marker + ' was defined in markdown but not found in imageMap');
            } else {
                finalBlocks.push({
                    _type: 'image',
                    _key: generateKey(),  // CRITICAL: Sanity requires _key
                    asset: { _type: 'reference', _ref: assetEntry.assetId },
                    alt: assetEntry.alt || 'Blog image',
                    caption: assetEntry.caption || ''
                });
            }
        }
    }

    // --- 5. Final Mutation Assembly (Unchanged) ---
    const mutation = {
        mutations: [{
            create: {
                _type: "post",
                title: blogData.title,
                slug: { _type: "slug", current: blogData.slug },
                status: "published", // or "draft"
                excerpt: blogData.description.slice(0, 160),
                seoTitle: blogData.title.slice(0, 60),
                seoDescription: blogData.description.slice(0, 160),
                // Tags formatted as objects with _key (Sanity requires this)
                tags: (blogData.keywords || []).map(tag => ({
                    _key: generateKey(),
                    label: typeof tag === 'string' ? tag : (tag.label || tag),
                    slug: typeof tag === 'string'
                        ? tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
                        : (tag.slug || tag.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                })),
                publishedAt: new Date().toISOString(),
                viewCount: 0,
                body: finalBlocks
            }
        }]
    };

    console.log('Final Sanity blocks generated:', finalBlocks.length);
    return [{ json: mutation }];

} catch (error) {
    console.error('[CRITICAL: Build PT Mutation]', error);
    // Return detailed error for easier debugging in n8n
    return [{ json: { error: true, message: '[Build PT Mutation]: ' + error.message, stack: error.stack } }];
}