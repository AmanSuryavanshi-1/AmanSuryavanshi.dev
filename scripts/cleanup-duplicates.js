const fs = require('fs');
const path = require('path');
const glob = require('glob');

const PUBLIC_DIR = path.join(__dirname, '../public');

console.log('🧹 Starting safe cleanup of redundant original images...');

const files = glob.sync('**/*.{png,jpg,jpeg}', { cwd: PUBLIC_DIR });
let deletedCount = 0;
let skippedZoomable = 0;
let skippedNoWebP = 0;

files.forEach(file => {
    const fullPath = path.join(PUBLIC_DIR, file);
    const dir = path.dirname(fullPath);
    const ext = path.extname(file);
    const basename = path.basename(file, ext);

    // Check for corresponding WebP
    const webpPath = path.join(dir, basename + '.webp');

    if (fs.existsSync(webpPath)) {
        // WebP equivalent exists.

        // Safety check: Is it marked as zoomable?
        if (file.includes('_zoomable')) {
            console.log(`🔒 Preserving ZOOMABLE original: ${file}`);
            skippedZoomable++;
        } else {
            try {
                fs.unlinkSync(fullPath);
                console.log(`🗑️  Deleted redundant: ${file}`);
                deletedCount++;
            } catch (e) {
                console.error(`❌ Error deleting ${file}:`, e.message);
            }
        }
    } else {
        // No WebP found, keeping original
        skippedNoWebP++;
    }
});

console.log('------------------------------------------------');
console.log(`Cleanup Summary:`);
console.log(`✅ Deleted (Redundant): ${deletedCount}`);
console.log(`🔒 Preserved (Zoomable): ${skippedZoomable}`);
console.log(`📁 Preserved (No WebP): ${skippedNoWebP}`);
