// ════════════════════════════════════════════════════════════════════════════
// MASTER DATA EXTRACTOR (v3.0 - Notion-Centric Architecture)
// Reads drafts directly from Notion properties set by Part 1
// ════════════════════════════════════════════════════════════════════════════

const item = $input.first().json;

// ═══════════════════════════════════════════════════════════════════════════
// 1. CORE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

function sanitizeText(text) {
    if (!text) return "";
    return String(text)
        .replace(/\u0000/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
}

function extractPropertyText(prop) {
    if (!prop) return "";
    // Handle Notion rich_text array
    if (Array.isArray(prop)) {
        return prop.map(p => p.plain_text || p.text?.content || "").join("");
    }
    // Handle direct string
    if (typeof prop === "string") return prop;
    // Handle rich_text object
    if (prop.rich_text) {
        return prop.rich_text.map(p => p.plain_text || "").join("");
    }
    return "";
}

function extractMultiSelect(prop) {
    if (!prop) return [];
    if (Array.isArray(prop)) {
        return prop.map(t => typeof t === 'string' ? t : t.name).filter(Boolean);
    }
    if (prop.multi_select) {
        return prop.multi_select.map(t => t.name).filter(Boolean);
    }
    return [];
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. EXTRACT CORE IDENTIFIERS
// ═══════════════════════════════════════════════════════════════════════════

const pageId = item.id;
const sessionId = sanitizeText(item.property_session_id) || `session_${Date.now()}`;

// ═══════════════════════════════════════════════════════════════════════════
// 3. SHARED SEO METADATA
// ═══════════════════════════════════════════════════════════════════════════

const sharedMeta = {
    title: sanitizeText(extractPropertyText(item.property_shared_seo_title) || item.name || 'Untitled Post'),
    description: sanitizeText(extractPropertyText(item.property_shared_seo_description)),
    slug: sanitizeText(extractPropertyText(item.property_shared_slug)),
    tags: extractMultiSelect(item.property_shared_tags),
    canonicalUrl: sanitizeText(extractPropertyText(item.property_shared_canonical_url))
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. PLATFORM-SPECIFIC DRAFTS (Notion-Centric)
// ═══════════════════════════════════════════════════════════════════════════

const drafts = {
    twitter: sanitizeText(extractPropertyText(item.property_twitter_draft)),
    linkedin: sanitizeText(extractPropertyText(item.property_linkedin_draft)),
    sanityBlog: sanitizeText(extractPropertyText(item.property_sanity_blog_draft)),
    devTo: sanitizeText(extractPropertyText(item.property_devto_draft)),
    hashnode: sanitizeText(extractPropertyText(item.property_hashnode_draft)),
    hashnodeSubtitle: sanitizeText(extractPropertyText(item.property_hashnode_subtitle)),
    imageTaskList: sanitizeText(extractPropertyText(item.property_image_task_list))
};

// ═══════════════════════════════════════════════════════════════════════════
// 5. ASSET CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const driveFolderLink = sanitizeText(extractPropertyText(item.property_drive_folder_link));
let folderId = null;
if (driveFolderLink) {
    const match = driveFolderLink.match(/folders\/([a-zA-Z0-9_-]+)/);
    folderId = match ? match[1] : null;
}

const assets = {
    hasImages: !!item.property_has_images_assets || !!item.property_has_images,
    driveFolderLink: driveFolderLink,
    folderId: folderId
};

// ═══════════════════════════════════════════════════════════════════════════
// 6. PLATFORM SELECTION
// ═══════════════════════════════════════════════════════════════════════════

const postTo = extractMultiSelect(item.property_post_to);
const platforms = {
    twitter: postTo.includes('X') || postTo.includes('Twitter'),
    linkedin: postTo.includes('LinkedIn'),
    blog: postTo.includes('Blog'),
    devTo: postTo.includes('Dev.to') || postTo.includes('DevTo'),
    hashnode: postTo.includes('Hashnode')
};

// ═══════════════════════════════════════════════════════════════════════════
// 7. PARSE IMAGE MARKERS FROM DRAFTS
// ═══════════════════════════════════════════════════════════════════════════

function extractMarkers(text) {
    if (!text) return [];
    const matches = text.matchAll(/<<IMAGE_(\d+)>>/g);
    return [...new Set([...matches].map(m => parseInt(m[1])))].sort((a, b) => a - b);
}

const requiredImages = {
    twitter: extractMarkers(drafts.twitter),
    linkedin: extractMarkers(drafts.linkedin),
    blog: extractMarkers(drafts.sanityBlog),
    devTo: extractMarkers(drafts.devTo),
    hashnode: extractMarkers(drafts.hashnode),
    all: []
};

requiredImages.all = [...new Set([
    ...requiredImages.twitter,
    ...requiredImages.linkedin,
    ...requiredImages.blog,
    ...requiredImages.devTo,
    ...requiredImages.hashnode
])].sort((a, b) => a - b);

// ═══════════════════════════════════════════════════════════════════════════
// 8. OUTPUT FOR DOWNSTREAM NODES
// ═══════════════════════════════════════════════════════════════════════════

return [{
    json: {
        pageId,
        sessionId,
        sharedMeta,
        drafts,
        assets,
        platforms,
        requiredImages,
        // Legacy compatibility
        notionItem: item,
        folderId: assets.folderId
    }
}];
