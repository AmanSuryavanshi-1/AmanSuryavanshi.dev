# Verification Report v1 — Universal Portfolio Docs & Asset Sync Engine (`PLAN.md` v1)

## 1. Context Check
- **Plan folder:** `.ai/plans/001-universal-docs-and-asset-sync/` | **Plan version:** v1
- **Verifier context:** FRESH (Independent adversarial audit, no planner bias)
- **Codebase read & verified against real files:**
  - `src/lib/docs-engine.ts` (lines 5–77)
  - `src/app/docs/[...slug]/page.tsx` (lines 14–149)
  - `src/components/docs/DocPageClient.tsx` (lines 1–573)
  - `src/components/docs/MarkdownViewer.tsx` (lines 1–470)
  - `src/data/content/projects.ts` (lines 1–577)
  - `src/data/portfolio.ts` (lines 1–39)
  - `public/Project/CDN_IMAGE_GUIDE.md` (lines 1–169)
  - `.gitignore` (lines 1–165)
  - `package.json` (lines 1–86)
  - `next.config.ts` (lines 1–119)
- **Sibling major project directories physically inspected:**
  - `A:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\OmniPost-Core\docs\` (and `Omni-Post-AI-Automation/assets`)
  - `A:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\1099-W2-Equalizer\docs\` (and `public/`)
  - `A:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\Vivek-OnPoint-Web\docs\` (and `architecture/`)
  - `A:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\notebooklm-py\docs\`
  - `A:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\SecondBrain-Telegram-Capture\docs\`

---

## 2. Adversarial Council Synthesis (Pattern D: 6-Axis Attack)

### 1. Assumptions Attack
The plan assumes that (a) `DocPageClient.tsx` already supports generic multi-doc series, (b) all projects follow a clean separated `sourceDocsDir` and `sourceAssetsDir` folder hierarchy, (c) projects already exist in `projects.ts` awaiting docs, (d) naive regexes can rewrite image paths without corrupting existing full CDN URLs, and (e) Vercel build runners can execute `prebuild: npm run sync:docs` without blowing up on non-existent Windows paths. **All five assumptions are completely false in the real codebase.**

### 2. Architecture Fit Attack
- In `src/components/docs/DocPageClient.tsx` (line 320, 403, 417), the sidebar links and Next/Previous navigation buttons are **hardcoded** to `href={`/docs/omnipost/${doc.id}`}`. Syncing any other series project (`1099-w2-equalizer`, `vivek-onpoint`, etc.) will generate sidebar links pointing to `/docs/omnipost/<id>`, causing 100% 404s.
- In `src/app/docs/[...slug]/page.tsx` (lines 85–90), if `meta.projectId` does not match `project.id` in `portfolioData.projects`, the page returns `<div>Project not found for document</div>`. `notebooklm-py` does not exist in `projects.ts`, and OmniPost's actual ID in `projects.ts` is `n8n-automation-suite`, while Vivek OnPoint's ID is `vivek-onpoint-platform`. The plan treats them as `omnipost` and `vivek-onpoint`.

### 3. Implementability Attack
The plan specifies adding `"prebuild": "npm run sync:docs"` in `package.json` (§9 T-1.3) and states it will run in CI on Vercel (§11). Vercel Linux build containers do not possess `A:\` drives. If the script exits with error code 1 in CI (§7), the remote production build crashes. If it exits 0, it does nothing, yet image assets in `public/Project` were gitignored and never deployed.

### 4. Security & Privacy Attack
`A:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\OmniPost-Core\docs\Omni-Post-AI-Automation\00-End-to-End-Flywheel.md` line 7 explicitly marks the document: `> **Classification:** Confidential — Private B2B IP`. The plan blindly syncs all 23 docs into public portfolio docs without an explicit redaction / classification filter.

### 5. Verification Attack
Level 5 verification probes jsDelivr URLs with HTTP HEAD requests to confirm 200 OK. However, newly copied assets in `public/Project` are in an unpushed local git repo. Probing jsDelivr before pushing to GitHub `main` is a circular impossibility (it will always return 404).

### 6. Rollback Attack
Rollback via `git checkout HEAD -- src/content/docs/` works for portfolio docs, but what about `public/Project` (nested repo)? If assets were overwritten or partially committed, rolling back the parent does not roll back `public/Project`.

---

## 3. Dimension Scores

| # | Dimension | Score | Evidence & Codebase Grounding | Findings |
|---|---|:---:|---|---|
| **1** | **Requirements & Scope** (10%) | **7.0/10** | **Plan §1.2 & §2:** Clear scope on one-way sync, but fails to scope necessary UI component modifications (`DocPageClient.tsx`) required for multi-doc navigation. | M-1 |
| **2** | **Architecture & Codebase Fit** (15%) | **4.0/10** | **Codebase `DocPageClient.tsx:L320,L403,L417`:** Hardcoded `/docs/omnipost/` routes break all other series.<br>**Plan §9 T-1.3 vs `package.json`:** Wiring `prebuild` on Vercel where `A:\` is absent crashes builds.<br>**Codebase `projects.ts:L316`:** ID is `n8n-automation-suite`, not `omnipost`. | **CR-1, CR-2, H-1, H-2** |
| **3** | **Acceptance Criteria & Traceability** (10%) | **6.0/10** | **Plan §2 REQ-5 AC-5.1:** Claims CLI flag `--update-nav` safely mutates complex TS AST in `projects.ts` without specifying parser/tooling.<br>**Plan §2 REQ-2 AC-2.1:** Omits required `DocMeta` fields (`category`, `schemaType`). | H-4, M-2 |
| **4** | **Dependencies & Feasibility** (10%) | **7.0/10** | **Plan §4 Table 4:** Claims `tsx` is existing in `devDependencies` (`^4.19.2`). Inspection of `package.json` reveals `tsx` is **not installed** at all (only `ts-node`). Claims Zod `^3.24.2` while `package.json:L63` is `^4.1.13`. | L-1, M-3 |
| **5** | **Security & Privacy** (10%) | **7.0/10** | **Codebase `00-End-to-End-Flywheel.md:L7`:** File marked "Confidential — Private B2B IP". Sync engine lacks document classification filtering. Secret scrubbing is mentioned but regex unstated. | M-4 |
| **6** | **Scalability & Performance** (10%) | **7.0/10** | **Plan §6:** SHA-256 differential sync is good. However, no handling of Windows case-insensitivity vs Linux Vercel case-sensitivity for slug generation. | M-5 |
| **7** | **Error Handling, Fallbacks & Rollback** (10%) | **6.0/10** | **Plan §7 Table 7:** Mitigation for unpushed assets is manual skill intervention rather than a programmatic build gate. Fallback to `/Project/...` in dev fails in production where `public/Project` is gitignored. | H-3 |
| **8** | **Testing & Verification Strategy** (10%) | **6.5/10** | **Plan §8 Level 5:** Probing jsDelivr with HEAD requests before pushing assets to GitHub is impossible. Zero component/E2E tests for series navigation in `DocPageClient.tsx`. | M-6 |
| **9** | **Execution Phasing & Risk Management** (10%) | **6.0/10** | **Plan §9 T-3.4:** Instructs updating `documentation` array in `projects.ts` for `notebooklm-py`, but `notebooklm-py` does not exist in `projects.ts`. Missing UI remediation tasks. | H-2, M-1 |
| **10** | **Production Readiness & Observability** (5%) | **5.0/10** | **Plan §11:** Wiring `prebuild` for Vercel deployment where sibling drive `A:\` does not exist causes build failures or unhandled missing assets. | CR-2, H-3 |

---

## 4. Findings by Severity

### 🔴 CRITICAL
- **[CR-1] Hardcoded `/docs/omnipost/` Navigation in `DocPageClient.tsx` Breaks All Multi-Doc Series**
- **[CR-2] `prebuild: npm run sync:docs` Hook Breaks Remote Vercel Production Deployments**

### 🟠 HIGH
- **[H-1] Naive Markdown Image Regex Corrupts Existing Full CDN URLs and Misses HTML `<img>` Tags**
- **[H-2] Missing Project Definition for `notebooklm-py` and Id Inconsistencies in `projects.ts`**
- **[H-3] Uncommitted / Unpushed Nested Git Assets Trigger Silent Production 404s**
- **[H-4] Discrepant Source Assets Layouts & Format Incompatibilities**

### 🟡 MEDIUM
- **[M-1] Series Document Header Hardcoded to "Updated Dec 2025" and "Executive Summary"**
- **[M-2] Omission of Required Frontmatter Fields in Synthesis Engine**
- **[M-3] Fragile Navigation Sync Proposal in `projects.ts`**
- **[M-4] Unfiltered Sync of Confidential / Private Source Documents**
- **[M-5] Broken Cross-Doc Relative Markdown Links and Case Normalization**
- **[M-6] Verification Gate Catch-22 in Level 5 Headless HTTP Check**

### 🟢 LOW
- **[L-1] Missing `tsx` in `package.json`**

---

## VERDICT
Verifier mode: FRESH
Composite: 6.1/10
Dimensions: Requirements:7.0, Architecture:4.0, Traceability:6.0, Dependencies:7.0, Security:7.0, Scalability:7.0, ErrorHandling:6.0, Testing:6.5, ExecutionPhasing:6.0, ProductionReadiness:5.0
Critical findings: 2
High findings: 4
Unresolved from previous round: 0
Approved: NO
