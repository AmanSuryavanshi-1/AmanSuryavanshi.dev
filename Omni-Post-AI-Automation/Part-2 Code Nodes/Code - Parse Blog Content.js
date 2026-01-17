// ════════════════════════════════════════════════════════════════════════════
// ROBUST BLOG PARSER V14.0 (DIRECT LOOP ACCESS - PRODUCTION READY)
// Parses Blog draft from Notion → Prepares for Sanity CMS API
// CRITICAL FIX: Accesses image binaries directly from $('Loop to Download Images').all()
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
    // 2. GET IMAGE BINARIES DIRECTLY FROM LOOP
    // CRITICAL: This is the pattern that works - access $('Loop to Download Images').all()
    // The SplitInBatches node stores ALL processed items, not just the last one
    // ═══════════════════════════════════════════════════════════════════════════

    let allCachedImages = [];
    let imageSource = 'none';

    // PRIMARY: Use Loop to Download Images (SplitInBatches stores ALL items)
    try {
        allCachedImages = $('Loop to Download Images').all() || [];
        if (allCachedImages.length > 0) {
            imageSource = 'Loop to Download Images';
            console.log(`📸 Found ${allCachedImages.length} images from Loop to Download Images`);

            // Log available images for debugging
            allCachedImages.forEach((img, i) => {
                const fileName = img.json?.fileName || img.json?.name || 'unknown';
                const hasBinary = !!img.binary;
                console.log(`   [${i}] ${fileName} - Binary: ${hasBinary}`);
            });
        }
    } catch (e) {
        console.log('⚠️ Loop to Download Images not accessible:', e.message);
    }

    // FALLBACK: Try Download Image Binary (will only have last item - not ideal)
    if (allCachedImages.length === 0) {
        try {
            allCachedImages = $('Download Image Binary').all() || [];
            if (allCachedImages.length > 0) {
                imageSource = 'Download Image Binary (fallback)';
                console.log(`⚠️ Fallback: ${allCachedImages.length} images from Download Image Binary`);
            }
        } catch (e2) {
            console.log('⚠️ Download Image Binary not accessible');
        }
    }

    // FALLBACK: Try to get metadata from Organize Images (no binaries)
    let availableImagesMetadata = [];
    if (allCachedImages.length === 0) {
        try {
            const organizeData = $('Organize Images').first().json;
            availableImagesMetadata = organizeData.availableImages || [];
            if (availableImagesMetadata.length > 0) {
                imageSource = 'Organize Images metadata (no binaries)';
                console.log(`📋 Found ${availableImagesMetadata.length} image metadata entries (no binaries)`);
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
    // This is the KEY fix - we attach binaries here, not in a separate node
    // ═══════════════════════════════════════════════════════════════════════════

    let outputBlocks = [];
    let imageMarkers = [];
    let textBlockCount = 0;

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
                    return fileName.includes(`asset-${num}`) || fileName.includes(`asset_${num}`);
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

    console.log(`✅ Blog Parser V14.0: ${outputBlocks.length} blocks (${textBlockCount} text, ${imageMarkers.length} images)`);

    return [result];

} catch (error) {
    console.error('❌ Blog Parse Error:', error.message);
    return [{
        json: {
            platform: 'blog',
            error: true,
            skipped: false,
            message: `[Blog Parse V14.0]: ${error.message}`
        }
    }];
}

