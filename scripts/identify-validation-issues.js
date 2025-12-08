/**
 * Script to identify and clean up empty/problematic image blocks
 * in all blog posts that might cause validation errors.
 * 
 * Run: node scripts/identify-validation-issues.js
 */

require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function run() {
    console.log('=== Checking Posts for Validation Issues ===\n');

    // Query for specific posts
    const query = `*[_type=="post" && (slug.current=="aviators-training-centre" || slug.current=="omni-post-ai-technical-documentation")]{
        _id,
        title,
        slug,
        "emptyImageBlocks": body[_type=="image" && !defined(asset)],
        "imagesWithoutAlt": body[_type=="image" && !defined(alt)],
        "externalImgsWithoutUrl": body[_type=="externalImage" && !defined(url)]
    }`;

    try {
        const res = await fetch(`${SANITY_API_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        const posts = json.result || [];

        console.log(`Found ${posts.length} posts to check\n`);

        for (const post of posts) {
            console.log(`\n=== ${post.title} (${post.slug?.current}) ===`);
            console.log(`Empty image blocks (no asset): ${post.emptyImageBlocks?.length || 0}`);
            console.log(`Images without alt text: ${post.imagesWithoutAlt?.length || 0}`);
            console.log(`External images without URL: ${post.externalImgsWithoutUrl?.length || 0}`);

            if (post.emptyImageBlocks?.length > 0) {
                console.log('\nEmpty image block keys:', post.emptyImageBlocks.map(b => b._key).join(', '));
            }
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
