# OMNI-POST AI v5.0 - PRODUCT REQUIREMENTS DOCUMENT

> **Version:** 5.0 (Final)  
> **Status:** Ready for Implementation  
> **Author:** Aman Suryavanshi & Antigravity  
> **Date:** January 9, 2026  
> **Architecture:** Manager-Employee "Newsroom" Model (n8n-mcp)

---

## 1. 🎯 EXECUTIVE SUMMARY

This PRD defines the evolution of **Omni-Post AI** from a monolithic workflow into a modular, **Agentic "Newsroom" Architecture**. We are refactoring "Part 1" (Generation) into a **Manager** (Editor-in-Chief) orchestrating 5 specialized **Employee Agents**.

This refactor will:
1.  **Professionalize the Codebase:** Decouple monolithic logic into maintainable, specific agents.
2.  **Enable Dynamic Context:** Integrate the **Portfolio API** to replace hardcoded personal data.
3.  **Autonomous Creativity:** Deploy a "Creative Director" agent using **LongCat AI** for image generation.
4.  **Expand Reach:** Add support for **dev.to** (via canonical strategy).
5.  **Maximize Engagement:** Implement specific algorithm optimizations for LinkedIn (hooks) and Twitter (8-12 tweet threads).

---

## 2. 🏗️ ARCHITECTURE: THE "NEWSROOM" MODEL

We will move from a linear flow to a **Hub-and-Spoke** architecture.

### The Manager ("Editor-in-Chief")
*   **Role:** Orchestration, Strategy, Context Gathering.
*   **Trigger:** Webhook `POST /omnipost/generate` or Manual Notion Trigger.
*   **Responsibilities:**
    *   Fetches **Portfolio API** for real-time author context.
    *   Determines which platforms to target.
    *   Delegates tasks to specific **Employees** via `Execute Workflow`.
    *   Aggregates results and updates Notion.

### The Employees (Specialized Agents)
Each employee is a separate n8n workflow listening on a webhook/execute-workflow trigger.

| ID | Agent Name | Role | Responsibility |
| :--- | :--- | :--- | :--- |
| **E1** | **Content Extractor** | *Researcher* | Extract & structure hierarchical content from Notion. |
| **E2** | **AI Content Generator** | *Writer* | Generate platform-specific copy (X, LinkedIn, Blog, dev.to). |
| **E3** | **Image Prompt Gen** | *Creative Director* | Create visual briefs (prompts + color schemes). |
| **E4** | **Image Generator** | *Artist* | Generate assets via **LongCat AI** (with fallback). |
| **E5** | **Draft Stager** | *Archivist* | Package drafts, save to Drive, update Notion status. |

---

## 3. 🔌 API INTEGRATIONS

### 3.1. Portfolio API (Dynamic Context)
*   **Endpoint:** `GET https://your-portfolio-api.com/profile` (Replace with actual endpoint)
*   **Usage:** Called ONCE by Manager at start of execution.
*   **Smart Context Filter (NEW):** 
    *   **Problem:** API returns huge JSON with all projects/skills.
    *   **Solution:** Pass full JSON + Content Topic to **Gemini Flash**.
    *   **Prompt:** "Extract only the case studies, service offerings, and social proof RELEVANT to this topic: {topic}. Return JSON."
    *   **Fallback:** If no relevant context found, return generic "About Me" blurb.
*   **Data Flow:** Passed down to all Employees (E2, E3, E5) to ensure "Author Voice" is consistent.

### 3.2. LongCat AI (Image Generation)
*   **Agent:** Employee 4
*   **Endpoint:** `POST https://api.longcat.ai/generate` (Verify specific endpoint in docs)
*   **Model:** `flux-pro` (Check free tier limits)
*   **Fallback:** If generation fails/times out (>15s), generate a "Visual Coming Soon" placeholder image programmatically.

---

## 4. 👔 DETAILED SPECIFICATIONS (THE EMPLOYEES)

### EMPLOYEE 1: Content Extractor
*   **Input:** `content_id`, `notion_db_id`
*   **Logic:** Query Notion → Parse Blocks (H1-H3, Lists, Code) → Return JSON.
*   **Output Structure:** `{ full_text, sections: [{ types, content }], stats: { word_count, code_blocks } }`

### EMPLOYEE 2: AI Content Generator
*   **Input:** `content_structure`, `platform` (enum: x, linkedin, blog, dev_to), `author_profile`
*   **Engine:** Gemini 2.5 Flash (Temp: 0.7)
*   **Platform Rules:**
    *   **Twitter/X:** Thread of **8-12 tweets**. First tweet follows "Curiosity Gap" hook. Last tweet asks discussion question.
    *   **LinkedIn:** **180-250 words**. Structure: Hook → Value (Data/Insight) → Discussion Question. NO generic openings ("Let me share...").
    *   **Blog:** **800-1200 words**. SEO-optimized Markdown.
    *   **dev.to:** **600-1000 words**. Practical/Tutorial focus. Frontmatter included.

### EMPLOYEE 3: Image Prompt Generator
*   **Input:** `all_platform_content`
*   **Logic:** **CRITICAL:** Port the *exact* prompt generation logic from Part 1 (`Process & Format Image Tasklist` node).
*   **Constraint:** Do NOT invent new prompting strategies. Reuse the existing defined prompts (strategy.image_strategy.specific_prompts) to ensure consistency.
*   **Output:** `{ image_prompt, color_scheme_name, hex_codes }`

### EMPLOYEE 4: Image Generator (LongCat)
*   **Input:** `image_prompt` (from Employee 3)
*   **Logic:** Call LongCat API → Upload to Drive → Return URL.
*   **Constraint:** Max 20s execution.

### EMPLOYEE 5: Draft Stager
*   **Input:** `generated_content` (all platforms), `generated_images`, `session_id`
*   **Constraint:** **STRICT FORMATTING REQUIRED.** Output must match `Drafts_sample_drive` exactly (e.g., `<<IMAGE_1>>` markers, specific header styles) to ensure Part 2 compatability.
*   **Logic:**
    1.  Create `draft_{session_id}.md` (Markdown Preview).
    2.  Upload to Drive Folder `/OMNI-POST-AI/Drafts/`.
    3.  Update Notion: Status = "Pending Approval", set `draft_url`.

---

## 5. 🚀 IMPLEMENTATION PLAN

### Phase 1: Foundation (Manager + E1)
- [ ] **Task 1:** Create `Manager` workflow skeleton.
- [ ] **Task 2:** Create `Employee 1 (Extractor)` workflow (port logic from v4.2).
- [ ] **Task 3:** Implement Portfolio API fetch in Manager.
- [ ] **Validation:** Verify Manager can fetch Profile + Content.

### Phase 2: The Writers (E2)
- [ ] **Task 4:** Create `Employee 2` workflow (Base).
- [ ] **Task 5:** Implement Twitter Logic (Gemini 2.5 Flash, 8-12 tweets).
- [ ] **Task 6:** Implement LinkedIn Logic (Algorithm hooks).
- [ ] **Task 7:** Implement Blog/dev.to Logic.
- [ ] **Validation:** Generate text content for all 4 platforms.

### Phase 3: The Visuals (E3 + E4)
- [ ] **Task 8:** Create `Employee 3 (Prompt Gen)`.
- [ ] **Task 9:** Create `Employee 4 (Image Gen)` with LongCat integration.
- [ ] **Task 10:** Implement Fallback Image logic.
- [ ] **Validation:** Verify images appear in Drive.

### Phase 4: Staging & End-to-End (E5)
- [ ] **Task 11:** Create `Employee 5 (Stager)`.
- [ ] **Task 12:** Connect Manager to all Employees.
- [ ] **Task 13:** End-to-End Test (Notion → Manager → All Agents → Notion Update).

---

## 6. 🧠 AI AGENT GUIDELINES

1.  **Single Source of Truth:** This document supersedes all previous PRDs.
2.  **Prompt Structure:** Do NOT modify the XML prompt structures defined in the `v5.0-PRD` research note (Conceptually included here by reference).
3.  **Workflow Separation:** Use **separate workflow files** (Option A), not sub-workflows, for maximum modularity.
4.  **Error Handling:** All agents must return `{ status: "error", message: "..." }` on failure, allowing the Manager to decide (Retry vs Skip).

---

## 7. SUCCESS METRICS
*   **Reliability:** 99.7% Success Rate.
*   **Speed:** Total Execution < 100 seconds (Parallelized E2 calls).
*   **Cost:** $0/mo (Free Tiers: Gemini Flash, LongCat Free, Drive).
*   **Quality:** Replaces v4.2 with indistinguishable or better content quality.
