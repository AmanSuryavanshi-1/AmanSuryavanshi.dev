'use client';

import { useState, useCallback } from 'react';
import { FallbackImageManager, FallbackCategory, FallbackContext } from '@/lib/fallback-image-manager';

export interface UseFallbackImageOptions {
    /**
     * Explicit category for fallback selection
     */
    category?: FallbackCategory;
    /**
     * Context for intelligent fallback inference
     */
    context?: FallbackContext;
    /**
     * Initial source URL
     */
    initialSrc?: string;
}

export interface UseFallbackImageReturn {
    /**
     * Current image source (original or fallback)
     */
    src: string | null;
    /**
     * Whether the image has errored and is showing fallback
     */
    hasError: boolean;
    /**
     * Alt text for the current image
     */
    alt: string;
    /**
     * Error handler to pass to img/Image onError prop
     */
    handleError: () => void;
    /**
     * Reset handler to clear error state (useful for src changes)
     */
    reset: () => void;
}

/**
 * React hook for handling image fallbacks
 * 
 * @example
 * ```tsx
 * const { src, hasError, handleError, alt } = useFallbackImage({
 *   initialSrc: project.image,
 *   context: { title: project.title, techStack: project.technologies }
 * });
 * 
 * return <Image src={src} alt={alt} onError={handleError} />;
 * ```
 */
export function useFallbackImage(options: UseFallbackImageOptions = {}): UseFallbackImageReturn {
    const { category, context, initialSrc } = options;

    const [hasError, setHasError] = useState(false);
    const [fallbackImage, setFallbackImage] = useState<{ path: string; alt: string } | null>(null);

    /**
     * Get appropriate fallback based on options
     */
    const getFallback = useCallback(() => {
        if (category) {
            return FallbackImageManager.getFallbackByCategory(category);
        }
        if (context) {
            return FallbackImageManager.getContextualFallback(context);
        }
        return FallbackImageManager.getRandomFallback();
    }, [category, context]);

    /**
     * Handle image load error
     */
    const handleError = useCallback(() => {
        if (!hasError) {
            const fallback = getFallback();
            setFallbackImage({ path: fallback.path, alt: fallback.alt });
            setHasError(true);
        }
    }, [hasError, getFallback]);

    /**
     * Reset error state (useful when src changes)
     */
    const reset = useCallback(() => {
        setHasError(false);
        setFallbackImage(null);
    }, []);

    return {
        src: hasError && fallbackImage ? fallbackImage.path : (initialSrc || null),
        hasError,
        alt: hasError && fallbackImage ? fallbackImage.alt : '',
        handleError,
        reset
    };
}

/**
 * Get fallback image path directly (for use outside React components)
 */
export function getFallbackImagePath(options?: { category?: FallbackCategory; context?: FallbackContext }): string {
    if (options?.category) {
        return FallbackImageManager.getFallbackByCategory(options.category).path;
    }
    if (options?.context) {
        return FallbackImageManager.getContextualFallback(options.context).path;
    }
    return FallbackImageManager.getRandomFallback().path;
}

export default useFallbackImage;
