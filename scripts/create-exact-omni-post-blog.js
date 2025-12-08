/**
 * EXACT Markdown-to-Sanity Converter for Omni-Post AI Technical Documentation
 * Run: node scripts/create-exact-omni-post-blog.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
    console.error('Missing Sanity credentials in .env.local');
    process.exit(1);
}

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;

// Read the markdown file
const mdPath = path.join(__dirname, '..', 'Omni-Post-AI-Automation', 'OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md');
const markdownContent = fs.readFileSync(mdPath, 'utf-8');

// Helper to create unique keys
const createKey = () => Math.random().toString(36).substring(2, 12);

function parseMarkdownToBlocks(markdown) {
    const blocks = [];
    const lines = markdown.split('\n');
    let i = 0;
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLang = '';

    while (i < lines.length) {
        let line = lines[i];

        // 1. Handle Code Blocks
        if (line.trim().startsWith('```')) {
            if (!inCodeBlock) {
                // Start of code block
                inCodeBlock = true;
                codeBlockLang = line.replace('```', '').trim() || 'text';
                codeBlockContent = '';
            } else {
                // End of code block
                blocks.push({
                    _type: 'code',
                    _key: createKey(),
                    language: codeBlockLang,
                    code: codeBlockContent.trim() // Remove trailing newline
                });
                inCodeBlock = false;
                codeBlockContent = '';
                codeBlockLang = '';
            }
            i++;
            continue;
        }

        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            i++;
            continue;
        }

        // 2. Handle Tables
        // Check if line starts with | and contains | (simple heuristic)
        if (line.trim().startsWith('|') && line.includes('|')) {
            const tableRows = [];
            // Read adjacent lines that look like table rows
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                const rowLine = lines[i];

                // Skip separation lines (e.g. |---|---|)
                if (!rowLine.match(/^\|[\s\-:|]+\|$/)) {
                    // Parse cells: split by trailing |, recursive split? 
                    // Simple split by | and trimming
                    const cells = rowLine
                        .split('|')
                        .slice(1, -1) // remove first and last empty elements from split
                        .map(c => c.trim().replace(/^\*\*(.*?)\*\*$/, '$1')); // Remove wrapping bold for cell content cleanliness if desired, or keep it.
                    // Markdown usually: | Col 1 | Col 2 |
                    // Split result: ["", " Col 1 ", " Col 2 ", ""] using .split('|')

                    if (cells.length > 0) {
                        tableRows.push({
                            _type: 'row',
                            _key: createKey(),
                            cells: cells
                        });
                    }
                }
                i++;
            }

            if (tableRows.length > 0) {
                blocks.push({
                    _type: 'table',
                    _key: createKey(),
                    rows: tableRows
                });
            }
            // i is already advanced past table
            continue;
        }

        // 3. Handle HTML Tags (Images/Figures)
        // <p align="center"> <img ...> </p>
        if (line.trim().startsWith('<p') || line.trim().startsWith('<img')) {
            let htmlBlock = line;
            // Capture full multi-line HTML block if needed
            while (i + 1 < lines.length && !lines[i].trim().endsWith('</p>') && !lines[i].includes('/>') && lines[i + 1].trim().startsWith('<')) {
                i++;
                htmlBlock += ' ' + lines[i];
            }

            // Extract Image Src & Alt
            const srcMatch = htmlBlock.match(/src="([^"]+)"/);
            const altMatch = htmlBlock.match(/alt="([^"]+)"/);

            if (srcMatch) {
                const url = srcMatch[1];
                const alt = altMatch ? altMatch[1] : 'Image';

                // Add as Image Block
                blocks.push({
                    _type: 'image',
                    _key: createKey(),
                    // In a real scenario you would upload this image to Sanity. 
                    // For now, references to external URLs in image blocks isn't standard in Sanity schemas unless you have a custom URL field.
                    // However, let's look at the schema for 'image'. It usually takes an asset reference.
                    // Since we can't upload assets easily without a binary buffer, we will fallback to a captioned image component 
                    // OR we modify the blockContent schema to accept external URLs. 
                    // Checking blockContentType.tsx: it has 'caption' and 'alt'. It does NOT have an external URL field.
                    // Standard Sanity images MUST be uploaded assets.
                    // WORKAROUND: We will insert a custom object or just a text link? 
                    // User asked to "use Cloudinary Urls". 
                    // Let's create a text block with the Image URL explicitly.
                    // Better: Add the image block structure, but since we can't 'ref' the URL as an asset ID (it needs to be image-xyz...),
                    // we might have to skip the actual Sanity Image Object unless we upload.

                    // Option A: Text representation [Image: Alt] (Url)
                    // Option B: Try to pass it? No, Sanity will reject invalid asset refs.

                    // Let's do a rich text blocks representation strictly.
                });

                // Add a visual representation
                blocks.push({
                    _type: 'block',
                    _key: createKey(),
                    style: 'normal',
                    markDefs: [{
                        _type: 'link',
                        _key: 'imgLink',
                        href: url
                    }],
                    children: [
                        { _type: 'span', _key: createKey(), text: `🖼️ [Image: ${alt}]`, marks: ['strong', 'imgLink'] }
                    ]
                });

                // Check for caption in HTML (often in <em> tag after img)
                const captionMatch = htmlBlock.match(/<em>(.*?)<\/em>/);
                if (captionMatch) {
                    blocks.push({
                        _type: 'block',
                        _key: createKey(),
                        style: 'normal',
                        children: [{
                            _type: 'span',
                            _key: createKey(),
                            text: captionMatch[1],
                            marks: ['em']
                        }]
                    });
                }
            }
            i++;
            continue;
        }

        // Ignore pure HTML closing tags if separate line
        if (line.trim().startsWith('</p>')) {
            i++;
            continue;
        }

        // 4. Handle Headers
        const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headerMatch) {
            const level = headerMatch[1].length;
            const text = headerMatch[2];
            const { spans, markDefs } = parseInlineMarkdown(text);
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: `h${level}`,
                markDefs: markDefs,
                children: spans
            });
            i++;
            continue;
        }

        // 5. Handle Blockquotes - Use 'normal' style to avoid Sanity v4 editor hydration bug
        // The blockquote style causes "<div> cannot be a descendant of <p>" errors in Sanity Studio
        if (line.trim().startsWith('>')) {
            const text = line.replace(/^>\s?/, '').trim();
            // Create emphasized spans to visually distinguish quotes
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'normal',
                markDefs: [],
                children: [
                    { _type: 'span', _key: createKey(), text: '💬 ', marks: [] },
                    { _type: 'span', _key: createKey(), text: text, marks: ['em'] }
                ]
            });
            i++;
            continue;
        }

        // 6. Handle Lists (Bullet & Numbered)
        // Bullet: - or *
        if (line.match(/^\s*[-*]\s+/)) {
            const content = line.replace(/^\s*[-*]\s+/, '');
            const { spans, markDefs } = parseInlineMarkdown(content);
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'normal',
                listItem: 'bullet',
                level: 1, // Simplified level detection
                markDefs: markDefs,
                children: spans
            });
            i++;
            continue;
        }
        // Numbered: 1. 
        if (line.match(/^\s*\d+\.\s+/)) {
            const content = line.replace(/^\s*\d+\.\s+/, '');
            const { spans, markDefs } = parseInlineMarkdown(content);
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'normal',
                listItem: 'number',
                level: 1,
                markDefs: markDefs,
                children: spans
            });
            i++;
            continue;
        }

        // 7. General Paragraphs & Separators
        if (line.trim() === '---') {
            // Divider? Sanity doesn't have a standard divider block usually, skip or add textual divider
            i++;
            continue;
        }

        if (line.trim() === '') {
            i++;
            continue;
        }

        // Regular Text - Sanitize and add
        // We should parse inline Text marks (bold, italic, links)
        const { spans, markDefs } = parseInlineMarkdown(line);

        blocks.push({
            _type: 'block',
            _key: createKey(),
            style: 'normal',
            markDefs: markDefs,
            children: spans
        });

        i++;
    }

    return blocks;
}

// Enhanced parser for **bold**, `code`, and [link](url)
function parseInlineMarkdown(text) {
    const spans = [];
    const markDefs = [];

    // Match **bold**, `code`, and [text](url) patterns
    const regex = /(\*\*.*?\*\*|`.*?`|\[([^\]]+)\]\(([^)]+)\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            const beforeText = text.slice(lastIndex, match.index);
            if (beforeText) {
                spans.push({
                    _type: 'span',
                    _key: createKey(),
                    text: beforeText,
                    marks: []
                });
            }
        }

        const fullMatch = match[0];

        if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
            // Bold
            spans.push({
                _type: 'span',
                _key: createKey(),
                text: fullMatch.slice(2, -2),
                marks: ['strong']
            });
        } else if (fullMatch.startsWith('`') && fullMatch.endsWith('`')) {
            // Code
            spans.push({
                _type: 'span',
                _key: createKey(),
                text: fullMatch.slice(1, -1),
                marks: ['code']
            });
        } else if (fullMatch.startsWith('[')) {
            // Link: [text](url)
            const linkText = match[2];
            const linkHref = match[3];
            const linkKey = createKey();

            // Add to markDefs
            markDefs.push({
                _type: 'link',
                _key: linkKey,
                href: linkHref
            });

            spans.push({
                _type: 'span',
                _key: createKey(),
                text: linkText,
                marks: [linkKey]
            });
        }

        lastIndex = regex.lastIndex;
    }

    // Add remaining text after last match
    if (lastIndex < text.length) {
        spans.push({
            _type: 'span',
            _key: createKey(),
            text: text.slice(lastIndex),
            marks: []
        });
    }

    // If no matches found, return original text as single span
    if (spans.length === 0) {
        spans.push({
            _type: 'span',
            _key: createKey(),
            text: text,
            marks: []
        });
    }

    return { spans, markDefs };
}

async function run() {
    console.log('Reading and parsing full documentation...');
    const body = parseMarkdownToBlocks(markdownContent);
    console.log(`Generated ${body.length} Sanity blocks.`);

    // Prepare document
    const doc = {
        _type: 'post',
        title: 'Omni-Post AI: Technical Documentation',
        slug: { _type: 'slug', current: 'omni-post-ai-technical-documentation' },
        status: 'published',
        publishedAt: new Date().toISOString(),
        excerpt: 'Complete technical documentation for the Omni-Post AI Automation system.',
        body: body
    };

    // Delete ALL existing posts with this slug (not just one)
    const query = `*[_type=="post" && slug.current=="omni-post-ai-technical-documentation"]._id`;
    try {
        const res = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        const existingIds = json.result || [];

        const mutations = [];

        // Delete all existing posts with this slug
        if (existingIds.length > 0) {
            console.log(`Found ${existingIds.length} existing post(s) to delete:`, existingIds);
            for (const id of existingIds) {
                console.log(`  Deleting: ${id}`);
                mutations.push({ delete: { id: id } });
            }
        }

        // Create new post
        mutations.push({ create: doc });

        console.log('Uploading to Sanity...');
        const mutRes = await fetch(SANITY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ mutations })
        });

        const mutJson = await mutRes.json();
        if (mutJson.error) {
            console.error('Upload failed:', JSON.stringify(mutJson.error, null, 2));
        } else {
            console.log('✅ Success! All old posts deleted and new document created.');
            console.log('View here: http://localhost:3000/blogs/omni-post-ai-technical-documentation');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
