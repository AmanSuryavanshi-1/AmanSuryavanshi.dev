const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');

// Configuration
const CONFIG = {
    standard: {
        webpQuality: 80,
        jpegQuality: 80,
        pngCompression: 6
    },
    zoomable: {
        webpQuality: 100, // Near lossless
        jpegQuality: 100,
        pngCompression: 9, // Max compression but lossless
        lossless: true
    }
};

async function optimizeImages() {
    console.log('🔍 Scanning for images in public directory...');

    // Find all images
    const images = glob.sync('**/*.{png,jpg,jpeg,webp}', {
        cwd: PUBLIC_DIR,
        ignore: ['**/node_modules/**', '**/dist/**']
    });

    console.log(`found ${images.length} images.`);

    let validImages = 0;
    let savings = 0;

    for (const relativePath of images) {
        const inputPath = path.join(PUBLIC_DIR, relativePath);
        const filename = path.basename(relativePath);
        const ext = path.extname(filename).toLowerCase();

        // Skip already optimized webp files if we generated them (optional check)
        // For now, we process everything.

        const isZoomable = filename.includes('_zoomable');
        const options = isZoomable ? CONFIG.zoomable : CONFIG.standard;
        const typeLabel = isZoomable ? '[ZOOMABLE]' : '[STANDARD]';

        try {
            const originalStats = fs.statSync(inputPath);
            const originalSize = originalStats.size;

            console.log(`Processing ${typeLabel}: ${relativePath} (${(originalSize / 1024).toFixed(1)}KB)`);

            const pipeline = sharp(inputPath);
            const metadata = await pipeline.metadata();

            // 1. Optimize Original (In-place)
            // Create temp file first to avoid corruption
            const tempPath = inputPath + '.tmp';

            if (ext === '.png') {
                await pipeline.clone().png({ quality: options.webpQuality, compressionLevel: options.pngCompression, force: false }).toFile(tempPath);
            } else if (ext === '.jpg' || ext === '.jpeg') {
                await pipeline.clone().jpeg({ quality: options.jpegQuality, mozjpeg: true }).toFile(tempPath);
            } else if (ext === '.webp') {
                await pipeline.clone().webp({ quality: options.webpQuality, lossless: isZoomable }).toFile(tempPath);
            }

            // Check if temp file is smaller or if we want to enforce optimization
            const tempStats = fs.statSync(tempPath);
            if (tempStats.size < originalSize) {
                fs.renameSync(tempPath, inputPath);
                savings += (originalSize - tempStats.size);
                console.log(`  ✅ Optimized original: -${((originalSize - tempStats.size) / 1024).toFixed(1)}KB`);
            } else {
                fs.unlinkSync(tempPath); // Discard if larger (rare, but happens with already optimized files)
                console.log(`  ⏭️  Skipped original (already optimized)`);
            }

            // 2. Generate WebP Version (if not already WebP)
            if (ext !== '.webp') {
                const webpPath = inputPath.replace(/\.[^.]+$/, '.webp');
                // Check if webp exists, if so, maybe skip or overwrite? Overwrite to ensure sync.

                await pipeline.clone().webp({ quality: options.webpQuality, lossless: isZoomable }).toFile(webpPath);
                const webpStats = fs.statSync(webpPath);
                console.log(`  ✨ Generated WebP: ${path.basename(webpPath)} (${(webpStats.size / 1024).toFixed(1)}KB)`);
            }

            validImages++;

        } catch (err) {
            console.error(`  ❌ Error processing ${relativePath}:`, err.message);
        }
    }

    console.log('------------------------------------------------');
    console.log(`🎉 Optimization Complete!`);
    console.log(`Processed: ${validImages} images`);
    console.log(`Total Savings on Originals: ${(savings / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages();
