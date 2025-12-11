const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ASSETS_JSON_PATH = path.join(__dirname, '../src/data/centralized-assets.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Base mapping of project directory names to JSON keys
const PROJ_MAP = {
    'AV-NewsStream': 'AV-NewsStream',
    'AviatorsTrainingCentre': 'AviatorsTrainingCentre',
    'BarkatEnterprise': 'BarkatEnterprise',
    'Ecommerce': 'Ecommerce',
    'Foodah': 'Foodah',
    'Omni-Post-AI-Automation': 'Omni-Post-AI-Automation',
    'Omni_post_Ai_autoamtion/omni_post_ai_assets': 'Omni-Post-AI-Automation', // Cloudinary folder structure nuance
    'Portfolio': 'Portfolio'
};

try {
    const data = JSON.parse(fs.readFileSync(ASSETS_JSON_PATH, 'utf8'));

    // Create a reverse search map for files
    // Find all files in public/Project
    const files = glob.sync('Project/**/*.{png,jpg,jpeg,webp,mp4,webm}', { cwd: PUBLIC_DIR });

    // Build a map of filename -> relative path
    const fileMap = {};
    files.forEach(f => {
        const basename = path.basename(f);
        const nameWithoutExt = basename.replace(path.extname(basename), '');
        // Store both exact match and name-without-extension for easier lookup
        // Prefer WebP if available for same name
        if (!fileMap[nameWithoutExt] || f.endsWith('.webp')) {
            fileMap[nameWithoutExt] = f;
        }
        // Also store exact full filename mapping
        fileMap[basename] = f;
    });

    // Update JSON
    for (const projectKey in data) {
        data[projectKey] = data[projectKey].map(asset => {
            // If manual YouTube URL exists, keep it

            // Try to find local file
            // Strategy: 
            // 1. Look for ID match (usually ID == filename without ext)
            // 2. Look for filename match
            // 3. Look for filename but with .webp extension

            let localPath = fileMap[asset.id] || fileMap[asset.filename];

            if (!localPath) {
                // Try swapping extension to .webp
                const base = asset.filename.replace(path.extname(asset.filename), '');
                localPath = fileMap[base];
            }

            if (localPath) {
                // If we found a local file, update the record
                // If it's an image, prefer the .webp version if we found it in the map

                // Construct standard local URL (for now /Project/...)
                // Standardize path separators
                const webUrl = '/' + localPath.replace(/\\/g, '/');

                return {
                    ...asset,
                    localPath: webUrl,
                    // If we found a differnet filename (e.g. webp), update it
                    filename: path.basename(localPath)
                };
            }

            return asset;
        });
    }

    fs.writeFileSync(ASSETS_JSON_PATH, JSON.stringify(data, null, 2));
    console.log('Updated centralized-assets.json with local paths.');

} catch (err) {
    console.error(err);
}
