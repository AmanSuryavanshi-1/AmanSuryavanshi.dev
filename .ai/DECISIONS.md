# Architectural Decisions (ADR)

1. **Frontend**: Next.js 15 App Router with Tailwind CSS and Radix UI / Shadcn.
2. **Content Management**: Hybrid approach using Sanity CMS for dynamic blogs and Static Data for portfolio elements.
3. **Automation**: Self-hosted n8n workflows integrated with Gemini API.
4. **Rendering**: RSC by default, SSG for blog posts.
5. **Asset Resilience (ADR 5)**: Custom `FallbackImageManager` ensures 100% image load success for all external markdown projects, deliberately overriding default next/image `<Image onError>` for better architectural separation.
6. **Stateless Portfolio (ADR 6)**: The core Next.js portfolio intentionally avoids global state managers (like Redux). *Note: Redux is heavily mentioned in the codebase, but only within static project documentation (e.g., Foodah, AV NewsStream) as strings.*
7. **Centralized Icon Mapping (ADR 7)**: React Icons are globally mapped to string keys inside `src/data/icons/icon-map.ts` to allow dynamic badge rendering without bloating individual components with huge imports.
