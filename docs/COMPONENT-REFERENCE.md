# Component Reference Guide

> **Quick reference for all React components in the portfolio website**

---

## Table of Contents

1. [Page Components](#page-components)
2. [Section Components](#section-components)
3. [Project Components](#project-components)
4. [Blog Components](#blog-components)
5. [Documentation Components](#documentation-components)
6. [UI Components](#ui-components)
7. [Context Providers](#context-providers)

---

## Page Components

### `src/app/page.tsx` - Homepage

**Type**: Server Component

**Purpose**: Composes all homepage sections

**Data Dependencies**:
```typescript
import { portfolioData } from '@/data/portfolio';
```

**Rendered Sections** (in order):
1. `<Hero/>`
2. `<FeaturedProjectsSection/>`
3. `<WorkBanner/>`
4. `<AboutMe/>`
5. `<MySkills/>`
6. `<ExperienceCards/>`
7. `<Services/>`
8. `<Contact/>`

---

### `src/app/blogs/[slug]/page.tsx` - Blog Post Page

**Type**: Server Component (async)

**Purpose**: Renders individual blog posts from Sanity CMS

**Data Fetching**:
```typescript
const post = await getPost(slug);           // From Sanity
const relatedPosts = await client.fetch(...); // Posts with shared tags
```

**Key Features**:
- Dynamic SEO metadata via `generateMetadata()`
- Reading progress bar
- Table of contents
- Floating share actions
- Related posts section

---

### `src/app/projects/[slug]/page.tsx` - Project Documentation Page

**Type**: Server Component (async)

**Purpose**: Renders markdown documentation from GitHub

**Data Fetching**:
```typescript
const content = await getDocContent(slug);  // Markdown from GitHub raw URL
const project = portfolioData.projects.find(p => p.id === projectId);
```

**Configuration Maps**:
- `DOCS_MAP`: slug → GitHub raw URL
- `DOC_TO_PROJECT_ID`: slug → portfolioData project ID
- `TITLES_MAP`: slug → display title

---

## Section Components

### `<Hero/>`
**Location**: `src/components/hero/Hero.tsx`

**Type**: Client Component

**Purpose**: Landing hero section with animated elements

**Features**:
- Animated text reveal
- Profile image
- CTA buttons
- Scroll indicator

---

### `<FeaturedProjectsSection/>`
**Location**: `src/components/home/FeaturedProjectsSection.tsx`

**Type**: Client Component

**Purpose**: Project carousel on homepage

**State**:
```typescript
const [virtualIndex, setVirtualIndex] = useState(projects.length * 100);
const activeIndex = ((virtualIndex % projects.length) + projects.length) % projects.length;
```

**Child Components**:
- `<FeaturedHero/>` - Full-width project display
- `<SolidButton/>` - "View All Projects"
- `<TransparentButton/>` - "Let's Work Together"

**Sorting**:
```typescript
const PROJECT_ORDER: Record<string, number> = {
  "aviators-training-centre": 1,
  "n8n-automation-suite": 2,
  "barkat-enterprise": 3,
  // ...
};
```

---

### `<WorkBanner/>`
**Location**: `src/components/WorkBanner.tsx`

**Type**: Client Component

**Purpose**: Infinite scrolling skills/roles banner

**Data**: `portfolioData.workBanner[]`

---

### `<AboutMe/>`
**Location**: `src/components/about/AboutMe.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  personalInfo: PersonalInfo;
  qualificationsData: QualificationsData;
}
```

**Features**:
- Personal bio
- Qualifications tabs
- Education/experience timeline

---

### `<MySkills/>`
**Location**: `src/components/skills/MySkills.tsx`

**Type**: Client Component

**Data**: `skillsData`, `landingSkillsData`

**Features**:
- Skill categories accordion
- Proficiency indicators
- Core specialty highlight

---

### `<ExperienceCards/>`
**Location**: `src/components/ExperienceCards.tsx`

**Type**: Client Component

**Data**: `experienceData[]`

**Features**:
- Timeline layout
- Company/role details
- Expandable descriptions

---

### `<Services/>`
**Location**: `src/components/services/services.tsx`

**Type**: Client Component

**Data**: `servicesData[]`

**Features**:
- Service cards
- Problem/solution format
- Related projects list

---

### `<Contact/>`
**Location**: `src/components/contact.tsx`

**Type**: Client Component

**API Integration**:
```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify({ from_name, reply_to, message })
});
```

**Features**:
- Form validation
- Loading states
- Success/error feedback

---

## Project Components

### `<FeaturedHero/>`
**Location**: `src/components/projects/FeaturedHero.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  projects: Project[];
  activeIndex: number;
  virtualIndex: number;
  onVirtualIndexChange: (index: number) => void;
  className?: string;
}
```

**Features**:
- Full-width project showcase
- YouTube video embed (if available)
- Project image with fallback
- Tech stack badges
- CTA buttons (Live Demo, GitHub, Docs)
- Swipe/keyboard navigation

---

### `<FeaturedCarousel/>`
**Location**: `src/components/projects/FeaturedCarousel.tsx`

**Type**: Client Component

**Purpose**: Thumbnail navigation for featured projects

**Features**:
- Horizontal scroll
- Active indicator
- Click to select

---

### `<ProjectCard/>`
**Location**: `src/components/projects/ProjectCard.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  project: Project;
  index?: number;
}
```

**Features**:
- Hover effects
- Image with fallback
- Tech stack icons
- Quick links

---

### `<ProjectMediaCarousel/>`
**Location**: `src/components/projects/ProjectMediaCarousel.tsx`

**Type**: Client Component

**Purpose**: Gallery viewer for project images/videos

**Features**:
- Modal display
- Image zoom
- Video playback
- Keyboard navigation

---

## Blog Components

### `<BlogHeaderImage/>`
**Location**: `src/components/blog/BlogHeaderImage.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  post: Post;
  priority?: boolean;
}
```

**Image Resolution Order**:
1. `post.mainImage` (from Sanity)
2. First image extracted from `post.body`
3. `FallbackImageManager.getContextualFallback()`

---

### `<TableOfContents/>`
**Location**: `src/components/blog/TableOfContents.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  readTime: number;
}
```

**Features**:
- Auto-generates from DOM (h1, h2, h3)
- Scroll spy highlighting
- Smooth scroll on click
- Sticky positioning

---

### `<FloatingActions/>`
**Location**: `src/components/blog/FloatingActions.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  title: string;
  slug: string;
}
```

**Features**:
- Copy link
- Share to Twitter
- Share to LinkedIn
- Bookmark (local storage)

---

### `<MobileActionBar/>`
**Location**: `src/components/blog/MobileActionBar.tsx`

**Type**: Client Component

**Purpose**: Fixed bottom action bar for mobile

---

### `<RelatedPosts/>`
**Location**: `src/components/blog/RelatedPosts.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  posts: RelatedPost[];
}
```

**Features**:
- Card grid
- Matched by shared tags
- Max 3 posts

---

### `<ShareBar/>`
**Location**: `src/components/blog/ShareBar.tsx`

**Type**: Client Component

**Purpose**: Horizontal share buttons at article end

---

### `<AllTags/>`
**Location**: `src/components/blog/AllTags.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  tags: Tag[];
}
```

**Features**:
- Tag pills with colors
- Links to tag pages

---

### `<ReadingProgress/>`
**Location**: `src/components/blog/ReadingProgress.tsx`

**Type**: Client Component

**Purpose**: Horizontal progress bar at top of page

---

### `<Breadcrumbs/>`
**Location**: `src/components/blog/Breadcrumbs.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  items: { label: string; href?: string }[];
}
```

---

### `<BlogImageGalleryWrapper/>`
**Location**: `src/components/blog/BlogImageGalleryWrapper.tsx`

**Type**: Client Component

**Purpose**: Wraps blog content with `<ImageGalleryProvider/>` and `<Lightbox/>`

---

### `<ZoomableBlogImage/>`
**Location**: `src/components/blog/ZoomableBlogImage.tsx`

**Type**: Client Component

**Purpose**: Clickable image that opens in lightbox

---

## Documentation Components

### `<DocPageClient/>`
**Location**: `src/components/docs/DocPageClient.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  project: Project;
  content: string;  // Markdown
  slug: string;
}
```

**Features**:
- Hero header with project image
- Metadata (reading time, category)
- Tech stack sidebar
- YouTube walkthrough (if available)
- Auto-generated TOC
- Navigation to related docs
- Mobile TOC drawer

**Header Image Resolution**:
```typescript
const getHeaderImage = () => {
  if (project?.imageUrl) return project.imageUrl;
  if (project?.image) return project.image;
  // Extract from markdown...
  return FallbackImageManager.getContextualFallback(context);
};
```

**Documentation Navigation Logic**:
```typescript
// If on technical doc, link to executive summary (if exists)
// If on executive summary, link to technical doc (if exists)
// If no alternate exists, show "View More Projects"
```

---

### `<MarkdownViewer/>`
**Location**: `src/components/docs/MarkdownViewer.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  content: string;
}
```

**Libraries**:
- `react-markdown` - Markdown parsing
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-raw` - HTML in markdown
- `react-syntax-highlighter` - Code highlighting

**Custom Components** (override default markdown rendering):

| Element | Custom Behavior |
|---------|-----------------|
| `h1-h6` | Auto-generated IDs, custom styling |
| `img` | Fallback support, lightbox registration |
| `code` | Syntax highlighting with copy button |
| `a` | External link icon, target="_blank" |
| `table` | Responsive wrapper, styled cells |
| `blockquote` | Callout styling |

---

## UI Components

### `<YouTubeEmbed/>`
**Location**: `src/components/ui/YouTubeEmbed.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  videoId: string;
  title?: string;
  autoplay?: boolean;      // Default: true
  muted?: boolean;         // Default: true
  loop?: boolean;          // Default: true
  controls?: boolean;      // Default: false
  autoplayOnViewport?: boolean; // Default: true
  poster?: string;
  interactive?: boolean;   // Default: false (background mode)
}
```

**Features**:
- Lazy loading on viewport
- Poster overlay until video plays
- Object-cover scaling (hides letterbox)
- Privacy: uses `youtube-nocookie.com`

---

### `<Lightbox/>`
**Location**: `src/components/ui/Lightbox.tsx`

**Type**: Client Component

**Purpose**: Full-screen image viewer modal

**Features**:
- Zoom controls
- Keyboard navigation
- Touch gestures
- Close on backdrop click

---

### `<Skeleton/>`
**Location**: `src/components/ui/Skeleton.tsx`

**Type**: Server/Client Component

**Purpose**: Loading placeholder

**Usage**:
```tsx
<Skeleton className="h-48 w-full" />
```

---

### `<SolidButton/>`
**Location**: `src/components/solid-button.tsx`

**Type**: Client Component

**Props**:
```typescript
interface Props {
  href: string;
  icon: LucideIcon;
  label: string;
}
```

---

### `<TransparentButton/>`
**Location**: `src/components/transparent-button.tsx`

**Type**: Client Component

**Props**: Same as SolidButton

---

## Context Providers

### `<ImageGalleryProvider/>`
**Location**: `src/context/ImageGalleryContext.tsx`

**Purpose**: Global state for lightbox functionality

**State**:
```typescript
interface ImageGalleryContextType {
  images: GalleryImage[];
  isOpen: boolean;
  currentIndex: number;
  registerImage: (image: GalleryImage) => void;
  openGallery: (index: number) => void;
  closeGallery: () => void;
  nextImage: () => void;
  prevImage: () => void;
}
```

**Usage**:
```tsx
// In parent
<ImageGalleryProvider>
  <BlogContent />
  <Lightbox />
</ImageGalleryProvider>

// In image component
const { registerImage, openGallery } = useImageGallery();
useEffect(() => {
  registerImage({ src, alt });
}, []);
```

---

## Component Import Map

| Component | Import Path |
|-----------|-------------|
| `Hero` | `@/components/hero/Hero` |
| `AboutMe` | `@/components/about/AboutMe` |
| `MySkills` | `@/components/skills/MySkills` |
| `FeaturedProjectsSection` | `@/components/home/FeaturedProjectsSection` |
| `FeaturedHero` | `@/components/projects/FeaturedHero` |
| `ProjectCard` | `@/components/projects/ProjectCard` |
| `Services` | `@/components/services/services` |
| `Contact` | `@/components/contact` |
| `DocPageClient` | `@/components/docs/DocPageClient` |
| `MarkdownViewer` | `@/components/docs/MarkdownViewer` |
| `YouTubeEmbed` | `@/components/ui/YouTubeEmbed` |
| `Lightbox` | `@/components/ui/Lightbox` |
| `PortableText` | `@portabletext/react` |
| `portableTextComponents` | `@/components/sanity/PortableTextComponents` |

---

*For data flow diagrams, see [DATA-FLOW-REFERENCE.md](./DATA-FLOW-REFERENCE.md)*
*For detailed architecture, see [PORTFOLIO-DOCUMENTATION.md](./PORTFOLIO-DOCUMENTATION.md)*
