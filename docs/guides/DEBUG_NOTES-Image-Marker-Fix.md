# DEBUG NOTES: The <<IMAGE_X>> Marker Problem

**Date:** March 17, 2026
**Pipeline:** Omni-Post AI Content Automation (Part 1)
**Models Tested:** Claude Sonnet 4.5 (via Kiro AWS proxy), Gemini 3 Flash
**Status:** RESOLVED

---

## The Problem

All content generation prompts (Twitter, Blog, Dev.to, Hashnode) instruct the LLM to place `<<IMAGE_X>>` markers in the output. These markers are later replaced with actual CDN image URLs by Part 2 of the pipeline.

**What happened:**
- Gemini 3 Flash: Placed markers correctly (at least in some outputs)
- Claude Sonnet 4.5: Generated beautiful, rule-compliant drafts but ZERO image markers in Blog, Dev.to, Hashnode, and Twitter
- Claude Sonnet 4.5: DID place `<<IMAGE_1>>` in the LinkedIn draft

**Impact:** Part 2 couldn't insert images into published content because there were no markers to replace.

---

## The Debugging Journey

### Phase 1: Wrong Hypothesis — "The Proxy Is Stripping Them"

**Initial theory:** The Kiro AWS proxy was sanitizing `<<` and `>>` from LLM output because they look like HTML/XML tags.

**Proposed fix:** Change marker format from `<<IMAGE_X>>` to `[IMAGE_X]` across the entire pipeline (both prompts AND Part 2 code nodes).

**Why we abandoned this:**
1. Changing the format required updating BOTH n8n workflows (Part 1 prompts + Part 2 code nodes) — too much blast radius
2. Not guaranteed to fix the issue
3. **The killer evidence:** LinkedIn's draft DID contain `<<IMAGE_1>>`. If the proxy was stripping angle brackets, LinkedIn would have failed too.

**Lesson:** Always check ALL outputs before forming a hypothesis. One working output disproves a systemic cause.

### Phase 2: Correct Diagnosis — "It's the Prompt Structure"

**Root cause discovery:** Compared the LinkedIn prompt (which worked) against the 4 failing prompts.

**LinkedIn's image instruction (WORKED):**
```
7. Image Marker Insertion - Semantic Selection (1 Image Limit):
   - LinkedIn API allows EXACTLY ONE image per post.
   - Place the selected marker at the VERY END (after hashtags).
```
- Simple, deterministic: "Put it at the end." Zero ambiguity.
- Reinforced in 4 places: rules, critical_recap, output_format JSON example, validation_before_return

**Blog's image instruction (FAILED):**
```
The "Storyboard" Image Placement System:
Your blog is NOT a wall of text. It is a visual storyboard...
Step 1: COUNT...
Step 2: MATCH - Read each image's description and purpose...
Step 3: PLACE - Insert using the "Visual Anchor" rule...
Cognitive Psychology Rules for Placement:
1. Visual Anchoring...
2. Cognitive Offloading...
3. Rhythm - The 300-500 Word Rule...
4. The "Would I Screenshot This?" Test...
Anti-Patterns (NEVER DO):
...
```
- 40+ lines of complex multi-step reasoning
- Required the model to hold this in working memory while generating 1500+ words
- Only mentioned in 1-2 places (buried in the middle of the prompt)

---

## Root Cause: The Capability-Compliance Gap

**Why Claude Sonnet 4.5 (a "better" model) failed where Gemini 3 Flash succeeded:**

| Factor | Gemini 3 Flash | Claude Sonnet 4.5 |
|--------|---------------|-------------------|
| Instruction processing | Literal, mechanical | Weighted, prioritized |
| Competing rules | Follows all equally | Allocates attention budget |
| Simple mechanical tasks | Just does them | May deprioritize if competing with creative tasks |
| Complex creative rules | Follows adequately | Excels — but at the cost of simpler rules |

**The technical explanation:**

Claude Sonnet 4.5 is a larger model that processes instructions with more nuance. When a prompt has 15+ competing requirements (anti-slop rules, narrative techniques, character limits, SEO optimization, CTA frameworks, etc.), Claude allocates its "attention budget" to the complex, creative rules and deprioritizes simple mechanical tasks like "place this marker string."

This is compounded by the **"lost in the middle" phenomenon** — all transformer-based LLMs have stronger attention at the beginning and end of the prompt. The image instructions were buried in the MIDDLE of 300+ line prompts, surrounded by higher-priority creative rules.

Gemini 3 Flash, being a smaller and more literal model, doesn't "think" as deeply about rule priority. It processes instructions more mechanically, which paradoxically makes it more reliable for simple placement tasks.

**Key insight:** "Smarter" models are not always "more obedient." Capability and compliance are different axes.

---

## The Fix: 6-Point Reinforcement Pattern

Applied to all 4 failing prompts (Twitter, Blog, Dev.to, Hashnode):

### 1. Think Tool Pre-Planning (in `<prime_directive>`)
```
AND plan exactly where each <<IMAGE_X>> marker will go
(read strategy.image_strategy.specific_prompts, count images,
decide which section each marker follows) BEFORE generating final output.
```
**Why it works:** Forces the model to COMMIT to marker placement before it starts generating content. Once planned, it can't "forget."

### 2. Simplified Image Rules (in rules section)
Replaced the 40-line "Storyboard Psychology" system with a clear 10-line deterministic instruction:
```
**Image Markers (MANDATORY - DO NOT SKIP):**
1. Count the images in strategy.image_strategy.specific_prompts.
2. For EACH image, read its semantic_anchor field.
3. Place the marker on its own line immediately AFTER the paragraph that discusses that concept.
4. Space markers at least 300 words apart when possible.
5. NEVER place a marker before the concept is introduced or after a CTA/conclusion.
```

### 3. `<image_marker_final_check>` Block (before `<output_format>`)
```xml
<image_marker_final_check>
BEFORE generating your JSON output, verify: How many images are in
strategy.image_strategy.specific_prompts? You MUST have placed EXACTLY
that many <<IMAGE_X>> markers. If your count is ZERO but images exist
in the strategy, GO BACK and insert them now.
</image_marker_final_check>
```

### 4. Output Format JSON Example (in `<output_format>`)
The JSON example explicitly shows markers embedded in the formatted_markdown:
```json
"formatted_markdown": "# Title\n\n...content...\n\n<<IMAGE_1>>\n\n...more content...\n\n<<IMAGE_2>>"
```

### 5. Validation Checklist (in `<validation_before_return>`)
```
☐ <<IMAGE_X>> marker count in formatted_markdown equals
  strategy.image_strategy.specific_prompts count.
  ZERO markers when images exist = REJECTION.
```

### 6. `<final_instruction>` (ABSOLUTE LAST THING in the prompt)
```xml
<final_instruction>
⚠️ NON-NEGOTIABLE OUTPUT REQUIREMENT:
Your formatted_markdown MUST contain <<IMAGE_X>> markers from
strategy.image_strategy.specific_prompts. Count the images in the strategy.
Place that exact number of markers in your output. If you output ZERO markers
when the strategy has images, the output is REJECTED.
</final_instruction>
```
**Why it works:** Exploits recency bias — the last instruction the model reads has the strongest influence on output.

---

## Why This Pattern Works (LLM Prompt Engineering Principles)

1. **Output Anchoring (Anthropic Best Practice):** Place the most critical output requirement at the END of the prompt. LLMs have strongest attention at the start and end.

2. **Pre-commitment via Think Tool:** Making the model plan marker placement in the Think step creates a "cognitive commitment" — the model has already decided where markers go before it starts writing.

3. **Redundancy overcomes attention decay:** 6 mentions of the same requirement across different prompt sections makes it nearly impossible to deprioritize.

4. **Simplification reduces failure modes:** A 10-line deterministic rule is easier to follow than a 40-line multi-step reasoning chain, especially while simultaneously generating 1500+ words of creative content.

5. **"REJECTED" framing:** Using consequence language ("output is REJECTED") triggers stronger compliance than advisory language ("please include markers").

---

## Files Changed

### Prompt Files (Part 1):
| File | Changes |
|------|---------|
| `4. Gemini - Twitter Content Generation.md` | Simplified Rule 6, added Think tool planning, added `<image_marker_final_check>`, added `<final_instruction>` |
| `6. Gemini - Blog Content Generation.md` | Replaced 40-line Storyboard system with 10-line rule, added Think tool planning, added `<final_instruction>` |
| `7. Gemini - Dev.to Content Generation.md` | Added Think tool planning, added `<final_instruction>` (already had simplified rules and final_check) |
| `8. Gemini - Hashnode Content Generation.md` | Simplified Rule 8b, added Think tool planning, added validation checklist item, added `<final_instruction>` |

### Files NOT Changed (already optimal):
| File | Reason |
|------|--------|
| `1. Context - Standardize & Filter.md` | No image markers involved. Already well-structured. |
| `2. Ai Agent - Research.md` | No image markers involved. Already has Think tool + output anchoring. |
| `3. Gemini - AI CONTENT STRATEGIST.md` | Generates strategy (including image_strategy). Markers are placed by downstream nodes, not this one. |
| `5. Gemini - LinkedIn Content Generation.md` | Already worked correctly. Its simple "put at the end" instruction + 4-point reinforcement was the MODEL for fixing the others. |

### Part 2 Code Nodes:
No changes needed. The `<<IMAGE_X>>` format was never the problem — the markers just weren't being generated. Part 2 code correctly parses `<<IMAGE_X>>` with regex `/<<IMAGE_(\d+)>>/g`.

---

## Lessons Learned

1. **Always check ALL outputs before forming a hypothesis.** One working output (LinkedIn) disproved the proxy-stripping theory.

2. **"Better model" ≠ "more compliant model."** Claude Sonnet 4.5 is superior at creative/analytical tasks but can deprioritize simple mechanical instructions when competing with complex creative rules.

3. **Prompt engineering is model-agnostic at the principle level.** Output anchoring, pre-planning, redundancy, and simplification work for Claude, Gemini, and GPT alike.

4. **The "LinkedIn Pattern" is the gold standard** for any prompt that needs guaranteed mechanical output: simple rule + deterministic placement + end-of-prompt reinforcement.

5. **Don't over-engineer prompt instructions.** The 40-line "Storyboard Psychology" system was beautifully written but counterproductive — it consumed the model's attention budget and introduced ambiguity. The 10-line replacement achieved better results.

---

## Quick Reference: The Reinforcement Checklist

When adding any MANDATORY output requirement to a long prompt, ensure it appears in ALL 6 positions:

```
[ ] 1. <prime_directive> Think tool pre-planning
[ ] 2. Rules section (simplified, deterministic)
[ ] 3. <image_marker_final_check> (pre-output verification)
[ ] 4. <output_format> JSON example (showing the requirement in the example)
[ ] 5. <validation_before_return> checklist item
[ ] 6. <final_instruction> (absolute last thing in the prompt)
```

If a requirement only appears in 1-2 places, sophisticated models WILL deprioritize it under competing instruction pressure.
