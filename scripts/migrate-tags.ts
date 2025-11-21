const pathModule = require('path')
const { createClient } = require('@sanity/client')
const slugify = require('slugify')
const fs = require('fs')

// Load env vars
try {
    const envPath = pathModule.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath })
        const envConfig = require('dotenv').parse(fs.readFileSync(envPath))
        console.log('Keys in .env.local:', Object.keys(envConfig))
    } else {
        console.log('.env.local not found at:', envPath)
    }
} catch (e: any) {
    console.log('Could not read .env.local:', e.message)
}

// Configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN // Needs write access

if (!projectId || !dataset || !token) {
    console.error('Missing Sanity configuration. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and NEXT_PUBLIC_SANITY_API_WRITE_TOKEN are set.')
    console.log('Current env keys:', Object.keys(process.env).filter(k => k.startsWith('NEXT_') || k.startsWith('SANITY_')))
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const STANDARD_TAGS = [
    { name: 'AI & Automation', color: '#FF5733' },
    { name: 'Build in Public', color: '#33FF57' },
    { name: 'Agents', color: '#3357FF' },
    { name: 'API Integration', color: '#F333FF' },
    { name: 'n8n Workflows', color: '#FF33A8' },
    { name: 'MCP', color: '#33FFF5' },
    { name: 'Web Development', color: '#F5FF33' },
    { name: 'React', color: '#61DAFB' },
    { name: 'Next.js', color: '#000000' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'Sanity', color: '#F03E2F' },
]

async function migrateTags() {
    console.log('Starting tag migration (Tags-Only Architecture)...')

    // 1. Create Standard Tags
    const tagMap = new Map() // tagName -> tagId

    console.log('Creating/Updating standard tags...')
    for (const tagDef of STANDARD_TAGS) {
        const slug = slugify(tagDef.name, { lower: true, strict: true })
        const existingTag = await client.fetch(`*[_type == "tag" && slug.current == $slug][0]`, { slug })

        if (existingTag) {
            console.log(`Tag "${tagDef.name}" exists. Updating color...`)
            await client.patch(existingTag._id).set({ color: tagDef.color, featured: true }).commit()
            tagMap.set(tagDef.name, existingTag._id)
        } else {
            console.log(`Creating tag "${tagDef.name}"...`)
            const newTag = await client.create({
                _type: 'tag',
                name: tagDef.name,
                slug: { _type: 'slug', current: slug },
                color: tagDef.color,
                featured: true,
            })
            tagMap.set(tagDef.name, newTag._id)
        }
    }

    // 2. Fetch all posts with categories and tags
    const posts = await client.fetch(`*[_type == "post"] { 
    _id, 
    title, 
    tags, 
    categories[]->{title} 
  }`)
    console.log(`Found ${posts.length} posts.`)

    // 3. Process Posts
    for (const post of posts) {
        const newTags = new Set() // Set of tag IDs

        // Add existing string tags
        if (Array.isArray(post.tags)) {
            for (const tag of post.tags) {
                if (typeof tag === 'string') {
                    // Create tag if not exists (auto-create for legacy string tags)
                    const slug = slugify(tag, { lower: true, strict: true })

                    // Check if we already mapped it (from standard tags)
                    let tagId = Array.from(tagMap.entries()).find(([name]) => slugify(name, { lower: true, strict: true }) === slug)?.[1]

                    if (!tagId) {
                        // Check if it exists in Sanity but not in our local map yet
                        const existing = await client.fetch(`*[_type == "tag" && slug.current == $slug][0]`, { slug })
                        if (existing) {
                            tagId = existing._id
                        } else {
                            console.log(`Creating auto-tag from string: "${tag}"`)
                            const newTag = await client.create({
                                _type: 'tag',
                                name: tag,
                                slug: { _type: 'slug', current: slug },
                            })
                            tagId = newTag._id
                        }
                    }
                    if (tagId) newTags.add(tagId)
                } else if (tag._ref) {
                    // Already a reference
                    newTags.add(tag._ref)
                }
            }
        }

        // Add categories as tags
        if (Array.isArray(post.categories)) {
            for (const category of post.categories) {
                if (category && category.title) {
                    const slug = slugify(category.title, { lower: true, strict: true })

                    // Check map or fetch
                    let tagId = Array.from(tagMap.entries()).find(([name]) => slugify(name, { lower: true, strict: true }) === slug)?.[1]

                    if (!tagId) {
                        const existing = await client.fetch(`*[_type == "tag" && slug.current == $slug][0]`, { slug })
                        if (existing) {
                            tagId = existing._id
                        } else {
                            console.log(`Creating tag from category: "${category.title}"`)
                            const newTag = await client.create({
                                _type: 'tag',
                                name: category.title,
                                slug: { _type: 'slug', current: slug },
                                featured: true // Categories were likely important
                            })
                            tagId = newTag._id
                        }
                    }
                    if (tagId) newTags.add(tagId)
                }
            }
        }

        // Update Post
        if (newTags.size > 0) {
            const tagsArray = Array.from(newTags).map(id => ({
                _type: 'reference',
                _ref: id,
                _key: id
            }))

            console.log(`Updating post "${post.title}" with ${tagsArray.length} tags...`)
            await client
                .patch(post._id)
                .set({ tags: tagsArray })
                .unset(['categories']) // Remove categories field
                .commit()
        }
    }

    console.log('Migration complete!')
}

migrateTags().catch((err: any) => {
    console.error('Migration failed:', err)
    process.exit(1)
})

export { }
