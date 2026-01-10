# OMNI-POST AI v5.2 - PRODUCT REQUIREMENTS DOCUMENT

> **Version:** 5.2 (Unified Single-Workflow)  
> **Status:** Ready for Implementation  
> **Author:** Aman Suryavanshi & Antigravity  
> **Date:** January 9, 2026  
> **Architecture:** Unified N8N Workflow (Monolith with Logical Grouping)

---

## 1. 🎯 EXECUTIVE SUMMARY

This PRD defines the **Unified v5.2 architecture** for Omni-Post AI. Per user request, we are consolidating the "Newsroom" agents into a **Single N8N Workflow File** (`Omni-Post-Unified-v5.json`).

**Core Philosophy:**
*   **Unified Canvas:** Easier debugging and maintenance. No "hidden" sub-workflows.
*   **Logical Modules:** The canvas will be visually grouped into "Agents" (Extraction, Context, Research, Writing, Visuals, Staging).
*   **Deep Intelligence:** We retain the **Context Intelligence** (Portfolio Filtering) and **Perplexity Research** steps.

---

## 2. 🏗️ ARCHITECTURE: THE UNIFIED CANVAS

The workflow is a linear pipeline with parallel branches for generation.

### Block 1: The Researcher (Extraction)
*   **Trigger:** Webhook `POST /omnipost/generate`.
*   **Logic:** Query Notion → Recursive Block Parsing → Extract structured content.
*   **Output:** `content_summary`, `full_text`.

### Block 2: The Analyst (Context Intelligence)
*   **Logic:**
    1.  **Fetch:** `GET https://www.amansuryavanshi.me/api/portfolio?sections=all`.
    2.  **Filter (Gemini Flash):** "Given this content summary, select ONLY relevant projects/skills/experience. If none, return generic bio."
*   **Output:** `personal_context` (Specific to this post).

### Block 3: The Strategist (Research & Plan)
*   **Logic:**
    1.  **Merge:** Notion Content + Filtered Personal Context.
    2.  **Research (Perplexity):** Find market "heat", hashtags, and news.
    3.  **Plan:** Generate `image_prompts` and `content_angles`.

### Block 4: The Writers (Parallel Execution)
*   **Branch A (X/Twitter):** Gemini Flash -> 8-12 Tweets (Hook -> Value -> CTA).
*   **Branch B (LinkedIn):** Gemini Flash -> Algorithm-optimized (Hook -> Insight -> Question).
*   **Branch C (Blog/dev.to):** Gemini Pro -> Long-form SEO Markdwon.

### Block 5: The Artist (Visuals)
*   **Logic:**
    1.  **Select:** Choose the best `image_prompt` from Block 3.
    2.  **Generate:** `HTTP POST` to **LongCat AI**.
    3.  **Fallback:** If LongCat fails, use a "Visual Coming Soon" text placeholder.

### Block 6: The Archivist (Staging)
*   **Logic:**
    1.  **Package:** Create `.md` files for all platforms.
    2.  **Upload:** Save to Google Drive (`/OMNI-POST-AI/Drafts/...`).
    3.  **Update:** Set Notion status to "Pending Approval" + add Drive Link.

---

## 3. 🔌 API INTEGRATIONS

### 3.1. Portfolio API (Context)
*   **Endpoint:** `GET https://www.amansuryavanshi.me/api/portfolio`
*   **Constraint:** Handle large JSON payload via AI filtering (Block 2).

### 3.2. LongCat AI (Images)
*   **Endpoint:** `https://api.longcat.ai/generate` (Verify)
*   **Auth:** Bearer Token (User provided).

---

## 4. 🚀 IMPLEMENTATION PLAN

### Phase 1: Foundation (Blocks 1-3)
- [ ] **Task 1:** Initialize `Omni-Post-Unified-v5.json`.
- [ ] **Task 2:** Implement Block 1 (Notion Extraction).
- [ ] **Task 3:** Implement Block 2 (Context Intelligence HTTP + AI).
- [ ] **Task 4:** Implement Block 3 (Perplexity + Merge).
- [ ] **Validation:** Verify flow from Trigger -> Master Context.

### Phase 2: Generation (Blocks 4-6)
- [ ] **Task 5:** Implement Block 4 (Writers - X, LI, Blog).
- [ ] **Task 6:** Implement Block 5 (LongCat Image Gen).
- [ ] **Task 7:** Implement Block 6 (Drive/Notion).
- [ ] **Task 8:** End-to-End Test.

---

## 5. ⚠️ CRITICAL CONSTRAINTS

1.  **Single File:** All logic must exist in one `.json` file.
2.  **Part 2 Compatibility:** Output Markdown MUST include `<<IMAGE_N>>` tags and exact formatting.
3.  **Error Handling:** Use "Continue on Fail" for API calls (Perplexity, LongCat, Portfolio) to ensure the draft is always created, even if partial data is missing.
