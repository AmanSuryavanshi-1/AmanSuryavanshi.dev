# Omni-Post AI Enhancement PRD & Implementation Plan

> **Version:** 2.0  
> **Status:** Planning Phase  
> **Author:** Antigravity (AI Agent) & Aman Suryavanshi  
> **Last Updated:** January 9, 2026

---

## 1. Executive Summary

The goal is to evolve the existing production-ready **Omni-Post AI** (v4.2) from a monolithic linear workflow into a modular, **Agentic "Manager-Employee" Architecture**. This refactor will improve maintainability, professionalize the structure, and enable easy scaling (adding new platforms like Medium/Dev.to).

Key Enhancements:
1.  **Architecture:** Switch to Webhook-based "Manager" (Orchestrator) and "Employee" (Task Worker) workflows.
2.  **Data Source:** Replace hardcoded personal context with dynamic execution-time fetching from the **Portfolio API**.
3.  **Image Gen:** Dedicated "Creative Director" agent using LongCat API for image asset generation.
4.  **New Platforms:** Expand distribution to **Medium** and **Dev.to** for long-form content.
5.  **Growth:** Implement specific features to maximize impressions (Smart Threading, SEO-first Blog formatting).

---

## 2. Theoretical Architecture: The "Newsroom" Model

We will adopt a "Digital Newsroom" structure where a Manager coordinates specialized employees.

**The Manager ("Editor-in-Chief")**
*   **Role:** Orchestration, Strategy, context gathering, and final approval routing.
*   **Triggers:** Notion "Ready to Generate" status.
*   **Responsibilities:**
    *   Fetches dynamic context (Portfolio API).
    *   Performs Market Research (Perplexity).
    *   Decides *which* platforms to target.
    *   Delegates tasks to specific Employees via Webhooks (HTTP Request nodes).
    *   Collects results and updates Notion.

**The Employees (Specialized Agents)**
Each employee is a separate n8n workflow listening on a webhook.

1.  **Agent: Viral Tweeter (Twitter/X)**
    *   **Input:** Source Content + Strategy + Personal Context.
    *   **Task:** Write 4-6 tweet thread, engaging hooks, viral formatting.
    *   **Output:** JSON specific to Twitter Thread format.

2.  **Agent: LinkedIn Voice (LinkedIn)**
    *   **Input:** Source Content + Strategy + Personal Context.
    *   **Task:** Write "Business Value" post, 1200-2000 chars, optimized for "Read More" clicks.
    *   **Output:** Markdown formatted text + Image suggestions.

3.  **Agent: Tech Editor (Blog/Medium/Dev.to)**
    *   **Input:** Source Content + SEO Keywords.
    *   **Task:** Transform notes into a full technical article. Differentiates slight variations for Canonical Blog vs Medium/Dev.to.
    *   **Output:** HTML/Markdown body, Title, Canonical URL, Tags.

4.  **Agent: Creative Director (Images)**
    *   **Input:** Content Summary + Platform constraints.
    *   **Task:** Generate prompt for LongCat API, fetch image, upload to Drive.
    *   **Output:** Public/Drive URL of generated asset.

---

## 3. Product Requirements (PRD)

### 3.1. Core System Enhancements

#### [Feature 1] Dynamic Context Injection (Portfolio API)
*   **Requirement:** Remove static JSON object in `Code: Personal Context Builder`.
*   **Implementation:** 
    *   Call `GET https://www.amansuryavanshi.me/api/portfolio?sections=core,skills,projects,voice`
    *   Map response to existing `personalContext` XML schema.
*   **Benefit:** Workflow automatically adapts as you update your portfolio/resume; no manual JSON updates needed.

#### [Feature 2] "Manager-Employee" Webhook Architecture
*   **Requirement:** Split "Part 1" into:
    *   `Workflow A: Omni-Post Manager`
    *   `Workflow B: Agent - Twitter Writer`
    *   `Workflow C: Agent - LinkedIn Writer`
    *   `Workflow D: Agent - Blog Writer`
    *   `Workflow E: Agent - Image Gen`
*   **Implementation:** Use `Execute Workflow` node (or HTTP Webhook if preferred for decoupling) to pass data.
*   **Benefit:** If Twitter changes character limit, we only edit Workflow B. Easier debugging.

#### [Feature 3] Image Generation Agent
*   **Requirement:** New employee to handle visual assets.
*   **Tools:** LongCat API (Free tier/limits applied).
*   **Trigger:** Invoked by Manager if `image_strategy.needs_images === true`.
*   **Process:**
    1.  Receive prompt/topic.
    2.  Enhance prompt for visual style (Midjourney-style descriptive text).
    3.  Call LongCat API.
    4.  Save result to current Session Folder in Drive.

### 3.2. New Platform Extensions

#### [Feature 4] Medium & Dev.to Posting
*   **Requirement:** Cross-post technical articles to developer hubs.
*   **Strategy:** "Canonical Link" Strategy. Use the *Personal Blog* as the source of truth, and syndicate to Medium/Dev.to to prevent SEO penalties.
*   **Implementation:**
    *   **Medium:** Use HTTP POST to `https://api.medium.com/v1/users/{{userId}}/posts`.
    *   **Dev.to:** Use HTTP POST to `https://dev.to/api/articles`.
    *   **Constraint:** Set `canonical_url` to the personal website URL in both payloads.

### 3.3. Growth & Impression Optimization

Based on research, the following will be implemented to key "Employees":

*   **Twitter Agent:**
    *   **"The Hook"**: Force the first tweet to follow a specific "Curiosity Gap" framework.
    *   **Self-Reply**: Automatically add a final tweet linking to the Blog/Newsletter (best for conversion).
*   **LinkedIn Agent:**
    *   **Carousel Support**: (Future) If multiple images are generated, combine into PDF for Carousel (highest engagement format). For now, strict "Text + 1 High Value Image" format.
    *   **First Comment:** Prepare a "Resources" comment to be posted immediately after the main post (keeps links out of main post for algorithm reach).

---

## 4. Implementation Steps (Execution Guide)

### Phase 1: Preparation & Portfolio Integration
- [ ] **Task 1.1:** Fetch current `Part 1` workflow JSON.
- [ ] **Task 1.2:** Implement the **Portfolio API** fetch in the existing workflow (Validation Step).
    - *Goal:* Verify dynamic context works before splitting the workflow.

### Phase 2: "The Newsroom" Breakdown (Refactoring)
- [ ] **Task 2.1:** Create `Agent - Twitter Writer` workflow.
    - Copy logic from Part 1 -> Clean inputs -> Set up Webhook Trigger.
- [ ] **Task 2.2:** Create `Agent - LinkedIn Writer` workflow.
- [ ] **Task 2.3:** Create `Agent - Blog/Tech Writer` workflow.
    - *Note:* This agent will now handle generating the body for Blog, Medium, AND Dev.to.

### Phase 3: The Manager & New Features
- [ ] **Task 3.1:** Rebuild "Part 1" to become the **Manager**.
    - Replace generation nodes with `Execute Workflow`/`HTTP Request` nodes.
- [ ] **Task 3.2:** Implement **Medium** & **Dev.to** distribution logic in the "Part 2" (Distribution) or a new "Content Distributor" agent.
    - *Correction:* Best to keep distribution separate. "Part 2" currently distributes. We should add Medium/Dev.to to "Part 2" Distribution workflow.

### Phase 4: Image Agent
- [ ] **Task 4.1:** Create `Agent - Creative Director`.
    - Implement LongCat API integration.
    - Test prompt enhancement.

---

## 5. Technical Guidelines for Agents

*   **Inputs:** All Agents must accept a standard JSON object:
    ```json
    {
      "sessionId": "...",
      "sourceContent": "...",
      "context": { ...xml_data... },
      "platformParams": { ... }
    }
    ```
*   **Outputs:** All Agents must return:
    ```json
    {
      "status": "success",
      "content": "...",
      "usage": { "tokens": 123 }
    }
    ```
*   **Error Handling:** If an Agent fails, it should return `status: "error"` so the Manager can log it or retry, rather than breaking the whole flow.

---

## 6. Future Web App (Spec)
*   **Concept:** "Omni-Post Control Center"
*   **Stack:** Next.js (Frontend) + n8n (Backend).
*   **Features:**
    *   View "Ready" Notion items.
    *   Trigger "Generate" webhook.
    *   View/Edit Drafts (Markdown editor).
    *   Approve & Post.
