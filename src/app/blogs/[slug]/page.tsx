import { Metadata } from 'next';
import Image from 'next/image';
import { format } from 'date-fns';

import { BiTime, BiLogoTwitter, BiLogoLinkedin, BiLogoGithub, BiGlobe } from 'react-icons/bi';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import { calculateReadTime } from '@/components/sanity/calculateReadTime';
import { client } from '@/sanity/lib/client';
import type { Post } from '@/sanity/sanity';
import { portableTextComponents } from '@/components/sanity/PortableTextComponents';

import NotFound from '@/app/not-found';
import { notFound } from 'next/navigation';
import CTA from '@/components/learn-more-about-me/CTA';
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
    keywords: post.tags?.map(t => t.name).join(', '),
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      publishedTime: post.publishedAt || post._createdAt,
      authors: post.author ? [post.author.name] : undefined,
      tags: post.tags?.map(t => t.name),
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
    mainImage,
    _createdAt,
    "readTime": round(length(pt::text(body)) / 5 / 180 )
  }`;

  const tags = post.tags?.map(t => t.slug.current) || [];
  const relatedPosts = await client.fetch(relatedPostsQuery, { slug, tags });

  return (
    <BlogErrorBoundary>
      <ReadingProgress />

      <article className="min-h-screen bg-white pb-20 lg:pb-0">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
          <BlogHeaderImage
            post={post}
            priority={true}
          />

          {/* Gradient Overlay - Stronger and darker */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-900/70 to-transparent z-10" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end pb-16 sm:pb-24 z-20">
            <div className="container mx-auto max-w-5xl px-4 sm:px-6">
              {/* Breadcrumbs */}
              <div className="mb-8 text-white/80">
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
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg text-white border border-white/20 backdrop-blur-md bg-white/10"
                      style={{
                        borderColor: tag.color ? `${tag.color}60` : 'rgba(255,255,255,0.2)'
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-shadow-sm">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-gray-200 font-medium">
                {post.author && (
                  <div className="flex items-center gap-3">
                    {post.author.image && (
                      <Image
                        src={urlFor(post.author.image).url()}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-white/30"
                      />
                    )}
                    <span>{post.author.name}</span>
                  </div>
                )}
                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
                <div className="flex items-center gap-2">
                  <BiTime className="h-5 w-5 text-lime-400" />
                  <span>{readTime} min read</span>
                </div>
                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
                <time className="flex items-center gap-2">
                  {format(new Date(post._createdAt), 'MMM dd, yyyy')}
                </time>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto max-w-[90rem] px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

            {/* Left Sidebar: Floating Actions (Desktop > 1024px) */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-32">
                <FloatingActions title={post.title} slug={post.slug.current} />
              </div>
            </div>

            {/* Center: Content */}
            <div className="lg:col-span-7 xl:col-span-7">
              <div className="prose prose-lg md:prose-xl max-w-none 
                prose-headings:font-bold prose-headings:text-forest-900 
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-lime-600 prose-a:no-underline hover:prose-a:text-lime-700 hover:prose-a:underline
                prose-strong:text-forest-800
                prose-img:rounded-2xl prose-img:shadow-lg
                prose-code:text-lime-700 prose-code:bg-lime-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                />
              </div>

              {/* All Tags Section */}
              {post.tags && <AllTags tags={post.tags} />}

              {/* Author Bio Card */}
              {post.author && (
                <div className="mt-12 mb-12 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row gap-6 items-start">
                  {post.author.image && (
                    <Image
                      src={urlFor(post.author.image).url()}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      className="rounded-full ring-4 ring-white shadow-md shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-forest-900">{post.author.name}</h3>
                      {/* Hardcoded Socials for Aman */}
                      {post.author.name.includes('Aman') && (
                        <div className="flex gap-3 text-forest-600">
                          <a href="https://twitter.com/amansuryavanshi" target="_blank" rel="noopener noreferrer" className="hover:text-[#059669] transition-colors">
                            <BiLogoTwitter size={20} />
                          </a>
                          <a href="https://linkedin.com/in/amansuryavanshi" target="_blank" rel="noopener noreferrer" className="hover:text-[#059669] transition-colors">
                            <BiLogoLinkedin size={20} />
                          </a>
                          <a href="https://github.com/amansuryavanshi" target="_blank" rel="noopener noreferrer" className="hover:text-[#059669] transition-colors">
                            <BiLogoGithub size={20} />
                          </a>
                          <a href="https://amansuryavanshi.dev" target="_blank" rel="noopener noreferrer" className="hover:text-[#059669] transition-colors">
                            <BiGlobe size={20} />
                          </a>
                        </div>
                      )}
                    </div>
                    {post.author.bio && (
                      <div className="text-forest-700 prose-sm">
                        <PortableText value={post.author.bio} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Share Bar */}
              <ShareBar title={post.title} slug={post.slug.current} />

              {/* Related Posts */}
              <RelatedPosts posts={relatedPosts} />
            </div>

            {/* Right Sidebar: Table of Contents (Desktop > 1280px) */}
            <div className="hidden xl:block xl:col-span-3">
              <TableOfContents readTime={readTime} />
            </div>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <MobileActionBar title={post.title} slug={post.slug.current} />

        {/* CTA Section */}
        <CTA />
      </article>
    </BlogErrorBoundary>
  );
}
