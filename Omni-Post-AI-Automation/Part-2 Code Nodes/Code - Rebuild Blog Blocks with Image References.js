// ════════════════════════════════════════════════════════════════════════════
// FINAL PRODUCTION V14.0 - DEPLOYMENT-READY, HIGH-PERFORMANCE PARSER
// Builds Sanity Portable Text mutation from parsed blog blocks
// FIXED: Defensive null checks + robust imageMap fallback
// ════════════════════════════════════════════════════════════════════════════

// === UUID Generator for Sanity _key properties ===
// Sanity Portable Text REQUIRES unique _key on every block and every span
function generateKey() {
    return 'key_' + Math.random().toString(36).substring(2, 11);
}

try {
    // --- 1. Get Data ---

    // Get the parsed blocks from 'Code - Parse Blog Content'
    const blogData = $('Code - Parse Blog Content').first().json;

    // Validate blogData exists
    if (!blogData || !blogData.blocks) {
        throw new Error('No parsed blog data found. Ensure Code - Parse Blog Content ran successfully.');
    }

    // Get the map of uploaded images with multiple fallback sources
    let imageMap = [];

    // SOURCE 1: Try direct input (from Loop Over Images done output)
    if ($input.all().length > 0 && $input.first().json.marker) {
        imageMap = $input.all();
        console.log(`📸 Image map from direct input: ${imageMap.length} items`);
    }

    // SOURCE 2: Fallback to Code - Build Image Reference Map node
    if (imageMap.length === 0) {
        try {
            imageMap = $('Code - Build Image Reference Map').all() || [];
            console.log(`📸 Image map from Build Image Reference Map: ${imageMap.length} items`);
        } catch (e) {
            console.log('ℹ️ Code - Build Image Reference Map not accessible:', e.message);
        }
    }

    // SOURCE 3: If still empty, check for noImages flag (text-only post)
    if (imageMap.length === 0) {
        const firstInput = $input.first()?.json || {};
        if (firstInput.noImages === true || firstInput.skipped === true) {
            console.log('ℹ️ Text-only post - no images to map');
        } else {
            console.warn('⚠️ No image map available - images in content will be skipped');
        }
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

    // --- 3. High-Performance Helper Functions ---

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

    // More robust check for list items
    function isListItem(text) {
        if (!text || typeof text !== 'string') return false;
        const trimmed = text.trim();
        return /^\s*[*\-]\s+/.test(trimmed) || /^\s*\d+[\.\\)]\s+/.test(trimmed);
    }

    // Cleans list item text
    function cleanListItemText(text) {
        if (!text || typeof text !== 'string') return '';
        const trimmed = text.trim();
        return trimmed.replace(/^\s*[*\-]\s+/, '').replace(/^\s*\d+[\.\\)]\s+/, '').trim();
    }

    // Detects the list type for Sanity
    function detectListType(text) {
        if (!text || typeof text !== 'string') return null;
        const trimmed = text.trim();
        if (/^\s*\d+[\.\\)]\s+/.test(trimmed)) return 'number';
        if (/^\s*[*\-]\s+/.test(trimmed)) return 'bullet';
        return null;
    }

    // High-performance tokenizer with _key on every span
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
                    _key: generateKey(),
                    text: tokens[i + 1],
                    marks: [mark]
                });
                i += 3;
            } else {
                children.push({
                    _type: 'span',
                    _key: generateKey(),
                    text: token,
                    marks: []
                });
                i++;
            }
        }
        return children;
    }

    // Parses a block of list items
    function parseListItems(items) {
        return items.map(item => {
            const cleanText = cleanListItemText(item);
            const listType = detectListType(item);

            return {
                _type: 'block',
                _key: generateKey(),
                style: 'normal',
                listItem: listType,
                level: 1,
                children: parseInlineFormatting(cleanText),
                markDefs: []
            };
        });
    }

    // More robust heading detection
    function detectHeadingLevel(text) {
        if (!text || typeof text !== 'string') return null;
        const trimmed = text.trim();

        if (trimmed.startsWith('####')) return { level: 'h4', text: trimmed.replace(/^####\s*/, '').trim() };
        if (trimmed.startsWith('###')) return { level: 'h3', text: trimmed.replace(/^###\s*/, '').trim() };
        if (trimmed.startsWith('##')) return { level: 'h2', text: trimmed.replace(/^##\s*/, '').trim() };
        if (trimmed.startsWith('#')) return { level: 'h1', text: trimmed.replace(/^#\s*/, '').trim() };
        return null;
    }

    // --- 4. Main Parsing Logic ---
    const finalBlocks = [];
    const codeBlockPattern = new RegExp('(' + CODE_FENCE + '[\\s\\S]*?' + CODE_FENCE + ')', 'g');

    for (const block of blogData.blocks) {
        if (block.type === 'text') {
            const parts = block.content.split(codeBlockPattern);

            for (const part of parts) {
                if (!part || !part.trim()) continue;

                if (isCodeBlock(part)) {
                    const parsed = parseCodeBlock(part);
                    finalBlocks.push({
                        _type: 'code',
                        _key: generateKey(),
                        language: parsed.language,
                        code: parsed.code
                    });
                } else {
                    const lines = part.split('\n');
                    let currentParagraph = [];
                    let currentListItems = [];

                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        const trimmed = line.trim();

                        if (!trimmed) {
                            if (currentListItems.length > 0) {
                                finalBlocks.push(...parseListItems(currentListItems));
                                currentListItems = [];
                            }
                            if (currentParagraph.length > 0) {
                                const paraText = currentParagraph.join(' ').trim();
                                if (paraText && !/^(---|___|\*\*\*)$/.test(paraText)) {
                                    const heading = detectHeadingLevel(paraText);
                                    if (heading) {
                                        finalBlocks.push({
                                            _type: 'block',
                                            _key: generateKey(),
                                            style: heading.level,
                                            children: parseInlineFormatting(heading.text),
                                            markDefs: []
                                        });
                                    } else {
                                        finalBlocks.push({
                                            _type: 'block',
                                            _key: generateKey(),
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

                        if (isListItem(trimmed)) {
                            if (currentParagraph.length > 0) {
                                const paraText = currentParagraph.join(' ').trim();
                                if (paraText) {
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
                            if (currentListItems.length > 0) {
                                finalBlocks.push(...parseListItems(currentListItems));
                                currentListItems = [];
                            }
                            currentParagraph.push(trimmed);
                        }
                    }

                    // Final flush
                    if (currentListItems.length > 0) {
                        finalBlocks.push(...parseListItems(currentListItems));
                    }
                    if (currentParagraph.length > 0) {
                        const paraText = currentParagraph.join(' ').trim();
                        if (paraText && !/^(---|___|\*\*\*)$/.test(paraText)) {
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
            const assetEntry = getAssetForMarker(block.marker);
            if (!assetEntry) {
                console.warn('⚠️ Image ' + block.marker + ' was defined in markdown but not found in imageMap');
            } else {
                finalBlocks.push({
                    _type: 'image',
                    _key: generateKey(),
                    asset: { _type: 'reference', _ref: assetEntry.assetId },
                    alt: assetEntry.alt || 'Blog image',
                    caption: assetEntry.caption || ''
                });
            }
        }
    }

    // --- 5. Final Mutation Assembly ---
    const mutation = {
        mutations: [{
            create: {
                _type: "post",
                title: blogData.title,
                slug: { _type: "slug", current: blogData.slug },
                status: "published",
                excerpt: (blogData.description || '').slice(0, 160),
                seoTitle: (blogData.title || '').slice(0, 60),
                seoDescription: (blogData.description || '').slice(0, 160),
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

    console.log(`✅ Rebuild Blog Blocks V14.0: ${finalBlocks.length} blocks generated`);
    return [{ json: mutation }];

} catch (error) {
    console.error('[CRITICAL: Build PT Mutation]', error);
    return [{ json: { error: true, message: '[Build PT Mutation V14.0]: ' + error.message, stack: error.stack } }];
}