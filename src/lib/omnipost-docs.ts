import fs from 'fs';
import path from 'path';

export interface OmniPostDoc {
  id: string;
  title: string;
  filename: string;
  seoDescription: string;
}

export const omniPostDocs: OmniPostDoc[] = [
  {
    id: '01-executive-summary',
    title: '01. Executive Summary',
    filename: '01-Executive-Summary.md',
    seoDescription: 'Discover Aman Suryavanshi\'s OmniPost AI: A revolutionary Agentic AI system using n8n & Next.js 15 to fully automate B2B content creation at scale.'
  },
  {
    id: '02-architecture-and-flow',
    title: '02. Architecture and Flow',
    filename: '02-Architecture-and-Flow.md',
    seoDescription: 'Explore the high-level architecture of OmniPost AI. Learn how n8n workflows and Agentic AI orchestrate multi-platform distribution and Next.js APIs.'
  },
  {
    id: '03-prompt-engineering',
    title: '03. Prompt Engineering',
    filename: '03-Prompt-Engineering.md',
    seoDescription: 'Deep dive into advanced Agentic AI prompt engineering for n8n. Learn how OmniPost AI generates engaging, SEO-optimized B2B content automatically.'
  },
  {
    id: '04-platform-integrations',
    title: '04. Platform Integrations',
    filename: '04-Platform-Integrations.md',
    seoDescription: 'Seamless multi-platform integrations in OmniPost AI. Discover how n8n automates distribution to LinkedIn, Twitter, and Next.js App Router portfolios.'
  },
  {
    id: '05-developer-journal',
    title: '05. Developer Journal',
    filename: '05-Developer-Journal.md',
    seoDescription: 'Aman Suryavanshi\'s technical diary on building OmniPost AI. Insights into Agentic AI development, overcoming n8n challenges, and Next.js optimizations.'
  },
  {
    id: '06-api-and-infrastructure',
    title: '06. API and Infrastructure',
    filename: '06-API-and-Infrastructure.md',
    seoDescription: 'Robust serverless Next.js API & infrastructure powering OmniPost AI. Learn how we scale n8n Agentic AI workflows for enterprise-grade automation.'
  },
  {
    id: '07-sanity-portfolio-integration-architecture',
    title: '07. Sanity Portfolio Integration Architecture',
    filename: '07-Sanity-Portfolio-Integration-Architecture.md',
    seoDescription: 'Mastering headless CMS integration: How OmniPost AI syncs Agentic AI-generated content directly into a Sanity backend and Next.js 15 portfolio.'
  },
  {
    id: '08-obsidian-mcp-setup-guide',
    title: '08. Obsidian MCP Setup Guide',
    filename: '08-Obsidian-MCP-Setup-Guide.md',
    seoDescription: 'Connect Second Brains to Agentic AI: The complete Model Context Protocol (MCP) setup guide linking Obsidian knowledge bases with n8n and OmniPost AI.'
  },
  {
    id: '09-notion-database-schema',
    title: '09. Notion Database Schema',
    filename: '09-Notion-Database-Schema.md',
    seoDescription: 'Inside the content engine: Explore the advanced Notion Database schema that acts as the command center for OmniPost AI\'s n8n Agentic workflows.'
  },
  {
    id: '10-ai-model-routing-and-settings',
    title: '10. AI Model Routing and Settings',
    filename: '10-AI-Model-Routing-and-Settings.md',
    seoDescription: 'Optimizing LLM costs and performance in OmniPost AI. Learn intelligent AI model routing strategies in n8n for cost-effective Agentic AI automation.'
  },
  {
    id: '11-linkedin-carousel-implementation',
    title: '11. LinkedIn Carousel Implementation',
    filename: '11-LinkedIn-Carousel-Implementation.md',
    seoDescription: 'Automating visual B2B content: How OmniPost AI and n8n dynamically generate and publish high-converting PDF LinkedIn Carousels autonomously.'
  },
  {
    id: '12-portfolio-api-reference',
    title: '12. Portfolio API Reference',
    filename: '12-Portfolio-API-Reference.md',
    seoDescription: 'Complete API reference for Aman Suryavanshi\'s OmniPost Next.js system. Secure endpoints connecting Agentic AI and n8n to frontend digital experiences.'
  }
];

export function getOmniPostDoc(id: string): { content: string; meta: OmniPostDoc } | null {
  const doc = omniPostDocs.find((d) => d.id === id);
  if (!doc) return null;

  try {
    const filePath = path.join(process.cwd(), 'Omni-Post-AI-Automation', doc.filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return { content, meta: doc };
  } catch (error) {
    console.error(`Error reading OmniPost doc ${doc.filename}:`, error);
    return null;
  }
}

export function generateArticleJsonLd(doc: OmniPostDoc) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: doc.title,
    description: doc.seoDescription,
    author: {
      '@type': 'Person',
      name: 'Aman Suryavanshi',
      url: 'https://amansuryavanshi.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aman Suryavanshi',
      logo: {
        '@type': 'ImageObject',
        url: 'https://amansuryavanshi.dev/Profile/Logo.webp'
      }
    },
    // We assume the route to view these docs will be /docs/omnipost/[id] or similar.
    // The exact URL can be adjusted by the page utilizing this JSON-LD.
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://amansuryavanshi.dev/docs/${doc.id}`
    },
    keywords: 'n8n, AI Automation, Next.js, Agentic AI, OmniPost',
  };
}
