import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BlogHeaderImage, { useHeaderImageSource } from '../BlogHeaderImage';
import { FallbackImageManager } from '@/lib/fallback-image-manager';
import { getFirstAssetFromBody } from '@/lib/asset-extraction';
import type { Post } from '@/sanity/sanity';

// Mock dependencies
jest.mock('@/sanity/lib/image', () => ({
  urlFor: jest.fn((image) => ({
    url: () => `https://cdn.sanity.io/images/${image.asset?._ref || 'mock-ref'}`,
  })),
}));

jest.mock('@/lib/fallback-image-manager');
jest.mock('@/lib/asset-extraction');
jest.mock('@/lib/blog-logger', () => ({
  BlogLogger: {
    logHeaderImageSelection: jest.fn(),
    logFallbackUsage: jest.fn(),
    logImageError: jest.fn(),
    error: jest.fn(),
  },
}));

const mockFallbackImageManager = FallbackImageManager as jest.Mocked<typeof FallbackImageManager>;
const mockGetFirstAssetFromBody = getFirstAssetFromBody as jest.MockedFunction<typeof getFirstAssetFromBody>;

describe('BlogHeaderImage', () => {
  const mockPost: Post = {
    _id: 'post-123',
    _createdAt: '2024-01-01',
    title: 'Test Post',
    slug: { current: 'test-post', _type: 'slug' },
    body: [],
    excerpt: 'Test excerpt',
    status: 'published',
    viewCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFallbackImageManager.getRandomFallback.mockReturnValue({
      filename: 'Blog_header_fallback_asset1.jpg',
      alt: 'Default blog header image 1',
      path: '/Blog_header_fallback_asset1.jpg',
    });

    mockFallbackImageManager.getUltimateFallback.mockReturnValue(
      'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='
    );
  });

  describe('Image Source Priority', () => {
    it('should use mainImage when available', () => {
      const postWithMainImage: Post = {
        ...mockPost,
        mainImage: {
          _type: 'image',
          asset: { _ref: 'image-main-123', _type: 'reference' },
          alt: 'Main image alt',
        },
      };

      render(<BlogHeaderImage post={postWithMainImage} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src');
      expect(image).toHaveAttribute('alt', 'Main image alt');
    });

    it('should use first asset when mainImage is not available', () => {
      mockGetFirstAssetFromBody.mockReturnValue({
        image: {
          _type: 'image',
          asset: { _ref: 'image-asset-456', _type: 'reference' },
        },
        alt: 'First asset alt',
        index: 0,
      });

      render(<BlogHeaderImage post={mockPost} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'First asset alt');
      expect(mockGetFirstAssetFromBody).toHaveBeenCalledWith(mockPost.body);
    });

    it('should use fallback image when no mainImage or assets', () => {
      mockGetFirstAssetFromBody.mockReturnValue(null);

      render(<BlogHeaderImage post={mockPost} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/Blog_header_fallback_asset1.jpg');
      expect(image).toHaveAttribute('alt', 'Default blog header image 1');
      expect(mockFallbackImageManager.getRandomFallback).toHaveBeenCalled();
    });

    it('should use ultimate fallback on error', () => {
      mockGetFirstAssetFromBody.mockImplementation(() => {
        throw new Error('Test error');
      });

      render(<BlogHeaderImage post={mockPost} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=');
      expect(mockFallbackImageManager.getUltimateFallback).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle image load errors gracefully', async () => {
      const { act } = await import('@testing-library/react');
      
      const postWithMainImage: Post = {
        ...mockPost,
        mainImage: {
          _type: 'image',
          asset: { _ref: 'image-main-123', _type: 'reference' },
          alt: 'Main image alt',
        },
      };

      const { container } = render(<BlogHeaderImage post={postWithMainImage} />);
      const image = screen.getByRole('img');

      // Simulate image error wrapped in act
      await act(async () => {
        const errorEvent = new Event('error');
        image.dispatchEvent(errorEvent);
      });

      await waitFor(() => {
        expect(mockFallbackImageManager.getRandomFallback).toHaveBeenCalled();
      });
    });
  });

  describe('Component Props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <BlogHeaderImage post={mockPost} className="custom-class" />
      );

      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });

    it('should set priority prop on Image component', () => {
      render(<BlogHeaderImage post={mockPost} priority={true} />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
    });

    it('should default priority to true', () => {
      render(<BlogHeaderImage post={mockPost} />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Gradient Overlay', () => {
    it('should render gradient overlay', () => {
      const { container } = render(<BlogHeaderImage post={mockPost} />);

      const overlay = container.querySelector('.bg-gradient-to-t');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('from-black/70', 'via-black/30', 'to-transparent');
    });
  });

  describe('Development Mode', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should show debug info in development mode', () => {
      process.env.NODE_ENV = 'development';
      mockGetFirstAssetFromBody.mockReturnValue(null);

      const { container } = render(<BlogHeaderImage post={mockPost} />);

      expect(container.textContent).toContain('Source: fallback');
    });

    it('should not show debug info in production mode', () => {
      process.env.NODE_ENV = 'production';
      mockGetFirstAssetFromBody.mockReturnValue(null);

      const { container } = render(<BlogHeaderImage post={mockPost} />);

      expect(container.textContent).not.toContain('Source:');
    });
  });
});

describe('useHeaderImageSource', () => {
  const mockPost: Post = {
    _id: 'post-123',
    _createdAt: '2024-01-01',
    title: 'Test Post',
    slug: { current: 'test-post', _type: 'slug' },
    body: [],
    excerpt: 'Test excerpt',
    status: 'published',
    viewCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFallbackImageManager.getRandomFallback.mockReturnValue({
      filename: 'Blog_header_fallback_asset1.jpg',
      alt: 'Default blog header image 1',
      path: '/Blog_header_fallback_asset1.jpg',
    });
  });

  it('should return header image source for mainImage', () => {
    const TestComponent = () => {
      const postWithMainImage: Post = {
        ...mockPost,
        mainImage: {
          _type: 'image',
          asset: { _ref: 'image-main-123', _type: 'reference' },
          alt: 'Main image alt',
        },
      };
      const source = useHeaderImageSource(postWithMainImage);
      return <div data-testid="source-type">{source.type}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByTestId('source-type')).toHaveTextContent('main');
  });

  it('should return header image source for first asset', () => {
    mockGetFirstAssetFromBody.mockReturnValue({
      image: {
        _type: 'image',
        asset: { _ref: 'image-asset-456', _type: 'reference' },
      },
      alt: 'First asset alt',
      index: 0,
    });

    const TestComponent = () => {
      const source = useHeaderImageSource(mockPost);
      return <div data-testid="source-type">{source.type}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByTestId('source-type')).toHaveTextContent('first-asset');
  });

  it('should return fallback source when no images available', () => {
    mockGetFirstAssetFromBody.mockReturnValue(null);

    const TestComponent = () => {
      const source = useHeaderImageSource(mockPost);
      return <div data-testid="source-type">{source.type}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByTestId('source-type')).toHaveTextContent('fallback');
  });

  it('should memoize the result', () => {
    const TestComponent = ({ post }: { post: Post }) => {
      const source = useHeaderImageSource(post);
      return <div data-testid="source-url">{source.url}</div>;
    };

    const { rerender } = render(<TestComponent post={mockPost} />);
    const firstUrl = screen.getByTestId('source-url').textContent;

    // Rerender with same post
    rerender(<TestComponent post={mockPost} />);
    const secondUrl = screen.getByTestId('source-url').textContent;

    expect(firstUrl).toBe(secondUrl);
  });
});
