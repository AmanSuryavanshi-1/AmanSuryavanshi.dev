'use client';

import React from 'react';
import { useImageGallery } from '@/context/ImageGalleryContext';
import { urlFor } from '@/sanity/lib/image';

interface ZoomableBlogImageProps {
    value: {
        asset?: any;
        _ref?: string;
        url?: string;
        src?: string;
        imageUrl?: string;
        alt?: string;
        caption?: string;
    };
    className?: string;
}

export default function ZoomableBlogImage({ value, className }: ZoomableBlogImageProps) {
    const { registerImage, openGallery, images } = useImageGallery();
    const [error, setError] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(true);

    const alt = value?.alt || 'Blog Image';
    const caption = value?.caption;

    React.useEffect(() => {
        // Priority order for URL resolution:
        // 1. Direct URL string (url, src, imageUrl)
        // 2. Sanity asset reference

        const directUrl = value?.url || value?.src || value?.imageUrl;

        if (directUrl && typeof directUrl === 'string' && directUrl.startsWith('http')) {
            // Direct URL (Cloudinary, etc.)
            console.log('[ZoomableBlogImage] Using direct URL:', directUrl);
            setImageUrl(directUrl);
            setIsLoading(false);
            return;
        }

        // Try Sanity asset
        const asset = value?.asset || (value?._ref ? value : null);

        if (asset) {
            try {
                const url = urlFor(asset).url();
                if (url) {
                    console.log('[ZoomableBlogImage] Using Sanity asset URL:', url);
                    setImageUrl(url);
                } else {
                    console.error('[ZoomableBlogImage] urlFor returned empty');
                    setError(true);
                }
            } catch (err) {
                console.error('[ZoomableBlogImage] Error generating Sanity URL:', err);
                setError(true);
            }
        } else {
            console.warn('[ZoomableBlogImage] No valid image source found:', value);
            setError(true);
        }

        setIsLoading(false);
    }, [value]);

    React.useEffect(() => {
        if (imageUrl) {
            registerImage({ src: imageUrl, alt: alt });
        }
    }, [imageUrl, alt, registerImage]);

    // Determine sizing based on aspect ratio if available
    const dimensions = value?.asset?.metadata?.dimensions;
    const aspectRatio = dimensions ? dimensions.width / dimensions.height : 1.5;
    const isTall = aspectRatio < 0.6;

    const sizingClass = isTall
        ? "w-full max-w-3xl mx-auto"
        : "h-auto max-h-[70vh] w-auto mx-auto object-contain";

    if (isLoading) {
        return (
            <div className="my-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm animate-pulse">
                Loading image...
            </div>
        );
    }

    if (error || !imageUrl) {
        return (
            <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                ⚠️ Image could not be loaded
            </div>
        );
    }

    return (
        <figure className={`my-4 flex flex-col items-center ${className || ''}`}>
            <div
                className={`relative overflow-hidden cursor-zoom-in group ${isTall ? 'w-full' : 'w-auto'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    const index = images.findIndex(img => img.src === imageUrl);
                    if (index !== -1) openGallery(index);
                }}
            >
                <img
                    src={imageUrl}
                    alt={alt}
                    onError={() => setError(true)}
                    className={`${sizingClass} rounded-xl shadow-lg border border-sage-100 transition-transform duration-300 hover:scale-[1.01]`}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <span className="bg-white/90 text-forest-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                        Click to Expand
                    </span>
                </div>
            </div>
            {caption && (
                <figcaption className="mt-3 text-center text-sm text-forest-500 italic font-serif max-w-2xl px-4">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}


