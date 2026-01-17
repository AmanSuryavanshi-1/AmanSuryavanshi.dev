// ════════════════════════════════════════════════════════════════════════════
// DEV.TO CONTENT PREPARER V5.0 (PRODUCTION - WITH LIQUID SANITIZATION)
// Parses DevTo draft from Notion → Prepares for Dev.to API
// CRITICAL FIX: Sanitizes Jekyll/Liquid syntax that Dev.to can't parse
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. GET DATA FROM CORRECT SOURCE
    // ═══════════════════════════════════════════════════════════════════════════

    const masterData = $('Set - All Data Ready').first().json;
    let devToDraft = masterData.devToDraft;

    // Validate draft exists
    if (!devToDraft || devToDraft.length < 100) {
        console.log('⏭️ DevTo draft is empty or too short, skipping.');
        return [{
            json: {
                platform: 'devto',
                skipped: true,
                success: true,
                message: 'DevTo draft is empty or too short'
            }
        }];
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. GET NOTION ITEM FOR SEO DATA
    // ═══════════════════════════════════════════════════════════════════════════

    const notionItem = masterData.notionItem || {};

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. GET IMAGE MAP (for CDN URL replacement)
    // ═══════════════════════════════════════════════════════════════════════════

    const imageMap = {};
    try {
        const imageMapItems = $('Code - Build Image Reference Map').all() || [];
        imageMapItems.forEach(item => {
            if (item.json?.marker && item.json?.cdnUrl) {
                imageMap[item.json.marker] = item.json.cdnUrl;
            }
        });
        console.log(`📸 Loaded ${Object.keys(imageMap).length} image CDN URLs`);
    } catch (e) {
        console.log('⚠️ No image map available, images will be removed from content');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. CLEAN MARKDOWN (Basic escape handling)
    // ═══════════════════════════════════════════════════════════════════════════

    let markdown = devToDraft
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .trim();

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. CRITICAL: SANITIZE LIQUID/JEKYLL SYNTAX
    // Dev.to uses Liquid templating - unrecognized tags cause parsing errors
    // This fixes "Liquid syntax error: Unknown tag 'note'" and similar errors
    // ═══════════════════════════════════════════════════════════════════════════

    markdown = markdown
        // Remove Jekyll/Hugo note/warning/tip blocks completely
        .replace(/\{%\s*note\s*%\}[\s\S]*?\{%\s*endnote\s*%\}/gi, '')
        .replace(/\{%\s*warning\s*%\}[\s\S]*?\{%\s*endwarning\s*%\}/gi, '')
        .replace(/\{%\s*tip\s*%\}[\s\S]*?\{%\s*endtip\s*%\}/gi, '')
        .replace(/\{%\s*callout\s*%\}[\s\S]*?\{%\s*endcallout\s*%\}/gi, '')
        .replace(/\{%\s*info\s*%\}[\s\S]*?\{%\s*endinfo\s*%\}/gi, '')
        .replace(/\{%\s*danger\s*%\}[\s\S]*?\{%\s*enddanger\s*%\}/gi, '')
        // Remove ANY remaining Liquid tags ({% anything %})
        .replace(/\{%[^%]*%\}/g, '')
        // Convert Liquid output syntax to inline code for safety
        .replace(/\{\{([^}]+)\}\}/g, '`{{ $1 }}`')
        // Convert GitHub-style alerts to standard markdown blockquotes
        .replace(/>\s*\[!(NOTE|WARNING|TIP|IMPORTANT|CAUTION)\]\s*/gi, '> **$1:** ')
        // Remove any remaining problematic patterns
        .trim();

    console.log('✅ Sanitized Liquid/Jekyll syntax from markdown');

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. REPLACE IMAGE MARKERS WITH CDN URLS
    // ═══════════════════════════════════════════════════════════════════════════

    const title = notionItem.property_shared_seo_title ||
        notionItem.name ||
        'Untitled Article';

    markdown = markdown.replace(/<<IMAGE_(\d+)>>/g, (match, num) => {
        const cdnUrl = imageMap[`<<IMAGE_${num}>>`];
        if (cdnUrl) {
            console.log(`✅ Replaced <<IMAGE_${num}>> with CDN URL`);
            return `![${title}](${cdnUrl})`;
        }
        // Remove marker if no CDN URL available
        console.warn(`⚠️ No CDN URL for <<IMAGE_${num}>>, removing marker`);
        return '';
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 7. SANITIZE TAGS FOR DEV.TO
    // Dev.to rules: lowercase, alphanumeric only, max 4 tags, max 30 chars each
    // ═══════════════════════════════════════════════════════════════════════════

    const rawTags = notionItem.property_shared_tags || [];
    const cleanTags = (Array.isArray(rawTags) ? rawTags : [])
        .slice(0, 4)
        .map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
        .filter(t => t.length > 0 && t.length <= 30);

    // ═══════════════════════════════════════════════════════════════════════════
    // 8. BUILD DEV.TO API PAYLOAD
    // ═══════════════════════════════════════════════════════════════════════════

    const payload = {
        article: {
            title: title.slice(0, 128),
            body_markdown: markdown,
            published: true,
            tags: cleanTags,
            description: (notionItem.property_shared_seo_description || '').slice(0, 155)
        }
    };

    // Add canonical URL if valid
    const canonicalUrl = notionItem.property_shared_canonical_url;
    if (canonicalUrl && canonicalUrl.startsWith('http')) {
        payload.article.canonical_url = canonicalUrl;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 9. OUTPUT
    // ═══════════════════════════════════════════════════════════════════════════

    console.log(`✅ DevTo Preparer: Title="${title.slice(0, 50)}...", Tags=${cleanTags.join(',')}`);
    console.log(`📊 Content length: ${markdown.length} chars, Images replaced: ${Object.keys(imageMap).length}`);

    return [{
        json: {
            ...payload,
            platform: 'devto',
            success: true
        }
    }];

} catch (error) {
    console.error('❌ DevTo Prepare Error:', error.message);
    return [{
        json: {
            platform: 'devto',
            error: true,
            skipped: false,
            message: `[DevTo Prepare V5.0]: ${error.message}`
        }
    }];
}
