# AmanSuryavanshi.dev
## Personal Portfolio & Blog Platform

> **A modern, full-stack portfolio website with integrated blog and AI-powered content automation**

**Live Site**: [amansuryavanshi.me](https://amansuryavanshi-dev.vercel.app/)  
**Author**: Aman Suryavanshi  
**Tech Stack**: Next.js 15, TypeScript, Sanity CMS, Tailwind CSS, n8n Automation

---

## 🚀 Overview

This is a production-ready portfolio website featuring:
- **Modern Portfolio**: Showcasing projects, skills, and experience
- **Integrated Blog**: Powered by Sanity CMS with rich content support
- **AI Content Automation**: Omni-Post AI system for multi-platform content distribution
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Meta tags, Open Graph, and Google Analytics integration
- **Type-Safe**: Full TypeScript implementation with strict mode

---

## 📁 Project Structure

```
amansuryavanshi.dev/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── page.tsx                  # Homepage
│   │   ├── blogs/                    # Blog section
│   │   │   ├── page.tsx              # Blog listing page
│   │   │   └── [slug]/               # Individual blog posts
│   │   ├── learn-more-about-me/      # About page
│   │   ├── studio/                   # Sanity Studio (CMS)
│   │   └── api/                      # API routes
│   │
│   ├── components/                   # React Components
│   │   ├── hero/                     # Hero section components
│   │   ├── about/                    # About section components
│   │   ├── projects/                 # Projects showcase
│   │   ├── skills/                   # Skills display
│   │   ├── services/                 # Services offered
│   │   ├── blog/                     # Blog components
│   │   ├── sanity/                   # Sanity-specific components
│   │   │   └── PortableTextComponents.tsx
│   │   └── ui/                       # Reusable UI components
│   │
│   ├── lib/                          # Utility Functions
│   │   ├── asset-extraction.ts       # Blog asset extraction
│   │   ├── fallback-image-manager.ts # Fallback image handling
│   │   ├── blog-logger.ts            # Blog logging utilities
│   │   ├── metadata-utils.ts         # SEO metadata generation
│   │   └── utils.ts                  # General utilities
│   │
│   └── sanity/                       # Sanity CMS Configuration
│       ├── lib/                      # Sanity client & utilities
│       ├── schemaTypes/              # Content schemas
│       └── structure.ts              # Studio structure
│
├── public/                           # Static Assets
│   ├── images/                       # Image assets
│   ├── icons/                        # Icon files
│   └── Blog_header_fallback_*.jpg    # Blog fallback images
│
├── Omni-Post-AI-Automation/          # AI Content Distribution System
│   ├── README.md                     # Omni-Post AI documentation
│   ├── OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md
│   ├── OMNI-POST-AI-EXECUTIVE-SUMMARY.md
│   ├── BIP_Assets/                   # 11 professional diagrams
│   └── Workflow Files/               # n8n automation workflows
│       ├── Part 1 - Content Generation.json
│       └── Part 2 - Content Distribution.json
│
├── Configuration Files
│   ├── next.config.ts                # Next.js configuration
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── sanity.config.ts              # Sanity CMS config
│   ├── tsconfig.json                 # TypeScript config
│   ├── jest.config.ts                # Jest testing config
│   └── .env.local                    # Environment variables
│
└── Documentation
    ├── README.md                     # This file
    ├── N8N_BLOG_AUTOMATION_GUIDE.md  # Blog automation guide
    └── .env.example                  # Environment variables template
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend & CMS
- **CMS**: Sanity.io (headless CMS)
- **Content**: Portable Text (rich text format)
- **Image Optimization**: Next.js Image + Sanity CDN
- **API**: Next.js API Routes

### Automation & AI
- **Automation Platform**: n8n (self-hosted)
- **AI Models**: Google Gemini 2.5 Pro, Perplexity Sonar
- **Content Source**: Notion API
- **Storage**: Google Drive
- **Distribution**: Twitter/X API, LinkedIn API, Sanity API

### Development & Testing
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

### Deployment & Analytics
- **Hosting**: Vercel
- **Analytics**: Google Analytics 4
- **Email**: EmailJS
- **Domain**: Custom domain with SSL

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Sanity account (free tier)
- Environment variables (see `.env.example`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmanSuryavanshi-1/amansuryavanshi.dev.git
   cd amansuryavanshi.dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then add your actual values to `.env.local`:
   ```env
   # Sanity CMS Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2023-10-01
   NEXT_PUBLIC_SANITY_API_WRITE_TOKEN=your_write_token
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # Google Services
   NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
   
   # EmailJS Configuration
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to see the site.

5. **Access Sanity Studio** (CMS)
   ```bash
   # Studio is available at:
   http://localhost:3000/studio
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 📊 Key Features

### 1. Blog System
- **Sanity CMS Integration**: Headless CMS for content management
- **Rich Content**: Portable Text with code blocks, images, embeds
- **SEO Optimized**: Dynamic meta tags, Open Graph images
- **Responsive Images**: Automatic optimization and lazy loading
- **Fallback System**: 4 fallback header images for posts without images
- **Asset Extraction**: Automatically uses first image as header if no main image

### 2. Omni-Post AI Automation
- **Multi-Platform Distribution**: Twitter, LinkedIn, Blog
- **AI-Powered**: Gemini 2.5 Pro for content generation
- **99.7% Reliability**: 1000+ successful executions
- **Zero Cost**: 100% free-tier APIs
- **88-Second Processing**: End-to-end automation
- **Session-Based**: Concurrent execution safety

See [Omni-Post-AI-Automation/README.md](./Omni-Post-AI-Automation/README.md) for complete documentation.

### 3. Portfolio Sections
- **Hero**: Dynamic introduction with call-to-action
- **About**: Personal background and journey
- **Projects**: Showcase of key projects with links
- **Skills**: Technical skills with proficiency levels
- **Services**: Services offered with descriptions
- **Experience**: Work experience timeline
- **Contact**: EmailJS integration for contact form

### 4. Performance & SEO
- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized LCP, FID, CLS
- **Meta Tags**: Dynamic SEO metadata
- **Sitemap**: Automatic sitemap generation
- **Analytics**: Google Analytics 4 integration

---

## 🔧 Development

### Project Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler

# Testing
npm test                 # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Environment Variables

See `.env.example` for all required environment variables. **Never commit `.env.local` to version control.**

### Adding New Blog Posts

1. Go to [http://localhost:3000/studio](http://localhost:3000/studio)
2. Create a new "Post" document
3. Add title, content, images, and metadata
4. Publish the post
5. View at `/blogs/[slug]`

### Customization

- **Colors**: Edit `tailwind.config.ts`
- **Fonts**: Modify `src/app/layout.tsx`
- **Components**: Add to `src/components/`
- **Content Schema**: Edit `src/sanity/schemaTypes/`

---

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AmanSuryavanshi-1/amansuryavanshi.dev)

### Manual Deployment

```bash
npm run build
npm start
```

---

## 🤖 Omni-Post AI Integration

This portfolio includes **Omni-Post AI**, a production-grade content automation system:

### Quick Overview
- **Purpose**: Automate content distribution across Twitter, LinkedIn, and Blog
- **Architecture**: 74-node n8n workflow (28 generation + 46 distribution)
- **Reliability**: 99.7% success rate over 1000+ executions
- **Cost**: $0/month (100% free-tier APIs)
- **Processing Time**: 88 seconds average

### How It Works
1. Write ideas in Notion
2. AI generates platform-specific content
3. Review drafts in Google Drive
4. Automatically posts to all platforms

### Documentation
- **Quick Start**: [Omni-Post-AI-Automation/README.md](./Omni-Post-AI-Automation/README.md)
- **Technical Deep Dive**: [OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md](./Omni-Post-AI-Automation/OMNI-POST-AI-TECHNICAL-DOCUMENTATION.md)
- **Executive Summary**: [OMNI-POST-AI-EXECUTIVE-SUMMARY.md](./Omni-Post-AI-Automation/OMNI-POST-AI-EXECUTIVE-SUMMARY.md)

---

## 📝 Blog Content Enhancement

The blog system includes intelligent features:

### Features
- **Automatic Header Image Selection**: Uses main image → first asset → fallback
- **Fallback Images**: 4 professional fallback header images for posts without images
- **Consistent Heading Styles**: Normalized typography across all posts
- **Responsive Image Sizing**: Automatic optimization for all screen sizes
- **Asset Extraction**: Intelligent extraction from blog content

---

## 🔒 Security

- **Environment Variables**: Never commit `.env.local` - use `.env.example` as template
- **API Keys**: Always use environment variables, never hardcode credentials
- **Content Security Policy**: Configured in `next.config.ts`
- **HTTPS**: Enforced in production
- **Input Validation**: All user inputs are sanitized
- **Sanity Tokens**: Write tokens should be kept secure and rotated regularly

---

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API route and data flow tests
- **Coverage Target**: 80%+ code coverage

### Running Tests
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report
```

---

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

### Sanity Resources
- [Sanity Documentation](https://www.sanity.io/docs)
- [Portable Text](https://www.sanity.io/docs/presenting-block-text)
- [Sanity Studio](https://www.sanity.io/docs/sanity-studio)

### Project Resources
- [Omni-Post AI Documentation](./Omni-Post-AI-Automation/README.md)
- [Blog Automation Guide](./N8N_BLOG_AUTOMATION_GUIDE.md)

### Developer Documentation
- **[Portfolio Technical Documentation](./docs/PORTFOLIO-DOCUMENTATION.md)** - Complete architecture, data flow, and design decisions
- **[Data Flow Reference](./docs/DATA-FLOW-REFERENCE.md)** - Visual diagrams of data movement
- **[Component Reference](./docs/COMPONENT-REFERENCE.md)** - React component API reference
- **[Quick Start Guide](./docs/QUICK-START-GUIDE.md)** - Common tasks and operations

---

## 🔗 Links

- **Portfolio**: [amansuryavanshi-dev.vercel.app](https://amansuryavanshi-dev.vercel.app/)
- **GitHub**: [github.com/AmanSuryavanshi-1](https://github.com/AmanSuryavanshi-1)
- **LinkedIn**: [linkedin.com/in/amansuryavanshi-ai](https://www.linkedin.com/in/amansuryavanshi-ai/)
- **Twitter**: [@_AmanSurya](https://x.com/_AmanSurya)
- **N8N Workflows**: [github.com/AmanSuryavanshi-1/N8N](https://github.com/AmanSuryavanshi-1/N8N/tree/main/workflows)

---

## 📄 License

This project is for portfolio and educational purposes. The code is available for reference, but please don't use it for commercial purposes without permission.

---

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Vercel**: For hosting and deployment
- **Sanity**: For the headless CMS
- **n8n**: For the automation platform
- **Google**: For Gemini AI and Analytics

---

**Built with ❤️ by Aman Suryavanshi**  
**Last Updated**: December 29, 2025  
**Status**: Production Ready

---

*This portfolio showcases real-world projects, production-grade code, and enterprise-level automation systems.*
