/**
 * Debug: Inspect the Omni-Post AI blog body content structure
 * This will help understand how images are stored and why they're showing as links
 * 
 * Run: node scripts/debug-omni-post-images.js
 */

require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function run() {
    console.log('=== Inspecting Omni-Post AI Blog Content ===\n');

    // Query the specific post
    const query = `*[_type=="post" && slug.current=="omni-post-ai-technical-documentation"][0]{
        _id,
        title,
        "bodyBlockCount": count(body),
        "imageBlocks": body[_type=="image"],
        "linkSamples": body[markDefs[_type=="link"]][0..5]
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

        console.log(`Post ID: ${post._id}`);
        console.log(`Title: ${post.title}`);
        console.log(`Body block count: ${post.bodyBlockCount}`);
        console.log(`Image blocks: ${post.imageBlocks?.length || 0}`);
        console.log('\n--- Image Blocks ---');
        if (post.imageBlocks && post.imageBlocks.length > 0) {
            post.imageBlocks.forEach((img, i) => {
                console.log(`Image ${i + 1}:`, JSON.stringify(img, null, 2));
            });
        } else {
            console.log('NO IMAGE BLOCKS FOUND - This is the problem!');
        }

        console.log('\n--- Sample Link Blocks (text with links) ---');
        if (post.linkSamples && post.linkSamples.length > 0) {
            post.linkSamples.forEach((block, i) => {
                console.log(`Link Block ${i + 1}:`, JSON.stringify(block, null, 2).substring(0, 500));
            });
        } else {
            console.log('No link blocks found.');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
