const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ASSETS_JSON_PATH = path.join(__dirname, '../src/data/centralized-assets.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

// GitHub repo details
const GITHUB_USER = 'AmanSuryavanshi-1';
const GITHUB_REPO = 'portfolio-assets';
const BRANCH = 'main';

// CDN Base URL
const CDN_BASE = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${BRANCH}`;

try {
    const data = JSON.parse(fs.readFileSync(ASSETS_JSON_PATH, 'utf8'));

    // Find all files in public/Project to build path map
    const files = glob.sync('Project/**/*.{webp,png,jpg,jpeg}', { cwd: PUBLIC_DIR });

    // Build a map of filename -> relative path
    const fileMap = {};
    files.forEach(f => {
        const basename = path.basename(f);
        const nameWithoutExt = basename.replace(path.extname(basename), '');
        fileMap[nameWithoutExt] = f;
        fileMap[basename] = f;
    });

    // Update JSON with CDN links
    for (const projectKey in data) {
        data[projectKey] = data[projectKey].map(asset => {
            // Skip videos - they use YouTube
            if (asset.type === 'video') {
                return asset;
            }

            // Try to find local file
            let localPath = fileMap[asset.id] || fileMap[asset.filename];

            if (!localPath) {
                const base = asset.filename.replace(path.extname(asset.filename || ''), '');
                localPath = fileMap[base];
            }

            if (localPath) {
                // Construct CDN URL
                // Path in repo will be same as in public/Project, so we use localPath directly
                const cdnUrl = `${CDN_BASE}/${localPath.replace(/\\/g, '/')}`;
                const webUrl = '/' + localPath.replace(/\\/g, '/');

                return {
                    ...asset,
                    localPath: webUrl,
                    cdnUrl: cdnUrl,
                    filename: path.basename(localPath)
                };
            }

            return asset;
        });
    }

    fs.writeFileSync(ASSETS_JSON_PATH, JSON.stringify(data, null, 2));
    console.log('✅ Updated centralized-assets.json with CDN URLs');
    console.log(`   CDN Base: ${CDN_BASE}`);

} catch (err) {
    console.error('Error:', err);
}
