const fs = require('fs');
const path = require('path');

const srcDir = 'A:\\\\_Coding_Notes_Projects_IMP_\\\\MAJOR PROJECTS\\\\DentalKart';
const destCodebaseDir = path.join(__dirname, '..', 'src', 'content', 'projects');
const destSBDir = 'A:\\\\_SecondBrain\\\\02-Projects\\\\Dental-AI-Automation-Suite\\\\docs';

const filesToProcess = [
    { src: 'README.md', destName: 'dental-ai-executive-summary.md' },
    { src: 'TECHNICAL-DOCUMENTATION.md', destName: 'dental-ai-technical-documentation.md' }
];

function processContent(content) {
    // 1. Sanitize names
    let processed = content.replace(/DentalKart/gi, 'Dental AI Automation Suite');
    processed = processed.replace(/dentalkart/gi, 'dental-ai');

    // 2. Replace YouTube links with iframes
    processed = processed.replace(/\[\!\[.*?\]\(https:\/\/img\.youtube\.com\/vi\/([^/]+)\/0\.jpg\)\]\(https:\/\/youtu\.be\/[^)]+\)/g, (match, videoId) => {
        return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">\n  <iframe src="https://www.youtube.com/embed/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n</div>`;
    });

    return processed;
}

for (const file of filesToProcess) {
    const srcPath = path.join(srcDir, file.src);
    if (!fs.existsSync(srcPath)) {
        console.error(`Missing source file: ${srcPath}`);
        continue;
    }

    const rawContent = fs.readFileSync(srcPath, 'utf8');
    const processedContent = processContent(rawContent);

    // Write to codebase
    const codebaseDest = path.join(destCodebaseDir, file.destName);
    fs.writeFileSync(codebaseDest, processedContent, 'utf8');
    console.log(`Updated codebase: ${codebaseDest}`);

    // Write to SecondBrain (append linking)
    const sbDest = path.join(destSBDir, file.destName);
    if (!fs.existsSync(destSBDir)) {
        fs.mkdirSync(destSBDir, { recursive: true });
    }
    const sbContent = processedContent + '\n\n---\n## Related\n- Up: [[📖 PROJECT]]\n';
    fs.writeFileSync(sbDest, sbContent, 'utf8');
    console.log(`Updated SecondBrain: ${sbDest}`);
}
console.log('Sync and processing complete.');
