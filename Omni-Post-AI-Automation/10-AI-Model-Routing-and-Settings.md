# AI Model & Node Settings Reference Guide
> **Version:** 1.0.0 | **Updated:** February 20, 2026  
> **Purpose:** Production-grade reference for all AI node configurations, model selection, tool usage, and rate limit management in the Omni-Post workflow.

---

## 1. Model Tier Comparison (All Free on ai.google.dev)

| Model | Quality | RPM (Free) | RPD (Free) | TPM | Best For |
|---|---|---|---|---|---|
| `gemini-3.1-pro-preview` | **S-Tier** | ~10* | ~100* | 250K | Strategist, LinkedIn (reasoning-heavy, career-critical) |
| `gemini-3-pro-preview` | **A-Tier** | ~10* | ~100* | 250K | Hashnode (SEO authority content) |
| `gemini-3-flash-preview` | **B+ Tier** | ~15 | ~1000 | 250K | Twitter, Blog, Dev.to (Best balance of speed and reasoning) |
| `gemini-2.5-pro` | **A-Tier** | ~15* | ~100-250* | 250K | Strong reasoning, alternative to 3.1 Pro |
| `gemini-2.5-flash` | **B Tier** | 15 | 1500 | 1M | Standard content generation, bulk processing |
| `gemini-2.5-flash-8b` | **C Tier** | 15 | 1500 | 1M | Fast, simple extraction tasks only |

> **⚠️ CRITICAL Note on "Quota Exceeded... limit: 0" Errors:**
> If you try to use **ANY "Pro" model** (`gemini-3.1-pro`, `gemini-3-pro`, `gemini-2.5-pro`) and receive a `limit: 0` error, it means Google has restricted Pro models from pure free-tier accounts. To unlock them, you MUST link a credit card/Billing Account to your Google Cloud API project. You will not be charged as long as you stay under the free limits, but the billing profile acts as identity verification. 
> 
> **If you do not want to add a credit card:** You must exclusively use **Flash** models. `gemini-3-flash-preview` or `gemini-2.5-flash` are the best guaranteed-free options available.

### Critical Rate Limit Rules
- **Rate limits are per Google Cloud PROJECT, NOT per API key**
- Multiple API keys under the SAME Google account share the same project quota
- **5 different Google accounts = 5 separate projects = 5x the limits**
- Mix API keys across nodes using credential rotation for maximum throughput

---

## 2. Production Node Configuration

### Node: Context - Standardize & Filter
```
Model:           gemini-2.5-flash-lite
Temperature:     0 (deterministic scoring)
maxOutputTokens: NOT SET (short output)
Tools:           NONE (pure filtering task)
API Key:         Key 1
```

### Node: Gemini - AI CONTENT STRATEGIST
```
Model:           gemini-3.1-pro-preview
Temperature:     0.4 (creative but control led)
maxOutputTokens: 4096
Tools:           Think + SerpAPI (KEEP)
API Key:         Key 1
```

### Node: Gemini - Twitter Content Generation
```
Model:           gemini-3-flash-preview
Temperature:     0.6 (high creativity for engagement)
maxOutputTokens: 2048
Tools:           Think (ADDED) + NO SerpAPI
API Key:         Key 3
```

### Node: Gemini - LinkedIn Content Generation
```
Model:           gemini-3.1-pro-preview
Temperature:     0.5 (balanced - professional + engaging)
maxOutputTokens: 4096
Tools:           Think (ADD) + NO SerpAPI
API Key:         Key 2
```

### Node: Gemini - Blog Content Generation
```
Model:           gemini-3-flash-preview
Temperature:     0.6
maxOutputTokens: 8192
Tools:           Think (ADDED)
API Key:         Key 3
```

### Node: Gemini - Dev.to Content Generation
```
Model:           gemini-3-flash-preview
Temperature:     0.7 (creative for dev community)
maxOutputTokens: 8192 (already set)
Tools:           Think (ADDED)
API Key:         Key 4
```

### Node: Gemini - Hashnode Content Generation
```
Model:           gemini-3-pro-preview
Temperature:     0.6
maxOutputTokens: 8192 (already set)
Tools:           Think (ADD)
API Key:         Key 4
```

---

## 3. Think Tool Configuration

### What the Think Tool Does
The Think Tool allows the AI model to engage in internal chain-of-thought reasoning BEFORE generating the final output. It "talks to itself" - breaking down the task, evaluating options, checking rule compliance, then producing output.

### Default Description (Pre-written)
```
Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log. Use it when complex reasoning 
or some cache memory is needed.
```

### **SHOULD YOU CUSTOMIZE IT? YES - DEFINITELY**

The `description` field is the ONLY parameter in the Think Tool. It is what tells the AI WHEN and HOW to use the tool. The default is generic. Customizing it per-node DRAMATICALLY improves how the model uses the tool.

### Optimized Think Tool Descriptions Per Node

**For Strategist Node:**
```
Use this tool to plan your content strategy step-by-step BEFORE outputting the final strategy. Think through: (1) Which engagement architecture pattern fits this topic best? (2) What curiosity gap can drive clicks? (3) What villain/obstacle creates tension? (4) What proof points support credibility? (5) Does the strategy align with the Velocity Hire Frame for career positioning? Output your reasoning, then proceed to generate the final strategy JSON.
```

**For LinkedIn Node:**
```
Use this tool to reason through your LinkedIn post structure BEFORE writing. Think through: (1) Does the hook follow the 80-character-max rule? (2) Is the post using the breadcrumb-payoff pattern correctly? (3) Does the Velocity Hire Frame position the author for AI Solutions Architect / Full-Stack Agentic Developer roles? (4) Are all anti-slop rules followed (no em-dashes, no banned words, active voice)? (5) Is there a save-trigger or bookmark-worthy insight? Reason carefully, then generate.
```

**For Hashnode Node:**
```
Use this tool to plan article structure BEFORE writing. Think through: (1) Does the intro answer the core question in the first 100 words for AEO/GEO? (2) Are H2s phrased as questions for featured snippets? (3) Is chain-of-density applied (each paragraph adds new information)? (4) Are named frameworks used instead of generic advice? (5) Are anti-slop rules followed? Plan the outline, then write.
```

**For Blog Node:**
```
Use this tool to plan blog structure BEFORE writing. Think through: (1) Is the Expert Card (name + keyword + problem solved) present in the first 150 words? (2) Are H2s question-format for AI discovery and featured snippets? (3) Is chain-of-density applied (each section adds new insight, no repetition)? (4) Does Adaptive Length match sourceContent.wordCount? (5) Are E-E-A-T signals present? (6) Are anti-slop rules followed? Plan the article outline, then write.
```

**For Dev.to Node:**
```
Use this tool to plan the Dev.to article BEFORE writing. Think through: (1) Does the TL;DR accurately summarize the key takeaway in 3 bullet points? (2) Is the Prerequisites section clear for beginner-to-mid developers? (3) Does the community debate question invite genuine, non-obvious discussion? (4) Are all code examples correct, complete, and traceable to sourceContent? (5) Is the tone friendly and tutorial-focused without condescension? (6) Are anti-slop rules followed? Plan, then write.
```

**For Twitter Node:**
```
Use this tool to validate tweet structure BEFORE outputting. Think through: (1) Is each tweet under 265 characters? Count carefully. (2) Does tweet 1 use an open loop or pattern interrupt hook? (3) Can tweet 3 (truth bomb) work as a standalone retweet? (4) Does the thread build momentum with identity hooks and specific numbers? (5) Does the final tweet seed replies with a specific question? (6) Are anti-slop rules followed (no em-dashes, active voice, no filler)? Validate each tweet, then generate the final thread JSON.
```


---

## 4. SerpAPI Tool Usage

### Current State
SerpAPI is connected to the Strategist node. It provides real-time Google search results.

### Should Prompts Reference SerpAPI Specifically? NO.
The n8n Google Gemini node automatically exposes connected tools to the model. The model sees the tool's name and description and decides when to call it. You do NOT need to add "use SerpAPI" to your prompts.

**However**, you CAN improve tool usage by adding a line to your system prompt:
```
If you need current trending data, hashtags, or competitor analysis that is not 
already provided in the research context, use available search tools to gather 
real-time information before generating content.
```

This is a SOFT NUDGE, not a hard instruction. The model will use tools when it deems necessary.

### Why NOT Add SerpAPI to Generation Nodes
1. Perplexity/Tavily research is already injected as `$json.research`
2. SerpAPI adds latency (each call = Google search API round-trip)
3. SerpAPI counts against your SerpAPI quota
4. Duplicate data retrieval = wasted tokens + slower execution

---

## 5. Perplexity Replacement: AI Agent + Gemini + Tavily

### Why This is BETTER Than Perplexity
| Feature | Perplexity (Old) | AI Agent + Tavily (New) |
|---|---|---|
| **Cost** | Paid API ($20/mo or limited free) | 1,000 free searches/month |
| **Control** | Black box prompt/model | Full control over model + prompt |
| **Iterative Search** | Single query | Multi-step: search -> analyze -> refine -> search again |
| **Source Quality** | Unknown ranking | You control domain filters, search depth |
| **Content Extraction** | Summary only | Full raw content extraction from URLs |
| **Deep Research** | Perplexity Pro only | Tavily has built-in `research` resource |

### Architecture: Drop-In Perplexity Replacement

```
[Context Merger] --> [AI Agent Node] --> [Content Generation Nodes]
                         |
                    [Gemini 2.5 Flash as Chat Model]
                         |
                    [Tavily Search Tool]
                         |
                    [Think Tool]
```

### AI Agent Node Configuration
```
Agent Type:     Tools Agent
Chat Model:     Gemini 2.5 Flash (or 3-flash-preview)
Max Iterations: 3
```

### AI Agent System Prompt (for Research)
```
You are a content research specialist. Your job is to gather comprehensive, 
current information about a topic for content creation across social media 
and blogs.

## Research Process
1. SEARCH for the topic using the Tavily search tool with specific queries
2. THINK about what angle would be most engaging for a tech audience
3. SEARCH again with refined queries based on initial findings
4. SYNTHESIZE findings into a structured research brief

## Output Format
Return a JSON object with:
{
  "topicSummary": "2-3 sentence overview",
  "keyInsights": ["insight1", "insight2", ...],
  "trendingAngles": ["angle1", "angle2"],
  "relevantStats": ["stat1", "stat2"],
  "hashtags": {
    "twitter": ["#tag1", "#tag2"],
    "linkedin": ["#tag1", "#tag2"]
  },
  "competitorContent": "summary of what others are saying",
  "uniqueAngle": "what makes our take different",
  "sources": ["url1", "url2"]
}

## Rules
- Focus on CURRENT data (last 7 days preferred)
- Prioritize tech, AI, and developer community sources
- Include specific numbers, statistics, and quotes when available
- Identify contrarian or unique angles, not generic takes
```

### Tavily Search Tool Description (for AI Agent)
```
Search the web for current information about a topic. Use the search query to find 
relevant articles, blog posts, and news. Returns titles, URLs, and content snippets.
Use this to gather research data for content creation. Prefer specific queries like 
"LangGraph multi-agent patterns 2026" over generic ones like "AI agents".
```

### Tavily Node Details
- **Package:** `@tavily/n8n-nodes-tavily` (community node - install via Settings > Community Nodes)
- **Free Tier:** 1,000 API credits/month (1 basic search = 1 credit, 1 advanced = 2 credits)
- **Resources:** Search, Extract, Crawl, Map, Research
- **Key advantage:** The `research` resource can do deep, multi-source research in a single call

### Alternative: Tavily as Standalone Node (Simpler)
If you want a simpler drop-in replacement without the AI Agent:
```
[Context Merger] --> [Tavily Search Node] --> [Code: Format Research] --> [Generation Nodes]
```

Configure Tavily Search Node:
```
Resource:     Search
Operation:    Query
Query:        ={{ $json.sourceContent.title }} + " latest trends 2026"
Topic:        General
Search Depth: Advanced (2 credits)
Max Results:  5
Include Answer: true
```

Then use a Code node to format the output to match the `$json.research` format that your generation nodes expect.

---

## 6. Prompt Modifications for Tool Usage

### Do Prompts Need Changes for Tools? MINIMAL.

The n8n Gemini node handles tool integration automatically. When you connect a tool:
1. The model receives the tool's name + description
2. The model decides when to call the tool
3. Tool results are injected back into the conversation
4. The model generates the final output using tool results

### What TO Add (Optional, One Line Per Node)

For nodes with Think Tool connected, add this to the END of your system prompt:
```
Before generating the final output, use available thinking tools to validate your 
response against all rules and constraints listed above.
```

This encourages the model to use Think AFTER drafting but BEFORE outputting.

### What NOT To Do
- Do NOT add "use SerpAPI to search" - the model will use it when needed
- Do NOT add "call the think tool" explicitly - it's automatic
- Do NOT reference tool names in the user prompt - only in system prompt
- Do NOT restructure your prompts around tools - they are additive

---

## 7. Rate Limit Optimization Strategy

### Daily Budget Calculation (5 API Keys from 5 Google Accounts)
```
Per account: ~100 RPD (for Pro models) or ~250 RPD (for Flash models)
5 accounts:  500-1,250 RPD total

Per workflow run: 8 API calls (1 Context + 1 Strategist + 6 Generators)
Daily runs possible: 62-156 runs/day (WAY more than needed)

Your actual usage: 1-3 runs/day = ~24 API calls = 4.8% of budget
```

### Credential Rotation Setup in n8n
1. Create 5 separate Google Gemini API credentials in n8n (one per friend's key)
2. Name them: `Gemini-Key-1`, `Gemini-Key-2`, etc.
3. Assign each node a specific credential as documented in Section 2
4. This distributes load across 5 separate Google Cloud projects

---

## Version History
| Ver | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-02-20 | Added Blog, Dev.to, Twitter Think Tool descriptions. Updated node configs to reflect Think added to all content nodes. Added prompt nudge lines. |
| 1.0.0 | 2026-02-20 | Initial version - model tiers, Think tool customization, 5-key strategy, Tavily replacement architecture |
