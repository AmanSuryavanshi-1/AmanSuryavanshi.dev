# Omnipost AI Enhancement Tasks: Portfolio API Integration

> **Purpose:** Replace hardcoded personal context with dynamic Portfolio API  
> **Estimated Time:** 1-2 hours  
> **Priority:** HIGH (do before RAG build)

---

## Overview

Currently, `Part 1 - X, LinkedIn, Blog - Personalized Content Generation` has **hardcoded personal data** in the "Code – Personal Context Builder" node. This needs to be replaced with a dynamic fetch from your Portfolio API.

### Current Problem (Hardcoded)
```javascript
// Code – Personal Context Builder (lines ~246-257 in JSON)
const personalContext = {
  name: "Aman Suryavanshi",
  primary_focus: "AI Automation Developer | Full Stack Automation Developer",
  skills: { frontend: ["Next.js 14", "React.js"...], ... },
  projects: { aviators: {...}, ... },
  services: [...],
  socials: {...},
  voiceAttributes: [...],
  // 100+ hardcoded parameters
};
```

### Target State (API-Driven)
```javascript
// Fetch from Portfolio API → Transform to personalContext
const apiResponse = await fetch('https://www.amansuryavanshi.me/api/portfolio?sections=about,skills,experience,services,projects');
const data = await apiResponse.json();
// Transform to existing personalContext structure
```

---

## Task Checklist

### Phase 1: Add Portfolio API Node (Before Context Builder)

- [ ] **1.1** Add new **HTTP Request** node after "Code – Extract & Process Content"
  - Method: `GET`
  - URL: `https://www.amansuryavanshi.me/api/portfolio?sections=about,skills,experience,services,projects`
  - Name suggestion: `Fetch Portfolio Context`

- [ ] **1.2** Connect the HTTP node:
  - Input: Output from "Code – Extract & Process Content"
  - Output: Input to "Code – Personal Context Builder"

### Phase 2: Transform API Response to personalContext

- [ ] **2.1** Modify **"Code – Personal Context Builder"** node:
  - Remove all hardcoded `personalContext` object
  - Add transformation logic to map API response to existing format

**Transformation Template:**
```javascript
// Replace the hardcoded personalContext with this:
const apiData = $('Fetch Portfolio Context').first().json;

const personalContext = {
  // CORE IDENTITY (from API)
  name: apiData.core.name,
  primary_focus: apiData.core.role,
  
  // SKILLS (from API skills section)
  skills: {
    frontend: apiData.skills.categories.find(c => c.id === 'frontend')?.groups.flatMap(g => g.items.map(i => i.label)) || [],
    automation: apiData.skills.categories.find(c => c.id === 'automation')?.groups.flatMap(g => g.items.map(i => i.label)) || [],
    aiml: apiData.skills.categories.find(c => c.id === 'ai')?.groups.flatMap(g => g.items.map(i => i.label)) || [],
    integration: apiData.skills.categories.find(c => c.id === 'backend')?.groups.flatMap(g => g.items.map(i => i.label)) || []
  },
  
  // TARGET POSITIONS (keep static or move to API)
  targetRoles: [
    "No-Code/Low-Code Developer",
    "Automation Developer",
    "AI Developer",
    "Technical Solutions Engineer",
    "AI Product Manager"
  ],
  
  // PROJECTS (from API projects section)
  projects: Object.fromEntries(
    (apiData.projects || []).map(p => [
      p.id.replace(/-/g, '_'),
      { name: p.title, url: p.liveUrl, tech: p.techStack, achievement: p.shortDescription }
    ])
  ),
  
  // SERVICES (from API services section)
  services: (apiData.services || []).map(s => s.title),
  
  // SOCIALS (from API core section)
  socials: {
    github: "https://github.com/AmanSuryavanshi-1",
    linkedin: "https://www.linkedin.com/in/amansuryavanshi-ai/",
    twitter: "https://x.com/_AmanSurya",
    portfolio: apiData.core.socials?.portfolio || "https://amansuryavanshi.me/"
  },
  
  // VOICE ATTRIBUTES (keep static - this is your writing style)
  voiceAttributes: [
    "Authentic & transparent (share real struggles + wins)",
    "Detail-oriented with technical depth",
    "Growth-minded (always learning)",
    "Practical over theoretical",
    "Builds in public",
    "Helpful & community-focused"
  ],
  
  // HIDDEN OBJECTIVES (static)
  hiddenGoals: {
    primary: "Get inbound job offers without applying",
    secondary: "Attract freelance/contract clients organically",
    tertiary: "Build reputation as automation expert"
  }
};
```

### Phase 3: Test & Validate

- [ ] **3.1** Execute workflow manually with test content
- [ ] **3.2** Verify API response is correctly transformed
- [ ] **3.3** Check generated content still maintains personal voice
- [ ] **3.4** Validate all platform outputs (Twitter, LinkedIn, Blog)

### Phase 4: Error Handling (Optional but Recommended)

- [ ] **4.1** Add fallback for API failures
  ```javascript
  let personalContext;
  try {
    const apiData = $('Fetch Portfolio Context').first().json;
    // ... transformation logic
  } catch (error) {
    console.warn('⚠️ API failed, using cached context');
    personalContext = CACHED_FALLBACK; // Keep a minimal fallback
  }
  ```

---

## Future Enhancement: RAG Integration

After building the RAG system (Week 4), you can enhance the AI prompts:

```javascript
// In "Code – CONTEXT MERGER" node, add:
const ragContext = await fetch('http://localhost:8000/query', {
  method: 'POST',
  body: JSON.stringify({
    query: `What experience do I have related to ${contentCategory}?`
  })
}).then(r => r.json());

// Merge RAG response with personalContext for richer AI prompts
```

---

## Files Affected

| File | Change Required |
|------|-----------------|
| `Part 1 - X, LinkedIn, Blog - Personalized Content Generation - OMNI-POST-AI.json` | Add HTTP node, modify Code node |
| (Optional) Create `personalContext_fallback.json` | Backup hardcoded values |

---

## Success Criteria

- [ ] Omnipost generates content using live Portfolio API data
- [ ] No more hardcoded personal info in workflow JSON
- [ ] Workflow still runs under 120 seconds
- [ ] Error handling for API failures
- [ ] Ready for future RAG integration
