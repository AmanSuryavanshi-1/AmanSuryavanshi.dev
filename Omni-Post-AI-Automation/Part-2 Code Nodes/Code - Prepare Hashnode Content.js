// ════════════════════════════════════════════════════════════════════════════
// HASHNODE CONTENT PREPARER V5.0 (PRODUCTION - WITH LIQUID SANITIZATION)
// Parses Hashnode draft from Notion → Prepares for Hashnode GraphQL API
// CRITICAL FIX: Sanitizes Jekyll/Liquid syntax for cross-platform compatibility
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════

    // Your Hashnode Publication ID
    const PUBLICATION_ID = '696467546de664dbe2c2ec0c';

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. GET DATA FROM CORRECT SOURCE
    // ═══════════════════════════════════════════════════════════════════════════

    const masterData = $('Set - All Data Ready').first().json;
    let hashnodeDraft = masterData.hashnodeDraft;

    // Validate draft exists
    if (!hashnodeDraft || hashnodeDraft.length < 100) {
        console.log('⏭️ Hashnode draft is empty or too short, skipping.');
        return [{
            json: {
                platform: 'hashnode',
                skipped: true,
                success: true,
                message: 'Hashnode draft is empty or too short'
            }
        }];
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. GET NOTION ITEM FOR SEO DATA
    // ═══════════════════════════════════════════════════════════════════════════

    const notionItem = masterData.notionItem || {};

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. GET IMAGE MAP (for CDN URL replacement)
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
    // 5. CLEAN MARKDOWN (Basic escape handling)
    // ═══════════════════════════════════════════════════════════════════════════

    let markdown = hashnodeDraft
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .trim();

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. CRITICAL: SANITIZE LIQUID/JEKYLL SYNTAX
    // Some content may contain Jekyll-style tags that need to be cleaned
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
    // 7. REPLACE IMAGE MARKERS WITH CDN URLS
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
        console.warn(`⚠️ No CDN URL for <<IMAGE_${num}>>, removing marker`);
        return '';
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 8. SANITIZE TAGS FOR HASHNODE
    // Hashnode rules: slug format, max 5 tags
    // ═══════════════════════════════════════════════════════════════════════════

    const rawTags = notionItem.property_shared_tags || [];
    const cleanTags = (Array.isArray(rawTags) ? rawTags : [])
        .slice(0, 5)
        .map(t => ({
            slug: t.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
            name: t
        }))
        .filter(t => t.slug.length > 0);

    // ═══════════════════════════════════════════════════════════════════════════
    // 9. BUILD SLUG
    // ═══════════════════════════════════════════════════════════════════════════

    const slug = notionItem.property_shared_slug ||
        title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80);

    // ═══════════════════════════════════════════════════════════════════════════
    // 10. BUILD HASHNODE GRAPHQL MUTATION
    // ═══════════════════════════════════════════════════════════════════════════

    const mutation = {
        query: `
      mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
          post {
            id
            slug
            url
            title
            publishedAt
          }
        }
      }
    `,
        variables: {
            input: {
                title: title.slice(0, 128),
                contentMarkdown: markdown,
                publicationId: PUBLICATION_ID,
                slug: slug,
                tags: cleanTags,
                metaTags: {
                    title: title.slice(0, 60),
                    description: (notionItem.property_shared_seo_description || '').slice(0, 155)
                },
                settings: {
                    enableTableOfContent: true,
                    isNewsletterActivated: false
                }
            }
        }
    };

    // Add subtitle if provided
    const subtitle = notionItem.property_hashnode_subtitle;
    if (subtitle && subtitle.trim().length > 0) {
        mutation.variables.input.subtitle = subtitle.trim().slice(0, 250);
    }

    // Add canonical URL if valid
    const canonicalUrl = notionItem.property_shared_canonical_url;
    if (canonicalUrl && canonicalUrl.startsWith('http')) {
        mutation.variables.input.originalArticleURL = canonicalUrl;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 11. OUTPUT
    // ═══════════════════════════════════════════════════════════════════════════

    console.log(`✅ Hashnode Preparer: Title="${title.slice(0, 50)}...", Slug="${slug}"`);
    console.log(`📊 Content length: ${markdown.length} chars, Images replaced: ${Object.keys(imageMap).length}`);

    return [{
        json: {
            ...mutation,
            platform: 'hashnode',
            success: true
        }
    }];

} catch (error) {
    console.error('❌ Hashnode Prepare Error:', error.message);
    return [{
        json: {
            platform: 'hashnode',
            error: true,
            skipped: false,
            message: `[Hashnode Prepare V5.0]: ${error.message}`
        }
    }];
}
