// ════════════════════════════════════════════════════════════════════════════
// LINKEDIN CONTENT PARSER (v3.0 - Production Ready)
// Parses LinkedIn draft from Notion → Prepares for LinkedIn API
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════
    // 1. GET DATA
    // ═══════════════════════════════════════════════════════════════════════

    const masterData = $('Code - Master Data Extractor').first().json;
    let linkedinDraft = masterData.drafts.linkedin;

    if (!linkedinDraft || linkedinDraft.length < 20) {
        return [{
            json: {
                platform: 'linkedin',
                skipped: true,
                success: true,
                message: 'LinkedIn draft is empty or too short'
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

    // Try to extract from JSON if wrapped
    const parsed = robustJSONParse(linkedinDraft);
    if (parsed) {
        linkedinDraft = parsed.formatted_markdown ||
            parsed.markdown ||
            parsed.content ||
            parsed.text ||
            linkedinDraft;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 3. CLEAN CONTENT
    // ═══════════════════════════════════════════════════════════════════════

    // Remove markdown header if present
    linkedinDraft = linkedinDraft
        .replace(/^#\s*LinkedIn\s*Draft\s*/i, '')
        .replace(/^---\s*\n?/, '')
        .trim();

    // Handle escaped newlines (from Notion storage) → convert to actual newlines
    // Then later we'll re-encode for LinkedIn API
    linkedinDraft = linkedinDraft
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"');

    // ═══════════════════════════════════════════════════════════════════════
    // 4. SPLIT INTO POSTS (if multiple posts separated by ---)
    // ═══════════════════════════════════════════════════════════════════════

    const postBlocks = linkedinDraft
        .split(/\n-{3,}\n/)
        .map(block => block.trim())
        .filter(block => block.length > 20);

    if (postBlocks.length === 0) {
        throw new Error('No valid post content found after parsing.');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 5. PROCESS EACH POST
    // ═══════════════════════════════════════════════════════════════════════

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

        // Normalize newlines (CRITICAL for LinkedIn API)
        cleanText = cleanText
            .replace(/\n{4,}/g, '\n\n\n')  // Max 3 consecutive newlines
            .replace(/\n{3}/g, '\n\n')     // Triple → Double (for most cases)
            .trim();

        // ═══════════════════════════════════════════════════════════════════
        // 6. CHARACTER LIMIT ENFORCEMENT (2800 max for LinkedIn)
        // ═══════════════════════════════════════════════════════════════════

        const MAX_CHARS = 2800;
        if (cleanText.length > MAX_CHARS) {
            cleanText = cleanText.substring(0, MAX_CHARS - 50) +
                '\n\n[See full details in comments]';
            console.warn(`⚠️ LinkedIn post ${index + 1} truncated to ${MAX_CHARS} chars`);
        }

        // ═══════════════════════════════════════════════════════════════════
        // 7. FIND BINARY FOR IMAGE (if any)
        // ═══════════════════════════════════════════════════════════════════

        let firstBinaryData = null;
        if (markersInBlock.length > 0 && allCachedImages.length > 0) {
            const num = markersInBlock[0]; // LinkedIn only supports 1 image
            const targetImage = allCachedImages.find(img =>
                img.json?.fileName?.includes(`asset-${num}`)
            );
            if (targetImage?.binary) {
                const binaryKey = Object.keys(targetImage.binary)[0];
                firstBinaryData = targetImage.binary[binaryKey];
            }
        }

        // ═══════════════════════════════════════════════════════════════════
        // 8. BUILD OUTPUT
        // ═══════════════════════════════════════════════════════════════════

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
