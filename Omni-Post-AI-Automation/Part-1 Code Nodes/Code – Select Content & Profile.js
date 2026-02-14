// CONTENT SELECTION & PROFILE SETUP
const items = $input.all();

if (!items || items.length === 0) {
    console.log('❌ No content ready for processing');
    return [];
}

// Get first item (priority + FIFO)
const item = items[0].json;
console.log('🎯 Processing item:', item.id);

// Enhanced property extraction with fallbacks
const getProperty = (obj, path, defaultValue = '') => {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            return defaultValue;
        }
    }
    return result || defaultValue;
};

const title = getProperty(item, 'properties.Content Pages.title.0.plain_text') ||
    getProperty(item, 'properties.title.title.0.plain_text') ||
    getProperty(item, 'properties.Name.title.0.plain_text') ||
    getProperty(item, 'name') ||
    'Untitled Content';

const category = getProperty(item, 'properties.Category.select.name') ||
    'Learning';

const priority = getProperty(item, 'properties.Priority.select.name') ||
    'normal';

// Complete user profile for authentic content
const userProfile = {
    name: 'Aman Surya',
    role: 'Fresh CS Graduate & AI/ML Enthusiast',
    focus: 'Building with Next.js/React/n8n, seeking AI PM roles',
    personality: 'Authentic, curious, growth-minded, detail-oriented',
    expertise: ['JavaScript', 'React', 'Next.js', 'n8n', 'AI/ML', 'Automation', 'Product Management'],
    audience: 'Tech community, AI enthusiasts, developers, PM aspirants',
    timezone: 'Asia/Kolkata',
    writing_style: {
        twitter: 'Casual, engaging, thread-friendly, question-driven, community-focused',
        linkedin: 'Professional, detailed, story-driven, insight-rich, career-focused'
    },
    content_goals: {
        primary: 'Build technical credibility for AI PM roles',
        secondary: 'Help fellow developers learn and grow',
        engagement: 'Create genuine discussions and valuable connections'
    }
};

const sessionId = `session_${Date.now()}_${(item.id || '').toString().substring(0, 8)}`;

return [{
    json: {
        id: item.id,
        title: title,
        category: category,
        priority: priority,
        sessionId: sessionId,
        userProfile: userProfile,
        processingStartTime: new Date().toISOString(),
        remainingItems: items.length - 1,
        originalId: item.id
    }
}];