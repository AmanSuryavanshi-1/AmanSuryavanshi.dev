/**
 * Full Markdown-to-Sanity Converter for Omni-Post AI Technical Documentation
 * This script reads the complete MD file and converts it to Sanity Portable Text
 * Run: node scripts/create-full-omni-post-blog.js
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

// Parse markdown to Sanity blocks
function parseMarkdownToBlocks(markdown) {
    const blocks = [];
    const lines = markdown.split('\n');
    let i = 0;
    let currentListLevel = 0;
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLang = '';

    while (i < lines.length) {
        let line = lines[i];

        // Handle code blocks
        if (line.startsWith('```')) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                codeBlockLang = line.slice(3).trim() || 'text';
                codeBlockContent = '';
            } else {
                // End of code block
                blocks.push({
                    _type: 'code',
                    _key: createKey(),
                    language: codeBlockLang,
                    code: codeBlockContent.trim()
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

        // Skip empty lines
        if (line.trim() === '') {
            i++;
            continue;
        }

        // Skip horizontal rules
        if (line.trim() === '---') {
            i++;
            continue;
        }

        // Handle HTML image tags (Cloudinary images)
        if (line.includes('<img src="')) {
            const srcMatch = line.match(/src="([^"]+)"/);
            const altMatch = line.match(/alt="([^"]+)"/);
            if (srcMatch) {
                // Store as text block with image URL for now (Sanity needs asset upload for images)
                blocks.push({
                    _type: 'block',
                    _key: createKey(),
                    style: 'normal',
                    markDefs: [],
                    children: [{
                        _type: 'span',
                        _key: createKey(),
                        text: `[Image: ${altMatch ? altMatch[1] : 'Image'}]`,
                        marks: []
                    }]
                });
                // Add the URL as a separate paragraph for reference
                blocks.push({
                    _type: 'block',
                    _key: createKey(),
                    style: 'normal',
                    markDefs: [{
                        _type: 'link',
                        _key: 'link1',
                        href: srcMatch[1]
                    }],
                    children: [{
                        _type: 'span',
                        _key: createKey(),
                        text: srcMatch[1],
                        marks: ['link1']
                    }]
                });
            }
            i++;
            continue;
        }

        // Skip HTML tags we can't convert
        if (line.trim().startsWith('<p') || line.trim().startsWith('</p') ||
            line.trim().startsWith('<strong>') || line.trim().startsWith('<em>') ||
            line.trim().startsWith('<br>')) {
            // Extract text content from simple HTML
            const textContent = line.replace(/<[^>]+>/g, '').trim();
            if (textContent) {
                blocks.push({
                    _type: 'block',
                    _key: createKey(),
                    style: 'normal',
                    markDefs: [],
                    children: [{
                        _type: 'span',
                        _key: createKey(),
                        text: textContent,
                        marks: []
                    }]
                });
            }
            i++;
            continue;
        }

        // Handle tables
        if (line.includes('|') && line.trim().startsWith('|')) {
            const tableRows = [];
            while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
                const row = lines[i];
                // Skip separator rows (|---|---|)
                if (row.match(/^\|[\s-:|]+\|$/)) {
                    i++;
                    continue;
                }
                const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
                if (cells.length > 0) {
                    tableRows.push({ _type: 'row', _key: createKey(), cells });
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
            continue;
        }

        // Handle headings
        if (line.startsWith('#')) {
            const match = line.match(/^(#+)\s*(.+)/);
            if (match) {
                const level = Math.min(match[1].length, 4); // h1-h4
                const text = match[2].trim();
                blocks.push({
                    _type: 'block',
                    _key: createKey(),
                    style: `h${level}`,
                    markDefs: [],
                    children: [{
                        _type: 'span',
                        _key: createKey(),
                        text: text,
                        marks: []
                    }]
                });
            }
            i++;
            continue;
        }

        // Handle blockquotes
        if (line.startsWith('>')) {
            const text = line.replace(/^>\s*/, '').trim();
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'blockquote',
                markDefs: [],
                children: [{
                    _type: 'span',
                    _key: createKey(),
                    text: text,
                    marks: []
                }]
            });
            i++;
            continue;
        }

        // Handle bullet lists
        if (line.match(/^\s*[-*]\s+/)) {
            const indent = line.match(/^(\s*)/)[1].length;
            const level = Math.floor(indent / 2) + 1;
            const text = line.replace(/^\s*[-*]\s+/, '').trim();
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'normal',
                listItem: 'bullet',
                level: level,
                markDefs: [],
                children: [{
                    _type: 'span',
                    _key: createKey(),
                    text: text,
                    marks: []
                }]
            });
            i++;
            continue;
        }

        // Handle numbered lists
        if (line.match(/^\s*\d+\.\s+/)) {
            const indent = line.match(/^(\s*)/)[1].length;
            const level = Math.floor(indent / 2) + 1;
            const text = line.replace(/^\s*\d+\.\s+/, '').trim();
            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'normal',
                listItem: 'number',
                level: level,
                markDefs: [],
                children: [{
                    _type: 'span',
                    _key: createKey(),
                    text: text,
                    marks: []
                }]
            });
            i++;
            continue;
        }

        // Handle bold text within paragraphs
        let processedText = line.trim();

        // Regular paragraph
        if (processedText) {
            // Handle inline formatting
            const children = [];
            const markDefs = [];

            // Simple approach: just add as plain text (bold/italic markers stripped)
            processedText = processedText
                .replace(/\*\*([^*]+)\*\*/g, '$1')  // Bold
                .replace(/\*([^*]+)\*/g, '$1')      // Italic
                .replace(/`([^`]+)`/g, '$1');       // Inline code

            children.push({
                _type: 'span',
                _key: createKey(),
                text: processedText,
                marks: []
            });

            blocks.push({
                _type: 'block',
                _key: createKey(),
                style: 'normal',
                markDefs: markDefs,
                children: children
            });
        }

        i++;
    }

    return blocks;
}

async function createBlogPost() {
    console.log('Parsing markdown file...');
    const body = parseMarkdownToBlocks(markdownContent);
    console.log(`Parsed ${body.length} blocks from markdown`);

    const document = {
        _type: 'post',
        title: 'Omni-Post AI: Intelligent Multi-Platform Content Distribution Engine',
        slug: { _type: 'slug', current: 'omni-post-ai-technical-documentation' },
        excerpt: 'A production-grade automation system that transforms Notion content into platform-optimized posts for Twitter, LinkedIn, and Blog. 99.7% reliability, $0/month cost, 15-20 hours saved monthly.',
        status: 'published',
        featured: true,
        focusKeyword: 'AI content automation n8n',
        seoTitle: 'Omni-Post AI: Build Your Own Content Distribution Engine',
        metaDescription: 'Learn how I built a 74-node automation that generates and distributes content across 3 platforms with 99.7% reliability at zero cost.',
        body
    };

    // First, try to delete existing post with same slug
    console.log('Checking for existing post...');
    const queryUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=*[_type=="post" && slug.current=="omni-post-ai-technical-documentation"][0]._id`;

    try {
        const queryResponse = await fetch(queryUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const queryResult = await queryResponse.json();

        if (queryResult.result) {
            console.log('Deleting existing post:', queryResult.result);
            await fetch(SANITY_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mutations: [{ delete: { id: queryResult.result } }] })
            });
        }
    } catch (e) {
        console.log('No existing post found or error checking:', e.message);
    }

    // Create new post
    console.log('Creating new blog post...');
    const mutations = [{ create: document }];

    try {
        const response = await fetch(SANITY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ mutations })
        });

        const result = await response.json();

        if (result.error) {
            console.error('Sanity API Error:', JSON.stringify(result.error, null, 2));
            process.exit(1);
        }

        console.log('✅ Blog post created successfully!');
        console.log('Document ID:', result.results?.[0]?.id);
        console.log('Total blocks:', body.length);
        console.log('View at: http://localhost:5000/blogs/omni-post-ai-technical-documentation');
    } catch (error) {
        console.error('Error creating blog post:', error.message);
        process.exit(1);
    }
}

createBlogPost();
