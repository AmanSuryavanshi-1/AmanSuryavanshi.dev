import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { BiTime } from 'react-icons/bi';
import { urlFor } from '@/sanity/lib/image';
import type { Post, PortableTextBlockType } from '@/sanity/sanity';
import { calculateReadTime } from './calculateReadTime';

import { getFirstAssetFromBody } from '@/lib/asset-extraction';
import { FallbackImageManager } from '@/lib/fallback-image-manager';

interface FeaturedPostProps {
    post: Post;
    isSingle: boolean; // New prop to determine if it's a single post
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

    return text.trim().slice(0, 200) + (text.length > 200 ? '...' : '');
};

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post, isSingle }) => {
    if (!post) return null;

    const readTime = calculateReadTime(post.body);
    const excerpt = extractTextFromBody(post.body);

    // Smart header image selection: mainImage → first asset → fallback
    const getCardImage = () => {
        if (post.mainImage) {
            return {
                url: urlFor(post.mainImage).url(),
                alt: post.mainImage.alt || post.title
            };
        }

        const firstAsset = getFirstAssetFromBody(post.body);
        if (firstAsset) {
            return {
                url: urlFor(firstAsset.image).url(),
                alt: firstAsset.alt || post.title
            };
        }

        const fallback = FallbackImageManager.getRandomFallback();
        return {
            url: fallback.path,
            alt: fallback.alt
        };
    };

    const cardImage = getCardImage();

    return (
        <Link href={`/blogs/${post.slug.current}`} className="group block h-full">
            <article className={`relative overflow-hidden h-full ${isSingle ? 'aspect-[16/9]' : 'aspect-[4/5] md:aspect-[4/3] lg:aspect-[4/3]'
                } rounded-[2rem] shadow-xl shadow-forest-900/5 border border-white/20 
            bg-forest-900
            transition-all duration-500 ease-out
            hover:shadow-2xl hover:shadow-lime-500/10 hover:-translate-y-1`}>

                {/* Main Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={cardImage.url}
                        alt={cardImage.alt}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Stronger Gradient Overlay - No opacity reduction on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-900/80 to-transparent opacity-90" />

                    {/* Subtle Hover Tint - Reduced intensity */}
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Featured Badge */}
                <div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-lg">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                        </span>
                        <span className="text-white font-semibold text-xs tracking-wide uppercase">Featured</span>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 xl:p-8 z-10">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                            {post.tags
                                .filter(t => t.name.toLowerCase() !== 'featured' && t.slug?.current !== 'featured')
                                .slice(0, 3)
                                .map(tag => (
                                    <span
                                        key={tag._id}
                                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-md sm:rounded-lg text-white/90 bg-white/10 backdrop-blur-md border border-white/10"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                        </div>
                    )}

                    {/* Title & Description */}
                    <div className="space-y-2">
                        <h2 className={`font-heading ${isSingle
                            ? 'text-2xl sm:text-4xl md:text-5xl'
                            : 'text-base sm:text-lg md:text-xl xl:text-2xl'
                            } font-bold leading-tight text-white group-hover:text-lime-400 transition-colors duration-300 line-clamp-2`}>
                            {post.title.split(' ').length > 10
                                ? post.title.split(' ').slice(0, 10).join(' ') + '...'
                                : post.title}
                        </h2>

                        <p className={`text-gray-300 font-light leading-relaxed ${isSingle
                            ? 'text-base sm:text-lg max-w-2xl line-clamp-2'
                            : 'text-[10px] sm:text-xs xl:text-sm line-clamp-1 xl:line-clamp-2'
                            }`}>
                            {excerpt}
                        </p>
                    </div>

                    {/* Metadata - Structured Layout */}
                    <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between gap-4">
                            {/* Author */}
                            <div className="flex items-center gap-2 min-w-0">
                                {post.author?.image && (
                                    <Image
                                        src={urlFor(post.author.image).url()}
                                        alt={post.author.name || 'Author'}
                                        width={24}
                                        height={24}
                                        className="rounded-full ring-2 ring-white/20 w-5 h-5 sm:w-6 sm:h-6 shrink-0"
                                    />
                                )}
                                <span className="text-white text-xs font-medium truncate">{post.author?.name}</span>
                            </div>

                            {/* Date & Time */}
                            <div className="flex flex-col items-end text-[10px] sm:text-xs text-gray-400 font-medium shrink-0 leading-tight">
                                <time className="text-gray-300">{format(new Date(post._createdAt), 'MMM d, yyyy')}</time>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <BiTime className="w-3 h-3 text-lime-500" />
                                    <span>{readTime} min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default FeaturedPost;
