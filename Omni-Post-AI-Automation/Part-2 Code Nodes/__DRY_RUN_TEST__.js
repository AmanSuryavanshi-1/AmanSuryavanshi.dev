// ════════════════════════════════════════════════════════════════════════════
// DRY RUN TEST - PART 2 CODE NODES
// Tests parser robustness with sample drafts from Notion
// Run this in a Code node to verify all parsers handle real data correctly
// ════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE DATA (from actual DraftsNotionLatestWorkflowRun folder)
// ═══════════════════════════════════════════════════════════════════════════

const sampleData = {
    // LinkedIn draft - stored with literal \n in Notion
    linkedin: `# LinkedIn Draft\n\n---\n\nI cut a client's ad spend to zero while generating ₹3,00,000+ in organic revenue in just four months.\n\nWhen I started working with Aviators Training Centre, they were trapped in a "pay-to-play" loop.\n\n#NextJS #Automation #SEO\n\n<<IMAGE_1>>`,

    // Twitter draft - JSON-wrapped from AI output
    twitter: `{
  "formatted_markdown": "# Twitter Draft\\n\\nThread 1\\n\\n---\\n\\nTweet 1/6\\n\\nI turned ₹0 ad spend into ₹3,00,000+ revenue for a flight school.\\n\\n<<IMAGE_1>>\\n\\n---\\n\\nTweet 2/6\\n\\nAd dependency is the silent killer.\\n\\nPaying ₹800/lead while spending 4 hours a day on manual follow-ups is a trap.",
  "structured_data": {
    "threads": [{
      "thread_id": 1,
      "tweets": [
        {"position": 1, "content": "I turned ₹0 ad spend into ₹3,00,000+ revenue for a flight school.\\n\\nMy client was bleeding ₹50k/month on ads.", "char_count": 95, "image_marker": "<<IMAGE_1>>"},
        {"position": 2, "content": "Ad dependency is the silent killer.", "char_count": 35}
      ]
    }]
  }
}`,

    // Blog draft - markdown content
    blog: `# How I Built a Zero-Cost Lead Generation Machine\n\n## TL;DR\nI cut a client's ad spend to zero while generating ₹3,00,000+ in organic revenue.\n\n<<IMAGE_1>>\n\n## The Problem\nWhen I started working with Aviators Training Centre, they were bleeding money.\n\n\`\`\`javascript\n// Before: Manual follow-up code\nsetTimeout(() => sendEmail(), 6 * 60 * 60 * 1000);\n\`\`\`\n\n<<IMAGE_2>>\n\n## The Solution\nI built a webhook-based architecture using n8n.`,

    // DevTo markdown
    devTo: `# Zero-Cost Lead Gen with Next.js and n8n\n\nI turned a bleeding ad budget into organic revenue.\n\n<<IMAGE_1>>\n\n## The Stack\n- Next.js 14 with App Router\n- n8n for automation\n- Airtable as CRM`,

    // Hashnode markdown
    hashnode: `# Building a Lead Generation Machine\n\nSubtitle: How I cut ad spend to zero\n\n<<IMAGE_1>>\n\n## Introduction\nThis is the story of how I transformed a client's digital presence.`
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS (copied from parser files)
// ═══════════════════════════════════════════════════════════════════════════

function robustJSONParse(rawStr) {
    if (!rawStr) return null;
    const jsonMatch = rawStr.match(/{[\s\S]*}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            try {
                const cleanBlock = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '');
                return JSON.parse(cleanBlock);
            } catch (e2) { return null; }
        }
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST CASES
// ═══════════════════════════════════════════════════════════════════════════

const results = {
    tests: [],
    passed: 0,
    failed: 0
};

// --- TEST 1: LinkedIn Parsing ---
function testLinkedIn() {
    try {
        let content = sampleData.linkedin;
        const parsed = robustJSONParse(content);
        if (parsed) {
            content = parsed.formatted_markdown || content;
        }

        content = content
            .replace(/^#\s*LinkedIn\s*Draft\s*/i, '')
            .replace(/^---\s*\n?/, '')
            .replace(/\\n/g, '\n')
            .replace(/<<IMAGE_\d+>>/g, '')
            .trim();

        const charCount = content.length;
        const hasContent = content.length > 50;
        const underLimit = charCount <= 2800;

        return {
            name: 'LinkedIn Parser',
            passed: hasContent && underLimit,
            charCount: charCount,
            underLimit: underLimit,
            sample: content.substring(0, 100) + '...'
        };
    } catch (e) {
        return { name: 'LinkedIn Parser', passed: false, error: e.message };
    }
}

// --- TEST 2: Twitter Parsing ---
function testTwitter() {
    try {
        const parsed = robustJSONParse(sampleData.twitter);

        if (!parsed) {
            return { name: 'Twitter Parser', passed: false, error: 'Failed to parse JSON' };
        }

        const tweets = parsed.structured_data?.threads?.[0]?.tweets || [];
        const allUnder280 = tweets.every(t => (t.content || '').length <= 280);

        return {
            name: 'Twitter Parser',
            passed: tweets.length > 0 && allUnder280,
            tweetCount: tweets.length,
            allUnder280: allUnder280,
            sampleTweet: tweets[0]?.content?.substring(0, 50) + '...'
        };
    } catch (e) {
        return { name: 'Twitter Parser', passed: false, error: e.message };
    }
}

// --- TEST 3: Blog Parsing ---
function testBlog() {
    try {
        let content = sampleData.blog;
        content = content.replace(/\\n/g, '\n');

        const hasTitle = content.includes('# ');
        const hasCodeBlock = content.includes('```');
        const markersRemoved = !content.replace(/<<IMAGE_\d+>>/g, '').includes('<<IMAGE');

        return {
            name: 'Blog Parser',
            passed: hasTitle && hasCodeBlock,
            hasTitle: hasTitle,
            hasCodeBlock: hasCodeBlock,
            markersRemoved: markersRemoved,
            wordCount: content.split(/\s+/).length
        };
    } catch (e) {
        return { name: 'Blog Parser', passed: false, error: e.message };
    }
}

// --- TEST 4: DevTo Parsing ---
function testDevTo() {
    try {
        let content = sampleData.devTo;
        content = content.replace(/<<IMAGE_\d+>>/g, '').trim();

        const hasTitle = content.startsWith('# ');
        const hasContent = content.length > 100;

        return {
            name: 'DevTo Parser',
            passed: hasTitle && hasContent,
            hasTitle: hasTitle,
            contentLength: content.length
        };
    } catch (e) {
        return { name: 'DevTo Parser', passed: false, error: e.message };
    }
}

// --- TEST 5: Hashnode Parsing ---
function testHashnode() {
    try {
        let content = sampleData.hashnode;
        content = content.replace(/<<IMAGE_\d+>>/g, '').trim();

        const hasTitle = content.startsWith('# ');
        const hasContent = content.length > 100;

        return {
            name: 'Hashnode Parser',
            passed: hasTitle && hasContent,
            hasTitle: hasTitle,
            contentLength: content.length
        };
    } catch (e) {
        return { name: 'Hashnode Parser', passed: false, error: e.message };
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN ALL TESTS
// ═══════════════════════════════════════════════════════════════════════════

const tests = [testLinkedIn, testTwitter, testBlog, testDevTo, testHashnode];

tests.forEach(test => {
    const result = test();
    results.tests.push(result);
    if (result.passed) {
        results.passed++;
    } else {
        results.failed++;
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n════════════════════════════════════════════════════');
console.log('   DRY RUN TEST RESULTS - PART 2 CODE NODES');
console.log('════════════════════════════════════════════════════\n');

results.tests.forEach(test => {
    const status = test.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} | ${test.name}`);
    if (!test.passed && test.error) {
        console.log(`       Error: ${test.error}`);
    }
});

console.log('\n════════════════════════════════════════════════════');
console.log(`   SUMMARY: ${results.passed}/${results.tests.length} tests passed`);
console.log('════════════════════════════════════════════════════\n');

return [{
    json: {
        summary: `${results.passed}/${results.tests.length} tests passed`,
        passed: results.passed,
        failed: results.failed,
        tests: results.tests
    }
}];
