export const TAG_ALIASES: Record<string, string[]> = {
    'MCP': ['Model Context Protocol', 'mcp', 'model context protocol'],
    'AI Agents': ['AI Agent', 'ai agent', 'ai agents', 'AI agent framework'],
    'Automation': ['automation', 'n8n', 'n8n automation', 'workflow'],
    'Next.js': ['Next.js Developer', 'next.js', 'nextjs', 'react'],
    'Projects': ['Project', 'project', 'my projects', 'projects'],
};

export const normalizeTag = (tag: string): string => {
    const lowerTag = tag.toLowerCase();

    for (const [master, aliases] of Object.entries(TAG_ALIASES)) {
        if (master === tag || aliases.some(alias => alias.toLowerCase() === lowerTag)) {
            return master;
        }
    }

    return tag;
};

export const getAllRelatedTags = (masterTag: string): string[] => {
    const aliases = TAG_ALIASES[masterTag] || [];
    return [masterTag, ...aliases];
};
