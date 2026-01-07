const fs = require('fs');
const path = require('path');
const glob = require('glob');

const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_PATH = path.join(__dirname, '../src/data/centralized-assets.json');

// GitHub repo details
const GITHUB_USER = 'AmanSuryavanshi-1';
const GITHUB_REPO = 'portfolio-assets';
const BRANCH = 'main';
const CDN_BASE = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${BRANCH}`;

// YouTube URL mapping
const youtubeMap = {
    'AviatorsTrainingCenter_WalkThrough': 'https://youtu.be/lk35G_YVbSo',
    'AviatorsTrainingCenter_WalkThrough_720p': 'https://youtu.be/lk35G_YVbSo',
    'AVNewsStream': 'https://youtu.be/IkFf7UnI2U4',
    'Foodah': 'https://youtu.be/GwJz9MRstuU',
    'Enterprise_FullWalkThrough': 'https://youtu.be/jBLsJyNLVcA'
};

// Cloudinary URL mapping (from original inventory)
const cloudinaryMap = {
    // AV-NewsStream
    'AV-NewsStream-mobile': 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/AV-NewsStream/AV-NewsStream-mobile',
    'AV-NewsStream': 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/AV-NewsStream/AV-NewsStream',
    // Foodah
    'Foodah-mobile': 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/Foodah/Foodah-mobile',
    'Foodah': 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/Foodah/Foodah',
    // Enterprise
    'Enterprise-mobile': 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/BarkatEnterprise/Enterprise-mobile',
    'Enterprise': 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto/q_auto/c_limit,w_1600/v1/BarkatEnterprise/Enterprise',
};

try {
    console.log('🔄 Regenerating complete asset inventory from public/Project...');

    // Find all files in public/Project
    const allFiles = glob.sync('Project/**/*.{webp,png,jpg,jpeg,mp4,webm}', { cwd: PUBLIC_DIR });

    const projects = {};

    allFiles.forEach(relativePath => {
        const parts = relativePath.split(/[\/\\]/);
        // Example: Project/AV-NewsStream/file.webp -> projectName = AV-NewsStream
        if (parts.length < 3) return;

        const projectName = parts[1];
        const filename = path.basename(relativePath);
        const ext = path.extname(filename).toLowerCase();
        const nameWithoutExt = filename.replace(ext, '');

        const isVideo = ['.mp4', '.webm', '.mov'].includes(ext);

        // Build asset object
        const asset = {
            id: nameWithoutExt,
            filename: filename,
            type: isVideo ? 'video' : 'image',
            localPath: '/' + relativePath.replace(/\\/g, '/')
        };

        // Add CDN URL (only for non-video)
        if (!isVideo) {
            // Remove 'Project/' prefix since repo was initialized inside public/Project
            const repoPath = relativePath.replace(/^Project[\\/]/, '');
            asset.cdnUrl = `${CDN_BASE}/${repoPath.replace(/\\/g, '/')}`;
        }

        // Add Cloudinary URL if available
        if (cloudinaryMap[nameWithoutExt]) {
            asset.cloudinaryUrl = cloudinaryMap[nameWithoutExt];
        }

        // Add YouTube URL for videos
        if (isVideo) {
            for (const [key, ytUrl] of Object.entries(youtubeMap)) {
                if (nameWithoutExt.includes(key) || filename.includes(key)) {
                    asset.youtubeUrl = ytUrl;
                    break;
                }
            }
        }

        if (!projects[projectName]) {
            projects[projectName] = [];
        }
        projects[projectName].push(asset);
    });

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(projects, null, 2));
    console.log(`✅ Generated complete asset inventory`);
    console.log(`   Total projects: ${Object.keys(projects).length}`);
    console.log(`   Total assets: ${allFiles.length}`);

} catch (err) {
    console.error('Error:', err);
}
