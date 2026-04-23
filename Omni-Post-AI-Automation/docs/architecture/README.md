# OmniPost Architecture Planning README

## Purpose
This is the pre-diagram architecture sketch used before Excalidraw CLI diagram creation.

## Scope
- L1: Product/system context
- L2: Container architecture
- L3: Workflow decomposition and data contracts

## L1 — Context
```text
Client Teams / Operators
   -> OmniPost Dashboard (control plane)
   -> OmniPost Automation Core (n8n + AI services)
   -> External platforms (LinkedIn, X, Threads, Blog/CMS, Dev.to, Hashnode)
   -> Intelligence sources (Reddit, Apify, approved competitor sources)
```

## L2 — Containers
1. Dashboard (Next.js): queue, approvals, scheduling, retries, analytics
2. Workflow Orchestrator (n8n): deterministic state transitions and integrations
3. Researcher Service (Claude-oriented intelligence engine)
4. Data Stores:
   - Notion (source + status metadata)
   - Draft/Result store
   - Config store for multi-tenant settings
5. External APIs (social platforms, CMS, intelligence providers)

## L3 — Workflow blueprint
### Parent C: Intelligence & Research
- C1 Intake
- C2 Competitor/Audience fetch (Reddit + Apify)
- C3 Historical performance pull
- C4 Signal scoring and prioritization
- C5 ResearchSignalBundle emit

### Parent A: Generation
- A1 Notion extraction subworkflow
- A2 Context layer assembly (Obsidian + portfolio + research bundle)
- A3 AI content strategy
- A4 Platform draft generators (subworkflow invocation)
- A5 RawDraftBundle persistence + Pending Approval event

### Parent B: Distribution
- B1 ApprovedDraftBundle intake
- B2 Asset mapping/media preparation
- B3 Per-platform publisher subworkflows
- B4 PublishResultEvent aggregation
- B5 Notion/dashboard status updates

## Core contracts
- `ContentSourceV2`
- `ResearchSignalBundle`
- `RawDraftBundle`
- `ApprovedDraftBundle`
- `DistributionPayload`
- `PublishResultEvent`

## Phase decisions
- Phase 1 publish: LinkedIn, X, Threads, Blog, Dev.to, Hashnode
- Phase 1 intelligence: Reddit + Apify + existing sources
- Phase 2 publish: Reddit automation

## Diagram build order (for Excalidraw)
1. Draw L1 context map.
2. Draw L2 container map with directional links.
3. Draw L3 parent workflow map (C -> A -> B feedback loop).
4. Expand each parent into subworkflow lanes.
5. Overlay contracts on all handoff edges.
6. Mark dashboard API/webhook touchpoints.
7. Add multi-tenant config injection points.

## Client onboarding design rule
Every new client should be onboarded by configuration only:
- tenant profile
- brand voice pack
- platform matrix
- approval policy
- credential binding
No workflow cloning per client.
