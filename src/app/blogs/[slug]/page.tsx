import { Metadata } from 'next';
import Image from 'next/image';
import { format } from 'date-fns';
import { BsEye } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import { calculateReadTime } from '@/components/sanity/calculateReadTime';
import { client } from '@/sanity/lib/client';
import type { Post } from '@/sanity/sanity';
import ShareButtons from '@/components/sanity/ShareButtons';
import { portableTextComponents } from '@/components/sanity/PortableTextComponents';
import ViewCounter from '@/components/sanity/ViewCounter';
import NotFound from '@/app/not-found';
import { notFound } from 'next/navigation';
import CTA from '@/components/learn-more-about-me/CTA';
import BlogHeaderImage from '@/components/blog/BlogHeaderImage';
import { getOpenGraphImage, getTwitterCardImage } from '@/lib/metadata-utils';
import { BlogErrorBoundary } from '@/components/blog/BlogErrorBoundary';
import ReadingProgress from '@/components/blog/ReadingProgress';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import TableOfContents from '@/components/blog/TableOfContents';

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

  return (
    <BlogErrorBoundary>
      <ReadingProgress />

      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
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
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Sidebar: Share (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <ShareButtons
                  title={post.title}
                  url={`${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${post.slug.current}`}
                  vertical
                />
              </div>
            </div>

            {/* Center: Content */}
            <div className="lg:col-span-8">
              <div className="prose prose-lg md:prose-xl max-w-none 
                prose-headings:font-bold prose-headings:text-forest-900 
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-lime-600 prose-a:no-underline hover:prose-a:text-lime-700 hover:prose-a:underline
                prose-strong:text-forest-800
                prose-blockquote:border-l-4 prose-blockquote:border-lime-500 prose-blockquote:bg-sage-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-img:rounded-2xl prose-img:shadow-lg
                prose-code:text-lime-700 prose-code:bg-lime-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                />
              </div>

              {/* Mobile Share */}
              <div className="lg:hidden mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-forest-900 mb-4">Share this article</h3>
                <ShareButtons
                  title={post.title}
                  url={`${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${post.slug.current}`}
                />
              </div>

              {/* Author Bio Box */}
              {post.author && (
                <div className="mt-16 p-8 bg-sage-50 rounded-3xl border border-sage-100 flex flex-col sm:flex-row gap-6 items-start">
                  {post.author.image && (
                    <Image
                      src={urlFor(post.author.image).url()}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      className="rounded-full ring-4 ring-white shadow-md shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-forest-900 mb-2">About {post.author.name}</h3>
                    {post.author.bio && (
                      <div className="text-forest-700 prose-sm">
                        <PortableText value={post.author.bio} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Table of Contents */}
            <div className="hidden lg:block lg:col-span-3">
              <TableOfContents />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <CTA />
      </article>
    </BlogErrorBoundary>
  );
}
