const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER_NAME = 'Omni_post_Ai_autoamtion/omni_post_ai_assets';

async function fetchAssets() {
    console.log(`Fetching assets from folder: ${FOLDER_NAME}...`);

    try {
        let resources = [];
        let nextCursor = null;

        do {
            const result = await cloudinary.search
                .expression(`folder:"${FOLDER_NAME}"`)
                .max_results(500)
                .next_cursor(nextCursor)
                .execute();

            resources = resources.concat(result.resources);
            nextCursor = result.next_cursor;

        } while (nextCursor);

        console.log(`Found ${resources.length} assets.`);

        const simplifiedAssets = resources.map(res => ({
            public_id: res.public_id,
            filename: res.filename,
            format: res.format,
            url: res.secure_url,
            optimizedUrl: res.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1600,c_limit/')
        }));

        fs.writeFileSync('cloudinary-assets.json', JSON.stringify(simplifiedAssets, null, 2));
        console.log('Saved assets to cloudinary-assets.json');

    } catch (error) {
        console.error('Error fetching assets:', error);
        // Fallback to Admin API if search fails (search requires specific plan/permissions sometimes)
        try {
            console.log('Attempting fallback to Admin API...');
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: FOLDER_NAME,
                max_results: 500
            });

            const simplifiedAssets = result.resources.map(res => ({
                public_id: res.public_id,
                filename: res.public_id.split('/').pop(), // approximate filename
                format: res.format,
                url: res.secure_url,
                optimizedUrl: res.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1600,c_limit/')
            }));

            fs.writeFileSync('cloudinary-assets.json', JSON.stringify(simplifiedAssets, null, 2));
            console.log('Saved assets to cloudinary-assets.json (via Admin API)');
        } catch (adminError) {
            console.error('Error with Admin API fallback:', adminError);
        }
    }
}

fetchAssets();
