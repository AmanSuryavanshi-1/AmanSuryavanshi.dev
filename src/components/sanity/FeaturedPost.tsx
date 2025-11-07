import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { BsEye } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';
import { urlFor } from '@/sanity/lib/image';
import type { Post, PortableTextBlockType } from '@/sanity/sanity';
import { calculateReadTime } from './calculateReadTime';
import ViewCounter from './ViewCounter';
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
        <Link href={`/blogs/${post.slug.current}`} className="group">
            <article className={`relative overflow-hidden ${
                isSingle ? 'aspect-[16/9]' : 'aspect-[4/3]'
            } rounded-3xl shadow-lg shadow-forest-500 border-4 border-sage-100 
            bg-gradient-to-br from-lime-500 to-lime-300/10 
            hover:from-forest-900 hover:to-forest-500 
            transition-all duration-300 group`}>
                {/* Main Image with Gradient Overlay */}
                <Image
                    src={cardImage.url}
                    alt={cardImage.alt}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/95 to-transparent"></div>

                {/* Featured Badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                    <div className="flex items-center gap-1.5 bg-lime-500/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-md">
                        <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-900 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-forest-900"></span>
                        </span>
                        <span className="text-forest-900 font-medium text-[10px] sm:text-xs">Featured</span>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-sage-100">
                    {/* Categories */}
                    {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                            {post.categories
                                .filter(category => category.title.toLowerCase() !== 'featured')
                                .map(category => (
                                    <span
                                        key={category._id}
                                        className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-forest-900 border-2 bg-opacity-80 border-white text-sage-100 backdrop-blur-sm rounded-full group-hover:bg-lime-500 group-hover:text-forest-900 transition-colors duration-300"
                                    >
                                        {category.title}
                                    </span>
                                ))
                            }
                        </div>
                    )}

                    {/* Title & Description */}
                    <div className="space-y-1.5 sm:space-y-2">
                        <h2 className={`font-heading ${
                            isSingle 
                                ? 'text-xl sm:text-3xl md:text-4xl' 
                                : 'text-lg sm:text-xl md:text-2xl'
                        } font-bold leading-tight group-hover:text-lime-500 transition-colors duration-300`}>
                            {post.title}
                        </h2>
                        
                        <p className={`text-lime-100 line-clamp-2 sm:line-clamp-3 ${
                            isSingle 
                                ? 'text-sm sm:text-base md:text-lg group-hover:text-lime-700' 
                                : 'text-xs sm:text-sm md:text-base group-hover:text-sage-300'
                        }`}>
                            {excerpt}
                        </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-lime-500 gap-3 sm:gap-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {post.author?.image && (
                                <Image
                                    src={urlFor(post.author.image).url()}
                                    alt={post.author.name || 'Author'}
                                    width={24}
                                    height={24}
                                    className="rounded-full ring-2 bg-lime-500 ring-sage-100 group-hover:ring-lime-500 transition-colors duration-300 sm:w-8 sm:h-8"
                                />
                            )}
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-sage-100">{post.author?.name}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1 text-sage-100">
                                <BiTime className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>{readTime} min read</span>
                            </div>
                            <div className="flex items-center gap-1 text-sage-100">
                                <BsEye className="h-3 w-3 sm:h-4 sm:w-4" />
                                <ViewCounter postId={post._id} />
                            </div>
                            <time className="flex items-center gap-1 text-sage-100 ">
                                {format(new Date(post._createdAt), 'MMM dd, yyyy')}
                            </time>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default FeaturedPost;
