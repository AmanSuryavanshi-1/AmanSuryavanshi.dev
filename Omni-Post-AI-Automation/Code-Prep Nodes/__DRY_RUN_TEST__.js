// ════════════════════════════════════════════════════════════════════════════
// DRY RUN TEST FILE - Code-Prep Logic Validator
// Use: Paste into n8n "Execute Code" node to test robustness
// ════════════════════════════════════════════════════════════════════════════

// SIMULATED DIRTY AI INPUTS (Common failure scenarios)
const testCases = [
    // Test 1: Clean JSON
    {
        name: "Clean JSON",
        input: '{"formatted_markdown": "# Hello World\\n\\nThis is a test.", "structured_data": {"seo": {"title": "Test Title"}}}'
    },
    // Test 2: JSON with Markdown Fences
    {
        name: "JSON with Markdown Fences",
        input: '```json\n{"formatted_markdown": "# Hello", "structured_data": {}}\n```'
    },
    // Test 3: Conversational Prefix
    {
        name: "Conversational Prefix",
        input: 'Here is the content you requested:\n\n{"formatted_markdown": "# Content Here", "structured_data": {}}'
    },
    // Test 4: Raw Markdown (No JSON)
    {
        name: "Raw Markdown (No JSON)",
        input: '# This is Markdown\n\nJust plain text, no JSON wrapper.'
    },
    // Test 5: Broken JSON (Missing brace)
    {
        name: "Broken JSON",
        input: '{"formatted_markdown": "# Broken JSON" // Missing end brace'
    },
    // Test 6: Very Long Paragraph (Chunking Test - >1900 chars)
    {
        name: "Long Paragraph",
        input: '{"formatted_markdown": "' + 'A'.repeat(2500) + '"}'
    }
];

// ════════════════════════════════════════════════════════════════════════════
// ROBUST PARSING FUNCTIONS (Same as in Code-Prep Nodes)
// ════════════════════════════════════════════════════════════════════════════

function sanitizeText(text) {
    if (!text) return "";
    return String(text)
        .replace(/\u0000/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .normalize('NFC')
        .replace(/\r\n/g, '\n');
}

function robustJSONParse(rawStr) {
    if (!rawStr) return null;
    const jsonMatch = rawStr.match(/{[\s\S]*}/);
    if (jsonMatch) {
        try { return JSON.parse(jsonMatch[0]); } catch (e) {
            try { return JSON.parse(jsonMatch[0].replace(/```json/g, '').replace(/```/g, '')); } catch (e2) { }
        }
    }
    try { return JSON.parse(rawStr); } catch (e) { return null; }
}

function semanticChunking(text, maxChars = 1900) {
    const chunks = [];
    let currentChunk = "";
    const paragraphs = text.split('\n\n');

    for (const paragraph of paragraphs) {
        if ((currentChunk.length + paragraph.length + 2) <= maxChars) {
            currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        } else {
            if (currentChunk) { chunks.push(currentChunk); currentChunk = ""; }
            if (paragraph.length <= maxChars) {
                currentChunk = paragraph;
            } else {
                // Force split long paragraphs
                let tempPar = paragraph;
                while (tempPar.length > 0) {
                    chunks.push(tempPar.substring(0, maxChars));
                    tempPar = tempPar.substring(maxChars);
                }
            }
        }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}

// ════════════════════════════════════════════════════════════════════════════
// TEST RUNNER
// ════════════════════════════════════════════════════════════════════════════

const results = testCases.map(testCase => {
    let parsedJSON = robustJSONParse(testCase.input);
    let extractedText = "";

    if (parsedJSON) {
        extractedText = parsedJSON.formatted_markdown || parsedJSON.markdown || parsedJSON.text || "";
    } else {
        // Fallback
        const fenceMatch = testCase.input.match(/```(?:markdown)?\s*([\s\S]*?)```/);
        if (fenceMatch) {
            extractedText = fenceMatch[1];
        } else {
            extractedText = testCase.input
                .replace(/^Here is the.*?:\s*/i, '')
                .replace(/^Sure.*?:\s*/i, '');
        }
    }

    const cleanText = sanitizeText(extractedText).trim();
    const chunks = semanticChunking(cleanText, 1900);

    return {
        testName: testCase.name,
        jsonParsed: parsedJSON !== null,
        extractedLength: cleanText.length,
        chunkCount: chunks.length,
        firstChunkPreview: chunks[0] ? chunks[0].substring(0, 50) + "..." : "EMPTY",
        status: cleanText.length > 0 ? "✅ PASS" : "❌ FAIL"
    };
});

// Return results for inspection
return results.map(r => ({ json: r }));
