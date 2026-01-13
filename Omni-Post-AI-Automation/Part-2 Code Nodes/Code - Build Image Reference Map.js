// ════════════════════════════════════════════════════════════════════════════
// IMAGE REFERENCE MAP BUILDER (v3.0)
// Builds a map of uploaded images (Sanity CDN URLs) for marker replacement
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════
    // 1. GET UPLOADED IMAGES FROM SANITY
    // ═══════════════════════════════════════════════════════════════════════

    // Images should come from the Sanity upload node
    const uploadedImages = $('Upload Image to Sanity').all() || [];
    const masterData = $('Code - Master Data Extractor').first().json;

    // ═══════════════════════════════════════════════════════════════════════
    // 2. BUILD THE MAP
    // ═══════════════════════════════════════════════════════════════════════

    const imageMap = [];

    uploadedImages.forEach(item => {
        const asset = item.json?.document?.asset || item.json?.asset || item.json;

        if (asset?.url || asset?._id) {
            // Try to extract image number from filename or order
            let imageNum = 1;
            const fileName = asset.originalFilename || item.json?.fileName || '';
            const numMatch = fileName.match(/asset[-_]?(\d+)/i);
            if (numMatch) {
                imageNum = parseInt(numMatch[1]);
            }

            const cdnUrl = asset.url ||
                `https://cdn.sanity.io/images/${asset.projectId}/${asset.dataset}/${asset._id.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg').replace('-webp', '.webp')}`;

            imageMap.push({
                json: {
                    marker: `<<IMAGE_${imageNum}>>`,
                    cdnUrl: cdnUrl,
                    alt: masterData?.sharedMeta?.title || `Image ${imageNum}`,
                    sanityId: asset._id || null
                }
            });
        }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // 3. HANDLE NO IMAGES CASE
    // ═══════════════════════════════════════════════════════════════════════

    if (imageMap.length === 0) {
        console.log('ℹ️ No images uploaded to Sanity - posts will be text-only');
        return [{
            json: {
                marker: null,
                cdnUrl: null,
                alt: null,
                noImages: true
            }
        }];
    }

    console.log(`✅ Image Map Builder: Mapped ${imageMap.length} image(s)`);
    return imageMap;

} catch (error) {
    console.error('❌ Image Map Error:', error.message);
    return [{
        json: {
            marker: null,
            cdnUrl: null,
            error: error.message
        }
    }];
}
