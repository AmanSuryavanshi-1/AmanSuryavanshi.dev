/**
 * Enhance All Blog Posts with SEO and Tags
 * Run: node scripts/enhance-all-blogs-seo.js
 */

require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

// SEO and Tag configurations for each blog
const blogEnhancements = {
    'aviators-training-centre': {
        seoTitle: 'Aviators Training Centre: Full-Stack Aviation Case Study',
        metaDescription: 'Technical case study of Aviators Training Centre: a full-stack aviation platform with n8n automation, AI lead gen, and modern React architecture.',
        focusKeyword: 'aviation training platform',
        tags: ['Next.js', 'React', 'n8n Automation', 'Full-Stack', 'Case Study', 'Lead Generation', 'Aviation Tech']
    },
    'omni-post-ai-technical-documentation': {
        seoTitle: 'Omni-Post AI: Multi-Platform Content Automation System',
        metaDescription: 'Complete docs for Omni-Post AI: an intelligent content engine using n8n, Gemini AI, and automated social distribution.',
        focusKeyword: 'AI content automation',
        tags: ['n8n Automation', 'AI', 'Gemini', 'Content Automation', 'Social Media', 'Technical Docs', 'Full-Stack']
    },
    'av-news-stream': {
        seoTitle: 'AV News Stream | Real-Time News Platform with React',
        metaDescription: 'Technical breakdown of AV News Stream - a modern news streaming platform built with React, featuring real-time updates and optimized performance.',
        focusKeyword: 'news streaming platform',
        tags: ['React', 'JavaScript', 'News App', 'Frontend', 'API Integration', 'Case Study']
    },
    'developers-guide-building-ai-agents-with-model-context-protocol-mcp': {
        seoTitle: 'Guide to AI Agents with Model Context Protocol (MCP)',
        metaDescription: 'Build AI agents with Model Context Protocol (MCP). Comprehensive guide on architecture, implementation, and best practices.',
        focusKeyword: 'Model Context Protocol AI agents',
        tags: ['AI', 'MCP', 'AI Agents', 'Machine Learning', 'Tutorial', 'Developer Guide']
    },
    'foodah': {
        seoTitle: 'Foodah | Food Delivery App Development Case Study',
        metaDescription: 'Case study of Foodah - a modern food delivery application showcasing frontend development, UX design, and responsive web architecture.',
        focusKeyword: 'food delivery app development',
        tags: ['React', 'JavaScript', 'E-commerce', 'Frontend', 'Case Study', 'UX Design']
    },
    'a-freelance-project-for-an-enterprise': {
        seoTitle: 'Enterprise Freelance Project | Business Web Development',
        metaDescription: 'Real-world enterprise freelance project case study showcasing business web development, client collaboration, and professional delivery.',
        focusKeyword: 'enterprise web development',
        tags: ['Freelance', 'Enterprise', 'Business', 'Web Development', 'Case Study', 'Client Work']
    },
    'hoisting': {
        seoTitle: 'JavaScript Hoisting Explained | Complete Developer Guide',
        metaDescription: 'Master JavaScript hoisting with this complete guide. Learn how variable and function declarations are hoisted, common pitfalls, and best practices.',
        focusKeyword: 'JavaScript hoisting',
        tags: ['JavaScript', 'Web Development', 'Tutorial', 'Programming Concepts', 'Frontend']
    },
    'null-and-undefined': {
        seoTitle: 'Null vs Undefined in JavaScript | Key Differences',
        metaDescription: 'Understand the difference between null and undefined in JavaScript. Learn when to use each, common mistakes, and best practices.',
        focusKeyword: 'JavaScript null vs undefined',
        tags: ['JavaScript', 'Web Development', 'Tutorial', 'Programming Concepts', 'Frontend']
    },
    'undefined-vs-not-defined': {
        seoTitle: 'Undefined vs Not Defined in JavaScript | Developer Guide',
        metaDescription: 'Learn the crucial difference between undefined and not defined in JavaScript. Avoid common errors and write more robust code.',
        focusKeyword: 'JavaScript undefined missing',
        tags: ['JavaScript', 'Web Development', 'Tutorial', 'Programming Concepts', 'Frontend']
    }
};

async function createTagIfNotExists(tagName) {
    // Check if tag exists
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const query = `*[_type=="tag" && slug.current=="${slug}"][0]._id`;

    try {
        const res = await fetch(`${SANITY_API_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();

        if (json.result) {
            return json.result; // Tag exists, return its ID
        }

        // Create new tag
        const tagDoc = {
            _type: 'tag',
            name: tagName,
            slug: { _type: 'slug', current: slug },
            color: getRandomColor()
        };

        const createRes = await fetch(`${SANITY_API_URL}/data/mutate/${dataset}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ mutations: [{ create: tagDoc }] })
        });

        const createJson = await createRes.json();
        if (createJson.results && createJson.results[0]) {
            console.log(`  Created tag: ${tagName}`);
            return createJson.results[0].id;
        }

    } catch (err) {
        console.error(`Error with tag ${tagName}:`, err);
    }
    return null;
}

function getRandomColor() {
    const colors = ['lime', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'violet', 'purple', 'fuchsia', 'rose'];
    return colors[Math.floor(Math.random() * colors.length)];
}

async function updatePost(postId, slug, enhancements, tagRefs) {
    const patch = {
        seoTitle: enhancements.seoTitle,
        metaDescription: enhancements.metaDescription,
        focusKeyword: enhancements.focusKeyword,
        tags: tagRefs.map(ref => ({ _type: 'reference', _ref: ref, _key: Math.random().toString(36).substring(2, 10) }))
    };

    try {
        const res = await fetch(`${SANITY_API_URL}/data/mutate/${dataset}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                mutations: [{
                    patch: {
                        id: postId,
                        set: patch
                    }
                }]
            })
        });

        const json = await res.json();
        if (json.transactionId) {
            console.log(`✅ Updated: ${slug}`);
        } else {
            console.error(`❌ Failed: ${slug}`, json);
        }
    } catch (err) {
        console.error(`Error updating ${slug}:`, err);
    }
}

async function deleteDuplicatePosts() {
    // Find and delete duplicate omni-post entries
    const query = `*[_type=="post" && slug.current=="omni-post-ai-technical-documentation"] | order(_createdAt desc)`;

    try {
        const res = await fetch(`${SANITY_API_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();

        if (json.result && json.result.length > 1) {
            // Keep the first (most recent), delete the rest
            const toDelete = json.result.slice(1);
            console.log(`Found ${toDelete.length} duplicate omni-post entries, deleting...`);

            for (const post of toDelete) {
                await fetch(`${SANITY_API_URL}/data/mutate/${dataset}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ mutations: [{ delete: { id: post._id } }] })
                });
                console.log(`  Deleted duplicate: ${post._id}`);
            }
        }
    } catch (err) {
        console.error('Error deleting duplicates:', err);
    }
}

async function run() {
    console.log('=== Enhancing All Blog Posts with SEO and Tags ===\n');

    // Step 1: Delete duplicate posts
    console.log('Step 1: Cleaning up duplicates...');
    await deleteDuplicatePosts();

    // Step 2: Get all posts
    console.log('\nStep 2: Fetching all posts...');
    const query = `*[_type=="post"]{_id, slug, title}`;

    const res = await fetch(`${SANITY_API_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    const posts = json.result || [];

    console.log(`Found ${posts.length} posts\n`);

    // Step 3: Update each post
    console.log('Step 3: Updating posts with SEO and tags...\n');

    for (const post of posts) {
        const slug = post.slug?.current;
        if (!slug) continue;

        const enhancements = blogEnhancements[slug];
        if (!enhancements) {
            console.log(`⏭️  Skipping: ${slug} (no enhancements defined)`);
            continue;
        }

        console.log(`Processing: ${slug}`);

        // Create/get tag IDs
        const tagRefs = [];
        for (const tagName of enhancements.tags) {
            const tagId = await createTagIfNotExists(tagName);
            if (tagId) {
                tagRefs.push(tagId);
            }
        }

        // Update the post
        await updatePost(post._id, slug, enhancements, tagRefs);
    }

    console.log('\n=== Done! ===');
}

run();
