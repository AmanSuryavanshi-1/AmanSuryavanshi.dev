'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import type { SanityImage } from '@/sanity/sanity';
import { FallbackImageManager } from '@/lib/fallback-image-manager';

export interface ResponsiveImageProps {
  value: SanityImage;
  alt?: string;
  caption?: string;
  maxWidth?: number;
  className?: string;
  priority?: boolean;
}

/**
 * ResponsiveImage Component
 * Provides responsive, properly sized images for blog content
 * Maintains aspect ratios and prevents oversized displays
 */
export default function ResponsiveImage({
  value,
  alt,
  caption,
  maxWidth = 600,
  className = '',
  priority = false
}: ResponsiveImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageAlt = alt || value.alt || 'Blog content image';
  const imageUrl = urlFor(value).url();

  const handleImageError = () => {
    console.warn(`Blog content image failed to load: ${imageUrl}`);
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (imageError) {
    const fallback = FallbackImageManager.getRandomFallback();
    return (
      <figure className="my-8 flex items-center justify-center">
        <div
          className="relative overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-sage-300 bg-gray-50"
          style={{
            width: '100%',
            maxWidth: `min(${maxWidth}px, 85vw)`,
            minWidth: '280px',
            aspectRatio: '16 / 9'
          }}
        >
          <Image
            src={fallback.path}
            alt={fallback.alt}
            fill
            className="object-contain"
            style={{ padding: '2rem' }}
          />
        </div>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-gray-400 max-w-3xl mx-auto px-4">
            {caption} <span className="italic">(Image unavailable)</span>
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={`my-8 ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="animate-pulse bg-gray-200 rounded-3xl border-4 border-white shadow-xl shadow-sage-300"
          style={{
            width: '100%',
            maxWidth: `${maxWidth}px`,
            height: '400px',
            margin: '0 auto'
          }}
        />
      )}

      {/* Responsive image container */}
      <div
        className="relative mx-auto overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-sage-300 bg-gray-50"
        style={{
          width: '100%',
          maxWidth: `min(${maxWidth}px, 85vw)`,
          minWidth: '280px',
          aspectRatio: '16 / 9'
        }}
      >
        {/* Blurred Background Layer */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt=""
            fill
            priority={false}
            className="scale-110 blur-2xl opacity-50 saturate-150"
            style={{
              objectFit: 'cover',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/10" /> {/* Subtle overlay for contrast */}
        </div>

        {/* Main Foreground Image */}
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority={priority}
          className={`
            relative z-10 transition-opacity duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
          style={{
            objectFit: 'contain'
          }}
          sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, (max-width: 1024px) 65vw, 600px"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500 max-w-3xl mx-auto px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Lightweight responsive image for smaller content images
 */
export function ResponsiveImageSmall({
  value,
  alt,
  caption,
  className = ''
}: Omit<ResponsiveImageProps, 'maxWidth' | 'priority'>) {
  return (
    <ResponsiveImage
      value={value}
      alt={alt}
      caption={caption}
      maxWidth={600}
      className={className}
      priority={false}
    />
  );
}

/**
 * Full-width responsive image for hero-style content images
 */
export function ResponsiveImageFull({
  value,
  alt,
  caption,
  className = ''
}: Omit<ResponsiveImageProps, 'maxWidth'>) {
  return (
    <ResponsiveImage
      value={value}
      alt={alt}
      caption={caption}
      maxWidth={1200}
      className={className}
      priority={false}
    />
  );
}