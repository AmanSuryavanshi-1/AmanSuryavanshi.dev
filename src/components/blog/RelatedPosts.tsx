import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { urlFor } from '@/sanity/lib/image';
import type { Post } from '@/sanity/sanity';

interface RelatedPost extends Omit<Post, 'readTime'> {
    readTime?: number;
    fallbackExcerpt?: string;
    metaDescription?: string;
}

interface RelatedPostsProps {
    posts: RelatedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="py-20 border-t border-forest-100 dark:border-forest-800/50 bg-forest-50/30 dark:bg-[#0a1f15]">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-3 mb-10">
                    <span className="w-10 h-[1px] bg-lime-500/50"></span>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-forest-900 dark:text-sage-100">
                        Browse More <span className="text-lime-600 dark:text-lime-400">Blogs</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Link
                            key={post._id}
                            href={`/blogs/${post.slug.current}`}
                            className="group flex flex-col h-full bg-white dark:bg-[#162c22]/80 border border-forest-100 dark:border-white/5 rounded-2xl overflow-hidden hover:border-lime-500/50 hover:shadow-lg dark:hover:shadow-lime-900/10 transition-all duration-300"
                        >
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest-100 dark:bg-forest-900">
                                {post.mainImage && (
                                    <Image
                                        src={urlFor(post.mainImage).url()}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="flex flex-col flex-grow p-5 sm:p-6">
                                <div className="flex items-center gap-2 text-xs font-semibold text-lime-600 dark:text-lime-400 mb-3 tracking-wide uppercase">
                                    <span className="bg-lime-50/50 dark:bg-lime-900/20 px-2 py-0.5 rounded border border-lime-100 dark:border-lime-500/20">
                                        Article
                                    </span>
                                    <span className="text-forest-400 dark:text-forest-600">•</span>
                                    <span className="text-forest-500 dark:text-sage-400 normal-case">{post.readTime || '5'} min read</span>
                                </div>

                                <h4 className="text-lg font-bold text-forest-900 dark:text-sage-100 mb-3 group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors line-clamp-2 leading-tight">
                                    {post.title}
                                </h4>

                                <p className="text-forest-600 dark:text-sage-300 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
                                    {post.excerpt || post.metaDescription || post.fallbackExcerpt || "Explore this article to learn more about the topic."}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-bold text-lime-600 dark:text-lime-500 group-hover:underline decoration-2 underline-offset-4 decoration-lime-500/30">
                                    Read Article
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

