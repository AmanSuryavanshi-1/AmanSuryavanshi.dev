// ════════════════════════════════════════════════════════════════════════════
// TWITTER THREAD PARSER (v3.0 - Production Ready)
// Parses Twitter draft from Notion → Prepares tweets for API
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════
    // 1. GET DATA
    // ═══════════════════════════════════════════════════════════════════════

    const masterData = $('Code - Master Data Extractor').first().json;
    let twitterDraft = masterData.drafts.twitter;

    if (!twitterDraft || twitterDraft.length < 20) {
        return [{
            json: {
                platform: 'twitter',
                skipped: true,
                success: true,
                message: 'Twitter draft is empty or too short'
            }
        }];
    }

    // Get cached images if available
    const allCachedImages = $('Loop to Download Images').all() || [];

    // ═══════════════════════════════════════════════════════════════════════
    // 2. ROBUST JSON EXTRACTION (if draft is JSON-wrapped)
    // ═══════════════════════════════════════════════════════════════════════

    function robustJSONParse(rawStr) {
        if (!rawStr) return null;
        const jsonMatch = rawStr.match(/{[\s\S]*}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (e) {
                try {
                    const cleanBlock = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '');
                    return JSON.parse(cleanBlock);
                } catch (e2) { /* Failed */ }
            }
        }
        return null;
    }

    let markdownText = twitterDraft;
    let structuredTweets = null;

    // Try to extract from JSON if wrapped
    const parsed = robustJSONParse(twitterDraft);
    if (parsed) {
        markdownText = parsed.formatted_markdown ||
            parsed.markdown ||
            parsed.text ||
            twitterDraft;

        // Check for structured tweet data
        if (parsed.structured_data?.threads?.[0]?.tweets) {
            structuredTweets = parsed.structured_data.threads[0].tweets;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 3. PARSE TWEETS (Two strategies: structured JSON or markdown splitting)
    // ═══════════════════════════════════════════════════════════════════════

    let tweets = [];
    const MAX_TWEET_CHARS = 280;

    if (structuredTweets && structuredTweets.length > 0) {
        // Strategy A: Use structured data from AI
        tweets = structuredTweets.map((tweet, index) => ({
            position: tweet.position || index + 1,
            content: tweet.content || "",
            charCount: (tweet.content || "").length,
            imageMarker: tweet.image_marker || null,
            type: tweet.type || "content"
        }));
    } else {
        // Strategy B: Parse markdown format
        // Remove header
        markdownText = markdownText
            .replace(/^#\s*Twitter\s*Draft\s*/i, '')
            .replace(/^Thread\s*\d*\s*/im, '')
            .replace(/^---\s*\n?/, '')
            .trim();

        // Handle escaped newlines
        markdownText = markdownText.replace(/\\n/g, '\n');

        // Split by --- separator
        const tweetBlocks = markdownText
            .split(/\n\n---\n\n/)
            .map(block => block.trim())
            .filter(block => block.length > 0);

        tweets = tweetBlocks.map((block, index) => {
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
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 4. VALIDATE & PREPARE FOR POSTING
    // ═══════════════════════════════════════════════════════════════════════

    const outputTweets = tweets.map((tweet, index) => {
        let text = tweet.content;

        // CRITICAL: Validate character limit
        if (text.length > MAX_TWEET_CHARS) {
            console.warn(`⚠️ Tweet ${tweet.position} exceeds ${MAX_TWEET_CHARS} chars (${text.length}). Truncating.`);
            // Smart truncation: try to end at a sentence
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

        // Find image binary if marker present
        let imageBinary = null;
        if (tweet.imageMarker && allCachedImages.length > 0) {
            const numMatch = tweet.imageMarker.match(/<<IMAGE_(\d+)>>/);
            if (numMatch) {
                const num = parseInt(numMatch[1]);
                const targetImage = allCachedImages.find(img =>
                    img.json?.fileName?.includes(`asset-${num}`)
                );
                if (targetImage?.binary) {
                    const binaryKey = Object.keys(targetImage.binary)[0];
                    imageBinary = targetImage.binary[binaryKey];
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
