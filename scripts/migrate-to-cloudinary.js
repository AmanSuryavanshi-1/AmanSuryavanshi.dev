const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env and .env.local
const envPath = path.resolve(__dirname, '../.env');
const envPathLocal = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}
if (fs.existsSync(envPathLocal)) {
    dotenv.config({ path: envPathLocal, override: true });
}

// Configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error('❌ Missing Cloudinary credentials in .env or .env.local file.');
    console.error('   Expected: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    console.error('   Or: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, NEXT_PUBLIC_CLOUDINARY_API_SECRET');
    console.log('   Available keys:', Object.keys(process.env).filter(k => k.includes('CLOUD') || k.includes('API')));
    process.exit(1);
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'Omni-Post-AI-Automation', 'OMNI-POST-AI-Assets');
const DOCS_DIR = path.join(PROJECT_ROOT, 'Omni-Post-AI-Automation');
const CLOUDINARY_FOLDER = 'Omni_post_Ai_autoamtion/omni_post_ai_assets';

// Helper to recursively find files
function findFiles(dir, extension) {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(filePath, extension));
        } else {
            if (file.endsWith(extension)) {
                results.push(filePath);
            }
        }
    });
    return results;
}

// Helper to find all image files
function findImages(dir) {
    const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findImages(filePath));
        } else {
            if (extensions.some(ext => file.toLowerCase().endsWith(ext))) {
                results.push(filePath);
            }
        }
    });
    return results;
}

async function main() {
    console.log('🚀 Starting migration to Cloudinary...');

    // 1. Scan for images
    console.log(`🔍 Scanning for images in ${ASSETS_DIR}...`);
    const imagePaths = findImages(ASSETS_DIR);
    console.log(`✅ Found ${imagePaths.length} images.`);

    const uploadedImages = [];

    // 2. Upload images
    for (const imagePath of imagePaths) {
        const filename = path.basename(imagePath);

        console.log(`📤 Uploading: ${filename}...`);

        try {
            const result = await cloudinary.uploader.upload(imagePath, {
                folder: CLOUDINARY_FOLDER,
                use_filename: true,
                unique_filename: false,
                resource_type: 'auto',
            });

            // Construct URL with transformations: f_auto,q_auto,w_1600,c_limit
            const url = cloudinary.url(result.public_id, {
                transformation: [
                    { fetch_format: 'auto' },
                    { quality: 'auto' },
                    { width: 1600, crop: 'limit' }
                ],
                secure: true
            });

            uploadedImages.push({
                originalName: filename,
                publicId: result.public_id,
                url: url
            });

            console.log(`   ✅ Uploaded as ${result.public_id}`);
        } catch (error) {
            console.error(`   ❌ Failed to upload ${filename}:`, error);
        }
    }

    // 3. Scan for markdown files
    console.log(`\n🔍 Scanning for markdown files in ${DOCS_DIR}...`);
    const mdFiles = findFiles(DOCS_DIR, '.md');
    console.log(`✅ Found ${mdFiles.length} markdown files.`);

    // 4. Sort uploaded images by length of original name (descending) to prevent substring collisions
    uploadedImages.sort((a, b) => b.originalName.length - a.originalName.length);

    // 5. Update markdown files
    for (const mdFile of mdFiles) {
        console.log(`📝 Processing ${path.basename(mdFile)}...`);
        let content = fs.readFileSync(mdFile, 'utf-8');
        let modified = false;

        for (const image of uploadedImages) {
            // Escape special regex characters in filename
            const escapedName = image.originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Handle URL encoded version (spaces -> %20)
            const encodedName = encodeURIComponent(image.originalName);
            const escapedEncodedName = encodedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Regex to match:
            // Optional: ./ or /
            // Optional: OMNI-POST-AI-Assets/
            // Filename (either raw or encoded)

            // 1. Match raw filename (e.g. src="./My Image.png")
            const regexRaw = new RegExp(`(\\.?\\/?(OMNI-POST-AI-Assets[\\/\\\\])?${escapedName})`, 'g');

            // 2. Match encoded filename (e.g. src="./My%20Image.png")
            const regexEncoded = new RegExp(`(\\.?\\/?(OMNI-POST-AI-Assets[\\/\\\\])?${escapedEncodedName})`, 'g');

            if (regexRaw.test(content)) {
                content = content.replace(regexRaw, image.url);
                modified = true;
                console.log(`   🔄 Replaced reference to ${image.originalName}`);
            }

            if (encodedName !== image.originalName && regexEncoded.test(content)) {
                content = content.replace(regexEncoded, image.url);
                modified = true;
                console.log(`   🔄 Replaced encoded reference to ${image.originalName}`);
            }
        }

        if (modified) {
            fs.writeFileSync(mdFile, content, 'utf-8');
            console.log(`   💾 Saved changes to ${path.basename(mdFile)}`);
        } else {
            console.log(`   No changes needed.`);
        }
    }

    console.log('\n🎉 Migration complete!');
}

main().catch(console.error);
