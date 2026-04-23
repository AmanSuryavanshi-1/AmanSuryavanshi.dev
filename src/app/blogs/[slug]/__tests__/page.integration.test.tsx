import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogPost from '../page';
import { client } from '@/sanity/lib/client';
import type { Post } from '@/sanity/sanity';

jest.mock('next/link', () => {
  return ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  );
});

jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}));

jest.mock('@/sanity/lib/image', () => ({
  urlFor: jest.fn(() => ({
    url: () => 'https://cdn.sanity.io/images/mock-image',
  })),
}));

jest.mock('@/components/sanity/calculateReadTime', () => ({
  calculateReadTime: jest.fn(() => 7),
}));

jest.mock('@/lib/metadata-utils', () => ({
  getOpenGraphImage: jest.fn(() => ({ url: 'https://cdn.sanity.io/images/og-image' })),
  getTwitterCardImage: jest.fn(() => ({ url: 'https://cdn.sanity.io/images/twitter-image' })),
  getMetadataImageUrl: jest.fn(() => 'https://cdn.sanity.io/images/jsonld-image'),
}));

jest.mock('@portabletext/react', () => ({
  PortableText: ({ value }: { value: Array<{ children?: Array<{ text?: string }> }> }) => (
    <div data-testid="portable-text">
      {value?.map((block, idx) => (
        <p key={idx}>{(block.children || []).map((c) => c.text).join(' ')}</p>
      ))}
    </div>
  ),
}));

jest.mock('@/components/about-page/CTA', () => function MockCTA() {
  return <div data-testid="global-cta">Global CTA</div>;
});

jest.mock('@/components/blog/BlogHeaderImage', () => function MockBlogHeaderImage() {
  return <img alt="Header" src="/header.jpg" />;
});

jest.mock('@/components/blog/BlogErrorBoundary', () => ({
  BlogErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/blog/ReadingProgress', () => function MockReadingProgress() {
  return <div data-testid="reading-progress" />;
});

jest.mock('@/components/blog/TableOfContents', () => function MockToc() {
  return <div data-testid="toc" />;
});

jest.mock('@/components/blog/FloatingActions', () => function MockFloatingActions() {
  return <div data-testid="floating-actions" />;
});

jest.mock('@/components/blog/MobileActionBar', () => function MockMobileActionBar() {
  return <div data-testid="mobile-actions" />;
});

jest.mock('@/components/blog/RelatedPosts', () => function MockRelatedPosts({ posts }: { posts: unknown[] }) {
  return <div data-testid="related-posts">related-{posts?.length ?? 0}</div>;
});

jest.mock('@/components/blog/ShareBar', () => function MockShareBar() {
  return <div>Share this article</div>;
});

jest.mock('@/components/blog/AllTags', () => function MockAllTags() {
  return <div data-testid="all-tags" />;
});

jest.mock('@/components/blog/BlogImageGalleryWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/blog/ScrollIndicator', () => function MockScrollIndicator() {
  return <div data-testid="scroll-indicator" />;
});

jest.mock('@/components/blog/ViewTracker', () => function MockViewTracker() {
  return <div data-testid="view-tracker" />;
});

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('Not Found');
  }),
}));

const mockClient = client as jest.Mocked<typeof client>;

const basePost: Post = {
  _id: 'post-1',
  _type: 'post',
  _createdAt: '2024-01-15T10:00:00Z',
  _updatedAt: '2024-02-01T10:00:00Z',
  title: 'Test Blog Post',
  slug: { current: 'test-blog-post', _type: 'slug' },
  excerpt: 'Test excerpt',
  canonicalUrl: 'https://amansuryavanshi.me/blogs/test-blog-post',
  body: [
    {
      _type: 'block',
      _key: 'b1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'c1',
          _type: 'span',
          marks: [],
          text: 'This is a test paragraph.',
        },
      ],
    },
  ],
  author: {
    _id: 'author-1',
    _type: 'author',
    name: 'Aman Suryavanshi',
  },
  tags: [
    { _key: 't1', label: 'SEO', slug: 'seo' },
  ],
  status: 'published',
  keyTakeaways: ['Takeaway one'],
  faqItems: [
    {
      _key: 'faq-1',
      question: 'What is AEO?',
      answer: 'Answer Engine Optimization improves AI discoverability.',
    },
  ],
  internal_links: [
    {
      _key: 'il-1',
      anchor_text: 'Read the prompt engineering guide',
      context: 'Deep dive into practical prompt frameworks.',
      url: '/blogs/prompt-engineering-guide',
    },
  ],
  cta_type: 'portfolio_proof',
  cta_text: 'See this workflow in production with full architecture breakdown.',
  primary_category: {
    title: 'AI Automation',
    slug: { current: 'ai-automation', _type: 'slug' },
  },
  subcategory: 'SEO Systems',
};

describe('Blog Post Page SEO/AEO integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.fetch.mockImplementation(async (query: string) => {
      if (query.includes('slug.current == $slug')) return basePost;
      if (query.includes('count((tags[]->slug.current)')) return [];
      if (query.includes('_type == "author"')) return basePost.author;
      return null;
    });
  });

  it('renders BlogPosting, BreadcrumbList, and FAQPage JSON-LD', async () => {
    const component = await BlogPost({ params: Promise.resolve({ slug: 'test-blog-post' }) });
    const { container } = render(component);

    const jsonLdScripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
      .map((node) => JSON.parse(node.textContent || '{}'));

    const blogPosting = jsonLdScripts.find((s) => s['@type'] === 'BlogPosting');
    const breadcrumbList = jsonLdScripts.find((s) => s['@type'] === 'BreadcrumbList');
    const faqPage = jsonLdScripts.find((s) => s['@type'] === 'FAQPage');

    expect(blogPosting).toBeDefined();
    expect(blogPosting.headline).toBe('Test Blog Post');
    expect(blogPosting.publisher?.['@type']).toBe('Organization');
    expect(blogPosting.mainEntityOfPage?.['@id']).toBe('https://amansuryavanshi.me/blogs/test-blog-post');

    expect(breadcrumbList).toBeDefined();
    expect(breadcrumbList.itemListElement.map((i: { name: string }) => i.name)).toEqual([
      'Home',
      'AI Automation',
      'SEO Systems',
      'Test Blog Post',
    ]);

    expect(faqPage).toBeDefined();
    expect(faqPage.mainEntity[0].name).toBe('What is AEO?');
  });

  it('renders Related Articles from internal_links with context text', async () => {
    const component = await BlogPost({ params: Promise.resolve({ slug: 'test-blog-post' }) });
    render(component);

    expect(screen.getByRole('heading', { name: 'Related Articles' })).toBeInTheDocument();
    expect(screen.getByText('Read the prompt engineering guide')).toBeInTheDocument();
    expect(screen.getByText('Deep dive into practical prompt frameworks.')).toBeInTheDocument();

    const articleLink = screen.getByRole('link', { name: /Read the prompt engineering guide/i });
    expect(articleLink).toHaveAttribute('href', '/blogs/prompt-engineering-guide');
  });

  it('renders FAQ questions as h3 headings inside accordion', async () => {
    const component = await BlogPost({ params: Promise.resolve({ slug: 'test-blog-post' }) });
    render(component);

    const faqQuestions = screen.getAllByRole('heading', { level: 3, name: 'What is AEO?' });
    expect(faqQuestions.length).toBeGreaterThan(0);
  });

  it('renders CTA variant when cta_type exists and falls back to global CTA otherwise', async () => {
    const withVariant = await BlogPost({ params: Promise.resolve({ slug: 'test-blog-post' }) });
    render(withVariant);

    expect(screen.getByRole('heading', { name: 'See this in production' })).toBeInTheDocument();
    expect(screen.getByText('See this workflow in production with full architecture breakdown.')).toBeInTheDocument();

    mockClient.fetch.mockImplementation(async (query: string) => {
      if (query.includes('slug.current == $slug')) {
        return { ...basePost, cta_type: undefined, cta_text: undefined };
      }
      if (query.includes('count((tags[]->slug.current)')) return [];
      return null;
    });

    const withoutVariant = await BlogPost({ params: Promise.resolve({ slug: 'test-blog-post' }) });
    render(withoutVariant);

    expect(screen.getByTestId('global-cta')).toBeInTheDocument();
  });

  it('uses category/subcategory query-param breadcrumb links', async () => {
    const component = await BlogPost({ params: Promise.resolve({ slug: 'test-blog-post' }) });
    render(component);

    expect(screen.getByRole('link', { name: 'AI Automation' })).toHaveAttribute('href', '/blogs?category=ai-automation');
    expect(screen.getByRole('link', { name: 'SEO Systems' })).toHaveAttribute('href', '/blogs?category=ai-automation&sub=seo-systems');
  });
});
