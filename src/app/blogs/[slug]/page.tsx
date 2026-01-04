import { Metadata } from 'next';
import Image from 'next/image';
import { format } from 'date-fns';

import { BiTime, BiLogoLinkedin, BiLogoGithub, BiGlobe } from 'react-icons/bi';
import { FaXTwitter } from 'react-icons/fa6';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import { calculateReadTime } from '@/components/sanity/calculateReadTime';
import { client } from '@/sanity/lib/client';
import type { Post } from '@/sanity/sanity';
import { portableTextComponents } from '@/components/sanity/PortableTextComponents';

import NotFound from '@/app/not-found';
import { notFound } from 'next/navigation';
import CTA from '@/components/about-page/CTA';
import BlogHeaderImage from '@/components/blog/BlogHeaderImage';
import { getOpenGraphImage, getTwitterCardImage } from '@/lib/metadata-utils';
import { BlogErrorBoundary } from '@/components/blog/BlogErrorBoundary';
import ReadingProgress from '@/components/blog/ReadingProgress';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import TableOfContents from '@/components/blog/TableOfContents';
import FloatingActions from '@/components/blog/FloatingActions';
import MobileActionBar from '@/components/blog/MobileActionBar';
import RelatedPosts from '@/components/blog/RelatedPosts';
import ShareBar from '@/components/blog/ShareBar';
import AllTags from '@/components/blog/AllTags';
import BlogImageGalleryWrapper from '@/components/blog/BlogImageGalleryWrapper';
import ScrollIndicator from '@/components/blog/ScrollIndicator';

type NextPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string): Promise<Post | null> {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    slug,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          ...,
          metadata {
            dimensions
          }
        }
      },
      _type == "video" => {
        "videoUrl": videoFile.asset->url,
        caption,
        alt
      }
    },
    excerpt,
    mainImage,
    views,
    author->{
      _id,
      name,
      image,
      bio
    },
    tags[]->{
      _id,
      name,
      slug,
      color
    },
    status,
    seoTitle,
    metaDescription,
    viewCount
  }`;

  try {
    const post = await client.fetch<Post>(query, { slug });

    // If no author, fetch default author (Aman Suryavanshi)
    if (post && !post.author) {
      const defaultAuthorQuery = `*[_type == "author" && name == "Aman Suryavanshi"][0]{
        _id,
        name,
        image,
        bio
      }`;
      const defaultAuthor = await client.fetch(defaultAuthorQuery);
      if (defaultAuthor) {
        post.author = defaultAuthor;
      }
    }

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const title = post.seoTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const openGraphImage = getOpenGraphImage(post);
  const twitterCardImage = getTwitterCardImage(post);

  return {
    title: `${title} | Aman Suryavanshi`,
    description: description,
    keywords: post.tags?.filter(t => t && t.name).map(t => t.name).join(', '),
    keywords: post.tags?.filter(t => t && t.name).map(t => t.name).join(', '),
    authors: post.author ? [{ name: post.author.name }] : undefined,
    alternates: {
      canonical: `https://amansuryavanshi.me/blogs/${slug}`,
    },
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      publishedTime: post.publishedAt || post._createdAt,
      authors: post.author ? [post.author.name] : undefined,
      tags: post.tags?.filter(t => t && t.name).map(t => t.name),
      images: [openGraphImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [twitterCardImage],
    },
  };
}

export default async function BlogPost({ params }: NextPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <NotFound />
    );
  }

  const readTime = calculateReadTime(post.body);

  // Fetch related posts
  const relatedPostsQuery = `*[_type == "post" && slug.current != $slug && count((tags[]->slug.current)[@ in $tags]) > 0] | order(_createdAt desc)[0...3]{
    _id,
    title,
    slug,
    excerpt,
    metaDescription,
    mainImage,
    _createdAt,
    "readTime": round(length(pt::text(body)) / 5 / 180 ),
    "fallbackExcerpt": pt::text(body)[0...160]
  }`;

  const tags = post.tags?.filter(t => t && t.slug)?.map(t => t.slug.current) || [];
  const relatedPosts = await client.fetch(relatedPostsQuery, { slug, tags });

  return (
    <BlogImageGalleryWrapper>
      <BlogErrorBoundary>
        <ReadingProgress />

        <article className="min-h-screen pb-20 lg:pb-0">
          {/* Hero Section - Optimized for Immersive Reading */}
          <div className="relative h-[65vh] min-h-[500px] w-full bg-[#0a1f15] overflow-hidden">
            {/* The Image with CSS Mask for Seamless Blend */}
            <div className="absolute inset-0 z-0
                [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]
                [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
              <BlogHeaderImage
                post={post}
                priority={true}
                className="scale-105" // Slight scale for parallax feel
              />
            </div>

            {/* Subtle Gradient Overlay for extra text pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f15] via-transparent to-black/30 z-10 opacity-80" />

            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col justify-end pb-20 sm:pb-24 z-20">
              <div className="container mx-auto max-w-5xl px-4 sm:px-6">
                {/* Breadcrumbs */}
                <div className="mb-8 text-sage-200/80 font-medium">
                  <Breadcrumbs
                    items={[
                      { label: 'Blog', href: '/blogs' },
                      { label: post.title }
                    ]}
                  />
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {post.tags.filter(tag => tag && tag.name).slice(0, 4).map((tag) => (
                      <span
                        key={tag._id}
                        className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg text-sage-100 border border-sage-200/20 backdrop-blur-md bg-white/5 shadow-sm"
                        style={{
                          borderColor: tag.color ? `${tag.color}60` : 'rgba(255,255,255,0.2)'
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-sage-100/90 font-medium tracking-wide">
                  {post.author && (
                    <div className="flex items-center gap-3 bg-white/5 pr-4 pl-1 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                      {post.author.image && (
                        <Image
                          src={urlFor(post.author.image).url()}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="rounded-full ring-2 ring-lime-500/50"
                        />
                      )}
                      <span className="text-white font-semibold">{post.author.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <BiTime className="h-5 w-5 text-lime-400 drop-shadow-md" />
                    <span className="drop-shadow-sm">{readTime} min read</span>
                  </div>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-lime-500" />
                  <time className="flex items-center gap-2 drop-shadow-sm">
                    {format(new Date(post._createdAt), 'MMM dd, yyyy')}
                  </time>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <ScrollIndicator />
          </div>

          {/* Main Content Area */}
          <div className="container mx-auto max-w-[90rem] px-4 sm:px-6 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

              {/* Left Sidebar: Floating Actions (Desktop > 1024px) */}
              <div className="hidden lg:block lg:col-span-2">
                <div className="sticky top-32">
                  <FloatingActions title={post.title} slug={post.slug.current} />
                </div>
              </div>

              {/* Center: Content */}
              <div className="lg:col-span-7 xl:col-span-7">
                <div className="prose prose-lg md:prose-xl max-w-none text-forest-900
                  prose-headings:font-serif prose-headings:font-bold prose-headings:!text-forest-900
                  prose-h2:!text-forest-900 prose-h3:!text-forest-900 prose-h4:!text-forest-900
                  prose-p:!text-forest-900 prose-p:leading-relaxed
                  prose-li:!text-forest-900 prose-ul:!text-forest-900 prose-ol:!text-forest-900
                  prose-blockquote:!text-forest-900 prose-blockquote:border-l-forest-500
                  prose-strong:!text-forest-900
                  prose-th:!text-forest-900 prose-td:!text-forest-900
                  prose-figcaption:!text-forest-900
                  prose-a:text-lime-600 prose-a:no-underline hover:prose-a:text-lime-700 hover:prose-a:underline
                  prose-img:rounded-2xl prose-img:shadow-lg
                  prose-code:!text-lime-700 prose-code:bg-lime-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                  <PortableText
                    value={post.body}
                    components={portableTextComponents}
                  />
                </div>

                {/* All Tags Section */}
                {post.tags && <AllTags tags={post.tags} />}

                {/* Author Bio Card */}
                {post.author && (
                  <div className="mt-12 mb-12 p-8 bg-gradient-to-br from-sage-50 to-white dark:from-[#0f291e] dark:to-[#0a1f15] rounded-2xl border border-sage-200 dark:border-forest-800 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                    {post.author.image && (
                      <Image
                        src={urlFor(post.author.image).url()}
                        alt={post.author.name}
                        width={80}
                        height={80}
                        className="rounded-full ring-4 ring-white dark:ring-forest-700 shadow-md shrink-0"
                      />
                    )}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h3 className="text-xl font-bold text-forest-900 dark:text-sage-100">{post.author.name}</h3>
                        {/* Hardcoded Socials for Aman */}
                        {post.author.name.includes('Aman') && (
                          <div className="flex gap-3 text-forest-700 dark:text-sage-400">
                            <a href="https://twitter.com/_AmanSurya" target="_blank" rel="noopener noreferrer" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors p-1.5 hover:bg-sage-100 dark:hover:bg-forest-800 rounded-lg">
                              <FaXTwitter size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/amansuryavanshi-ai/" target="_blank" rel="noopener noreferrer" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors p-1.5 hover:bg-sage-100 dark:hover:bg-forest-800 rounded-lg">
                              <BiLogoLinkedin size={20} />
                            </a>
                            <a href="https://github.com/AmanSuryavanshi-1" target="_blank" rel="noopener noreferrer" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors p-1.5 hover:bg-sage-100 dark:hover:bg-forest-800 rounded-lg">
                              <BiLogoGithub size={20} />
                            </a>
                            <a href="https://amansuryavanshi.me" target="_blank" rel="noopener noreferrer" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors p-1.5 hover:bg-sage-100 dark:hover:bg-forest-800 rounded-lg">
                              <BiGlobe size={20} />
                            </a>
                          </div>
                        )}
                      </div>
                      {post.author.bio && (
                        <div className="text-forest-700 dark:text-sage-300 prose-sm dark:prose-invert leading-relaxed">
                          <PortableText value={post.author.bio} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Share Bar */}
                <ShareBar title={post.title} slug={post.slug.current} />

                {/* Related Posts */}

              </div>

              {/* Right Sidebar: Table of Contents (Desktop > 1280px) */}
              <div className="hidden xl:block xl:col-span-3">
                <TableOfContents readTime={readTime} />
              </div>
            </div>
          </div>

          {/* Mobile Action Bar */}
          <MobileActionBar title={post.title} slug={post.slug.current} />

          {/* Related Posts Section - Full Width */}
          <RelatedPosts posts={relatedPosts} />

          {/* CTA Section */}
          <CTA />
        </article>
      </BlogErrorBoundary>
    </BlogImageGalleryWrapper>
  );
}
