'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { urlFor } from '@/sanity/lib/image';
import type { Post, PortableTextBlockType } from '@/sanity/sanity';
import { calculateReadTime } from './calculateReadTime';
import { getFirstAssetFromBody } from '@/lib/asset-extraction';
import { FallbackImageManager } from '@/lib/fallback-image-manager';

interface FeaturedCarouselProps {
    posts: Post[];
}

const extractTextFromBody = (body: PortableTextBlockType[] | undefined): string => {
    if (!body) return '';
    let text = '';
    body.forEach(block => {
        if (block._type === 'block') {
            block.children.forEach((child) => {
                if (child._type === 'span' && child.text) {
                    text += child.text + ' ';
                }
            });
        }
    });
    return text.trim().slice(0, 150) + (text.length > 150 ? '...' : '');
};

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ posts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const thumbnailsRef = useRef<HTMLDivElement>(null);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || posts.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % posts.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [isAutoPlaying, posts.length]);

    // Scroll active thumbnail into view (Container only)
    useEffect(() => {
        if (thumbnailsRef.current) {
            const activeThumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement;
            if (activeThumbnail) {
                const container = thumbnailsRef.current;
                const scrollLeft = activeThumbnail.offsetLeft - (container.clientWidth / 2) + (activeThumbnail.clientWidth / 2);

                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentIndex]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, [posts.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    }, [posts.length]);

    if (!posts || posts.length === 0) return null;

    const currentPost = posts[currentIndex];
    const readTime = calculateReadTime(currentPost.body);
    const excerpt = extractTextFromBody(currentPost.body);

    // Helper to get image URL safely (handles both Sanity assets and external URLs)
    const getImageUrl = (post: Post) => {
        if (post.mainImage) return urlFor(post.mainImage).url();
        const firstAsset = getFirstAssetFromBody(post.body);
        if (firstAsset) {
            // Handle external images with direct URLs
            if (firstAsset.isExternal && 'url' in firstAsset.image) {
                return firstAsset.image.url;
            }
            // Handle Sanity images with asset references
            return urlFor(firstAsset.image).url();
        }
        return FallbackImageManager.getRandomFallback().path;
    };

    const currentImage = getImageUrl(currentPost);

    return (
        <div
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Main Hero Card */}
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:bg-forest-900 dark:border-forest-800 transition-all duration-500 group hover:shadow-forest-900/20">

                {/* Navigation Arrows (Absolute Edges of Card) */}
                <div className="absolute inset-y-0 left-0 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <button
                        onClick={handlePrev}
                        className="pointer-events-auto p-3 m-4 rounded-full bg-white/90 dark:bg-forest-900/90 text-forest-900 dark:text-white shadow-lg backdrop-blur-md hover:scale-110 transition-all border border-gray-100 dark:border-forest-700 hover:bg-lime-500 hover:text-white hover:border-lime-500"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <button
                        onClick={handleNext}
                        className="pointer-events-auto p-3 m-4 rounded-full bg-white/90 dark:bg-forest-900/90 text-forest-900 dark:text-white shadow-lg backdrop-blur-md hover:scale-110 transition-all border border-gray-100 dark:border-forest-700 hover:bg-lime-500 hover:text-white hover:border-lime-500"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row h-full min-h-[400px] lg:h-[450px]">

                    {/* Left: Image Section */}
                    <div className="relative w-full lg:w-1/2 h-[250px] lg:h-full overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPost._id}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={currentImage}
                                    alt={currentPost.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Featured Badge */}
                        <div className="absolute top-6 left-6 z-10">
                            <span className="px-4 py-1.5 bg-lime-500 text-forest-900 text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                Featured
                            </span>
                        </div>
                    </div>

                    {/* Right: Content Section */}
                    <div className="relative w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center bg-white dark:bg-forest-900">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPost._id}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="space-y-4 lg:space-y-6"
                            >
                                {/* Metadata */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    {currentPost.tags && currentPost.tags.length > 0 && (
                                        <span className="px-3 py-1 bg-forest-50 text-forest-700 dark:bg-forest-800 dark:text-lime-400 rounded-full text-xs font-bold uppercase tracking-wide">
                                            {currentPost.tags[0].name}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        <span>{format(new Date(currentPost._createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        <span>{readTime} min read</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-forest-900 dark:text-white leading-tight line-clamp-2">
                                    <Link href={`/blogs/${currentPost.slug.current}`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                        {currentPost.title}
                                    </Link>
                                </h2>

                                {/* Excerpt */}
                                <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg leading-relaxed line-clamp-3">
                                    {excerpt}
                                </p>

                                {/* Author & CTA */}
                                <div className="flex items-center justify-between pt-6 lg:pt-8 border-t border-gray-100 dark:border-forest-800">
                                    <div className="flex items-center gap-3">
                                        {currentPost.author?.image && (
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-lime-500/20">
                                                <Image
                                                    src={urlFor(currentPost.author.image).url()}
                                                    alt={currentPost.author.name || 'Author'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-forest-900 dark:text-white">
                                                {currentPost.author?.name || 'Unknown Author'}
                                            </span>
                                            <span className="text-xs text-gray-500">Author</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/blogs/${currentPost.slug.current}`}
                                        className="group/btn relative inline-flex items-center gap-2 px-6 py-3 border-2 border-lime-500 shadow-[4px_4px_0px_0px_rgba(132,204,22,1)] rounded-xl bg-transparent text-forest-900 dark:text-lime-400 overflow-hidden transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                                            <span className="lg:hidden">Read</span>
                                            <span className="hidden lg:inline">Read Article</span>
                                            <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Thumbnails Strip & Dots */}
            {posts.length > 1 && (
                <div className="mt-8 mb-8 flex flex-col items-center gap-6">
                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-3">
                        {posts.map((_, index) => (
                            <button
                                key={`dot-${index}`}
                                onClick={() => setCurrentIndex(index)}
                                className={`rounded-full transition-all duration-500 ${index === currentIndex
                                    ? 'bg-forest-900 w-8 h-2'
                                    : 'bg-forest-500 w-2 h-2 hover:bg-forest-700'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Thumbnails */}
                    <div
                        ref={thumbnailsRef}
                        className="flex gap-4 overflow-x-auto py-4 px-4 sm:px-6 md:px-8 scrollbar-hide w-full max-w-3xl snap-x snap-mandatory justify-center"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {posts.map((post, index) => (
                            <button
                                key={post._id}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative flex-shrink-0 w-28 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden transition-all duration-500 snap-center ${index === currentIndex
                                    ? 'ring-4 ring-lime-500 scale-110 opacity-100 shadow-xl z-10'
                                    : 'opacity-40 hover:opacity-100 scale-90 grayscale hover:grayscale-0'
                                    }`}
                            >
                                <Image
                                    src={getImageUrl(post)}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturedCarousel;
