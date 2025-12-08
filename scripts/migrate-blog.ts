
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import https from 'https';
import slugify from 'slugify';
import crypto from 'crypto';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('Missing Sanity configuration. Please ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and NEXT_PUBLIC_SANITY_API_WRITE_TOKEN are set in .env.local');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-01-01',
});

const DOC_URL = 'https://raw.githubusercontent.com/AmanSuryavanshi-1/Aviators_Training_Centre/main/docs/aviators-training-centre-technical-documentation.md';

// Generate a unique key for Sanity blocks
function generateKey(): string {
    return crypto.randomBytes(6).toString('hex');
}

async function fetchMarkdown(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', reject);
        });
    });
}

async function uploadImageToSanity(imageUrl: string): Promise<string | null> {
    try {
        console.log(`Downloading image: ${imageUrl}`);
        const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
            https.get(imageUrl, (res) => {
                const chunks: any[] = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
            });
        });

        console.log(`Uploading to Sanity...`);
        const asset = await client.assets.upload('image', imageBuffer, {
            filename: path.basename(imageUrl),
        });
        console.log(`Uploaded asset: ${asset._id}`);
        return asset._id;
    } catch (error) {
        console.error(`Failed to upload image ${imageUrl}:`, error);
        return null;
    }
}

// Parse inline markdown formatting into Portable Text spans with proper link handling
function parseInlineMarkdown(text: string): { children: any[], markDefs: any[] } {
    const spans: any[] = [];
    const markDefs: any[] = [];

    // First, strip formatting but keep text clean
    let cleanText = text
        .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold markers but keep text
        .replace(/`([^`]+)`/g, '$1')       // Remove code markers but keep text
        .replace(/^\>\s*/g, '')  // Remove blockquote markers
        .replace(/^\*\s*/g, '• ')  // Convert * list items to bullet
        .trim();

    // Handle markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;
    const parts: { text: string; isLink: boolean; href?: string }[] = [];

    // Reset cleanText to original to parse links
    const textForLinks = text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^\>\s*/g, '')
        .trim();

    while ((match = linkRegex.exec(textForLinks)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
            parts.push({ text: textForLinks.slice(lastIndex, match.index), isLink: false });
        }
        // Add the link
        parts.push({ text: match[1], isLink: true, href: match[2] });
        lastIndex = match.index + match[0].length;
    }
    // Add remaining text after last link
    if (lastIndex < textForLinks.length) {
        parts.push({ text: textForLinks.slice(lastIndex), isLink: false });
    }

    // If no links found, just return plain text
    if (parts.length === 0) {
        return {
            children: [{ _type: 'span', _key: generateKey(), text: cleanText }],
            markDefs: []
        };
    }

    // Build children and markDefs from parts
    for (const part of parts) {
        if (part.isLink && part.href) {
            const linkKey = generateKey();
            markDefs.push({
                _type: 'link',
                _key: linkKey,
                href: part.href
            });
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: part.text,
                marks: [linkKey]
            });
        } else if (part.text) {
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: part.text
            });
        }
    }

    return { children: spans.length > 0 ? spans : [{ _type: 'span', _key: generateKey(), text: cleanText }], markDefs };
}

// Parse markdown table into table block - FIXED for empty cells
function parseTable(tableLines: string[]): any {
    const rows: any[] = [];

    for (let i = 0; i < tableLines.length; i++) {
        const line = tableLines[i].trim();

        // Skip separator line (|---|---|)
        if (line.match(/^\|[\s-:|]+\|$/)) {
            continue;
        }

        // Parse cells - DON'T filter empty strings to preserve empty cells
        // Split by | but handle the leading and trailing |
        const rawCells = line.split('|');
        // Remove first and last empty elements from split (they're outside the table border)
        const cells = rawCells.slice(1, -1).map(cell =>
            cell.trim().replace(/\*\*/g, '')  // Remove bold markers
        );

        if (cells.length > 0) {
            rows.push({ _key: generateKey(), cells });
        }
    }

    return {
        _type: 'table',
        _key: generateKey(),
        rows,
    };
}

// Simple parser to convert Markdown to Portable Text
async function markdownToPortableText(markdown: string) {
    const blocks: any[] = [];
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines and horizontal rules
        if (line.trim() === '' || line.trim() === '---') {
            continue;
        }

        // Handle Code Blocks
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                // End of code block
                blocks.push({
                    _type: 'code',
                    _key: generateKey(),
                    language: codeBlockLanguage || 'text',
                    code: codeBlockContent.trim(),
                });
                inCodeBlock = false;
                codeBlockContent = '';
                codeBlockLanguage = '';
            } else {
                // Start of code block
                inCodeBlock = true;
                codeBlockLanguage = line.trim().replace('```', '');
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            continue;
        }

        // Handle Headers
        if (line.startsWith('#')) {
            const level = line.match(/^#+/)?.[0].length || 0;
            const rawText = line.replace(/^#+\s*/, '').trim();
            const text = rawText.replace(/\*\*/g, '').replace(/`/g, ''); // Strip markdown chars
            if (level > 0 && level <= 6) {
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: `h${level}`,
                    children: [{ _type: 'span', _key: generateKey(), text }],
                    markDefs: [],
                });
            }
            continue;
        }

        // Handle Images
        const imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/) || line.match(/<img src="(.*?)" alt="(.*?)"/);
        if (imageMatch) {
            let alt, src;
            if (line.startsWith('![')) {
                alt = imageMatch[1];
                src = imageMatch[2];
            } else {
                src = imageMatch[1];
                alt = imageMatch[2];
            }

            if (src) {
                const assetId = await uploadImageToSanity(src);
                if (assetId) {
                    blocks.push({
                        _type: 'image',
                        _key: generateKey(),
                        asset: { _type: 'reference', _ref: assetId },
                        alt: alt || 'Image',
                    });
                }
            }
            continue;
        }

        // Handle Tables - parse into proper table blocks
        if (line.trim().startsWith('|')) {
            const tableLines: string[] = [line];
            let j = i + 1;
            while (j < lines.length && lines[j].trim().startsWith('|')) {
                tableLines.push(lines[j]);
                j++;
            }
            i = j - 1; // Advance main loop

            const tableBlock = parseTable(tableLines);
            if (tableBlock.rows.length > 0) {
                blocks.push(tableBlock);
            }
            continue;
        }

        // Skip lines that are just markdown syntax
        if (line.trim() === '>' || line.trim().match(/^[*-]\s*$/)) {
            continue;
        }

        // Handle Paragraphs (Normal text)
        if (line.trim()) {
            // Check if it's a list item
            const bulletMatch = line.trim().match(/^[-*]\s+(.+)/);
            const numberMatch = line.trim().match(/^\d+\.\s+(.+)/);
            const indentedBulletMatch = line.match(/^(\s+)[-*]\s+(.+)/);
            const indentedNumberMatch = line.match(/^(\s+)\d+\.\s+(.+)/);

            if (indentedBulletMatch) {
                const { children, markDefs } = parseInlineMarkdown(indentedBulletMatch[2]);
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    listItem: 'bullet',
                    level: 2,
                    children,
                    markDefs,
                });
            } else if (indentedNumberMatch) {
                const { children, markDefs } = parseInlineMarkdown(indentedNumberMatch[2]);
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    listItem: 'number',
                    level: 2,
                    children,
                    markDefs,
                });
            } else if (bulletMatch) {
                const { children, markDefs } = parseInlineMarkdown(bulletMatch[1]);
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    listItem: 'bullet',
                    level: 1,
                    children,
                    markDefs,
                });
            } else if (numberMatch) {
                const { children, markDefs } = parseInlineMarkdown(numberMatch[1]);
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    listItem: 'number',
                    level: 1,
                    children,
                    markDefs,
                });
            } else {
                // Regular paragraph
                const { children, markDefs } = parseInlineMarkdown(line.trim());
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    children,
                    markDefs,
                });
            }
        }
    }

    return blocks;
}

async function main() {
    try {
        console.log('Fetching markdown...');
        const markdown = await fetchMarkdown(DOC_URL);

        // Extract Title (First H1)
        const titleMatch = markdown.match(/^#\s+(.*)/m);
        const title = titleMatch ? titleMatch[1] : 'Aviators Training Centre Technical Documentation';

        // Extract Excerpt
        const excerpt = "Technical documentation for the Aviators Training Centre platform, featuring Next.js, Firebase, and n8n automation.";

        console.log(`Processing content for: ${title}`);
        const body = await markdownToPortableText(markdown);

        // Check if post already exists
        const existingPost = await client.fetch(
            `*[_type == "post" && slug.current == $slug][0]._id`,
            { slug: slugify(title, { lower: true, strict: true }) }
        );

        if (existingPost) {
            console.log(`Updating existing post: ${existingPost}`);
            await client.patch(existingPost).set({ body }).commit();
            console.log(`Post updated successfully!`);
        } else {
            const doc = {
                _type: 'post',
                title,
                slug: { current: slugify(title, { lower: true, strict: true }) },
                excerpt,
                publishedAt: new Date().toISOString(),
                status: 'published',
                body,
                seoTitle: title,
                metaDescription: excerpt,
            };

            console.log('Creating document in Sanity...');
            const result = await client.create(doc);
            console.log(`Document created! ID: ${result._id}`);
            console.log(`Slug: ${result.slug.current}`);
        }

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

main();
