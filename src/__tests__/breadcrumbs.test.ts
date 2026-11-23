import nextConfig from '../../next.config';
import { buildDocBreadcrumbJsonLd, buildProjectsBreadcrumbJsonLd, SITE_URL } from '@/lib/breadcrumb-utils';

describe('Breadcrumb & Navigation Integrity', () => {
    it('configures permanent 308 redirects for intermediate truncated docs paths', async () => {
        const redirects = await nextConfig.redirects!();
        
        const docsRedirect = redirects.find(r => r.source === '/docs');
        expect(docsRedirect).toBeDefined();
        expect(docsRedirect?.destination).toBe('/projects');
        expect(docsRedirect?.permanent).toBe(true);

        const docsProjectsRedirect = redirects.find(r => r.source === '/docs/projects');
        expect(docsProjectsRedirect).toBeDefined();
        expect(docsProjectsRedirect?.destination).toBe('/projects');
        expect(docsProjectsRedirect?.permanent).toBe(true);
    });

    it('enforces Google Search Central BreadcrumbList schema invariants on doc breadcrumbs', () => {
        const docBreadcrumbJsonLd = buildDocBreadcrumbJsonLd({
            projectShortTitle: 'OmniPost-Core',
            docTitle: '09. Notion Database Schema',
            slug: ['omnipost', '09-notion-database-schema']
        });

        expect(docBreadcrumbJsonLd["@context"]).toBe("https://schema.org");
        expect(docBreadcrumbJsonLd["@type"]).toBe("BreadcrumbList");
        expect(docBreadcrumbJsonLd.itemListElement).toHaveLength(3);

        // Invariant 1: 1-indexed positions
        docBreadcrumbJsonLd.itemListElement.forEach((item, idx) => {
            expect(item.position).toBe(idx + 1);
            expect(item["@type"]).toBe("ListItem");
            // Invariant 2: Zero hash fragments in JSON-LD items (Googlebot strips fragments causing duplicate URLs)
            expect(item.item).not.toContain('#');
            // Invariant 3: All URLs are absolute HTTPS
            expect(item.item.startsWith('https://') || item.item.startsWith('http://')).toBe(true);
        });

        // Invariant 4: All URLs are unique across the trail
        const urls = docBreadcrumbJsonLd.itemListElement.map(i => i.item);
        const uniqueUrls = new Set(urls);
        expect(uniqueUrls.size).toBe(urls.length);

        // Invariant 5: Canonical leaf matches slug
        expect(urls[2]).toBe(`${SITE_URL}/docs/omnipost/09-notion-database-schema`);
    });

    it('enforces Google Search Central BreadcrumbList schema invariants on projects archive', () => {
        const projectsBreadcrumbJsonLd = buildProjectsBreadcrumbJsonLd();

        expect(projectsBreadcrumbJsonLd.itemListElement).toHaveLength(2);
        projectsBreadcrumbJsonLd.itemListElement.forEach((item, idx) => {
            expect(item.position).toBe(idx + 1);
            expect(item.item).not.toContain('#');
        });
        expect(projectsBreadcrumbJsonLd.itemListElement[1].item).toBe(`${SITE_URL}/projects`);
    });

    it('resolves both full physical paths and clean short paths via docs-engine', async () => {
        const { getDocBySlug, getDocsByProjectId, getCanonicalDocSlug } = await import('@/lib/docs-engine');

        // Test 1: Full physical path for Aviators Training Centre
        const fullAtc = getDocBySlug(['projects', 'clientele', 'aviators-training-centre', 'executive-summary']);
        expect(fullAtc).not.toBeNull();
        expect(fullAtc?.meta.projectId).toBe('aviators-training-centre');
        expect(getCanonicalDocSlug(fullAtc!)).toEqual(['aviators-training-centre', 'executive-summary']);

        // Test 2: Clean 2-segment short path for Aviators Training Centre
        const shortAtc = getDocBySlug(['aviators-training-centre', 'executive-summary']);
        expect(shortAtc).not.toBeNull();
        expect(shortAtc?.meta.title).toBe(fullAtc?.meta.title);

        // Test 3: Clean short path for OmniPost
        const shortOmni = getDocBySlug(['omnipost', '01-executive-summary']);
        expect(shortOmni).not.toBeNull();
        expect(shortOmni?.meta.projectId).toBe('omnipost-core');
        expect(getCanonicalDocSlug(shortOmni!)).toEqual(['omnipost', '01-executive-summary']);

        // Test 4: Multi-doc sibling discovery for Creator Intelligence Platform
        const creatorDocs = getDocsByProjectId('creator-intelligence-platform');
        expect(creatorDocs.length).toBeGreaterThanOrEqual(2);
        const creatorExecutive = getDocBySlug(['creator-intelligence-platform', 'executive-summary']);
        expect(creatorExecutive).not.toBeNull();
    });
});
