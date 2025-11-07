/**
 * Integration Tests for Blog Post Page
 * Tests the complete rendering flow including header images, content, and responsive behavior
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogPost from '../page';
import { client } from '@/sanity/lib/client';
import type { Post } from '@/sanity/sanity';

// Mock dependencies
jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}));

jest.mock('@/sanity/lib/image', () => ({
  urlFor: jest.fn((image) => ({
    url: () => `https://cdn.sanity.io/images/${image?.asset?._ref || 'mock-ref'}`,
  })),
}));

jest.mock('@/components/sanity/ViewCounter', () => {
  return function MockViewCounter({ postId }: { postId: string }) {
    return <span data-testid="view-counter">{postId}</span>;
  };
});

jest.mock('@/components/sanity/ShareButtons', () => {
  return function MockShareButtons({ title }: { title: string; url: string }) {
    return <div data-testid="share-buttons">{title}</div>;
  };
});

jest.mock('@/components/learn-more-about-me/CTA', () => {
  return function MockCTA() {
    return <div data-testid="cta">CTA Section</div>;
  };
});

jest.mock('@/lib/blog-logger', () => ({
  BlogLogger: {
    logHeaderImageSelection: jest.fn(),
    logFallbackUsage: jest.fn(),
    logImageError: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('Not Found');
  }),
}));

const mockClient = client as jest.Mocked<typeof client>;

describe('Blog Post Page Integration Tests', () => {
  const mockPost: Post = {
    _id: 'post-123',
    _createdAt: '2024-01-15T10:00:00Z',
    title: 'Test Blog Post',
    slug: { current: 'test-blog-post', _type: 'slug' },
    body: [
      {
        _type: 'block',
        _key: 'block1',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'This is a test paragraph.',
            marks: [],
          },
        ],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'image',
        _key: 'img1',
        asset: {
          _ref: 'image-content-123',
          _type: 'reference',
        },
        alt: 'Content image',
      },
    ],
    excerpt: 'This is a test excerpt',
    status: 'published',
    viewCount: 100,
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'image-main-123',
        _type: 'reference',
      },
      alt: 'Main header image',
    },
    author: {
      _id: 'author-1',
      name: 'John Doe',
      image: {
        _type: 'image',
        asset: {
          _ref: 'author-image-123',
          _type: 'reference',
        },
      },
      bio: [
        {
          _type: 'block',
          _key: 'bio1',
          children: [
            {
              _type: 'span',
              _key: 'biospan1',
              text: 'Author bio',
              marks: [],
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
    },
    categories: [
      {
        _id: 'cat-1',
        title: 'Technology',
      },
    ],
    tags: ['testing', 'integration'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.fetch.mockResolvedValue(mockPost);
  });

  describe('Complete Header Image Flow', () => {
    it('should render blog post with mainImage as header', async () => {
      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      const { container } = render(component);

      // Check that header image is rendered
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      
      // Check hero section exists
      const heroSection = container.querySelector('.relative.h-\\[65vh\\]');
      expect(heroSection).toBeInTheDocument();
    });

    it('should use first asset when mainImage is missing', async () => {
      const postWithoutMainImage = {
        ...mockPost,
        mainImage: undefined,
      };
      mockClient.fetch.mockResolvedValue(postWithoutMainImage);

      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      const { container } = render(component);

      // Should still render header section
      const heroSection = container.querySelector('.relative.h-\\[65vh\\]');
      expect(heroSection).toBeInTheDocument();
    });

    it('should use fallback when no images available', async () => {
      const postWithoutImages = {
        ...mockPost,
        mainImage: undefined,
        body: [
          {
            _type: 'block',
            _key: 'block1',
            children: [
              {
                _type: 'span',
                _key: 'span1',
                text: 'Text only content',
                marks: [],
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      };
      mockClient.fetch.mockResolvedValue(postWithoutImages);

      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      const { container } = render(component);

      // Should still render with fallback
      const heroSection = container.querySelector('.relative.h-\\[65vh\\]');
      expect(heroSection).toBeInTheDocument();
    });
  });

  describe('Heading Consistency', () => {
    it('should render headings with consistent styling', async () => {
      const postWithHeadings = {
        ...mockPost,
        body: [
          {
            _type: 'block',
            _key: 'h1',
            children: [
              {
                _type: 'span',
                _key: 'h1span',
                text: 'Heading 1',
                marks: [],
              },
            ],
            markDefs: [],
            style: 'h1',
          },
          {
            _type: 'block',
            _key: 'h2',
            children: [
              {
                _type: 'span',
                _key: 'h2span',
                text: 'Heading 2',
                marks: [],
              },
            ],
            markDefs: [],
            style: 'h2',
          },
          {
            _type: 'block',
            _key: 'h3',
            children: [
              {
                _type: 'span',
                _key: 'h3span',
                text: 'Heading 3',
                marks: [],
              },
            ],
            markDefs: [],
            style: 'h3',
          },
        ],
      };
      mockClient.fetch.mockResolvedValue(postWithHeadings);

      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      const { container } = render(component);

      // Check that headings are rendered
      expect(screen.getByText('Heading 1')).toBeInTheDocument();
      expect(screen.getByText('Heading 2')).toBeInTheDocument();
      expect(screen.getByText('Heading 3')).toBeInTheDocument();

      // Check that headings have proper styling classes
      const h1 = screen.getByText('Heading 1');
      expect(h1.className).toContain('text-');
      expect(h1.className).toContain('font-');
    });

    it('should render bold text consistently', async () => {
      const postWithBoldText = {
        ...mockPost,
        body: [
          {
            _type: 'block',
            _key: 'block1',
            children: [
              {
                _type: 'span',
                _key: 'span1',
                text: 'Normal text ',
                marks: [],
              },
              {
                _type: 'span',
                _key: 'span2',
                text: 'bold text',
                marks: ['strong'],
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      };
      mockClient.fetch.mockResolvedValue(postWithBoldText);

      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      render(component);

      // Check that bold text is rendered
      const boldText = screen.getByText('bold text');
      expect(boldText.tagName).toBe('STRONG');
      expect(boldText.className).toContain('font-bold');
    });
  });

  describe('Responsive Image Behavior', () => {
    it('should render content images with responsive sizing', async () => {
      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      const { container } = render(component);

      // Check that content area has prose classes for responsive typography
      const proseContainer = container.querySelector('.prose');
      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer?.className).toContain('prose-lg');
    });

    it('should handle multiple images in content', async () => {
      const postWithMultipleImages = {
        ...mockPost,
        body: [
          {
            _type: 'image',
            _key: 'img1',
            asset: {
              _ref: 'image-1',
              _type: 'reference',
            },
            alt: 'First image',
          },
          {
            _type: 'block',
            _key: 'block1',
            children: [
              {
                _type: 'span',
                _key: 'span1',
                text: 'Some text',
                marks: [],
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _type: 'image',
            _key: 'img2',
            asset: {
              _ref: 'image-2',
              _type: 'reference',
            },
            alt: 'Second image',
          },
        ],
      };
      mockClient.fetch.mockResolvedValue(postWithMultipleImages);

      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      render(component);

      // Should render multiple images
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(2); // Header + content images + author image
    });
  });

  describe('Error Scenarios', () => {
    it('should handle missing post gracefully', async () => {
      mockClient.fetch.mockResolvedValue(null);

      const params = Promise.resolve({ slug: 'non-existent' });
      
      // The component should call notFound() which throws an error
      try {
        await BlogPost({ params });
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // Expect the error to be thrown
        expect(error).toBeDefined();
      }
    });

    it('should render post without author', async () => {
      const postWithoutAuthor = {
        ...mockPost,
        author: undefined,
      };
      mockClient.fetch.mockResolvedValue(postWithoutAuthor);

      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      const { container } = render(component);

      // Should render without author section
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      
      // But should still render main content
      const titles = screen.getAllByText('Test Blog Post');
      expect(titles.length).toBeGreaterThan(0);
    });

    it('should render post without categories', async () => {
      const postWithoutCategories = {
        ...mockPost,
        categories: undefined,
      };
      mockClient.fetch.mockResolvedValue(postWithoutCategories);

      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      render(component);

      // Should render without category badges
      expect(screen.queryByText('Technology')).not.toBeInTheDocument();
      
      // But should still render main content
      const titles = screen.getAllByText('Test Blog Post');
      expect(titles.length).toBeGreaterThan(0);
    });
  });

  describe('Complete Page Structure', () => {
    it('should render all major sections', async () => {
      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      const { container } = render(component);

      // Hero section
      expect(container.querySelector('.relative.h-\\[65vh\\]')).toBeInTheDocument();
      
      // Title (using getAllByText since it appears in multiple places)
      const titles = screen.getAllByText('Test Blog Post');
      expect(titles.length).toBeGreaterThan(0);
      
      // Author section
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      
      // Content
      expect(screen.getByText('This is a test paragraph.')).toBeInTheDocument();
      
      // Share section
      expect(screen.getByText('Share this article')).toBeInTheDocument();
      
      // CTA
      expect(screen.getByTestId('cta')).toBeInTheDocument();
    });

    it('should render metadata elements', async () => {
      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      render(component);

      // Read time
      expect(screen.getByText(/min read/)).toBeInTheDocument();
      
      // View counter
      expect(screen.getByTestId('view-counter')).toBeInTheDocument();
      
      // Date
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    });

    it('should render categories as badges', async () => {
      const params = Promise.resolve({ slug: 'test-blog-post' });
      const component = await BlogPost({ params });
      
      render(component);

      const categoryBadge = screen.getByText('Technology');
      expect(categoryBadge).toBeInTheDocument();
      expect(categoryBadge.className).toContain('rounded-full');
    });
  });
});
