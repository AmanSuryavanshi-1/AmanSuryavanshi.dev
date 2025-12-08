/**
 * Script to remove empty image blocks from blog posts
 * These blocks have _type="image" but no asset, causing validation errors
 * 
 * Run: node scripts/remove-empty-images.js
 */

require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function run() {
    console.log('=== Removing Empty Image Blocks ===\n');

    const query = `*[_type=="post" && (slug.current=="aviators-training-centre" || slug.current=="omni-post-ai-technical-documentation")]{
        _id,
        title,
        slug,
        body
    }`;

    try {
        const res = await fetch(`${SANITY_API_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        const posts = json.result || [];

        for (const post of posts) {
            console.log(`\n=== ${post.title} ===`);

            const originalCount = post.body?.length || 0;

            // Filter out empty image blocks (have _type="image" but no asset)
            const newBody = (post.body || []).filter(block => {
                if (block._type === 'image' && !block.asset) {
                    console.log(`  Removing empty image block: ${block._key}`);
                    return false;
                }
                return true;
            });

            const removedCount = originalCount - newBody.length;

            if (removedCount > 0) {
                console.log(`\nRemoving ${removedCount} empty image blocks...`);

                // Update the post
                const updateRes = await fetch(`${SANITY_API_URL}/data/mutate/${dataset}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        mutations: [{
                            patch: {
                                id: post._id,
                                set: { body: newBody }
                            }
                        }]
                    })
                });

                const updateJson = await updateRes.json();
                if (updateJson.transactionId) {
                    console.log(`✅ Updated successfully! Transaction: ${updateJson.transactionId}`);
                } else {
                    console.error('❌ Update failed:', updateJson);
                }
            } else {
                console.log('No empty image blocks to remove.');
            }
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
