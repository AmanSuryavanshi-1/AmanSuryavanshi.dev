# Implementation Plan — Universal Portfolio Docs & Asset Sync Engine + Local AI Skill (`portfolio-docs-sync`)

**Plan Version:** v2 (PVE Round 2 — All CRITICAL, HIGH, and MEDIUM findings resolved)  
**Created:** 2026-09-06  
**Plan Folder:** `.ai/plans/001-universal-docs-and-asset-sync/`  
**Status:** DRAFT (Ready for Round 2 Verification)  
**Related Research:** PVE Verifier Report v1, Context Audit of 22 Major Projects, `DocPageClient.tsx` AST Analysis, `CDN_IMAGE_GUIDE.md`  

---

## 1. Problem & Goal

### 1.1 Problem Statement
Documentation and architectural visual assets for Aman Suryavanshi's major projects live in independent, actively evolving sibling repositories located in `A:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\<Project>\docs\`. The portfolio website (`AmanSuryavanshi.dev`) currently relies on fragmented, manually copied markdown files in `src/content/docs/`. This manual duplication causes severe drift: portfolio docs are months behind active development (e.g., OmniPost displays outdated v5.0 instead of the v6.0 flywheel), visual assets in `docs/Assets/` are disconnected from the nested `portfolio-assets` git repository in `public/Project`, and new flagship projects (`1099-W2-Equalizer`, `SecondBrain-Telegram-Capture`) have complete architectural documentation that remains invisible to the public.

Furthermore, three critical technical barriers prevent simple linking:
1. **OS-Level Symlink Incompatibility:** Remote Linux build runners (Vercel) do not possess local Windows absolute drive paths (`A:\...`).
2. **Hardcoded UI Series Navigation:** `src/components/docs/DocPageClient.tsx` hardcodes sidebar and prev/next links to `/docs/omnipost/${doc.id}`, breaking any newly introduced documentation series (causing 100% 404s).
3. **Missing Schema Invariants & Broken Links:** Raw project markdown lacks required Next.js frontmatter (`projectId`, `seoDescription`, `category`, `schemaType`), contains relative asset paths (`./Assets/*.webp`), and references relative sibling markdown files (`./02-*.md`) that fail on Next.js App Router routes.

### 1.2 Success Metrics (Measurable)
1. **Zero Documentation Drift:** Running `npm run sync:docs` mirrors 100% of target public markdown files from configured source projects into `src/content/docs/` with zero manual copying.
2. **100% Frontmatter Schema Conformance:** 100% of synced markdown files contain valid, schema-validated YAML frontmatter conforming strictly to `DocMeta` in `src/lib/docs-engine.ts` (`title`, `seoDescription`, `keywords`, `projectId`, `category`, `type`, `schemaType`).
3. **100% Generalized UI Series Navigation:** `DocPageClient.tsx` dynamically routes sidebar and prev/next pagination links based on the active doc's route prefix, supporting arbitrary multi-doc series without hardcoded paths.
4. **100% CDN Asset & Link Resolution:** 100% of relative markdown image references and `<img>` tags are transformed into valid jsDelivr CDN URLs without double-prefixing existing full URLs. 100% of relative markdown cross-links (`./02-*.md`) are normalized to lowercase kebab-case Next.js route URLs.
5. **Zero Vercel CI Breakage:** `sync-docs.ts` includes an explicit CI/Vercel environment bypass (`if (process.env.VERCEL || process.env.CI) process.exit(0);`), and `"prebuild"` is NOT hooked to local drive operations.
6. **Clean Production Build:** `npm run build` exits 0 with zero static generation errors across all newly generated doc slugs.
7. **Zero Source Codebase Mutation:** Sibling project repositories in `MAJOR PROJECTS` remain strictly read-only.

### 1.3 Out of Scope
- Direct bi-directional writing back to source repositories from the portfolio website (sync is strictly one-way: Project $\to$ Portfolio).
- Automated git pushes to remote GitHub repositories without user confirmation (the skill stages and commits to `public/Project` locally, but push is triggered via explicit CLI command or user approval).
- Converting non-markdown file formats (e.g., `.docx`, `.pdf`) into documentation.
- Syncing private/confidential source files marked with `Classification: Confidential` or `private: true`.

---

## 2. Requirements & Acceptance Criteria

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **REQ-1** | **Declarative Registry Configuration** | **AC-1.1:** System defines `src/config/docs-registry.ts` with typed definitions containing `id`, `projectId` (matching `portfolioData.projects.id`), `sourceProjectDir`, `sourceDocsDir`, `sourceAssetsDirs` (array of asset paths/globs), `targetDocsDir`, `targetAssetsDir`, `cdnFolder`, `category`, `type: 'series' \| 'single'`, and `exclude` globs.<br>**AC-1.2:** Registry supports co-located assets and multiple asset source directories (e.g., `OmniPost-Core/docs/Omni-Post-AI-Automation/assets` and `Vivek-OnPoint-Web/docs/architecture`). |
| **REQ-2** | **Frontmatter Synthesis & Normalization** | **AC-2.1:** If source markdown lacks YAML frontmatter, the engine extracts the primary H1 heading for `title`, synthesizes a 150–160 character description from opening text for `seoDescription`, and injects required metadata matching `DocMeta` (`projectId`, `category`, `keywords`, `type: 'series'`, `schemaType: 'TechArticle'`).<br>**AC-2.2:** Existing frontmatter is preserved and merged without overwriting custom metadata.<br>**AC-2.3:** Document titles strip numbering prefixes (e.g., `01. Executive Summary` $\to$ `Executive Summary`) for navigation display while maintaining logical sorting order. |
| **REQ-3** | **Asset Mirroring, Filtering & CDN Tag Rewriting** | **AC-3.1:** New and modified images (`.webp`, `.png`, `.jpg`, `.svg`) from project `sourceAssetsDirs` are copied to `public/Project/<targetAssetsDir>/`. Raw `.excalidraw` binaries are strictly ignored.<br>**AC-3.2:** Relative image links (`./Assets/foo.webp`, `Assets/foo.webp`, `../assets/foo.png`) and HTML `<img src="..." />` tags in markdown are automatically rewritten to `https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/<cdnFolder>/foo.webp`.<br>**AC-3.3:** Any image URL already starting with `http://`, `https://`, or `//` is left untouched (preventing double CDN prefix corruption). |
| **REQ-4** | **Relative Markdown Link & Slug Normalization** | **AC-4.1:** Relative internal links between markdown files (e.g., `[Architecture](./02-Architecture-and-Flow.md)`) are converted to Next.js route URLs in lowercase kebab-case (e.g., `/docs/projects/personal/omnipost/02-architecture-and-flow`).<br>**AC-4.2:** Synced target filenames and slugs are strictly normalized to lowercase kebab-case to prevent 404s on case-sensitive Linux/Vercel runners. |
| **REQ-5** | **Generalization of `DocPageClient.tsx` Series Navigation** | **AC-5.1:** `src/app/docs/[...slug]/page.tsx` passes a full `href` property in `multiDocs: { id: string; title: string; href: string }[]`.<br>**AC-5.2:** `DocPageClient.tsx` uses `doc.href` for sidebar links and prev/next footer pagination, replacing hardcoded `/docs/omnipost/${doc.id}` routes.<br>**AC-5.3:** `DocPageClient.tsx` reads `meta.type` and `meta.lastUpdated` for document badges instead of hardcoding "Dec 2025" and binary "Executive Summary" vs "Technical Documentation". |
| **REQ-6** | **Project Data Alignment in `projects.ts`** | **AC-6.1:** Add complete project definitions in `src/data/content/projects.ts` for `1099-w2-equalizer`, `notebooklm-py-pr276`, and `telegram-capture-bot`.<br>**AC-6.2:** `sync-docs.ts` outputs a generated navigation manifest `src/data/content/docs-navigation.generated.json` and updates project `documentation: [{ title, url }]` arrays without brittle regex mutation of active TS files. |
| **REQ-7** | **Local AI Skill (`portfolio-docs-sync`)** | **AC-7.1:** Author `.ai/skills/portfolio-docs-sync/SKILL.md` and mirror to `~/.gemini/config/skills/portfolio-docs-sync/SKILL.md`.<br>**AC-7.2:** Skill equips any agent to diagnose project layouts, execute sync runs, audit git status on `public/Project`, and perform closed-loop verification. |
| **REQ-8** | **Batch 1 Project Onboarding** | **AC-8.1:** OmniPost-Core v6.0 flywheel (23 docs + assets) is fully synced.<br>**AC-8.2:** 1099-W2-Equalizer (15 docs) is registered and synced.<br>**AC-8.3:** Vivek-OnPoint-Web (10 architecture/design docs) is linked and synced.<br>**AC-8.4:** notebooklm-py (9 technical docs) is linked and synced.<br>**AC-8.5:** SecondBrain-Telegram-Capture (4 setup docs) is registered and synced. |

---

## 2.5 Codebase Intelligence & Context References

### Relevant Codebase Files
- `src/components/docs/DocPageClient.tsx` (lines 318–331, 394–428): **CRITICAL DEFECT LOCATION.** Hardcodes `/docs/omnipost/` in sidebar links and prev/next buttons.
- `src/app/docs/[...slug]/page.tsx` (lines 118–124): Generates `multiDocs` without `href`. Must be updated to include `href: '/docs/' + d.slug.join('/')`.
- `src/lib/docs-engine.ts` (lines 5–77): Defines `DocMeta` requiring `title`, `seoDescription`, `keywords`, `projectId`, `category`, `type`, `schemaType`.
- `src/data/content/projects.ts` (lines 4–576): Stores canonical project metadata. Current project IDs:
  - OmniPost: `id: "n8n-automation-suite"` (line 316)
  - Vivek OnPoint: `id: "vivek-onpoint-platform"` (line 76)
  - 1099 Equalizer: missing
  - notebooklm-py: missing
  - Telegram Capture: missing
- `public/Project/CDN_IMAGE_GUIDE.md` (lines 1–169): Defines isolated nested Git repository architecture for `portfolio-assets`.
- `package.json`: Requires adding `tsx` and `chokidar` to `devDependencies`.

---

## 3. Architecture & Design

### 3.1 Structural System Flow
```mermaid
flowchart TD
    subgraph SiblingDisk ["Sibling Drive (A:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\)"]
        SrcDocs["Source Docs<br/>(Markdown)"]
        SrcAssets["Source Assets<br/>(WebP / PNG / SVG)"]
    end

    subgraph SyncCLI ["Sync Engine (scripts/sync-docs.ts)"]
        EnvGuard{"CI / Vercel<br/>Environment?"}
        Reg["docs-registry.ts"]
        Parser["AST / Gray-Matter<br/>Parser"]
        FrontGen["Frontmatter Synthesizer<br/>(Full DocMeta Schema)"]
        LinkRewrite["Link & Asset Rewriter<br/>(CDN + Lowercase Slugs)"]
        GitAudit["Nested Git Auditor<br/>(git -C public/Project status)"]
        NavGen["Navigation Manifest Generator<br/>(docs-navigation.generated.json)"]
    end

    subgraph PortfolioDisk ["Portfolio Codebase (AmanSuryavanshi.dev)"]
        TgtDocs["src/content/docs/<br/>projects/..."]
        TgtAssets["public/Project/<Folder>/<br/>(portfolio-assets repo)"]
        UIPage["src/app/docs/[...slug]/page.tsx<br/>(Passes full doc.href)"]
        UIClient["src/components/docs/DocPageClient.tsx<br/>(Dynamic Multi-Doc Navigation)"]
        NavFile["src/data/content/docs-navigation.generated.json"]
        ProjectsTS["src/data/content/projects.ts<br/>(Registered Project Definitions)"]
    end

    EnvGuard -->|Yes: VERCEL=1| ExitClean["Exit 0 (No-Op)"]
    EnvGuard -->|No: Local Dev| Reg
    SrcDocs -->|Read-only| Parser
    SrcAssets -->|Copy Images (Skip .excalidraw)| TgtAssets
    Parser --> FrontGen
    FrontGen --> LinkRewrite
    LinkRewrite -->|Write Normalized MD| TgtDocs
    LinkRewrite --> NavGen
    NavGen --> NavFile
    NavFile -.->|Imported by| ProjectsTS
    UIPage --> UIClient
    TgtAssets --> GitAudit
```

### 3.2 Key Architectural Refactorings

#### 1. Generalizing `DocPageClient.tsx` Navigation
In `src/app/docs/[...slug]/page.tsx`:
```tsx
if (meta.type === 'series') {
    const seriesDocs = getDocsByProjectId(meta.projectId);
    multiDocs = seriesDocs.map(d => ({
        id: d.slug[d.slug.length - 1],
        title: d.meta.title,
        href: `/docs/${d.slug.join('/')}`
    }));
}
```
In `src/components/docs/DocPageClient.tsx`:
```tsx
// Sidebar:
<Link key={doc.id} href={doc.href || `/docs/${doc.id}`} ...>
// Prev / Next Buttons:
{prevDoc && <Link href={prevDoc.href || `/docs/${prevDoc.id}`} ...>}
{nextDoc && <Link href={nextDoc.href || `/docs/${nextDoc.id}`} ...>}
```

#### 2. Robust Image Rewriting Engine
```typescript
function rewriteImageLinks(content: string, cdnBaseUrl: string): string {
    // 1. Markdown images: ![alt](url)
    let processed = content.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
            return match; // Leave existing CDN/remote URLs untouched
        }
        const filename = path.basename(url.split('?')[0].split('#')[0]);
        return `![${alt}](${cdnBaseUrl}/${filename})`;
    });

    // 2. HTML images: <img src="url" ...>
    processed = processed.replace(/<img\s+([^>]*?)src=["'](.*?)["']([^>]*?)>/gi, (match, before, url, after) => {
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
            return match;
        }
        const filename = path.basename(url.split('?')[0].split('#')[0]);
        return `<img ${before}src="${cdnBaseUrl}/${filename}"${after}>`;
    });

    return processed;
}
```

#### 3. Cross-Doc Link Rewriting & Lowercase Normalization
```typescript
function rewriteMarkdownLinks(content: string, routePrefix: string): string {
    return content.replace(/\[(.*?)\]\((?!https?:\/\/|mailto:|#)(.*?)\.md(?:#(.*?))?\)/g, (match, text, relPath, anchor) => {
        const fileBase = path.basename(relPath).toLowerCase().replace(/\s+/g, '-');
        const anchorPart = anchor ? `#${anchor}` : '';
        return `[${text}](${routePrefix}/${fileBase}${anchorPart})`;
    });
}
```

---

## 4. Tech Stack & Dependencies

| Dependency | Purpose | Status | Target Version |
| :--- | :--- | :--- | :--- |
| **`gray-matter`** | Frontmatter parsing and serialization | Installed | `^4.0.3` |
| **`tsx`** | Direct TypeScript execution for scripts | **To Install (`-D`)** | `^4.19.2` |
| **`chokidar`** | File watcher for live sync during authoring | **To Install (`-D`)** | `^4.0.3` |
| **`zod`** | Runtime schema validation | Installed | `^3.24.2` |
| **`jsDelivr CDN`** | Global edge asset delivery | Existing Infrastructure | `Multi-CDN` |

---

## 5. Security & Privacy Considerations

- **Read-Only Invariant:** Source directories in `MAJOR PROJECTS` are strictly opened with `fs.readFileSync` and `fs.copyFileSync`. Zero destructive writes or file modifications are performed against sibling repositories.
- **Confidential Document Exclusion:** Documents containing `Classification: Confidential` or frontmatter `private: true` are filtered out automatically.
- **Secret Scrubbing:** Markdown content is scanned for API keys (`sk_live_`, `ghp_`, `Bearer `) before writing to `src/content/docs/`.

---

## 6. Scalability & Performance

- **Differential Syncing:** Compares SHA-256 hashes of generated content against existing disk files. Unchanged files are skipped to prevent unnecessary Git churn.
- **Sub-Second Execution:** Full sync of 60+ documentation files completes in $< 800\text{ms}$.
- **Isolated Asset Git Tracking:** Heavy image binaries are quarantined in `public/Project` (`portfolio-assets`), keeping the main portfolio repository $< 50\text{MB}$.

---

## 7. Error Handling, Fallbacks & Rollback

| Failure Mode | Detection | Mitigation & Fallback |
| :--- | :--- | :--- |
| **CI / Vercel Runner** | `process.env.VERCEL || process.env.CI` | Immediately exit 0 without attempting disk reads. |
| **Source Project Missing** | `fs.existsSync(sourcePath) === false` | Log structured warning, continue syncing remaining projects, exit 0. |
| **Uncommitted Assets in `public/Project`** | `git -C public/Project status --porcelain` | Print highlighted warning with exact commit/push commands. In strict mode (`--strict`), exit 1. |
| **Mismatched Frontmatter** | YAML parse exception | Discard malformed block and synthesize fresh frontmatter from document H1 and lead paragraph. |
| **Rollback Plan** | Broken sync in portfolio | Revert portfolio docs: `git checkout HEAD -- src/content/docs/ src/data/content/`. Revert assets: `git -C public/Project checkout HEAD -- .`. |

---

## 8. 6-Level Testing & Verification Strategy

- **Level 1: Syntax & Typecheck:** Run `npm run typecheck` to verify `DocPageClient.tsx`, `docs-registry.ts`, and `sync-docs.ts`.
- **Level 2: Unit / Dry-Run Verification:** Execute `npx tsx scripts/sync-docs.ts --dry-run` to verify parsing, frontmatter synthesis, and link transformations in memory.
- **Level 3: Live Sync Execution:** Run `npm run sync:docs` to generate production markdown in `src/content/docs/` and asset copies in `public/Project/`.
- **Level 4: Next.js Static Build Gate:** Run `npm run build` to confirm `generateStaticParams()` compiles 100% of routes across all 5 projects.
- **Level 5: Dual-Stage Asset Verification:**
  - **Level 5A (Local):** Verify all referenced image files exist in `public/Project/<targetAssetsDir>/`.
  - **Level 5B (Remote Post-Push):** Probe jsDelivr CDN URLs via HTTP HEAD requests to confirm 200 OK.
- **Level 6: Capstone Independent Review:** Independent PVE Verifier audit of the diff and architecture.

---

## 9. Execution Phasing & Task Breakdown

### Phase 1: Core Engine, Registry & UI Generalization
- [ ] **T-1.1 [INSTALL] Install Dev Dependencies**
  - **IMPLEMENT:** `npm install -D tsx chokidar`
  - **VALIDATE:** `npx tsx -v`
- [ ] **T-1.2 [REFACTOR] Generalize `DocPageClient.tsx` Navigation**
  - **IMPLEMENT:** In `src/app/docs/[...slug]/page.tsx`, pass `href` in `multiDocs`. In `src/components/docs/DocPageClient.tsx`, use `doc.href` for sidebar links and prev/next footer pagination. Remove hardcoded `/docs/omnipost/` and "Dec 2025".
  - **VALIDATE:** `npm run typecheck`
- [ ] **T-1.3 [CREATE] `src/config/docs-registry.ts`**
  - **IMPLEMENT:** Define `DocProjectConfig` interface and register:
    - OmniPost: `projectId: "n8n-automation-suite"`, target `personal/omnipost`, CDN `OMNI-POST-AI-Assets`.
    - 1099-W2-Equalizer: `projectId: "1099-w2-equalizer"`, target `personal/1099-w2-equalizer`, CDN `1099-W2-Equalizer`.
    - Vivek OnPoint: `projectId: "vivek-onpoint-platform"`, target `clientele/vivek-onpoint`, CDN `Vivek-OnPoint`.
    - notebooklm-py: `projectId: "notebooklm-py-pr276"`, target `personal/notebooklm-py`, CDN `notebooklm-py`.
    - Telegram Capture: `projectId: "telegram-capture-bot"`, target `personal/telegram-capture`, CDN `Telegram-Capture`.
  - **VALIDATE:** `npx tsx -e "import { docsRegistry } from './src/config/docs-registry'; console.log('Registry valid:', docsRegistry.length === 5)"`
- [ ] **T-1.4 [CREATE] `scripts/sync-docs.ts`**
  - **IMPLEMENT:** Full sync engine with CI guard, frontmatter synthesizer, asset mirror, markdown/HTML image rewriter (ignoring existing http URLs), cross-doc link rewriter, slug lowercase normalizer, and `public/Project` git status checker.
  - **VALIDATE:** `npx tsx scripts/sync-docs.ts --dry-run`
- [ ] **T-1.5 [UPDATE] `package.json`**
  - **IMPLEMENT:** Add `"sync:docs": "tsx scripts/sync-docs.ts"`, `"sync:docs:watch": "tsx scripts/sync-docs.ts --watch"`. **DO NOT add prebuild hook.**
  - **VALIDATE:** `npm run sync:docs -- --dry-run`

### Phase 2: Local AI Skill Creation
- [ ] **T-2.1 [CREATE] `.ai/skills/portfolio-docs-sync/SKILL.md`**
  - **IMPLEMENT:** Author comprehensive skill instructions with discovery rules, asset git push instructions, and verification checklists.
  - **VALIDATE:** File exists and is well-formatted markdown.
- [ ] **T-2.2 [MIRROR] `~/.gemini/config/skills/portfolio-docs-sync/SKILL.md`**
  - **IMPLEMENT:** Copy skill to global Gemini config directory.
  - **VALIDATE:** File exists globally.

### Phase 3: Project Synchronization & Onboarding (Batch 1)
- [ ] **T-3.1 [UPDATE] Register Projects in `src/data/content/projects.ts`**
  - **IMPLEMENT:** Add full project definitions for `1099-w2-equalizer`, `notebooklm-py-pr276`, and `telegram-capture-bot` with tech stacks, badges, and documentation placeholders.
  - **VALIDATE:** `npm run typecheck`
- [ ] **T-3.2 [EXECUTE] Sync OmniPost-Core v6.0 Flywheel**
  - **IMPLEMENT:** Run `npm run sync:docs -- --project omnipost`. Sync 23 docs and mirror assets.
  - **VALIDATE:** Inspect `src/content/docs/projects/personal/omnipost/00-end-to-end-flywheel.md`.
- [ ] **T-3.3 [EXECUTE] Sync 1099-W2-Equalizer**
  - **IMPLEMENT:** Run `npm run sync:docs -- --project 1099-w2-equalizer`. Sync 15 docs.
  - **VALIDATE:** Inspect `src/content/docs/projects/personal/1099-w2-equalizer/01-architecture-overview.md`.
- [ ] **T-3.4 [EXECUTE] Sync Vivek-OnPoint-Web**
  - **IMPLEMENT:** Run `npm run sync:docs -- --project vivek-onpoint`. Sync 10 architecture docs.
  - **VALIDATE:** Inspect `src/content/docs/projects/clientele/vivek-onpoint/`.
- [ ] **T-3.5 [EXECUTE] Sync notebooklm-py**
  - **IMPLEMENT:** Run `npm run sync:docs -- --project notebooklm-py`. Sync 9 technical docs.
  - **VALIDATE:** Inspect `src/content/docs/projects/personal/notebooklm-py/`.
- [ ] **T-3.6 [EXECUTE] Sync SecondBrain-Telegram-Capture**
  - **IMPLEMENT:** Run `npm run sync:docs -- --project telegram-capture`. Sync 4 setup docs.
  - **VALIDATE:** Inspect `src/content/docs/projects/personal/telegram-capture/`.
- [ ] **T-3.7 [UPDATE] Update Documentation Navigation Links in `projects.ts`**
  - **IMPLEMENT:** Wire generated doc links into `documentation: [...]` arrays for all 5 projects.
  - **VALIDATE:** `npm run typecheck`

### Phase 4: Machine Build Gate & Verification
- [ ] **T-4.1 [VALIDATE] Local Asset Existence Check**
  - **IMPLEMENT:** Verify all referenced images exist in `public/Project/`.
- [ ] **T-4.2 [VALIDATE] Next.js Production Build**
  - **COMMAND:** `npm run build`
  - **CRITERIA:** Zero build errors, all static doc routes compiled successfully.

---

## 10. Risks & Open Questions

| Risk | Likelihood | Impact | Mitigation |
| :--- | :---: | :---: | :--- |
| **Unpushed assets causing 404s on live CDN** | High | Medium | Sync script audits `public/Project` git status and alerts user. Local Next.js serves from `/Project/` fallback. |
| **Slug casing mismatch on Linux Vercel** | Medium | High | Script enforces lowercase kebab-case across all filenames, slugs, and internal links. |
| **Large file watch performance** | Low | Low | Chokidar watcher is scoped strictly to source doc directories. |

---

## 11. Production Readiness & Observability

- **Structured CLI Logging:** `sync-docs.ts` outputs detailed statistics (synced, unchanged, skipped, assets copied).
- **Zero Vercel Interference:** No `prebuild` hook; Vercel deploys statically committed markdown.
- **Git Worktree Isolation:** Heavy images stay in `portfolio-assets`, main repo stays lightweight.

---

## 12. Change Log

| Version | Date | Change | Finding IDs Resolved |
| :--- | :--- | :--- | :--- |
| v2 | 2026-09-06 | PVE Round 2: Generalized `DocPageClient.tsx` navigation, removed `prebuild` hook from `package.json`, fixed image URL double-prefix regex, aligned project IDs in `projects.ts`, added `category`/`schemaType` synthesis, and added `public/Project` git status auditing. | CR-1, CR-2, H-1, H-2, H-3, H-4, M-1, M-2, M-3, M-4, M-5, M-6, L-1 |
| v1 | 2026-09-06 | Initial PVE implementation blueprint covering engine, registry, skill, and Batch 1 onboarding. | — |
