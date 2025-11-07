'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { FallbackImageManager } from '@/lib/fallback-image-manager';
import { getFirstAssetFromBody } from '@/lib/asset-extraction';
import { BlogLogger } from '@/lib/blog-logger';
import type { Post } from '@/sanity/sanity';

export interface HeaderImageSource {
  type: 'main' | 'first-asset' | 'fallback' | 'ultimate-fallback';
  url: string;
  alt: string;
}

export interface BlogHeaderImageProps {
  post: Post;
  className?: string;
  priority?: boolean;
}

/**
 * Get the appropriate header image source for a blog post
 * Priority: mainImage → first asset → random fallback → ultimate fallback
 */
function getHeaderImageSource(post: Post): HeaderImageSource {
  try {
    // Priority 1: Use existing mainImage
    if (post.mainImage) {
      BlogLogger.logHeaderImageSelection(post._id, 'main', {
        postSlug: post.slug.current,
        component: 'BlogHeaderImage'
      });
      
      return {
        type: 'main',
        url: urlFor(post.mainImage).url(),
        alt: post.mainImage.alt || post.title
      };
    }

    // Priority 2: Use first image from body content
    const firstAsset = getFirstAssetFromBody(post.body);
    if (firstAsset) {
      BlogLogger.logHeaderImageSelection(post._id, 'first-asset', {
        postSlug: post.slug.current,
        component: 'BlogHeaderImage'
      });
      
      return {
        type: 'first-asset',
        url: urlFor(firstAsset.image).url(),
        alt: firstAsset.alt || post.title
      };
    }

    // Priority 3: Use random fallback image
    const fallbackImage = FallbackImageManager.getRandomFallback();
    BlogLogger.logFallbackUsage('random-fallback', {
      postId: post._id,
      postSlug: post.slug.current,
      component: 'BlogHeaderImage'
    });
    
    return {
      type: 'fallback',
      url: fallbackImage.path,
      alt: fallbackImage.alt
    };
  } catch (error) {
    BlogLogger.error('Error determining header image source', {
      postId: post._id,
      postSlug: post.slug.current,
      component: 'BlogHeaderImage'
    }, error as Error);
    
    // Priority 4: Ultimate fallback (inline SVG)
    BlogLogger.logFallbackUsage('ultimate-fallback', {
      postId: post._id,
      postSlug: post.slug.current,
      component: 'BlogHeaderImage'
    });
    
    return {
      type: 'ultimate-fallback',
      url: FallbackImageManager.getUltimateFallback(),
      alt: 'Default blog header'
    };
  }
}

/**
 * BlogHeaderImage Component
 * Intelligently selects and displays the appropriate header image for a blog post
 */
export default function BlogHeaderImage({ 
  post, 
  className = '', 
  priority = true 
}: BlogHeaderImageProps) {
  const [imageError, setImageError] = useState(false);
  const [headerSource, setHeaderSource] = useState<HeaderImageSource>(() => 
    getHeaderImageSource(post)
  );

  const handleImageError = () => {
    BlogLogger.logImageError(headerSource.url, {
      postId: post._id,
      postSlug: post.slug.current,
      component: 'BlogHeaderImage'
    });
    
    setImageError(true);
    
    // Try next fallback level
    if (headerSource.type === 'main' || headerSource.type === 'first-asset') {
      const fallbackImage = FallbackImageManager.getRandomFallback();
      BlogLogger.logFallbackUsage('error-fallback', {
        postId: post._id,
        postSlug: post.slug.current,
        component: 'BlogHeaderImage'
      });
      
      setHeaderSource({
        type: 'fallback',
        url: fallbackImage.path,
        alt: fallbackImage.alt
      });
    } else if (headerSource.type === 'fallback') {
      BlogLogger.logFallbackUsage('ultimate-error-fallback', {
        postId: post._id,
        postSlug: post.slug.current,
        component: 'BlogHeaderImage'
      });
      
      setHeaderSource({
        type: 'ultimate-fallback',
        url: FallbackImageManager.getUltimateFallback(),
        alt: 'Default blog header'
      });
    }
  };

  const handleImageLoad = () => {
    if (imageError) {
      setImageError(false);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={headerSource.url}
        alt={headerSource.alt}
        fill
        priority={priority}
        className="object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        sizes="100vw"
      />
      
      {/* Gradient overlay - maintaining existing styling */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Source: {headerSource.type}
        </div>
      )}
    </div>
  );
}

/**
 * Hook to get header image source information
 * Useful for metadata generation and other purposes
 */
export function useHeaderImageSource(post: Post): HeaderImageSource {
  return React.useMemo(() => getHeaderImageSource(post), [post]);
}