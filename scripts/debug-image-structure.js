/**
 * Debug: Inspect actual image block structure in Omni-Post AI blog
 * Run: node scripts/debug-image-structure.js
 */

require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function run() {
    console.log('=== Inspecting Omni-Post AI Image Blocks ===\n');

    // Query for image blocks in the body
    const query = `*[_type=="post" && slug.current=="omni-post-ai-technical-documentation"][0]{
        _id,
        title,
        "imageBlocks": body[_type=="image"][0..3]
    }`;

    try {
        const res = await fetch(`${SANITY_API_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        const post = json.result;

        if (!post) {
            console.log('Post not found!');
            return;
        }

        console.log(`Post: ${post.title}\n`);
        console.log('=== First 4 Image Blocks (Full Structure) ===\n');

        if (post.imageBlocks && post.imageBlocks.length > 0) {
            post.imageBlocks.forEach((img, i) => {
                console.log(`\n--- Image Block ${i + 1} ---`);
                console.log(JSON.stringify(img, null, 2));
            });
        } else {
            console.log('NO IMAGE BLOCKS FOUND');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
