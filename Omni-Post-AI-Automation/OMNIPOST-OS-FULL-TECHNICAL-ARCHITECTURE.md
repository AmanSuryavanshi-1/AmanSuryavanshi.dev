# OmniPost OS — Full Technical Architecture (Client + Build Blueprint)

> **Version:** v1.0 (Target-State Blueprint)
> **Date:** 2026-03-30
> **Owner:** Aman Suryavanshi
> **Purpose:** Canonical architecture for building, selling, and scaling OmniPost from single-brand engine to Agency OS.

---

## 1) Executive Architecture in One Line

**OmniPost OS = Next.js Content Lake + n8n deterministic orchestration + Claude-based reasoning workers + platform adapters, governed by strict JSON contracts.**

---

## 2) System Goals

1. **Reliable operations:** deterministic publish pipeline with retries, observability, and human approval gates.
2. **High content quality:** AI reasoning is separated from plumbing and can evolve independently.
3. **Client explainability:** architecture is auditable and visual (n8n + dashboard).
4. **Productization:** same backbone supports both single-tenant and multi-tenant deployments.
5. **Defensibility:** competitor intelligence + brand-specific strategy + approval workflows in one system.

---

## 3) C4 L2 Container View

## 3.1 Presentation Layer
- **Next.js 15 App Router Dashboard**
  - Content Lake (idea inbox)
  - Draft queue and approvals
  - Content calendar
  - Analytics and history
  - Tenant settings (brand voice, platform toggles, credentials references)
- **Client Portal**
  - Approve/reject/edit drafts
  - Schedule publishing
  - View performance

## 3.2 Orchestration Layer
- **n8n Parent Workflow A — Generation Orchestrator**
  - source ingestion
  - context assembly
  - AI generation orchestration
  - draft persistence + status transitions
- **n8n Parent Workflow B — Distribution Orchestrator**
  - approved draft pickup
  - asset mapping
  - platform-specific publishing
  - post-publish status + metrics writeback
- **n8n Parent Workflow C — Research Intelligence (new)**
  - daily competitor monitoring
  - transcript ingestion
  - counter-content opportunity generation
  - feed opportunities into Content Lake

## 3.3 AI Reasoning Layer
- **Claude Agent Runtime Service (HTTP)**
  - strategy planning
  - platform-specific draft generation
  - quality scoring and rewrite suggestions
- **Research Agent Service (HTTP)**
  - competitor signal extraction
  - gap analysis
  - topic/opportunity generation

## 3.4 Data/Integration Layer
- **Primary data plane:** Supabase/Postgres (tenants, content objects, statuses, analytics metadata)
- **Knowledge sources:** Notion, Obsidian (MCP), YouTube transcripts, web research providers
- **Distribution endpoints:** LinkedIn, X/Twitter, Blog/CMS (Sanity), optional Threads/Newsletter/Dev.to

---

## 4) Recommended Workflow Split (Long-Term)

You currently have 2 parent workflows. For long-term scaling, keep generation/distribution as-is and add research as a third parent.

## 4.1 Parent A: Content Generation (existing, hardened)
Subflow decomposition:
1. `SF-A1 Source Ingestion` (Notion/Obsidian/YT transcript pull)
2. `SF-A2 Context Normalization` (canonical ContentSource)
3. `SF-A3 Strategy + Draft Engine` (Claude service call)
4. `SF-A4 Quality Gate` (rule checks + score)
5. `SF-A5 Draft Persistence` (store DraftBundle + queue status)

## 4.2 Parent B: Distribution (existing, hardened)
Subflow decomposition:
1. `SF-B1 Approval Intake` (approved drafts retrieval)
2. `SF-B2 Asset Resolver` (image/video mapping)
3. `SF-B3 Platform Adapter Router`
4. `SF-B4 Publisher Adapters` (LinkedIn/X/Blog/others)
5. `SF-B5 Postback + Analytics` (status, URLs, metrics pointers)

## 4.3 Parent C: Research Intelligence (new)
Subflow decomposition:
1. `SF-C1 Source Monitoring` (competitors, feeds, transcripts)
2. `SF-C2 Signal Structuring` (topic, format, engagement cues)
3. `SF-C3 AI Gap Analysis` (what competitors missed)
4. `SF-C4 Opportunity Builder` (counter-content briefs)
5. `SF-C5 Content Lake Injection` (new ContentSource items)

**Why this split:**
- research cadence is independent (daily/weekly),
- generation cadence is editorial,
- distribution cadence is approval/schedule-driven.

---

## 5) Canonical JSON Contracts

## 5.1 ContentSource
```json
{
  "source_id": "uuid",
  "tenant_id": "tenant_uuid",
  "source_type": "notion|obsidian|youtube_transcript|competitor_signal|manual_idea",
  "title": "string",
  "raw_text": "string",
  "metadata": {
    "origin_url": "string|null",
    "author": "string|null",
    "published_at": "ISO8601|null"
  },
  "strategy_context": {
    "brand_voice_id": "uuid",
    "goal": "awareness|authority|pipeline",
    "target_platforms": ["linkedin", "x", "blog"]
  }
}
```

## 5.2 DraftBundle
```json
{
  "draft_bundle_id": "uuid",
  "source_id": "uuid",
  "tenant_id": "uuid",
  "status": "pending_approval",
  "drafts": {
    "linkedin": { "text": "string", "asset_hints": ["img_1"] },
    "x": { "thread": ["tweet1", "tweet2"] },
    "blog": { "title": "string", "markdown": "string" }
  },
  "quality": {
    "score": 0,
    "notes": "string"
  }
}
```

## 5.3 DistributionPayload
```json
{
  "distribution_id": "uuid",
  "draft_bundle_id": "uuid",
  "tenant_id": "uuid",
  "platform": "linkedin|x|blog|threads|newsletter",
  "publish_mode": "now|scheduled",
  "scheduled_for": "ISO8601|null",
  "content": {
    "text": "string",
    "media_urls": ["string"]
  }
}
```

---

## 6) YouTube Transcript Feature (Integrated)

## 6.1 Ingestion path
1. Research workflow identifies high-signal videos.
2. Transcript extractor fetches transcript text + metadata.
3. Transcript is normalized into `ContentSource`.
4. Strategy engine creates:
   - commentary post,
   - insight thread,
   - long-form synthesis draft.

## 6.2 Guardrails
- always store original video URL and timestamp metadata,
- enforce transformation (no blind copy),
- optional source citation in generated drafts.

---

## 7) Research Agent Architecture Decision

## 7.1 Options evaluated
1. **Claude Code instance as runtime worker**
2. **Claude Agent SDK/API service on Modal/Railway**
3. **Trigger.dev TypeScript jobs orchestrating the whole agent runtime**

## 7.2 Recommendation
**Use Claude Agent SDK/API service hosted on Modal (primary) or Railway (secondary), invoked by n8n Parent C via HTTP.**

### Why this is best
- Stateless HTTP contract is production-safe and easy to retry.
- n8n remains source of truth for orchestration and auditing.
- Modal/Railway are better deployment targets for daily scheduled AI workers than running an interactive Claude Code session as the runtime.
- Trigger.dev is optional later for dashboard-native background jobs, but should not replace n8n as core automation backbone.

### Direct answer to your question
- **Do not host an interactive Claude Code instance as the daily research runtime.**
- **Use a dedicated Claude Agent service endpoint (SDK/API) on Modal/Railway and call it from n8n cron.**

---

## 8) Deployment Blueprint

## 8.1 Minimal production stack
- n8n (self-hosted)
- Next.js dashboard (Vercel/Railway)
- Supabase Postgres
- Modal service for `research-agent` + `draft-agent`
- Secrets manager + webhook signing

## 8.2 Environment partitioning
- `dev` (sandbox APIs)
- `staging` (real integrations, test tenants)
- `prod` (live client tenants)

## 8.3 Reliability requirements
- idempotency keys per publish operation,
- retry policies by failure class,
- dead-letter queue pattern for repeated failures,
- structured logs with `tenant_id`, `source_id`, `workflow_run_id`.

---

## 9) Security & Multi-Tenant Controls

- never store raw provider secrets in n8n workflow JSON,
- per-tenant credential references + access policies,
- signed service-to-service requests (n8n → agent endpoint),
- redact PII from logs,
- immutable publish audit trail.

---

## 10) Productization Roadmap

## Phase 1 — Core Engine Hardening
- finalize contracts (`ContentSource`, `DraftBundle`, `DistributionPayload`)
- subflow extraction in existing Part 1 + Part 2
- launch Parent C (Research Intelligence)

## Phase 2 — Client-Facing OS
- Next.js Content Lake + approvals + calendar
- analytics pages + publish history
- role-based client portal

## Phase 3 — Agency OS
- full multi-tenant management
- per-client scoring + strategy presets
- premium modules: competitor intelligence, SEO/GEO, transcript intelligence

---

## 11) Client-Facing Positioning

When explaining to clients:
1. **Layer 1:** Dashboard where their team works daily.
2. **Layer 2:** Orchestration engine that guarantees reliable execution.
3. **Layer 3:** AI intelligence that improves strategy and quality.

This framing makes the system understandable, credible, and clearly superior to simple schedulers.

---

## 12) Diagram Artifacts

- Excalidraw source: `OmniPost-Core/docs/architecture/omnipost-full-architecture.excalidraw`
- Second Brain source: `A:/_SecondBrain/02-Projects/OmniPost-AI/docs/architecture/omnipost-full-architecture.excalidraw`
- Rendered PNG: `A:/_SecondBrain/02-Projects/OmniPost-AI/docs/architecture/omnipost-full-architecture.png`
