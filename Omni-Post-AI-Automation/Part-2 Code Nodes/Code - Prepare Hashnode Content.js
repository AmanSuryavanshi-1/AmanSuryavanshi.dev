// ════════════════════════════════════════════════════════════════════════════
// HASHNODE CONTENT PREPARER (v3.0 - GraphQL Mutation Ready)
// Parses Hashnode draft from Notion → Prepares for Hashnode GraphQL API
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════
    // 1. CONFIGURATION (REPLACE BEFORE USE)
    // ═══════════════════════════════════════════════════════════════════════

    // TODO: Replace with your actual Hashnode Publication ID from Dashboard
    const PUBLICATION_ID = '674b7df5b4c7e0c99488f97f'; // amansuryavanshi

    // ═══════════════════════════════════════════════════════════════════════
    // 2. GET DATA
    // ═══════════════════════════════════════════════════════════════════════

    const masterData = $('Code - Master Data Extractor').first().json;
    let hashnodeDraft = masterData.drafts.hashnode;

    // Validate draft exists
    if (!hashnodeDraft || hashnodeDraft.length < 100) {
        return [{
            json: {
                platform: 'hashnode',
                skipped: true,
                success: true,
                message: 'Hashnode draft is empty or too short'
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
    // 3. ROBUST JSON EXTRACTION (if draft is JSON-wrapped)
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

    let markdown = hashnodeDraft;

    // Try to extract from JSON if wrapped
    const parsed = robustJSONParse(hashnodeDraft);
    if (parsed) {
        markdown = parsed.formatted_markdown ||
            parsed.markdown ||
            parsed.content ||
            hashnodeDraft;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 4. CLEAN MARKDOWN
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
    // 5. REPLACE IMAGE MARKERS WITH CDN URLS
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
    // 6. SANITIZE TAGS FOR HASHNODE
    // Hashnode rules: slug format, max 5 tags
    // ═══════════════════════════════════════════════════════════════════════

    const cleanTags = (masterData.sharedMeta.tags || [])
        .slice(0, 5)
        .map(t => ({
            slug: t.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
            name: t
        }))
        .filter(t => t.slug.length > 0);

    // ═══════════════════════════════════════════════════════════════════════
    // 7. BUILD HASHNODE GRAPHQL MUTATION
    // ═══════════════════════════════════════════════════════════════════════

    const title = (masterData.sharedMeta.title || 'Untitled Article').slice(0, 128);
    const slug = masterData.sharedMeta.slug ||
        title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80);

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
                title: title,
                contentMarkdown: markdown,
                publicationId: PUBLICATION_ID,
                slug: slug,
                tags: cleanTags,
                metaTags: {
                    title: title.slice(0, 60),
                    description: (masterData.sharedMeta.description || '').slice(0, 155)
                },
                settings: {
                    enableTableOfContent: true,
                    isNewsletterActivated: false
                }
            }
        }
    };

    // Add subtitle if provided
    const subtitle = masterData.drafts.hashnodeSubtitle;
    if (subtitle && subtitle.trim().length > 0) {
        mutation.variables.input.subtitle = subtitle.trim().slice(0, 250);
    }

    // Add canonical URL if valid
    const canonicalUrl = masterData.sharedMeta.canonicalUrl;
    if (canonicalUrl && canonicalUrl.startsWith('http')) {
        mutation.variables.input.originalArticleURL = canonicalUrl;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 8. OUTPUT
    // ═══════════════════════════════════════════════════════════════════════

    console.log(`✅ Hashnode Preparer: Title="${title}", Slug="${slug}"`);

    return [{ json: mutation }];

} catch (error) {
    console.error('❌ Hashnode Prepare Error:', error.message);
    return [{
        json: {
            platform: 'hashnode',
            error: true,
            skipped: false,
            message: `[Hashnode Prepare]: ${error.message}`
        }
    }];
}
