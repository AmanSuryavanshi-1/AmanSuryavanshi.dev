# 🔮 Omni-Post AI — Future Enhancements Backlog

> **Purpose:** Track planned improvements that are NOT yet implemented. Do not add these to code or prompts until the trigger condition is met.
> **Owner:** Aman Suryavanshi | **Last Updated:** Feb 19, 2026

---

## Enhancement 1: Narrative Continuity via RAG (Gap 3)

**Trigger:** Implement when you have **20+ posts** published across platforms.

### The Problem

Each post is generated in isolation. A hiring manager or founder who reads your LinkedIn post on Monday AND your Twitter thread on Thursday about the same topic should feel a *building story* — like they are following a narrative. Right now, each post could have been written by a different person.

### The Solution: Content Memory Layer (Vector RAG)

Add a new n8n node BEFORE the Perplexity research step and AFTER each successful post. It queries a vector database for "what have I already posted about this topic?" and injects that context into the strategy prompt.

```
┌─────────────────────────────────────────────────────────────┐
│            CONTENT MEMORY LAYER (New Part-0.5)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ON EVERY POST (after publishing):                         │
│    → Store post summary in vector DB:                      │
│      - Platform, Topic, Core Hook, Date, Engagement Tier   │
│                                                             │
│  ON EVERY NEW GENERATION (before Perplexity research):     │
│    → Query: "What have I posted about [topic] in 30 days?" │
│    → Retrieve 2-3 most similar past posts                   │
│    → Feed as `narrative_context` to Content Strategist     │
│                                                             │
│  IN CONTENT STRATEGIST PROMPT (new addition):              │
│    → If narrative_context is non-empty:                    │
│      - Reference or callback to your previous post         │
│      - Frame this as the "next chapter"                    │
│      - Avoid repeating the same hook/angle as last time    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Options

| Option | Tool | Effort | Cost | When to Use |
|--------|------|--------|------|-------------|
| **A. Notion Posted Log** | Existing Notion DB | 1-2 days | Free | At 20-50 posts. Keyword match only, no semantic search. |
| **B. Supabase + pgvector** | Postgres vector extension | 3-5 days | ~$0-25/mo | At 50+ posts. True semantic search. Easy n8n HTTP node. |
| **C. Pinecone** | Dedicated vector DB | 2-4 days | Free tier OK | At 50+ posts. Purpose-built, simplest API. |

### Recommended Path

1. **Phase 1 (At 20 posts):** Start with Option A — Notion "Posted Content Log" database.
   - Columns: Title, Platform, Date, Topic Tags, Core Hook used, Key Metric used.
   - In Perplexity prompt, add a step: "Query Notion Posted Content Log for posts on this topic in last 30 days."
   - No new infrastructure needed — you already use Notion.

2. **Phase 2 (At 50 posts):** Migrate to Option B — Supabase + pgvector.
   - Enables semantic search ("posts similar to 'n8n rate limiting'" instead of tag matching).
   - Add n8n HTTP node to query Supabase after the Notion trigger.
   - Estimated: 1 weekend of work.

### What to Add to Content Strategist Prompt (when ready)

Add a new field to the output JSON:
```json
"narrative_continuity": {
  "is_part_of_series": false,
  "series_name": null,
  "callback_to_previous": "Optional: 'Last week I showed X. This week, the follow-up...'",
  "teases_next": "Optional: What topic naturally follows this piece?"
}
```

All generator prompts would then use `strategy.narrative_continuity.callback_to_previous` in the intro/conclusion if non-null.

---

## Enhancement 2: Dev.to Series Strategy

**Trigger:** When Dev.to followers cross 100.

Dev.to's algorithm heavily weights **series posts** — they get a "Series" badge and appear in dedicated series feeds.

**What to add to `7. Gemini – Dev.to Content Generation.md`:**
Add a `series_detection` step before tag generation. If content fits a recurring theme, assign it to a named series:
- n8n content → "The Practical n8n Series"
- Next.js performance → "The Next.js Performance Playbook"
- AI workflows → "Building AI Automation in Public"
- LangGraph → "Agentic AI from Scratch"

---

## Enhancement 3: Canonical URL Cross-Post Management

**Trigger:** When posting the same article to both Dev.to AND Hashnode.

**Problem:** Publishing the same content on two platforms without canonical URL = Google penalizes BOTH for duplicate content.

**Fix in `8. Gemini – Hashnode Content Generation.md`:**
Add an instruction: "If this exact article was also published to Dev.to, the `canonical_url` field MUST be set to the Dev.to URL. Add a note at the top of the Hashnode article: 'Originally published on Dev.to.'"

**How to implement in n8n:** Store the Dev.to URL after publishing. Pass it as `devto_url` in the context to the Hashnode node. The Hashnode prompt reads `devto_url` and sets canonical accordingly.

---

## Enhancement 4: Posting Calendar Intelligence

**Trigger:** When you have 30+ days of posting data.

Add day-of-week recommendations to the Perplexity research output:
```json
"posting_schedule": {
  "twitter": { "best_day": "Tuesday or Wednesday", "best_time_IST": "8:00-9:00 AM" },
  "linkedin": { "best_day": "Monday or Tuesday", "best_time_IST": "7:30-8:30 AM" },
  "blog": { "best_day": "Thursday", "best_time_IST": "Any" }
}
```

---

*Review this backlog every 4 weeks. Move items to active implementation when their trigger conditions are met.*
