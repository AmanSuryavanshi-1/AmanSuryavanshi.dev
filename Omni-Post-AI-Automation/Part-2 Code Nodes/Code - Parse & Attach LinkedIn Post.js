// ════════════════════════════════════════════════════════════════════════════
// LINKEDIN CONTENT PARSER V6.0 (ROBUST IMAGE ACCESS - PRODUCTION READY)
// Parses LinkedIn draft from Notion → Prepares for LinkedIn API
// CRITICAL FIX: Filters for items with binaries + improved matching strategies
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. GET DATA FROM CORRECT SOURCE
    // ═══════════════════════════════════════════════════════════════════════════

    const masterData = $('Set - All Data Ready').first().json;
    let linkedinDraft = masterData.linkedinDraft;

    if (!linkedinDraft || linkedinDraft.length < 20) {
        console.log('⏭️ LinkedIn draft is empty or too short, skipping.');
        return [{
            json: {
                platform: 'linkedin',
                skipped: true,
                success: true,
                message: 'LinkedIn draft is empty or too short'
            }
        }];
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. GET IMAGE BINARIES - MULTI-SOURCE FALLBACK CHAIN
    // Priority: Loop to Download Images → Download Image Binary
    // CRITICAL: Must filter for items that actually have binary data!
    // ═══════════════════════════════════════════════════════════════════════════

    let allCachedImages = [];
    let imageSource = 'none';

    // SOURCE 1: Loop to Download Images (SplitInBatches - has the actual binaries!)
    try {
        const loopItems = $('Loop to Download Images').all() || [];
        console.log(`📦 [Source 1] Loop to Download Images returned ${loopItems.length} item(s)`);

        if (loopItems.length > 0) {
            // CRITICAL: Filter to only items with actual binary data
            allCachedImages = loopItems.filter(item =>
                item.binary && Object.keys(item.binary).length > 0
            );
            if (allCachedImages.length > 0) {
                imageSource = 'Loop to Download Images';
                console.log(`✅ Found ${allCachedImages.length} images with binaries from Loop`);
            } else {
                console.log(`⚠️ Loop had ${loopItems.length} items but none with binaries`);
            }
        }
    } catch (e) {
        console.log('ℹ️ Loop to Download Images not accessible:', e.message);
    }

    // SOURCE 2: Download Image Binary (fallback - only has last item)
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

    console.log(`📂 Image source: ${imageSource}`);

    // Log available images for debugging
    if (allCachedImages.length > 0) {
        allCachedImages.forEach((img, i) => {
            const fileName = img.json?.fileName || img.json?.name || 'unknown';
            const assetNum = img.json?.assetNumber || 'N/A';
            console.log(`   [${i}] assetNumber=${assetNum}, fileName=${fileName}`);
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. CLEAN CONTENT
    // ═══════════════════════════════════════════════════════════════════════════

    // Handle escaped newlines
    linkedinDraft = linkedinDraft
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .trim();

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. SPLIT INTO POSTS (if multiple posts separated by ---)
    // ═══════════════════════════════════════════════════════════════════════════

    const postBlocks = linkedinDraft
        .split(/\n-{3,}\n/)
        .map(block => block.trim())
        .filter(block => block.length > 20);

    if (postBlocks.length === 0) {
        // If no separator, treat entire draft as single post
        postBlocks.push(linkedinDraft.trim());
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. PROCESS EACH POST
    // ═══════════════════════════════════════════════════════════════════════════

    const postsToExecute = postBlocks.map((block, index) => {
        // Find image markers in this block
        const markersInBlock = Array.from(
            block.matchAll(/<<IMAGE_(\d+)>>/g),
            m => parseInt(m[1])
        );

        // Clean the text
        let cleanText = block
            .replace(/<<IMAGE_\d+>>/g, '')  // Remove image markers
            .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold markdown
            .replace(/\*(.*?)\*/g, '$1')      // Remove italic markdown
            .replace(/^#{1,6}\s+(.*)/gm, '$1') // Remove heading markers
            .replace(/^\s*[-*+]\s+(.*)/gm, '• $1') // Convert bullets
            .trim();

        // Normalize newlines
        cleanText = cleanText
            .replace(/\n{4,}/g, '\n\n\n')
            .replace(/\n{3}/g, '\n\n')
            .trim();

        // ═══════════════════════════════════════════════════════════════════════
        // 6. CHARACTER LIMIT ENFORCEMENT (2800 max for LinkedIn)
        // ═══════════════════════════════════════════════════════════════════════

        const MAX_CHARS = 2800;
        if (cleanText.length > MAX_CHARS) {
            cleanText = cleanText.substring(0, MAX_CHARS - 50) +
                '\n\n[See full details in comments]';
            console.warn(`⚠️ LinkedIn post ${index + 1} truncated to ${MAX_CHARS} chars`);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 7. FIND BINARY FOR IMAGE (ROBUST - multiple matching strategies)
        // ═══════════════════════════════════════════════════════════════════════

        let firstBinaryData = null;
        if (markersInBlock.length > 0 && allCachedImages.length > 0) {
            const num = markersInBlock[0]; // LinkedIn only supports 1 image
            console.log(`🔍 Looking for asset-${num} in ${allCachedImages.length} cached images...`);

            // Try multiple matching strategies
            const targetImage = allCachedImages.find(img => {
                const fileName = img.json?.fileName || img.json?.name || '';

                // Strategy 1: Direct assetNumber match
                if (img.json?.assetNumber === num) {
                    console.log(`   ✓ Matched by assetNumber=${num}`);
                    return true;
                }

                // Strategy 2: Pattern match on fileName
                const pattern = new RegExp(`asset[-_]?${num}([_\\.-]|$)`, 'i');
                if (pattern.test(fileName)) {
                    console.log(`   ✓ Matched by fileName pattern: ${fileName}`);
                    return true;
                }

                // Strategy 3: Numeric extraction from fileName
                const numMatch = fileName.match(/asset[-_]?(\d+)/i);
                if (numMatch && parseInt(numMatch[1], 10) === num) {
                    console.log(`   ✓ Matched by extracted number: ${fileName}`);
                    return true;
                }

                return false;
            });

            if (targetImage?.binary) {
                const binaryKey = Object.keys(targetImage.binary)[0];
                firstBinaryData = targetImage.binary[binaryKey];
                console.log(`✅ Attached image asset-${num} to LinkedIn post ${index + 1}`);
            } else {
                console.warn(`⚠️ Image asset-${num} not found for LinkedIn post ${index + 1}`);
                console.warn(`   Available: ${allCachedImages.map(i => i.json?.fileName || 'unknown').join(', ')}`);
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 8. BUILD OUTPUT
        // ═══════════════════════════════════════════════════════════════════════

        const outputItem = {
            json: {
                order: index + 1,
                text: cleanText,
                charCount: cleanText.length,
                hasImage: !!firstBinaryData,
                platform: 'linkedin'
            }
        };

        if (firstBinaryData) {
            outputItem.binary = {
                linkedInImage: firstBinaryData
            };
        }

        return outputItem;
    });

    console.log(`✅ LinkedIn Parser V6.0: Generated ${postsToExecute.length} post(s)`);
    return postsToExecute;

} catch (error) {
    console.error('❌ LinkedIn Parse Error:', error.message);
    return [{
        json: {
            platform: 'linkedin',
            error: true,
            skipped: false,
            message: `[LinkedIn Parse V6.0]: ${error.message}`
        }
    }];
}
