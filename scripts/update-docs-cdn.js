/**
 * Replace Cloudinary URLs with CDN URLs in markdown files
 * This script updates OMNI-POST-AI docs with CDN links
 */
const fs = require('fs');
const path = require('path');

// URL mapping: Cloudinary filename patterns → CDN URLs
const cdnMappings = {
    // OMNI-POST-AI Assets
    'Asset_1_Timeline_Evolution': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_1_Timeline_Evolution.webp',
    'Part_1_Generation_Workflow.jpg': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Part_1_Generation_Workflow.webp',
    'Part_1_Automation_COMPLETEFLOW_Content_Repurposing': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Part_1_Automation_COMPLETEFLOW_Content_Repurposing_zoomable.webp',
    'Part_2_Distribution_Workflow.jpg': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Part_2_Distribution_Workflow.webp',
    'Part_2__Automation_Content_Posting': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Part_2 _Automation_Content_Posting_zoomable.webp',
    'Asset_2_Notion_Database_Schema_FullSize_Screenshot': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_2_Notion_Database_Schema_FullSize_Screenshot_zoomable.webp',
    'Asset_2_Notion_Content_Queue_Database': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_2_Notion_Content_Queue_Database_zoomable.webp',
    'Asset_3_Metrics_Dashboard': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_3_Metrics_Dashboard.webp',
    'Asset_4_Error_Handling_Architecture': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_4_Error_Handling_Architecture.webp',
    'Asset_5_LLM_Routing': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset_5_LLM_Routing.webp',
    'Asset_6_Session-Based_File_Structure': 'https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/Asset 6 Session-Based File Structure.webp'
};

// Files to update
const filesToUpdate = [
    path.join(__dirname, '../Omni-Post-AI-Automation/OMNI-POST-AI-EXECUTIVE-SUMMARY.md'),
    path.join(__dirname, '../Omni-Post-AI-Automation/OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md'),
    path.join(__dirname, '../Omni-Post-AI-Automation/README.md')
];

filesToUpdate.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let replacementCount = 0;

    // Replace Cloudinary URLs with CDN URLs
    Object.entries(cdnMappings).forEach(([pattern, cdnUrl]) => {
        // Match Cloudinary URLs containing the pattern
        const regex = new RegExp(
            `https://res\\.cloudinary\\.com/dr0lrme36/image/upload/[^"\\s]+${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"\\s]*`,
            'g'
        );

        const matches = content.match(regex);
        if (matches) {
            content = content.replace(regex, cdnUrl);
            replacementCount += matches.length;
            console.log(`  Replaced ${matches.length} URLs matching "${pattern}"`);
        }
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.basename(filePath)}: ${replacementCount} replacements\n`);
});

console.log('Done!');
