// ════════════════════════════════════════════════════════════════════════════
// DEV.TO CONTENT PREPARER (v3.0 - Production Ready)
// Parses DevTo draft from Notion → Prepares for Dev.to API
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════
    // 1. GET DATA
    // ═══════════════════════════════════════════════════════════════════════

    const masterData = $('Code - Master Data Extractor').first().json;
    let devToDraft = masterData.drafts.devTo;

    // Validate draft exists
    if (!devToDraft || devToDraft.length < 100) {
        return [{
            json: {
                platform: 'devto',
                skipped: true,
                success: true,
                message: 'DevTo draft is empty or too short'
            }
        }];
    }

    // Get image map if available
    const imageMapItems = $('Code - Build Image Reference Map').all() || [];
    const imageMap = {};
    imageMapItems.forEach(item => {
        if (item.json?.marker && item.json?.cdnUrl) {
            imageMap[item.json.marker] = { cdnUrl: item.json.cdnUrl };
        }
    });

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

    let markdown = devToDraft;

    // Try to extract from JSON if wrapped
    const parsed = robustJSONParse(devToDraft);
    if (parsed) {
        markdown = parsed.formatted_markdown ||
            parsed.markdown ||
            parsed.content ||
            devToDraft;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 3. CLEAN MARKDOWN
    // ═══════════════════════════════════════════════════════════════════════

    // Remove markdown fences
    markdown = markdown
        .replace(/^```(markdown|md)?\s*/i, '')
        .replace(/```$/g, '')
        .trim();

    // Handle escaped characters
    markdown = markdown
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"');

    // ═══════════════════════════════════════════════════════════════════════
    // 4. REPLACE IMAGE MARKERS WITH CDN URLS
    // ═══════════════════════════════════════════════════════════════════════

    markdown = markdown.replace(/<<IMAGE_(\d+)>>/g, (match, num) => {
        const image = imageMap[`<<IMAGE_${num}>>`];
        if (image?.cdnUrl) {
            return `![${masterData.sharedMeta.title || 'Image'}](${image.cdnUrl})`;
        }
        // Remove marker if no image available (silent fallback)
        return '';
    });

    // ═══════════════════════════════════════════════════════════════════════
    // 5. SANITIZE TAGS FOR DEV.TO
    // Dev.to rules: lowercase, alphanumeric only, max 4 tags, max 30 chars each
    // ═══════════════════════════════════════════════════════════════════════

    const cleanTags = (masterData.sharedMeta.tags || [])
        .slice(0, 4)
        .map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
        .filter(t => t.length > 0 && t.length <= 30);

    // ═══════════════════════════════════════════════════════════════════════
    // 6. BUILD DEV.TO API PAYLOAD
    // ═══════════════════════════════════════════════════════════════════════

    const payload = {
        article: {
            title: (masterData.sharedMeta.title || 'Untitled Article').slice(0, 128),
            body_markdown: markdown,
            published: true,
            tags: cleanTags,
            description: (masterData.sharedMeta.description || '').slice(0, 155)
        }
    };

    // Add canonical URL if valid
    const canonicalUrl = masterData.sharedMeta.canonicalUrl;
    if (canonicalUrl && canonicalUrl.startsWith('http')) {
        payload.article.canonical_url = canonicalUrl;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 7. OUTPUT
    // ═══════════════════════════════════════════════════════════════════════

    console.log(`✅ DevTo Preparer: Title="${payload.article.title}", Tags=${cleanTags.join(',')}`);

    return [{ json: payload }];

} catch (error) {
    console.error('❌ DevTo Prepare Error:', error.message);
    return [{
        json: {
            platform: 'devto',
            error: true,
            skipped: false,
            message: `[DevTo Prepare]: ${error.message}`
        }
    }];
}
