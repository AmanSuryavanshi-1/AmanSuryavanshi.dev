/**
 * Comprehensive validation check for blog posts
 * Run: node scripts/full-validation-check.js
 */

require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function run() {
    console.log('=== Full Validation Check ===\n');

    const query = `*[_type=="post" && (slug.current=="aviators-training-centre" || slug.current=="omni-post-ai-technical-documentation")]{
        _id,
        title,
        slug,
        seoTitle,
        metaDescription,
        excerpt,
        status,
        mainImage,
        "hasMainImageAlt": defined(mainImage.alt),
        "seoTitleLength": length(seoTitle),
        "metaDescLength": length(metaDescription),
        "excerptLength": length(excerpt),
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
            console.log(`Slug: ${post.slug?.current}`);
            console.log(`Status: ${post.status}`);
            console.log(`\nSEO Fields:`);
            console.log(`  seoTitle: "${post.seoTitle}" (${post.seoTitleLength} chars, max 60)`);
            console.log(`  metaDescription: "${post.metaDescription}" (${post.metaDescLength} chars, max 160)`);
            console.log(`  excerpt: (${post.excerptLength} chars, max 160)`);
            console.log(`\nMain Image:`);
            console.log(`  Has asset: ${!!post.mainImage?.asset}`);
            console.log(`  Has alt: ${post.hasMainImageAlt}`);

            // Check for validation issues
            const issues = [];
            if (post.seoTitleLength > 60) issues.push(`seoTitle too long (${post.seoTitleLength}/60)`);
            if (post.metaDescLength > 160) issues.push(`metaDescription too long (${post.metaDescLength}/160)`);
            if (post.excerptLength > 160) issues.push(`excerpt too long (${post.excerptLength}/160)`);
            if (post.mainImage?.asset && !post.hasMainImageAlt) issues.push(`mainImage missing alt text`);

            // Check body for empty image blocks
            const emptyImages = (post.body || []).filter(b => b._type === 'image' && !b.asset);
            if (emptyImages.length > 0) issues.push(`${emptyImages.length} empty image blocks`);

            console.log(`\nValidation Issues: ${issues.length === 0 ? 'None' : ''}`);
            issues.forEach(i => console.log(`  ❌ ${i}`));
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
