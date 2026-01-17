// ══════════════════════════════════════════════════════════════════════
// PREPARE BINARY FOR TWITTER UPLOAD V2.0 (FIXED)
// CRITICAL: Binary data is in $input.first().binary, NOT in .json!
// ══════════════════════════════════════════════════════════════════════

try {
    const item = $input.first();
    const tweetData = item.json;

    // CRITICAL FIX: Binary is stored separately from JSON in n8n!
    // It's at $input.first().binary.imageBinary, NOT $input.first().json.imageBinary
    const binaryData = item.binary;

    console.log('📦 Prepare Binary V2.0');
    console.log('  - Has binary property:', !!binaryData);
    console.log('  - Binary keys:', binaryData ? Object.keys(binaryData) : 'none');

    if (!binaryData || !binaryData.imageBinary) {
        console.error('❌ No imageBinary found in binary data!');
        console.error('  - Available binary keys:', binaryData ? Object.keys(binaryData) : 'none');
        throw new Error('No imageBinary found. Item may have taken wrong IF branch.');
    }

    console.log('✅ Found imageBinary, passing to Upload Media node');

    // Return with binary at correct level for HTTP Request node
    return [{
        json: {
            text: tweetData.text,
            inReplyTo: tweetData.inReplyTo,
            order: tweetData.order
        },
        binary: {
            // Pass the binary data through unchanged
            imageBinary: binaryData.imageBinary
        }
    }];

} catch (error) {
    console.error('❌ Prepare Binary Error:', error.message);
    return [{
        json: {
            error: true,
            message: `[Prepare Binary V2.0]: ${error.message}`
        }
    }];
}
