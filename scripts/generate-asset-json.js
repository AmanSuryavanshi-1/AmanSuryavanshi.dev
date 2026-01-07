const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '../public/CLOUDINARY_ASSET_INVENTORY.md');
// const jsonPath = path.join(__dirname, '../Omni-Post-AI-Automation/cloudinary-assets.json'); // Optional for cross-check

const youtubeMap = {
    'AviatorsTrainingCenter_WalkThrough': 'https://youtu.be/lk35G_YVbSo',
    'AviatorsTrainingCenter_WalkThrough_720p': 'https://youtu.be/lk35G_YVbSo', // Mapping both to same if needed
    'AVNewsStream': 'https://youtu.be/IkFf7UnI2U4',
    'Foodah': 'https://youtu.be/GwJz9MRstuU',
    'Enterprise_FullWalkThrough': 'https://youtu.be/jBLsJyNLVcA'
};

try {
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const projects = {};
    let currentProject = '';

    const lines = mdContent.split('\n');

    for (const line of lines) {
        // Detect Project Header
        const projectMatch = line.match(/^## 📂 Project: (.+)$/);
        if (projectMatch) {
            currentProject = projectMatch[1].trim();
            projects[currentProject] = [];
            continue;
        }

        // Detect Table Row
        // | [![Alt](PreviewUrl)](Url)<br>```Filename``` | **Description**... 🔗 **Cloudinary URL**: ActualUrl |
        if (line.trim().startsWith('|') && !line.includes('Asset Preview / Link') && !line.includes(':---')) {
            // Very basic extraction strategy

            // Extract filename from code block
            const filenameMatch = line.match(/```([^`]+)```/);
            if (!filenameMatch) continue;
            const fullFilename = filenameMatch[1];

            // Extract Cloudinary URL from the Description column (last part of line)
            // Look for "🔗 **Cloudinary URL**: " followed by url
            const urlMatch = line.match(/🔗 \*\*Cloudinary URL\*\*: (https:\/\/[^ ]+)/);
            if (!urlMatch) continue;
            const url = urlMatch[1].trim();

            const isVideo = url.includes('/video/upload/');
            const nameWithoutExt = fullFilename.replace(/\.[^/.]+$/, "");

            const assetData = {
                id: nameWithoutExt,
                filename: fullFilename,
                cloudinaryUrl: url,
                type: isVideo ? 'video' : 'image'
            };

            // Add YouTube link if video and matches map
            if (isVideo && youtubeMap[nameWithoutExt]) {
                assetData.youtubeUrl = youtubeMap[nameWithoutExt];
            }
            // Handle the specific naming mismatch if any (e.g. Aviators...720p)
            for (const [key, ytUrl] of Object.entries(youtubeMap)) {
                if (fullFilename.includes(key)) {
                    assetData.youtubeUrl = ytUrl;
                }
            }

            if (currentProject) {
                projects[currentProject].push(assetData);
            }
        }
    }

    const outputPath = path.join(__dirname, '../src/data/centralized-assets.json');
    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));
    console.log(`Generated unified asset registry at ${outputPath}`);

} catch (err) {
    console.error('Error generating asset JSON:', err);
}
