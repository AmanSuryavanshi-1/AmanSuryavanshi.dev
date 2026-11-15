/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import nextConfig from '../../next.config';

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

  it('guarantees every documentation redirect target maps to a physical markdown file', () => {
    const docsDir = path.join(process.cwd(), 'src', 'content', 'docs');
    const docRedirects = redirects.filter((r) =>
      r.destination.startsWith('/docs/projects/') && !r.destination.includes(':')
    );

    expect(docRedirects.length).toBeGreaterThan(0);

    for (const r of docRedirects) {
      const relativePath = r.destination.replace(/^\/docs\//, '') + '.md';
      const fullPath = path.join(docsDir, relativePath);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  it('normalizes historical 404 paths to valid documentation routes', () => {
    const historicalSources = [
      '/docs/omnipost/01-executive-summary',
      '/projects/omni-post-ai-executive-summary',
      '/projects/omni-post-ai-technical-documentation',
      '/docs/projects/personal/omnipost/02-technical-architecture'
    ];

    for (const source of historicalSources) {
      const match = redirects.find((r) => r.source === source);
      expect(match).toBeDefined();
      expect(match?.permanent).toBe(true);
    }
  });
});
