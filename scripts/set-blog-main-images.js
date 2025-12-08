/**
 * Set mainImage for blogs that don't have one
 * Uses the first image from the blog body as mainImage
 * Run: node scripts/set-blog-main-images.js
 */

require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function run() {
    console.log('=== Setting mainImage for blogs without one ===\n');

    // Get all posts without mainImage but with body
    const query = `*[_type=="post" && !defined(mainImage)]{
        _id,
        title,
        slug,
        "firstImage": body[_type=="image"][0]{
            asset,
            alt,
            caption
        }
    }`;

    try {
        const res = await fetch(`${SANITY_API_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        const posts = json.result || [];

        console.log(`Found ${posts.length} posts without mainImage\n`);

        for (const post of posts) {
            console.log(`Processing: ${post.slug?.current || post._id}`);

            if (post.firstImage && post.firstImage.asset) {
                // Set the first image as mainImage
                const patch = {
                    mainImage: {
                        _type: 'image',
                        asset: post.firstImage.asset,
                        alt: post.firstImage.alt || post.title
                    }
                };

                const updateRes = await fetch(`${SANITY_API_URL}/data/mutate/${dataset}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        mutations: [{
                            patch: {
                                id: post._id,
                                set: patch
                            }
                        }]
                    })
                });

                const updateJson = await updateRes.json();
                if (updateJson.transactionId) {
                    console.log(`  ✅ Set mainImage from first body image`);
                } else {
                    console.log(`  ❌ Failed to set mainImage:`, updateJson);
                }
            } else {
                console.log(`  ⏭️  No images in body, skipping`);
            }
        }

        console.log('\n=== Done! ===');
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
