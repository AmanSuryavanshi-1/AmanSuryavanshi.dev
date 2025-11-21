const path = require('path')
const { createClient } = require('@sanity/client')
const fs = require('fs')

// Load env vars
try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath })
    } else {
        console.log('.env.local not found at:', envPath)
    }
} catch (e: any) {
    console.log('Could not read .env.local:', e.message)
}

// Configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
    console.error('Missing Sanity configuration.')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
})

// Muted, theme-friendly colors that blend with forest/sage/lime theme
const mutedColorMap: Record<string, string> = {
    // Priority tags - slightly more visible
    'Projects': '#7C9A48', // Muted olive-green
    'Featured': '#8BA85F', // Muted sage-green
    'AI Agents': '#6B8E7F', // Muted teal-green
    'n8n automation': '#6B9B6E', // Muted green

    // Important SEO tags - subtle
    'Next.js': '#7A8B9C', // Muted blue-grey
    'MCP': '#8B7FA3', // Muted purple-grey
    'Automation': '#7B9B8C', // Muted mint
    'AI & Automation': '#7B9B8C',
    'LangChain': '#7788A3', // Muted slate-blue
    'React': '#7C98B3', // Very muted blue
    'TypeScript': '#7788A3',

    // Less important - very subtle
    'LLM Tool Use': '#8B9A8B', // Very muted grey-green
    'AI coding assistant': '#8B9098',
    'MCP Tutorial': '#8B7FA3',
    'AI agent framework': '#8B9A8B',
    'Next.js Developer': '#8B9A9C',
    'Sanity': '#A3847A' // Muted terracotta
};

async function updateTagColors() {
    console.log('🎨 Starting muted color update...')
    const tags = await client.fetch('*[_type == "tag"]')
    console.log(`Found ${tags.length} tags.`)

    for (const tag of tags) {
        const newColor = mutedColorMap[tag.name];
        if (newColor) {
            console.log(`Updating "${tag.name}" to ${newColor}...`)
            await client.patch(tag._id)
                .set({ color: newColor })
                .commit();
        } else {
            console.log(`No color defined for "${tag.name}", keeping existing.`)
        }
    }

    console.log('✅ All tag colors updated to muted palette!')
}

updateTagColors().catch((err: any) => {
    console.error('Update failed:', err)
    process.exit(1)
})
