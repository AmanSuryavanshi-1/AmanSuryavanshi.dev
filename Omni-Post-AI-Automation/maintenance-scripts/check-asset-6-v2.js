require('dotenv').config({ path: ['.env.local', '.env'] });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function checkAsset() {
    try {
        console.log('Fetching resources...');
        // List resources in the folder
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'Omni_post_Ai_autoamtion/omni_post_ai_assets',
            max_results: 100
        });

        const asset = result.resources.find(res => res.public_id.includes('Asset_6') || res.public_id.includes('Session'));

        if (asset) {
            console.log('Found Asset:');
            console.log(JSON.stringify(asset, null, 2));
            // Generate url
            const url = cloudinary.url(asset.public_id, {
                format: asset.format,
                quality: 'auto',
                fetch_format: 'auto',
                width: 1600,
                crop: 'limit'
            });
            console.log('Generated URL:', url);
        } else {
            console.log('Asset 6 not found in listing.');
            console.log('Available assets:');
            result.resources.forEach(r => console.log(r.public_id));
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

checkAsset();
