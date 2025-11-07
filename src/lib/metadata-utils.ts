/**
 * Metadata Utilities - Helper functions for generating metadata with computed header images
 */

import { urlFor } from '@/sanity/lib/image';
import { FallbackImageManager } from '@/lib/fallback-image-manager';
import { getFirstAssetFromBody } from '@/lib/asset-extraction';
import type { Post } from '@/sanity/sanity';

/**
 * Get the header image URL for metadata and Open Graph
 * Uses the same priority logic as BlogHeaderImage component
 * @param post - The blog post
 * @returns {string} The header image URL for metadata
 */
export function getMetadataImageUrl(post: Post): string {
  try {
    // Priority 1: Use existing mainImage
    if (post.mainImage) {
      return urlFor(post.mainImage).url();
    }

    // Priority 2: Use first image from body content
    const firstAsset = getFirstAssetFromBody(post.body);
    if (firstAsset) {
      return urlFor(firstAsset.image).url();
    }

    // Priority 3: Use random fallback image
    // For metadata, we want consistency, so use the first fallback instead of random
    const fallbackImages = FallbackImageManager.getAllFallbacks();
    if (fallbackImages.length > 0) {
      // Use absolute URL for Open Graph
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      return `${baseUrl}${fallbackImages[0].path}`;
    }

    // Priority 4: Ultimate fallback (inline SVG)
    return FallbackImageManager.getUltimateFallback();
  } catch (error) {
    console.error('Error getting metadata image URL:', error);
    return FallbackImageManager.getUltimateFallback();
  }
}

/**
 * Get the alt text for the header image in metadata
 * @param post - The blog post
 * @returns {string} The alt text for the header image
 */
export function getMetadataImageAlt(post: Post): string {
  try {
    // Priority 1: Use existing mainImage alt
    if (post.mainImage?.alt) {
      return post.mainImage.alt;
    }

    // Priority 2: Use first asset alt
    const firstAsset = getFirstAssetFromBody(post.body);
    if (firstAsset?.alt) {
      return firstAsset.alt;
    }

    // Priority 3: Use post title as alt text
    return `Header image for: ${post.title}`;
  } catch (error) {
    console.error('Error getting metadata image alt:', error);
    return `Header image for: ${post.title}`;
  }
}

/**
 * Generate comprehensive Open Graph image data
 * @param post - The blog post
 * @returns {object} Open Graph image configuration
 */
export function getOpenGraphImage(post: Post) {
  const imageUrl = getMetadataImageUrl(post);
  const imageAlt = getMetadataImageAlt(post);

  return {
    url: imageUrl,
    alt: imageAlt,
    width: 1200,
    height: 600,
    type: 'image/jpeg'
  };
}

/**
 * Generate Twitter Card image data
 * @param post - The blog post
 * @returns {object} Twitter Card image configuration
 */
export function getTwitterCardImage(post: Post) {
  const imageUrl = getMetadataImageUrl(post);
  const imageAlt = getMetadataImageAlt(post);

  return {
    url: imageUrl,
    alt: imageAlt
  };
}