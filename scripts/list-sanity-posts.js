/**
 * List all Sanity posts to identify duplicates - output to file
 * Run: node scripts/list-sanity-posts.js
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

async function listPosts() {
    const query = `*[_type=="post"]{_id, title, slug, _createdAt, "contentLength": count(body)}`;
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        fs.writeFileSync(path.join(__dirname, 'posts-list.json'), JSON.stringify(json.result, null, 2));
        console.log('Written to posts-list.json');
    } catch (err) {
        console.error(err);
    }
}

listPosts();
