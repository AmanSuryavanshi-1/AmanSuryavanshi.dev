// ════════════════════════════════════════════════════════════════════════════
// ROBUST BLOG PARSER V16.0 (AGGREGATE DATA FIX - PRODUCTION READY)
// Parses Blog draft from Notion → Prepares for Sanity CMS API
// CRITICAL FIX: Handles Aggregate { json: { data: [...] } } structure
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. GET DATA FROM CORRECT SOURCE (Part 2 workflow uses 'Set - All Data Ready')
    // ═══════════════════════════════════════════════════════════════════════════

    const masterData = $('Set - All Data Ready').first().json;
    const markdownText = masterData.blogDraft;

    if (!markdownText || markdownText.length < 100) {
        console.log('⏭️ Blog draft is empty or too short, skipping.');
        return [{
            json: {
                platform: 'blog',
                skipped: true,
                success: true,
                message: 'Blog draft is empty or too short'
            }
        }];
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. GET IMAGE BINARIES - MULTI-SOURCE FALLBACK CHAIN
    // Priority: Loop to Download Images (has binaries) → Aggregate metadata → Organize Images
    // ═══════════════════════════════════════════════════════════════════════════

    let allCachedImages = [];
    let imageSource = 'none';
    let aggregateMetadata = []; // Store metadata from Aggregate for reference

    // FIRST: Try to get metadata from Aggregate node (most reliable for metadata)
    try {
        const aggregateItems = $('Aggregate').all() || [];
        console.log(`📦 [Metadata] Aggregate node returned ${aggregateItems.length} item(s)`);

        if (aggregateItems.length > 0) {
            for (const aggItem of aggregateItems) {
                // Handle aggregateAllItemData output: { json: { data: [...] } }
                if (aggItem.json && aggItem.json.data && Array.isArray(aggItem.json.data)) {
                    console.log(`   → Found nested data array with ${aggItem.json.data.length} items`);
                    aggregateMetadata = aggItem.json.data;
                }
                // Handle case where Aggregate has direct items with binaries
                else if (aggItem.binary && Object.keys(aggItem.binary).length > 0) {
                    allCachedImages.push(aggItem);
                }
                // Handle case where aggItem.json is directly an array
                else if (aggItem.json && Array.isArray(aggItem.json)) {
                    for (const subItem of aggItem.json) {
                        if (subItem.binary && Object.keys(subItem.binary).length > 0) {
                            allCachedImages.push(subItem);
                        } else {
                            // Store as metadata even without binary
                            aggregateMetadata.push(subItem);
                        }
                    }
                }
            }

            if (allCachedImages.length > 0) {
                imageSource = 'Aggregate node (with binaries)';
                console.log(`✅ Found ${allCachedImages.length} images with binaries from Aggregate`);
            } else if (aggregateMetadata.length > 0) {
                console.log(`📋 Found ${aggregateMetadata.length} metadata entries from Aggregate (no binaries yet)`);
            }
        }
    } catch (e) {
        console.log('ℹ️ Aggregate node not accessible:', e.message);
    }

    // SOURCE 1: Loop to Download Images (SplitInBatches - has the actual binaries!)
    if (allCachedImages.length === 0) {
        try {
            const loopItems = $('Loop to Download Images').all() || [];
            console.log(`📦 [Source 1] Loop to Download Images returned ${loopItems.length} item(s)`);

            if (loopItems.length > 0) {
                // Filter to only items with binaries
                allCachedImages = loopItems.filter(item =>
                    item.binary && Object.keys(item.binary).length > 0
                );
                if (allCachedImages.length > 0) {
                    imageSource = 'Loop to Download Images';
                    console.log(`✅ Found ${allCachedImages.length} images with binaries from Loop node`);
                }
            }
        } catch (e) {
            console.log('⚠️ Loop to Download Images not accessible:', e.message);
        }
    }

    // SOURCE 2: Download Image Binary (fallback - will only have last item)
    if (allCachedImages.length === 0) {
        try {
            const downloadedItems = $('Download Image Binary').all() || [];
            console.log(`📦 [Source 2] Download Image Binary returned ${downloadedItems.length} item(s)`);

            if (downloadedItems.length > 0) {
                allCachedImages = downloadedItems.filter(item =>
                    item.binary && Object.keys(item.binary).length > 0
                );
                if (allCachedImages.length > 0) {
                    imageSource = 'Download Image Binary (fallback)';
                    console.log(`⚠️ Fallback: ${allCachedImages.length} images from Download node`);
                }
            }
        } catch (e2) {
            console.log('⚠️ Download Image Binary not accessible:', e2.message);
        }
    }

    // FALLBACK: Use Aggregate metadata or try Organize Images
    let availableImagesMetadata = aggregateMetadata.length > 0 ? aggregateMetadata : [];
    if (allCachedImages.length === 0 && availableImagesMetadata.length === 0) {
        try {
            const organizeData = $('Organize Images').first().json;
            availableImagesMetadata = organizeData.availableImages || [];
            if (availableImagesMetadata.length > 0) {
                imageSource = 'Organize Images metadata (no binaries)';
                console.log(`📋 Found ${availableImagesMetadata.length} image metadata entries from Organize Images`);
            }
        } catch (e) {
            console.log('ℹ️ Organize Images not accessible:', e.message);
        }
    }

    if (allCachedImages.length === 0 && availableImagesMetadata.length === 0) {
        imageSource = 'none (text-only post)';
        console.log('ℹ️ No images available, proceeding with text-only content');
    }

    console.log(`📂 Image source: ${imageSource}`);

    // Log available images for debugging
    if (allCachedImages.length > 0) {
        allCachedImages.forEach((img, i) => {
            const fileName = img.json?.fileName || img.json?.name || 'unknown';
            const hasBinary = !!img.binary;
            console.log(`   [${i}] ${fileName} - Binary: ${hasBinary}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. GET SEO FIELDS FROM NOTION (using correct property_shared_* naming)
    // ═══════════════════════════════════════════════════════════════════════════

    const notionItem = masterData.notionItem || {};

    // SEO Title - fallback chain
    const title = notionItem.property_shared_seo_title ||
        notionItem.name ||
        'Untitled Post';

    // Slug - REQUIRED for Sanity
    const slug = notionItem.property_shared_slug || '';
    if (!slug) {
        throw new Error('Shared_Slug property is missing. Please ensure the Notion item has a property_shared_slug value.');
    }

    // Description
    const description = notionItem.property_shared_seo_description || '';

    // Tags/Keywords - property_shared_tags is an ARRAY, not a string
    const tagsArray = notionItem.property_shared_tags || [];
    const keywords = Array.isArray(tagsArray) ? tagsArray : [];

    // NEW SEO FIELDS (Part 2)
    const focusKeyword = notionItem.property_shared_focus_keyword || '';
    const articleType = notionItem.property_shared_article_type || 'tutorial';
    const quotableSnippet = notionItem.property_shared_quotable_snippet || '';
    const contentSummary = notionItem.property_shared_content_summary || '';

    // Parse JSON fields (FAQ and Key Takeaways)
    let faqItems = [];
    try {
        if (notionItem.property_shared_faq_json) {
            faqItems = JSON.parse(notionItem.property_shared_faq_json);
        }
    } catch (e) {
        console.warn('Failed to parse FAQ JSON:', e.message);
    }

    let keyTakeaways = [];
    try {
        if (notionItem.property_shared_key_takeaways) {
            keyTakeaways = JSON.parse(notionItem.property_shared_key_takeaways);
        }
    } catch (e) {
        console.warn('Failed to parse Key Takeaways JSON:', e.message);
    }

    console.log(`📋 SEO: title="${title.slice(0, 50)}...", slug="${slug}"`);

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. SPLIT MARKDOWN INTO BLOCKS (text + image tags)
    // ═══════════════════════════════════════════════════════════════════════════

    const blockPattern = /<<IMAGE_(\d+)>>/g;
    let lastIdx = 0;
    let match;
    let blocks = [];

    while ((match = blockPattern.exec(markdownText)) !== null) {
        // Text before this image tag
        if (match.index > lastIdx) {
            blocks.push({ type: 'text', content: markdownText.slice(lastIdx, match.index) });
        }
        // Image block for this marker
        blocks.push({ type: 'image', imageNumber: parseInt(match[1]), marker: match[0] });
        lastIdx = blockPattern.lastIndex;
    }

    // Any trailing text after last marker
    if (lastIdx < markdownText.length) {
        blocks.push({ type: 'text', content: markdownText.slice(lastIdx) });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. PROCESS BLOCKS - Attach binaries directly from cached images
    // ═══════════════════════════════════════════════════════════════════════════

    let outputBlocks = [];
    let imageMarkers = [];
    let textBlockCount = 0;

    // Helper function to extract asset number from filename
    const extractAssetNumber = (fileName) => {
        if (!fileName) return null;
        const patterns = [
            /asset[-_]?(\d+)/i,
            /^(\d+)[-_.]/,
            /[-_](\d+)[-_.]/
        ];
        for (const pattern of patterns) {
            const match = fileName.match(pattern);
            if (match) return parseInt(match[1], 10);
        }
        return null;
    };

    blocks.forEach(block => {
        if (block.type === 'text') {
            // Only push non-empty blocks
            if (block.content && block.content.trim().length > 0) {
                outputBlocks.push({ type: 'text', content: block.content.trim() });
                textBlockCount++;
            }
        } else if (block.type === 'image') {
            // CRITICAL: Find the matching image with binary data from allCachedImages
            const targetImage = allCachedImages.find(img => {
                const fileName = img.json?.fileName || img.json?.name || '';

                // Method 1: Check assetNumber in json
                if (img.json?.assetNumber === block.imageNumber) return true;

                // Method 2: Extract from fileName
                const extractedNum = extractAssetNumber(fileName);
                if (extractedNum === block.imageNumber) return true;

                // Method 3: Pattern match
                const pattern = new RegExp(`asset[-_]?${block.imageNumber}([_\\.-]|$)`, 'i');
                return pattern.test(fileName);
            });

            if (targetImage && targetImage.binary) {
                // Image found with binary - attach it directly
                outputBlocks.push({
                    type: 'image',
                    marker: block.marker,
                    imageNumber: block.imageNumber,
                    fileName: targetImage.json?.fileName || `asset-${block.imageNumber}`,
                    binary: targetImage.binary // CRITICAL: Attach binary directly
                });
                imageMarkers.push(block.imageNumber);
                console.log(`✅ Image ${block.imageNumber}: Binary attached from ${targetImage.json?.fileName || 'cache'}`);
            } else if (availableImagesMetadata.length > 0) {
                // Fallback: Try metadata-only match (for Prepare Image node to attach binaries later)
                const metaImage = availableImagesMetadata.find(img => {
                    if (img.assetNumber === block.imageNumber) return true;
                    const fileName = img.fileName || '';
                    const pattern = new RegExp(`asset[-_]?${block.imageNumber}([_\\.-]|$)`, 'i');
                    return pattern.test(fileName);
                });

                if (metaImage) {
                    outputBlocks.push({
                        type: 'image',
                        marker: block.marker,
                        imageNumber: block.imageNumber,
                        fileId: metaImage.fileId,
                        fileName: metaImage.fileName,
                        needsBinary: true // Flag for Prepare Image node
                    });
                    imageMarkers.push(block.imageNumber);
                    console.log(`⚠️ Image ${block.imageNumber}: Metadata only, binary needed later`);
                } else {
                    console.warn(`⚠️ No data for image ${block.imageNumber}, using placeholder`);
                    outputBlocks.push({
                        type: 'text',
                        content: `[Image ${block.imageNumber} pending]`
                    });
                }
            } else {
                // No image data at all - use placeholder
                console.warn(`⚠️ Image ${block.imageNumber} not found, using placeholder`);
                outputBlocks.push({
                    type: 'text',
                    content: `[Image ${block.imageNumber} pending]`
                });
            }
        }
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. OUTPUT WITH VALIDATION INFO
    // ═══════════════════════════════════════════════════════════════════════════

    const result = {
        json: {
            title,
            slug,
            description,
            keywords,
            focusKeyword,
            articleType,
            quotableSnippet,
            contentSummary,
            faqItems,
            keyTakeaways,
            blocks: outputBlocks,
            success: true,
            platform: 'blog',
            imageStats: {
                source: imageSource,
                cachedImages: allCachedImages.length,
                metadataImages: availableImagesMetadata.length,
                imagesInContent: imageMarkers.length,
                textBlocks: textBlockCount
            },
            // Pass image list for downstream nodes
            imagesToProcess: imageMarkers.map(num => {
                const cached = allCachedImages.find(a => {
                    const fileName = a.json?.fileName || '';
                    return fileName.includes(`asset-${num}`) ||
                        fileName.includes(`asset_${num}`) ||
                        a.json?.assetNumber === num;
                });
                if (cached) {
                    return {
                        assetNumber: num,
                        fileName: cached.json?.fileName,
                        hasBinary: !!cached.binary
                    };
                }
                return { assetNumber: num, fileId: null, fileName: `asset-${num}.png`, hasBinary: false };
            })
        }
    };

    console.log(`✅ Blog Parser V15.0: ${outputBlocks.length} blocks (${textBlockCount} text, ${imageMarkers.length} images)`);

    return [result];

} catch (error) {
    console.error('❌ Blog Parse Error:', error.message);
    return [{
        json: {
            platform: 'blog',
            error: true,
            skipped: false,
            message: `[Blog Parse V15.0]: ${error.message}`
        }
    }];
}
