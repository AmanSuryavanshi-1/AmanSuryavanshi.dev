const fs = require('fs');
const path = require('path');

const TRACKING_FILE = path.join(__dirname, 'migrated-assets.json');
const OUTPUT_FILE = path.join(__dirname, '../public/CLOUDINARY_ASSET_INVENTORY.md');

// Helper to generate description from filename
function generateDescription(filename, project) {
    const name = path.parse(filename).name;
    let desc = `Asset for the ${project} project.`;

    const lower = name.toLowerCase();

    if (lower.includes('mobile')) desc += ' Captures the mobile view/responsive design.';
    if (lower.includes('header')) desc += ' Shows the header/navigation section.';
    if (lower.includes('footer')) desc += ' Shows the footer section.';
    if (lower.includes('blog')) desc += ' Related to the blog section or a blog post.';
    if (lower.includes('contact')) desc += ' Shows the contact page or form.';
    if (lower.includes('workflow')) desc += ' Illustrates an automation workflow or process flow.';
    if (lower.includes('architecture')) desc += ' Depicts the system architecture or diagram.';
    if (lower.includes('schema')) desc += ' Shows a database schema or data structure.';
    if (lower.includes('lighthouse')) desc += ' Displays Google Lighthouse performance scores.';
    if (lower.includes('walkthrough')) desc += ' A video walkthrough demonstrating functionality.';
    if (lower.includes('logo')) desc += ' Project logo or branding element.';
    if (lower.includes('screenshot')) desc += ' Full page or partial screenshot of the interface.';
    if (lower.includes('timeline')) desc += ' Shows a timeline of events or evolution.';
    if (lower.includes('dashboard')) desc += ' View of the internal metrics or admin dashboard.';

    // If filename has spaces/underscores, replace with spaces for readability in the name
    const readableName = name.replace(/[-_]/g, ' ');
    return `${readableName}: ${desc}`;
}

function getProjectName(relativePath) {
    // Normalize separators
    const parts = relativePath.split(/[/\\]/);

    // Case 1: public/Project/<ProjectName>/...
    if (parts[0] === 'public' && parts[1] === 'Project' && parts[2]) {
        return parts[2];
    }

    // Case 2: REMOTE_ONLY/<ProjectName>/...
    // Special case: REMOTE_ONLY/aviators-training-centre
    // Special case: REMOTE_ONLY/Omni_post_Ai_autoamtion
    if (parts[0] === 'REMOTE_ONLY' && parts[1]) {
        // Clean up common folder names if needed
        if (parts[1] === 'aviators-training-centre') return 'AviatorsTrainingCentre';
        if (parts[1] === 'Omni_post_Ai_autoamtion') return 'Omni-Post-AI-Automation';
        return parts[1];
    }

    return 'Miscellaneous';
}

function main() {
    console.log('📖 Reading tracking file...');
    if (!fs.existsSync(TRACKING_FILE)) {
        console.error('❌ Tracking file not found!');
        return;
    }

    const assets = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
    const assetKeys = Object.keys(assets).sort();

    let inventory = '# Cloudinary Asset Inventory\n\n';
    inventory += 'This document serves as a centralized record of all assets migrated to Cloudinary for the portfolio projects. ';
    inventory += 'It is intended to provide context for Large Language Models (LLMs) and developers regarding which project an asset belongs to and what it represents.\n\n';
    inventory += '> **Note:** This file is generated automatically from `scripts/migrated-assets.json`.\n\n';

    // Group by Project
    const grouped = {};

    for (const key of assetKeys) {
        const project = getProjectName(key);
        if (!grouped[project]) grouped[project] = [];
        grouped[project].push({
            path: key,
            url: assets[key]
        });
    }

    const projects = Object.keys(grouped).sort();

    for (const project of projects) {
        inventory += `## 📂 Project: ${project}\n\n`;
        inventory += `| Asset Preview / Link | Description & Context |\n`;
        inventory += `| :--- | :--- |\n`;

        for (const item of grouped[project]) {
            const filename = path.basename(item.path);
            const url = item.url;
            const isVideo = url.includes('/video/upload');
            const desc = generateDescription(filename, project);

            // Thumbnail for listing
            let preview = '';
            if (isVideo) {
                preview = `[🎥 Watch Video](${url})`;
            } else {
                // Use Cloudinary transformation for a small thumbnail in the table to save space/bandwidth if rendered
                // But standard MD link is safer for raw reading. 
                // Let's use a small thumbnail image link wrapping the full image link
                // Cloudinary thumb: replace '/upload/' with '/upload/c_thumb,w_200,g_face/'
                const thumbUrl = url.replace('/upload/', '/upload/c_limit,w_200/');
                preview = `[![${filename}](${thumbUrl})](${url})`;
            }

            inventory += `| ${preview}<br>\`\`\`${filename}\`\`\` | **${desc}**<br><br>🔗 **Cloudinary URL**: ${url} |\n`;
        }
        inventory += '\n';
    }

    fs.writeFileSync(OUTPUT_FILE, inventory);
    console.log(`✅ Generated inventory at: ${OUTPUT_FILE}`);
}

main();
