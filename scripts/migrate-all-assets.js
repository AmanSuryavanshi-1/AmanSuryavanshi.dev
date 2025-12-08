const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
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
    console.error('❌ Missing Cloudinary credentials.');
    process.exit(1);
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_PROJECT_DIR = path.join(PROJECT_ROOT, 'public', 'Project');
const TRACKING_FILE = path.join(__dirname, 'migrated-assets.json');
const LOG_FILE = path.join(__dirname, 'migration.log');

// Mappings
const FOLDER_MAPPINGS = {
    'AviatorsTrainingCentre': 'aviators-training-centre/docs-assets',
};

// Logging helper
function log(msg) {
    console.log(msg);
    try {
        fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) {
        console.error('Failed to write to log file', e);
    }
}

// Helper to find all assets recursively
function findAssets(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findAssets(filePath));
        } else {
            const ext = path.extname(file).toLowerCase();
            // Images and Videos
            if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4', '.mov', '.webm'].includes(ext)) {
                results.push(filePath);
            }
        }
    });
    return results;
}

async function main() {
    log('🚀 Starting bulk migration (Root Folder Mapping)...');

    // 1. Load existing tracking data
    let migratedAssets = {};
    if (fs.existsSync(TRACKING_FILE)) {
        try {
            migratedAssets = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
        } catch (e) {
            log('⚠️ Could not parse existing tracking file, starting fresh.');
        }
    }

    // 2. Scan public/Project
    log(`🔍 Scanning ${PUBLIC_PROJECT_DIR}...`);
    const assetPaths = findAssets(PUBLIC_PROJECT_DIR);
    log(`✅ Found ${assetPaths.length} assets.`);

    for (const assetPath of assetPaths) {
        const relativePath = path.relative(PROJECT_ROOT, assetPath);

        // Check if already migrated
        if (migratedAssets[relativePath]) {
            continue;
        }

        const filename = path.basename(assetPath);
        const parentDir = path.dirname(assetPath);
        const folderName = path.basename(parentDir);

        // Determine Cloudinary Folder
        let cloudinaryFolder = '';

        if (FOLDER_MAPPINGS[folderName]) {
            cloudinaryFolder = FOLDER_MAPPINGS[folderName];
        } else {
            // PROPOSE: Move to root (remove public/Project prefix)
            // e.g., public/Project/AV-NewsStream -> AV-NewsStream
            const relToPublicProject = path.relative(PUBLIC_PROJECT_DIR, parentDir);

            if (relToPublicProject === '') {
                cloudinaryFolder = `Misc_Assets`;
            } else {
                const normalizedRel = relToPublicProject.split(path.sep).join('/');
                cloudinaryFolder = normalizedRel;
            }
        }

        cloudinaryFolder = cloudinaryFolder.replace(/\/+$/, '');

        // Determine Resource Type
        const ext = path.extname(assetPath).toLowerCase();
        const resourceType = ['.mp4', '.mov', '.webm'].includes(ext) ? 'video' : 'image';

        // Sanitize filename for public_id
        const nameWithoutExt = path.parse(filename).name;
        const sanitizedName = nameWithoutExt.replace(/\./g, '_');
        const fullPublicId = `${cloudinaryFolder}/${sanitizedName}`;

        log(`📤 Processing: ${filename}`);
        log(`   Target Public ID: ${sanitizedName} (in folder: ${cloudinaryFolder})`);

        try {
            let result;
            const stats = fs.statSync(assetPath);
            const isLarge = stats.size > 5000000; // > 5MB

            if (resourceType === 'video' || isLarge) {
                log(`   Running upload_large...`);

                result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_large(assetPath, {
                        public_id: sanitizedName,
                        folder: cloudinaryFolder,
                        resource_type: resourceType,
                        use_filename: false,
                        unique_filename: false,
                        chunk_size: 6000000,
                        timeout: 600000,
                    }, (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    });
                });
            } else {
                log(`   Running standard upload...`);
                result = await cloudinary.uploader.upload(assetPath, {
                    public_id: sanitizedName,
                    folder: cloudinaryFolder,
                    use_filename: false,
                    unique_filename: false,
                    resource_type: resourceType,
                });
            }

            // Generate optimized URL
            let url = '';
            if (resourceType === 'image') {
                url = cloudinary.url(result.public_id, {
                    transformation: [
                        { fetch_format: 'auto' },
                        { quality: 'auto' },
                        { width: 1600, crop: 'limit' }
                    ],
                    secure: true
                });
            } else {
                url = result.secure_url;
            }

            log(`   ✅ Success: ${url}`);

            // Update tracking
            migratedAssets[relativePath] = url;
            fs.writeFileSync(TRACKING_FILE, JSON.stringify(migratedAssets, null, 2));

        } catch (error) {
            log(`   ❌ Failed to upload ${filename}: ${error.message}`);
        }
    }

    log('\n🎉 Bulk migration and tracking complete!');
}

main().catch(e => log(`Critical Error: ${e.message}`));
