# 12. Portfolio API Reference

> **Last Updated:** May 2026  
> **Purpose:** External API for n8n workflows acting as the foundational context layer for Omni-Post AI

---

## Overview & Relationship to Omni-Post AI

While Omni-Post AI's primary intelligence layer relies on the **Obsidian MCP Local Overlay** (fetching deep, private, real-time context from local markdown files), it requires a highly reliable fallback mechanism when running in cloud environments or when the local PC is offline.

The **Portfolio API** serves as this canonical fallback. It is a stateless, edge-cached REST API hosted directly on the `AmanSuryavanshi.dev` Next.js portfolio. The Omni-Post AI `Context - Fetch Portfolio` HTTP node pings this API on every execution.

If the Obsidian MCP fails to respond, the AI Strategist agents seamlessly fall back to using this JSON payload as their primary understanding of Aman's skills, experience, and current service offerings.

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
Returns the `coreSpecialty` (impact, detailed skills) and `categories` (tech stack groupings like Frontend, Backend, AI).

### `experience`
Returns freelance and personal project history, including role, duration, achievements, and key projects.

### `services`
Returns the specific service offerings (e.g., AI Automation, Custom Web Apps) including the problem solved, ideal client, and outcomes.

### `projects` (Summary vs Full Mode)
- `?sections=projects` returns a lightweight array of summaries (ID, Title, Top 5 Tech Stack).
- `?projects=id1,id2` returns the massive, deep-dive JSON for specific projects including challenges, solutions, metrics, and architecture documentation links.

---

## Omni-Post n8n Implementation

**HTTP Request Node Configuration:**
```
Method: GET
URL: https://www.amansuryavanshi.me/api/portfolio?sections=about,skills,experience,services,projects
```

**Context Merge Logic in n8n:**
In the `Code – Personal Context Builder` node, the system prioritizes Obsidian MCP data but maps the Portfolio API data into a strict `personalContext` object.

```javascript
const name = $json.core.name;
const role = $json.core.role;
const skills = $json.skills.coreSpecialty.skills;
const experience = $json.experience;
// Passed directly to the Gemini AI Content Strategist Prompt
```

---

## API Architecture (AmanSuryavanshi.dev)

The API is deployed as a Next.js App Router API Endpoint (`src/app/api/portfolio/route.ts`).

```text
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
│ • Hero.tsx        │   │ • Omni-Post AI    │
│ • Projects.tsx    │   │                   │
└───────────────────┘   └───────────────────┘
```

### CORS Security
Full CORS is enabled specifically to allow external serverless workflows (like n8n) to fetch the data securely without origin blocks.

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```