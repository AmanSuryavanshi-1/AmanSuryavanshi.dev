/**
 * Delete duplicate Sanity post
 * Run: node scripts/delete-duplicate-blog.js
 */
require('dotenv').config({ path: '.env.local' });
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01';
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

const deleteId = 'qcKEXgQs8Gc4YVFIRAWL9o'; // The older duplicate

async function deletePost() {
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
    const mutations = [{ delete: { id: deleteId } }];

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ mutations })
        });
        const json = await res.json();
        console.log('Delete result:', JSON.stringify(json, null, 2));
    } catch (err) {
        console.error(err);
    }
}

deletePost();
