/**
 * FINAL EXACT Markdown-to-Sanity Converter
 * Features:
 * 1. Uploads Cloudinary images to SanityAssets
 * 2. Parses inline markdown (**bold**, *italic*, `code`) properly
 * 3. Handles HTML blocks and Tables
 * Run: node scripts/create-final-omni-post-blog.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const https = require('https');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
    console.error('Missing Sanity credentials');
    process.exit(1);
}

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

// Helper: Download image to buffer
function downloadImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        });
    });
}

// Helper: Upload asset to Sanity
async function uploadImageToSanity(url) {
    try {
        console.log(`Downloading ${url}...`);
        const buffer = await downloadImage(url);

        console.log(`Uploading to Sanity...`);
        const uploadRes = await fetch(`${SANITY_API_URL}/assets/images/${dataset}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'image/jpeg', // Assuming jpeg/png, API detects mostly
                Authorization: `Bearer ${token}`
            },
            body: buffer
        });

        const json = await uploadRes.json();
        if (json.document) {
            console.log(`Asset uploaded: ${json.document._id}`);
            return json.document._id;
        } else {
            console.error('Upload failed:', json);
            return null;
        }
    } catch (err) {
        console.error('Error uploading image:', err.message);
        return null;
    }
}

// Helper Keys
const createKey = () => Math.random().toString(36).substring(2, 12);

// Inline styles parser
function parseInlineMarkdown(text) {
    if (!text) return [];

    // We need to split correctly. 
    // Regex to match **bold**, *italic*, `code`, [link](url)
    // This is a simple tokenizer.

    const children = [];
    let buffer = text;

    // Simple state machine or just regex replace is hard for nested/mixed.
    // Let's use a simplified approach that handles the most common cases in this doc.
    // The doc mainly uses **bold**, *italic*, and `code`.

    // We will scan the string and look for markers.
    // Markers: **, *, `

    let i = 0;
    let currentText = '';

    while (i < buffer.length) {
        // Check for Bold **
        if (buffer.startsWith('**', i)) {
            if (currentText) {
                children.push({ _type: 'span', _key: createKey(), text: currentText, marks: [] });
                currentText = '';
            }
            const end = buffer.indexOf('**', i + 2);
            if (end !== -1) {
                children.push({
                    _type: 'span',
                    _key: createKey(),
                    text: buffer.slice(i + 2, end),
                    marks: ['strong']
                });
                i = end + 2;
                continue;
            }
        }

        // Check for Code `
        if (buffer[i] === '`') {
            if (currentText) {
                children.push({ _type: 'span', _key: createKey(), text: currentText, marks: [] });
                currentText = '';
            }
            const end = buffer.indexOf('`', i + 1);
            if (end !== -1) {
                children.push({
                    _type: 'span',
                    _key: createKey(),
                    text: buffer.slice(i + 1, end),
                    marks: ['code']
                });
                i = end + 1;
                continue;
            }
        }

        // Check for Italic * (only if not ** - handled above)
        // Note: *foo* is italic. 
        if (buffer[i] === '*') {
            // Ensure it's not part of ** (already checked above logic?)
            // Since we checked ** first, finding a single * here means it really is single *
            if (currentText) {
                children.push({ _type: 'span', _key: createKey(), text: currentText, marks: [] });
                currentText = '';
            }
            const end = buffer.indexOf('*', i + 1);
            if (end !== -1 && !buffer.startsWith('**', i)) {
                children.push({
                    _type: 'span',
                    _key: createKey(),
                    text: buffer.slice(i + 1, end),
                    marks: ['em']
                });
                i = end + 1;
                continue;
            }
        }

        currentText += buffer[i];
        i++;
    }

    if (currentText) {
        children.push({ _type: 'span', _key: createKey(), text: currentText, marks: [] });
    }

    return children;
}


async function parseMarkdownToBlocks(markdown) {
    const blocks = [];
    const lines = markdown.split('\n');
    let i = 0;
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLang = '';

    while (i < lines.length) {
        let line = lines[i];

        // 1. Code Blocks
        if (line.trim().startsWith('```')) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                codeBlockLang = line.replace('```', '').trim() || 'text';
                codeBlockContent = '';
            } else {
                blocks.push({
                    _type: 'code',
                    _key: createKey(),
                    language: codeBlockLang,
                    code: codeBlockContent.trim()
                });
                inCodeBlock = false;
            }
            i++;
            continue;
        }
        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            i++;
            continue;
        }

        // 2. Tables
        if (line.trim().startsWith('|') && line.includes('|')) {
            const tableRows = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                const rowLine = lines[i].trim();

                // Check if this is a separator row (contains only |, -, :, and spaces)
                // Separator rows look like: |---|---|---| or |:---:|:---:| etc.
                const isSeparatorRow = /^\|[\s\-:|]+\|$/.test(rowLine) ||
                    rowLine.split('|').slice(1, -1).every(cell => /^[\s\-:]+$/.test(cell));

                if (!isSeparatorRow) {
                    const cells = rowLine.split('|').slice(1, -1).map(c => c.trim().replace(/^\*\*(.*?)\*\*$/, '$1'));
                    // Only add row if it has content (not just empty cells)
                    if (cells.length > 0 && cells.some(c => c.length > 0)) {
                        tableRows.push({ _type: 'row', _key: createKey(), cells });
                    }
                }
                i++;
            }
            if (tableRows.length > 0) blocks.push({ _type: 'table', _key: createKey(), rows: tableRows });
            continue;
        }

        // 3. HTML Images (<img src="...">) or <p><img></p>
        if (line.trim().startsWith('<p') || line.trim().startsWith('<img')) {
            let htmlBlock = line;
            // Capture full HTML block
            while (i + 1 < lines.length && !lines[i].trim().endsWith('</p>') && !lines[i].includes('/>') && lines[i + 1].trim().startsWith('<')) {
                i++;
                htmlBlock += ' ' + lines[i];
            }

            const srcMatch = htmlBlock.match(/src="([^"]+)"/);
            const altMatch = htmlBlock.match(/alt="([^"]+)"/);
            const captionMatch = htmlBlock.match(/<em>(.*?)<\/em>/);

            if (srcMatch) {
                const url = srcMatch[1];
                const assetId = await uploadImageToSanity(url);

                if (assetId) {
                    blocks.push({
                        _type: 'image',
                        _key: createKey(),
                        asset: { _type: 'reference', _ref: assetId },
                        alt: altMatch ? altMatch[1] : 'Image',
                        caption: captionMatch ? captionMatch[1] : ''
                    });
                } else {
                    // Fallback if upload fails
                    blocks.push({
                        _type: 'block', _key: createKey(), style: 'normal',
                        children: [{ _type: 'span', _key: createKey(), text: `[Failed to upload image: ${url}]`, marks: [] }]
                    });
                }
            }
            i++;
            continue;
        }

        // Skip closing tags
        if (line.trim().startsWith('</p>')) { i++; continue; }

        // 4. Headings
        const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headerMatch) {
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: `h${headerMatch[1].length}`,
                children: parseInlineMarkdown(headerMatch[2]) // Parse bold in headers too
            });
            i++;
            continue;
        }

        // 5. Blockquotes
        if (line.trim().startsWith('>')) {
            const text = line.replace(/^>\s?/, '').trim();
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'blockquote',
                children: parseInlineMarkdown(text)
            });
            i++;
            continue;
        }

        // 6. Lists
        if (line.match(/^\s*[-*]\s+/)) {
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'normal',
                listItem: 'bullet',
                level: 1,
                children: parseInlineMarkdown(line.replace(/^\s*[-*]\s+/, ''))
            });
            i++;
            continue;
        }
        if (line.match(/^\s*\d+\.\s+/)) {
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'normal',
                listItem: 'number',
                level: 1,
                children: parseInlineMarkdown(line.replace(/^\s*\d+\.\s+/, ''))
            });
            i++;
            continue;
        }

        // 7. Divider
        if (line.trim() === '---') { i++; continue; }
        if (line.trim() === '') { i++; continue; }

        // 8. Paragraphs
        blocks.push({
            _type: 'block',
            _key: createKey(),
            style: 'normal',
            children: parseInlineMarkdown(line)
        });

        i++;
    }
    return blocks;
}


async function run() {
    const mdPath = path.join(__dirname, '..', 'Omni-Post-AI-Automation', 'OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md');
    const markdownContent = fs.readFileSync(mdPath, 'utf-8');

    console.log('Parsing and uploading assets (this may take 1-2 mins)...');
    const body = await parseMarkdownToBlocks(markdownContent);

    console.log(`Generated ${body.length} blocks. Uploading to Sanity...`);

    const doc = {
        _type: 'post',
        title: 'Omni-Post AI: Technical Documentation',
        slug: { _type: 'slug', current: 'omni-post-ai-technical-documentation' },
        status: 'published',
        publishedAt: new Date().toISOString(),
        excerpt: 'Complete technical documentation for the Omni-Post AI Automation system.',
        body: body
    };

    // Delete existing
    const query = `*[_type=="post" && slug.current=="omni-post-ai-technical-documentation"][0]._id`;
    try {
        const res = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.result) {
            console.log(`Deleting ${json.result}...`);
            await fetch(`${SANITY_API_URL}/data/mutate/${dataset}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ mutations: [{ delete: { id: json.result } }] })
            });
        }

        // Create new
        const mutRes = await fetch(`${SANITY_API_URL}/data/mutate/${dataset}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ mutations: [{ create: doc }] })
        });
        console.log('Done!');

    } catch (err) {
        console.error(err);
    }
}

run();
