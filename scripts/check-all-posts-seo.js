
require('dotenv').config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const SANITY_API_URL = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function run() {
    console.log('Fetching all posts...');
    const query = `*[_type=="post"]{_id, title, slug, seoTitle, metaDescription, focusKeyword}`;

    try {
        const res = await fetch(`${SANITY_API_URL}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        const posts = json.result || [];

        console.log(`Found ${posts.length} posts:\n`);

        posts.forEach(post => {
            const slug = post.slug?.current || 'NO_SLUG';
            const seoTitleDesc = post.seoTitle
                ? `${post.seoTitle} (${post.seoTitle.length} chars)`
                : 'MISSING';
            const metaDesc = post.metaDescription
                ? `${post.metaDescription.substring(0, 50)}... (${post.metaDescription.length} chars)`
                : 'MISSING';

            console.log(`Slug: ${slug}`);
            console.log(`  Title: ${post.title}`);
            console.log(`  SEO Title: ${seoTitleDesc}`);
            console.log(`  Meta Desc: ${metaDesc}`);
            console.log(`  Focus Keyword: ${post.focusKeyword || 'MISSING'}`);
            console.log('---');
        });

    } catch (err) {
        console.error('Error fetching posts:', err);
    }
}

run();
