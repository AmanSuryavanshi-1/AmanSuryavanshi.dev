const cloudinary = require('cloudinary').v2;
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config(); // Try default
dotenv.config({ path: path.join(__dirname, '../.env') }); // Try parent
dotenv.config({ path: path.join(__dirname, '../../.env') }); // Try grandparent (project root)
dotenv.config({ path: path.join(__dirname, '../../.env.local') }); // Try grandparent .env.local

// Configuration
const ASSETS_DIR = path.join(__dirname, '../OMNI-POST-AI-Assets');
const CLOUDINARY_FOLDER = 'Omni_post_Ai_autoamtion/omni_post_ai_assets';

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function upload() {
    const filesToUpload = [
        'Part_1_Generation_Workflow.png',
        'Part_2_Distribution_Workflow.png'
    ];

    for (const file of filesToUpload) {
        const filePath = path.join(ASSETS_DIR, file);
        const publicId = file.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_");

        try {
            console.log(`Uploading ${file}...`);
            const result = await cloudinary.uploader.upload(filePath, {
                folder: CLOUDINARY_FOLDER,
                public_id: publicId,
                use_filename: true,
                unique_filename: false,
                overwrite: true,
                resource_type: 'image'
            });

            const baseUrl = result.secure_url;
            const splitUrl = baseUrl.split('/upload/');
            const transformedUrl = `${splitUrl[0]}/upload/f_auto,q_auto,w_1600,c_limit/${splitUrl[1]}`;

            console.log(`UPLOADED: ${file} -> ${transformedUrl}`);

            // Write to results file
            const resultData = { file, url: transformedUrl };
            fs.appendFileSync('upload-results.json', JSON.stringify(resultData) + '\n');

        } catch (error) {
            console.error(`Failed to upload ${file}:`, error);
            fs.appendFileSync('upload-results.json', JSON.stringify({ file, error: error.message }) + '\n');
        }
    }
}

const fs = require('fs');
if (fs.existsSync('upload-results.json')) {
    fs.unlinkSync('upload-results.json');
}

upload();
