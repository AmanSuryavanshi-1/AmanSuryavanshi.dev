/**
 * @jest-environment node
 */
jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn().mockResolvedValue([
      { slug: { current: 'n8n-workflow-reliability-validation-guide' }, _updatedAt: '2026-11-15T00:00:00.000Z' },
      { slug: { current: 'multi-agent-symlink-kernel-claude-opencode' }, _updatedAt: '2026-11-15T00:00:00.000Z' }
    ])
  }
}));

import sitemap from '../app/sitemap';

describe('Sitemap Generator', () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
  });

  it('generates sitemap with https://amansuryavanshi.com as baseUrl', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const entries = await sitemap();
    
    expect(entries.length).toBeGreaterThan(0);
    
    // Check root and static routes
    const rootEntry = entries.find((e) => e.url === 'https://amansuryavanshi.com');
    expect(rootEntry).toBeDefined();
    expect(rootEntry?.priority).toBe(1.0);

    const projectsIndex = entries.find((e) => e.url === 'https://amansuryavanshi.com/projects');
    expect(projectsIndex).toBeDefined();

    const blogsIndex = entries.find((e) => e.url === 'https://amansuryavanshi.com/blogs');
    expect(blogsIndex).toBeDefined();

    const aboutIndex = entries.find((e) => e.url === 'https://amansuryavanshi.com/about');
    expect(aboutIndex).toBeDefined();
  });

  it('includes dynamic documentation pages under https://amansuryavanshi.com/docs/', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const entries = await sitemap();

    const docEntries = entries.filter((e) => e.url.startsWith('https://amansuryavanshi.com/docs/'));
    expect(docEntries.length).toBeGreaterThanOrEqual(20);

    // Verify key case study doc exists
    const omnipostDoc = entries.find((e) =>
      e.url.includes('/docs/projects/personal/omnipost/01-executive-summary')
    );
    expect(omnipostDoc).toBeDefined();
  });

  it('includes dynamic projects under https://amansuryavanshi.com/projects/', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const entries = await sitemap();

    const projectEntries = entries.filter((e) =>
      e.url.startsWith('https://amansuryavanshi.com/projects/')
    );
    expect(projectEntries.length).toBeGreaterThan(0);
  });

  it('includes dynamic blog posts under https://amansuryavanshi.com/blogs/', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const entries = await sitemap();

    const blogEntries = entries.filter((e) =>
      e.url.startsWith('https://amansuryavanshi.com/blogs/') && e.url !== 'https://amansuryavanshi.com/blogs'
    );
    expect(blogEntries.length).toBe(2);
    expect(blogEntries[0].url).toBe('https://amansuryavanshi.com/blogs/n8n-workflow-reliability-validation-guide');
    expect(blogEntries[0].priority).toBe(0.7);
    expect(blogEntries[0].changeFrequency).toBe('weekly');
  });
});
