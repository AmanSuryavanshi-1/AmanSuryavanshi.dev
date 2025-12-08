/**
 * Comprehensive Blog Audit & Update Script
 * 
 * This script:
 * 1. Sets random views (500-800) for all blog posts
 * 2. Marks specific blogs as featured
 * 3. Fixes SEO validation (title < 60, desc < 160)
 * 
 * Run: node scripts/audit-and-fix-all-blogs.js
 */

require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

// Blog-specific configurations
const blogConfigs = {
    'aviators-training-centre': {
        seoTitle: 'Aviators Training Centre: Full-Stack Aviation Case Study',
        metaDescription: 'Technical case study: full-stack aviation platform with n8n automation, AI lead gen, and modern React architecture.',
        focusKeyword: 'aviation training platform',
        featured: true,
    },
    'omni-post-ai-technical-documentation': {
        seoTitle: 'Omni-Post AI: Multi-Platform Content Automation',
        metaDescription: 'Complete docs for Omni-Post AI: intelligent content automation using n8n, Gemini AI, and social distribution.',
        focusKeyword: 'AI content automation',
        featured: true,
    },
    'av-news-stream': {
        seoTitle: 'AV News Stream | Real-Time News Platform',
        metaDescription: 'Technical breakdown of AV News Stream - a modern news streaming platform with React and real-time updates.',
        focusKeyword: 'news streaming platform',
        featured: false,
    },
    'developers-guide-building-ai-agents-with-model-context-protocol-mcp': {
        seoTitle: 'AI Agents Guide with Model Context Protocol (MCP)',
        metaDescription: 'Build AI agents with Model Context Protocol (MCP). Guide on architecture, implementation, and best practices.',
        focusKeyword: 'Model Context Protocol AI agents',
        featured: true,
    },
    'foodah': {
        seoTitle: 'Foodah | Food Delivery App Case Study',
        metaDescription: 'Case study of Foodah - a modern food delivery app showcasing frontend development and UX design.',
        focusKeyword: 'food delivery app development',
        featured: false,
    },
    'a-freelance-project-for-an-enterprise': {
        seoTitle: 'Enterprise Freelance Project | Web Development',
        metaDescription: 'Enterprise freelance project case study: business web development, client collaboration, and delivery.',
        focusKeyword: 'enterprise web development',
        featured: false,
    },
    'hoisting': {
        seoTitle: 'JavaScript Hoisting Explained | Developer Guide',
        metaDescription: 'Master JavaScript hoisting. Learn how variable and function declarations work, common pitfalls, and best practices.',
        focusKeyword: 'JavaScript hoisting',
        featured: false,
    },
    'null-and-undefined': {
        seoTitle: 'Null vs Undefined in JavaScript | Key Differences',
        metaDescription: 'Understand null vs undefined in JavaScript. When to use each, common mistakes, and best practices.',
        focusKeyword: 'JavaScript null vs undefined',
        featured: false,
    },
    'undefined-vs-not-defined': {
        seoTitle: 'Undefined vs Not Defined in JavaScript',
        metaDescription: 'Learn the difference between undefined and not defined in JavaScript. Avoid common errors.',
        focusKeyword: 'JavaScript undefined',
        featured: false,
    }
};

// Generate random views between 500-800
function getRandomViews() {
    return Math.floor(Math.random() * (800 - 500 + 1)) + 500;
}

async function updatePost(postId, slug, config) {
    const views = getRandomViews();

    const patch = {
        views: views,
        seoTitle: config.seoTitle,
        metaDescription: config.metaDescription,
        focusKeyword: config.focusKeyword,
        featured: config.featured,
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
            console.log(`✅ ${slug}: Views=${views}, Featured=${config.featured}`);
        } else {
            console.error(`❌ Failed: ${slug}`, json);
        }
    } catch (err) {
        console.error(`Error updating ${slug}:`, err);
    }
}

async function run() {
    console.log('=== Comprehensive Blog Audit & Fix ===\n');

    // Fetch all posts
    const query = `*[_type=="post"]{_id, slug, title}`;
    const res = await fetch(`${SANITY_API_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    const posts = json.result || [];

    console.log(`Found ${posts.length} posts\n`);

    for (const post of posts) {
        const slug = post.slug?.current;
        if (!slug) {
            console.log(`⏭️  Skipping post with no slug: ${post._id}`);
            continue;
        }

        const config = blogConfigs[slug];
        if (!config) {
            // For posts not in our config, just set random views
            console.log(`⏭️  Setting views only for: ${slug}`);
            try {
                await fetch(`${SANITY_API_URL}/data/mutate/${dataset}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        mutations: [{
                            patch: {
                                id: post._id,
                                set: { views: getRandomViews() }
                            }
                        }]
                    })
                });
            } catch (e) {
                console.error(`Error setting views for ${slug}:`, e);
            }
            continue;
        }

        await updatePost(post._id, slug, config);
    }

    console.log('\n=== Audit Complete ===');
}

run();
