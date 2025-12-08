/**
 * Migration: Add Cloudinary URLs to Omni-Post AI blog images
 * 
 * This script replaces empty image blocks with externalImage blocks
 * containing the correct Cloudinary URLs from the documentation.
 * 
 * Run: node scripts/migrate-omnipost-images.js
 */

require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

// Image URLs extracted from OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md
const imageData = [
    {
        url: 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844294/Omni_post_Ai_autoamtion/omni_post_ai_assets/Asset_1_Timeline_Evolution.jpg',
        alt: 'Content Evolution Comparison',
        caption: 'Evolution of content quality from manual posting (v1) to AI-automated system (v4)'
    },
    {
        url: 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844303/Omni_post_Ai_autoamtion/omni_post_ai_assets/Part_1_Generation_Workflow.jpg',
        alt: 'Part 1 High Level Workflow',
        caption: 'Conceptual workflow showing the AI generation process'
    },
    {
        url: 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844303/Omni_post_Ai_autoamtion/omni_post_ai_assets/Part_1_Automation_COMPLETEFLOW_Content_Repurposing.png',
        alt: 'Part 1 Detailed Automation Flow',
        caption: 'Actual 28-node n8n workflow implementation'
    },
    {
        url: 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844306/Omni_post_Ai_autoamtion/omni_post_ai_assets/Part_2_Distribution_Workflow.jpg',
        alt: 'Part 2 High Level Workflow',
        caption: 'Conceptual workflow showing the multi-platform distribution process'
    },
    {
        url: 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844306/Omni_post_Ai_autoamtion/omni_post_ai_assets/Part_2__Automation_Content_Posting.png',
        alt: 'Part 2 Detailed Automation Flow',
        caption: 'Actual 46-node n8n workflow implementation'
    },
    {
        url: 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844297/Omni_post_Ai_autoamtion/omni_post_ai_assets/Asset_2_Notion_Database_Schema_FullSize_Screenshot.png',
        alt: 'Notion Database Schema',
        caption: 'Social Content Queue database structure'
    },
    {
        url: 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844295/Omni_post_Ai_autoamtion/omni_post_ai_assets/Asset_2_Notion_Content_Queue_Database.png',
        alt: 'Notion Content Queue Database',
        caption: 'Content queue with all tracking properties'
    },
    {
        url: 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844298/Omni_post_Ai_autoamtion/omni_post_ai_assets/Asset_3_Metrics_Dashboard.jpg',
        alt: 'Metrics Dashboard',
        caption: 'Production system performance dashboard'
    },
    {
        url: 'https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844300/Omni_post_Ai_autoamtion/omni_post_ai_assets/Asset_5_LLM_Routing.jpg',
        alt: 'LLM Routing Decision Tree',
        caption: 'LLM routing strategy showing model selection based on content type'
    }
];

async function run() {
    console.log('=== Migrating Omni-Post AI Images ===\n');

    // First, get the post and its body
    const query = `*[_type=="post" && slug.current=="omni-post-ai-technical-documentation"][0]{
        _id,
        _rev,
        title,
        body
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

        console.log(`Post: ${post.title}`);
        console.log(`Body blocks: ${post.body?.length || 0}`);

        // Find all empty image blocks and replace them with externalImage blocks
        const newBody = [];
        let imageIndex = 0;

        for (const block of post.body || []) {
            if (block._type === 'image' && !block.asset) {
                // This is an empty image block - replace with externalImage
                if (imageIndex < imageData.length) {
                    const imgData = imageData[imageIndex];
                    newBody.push({
                        _key: block._key, // Keep the same key
                        _type: 'externalImage',
                        url: imgData.url,
                        alt: imgData.alt,
                        caption: imgData.caption
                    });
                    console.log(`✅ Replaced image ${imageIndex + 1}: ${imgData.alt}`);
                    imageIndex++;
                } else {
                    // No more image data, keep the block as is
                    newBody.push(block);
                    console.log(`⚠️ No image data for block ${block._key}`);
                }
            } else {
                // Keep other blocks unchanged
                newBody.push(block);
            }
        }

        console.log(`\nReplaced ${imageIndex} empty image blocks`);

        // Update the post with the new body
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
            console.log(`\n✅ Successfully updated post! Transaction: ${updateJson.transactionId}`);
        } else {
            console.error('❌ Update failed:', updateJson);
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
