// ════════════════════════════════════════════════════════════════════════════
// IMAGE REFERENCE MAP BUILDER V5.0 (PRODUCTION - WITH CDN URLs)
// Builds a map of uploaded images for Sanity blog post AND CDN URLs for DevTo/Hashnode
// FIXED: Includes cdnUrl for cross-platform image embedding
// ════════════════════════════════════════════════════════════════════════════

try {
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. CONFIGURATION - Sanity CDN URL Pattern
    // ═══════════════════════════════════════════════════════════════════════════

    // Sanity CDN URL format: https://cdn.sanity.io/images/{projectId}/{dataset}/{assetId}.{extension}
    const SANITY_PROJECT_ID = 'ero5c9mt';
    const SANITY_DATASET = 'production';

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. GET UPLOADED IMAGES FROM INPUT (comes from Loop Over Images done output)
    // ═══════════════════════════════════════════════════════════════════════════

    // The input is the aggregate of all Upload Image to Sanity responses
    const uploadedItems = $input.all() || [];

    console.log(`📥 Received ${uploadedItems.length} uploaded image responses`);

    if (uploadedItems.length === 0) {
        console.log('ℹ️ No images uploaded to Sanity - text-only post');
        return [{
            json: {
                marker: null,
                assetId: null,
                cdnUrl: null,
                alt: null,
                noImages: true
            }
        }];
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. BUILD THE MAP - Extract info from Sanity response + construct CDN URL
    // ═══════════════════════════════════════════════════════════════════════════

    const imageMap = [];

    uploadedItems.forEach((item, index) => {
        // Sanity upload response structure varies - handle different formats
        const response = item.json || {};

        // Try different paths to get the document/asset data
        const document = response.body?.document || response.document || response;
        const assetId = document?._id || document?.asset?._id || '';

        // Get filename from various possible locations
        const originalFilename = document?.originalFilename ||
            document?.asset?.originalFilename ||
            response.originalFilename ||
            '';

        // Get URL directly from response if available
        let cdnUrl = document?.url || document?.asset?.url || '';

        // If no direct URL, construct it from asset ID
        // Asset ID format: image-{hash}-{width}x{height}-{extension}
        if (!cdnUrl && assetId) {
            // Extract the image reference from asset ID (e.g., "image-abc123-1920x1080-png")
            const idMatch = assetId.match(/^image-([a-zA-Z0-9]+)-(\d+x\d+)-(\w+)$/);
            if (idMatch) {
                cdnUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${idMatch[1]}-${idMatch[2]}.${idMatch[3]}`;
            }
        }

        // Extract image number from filename (e.g., "asset-1.png" → 1)
        let imageNumber = index + 1; // Default to order in array

        if (originalFilename) {
            const numMatch = originalFilename.match(/asset[-_]?(\d+)/i);
            if (numMatch) {
                imageNumber = parseInt(numMatch[1], 10);
            } else {
                // Try matching just a number at start (e.g., "1.png")
                const startNumMatch = originalFilename.match(/^(\d+)[._-]/);
                if (startNumMatch) {
                    imageNumber = parseInt(startNumMatch[1], 10);
                }
            }
        }

        if (assetId) {
            console.log(`✅ Image ${imageNumber}: ${originalFilename || 'unknown'} → ${assetId}`);
            if (cdnUrl) {
                console.log(`   CDN URL: ${cdnUrl}`);
            }

            imageMap.push({
                json: {
                    marker: `<<IMAGE_${imageNumber}>>`,
                    imageNumber: imageNumber,
                    assetId: assetId,
                    cdnUrl: cdnUrl, // CRITICAL: This is used by DevTo/Hashnode
                    alt: `Blog image ${imageNumber}`,
                    caption: '',
                    originalFilename: originalFilename || `image-${imageNumber}`
                }
            });
        } else {
            console.warn(`⚠️ Upload ${index} has no asset ID`);
        }
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. SORT BY IMAGE NUMBER (ensure correct order for blog)
    // ═══════════════════════════════════════════════════════════════════════════

    imageMap.sort((a, b) => a.json.imageNumber - b.json.imageNumber);

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. OUTPUT
    // ═══════════════════════════════════════════════════════════════════════════

    if (imageMap.length === 0) {
        console.log('⚠️ No valid asset IDs found in upload responses');
        return [{
            json: {
                marker: null,
                assetId: null,
                error: 'No valid uploads',
                noImages: true
            }
        }];
    }

    console.log(`✅ Image Map Builder V4.0: Mapped ${imageMap.length} image(s)`);
    imageMap.forEach(img => {
        console.log(`   ${img.json.marker} → ${img.json.assetId}`);
    });

    return imageMap;

} catch (error) {
    console.error('❌ Image Map Error:', error.message);
    return [{
        json: {
            marker: null,
            assetId: null,
            error: error.message
        }
    }];
}
