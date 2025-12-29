# Quick Start Guide

> **Essential operations for maintaining and extending the portfolio website**

---

## 🚀 Common Tasks

### Adding a New Project

**Step 1: Add project data to `portfolio.tsx`**

```typescript
// src/data/portfolio.tsx - Add to rawProjects array

{
  id: "my-new-project",  // URL-friendly, lowercase, hyphens
  title: "My New Project",
  tagLine: "Short catchy description",
  category: "personal",  // featured | freelance | personal | automation
  type: "personal",
  shortDescription: "For card previews (2-3 sentences)",
  description: "Full project description...",
  challenge: "What problem does this solve?",
  solution: "How did you solve it?",
  impact: ["40% faster", "100+ users", "Zero downtime"],
  technicalOverview: "Deep dive into architecture...",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS"],  // Match TechIconMap keys
  badges: ["Full Stack", "Open Source"],
  imageUrl: "https://cdn.jsdelivr.net/gh/YourUsername/Repo@main/docs/assets/main.png",
  imageUrlFallback: "https://res.cloudinary.com/...",  // Optional backup
  videoYouTubeId: "dQw4w9WgXcQ",  // Optional
  liveUrl: "https://my-project.vercel.app",
  codeUrl: "https://github.com/YourUsername/Repo",
  featured: true,  // Show in homepage carousel
  metrics: {
    "Load Time": "1.2s",
    "Lighthouse": "98"
  },
  documentation: [
    { title: "Executive Summary", url: "/projects/my-project-executive-summary" },
    { title: "Technical Documentation", url: "/projects/my-project-technical-documentation" }
  ],
  gallery: [
    { src: "https://...", alt: "Screenshot 1", type: "image" }
  ]
}
```

**Step 2: Add tech icons (if new techs)**

```typescript
// src/data/portfolio.tsx - Add to TechIconMap

const TechIconMap: Record<string, React.ReactNode> = {
  "New Tech": <SiNewTech className="w-4 h-4" />,
  // ...
};
```

**Step 3: Set project order (if featured)**

```typescript
// src/components/home/FeaturedProjectsSection.tsx

const PROJECT_ORDER: Record<string, number> = {
  "my-new-project": 4,  // Add position
  // ...
};
```

**Step 4: Add documentation routes**

```typescript
// src/app/projects/[slug]/page.tsx

const DOCS_MAP: Record<string, string> = {
  'my-project-executive-summary': 'https://raw.githubusercontent.com/.../docs/executive-summary.md',
  'my-project-technical-documentation': 'https://raw.githubusercontent.com/.../docs/technical.md',
};

const DOC_TO_PROJECT_ID: Record<string, string> = {
  'my-project-executive-summary': 'my-new-project',
  'my-project-technical-documentation': 'my-new-project',
};

const TITLES_MAP: Record<string, string> = {
  'my-project-executive-summary': 'My New Project - Executive Summary',
  'my-project-technical-documentation': 'My New Project - Technical Documentation',
};
```

---

### Adding a Blog Post

1. **Navigate to Sanity Studio**: `/studio`
2. **Create new Post**
3. **Fill required fields**:
   - Title
   - Slug (auto-generated)
   - Body (rich text)
   - Status: "published"
4. **Optional but recommended**:
   - Main Image (1200x630 for OG)
   - Excerpt (for SEO, max 160 chars)
   - Tags (create new or select existing)
   - Author (select or create)
5. **Publish**

---

### Updating Project Images

**Option 1: JSDelivr CDN (Recommended)**
```
https://cdn.jsdelivr.net/gh/{username}/{repo}@main/{path}
```

1. Add images to project repo (e.g., `/docs/assets/`)
2. Push to main branch
3. Update `imageUrl` in `portfolio.tsx`
4. Cache invalidates automatically

**Option 2: Cloudinary (Fallback)**
```
https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/{path}
```

---

### Adding New Fallback Image Category

```typescript
// src/lib/fallback-image-manager.ts

// 1. Add to FallbackCategory type
export type FallbackCategory = 'code' | 'dashboard' | 'mobile' | 'server' | 'workflow' | 'ai' | 'default';

// 2. Add to fallbackImages array
private static readonly fallbackImages: FallbackImage[] = [
  // ...existing,
  {
    filename: 'fallback-ai.svg',
    alt: 'AI/ML fallback image',
    path: '/fallbacks/fallback-ai.svg'
  }
];

// 3. Add to categoryMap
private static readonly categoryMap: Record<FallbackCategory, string> = {
  // ...existing,
  ai: 'fallback-ai.svg',
};

// 4. Add keywords for inference
private static readonly categoryKeywords: Record<FallbackCategory, string[]> = {
  // ...existing,
  ai: ['ai', 'ml', 'machine learning', 'neural', 'gpt', 'llm', 'langchain'],
};
```

5. Add SVG file to `/public/fallbacks/fallback-ai.svg`

---

### Modifying Contact Form

**Add new field**:

```typescript
// src/app/api/contact/route.ts

// 1. Update Zod schema
const contactSchema = z.object({
  from_name: z.string().min(2),
  reply_to: z.string().email(),
  message: z.string().min(1),
  company: z.string().optional(),  // New field
});

// 2. Use in email template
const { from_name, reply_to, message, company } = result.data;
```

```tsx
// src/components/contact.tsx

// Add form field
<input name="company" placeholder="Company (optional)" />
```

---

### Adding New Sanity Content Type

```typescript
// src/sanity/schemaTypes/newType.ts

import { defineType, defineField } from 'sanity';

export const newType = defineType({
  name: 'newType',
  title: 'New Type',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    // ... more fields
  ],
});
```

```typescript
// src/sanity/schemaTypes/index.ts

import { newType } from './newType';

export const schemaTypes = [
  // ...existing,
  newType,
];
```

---

## 🔧 Development Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 📁 File Locations Cheat Sheet

| Task | File |
|------|------|
| Add/edit projects | `src/data/portfolio.tsx` |
| Add project docs route | `src/app/projects/[slug]/page.tsx` |
| Change homepage layout | `src/app/page.tsx` |
| Edit blog styling | `src/app/blogs/[slug]/page.tsx` |
| Modify markdown rendering | `src/components/docs/MarkdownViewer.tsx` |
| Edit Portable Text (blog) | `src/components/sanity/PortableTextComponents.tsx` |
| Add fallback images | `src/lib/fallback-image-manager.ts` + `/public/fallbacks/` |
| Modify contact logic | `src/app/api/contact/route.ts` |
| Change global SEO | `src/app/layout.tsx` |
| Add Sanity content types | `src/sanity/schemaTypes/` |
| Edit email templates | `src/lib/email-templates.ts` |

---

## 🌐 Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | ✅ |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (production) | ✅ |
| `NEXT_PUBLIC_SANITY_API_WRITE_TOKEN` | For view count updates | ✅ |
| `RESEND_API_KEY` | Email sending | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL | ✅ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics | Optional |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Search Console | Optional |

---

## 🧪 Testing Checklist

### Before Deployment

- [ ] All pages load without errors
- [ ] Blog posts render correctly
- [ ] Project documentation links work
- [ ] Contact form sends emails
- [ ] Images load with fallbacks working
- [ ] YouTube embeds play
- [ ] Mobile responsive
- [ ] Lighthouse score > 90

### After Adding New Project

- [ ] Shows in homepage carousel
- [ ] Card appears on /projects page
- [ ] Documentation pages load
- [ ] Images display correctly
- [ ] Video walkthrough works (if applicable)
- [ ] Tech icons render
- [ ] Links (Live Demo, GitHub, etc.) work

---

## 🔗 Useful Links

- **Local Dev**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio
- **Production**: https://amansuryavanshi.me
- **Sanity Dashboard**: https://manage.sanity.io
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev

---

*For detailed documentation, see:*
- [PORTFOLIO-DOCUMENTATION.md](./PORTFOLIO-DOCUMENTATION.md) - Full architecture
- [DATA-FLOW-REFERENCE.md](./DATA-FLOW-REFERENCE.md) - Data flow diagrams
- [COMPONENT-REFERENCE.md](./COMPONENT-REFERENCE.md) - Component API reference
