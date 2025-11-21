import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { urlFor } from '@/sanity/lib/image';
import type { Post } from '@/sanity/sanity';

interface RelatedPost extends Omit<Post, 'readTime'> {
    readTime?: number;
}

interface RelatedPostsProps {
    posts: RelatedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="py-12 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-forest-900 mb-8">
                Read Next
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post._id}
                        href={`/blogs/${post.slug.current}`}
                        className="group flex flex-col h-full"
                    >
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl mb-4 bg-gray-100">
                            {post.mainImage && (
                                <Image
                                    src={urlFor(post.mainImage).url()}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            )}
                        </div>

                        <div className="flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs font-medium text-forest-500 mb-3">
                                <time>{format(new Date(post._createdAt), 'MMM dd, yyyy')}</time>
                                <span>•</span>
                                <span>{post.readTime || '5'} min read</span>
                            </div>

                            <h4 className="text-lg font-bold text-forest-900 mb-2 group-hover:text-lime-600 transition-colors line-clamp-2">
                                {post.title}
                            </h4>

                            <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center gap-2 text-sm font-bold text-lime-600 group-hover:text-lime-700">
                                Read Article
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
