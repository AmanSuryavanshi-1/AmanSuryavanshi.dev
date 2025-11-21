import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsEye } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';
import { format } from 'date-fns';
import { urlFor } from '@/sanity/lib/image';
import type { Post, PortableTextBlockType } from '@/sanity/sanity';
import { calculateReadTime } from './calculateReadTime';
import ViewCounter from './ViewCounter';
import { getFirstAssetFromBody } from '@/lib/asset-extraction';
import { FallbackImageManager } from '@/lib/fallback-image-manager';

interface BlogPostCardProps {
    post: Post;
    priority?: boolean;
    viewMode?: 'grid' | 'list';
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

// Tag priority order for display
const TAG_PRIORITY = ['Projects', 'Featured', 'AI Agents', 'n8n automation'];

const getPrioritizedTags = (tags: Post['tags']) => {
    if (!tags) return [];

    // Deduplicate tags based on name (to handle multiple tags with same name but different IDs)
    const uniqueTags = Array.from(new Map(tags.map(tag => [tag.name, tag])).values());

    // Sort tags: priority tags first, then others
    return uniqueTags.sort((a, b) => {
        const aPriority = TAG_PRIORITY.indexOf(a.name);
        const bPriority = TAG_PRIORITY.indexOf(b.name);

        if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
        if (aPriority !== -1) return -1;
        if (bPriority !== -1) return 1;
        return 0;
    });
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, priority = false, viewMode = 'grid' }) => {
    const readTime = calculateReadTime(post.body);

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
    const prioritizedTags = getPrioritizedTags(post.tags);

    if (viewMode === 'list') {
        return (
            <Link href={`/blogs/${post.slug.current}`} className="group block w-full">
                <article className="flex flex-col md:flex-row overflow-hidden rounded-3xl border-2 border-white backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white h-full md:h-52">
                    <div className="relative h-48 md:h-full w-full md:w-1/3 shrink-0 overflow-hidden">
                        <Image
                            src={cardImage.url}
                            alt={cardImage.alt}
                            fill
                            priority={priority}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Tags */}
                        {prioritizedTags && prioritizedTags.length > 0 && (
                            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                                {prioritizedTags.slice(0, 3).map(tag => (
                                    <span
                                        key={tag._id}
                                        className="px-2 py-1 text-[10px] font-medium rounded-full text-white backdrop-blur-md border border-white/20"
                                        style={{ backgroundColor: tag.color ? `${tag.color}dd` : '#6366f1dd' }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                                {prioritizedTags.length > 3 && (
                                    <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-white/90 text-forest-600 border border-forest-200 backdrop-blur-md">
                                        +{prioritizedTags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-5 flex flex-col justify-between w-full">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-xs text-forest-500">
                                <span className="flex items-center gap-1">
                                    <BiTime className="w-3 h-3" />
                                    {readTime} min read
                                </span>
                                <span>•</span>
                                <span>{format(new Date(post._createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                            <h2 className="text-xl font-bold text-forest-900 group-hover:text-lime-500 transition-colors duration-300 mb-2 line-clamp-1">
                                {post.title}
                            </h2>
                            <p className="text-forest-700 text-sm line-clamp-2 mb-4">
                                {extractTextFromBody(post.body)}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                                {post.author?.image && (
                                    <Image
                                        src={urlFor(post.author.image).url()}
                                        alt={post.author.name || 'Author'}
                                        width={24}
                                        height={24}
                                        sizes="24px"
                                        className="rounded-full ring-2 ring-lime-500 bg-lime-500"
                                    />
                                )}
                                <span className="text-xs font-medium text-forest-900">{post.author?.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-forest-500 text-xs">
                                <BsEye className="w-3 h-3" />
                                <ViewCounter postId={post._id} />
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    return (
        <Link href={`/blogs/${post.slug.current}`} className="group h-full">
            <article className="flex flex-col h-full overflow-hidden rounded-3xl border-4 border-white backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white">
                <div className="relative h-52 w-full overflow-hidden shrink-0">
                    <Image
                        src={cardImage.url}
                        alt={cardImage.alt}
                        fill
                        priority={priority}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Tags */}
                    {prioritizedTags && prioritizedTags.length > 0 && (
                        <div className="absolute z-10 top-3 right-3 flex flex-wrap gap-2 justify-end max-w-[80%]">
                            {prioritizedTags.slice(0, 3).map(tag => (
                                <span
                                    key={tag._id}
                                    className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full text-white backdrop-blur-md border border-white/20"
                                    style={{ backgroundColor: tag.color ? `${tag.color}dd` : '#6366f1dd' }}
                                >
                                    {tag.name}
                                </span>
                            ))}
                            {prioritizedTags.length > 3 && (
                                <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-white/90 text-forest-600 border border-forest-200 backdrop-blur-md">
                                    +{prioritizedTags.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-4 sm:p-5 py-6 sm:py-7 flex flex-col flex-grow">
                    <h2 className="text-lg line-clamp-1 sm:text-xl font-bold text-forest-900 group-hover:text-lime-500 transition-colors duration-300 mb-2">
                        {post.title}
                    </h2>
                    <p className="text-forest-700 text-xs sm:text-sm line-clamp-4 mb-4 flex-grow">
                        {extractTextFromBody(post.body)}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-t-2 border-gray-100 pt-4 mt-auto">
                        <div className="flex items-center space-x-3">
                            {post.author?.image && (
                                <Image
                                    src={urlFor(post.author.image).url()}
                                    alt={post.author.name || 'Author'}
                                    width={24}
                                    height={24}
                                    sizes="(max-width: 640px) 24px, 28px"
                                    className="rounded-full ring-2 ring-lime-500 bg-lime-500 sm:w-7 sm:h-7"
                                />
                            )}
                            <div>
                                <p className="text-[11px] sm:text-xs font-medium text-forest-900">{post.author?.name}</p>
                                <p className="text-[10px] sm:text-xs text-forest-600">
                                    {format(new Date(post._createdAt), 'MMM dd, yyyy')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-forest-600 text-[11px] sm:text-sm">
                            <span className="flex items-center gap-1">
                                <BiTime className="w-3 h-3" />
                                {readTime} min
                            </span>
                            <span className="flex items-center gap-1">
                                <BsEye className="w-3 h-3" />
                                <ViewCounter postId={post._id} />
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export const BlogPostSkeleton = ({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) => {
    if (viewMode === 'list') {
        return (
            <div className="flex flex-col md:flex-row h-full md:h-52 rounded-3xl border-2 border-white bg-white shadow-lg overflow-hidden">
                <div className="w-full md:w-1/3 h-48 md:h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
                <div className="p-5 w-full flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                        <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                        <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                        <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
                            <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                        </div>
                        <div className="h-4 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden flex flex-col">
            <div className="h-52 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
            <div className="p-5 flex flex-col flex-grow space-y-4">
                <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                <div className="space-y-2 flex-grow">
                    <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                    <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                    <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
                        <div className="space-y-1">
                            <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                            <div className="h-3 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                        </div>
                    </div>
                    <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded" />
                </div>
            </div>
        </div>
    );
};

export default BlogPostCard;
