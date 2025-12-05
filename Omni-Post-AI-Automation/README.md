# 🚀 Omni-Post AI

### Intelligent Multi-Platform Content Distribution Engine

> **One idea → Three platforms → Zero manual work**

![Reliability](https://img.shields.io/badge/Reliability-99.7%25-brightgreen)
![Cost](https://img.shields.io/badge/Cost-%240%2Fmonth-blue)
![Speed](https://img.shields.io/badge/Speed-88s%20avg-orange)
![Executions](https://img.shields.io/badge/Executions-1000%2B-purple)

**Built by [Aman Suryavanshi](https://www.linkedin.com/in/aman-suryavanshi-6b0aba347/)** | AI Automation Developer

---

## 💡 What is Omni-Post AI?

A production-grade automation system that transforms a single Notion idea into platform-optimized content for **Twitter**, **LinkedIn**, and **Blog**—automatically.

```
📝 Write in Notion → 🤖 AI generates platform-specific content → ✅ Review & approve → 📤 Auto-publish everywhere
```

<p align="center">
  <img src="https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844303/Omni_post_Ai_autoamtion/omni_post_ai_assets/Part_1_Generation_Workflow.jpg" alt="Part 1: Content Generation Workflow in n8n" width="100%">
</p>
<p align="center"><em>Part 1: Complete Content Generation Pipeline (28 nodes) in n8n</em></p>

---

## 🎯 Quick Stats

| Metric | Value |
|--------|-------|
| **Architecture** | 74 nodes (28 generation + 46 distribution) |
| **Reliability** | 99.7% success rate |
| **Processing Time** | 88 seconds average |
| **Monthly Cost** | $0 (100% free-tier APIs) |
| **Time Saved** | 15-20 hours/month |
| **Engagement Boost** | +42% (Twitter), +100% time-on-page (Blog) |

---

## 📚 Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[Executive Summary](./OMNI-POST-AI-EXECUTIVE-SUMMARY.md)** | Business impact, architecture overview, key decisions | 10-15 min |
| **[Technical Documentation](./OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md)** | Deep dive: code, challenges, solutions | 30-45 min |
| **This README** | Quick overview & navigation | 5 min |

---

## 🔥 Key Features

### ✅ Zero Cost Operation
- 100% free-tier APIs (Gemini, Twitter, LinkedIn, Notion, Google Drive)
- Saves $1,320-6,000/year vs. commercial tools

### ✅ Production-Grade Reliability
- 99.7% success rate over 1000+ executions
- Multi-layer error handling with graceful degradation
- Session-based architecture prevents data conflicts

### ✅ Authentic Voice Preservation
- 100+ personalization parameters in XML-structured prompts
- Platform-specific tone adaptation
- Maintains technical depth across all platforms

### ✅ Smart Asset Management
- Handles LinkedIn's 1-image limit automatically
- Session-based file organization
- Zero cross-contamination in concurrent runs

---

## 🏗️ How It Works

### Part 1: Content Generation (28 nodes, ~64 sec)

```
Notion (Source)
    ↓
Content Extraction (hierarchical, 3-4 levels deep)
    ↓
AI Processing (Gemini 2.5 Pro + XML prompts)
    ↓
Platform-Specific Generation (Twitter threads, LinkedIn posts, Blog articles)
    ↓
Google Drive Storage (drafts for review)
    ↓
Notion Status Update → "Pending Approval"
```

### Part 2: Content Distribution (46 nodes, ~24 sec)

```
Notion (Approved Content)
    ↓
Asset Organization (session-based file matching)
    ↓
Platform-Specific Parsing (handles constraints)
    ↓
Multi-Platform Posting (concurrent execution)
    ↓
Status Tracking → "Posted" with all URLs
```

<p align="center">
  <img src="https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844306/Omni_post_Ai_autoamtion/omni_post_ai_assets/Part_2_Distribution_Workflow.jpg" alt="Part 2: Content Distribution Workflow in n8n" width="100%">
</p>
<p align="center"><em>Part 2: Complete Content Distribution Pipeline (46 nodes) in n8n</em></p>

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Automation** | n8n (self-hosted via Cloudflare Tunnel) |
| **AI/LLM** | Google Gemini 2.5 Pro, Perplexity Sonar |
| **Content Source** | Notion API (hierarchical block extraction) |
| **Storage** | Google Drive (session-based folders) |
| **Distribution** | Twitter API, LinkedIn API, Sanity CMS |
| **Authentication** | OAuth2 (all platforms) |

---

## 🧠 5 Technical Challenges Solved

| Challenge | Problem | Solution |
|-----------|---------|----------|
| **Multi-Platform Assets** | LinkedIn 1-image limit vs. unlimited elsewhere | 3-tier hierarchical decision engine |
| **Concurrent Execution** | File mixing when processing multiple items | Session-based architecture with unique IDs |
| **Hierarchical Content** | Notion's 3-4 level deep structure | Recursive tree traversal algorithm |
| **Platform Formatting** | Different requirements per platform | Dedicated parsers for each platform |
| **Error Handling** | 46 nodes × 5 APIs = many failure points | Multi-layer error handling + partial success |

---

## 📊 Results

### Content Quality Transformation

**Before (Manual):**
```
"Just built something cool with APIs. Pretty excited about it 🚀"
→ 60% engagement, generic, low credibility
```

**After (Omni-Post AI):**
```
"The N x M integration problem is a nightmare. Connecting 10 AI clients 
to 20 tools used to mean 200 custom builds. I've started using MCP, 
which is like USB-C for AI. It turns N*M into N+M..."
→ 85% engagement, specific, high credibility
```

### Performance Metrics

<p align="center">
  <img src="https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844298/Omni_post_Ai_autoamtion/omni_post_ai_assets/Asset_3_Metrics_Dashboard.jpg" alt="Metrics Dashboard" width="80%">
</p>

---

## 📸 Visual Documentation

### System Architecture

| Image | Description |
|-------|-------------|
| **Part 1 Workflow** | Complete 28-node content generation pipeline |
| **Part 2 Workflow** | Complete 46-node distribution pipeline |
| **Notion Schema** | Database structure for content lifecycle |
| **Session Files** | Concurrent execution file organization |
---

## 📁 Project Structure

```
Omni-Post-AI-Automation/
├── README.md                           # Quick overview (this file)
├── OMNI-POST-AI-EXECUTIVE-SUMMARY.md   # Business & architecture summary
├── OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md  # Full technical deep-dive
│
├── OMNI-POST-AI-Assets/                # Visual documentation
│   ├── Part_1_Generation_Workflow.png
│   ├── Part_2_Distribution_Workflow.png
│   ├── Asset_1_Timeline_Evolution.png
│   ├── Asset_3_Metrics_Dashboard.png
│   ├── Asset_4_Error_Handling_Architecture.png
│   ├── Asset_5_LLM_Routing.png
│   └── ... (11 professional diagrams)
│
└── Workflow JSON Files/
    ├── Part 1 - Content Generation.json
    └── Part 2 - Content Distribution.json
```

---

## 🎯 Who Should Read What?

### For Recruiters/Hiring Managers
1. Start with **[Executive Summary](./OMNI-POST-AI-EXECUTIVE-SUMMARY.md)**
2. Focus on: Problem Statement → Results → Skills Demonstrated
3. Time: 10-15 minutes

### For Developers
1. Start with **[Technical Documentation](./OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md)**
2. Focus on: Architecture → Technical Challenges → Code Solutions
3. Time: 30-45 minutes

### For AI/Automation Enthusiasts
1. Read both documents
2. Focus on: AI Strategy → Prompting Techniques → Free-Tier Optimization
3. Time: 45-60 minutes

---

## 🔗 Connect

| Platform | Link |
|----------|------|
| **Portfolio** | [amansuryavanshi-dev.vercel.app](https://amansuryavanshi-dev.vercel.app/) |
| **LinkedIn** | [linkedin.com/in/aman-suryavanshi-6b0aba347](https://www.linkedin.com/in/aman-suryavanshi-6b0aba347/) |
| **Twitter** | [@_AmanSurya](https://x.com/_AmanSurya) |
| **GitHub** | [github.com/AmanSuryavanshi-1](https://github.com/AmanSuryavanshi-1) |
| **N8N Workflows** | [github.com/AmanSuryavanshi-1/N8N](https://github.com/AmanSuryavanshi-1/N8N/tree/main/workflows) |

---

## 📝 License

This project is documented for educational and portfolio purposes. The automation workflows are proprietary.

---

<p align="center">
  <strong>Omni-Post AI</strong><br>
  Built in public. Engineered for production.<br><br>
  <em>Last Updated: November 14, 2025</em>
</p>
