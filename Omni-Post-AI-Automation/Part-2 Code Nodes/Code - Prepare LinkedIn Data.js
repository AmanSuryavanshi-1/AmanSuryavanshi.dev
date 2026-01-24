// ════════════════════════════════════════════════════════════════════════════
// LINKEDIN DATA PREP V7.0 (PRODUCTION - ROBUST BINARY PASSTHROUGH)
// Prepares final payload for LinkedIn API, preserves binary data
// ════════════════════════════════════════════════════════════════════════════

try {
    const inputItem = $input.first();
    const post = inputItem.json;

    // Validate input
    if (!post || !post.text) {
        console.log('⚠️ No valid LinkedIn post data received');
        return [{
            json: {
                error: true,
                platform: 'linkedin',
                message: 'No valid post data received'
            }
        }];
    }

    console.log(`📝 Preparing LinkedIn post: ${post.charCount || post.text.length} chars`);

    // Output structure for LinkedIn API
    const outputItem = {
        json: {
            text: post.text,
            visibility: "PUBLIC",
            hasImage: post.hasImage || false,
            platform: 'linkedin'
        }
    };

    // CRITICAL: Preserve binary data if it exists
    // The binary comes from the upstream parser node (Code - Parse & Attach LinkedIn Post)
    if (inputItem.binary && inputItem.binary.linkedInImage) {
        outputItem.binary = {
            linkedInImage: inputItem.binary.linkedInImage
        };
        console.log('✅ Binary data preserved for LinkedIn image upload');
    } else if (post.hasImage) {
        console.warn('⚠️ Post marked as having image but no binary found');
    } else {
        console.log('ℹ️ Text-only post (no image)');
    }

    return [outputItem];

} catch (error) {
    console.error('❌ Prepare LinkedIn Data Error:', error.message);
    return [{
        json: {
            error: true,
            platform: 'linkedin',
            message: `[Prepare LinkedIn Data V7.0]: ${error.message}`
        }
    }];
}