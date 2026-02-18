// ════════════════════════════════════════════════════════════════════════════
// PROCESS AI STRATEGY (V6 - Enhanced Validation, Feb 2026)
// ════════════════════════════════════════════════════════════════════════════

// 1. SAFE INPUT EXTRACTION
// We use optional chaining and fallback objects to prevent "Cannot read property of undefined" errors
const geminiRawOutput = $input.first()?.json || {};
const contextNode = $('Code – CONTEXT MERGER').first();
const originalContext = contextNode ? contextNode.json : {};

// Validate Critical Inputs
if (Object.keys(geminiRawOutput).length === 0) {
  throw new Error('❌ CRITICAL: No input received from Gemini AI Node.');
}
if (Object.keys(originalContext).length === 0) {
  // Warn but don't crash hard if context is missing (useful for isolated testing)
  console.log('⚠️ WARNING: Original Context is empty. Merging might be incomplete.');
}

// 2. ROBUST JSON PARSING (The "Fence Stripper")
// AI often wraps output in markdown or adds conversational filler. We strip it all.
let rawText = geminiRawOutput.text ||
  geminiRawOutput.content?.parts?.[0]?.text ||
  geminiRawOutput.result || // Some Gemini node versions use .result
  "";

// Handle edge case where the input itself is just the string
if (typeof geminiRawOutput === 'string') rawText = geminiRawOutput;

const firstBrace = rawText.indexOf('{');
const lastBrace = rawText.lastIndexOf('}');

if (firstBrace === -1 || lastBrace === -1) {
  // Output the raw text to the error log so you can debug *what* the AI actually said
  throw new Error(`CRITICAL: Valid JSON not found in AI output. Raw Output Preview: ${rawText.substring(0, 100)}...`);
}

const jsonString = rawText.substring(firstBrace, lastBrace + 1);
let strategy;
try {
  strategy = JSON.parse(jsonString);
} catch (e) {
  // Common AI error: trailing commas. We fail strictly here to ensure data integrity.
  throw new Error(`CRITICAL: JSON Syntax Error. The extracted block was not valid JSON. Error: ${e.message}`);
}

// 3. DEEP VALIDATION & SANITIZATION (The Checkpoints)
function validateAndSanitize(data) {
  const issues = [];

  // A. Top-Level Integrity
  if (!data?.strategy_summary) issues.push("Missing 'strategy_summary'");
  if (!data?.platform_strategies) issues.push("Missing 'platform_strategies'");

  const platforms = data.platform_strategies || {};

  // B. Source Quality Assessment (V6 Enhancement)
  // The Strategist now outputs source_quality. Ensure safe defaults.
  if (!data.source_quality) {
    data.source_quality = 'moderate'; // Safe default
    console.log('⚠️ source_quality not found in strategy output. Defaulting to "moderate".');
  }
  // Validate it's a known value
  const validQualities = ['strong', 'moderate', 'thin'];
  if (!validQualities.includes(data.source_quality)) {
    console.log(`⚠️ Invalid source_quality "${data.source_quality}". Resetting to "moderate".`);
    data.source_quality = 'moderate';
  }
  // If thin, ensure quality_warning exists
  if (data.source_quality === 'thin' && !data.quality_warning) {
    data.quality_warning = 'Source flagged as thin but no quality_warning provided by Strategist.';
  }

  // C. Narrative Arc Validation (V6 Enhancement)
  if (!data.narrative_arc) {
    data.narrative_arc = {
      formula: 'PAS',
      the_villain: 'Not identified by strategist',
      the_epiphany: 'Not identified by strategist',
      the_transformation: 'Not identified by strategist'
    };
    console.log('⚠️ narrative_arc missing. Created safe default.');
  } else {
    // Ensure formula field exists (new in V6)
    if (!data.narrative_arc.formula) {
      data.narrative_arc.formula = 'PAS'; // Default narrative formula
    }
    // Validate formula is a known pattern
    const validFormulas = ['PAS', 'BAB', 'BUT_THEREFORE'];
    if (!validFormulas.includes(data.narrative_arc.formula)) {
      console.log(`⚠️ Unknown narrative formula "${data.narrative_arc.formula}". Keeping as-is.`);
    }
  }

  // D. Psychological Triggers Validation (V6 Enhancement)
  if (!data.psychological_triggers) {
    data.psychological_triggers = {
      stop_trigger_type: 'pattern_interrupt',
      save_trigger: 'Not specified',
      share_trigger: 'Not specified',
      authenticity_signal: 'Not specified',
      emotional_arc: 'curiosity → tension → relief → empowerment'
    };
    console.log('⚠️ psychological_triggers missing. Created safe default.');
  }

  // E. Twitter/X Sanitization
  if (!platforms.twitter) {
    // Auto-fix: Create a minimal valid object so downstream nodes don't crash
    platforms.twitter = {
      hashtags: [],
      content_breakdown: ["General Strategy Update"]
    };
  } else {
    // Enforce array types for iterables
    if (!Array.isArray(platforms.twitter.hashtags)) platforms.twitter.hashtags = [];
  }

  // F. LinkedIn Validation (We treat this as critical)
  if (!platforms.linkedin) {
    issues.push("Missing 'platform_strategies.linkedin'");
  }

  // G. Image Strategy Safety (Crucial for branching nodes)
  if (!data.image_strategy) {
    // Safe default: No images needed
    data.image_strategy = {
      needs_images: false,
      rationale: "Default fallback (AI strategy missing)",
      specific_prompts: []
    };
  } else {
    // Ensure specific_prompts is always an array
    if (!Array.isArray(data.image_strategy.specific_prompts)) {
      data.image_strategy.specific_prompts = [];
    }
    // Boolean enforcement
    data.image_strategy.needs_images = !!data.image_strategy.needs_images;
  }

  // If critical fields are missing, fail the workflow so you are alerted
  if (issues.length > 0) {
    throw new Error(`VALIDATION FAILED: ${issues.join(', ')}`);
  }

  return data;
}

// Run the validator
const cleanStrategy = validateAndSanitize(strategy);

// 4. MASTER MERGE
// Combine everything into one guaranteed object for the next nodes
const masterData = {
  // Use optional chaining to safely access deep properties from context
  personalContext: originalContext?.personalContext || {},
  sourceContent: originalContext?.sourceContent || {},
  research: originalContext?.research || {},
  workflowMetadata: originalContext?.workflowMetadata || {},
  strategy: cleanStrategy,
  _meta: {
    parsedAt: new Date().toISOString(),
    validatorVersion: "6.0-Enhanced",
    sourceQuality: cleanStrategy.source_quality,
    narrativeFormula: cleanStrategy.narrative_arc?.formula || 'PAS'
  }
};

return [{ json: masterData }];