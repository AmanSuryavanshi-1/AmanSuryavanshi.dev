require('dotenv').config({ path: ['.env.local', '.env'] });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function checkAsset() {
    try {
        console.log('Searching for Asset_6...');
        // Search by filename (public_id containing the name)
        const result = await cloudinary.search
            .expression('filename:Asset_6* AND folder:Omni_post_Ai_autoamtion/*')
            .execute();

        if (result.resources.length > 0) {
            console.log('Found assets:');
            result.resources.forEach(res => {
                console.log(JSON.stringify({
                    public_id: res.public_id,
                    format: res.format,
                    secure_url: res.secure_url
                }, null, 2));
            });
        } else {
            console.log('No asset found with filename starting with Asset_6');

            // Try broader search in folder just in case
            const folderResult = await cloudinary.search
                .expression('folder:Omni_post_Ai_autoamtion/omni_post_ai_assets')
                .max_results(50)
                .execute();

            console.log('All assets in folder (first 50):');
            folderResult.resources.forEach(res => {
                if (res.public_id.includes('Asset_6') || res.public_id.includes('Session')) {
                    console.log(JSON.stringify({
                        public_id: res.public_id,
                        format: res.format,
                        secure_url: res.secure_url
                    }, null, 2));
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

checkAsset();
