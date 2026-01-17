// ════════════════════════════════════════════════════════════════════════════
// LINKEDIN CONTENT PARSER V5.0 (Part 2 Compatible - ROBUST IMAGE ACCESS)
// Parses LinkedIn draft from Notion → Prepares for LinkedIn API
// FIXED: Uses $('Loop to Download Images').all() to access ALL downloaded binaries
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
    // 2. GET IMAGE BINARIES FROM CORRECT SOURCE
    // CRITICAL FIX: $('Download Image Binary').all() only returns LAST item!
    // We MUST use $('Loop to Download Images').all() to get ALL images
    // ═══════════════════════════════════════════════════════════════════════════

    let allCachedImages = [];

    // PRIMARY: Use Loop to Download Images (SplitInBatches node stores ALL items)
    try {
        allCachedImages = $('Loop to Download Images').all() || [];
        console.log(`📸 Found ${allCachedImages.length} images from Loop to Download Images`);
    } catch (e) {
        // FALLBACK: Try Download Image Binary (will only have last item)
        try {
            allCachedImages = $('Download Image Binary').all() || [];
            console.log(`⚠️ Fallback: ${allCachedImages.length} images from Download Image Binary`);
        } catch (e2) {
            console.log('⚠️ No image cache available');
        }
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
        // 7. FIND BINARY FOR IMAGE (ROBUST - graceful if missing)
        // ═══════════════════════════════════════════════════════════════════════

        let firstBinaryData = null;
        if (markersInBlock.length > 0 && allCachedImages.length > 0) {
            const num = markersInBlock[0]; // LinkedIn only supports 1 image
            const targetImage = allCachedImages.find(img => {
                const fileName = img.json?.fileName || '';
                const pattern = new RegExp(`asset[-_]?${num}([_\\.-]|$)`, 'i');
                return pattern.test(fileName);
            });

            if (targetImage?.binary) {
                const binaryKey = Object.keys(targetImage.binary)[0];
                firstBinaryData = targetImage.binary[binaryKey];
                console.log(`✅ Attached image asset-${num} to LinkedIn post ${index + 1}`);
            } else {
                console.warn(`⚠️ Image asset-${num} not found for LinkedIn post ${index + 1}`);
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

    console.log(`✅ LinkedIn Parser: Generated ${postsToExecute.length} post(s)`);
    return postsToExecute;

} catch (error) {
    console.error('❌ LinkedIn Parse Error:', error.message);
    return [{
        json: {
            platform: 'linkedin',
            error: true,
            skipped: false,
            message: `[LinkedIn Parse]: ${error.message}`
        }
    }];
}
