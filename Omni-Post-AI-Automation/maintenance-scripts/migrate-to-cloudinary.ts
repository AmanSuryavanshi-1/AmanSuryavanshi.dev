const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config(); // Try default
dotenv.config({ path: path.join(__dirname, '../.env') }); // Try parent
dotenv.config({ path: path.join(__dirname, '../../.env') }); // Try grandparent (project root)
dotenv.config({ path: path.join(__dirname, '../../.env.local') }); // Try grandparent .env.local

// Configuration
const ASSETS_DIR = path.join(__dirname, '../OMNI-POST-AI-Assets');
const DOCS_DIR = path.join(__dirname, '../');
const CLOUDINARY_FOLDER = 'Omni_post_Ai_autoamtion/omni_post_ai_assets';

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrate() {
    console.log('Starting migration...');

    if (!fs.existsSync(ASSETS_DIR)) {
        console.error(`Assets directory not found: ${ASSETS_DIR}`);
        return;
    }

    const files = fs.readdirSync(ASSETS_DIR).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
    });

    console.log(`Found ${files.length} images to upload.`);

    const mappings = [];

    // 1. Upload Images
    for (const file of files) {
        const filePath = path.join(ASSETS_DIR, file);
        const publicId = file.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_"); // Remove extension and replace spaces with underscores

        try {
            console.log(`Uploading ${file} as ${publicId}...`);

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

            mappings.push({
                localName: file,
                cloudinaryUrl: transformedUrl
            });

            console.log(`Uploaded ${file} -> ${transformedUrl}`);

        } catch (error) {
            console.error(`Failed to upload ${file}:`, error);
        }
    }

    // Sort mappings by localName length descending to prevent substring collisions
    mappings.sort((a, b) => b.localName.length - a.localName.length);

    // 2. Update Markdown Files
    const mdFiles = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.md'));

    console.log(`Found ${mdFiles.length} markdown files to scan.`);

    for (const mdFile of mdFiles) {
        const mdPath = path.join(DOCS_DIR, mdFile);
        let content = fs.readFileSync(mdPath, 'utf-8');
        let updated = false;

        for (const mapping of mappings) {
            const searchPatterns = [
                `./OMNI-POST-AI-Assets/${mapping.localName}`,
                `OMNI-POST-AI-Assets/${mapping.localName}`
            ];

            for (const pattern of searchPatterns) {
                if (content.includes(pattern)) {
                    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(escapedPattern, 'g');
                    content = content.replace(regex, mapping.cloudinaryUrl);
                    updated = true;
                    console.log(`Updated reference to ${mapping.localName} in ${mdFile}`);
                }
            }
        }

        if (updated) {
            fs.writeFileSync(mdPath, content, 'utf-8');
            console.log(`Saved changes to ${mdFile}`);
        } else {
            console.log(`No changes needed for ${mdFile}`);
        }
    }

    console.log('Migration complete.');
}

migrate().catch(console.error);
