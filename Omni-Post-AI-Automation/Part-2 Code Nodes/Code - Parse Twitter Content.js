// ════════════════════════════════════════════════════════════════════════════
// TWITTER THREAD PARSER V6.0 (ROBUST IMAGE ACCESS - PRODUCTION READY)
// Parses Twitter draft from Notion → Prepares tweets for API
// CRITICAL FIX: Filters for items with binaries + improved matching strategies
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
        // 6. FIND IMAGE BINARY (ROBUST - multiple matching strategies)
        // ═══════════════════════════════════════════════════════════════════════

        let imageBinary = null;
        if (tweet.imageMarker && allCachedImages.length > 0) {
            const numMatch = tweet.imageMarker.match(/<<IMAGE_(\d+)>>/);
            if (numMatch) {
                const num = parseInt(numMatch[1]);
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
                    const fileNumMatch = fileName.match(/asset[-_]?(\d+)/i);
                    if (fileNumMatch && parseInt(fileNumMatch[1], 10) === num) {
                        console.log(`   ✓ Matched by extracted number: ${fileName}`);
                        return true;
                    }

                    return false;
                });

                if (targetImage?.binary) {
                    const binaryKey = Object.keys(targetImage.binary)[0];
                    imageBinary = targetImage.binary[binaryKey];
                    console.log(`✅ Attached image asset-${num} to tweet ${tweet.position}`);
                } else {
                    console.warn(`⚠️ Image asset-${num} not found for tweet ${tweet.position}`);
                    console.warn(`   Available: ${allCachedImages.map(i => i.json?.fileName || 'unknown').join(', ')}`);
                }
            }
        }

        // Build output
        // CRITICAL: n8n IF node cannot check $binary directly!
        // It can only check $json properties, so we add explicit flags
        const outputItem = {
            json: {
                order: tweet.position,
                text: text,
                charCount: text.length,
                inReplyTo: index > 0,
                hasImage: !!imageBinary,
                // CRITICAL: This flag is what the IF node should check!
                imageBinaryExists: imageBinary ? 'yes' : '',
                platform: 'twitter'
            }
        };

        if (imageBinary) {
            outputItem.binary = {
                imageBinary: imageBinary
            };
            console.log(`📎 Binary attached to tweet ${tweet.position} - imageBinaryExists: yes`);
        } else {
            console.log(`📝 No image for tweet ${tweet.position} - imageBinaryExists: empty`);
        }

        return outputItem;
    });

    console.log(`✅ Twitter Parser V6.0: Generated ${outputTweets.length} tweet(s)`);
    return outputTweets;

} catch (error) {
    console.error('❌ Twitter Parse Error:', error.message);
    return [{
        json: {
            platform: 'twitter',
            error: true,
            skipped: false,
            message: `[Twitter Parse V6.0]: ${error.message}`
        }
    }];
}
