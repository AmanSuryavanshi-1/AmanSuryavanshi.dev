# Portfolio API - Quick Reference Guide

> **Last Updated:** January 9, 2026  
> **Purpose:** External API for n8n workflows, automation tools, and third-party integrations

---

## Base URL

```
https://www.amansuryavanshi.me/api/portfolio
```

---

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `sections` | comma-separated | `core`, `skills`, `experience`, `services`, `about`, `projects` |
| `projects` | comma-separated | Specific project IDs for full details |

---

## Available Project IDs

| ID | Project Name |
|----|--------------|
| `aviators-training-centre` | Aviators Training Centre |
| `barkat-enterprise` | Barkat Enterprise |
| `av-newsstream` | AV NewsStream |
| `foodah` | Foodah |
| `n8n-automation-suite` | Omni-Post AI Automation |
| `n8n-github-backup` | N8N GitHub Backup V5 |
| `portfolio-website` | AmanSuryavanshi.dev |

---

## Response Structure

### `core` (Always Included)
```json
{
  "name": "Aman Suryavanshi",
  "role": "AI Automation Engineer + Full-Stack Developer",
  "tagline": "Building Next.js apps with intelligent n8n automation backends",
  "socials": {
    "email": "amansurya.work@gmail.com",
    "resume": "/AmanSuryavanshi_Resume_Latest.pdf",
    "portfolio": "/projects"
  }
}
```

### `skills`
```json
{
  "mainTitle": "...",
  "subTitle": "...",
  "coreSpecialty": {
    "title": "...",
    "description": "...",
    "skills": [{ "name": "...", "details": "..." }],
    "impact": ["..."]
  },
  "categories": [{
    "id": "...",
    "title": "...",
    "description": "...",
    "groups": [{
      "title": "...",
      "items": [{ "label": "...", "value": "..." }]
    }]
  }],
  "proficiencySummary": "...",
  "currentlyLearning": "..."
}
```

### `experience`
```json
[{
  "role": "...",
  "type": "freelance|personal",
  "period": "...",
  "duration": "...",
  "achievements": ["..."],
  "keyProjects": [{ "title": "...", "url": "..." }]
}]
```

### `services`
```json
[{
  "id": "...",
  "title": "...",
  "subtitle": "...",
  "problem": "...",
  "solution": "...",
  "outcomes": ["..."],
  "tech": ["..."],
  "idealClient": "...",
  "relatedProjects": [{ "title": "...", "url": "..." }]
}]
```

### `about`
```json
{
  "title": "...",
  "intro": "...",
  "journey": "...",
  "philosophy": "...",
  "differentiators": ["..."],
  "personalInfo": {
    "name": "...",
    "title": "...",
    "description": "...",
    "email": "...",
    "education": "...",
    "address": "...",
    "languages": ["..."]
  },
  "qualifications": ["..."]
}
```

### `projects` (Summary Mode via `sections=projects`)
```json
[{
  "id": "aviators-training-centre",
  "title": "Aviators Training Centre",
  "shortDescription": "...",
  "techStack": ["Next.js 15", "TypeScript", "React 18", "Firebase", "Firestore"],
  "featured": true,
  "liveUrl": "https://..."
}]
```

### `projects` (Full Mode via `projects=id1,id2`)
```json
[{
  "id": "...",
  "title": "...",
  "tagLine": "...",
  "category": "featured|web",
  "type": "freelance|personal|automation",
  "shortDescription": "...",
  "description": "...",
  "challenge": "...",
  "solution": "...",
  "impact": ["..."],
  "technicalOverview": "...",
  "techStack": ["..."],
  "badges": ["..."],
  "imageUrl": "...",
  "liveUrl": "...",
  "codeUrl": "...",
  "blogUrl": "...",
  "featured": true,
  "metrics": { "revenue": "₹300,000+", "leads": "50+" },
  "documentation": [{ "title": "...", "url": "..." }],
  "gallery": [{ "src": "...", "alt": "...", "type": "image" }]
}]
```

---

## n8n HTTP Request Examples

### 1. Core Only (Minimal Tokens)
```
GET /api/portfolio
```

### 2. Bio Context for AI
```
GET /api/portfolio?sections=about,skills
```

### 3. All Project Summaries
```
GET /api/portfolio?sections=projects
```

### 4. Featured Projects Full Details
```
GET /api/portfolio?projects=aviators-training-centre,n8n-automation-suite,n8n-github-backup
```

### 5. Complete Profile
```
GET /api/portfolio?sections=skills,experience,services,about,projects
```

---

## n8n Node Setup

**HTTP Request Node:**
```
Method: GET
URL: https://www.amansuryavanshi.me/api/portfolio?sections=about,skills
```

**Access in Code Node:**
```javascript
const name = $json.core.name;
const role = $json.core.role;
const skills = $json.skills.coreSpecialty.skills;
const experience = $json.experience;
```

---

## CORS

Full CORS enabled for external access:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│            src/data/portfolio.tsx               │
│           (Single Source of Truth)              │
└─────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────────┐   ┌───────────────────┐
│ Website Components│   │ /api/portfolio    │
│ (Direct Import)   │   │ (HTTP Endpoint)   │
│                   │   │                   │
│ • Hero.tsx        │   │ • n8n workflows   │
│ • Projects.tsx    │   │ • External tools  │
│ • About.tsx       │   │ • Automations     │
└───────────────────┘   └───────────────────┘
```

---

## Data Source Files

| File | Purpose |
|------|---------|
| `src/data/portfolio.tsx` | Main data aggregator |
| `src/data/content/projects.ts` | Project details |
| `src/data/content/skills.ts` | Skills & tech stack |
| `src/data/content/experience.ts` | Work experience |
| `src/data/content/services.ts` | Service offerings |
| `src/data/content/about.ts` | Bio & personal info |

---

## Changelog

| Date | Change |
|------|--------|
| Jan 9, 2026 | Initial comprehensive documentation |

---

> **Note:** When adding new projects or modifying data, update `src/data/content/projects.ts` and the API will automatically reflect changes.
