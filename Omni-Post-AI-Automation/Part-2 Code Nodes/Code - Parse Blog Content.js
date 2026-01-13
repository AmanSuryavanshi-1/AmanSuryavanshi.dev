// ════════════════════════════════════════════════════════════════════════════
// BLOG CONTENT PARSER (v3.0 - Sanity Portable Text Ready)
// Parses Blog draft from Notion → Prepares for Sanity CMS API
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════
    // 1. GET DATA
    // ═══════════════════════════════════════════════════════════════════════

    const masterData = $('Code - Master Data Extractor').first().json;
    let blogDraft = masterData.drafts.sanityBlog;

    if (!blogDraft || blogDraft.length < 100) {
        return [{
            json: {
                platform: 'blog',
                skipped: true,
                success: true,
                message: 'Blog draft is empty or too short'
            }
        }];
    }

    // Get image map if available
    const imageMapItems = $('Code - Build Image Reference Map').all() || [];
    const imageMap = {};
    imageMapItems.forEach(item => {
        if (item.json?.marker && item.json?.cdnUrl) {
            imageMap[item.json.marker] = { cdnUrl: item.json.cdnUrl, alt: item.json.alt || '' };
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

    let markdown = blogDraft;
    let seoData = {};

    // Try to extract from JSON if wrapped
    const parsed = robustJSONParse(blogDraft);
    if (parsed) {
        markdown = parsed.formatted_markdown ||
            parsed.markdown ||
            parsed.content ||
            blogDraft;

        // Extract SEO data if present
        if (parsed.structured_data?.seo) {
            seoData = parsed.structured_data.seo;
        }
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
    // 4. REPLACE IMAGE MARKERS
    // ═══════════════════════════════════════════════════════════════════════

    markdown = markdown.replace(/<<IMAGE_(\d+)>>/g, (match, num) => {
        const image = imageMap[`<<IMAGE_${num}>>`];
        if (image?.cdnUrl) {
            return `![${image.alt || `Image ${num}`}](${image.cdnUrl})`;
        }
        // Remove marker if no image available
        return '';
    });

    // ═══════════════════════════════════════════════════════════════════════
    // 5. BUILD SEO METADATA
    // ═══════════════════════════════════════════════════════════════════════

    const finalSeo = {
        title: (seoData.title || masterData.sharedMeta.title || 'Untitled Post').slice(0, 60),
        slug: seoData.slug || masterData.sharedMeta.slug ||
            (masterData.sharedMeta.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80),
        description: (seoData.meta_description || masterData.sharedMeta.description || '').slice(0, 160),
        keywords: [...new Set([
            ...(seoData.keywords || []),
            ...(masterData.sharedMeta.tags || [])
        ])].slice(0, 10)
    };

    // ═══════════════════════════════════════════════════════════════════════
    // 6. PARSE MARKDOWN INTO BLOCKS (for Sanity Portable Text)
    // ═══════════════════════════════════════════════════════════════════════

    function generateKey() {
        return Math.random().toString(36).slice(2, 11);
    }

    function detectHeadingLevel(text) {
        const trimmed = text.trim();
        if (trimmed.startsWith('####')) return { level: 'h4', text: trimmed.replace(/^####\s*/, '').trim() };
        if (trimmed.startsWith('###')) return { level: 'h3', text: trimmed.replace(/^###\s*/, '').trim() };
        if (trimmed.startsWith('##')) return { level: 'h2', text: trimmed.replace(/^##\s*/, '').trim() };
        if (trimmed.startsWith('#')) return { level: 'h1', text: trimmed.replace(/^#\s*/, '').trim() };
        return null;
    }

    function isListItem(text) {
        const trimmed = text.trim();
        return /^\s*[-*+]\s+/.test(trimmed) || /^\s*\d+[.)]\\s+/.test(trimmed);
    }

    const lines = markdown.split('\n');
    const blocks = [];
    let currentCodeBlock = null;
    let codeLanguage = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code block handling
        if (line.startsWith('```')) {
            if (currentCodeBlock === null) {
                codeLanguage = line.slice(3).trim() || 'plaintext';
                currentCodeBlock = [];
            } else {
                blocks.push({
                    _type: 'code',
                    _key: generateKey(),
                    language: codeLanguage,
                    code: currentCodeBlock.join('\n')
                });
                currentCodeBlock = null;
                codeLanguage = '';
            }
            continue;
        }

        if (currentCodeBlock !== null) {
            currentCodeBlock.push(line);
            continue;
        }

        // Heading detection
        const heading = detectHeadingLevel(line);
        if (heading) {
            blocks.push({
                _type: 'block',
                _key: generateKey(),
                style: heading.level,
                children: [{ _type: 'span', _key: generateKey(), text: heading.text }]
            });
            continue;
        }

        // Image markdown detection
        const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imageMatch) {
            blocks.push({
                _type: 'image',
                _key: generateKey(),
                alt: imageMatch[1] || 'Article image',
                url: imageMatch[2]
            });
            continue;
        }

        // Empty lines (skip)
        if (line.trim() === '') continue;

        // Regular paragraph
        blocks.push({
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [{ _type: 'span', _key: generateKey(), text: line }]
        });
    }

    // Close any unclosed code block
    if (currentCodeBlock !== null) {
        blocks.push({
            _type: 'code',
            _key: generateKey(),
            language: codeLanguage || 'plaintext',
            code: currentCodeBlock.join('\n')
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 7. OUTPUT
    // ═══════════════════════════════════════════════════════════════════════

    console.log(`✅ Blog Parser: Generated ${blocks.length} blocks for Sanity`);

    return [{
        json: {
            platform: 'blog',
            seo: finalSeo,
            markdown: markdown,
            blocks: blocks,
            success: true
        }
    }];

} catch (error) {
    console.error('❌ Blog Parse Error:', error.message);
    return [{
        json: {
            platform: 'blog',
            error: true,
            skipped: false,
            message: `[Blog Parse]: ${error.message}`
        }
    }];
}
