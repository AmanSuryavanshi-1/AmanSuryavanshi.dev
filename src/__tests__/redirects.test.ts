/**
 * @jest-environment node
 */
import nextConfig from '../../next.config';
import { getDocBySlug } from '@/lib/docs-engine';

describe('Next.js Config Redirects & Host Normalization', () => {
  let redirects: Array<{ source: string; destination: string; permanent: boolean; has?: Array<{ type: string; value: string }> }> = [];

  beforeAll(async () => {
    if (typeof nextConfig.redirects === 'function') {
      redirects = await nextConfig.redirects();
    }
  });

  it('contains permanent redirects to amansuryavanshi.com for legacy hostnames', () => {
    const legacyHosts = ['amansuryavanshi-dev.vercel.app', 'amansuryavanshi.me', 'www.amansuryavanshi.me'];

    for (const host of legacyHosts) {
      const match = redirects.find((r) =>
        r.has?.some((h) => h.type === 'host' && h.value === host)
      );
      expect(match).toBeDefined();
      expect(match?.destination).toBe('https://amansuryavanshi.com/:path*');
      expect(match?.permanent).toBe(true);
    }
  });

  it('guarantees every documentation redirect target resolves via docs-engine', () => {
    const docRedirects = redirects.filter((r) =>
      r.destination.startsWith('/docs/') && !r.destination.includes(':')
    );

    expect(docRedirects.length).toBeGreaterThan(0);

    for (const r of docRedirects) {
      const slug = r.destination.replace(/^\/docs\//, '').split('/');
      expect(getDocBySlug(slug)).not.toBeNull();
    }
  });

  it('normalizes historical 404 paths and legacy 4-segment paths to clean 2-segment routes', () => {
    const historicalSources = [
      '/docs/projects/clientele/:project/:doc*',
      '/docs/projects/personal/:project/:doc*',
      '/projects/omni-post-ai-executive-summary',
      '/projects/omni-post-ai-technical-documentation',
      '/docs/omnipost/02-technical-architecture',
      '/projects/vivek-onpoint-platform',
    ];

    for (const source of historicalSources) {
      const match = redirects.find((r) => r.source === source);
      expect(match).toBeDefined();
      expect(match?.permanent).toBe(true);
    }
  });
});
