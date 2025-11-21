'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import type { SanityImage } from '@/sanity/sanity';

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
    return (
      <figure className="my-8 flex items-center justify-center">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center max-w-md">
          <div className="text-gray-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Image could not be loaded</p>
          {caption && (
            <figcaption className="mt-2 text-xs text-gray-400">
              {caption}
            </figcaption>
          )}
        </div>
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