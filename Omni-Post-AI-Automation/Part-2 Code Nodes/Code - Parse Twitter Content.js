// ════════════════════════════════════════════════════════════════════════════
// TWITTER THREAD PARSER V5.0 (Part 2 Compatible - ROBUST IMAGE ACCESS)
// Parses Twitter draft from Notion → Prepares tweets for API
// FIXED: Uses $('Loop to Download Images').all() to access ALL downloaded binaries
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. GET DATA FROM CORRECT SOURCE
    // ═══════════════════════════════════════════════════════════════════════════

    const masterData = $('Set - All Data Ready').first().json;
    let twitterDraft = masterData.twitterDraft;

    if (!twitterDraft || twitterDraft.length < 20) {
        console.log('⏭️ Twitter draft is empty or too short, skipping.');
        return [{
            json: {
                platform: 'twitter',
                skipped: true,
                success: true,
                message: 'Twitter draft is empty or too short'
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
    // 3. CLEAN AND PARSE MARKDOWN
    // ═══════════════════════════════════════════════════════════════════════════

    // Handle escaped newlines
    let markdownText = twitterDraft
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .trim();

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. SPLIT INTO TWEETS (by --- separator)
    // ═══════════════════════════════════════════════════════════════════════════

    // Split by --- separator (Twitter thread format)
    const tweetBlocks = markdownText
        .split(/\n\n---\n\n/)
        .map(block => block.trim())
        .filter(block => block.length > 0);

    const MAX_TWEET_CHARS = 280;

    const tweets = tweetBlocks.map((block, index) => {
        // Extract tweet number if present (e.g., "Tweet 1/5")
        const tweetNumMatch = block.match(/^Tweet\s*(\d+)\/(\d+)/i);

        // Find image marker
        const imageMatch = block.match(/<<IMAGE_(\d+)>>/);

        // Clean the text
        let cleanText = block
            .replace(/^Tweet\s*\d+\/\d+\s*\n*/i, '')  // Remove "Tweet X/Y"
            .replace(/<<IMAGE_\d+>>/g, '')              // Remove image markers
            .trim();

        return {
            position: tweetNumMatch ? parseInt(tweetNumMatch[1]) : index + 1,
            content: cleanText,
            charCount: cleanText.length,
            imageMarker: imageMatch ? `<<IMAGE_${imageMatch[1]}>>` : null,
            type: index === 0 ? 'hook' : (index === tweetBlocks.length - 1 ? 'cta' : 'content')
        };
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. VALIDATE & PREPARE FOR POSTING
    // ═══════════════════════════════════════════════════════════════════════════

    const outputTweets = tweets.map((tweet, index) => {
        let text = tweet.content;

        // CRITICAL: Validate character limit
        if (text.length > MAX_TWEET_CHARS) {
            console.warn(`⚠️ Tweet ${tweet.position} exceeds ${MAX_TWEET_CHARS} chars (${text.length}). Truncating.`);
            text = text.substring(0, MAX_TWEET_CHARS - 3);
            const lastPeriod = text.lastIndexOf('.');
            const lastNewline = text.lastIndexOf('\n');
            const cutPoint = Math.max(lastPeriod, lastNewline);
            if (cutPoint > MAX_TWEET_CHARS - 50) {
                text = text.substring(0, cutPoint + 1);
            } else {
                text = text + '...';
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 6. FIND IMAGE BINARY (ROBUST - graceful if missing)
        // ═══════════════════════════════════════════════════════════════════════

        let imageBinary = null;
        if (tweet.imageMarker && allCachedImages.length > 0) {
            const numMatch = tweet.imageMarker.match(/<<IMAGE_(\d+)>>/);
            if (numMatch) {
                const num = parseInt(numMatch[1]);
                const targetImage = allCachedImages.find(img => {
                    const fileName = img.json?.fileName || '';
                    const pattern = new RegExp(`asset[-_]?${num}([_\\.-]|$)`, 'i');
                    return pattern.test(fileName);
                });

                if (targetImage?.binary) {
                    const binaryKey = Object.keys(targetImage.binary)[0];
                    imageBinary = targetImage.binary[binaryKey];
                    console.log(`✅ Attached image asset-${num} to tweet ${tweet.position}`);
                } else {
                    console.warn(`⚠️ Image asset-${num} not found for tweet ${tweet.position}`);
                }
            }
        }

        // Build output
        const outputItem = {
            json: {
                order: tweet.position,
                text: text,
                charCount: text.length,
                inReplyTo: index > 0,
                hasImage: !!imageBinary,
                platform: 'twitter'
            }
        };

        if (imageBinary) {
            outputItem.binary = {
                imageBinary: imageBinary
            };
        }

        return outputItem;
    });

    console.log(`✅ Twitter Parser: Generated ${outputTweets.length} tweet(s)`);
    return outputTweets;

} catch (error) {
    console.error('❌ Twitter Parse Error:', error.message);
    return [{
        json: {
            platform: 'twitter',
            error: true,
            skipped: false,
            message: `[Twitter Parse]: ${error.message}`
        }
    }];
}
