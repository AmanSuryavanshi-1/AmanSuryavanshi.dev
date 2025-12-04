
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import https from 'https';
import slugify from 'slugify';

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

// Simple parser to convert Markdown to Portable Text (simplified for this specific doc)
async function markdownToPortableText(markdown: string) {
    const blocks: any[] = [];
    const lines = markdown.split('\n');
    let currentBlock: any = null;
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Handle Code Blocks
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                // End of code block
                blocks.push({
                    _type: 'code',
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
            const text = line.replace(/^#+\s*/, '').trim();
            if (level > 0 && level <= 6) {
                blocks.push({
                    _type: 'block',
                    style: `h${level}`,
                    children: [{ _type: 'span', text }],
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
                        asset: { _type: 'reference', _ref: assetId },
                        alt: alt || 'Image',
                    });
                }
            }
            continue;
        }

        // Handle Tables (Convert to Code Block for now as per plan)
        if (line.trim().startsWith('|')) {
            // Collect all table lines
            let tableContent = line + '\n';
            let j = i + 1;
            while (j < lines.length && lines[j].trim().startsWith('|')) {
                tableContent += lines[j] + '\n';
                j++;
            }
            i = j - 1; // Advance main loop

            blocks.push({
                _type: 'code',
                language: 'markdown',
                code: tableContent.trim(),
                filename: 'Table'
            });
            continue;
        }

        // Handle Paragraphs (Normal text)
        if (line.trim()) {
            // Check if it's a list item
            if (line.trim().startsWith('- ') || line.trim().match(/^\d+\.\s/)) {
                const isBullet = line.trim().startsWith('- ');
                const content = line.replace(/^- \s*|^\d+\.\s*/, '').trim();

                blocks.push({
                    _type: 'block',
                    style: 'normal',
                    listItem: isBullet ? 'bullet' : 'number',
                    children: [{ _type: 'span', text: content }]
                });
            } else {
                // Regular paragraph
                blocks.push({
                    _type: 'block',
                    style: 'normal',
                    children: [{ _type: 'span', text: line.trim() }],
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

        // Extract Excerpt (First paragraph after title)
        // Simplified extraction
        const excerpt = "Technical documentation for the Aviators Training Centre platform, featuring Next.js, Firebase, and n8n automation.";

        console.log(`Processing content for: ${title}`);
        const body = await markdownToPortableText(markdown);

        const doc = {
            _type: 'post',
            title,
            slug: { current: slugify(title, { lower: true, strict: true }) },
            excerpt,
            publishedAt: new Date().toISOString(),
            status: 'published', // Or 'draft'
            body,
            seoTitle: title,
            metaDescription: excerpt,
        };

        console.log('Creating document in Sanity...');
        const result = await client.create(doc);
        console.log(`Document created! ID: ${result._id}`);
        console.log(`Slug: ${result.slug.current}`);

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

main();
