// ============================================================
// ADD PARENT TWEET ID - WITH ID CLEANING (V2.0 - THREADING FIX)
// ============================================================
// CRITICAL FIX: Uses .all()[last] instead of .first() to get
// the most recent parent tweet ID for proper threading.
// ============================================================

try {
    const tweetData = $input.first()?.json || {};
    const order = tweetData.order || 1;

    console.log(`[Threading] ========================================`);
    console.log(`[Threading] Processing tweet ${order}`);

    let parentTweetId = null;
    let isFirstTweet = false;

    // ============================================================
    // CASE 1: First Tweet (order === 1)
    // ============================================================
    if (order === 1) {
        console.log(`[Threading] ✓ Tweet ${order}: FIRST TWEET`);
        parentTweetId = null;
        isFirstTweet = true;

        return [{
            json: {
                text: tweetData.text,
                media_id_string: tweetData.media_id_string || "",
                inReplyTo: tweetData.inReplyTo || false,
                order: order,
                parentTweetId: parentTweetId,
                isFirstTweet: isFirstTweet
            }
        }];
    }

    // ============================================================
    // CASE 2: Subsequent Tweets (order > 1)
    // ============================================================
    if (order > 1 && tweetData.inReplyTo === true) {
        console.log(`[Threading] → Tweet ${order}: Getting parent tweet ID...`);

        try {
            // CRITICAL FIX: Get the most recent execution from the loop (last item)
            // .first() always returns the first iteration's data, which breaks threading for tweet 3+
            const allRuns = $('Prepare for Next Loop').all();
            const prepareNode = allRuns.length > 0 ? allRuns[allRuns.length - 1].json : null;

            console.log(`[Threading] Raw lastTweetId source:`, allRuns.length > 0 ? 'Found previous run' : 'No previous run');
            console.log(`[Threading] Raw lastTweetId:`, prepareNode?.lastTweetId);
            console.log(`[Threading] Type:`, typeof prepareNode?.lastTweetId);

            if (prepareNode?.lastTweetId) {
                // CRITICAL FIX: Clean the tweet ID thoroughly
                const rawId = prepareNode.lastTweetId;

                // Convert to string and remove all unwanted characters
                parentTweetId = String(rawId)
                    .replace(/["\\t\\n\\r\\\\]/g, '')  // Remove quotes, tabs, newlines, backslashes
                    .replace(/\\s+/g, '')           // Remove all whitespace
                    .trim();                       // Trim edges

                console.log(`[Threading] ✓ Cleaned parent tweet ID: ${parentTweetId}`);
                console.log(`[Threading] ✓ Length: ${parentTweetId.length}`);
                console.log(`[Threading] ✓ Is numeric: ${/^[0-9]+$/.test(parentTweetId)}`);

                // Validate it's a valid tweet ID (numeric, 1-19 digits)
                if (!/^[0-9]{1,19}$/.test(parentTweetId)) {
                    console.error(`[Threading] ✗ Invalid tweet ID format after cleaning!`);
                    console.error(`[Threading] Cleaned ID: "${parentTweetId}"`);
                    console.error(`[Threading] Character codes:`, Array.from(parentTweetId).map(c => c.charCodeAt(0)));
                    parentTweetId = null;
                }
            } else {
                console.error(`[Threading] ✗ No lastTweetId found`);
            }
        } catch (error) {
            console.error(`[Threading] ✗ Error:`, error.message);
        }

        isFirstTweet = false;

        if (!parentTweetId) {
            console.error(`[Threading] ✗✗✗ CRITICAL ERROR ✗✗✗`);
            console.error(`[Threading] No valid parent tweet ID for tweet ${order}`);

            return [{
                json: {
                    text: tweetData.text,
                    media_id_string: tweetData.media_id_string || "",
                    inReplyTo: tweetData.inReplyTo,
                    order: order,
                    parentTweetId: null,
                    isFirstTweet: false,
                    error: true,
                    errorMessage: `Cannot find valid parent tweet ID for tweet ${order}`,
                    errorType: 'MISSING_PARENT_ID'
                }
            }];
        }

        console.log(`[Threading] ✓ Tweet ${order} will reply to: ${parentTweetId}`);
    }

    // ============================================================
    // CASE 3: Non-reply tweet
    // ============================================================
    else if (tweetData.inReplyTo === false) {
        console.log(`[Threading] → Tweet ${order}: Standalone tweet`);
        parentTweetId = null;
        isFirstTweet = (order === 1);
    }

    console.log(`[Threading] ✓ Final output - isFirstTweet: ${isFirstTweet}, parentTweetId: ${parentTweetId || 'null'}`);
    console.log(`[Threading] ========================================`);

    return [{
        json: {
            text: tweetData.text,
            media_id_string: tweetData.media_id_string || "",
            inReplyTo: tweetData.inReplyTo,
            order: order,
            parentTweetId: parentTweetId,
            isFirstTweet: isFirstTweet
        }
    }];

} catch (error) {
    console.error(`[Threading] ✗ EXCEPTION:`, error.message);

    const inputData = $input.first()?.json || {};

    return [{
        json: {
            text: inputData.text || "",
            media_id_string: inputData.media_id_string || "",
            inReplyTo: inputData.inReplyTo || false,
            order: inputData.order || 1,
            parentTweetId: null,
            isFirstTweet: (inputData.order === 1),
            error: true,
            errorMessage: `Exception: ${error.message}`,
            errorType: 'EXCEPTION'
        }
    }];
}
