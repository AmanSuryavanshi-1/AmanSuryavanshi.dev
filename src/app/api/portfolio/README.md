# Portfolio API

> **External-Only API** for automation tools and third-party integrations.

## Why This API Exists

This API endpoint was created specifically for **external systems** (like n8n workflows, automation tools, or third-party integrations) that need programmatic access to portfolio data.

### Important: Not Used by the Website

The portfolio website itself does **NOT** use this API. All website components import data directly from `src/data/portfolio.tsx` for:

- ✅ **Better performance** - No HTTP overhead
- ✅ **Type safety** - Full TypeScript support with interfaces
- ✅ **Build-time optimization** - Next.js can statically analyze direct imports
- ✅ **Simpler debugging** - No network layer to troubleshoot

### Primary Use Case: n8n Automation

The main consumer of this API is the **Omni-Post AI** n8n workflow, which:

1. Fetches personal context dynamically before generating content
2. Uses the `core` data for consistent author attribution
3. Pulls project details for relevant content references
4. Minimizes token usage by requesting only needed sections

---

## API Reference

### Endpoint

```
GET /api/portfolio
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `sections` | comma-separated | Sections to include: `core`, `skills`, `experience`, `services`, `about`, `projects` |
| `projects` | comma-separated | Specific project IDs to fetch full details for |

### Default Response (No Parameters)

Returns only `core` identity for minimal token usage:

```json
{
  "core": {
    "name": "Aman Suryavanshi",
    "role": "AI Automation Engineer + Full-Stack Developer",
    "tagline": "Building Next.js apps with intelligent n8n automation backends",
    "socials": {
      "email": "amansurya.work@gmail.com",
      "resume": "/AmanSuryavanshi_Resume_Latest.pdf",
      "portfolio": "/projects"
    }
  }
}
```

---

## Example Requests

### 1. Core Only (Default)
```bash
curl https://amansuryavanshi.me/api/portfolio
```

### 2. Multiple Sections
```bash
curl "https://amansuryavanshi.me/api/portfolio?sections=skills,experience,about"
```

### 3. Project Summaries
```bash
curl "https://amansuryavanshi.me/api/portfolio?sections=projects"
```

Returns lightweight summaries (id, title, shortDescription, top 5 tech):
```json
{
  "core": { ... },
  "projects": [
    {
      "id": "aviators-training-centre",
      "title": "Aviators Training Centre",
      "shortDescription": "Production-ready flight training platform...",
      "techStack": ["Next.js 15", "TypeScript", "React 18", "Firebase", "Firestore"],
      "featured": true,
      "liveUrl": "https://www.aviatorstrainingcentre.in"
    }
  ]
}
```

### 4. Full Project Details
```bash
curl "https://amansuryavanshi.me/api/portfolio?projects=aviators-training-centre,n8n-automation-suite"
```

Returns complete project data including description, challenge, solution, impact, gallery, etc.

---

## CORS Support

This API includes full CORS headers for external access:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

This allows n8n, Zapier, Make, or any automation tool to fetch data without CORS issues.

---

## n8n Integration Example

In your n8n HTTP Request node:

```
Method: GET
URL: https://amansuryavanshi.me/api/portfolio?sections=about,experience
```

Then access the data in subsequent nodes:
```javascript
// In a Code node
const name = $json.core.name;
const experience = $json.experience;
```

---

## Architecture Decision

```
┌─────────────────────────────────────────────────────────────┐
│                    portfolio.tsx                            │
│              (Single Source of Truth)                       │
└─────────────────────────────────────────────────────────────┘
                    │                          │
                    ▼                          ▼
    ┌───────────────────────────┐   ┌─────────────────────────┐
    │   Website Components      │   │   /api/portfolio        │
    │   (Direct Import)         │   │   (HTTP Endpoint)       │
    │                           │   │                         │
    │   • Hero.tsx              │   │   • n8n workflows       │
    │   • Projects.tsx          │   │   • External tools      │
    │   • About.tsx             │   │   • Third-party apps    │
    │   • Services.tsx          │   │                         │
    └───────────────────────────┘   └─────────────────────────┘
```

This pattern ensures:
- **Single source of truth** - All data lives in `portfolio.tsx`
- **Optimal internal performance** - Website uses direct imports
- **External accessibility** - API exposes data for automation
- **No duplication** - API reads from the same data source
