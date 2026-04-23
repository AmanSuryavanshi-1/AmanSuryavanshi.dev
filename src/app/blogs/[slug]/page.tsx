import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { BiTime, BiLogoLinkedin, BiLogoGithub, BiGlobe } from 'react-icons/bi';
import { FaXTwitter } from 'react-icons/fa6';
import { Bookmark, MessageSquare, ExternalLink, Users } from 'lucide-react';
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
import { getOpenGraphImage, getTwitterCardImage, getMetadataImageUrl } from '@/lib/metadata-utils';
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
import ViewTracker from '@/components/blog/ViewTracker';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type NextPageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.amansuryavanshi.me';

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
      _type == "externalImage" => {
        _type,
        _key,
        url,
        alt,
        caption
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
    likes,
    author->{
      _id,
      name,
      image,
      bio
    },
    tags[]{
      _key,
      "label": coalesce(label, @->name),
      "slug": coalesce(slug, @->slug.current),
      "color": @->color
    },
    status,
    seoTitle,
    metaDescription,
    viewCount,
    // SEO & AI fields
    focusKeyword,
    articleType,
    estimatedReadTime,
    canonicalUrl,
    publishedAt,
    primaryKeyword,
    secondaryKeywords,
    quotableSnippet,
    contentSummary,
    faqItems[]{
      _key,
      question,
      answer
    },
    keyTakeaways,
    internal_links[]{
      _key,
      anchor_text,
      context,
      url
    },
    cta_type,
    cta_text,
    primary_category->{
      title,
      slug
    },
    subcategory,
    aiSeoScore
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
  const description = post.metaDescription || post.seoDescription || post.excerpt;
  const openGraphImage = getOpenGraphImage(post);
  const twitterCardImage = getTwitterCardImage(post);

  return {
    title: `${title} | Aman Suryavanshi`,
    description: description,
    keywords: [
      post.primaryKeyword,
      ...(post.secondaryKeywords || []),
      ...(post.tags?.filter(t => t && t.label).map(t => t.label) || [])
    ].filter(Boolean).join(', '),
    authors: post.author ? [{ name: post.author.name }] : undefined,
    alternates: {
      canonical: post.canonicalUrl || `${SITE_URL}/blogs/${slug}`,
    },
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      publishedTime: post.publishedAt || post._createdAt,
      authors: post.author ? [post.author.name] : undefined,
      tags: post.tags?.filter(t => t && t.label).map(t => t.label),
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

export default async function BlogPost({ params }: NextPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <NotFound />
    );
  }

  const readTime = calculateReadTime(post.body);
  const siteUrl = SITE_URL;
  const canonicalUrl = post.canonicalUrl || `${siteUrl}/blogs/${post.slug.current}`;

  const normalizedSubcategory = post.subcategory?.trim();
  const primaryCategorySlug = post.primary_category?.slug?.current;
  const categoryQuery = primaryCategorySlug ? encodeURIComponent(primaryCategorySlug) : '';
  const subcategoryQuery = normalizedSubcategory
    ? encodeURIComponent(normalizedSubcategory.toLowerCase().replace(/\s+/g, '-'))
    : '';

  const breadcrumbItems = post.primary_category
    ? [
      {
        label: post.primary_category.title,
        href: categoryQuery ? `/blogs?category=${categoryQuery}` : undefined,
      },
      ...(normalizedSubcategory
        ? [{
          label: normalizedSubcategory,
          href: categoryQuery ? `/blogs?category=${categoryQuery}&sub=${subcategoryQuery}` : undefined,
        }]
        : []),
      { label: post.title },
    ]
    : [
      { label: 'Blog', href: '/blogs' },
      { label: post.title },
    ];

  const breadcrumbPathItems = [
    { name: 'Home', item: siteUrl },
    ...breadcrumbItems.map((item, index) => ({
      name: item.label,
      item: item.href
        ? `${siteUrl}${item.href}`
        : (index === breadcrumbItems.length - 1 ? canonicalUrl : `${siteUrl}/blogs`),
    })),
  ];

  const organizationPublisher = {
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: 'Aman Suryavanshi',
    url: siteUrl,
    sameAs: [
      'https://www.linkedin.com/in/amansuryavanshi-ai/',
      'https://twitter.com/_AmanSurya',
      'https://github.com/AmanSuryavanshi-1',
    ],
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/Profile/PFP-Cricular.webp`,
    },
  };

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.seoDescription || post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Aman Suryavanshi',
      url: siteUrl,
    },
    datePublished: post.publishedAt || post._createdAt,
    dateModified: post._updatedAt || post._createdAt,
    image: getMetadataImageUrl(post),
    publisher: organizationPublisher,
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    articleSection: post.articleType || 'Technology',
    keywords: post.tags?.filter(t => t && t.label).map(t => t.label).join(', '),
    wordCount: post.body ? JSON.stringify(post.body).split(/\s+/).length : undefined,
    timeRequired: `PT${readTime}M`,
    inLanguage: 'en',
    isAccessibleForFree: true,
    about: post.focusKeyword || post.primaryKeyword || undefined,
    abstract: post.quotableSnippet || post.contentSummary || undefined,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.prose h1', '.prose h2', '.prose h3', '.prose p:first-of-type', '.prose blockquote'],
    },
  };

  const validFaqItems = (post.faqItems || []).filter((faq) => faq?.question && faq?.answer);

  // FAQPage JSON-LD for rich snippets
  const faqJsonLd = validFaqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // BreadcrumbList JSON-LD for SERP display
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbPathItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  const isSafeInternalUrl = (url: string): boolean => /^https?:\/\//i.test(url) || url.startsWith('/');

  const normalizeInternalUrl = (url: string): string => {
    if (/^https?:\/\//i.test(url)) return url;
    return url.startsWith('/') ? url : `/${url}`;
  };

  const internalLinks = (post.internal_links || [])
    .filter((link) => link?.anchor_text && link?.url && isSafeInternalUrl(link.url))
    .map((link) => ({
      ...link,
      resolvedUrl: normalizeInternalUrl(link.url as string),
    }));

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

  const tags = post.tags?.filter((t) => t && t.slug).map((t) => t.slug) || [];
  const relatedPosts = await client.fetch(relatedPostsQuery, { slug, tags });

  return (
    <BlogImageGalleryWrapper>
      <BlogErrorBoundary>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* BreadcrumbList JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        {/* FAQPage JSON-LD (conditional) */}
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}
        <ReadingProgress />
        {/* ViewTracker - increments view count on page load */}
        <ViewTracker postId={post._id} />

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
                  <Breadcrumbs items={breadcrumbItems} />
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {post.tags.filter(tag => tag && tag.label).slice(0, 4).map((tag) => (
                      <span
                        key={tag._key}
                        className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg text-sage-100 border border-sage-200/20 backdrop-blur-md bg-white/5 shadow-sm"
                      >
                        {tag.label}
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
                  <FloatingActions
                    title={post.title}
                    slug={post.slug.current}
                    postId={post._id}
                    initialLikes={post.likes || 0}
                  />
                </div>
              </div>

              {/* Center: Content */}
              <div className="lg:col-span-7 xl:col-span-7">
                {/* Clean content container for reading comfort */}
                <div className="bg-white/90 dark:bg-forest-950/90 rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm border border-sage-100/50 dark:border-forest-800/50">
                  <div className="prose prose-lg max-w-none
                    prose-img:rounded-xl prose-img:shadow-lg
                    prose-code:before:content-none prose-code:after:content-none">
                    <PortableText
                      value={post.body}
                      components={portableTextComponents}
                    />
                  </div>
                </div>

                {/* Key Takeaways Section */}
                {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                  <div className="mt-8 p-6 bg-lime-50/80 dark:bg-lime-950/20 rounded-2xl border border-lime-200/50 dark:border-lime-800/30">
                    <h2 className="text-lg font-bold text-forest-900 dark:text-sage-100 mb-4 flex items-center gap-2">
                      <span className="text-lime-600">&#9679;</span> Key Takeaways
                    </h2>
                    <ul className="space-y-2">
                      {post.keyTakeaways.map((takeaway: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-forest-700 dark:text-sage-300">
                          <span className="text-lime-500 font-bold mt-0.5 shrink-0">{index + 1}.</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Internal Links Section */}
                {internalLinks.length > 0 && (
                  <section className="mt-10">
                    <h2 className="text-2xl font-bold text-forest-900 dark:text-sage-100 mb-5">
                      Related Articles
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {internalLinks.map((link, index) => {
                        const isExternal = /^https?:\/\//i.test(link.resolvedUrl);
                        const linkLabel = link.anchor_text || 'Explore this related article';
                        const subtitle = link.context || 'Continue with this related read.';

                        return (
                          <Link
                            key={link._key || `internal-link-${index}`}
                            href={link.resolvedUrl}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className="group rounded-xl border border-sage-200 dark:border-forest-800 bg-white/80 dark:bg-forest-950/80 p-4 transition-all hover:border-lime-400 hover:shadow-md"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="font-semibold text-forest-900 dark:text-sage-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                                {linkLabel}
                              </h3>
                              <ExternalLink className="h-4 w-4 text-forest-500 dark:text-sage-400" />
                            </div>
                            <p className="mt-2 text-sm text-forest-700 dark:text-sage-300 leading-relaxed">
                              {subtitle}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* All Tags Section */}
                {post.tags && <AllTags tags={post.tags} />}

                {/* FAQ Section */}
                {validFaqItems.length > 0 && (
                  <section className="mt-12">
                    <h2 className="text-2xl font-bold text-forest-900 dark:text-sage-100 mb-6">
                      Frequently Asked Questions
                    </h2>
                    <Accordion type="single" collapsible className="w-full space-y-3">
                      {validFaqItems.map((faq, index) => (
                        <AccordionItem
                          key={faq._key || `faq-${index}`}
                          value={faq._key || `faq-${index}`}
                          className="border border-sage-200 dark:border-forest-800 rounded-xl bg-white/80 dark:bg-forest-950/80 px-4"
                        >
                          <AccordionTrigger className="text-left font-semibold text-forest-900 dark:text-sage-100 hover:no-underline">
                            <h3 className="text-base sm:text-lg">{faq.question}</h3>
                          </AccordionTrigger>
                          <AccordionContent className="text-forest-700 dark:text-sage-300 leading-relaxed pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                )}

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
                <ShareBar
                  title={post.title}
                  slug={post.slug.current}
                  postId={post._id}
                  initialLikes={post.likes || 0}
                />

                {/* Related Posts */}

              </div>

              {/* Right Sidebar: Table of Contents (Desktop > 1280px) */}
              <div className="hidden xl:block xl:col-span-3">
                <TableOfContents readTime={readTime} />
              </div>
            </div>
          </div>

          {/* Mobile Action Bar */}
          <MobileActionBar
            title={post.title}
            slug={post.slug.current}
            postId={post._id}
            initialLikes={post.likes || 0}
          />

          {/* Related Posts Section - Full Width */}
          <RelatedPosts posts={relatedPosts} />

          {/* CTA Section */}
          {post.cta_type ? (
            <section className="mx-auto mt-12 mb-6 max-w-5xl px-4 sm:px-6">
              <div className="rounded-2xl border border-sage-200/70 dark:border-forest-800 bg-white/85 dark:bg-forest-950/85 p-6 sm:p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  {post.cta_type === 'save_for_reference' && <Bookmark className="h-5 w-5 mt-1 text-lime-600" />}
                  {post.cta_type === 'vote_value_stack' && <MessageSquare className="h-5 w-5 mt-1 text-lime-600" />}
                  {post.cta_type === 'portfolio_proof' && <ExternalLink className="h-5 w-5 mt-1 text-lime-600" />}
                  {post.cta_type === 'collaborative' && <Users className="h-5 w-5 mt-1 text-lime-600" />}
                  <div>
                    <h2 className="text-xl font-bold text-forest-900 dark:text-sage-100">
                      {post.cta_type === 'save_for_reference' && 'Bookmark this for later'}
                      {post.cta_type === 'vote_value_stack' && 'What would you add to this value stack?'}
                      {post.cta_type === 'portfolio_proof' && 'See this in production'}
                      {post.cta_type === 'collaborative' && 'Building something similar? Let\'s connect'}
                    </h2>
                    <p className="mt-2 text-forest-700 dark:text-sage-300 leading-relaxed">
                      {post.cta_text || 'If this was useful, share it with your team and save it for your next implementation sprint.'}
                    </p>
                    {post.cta_type === 'portfolio_proof' ? (
                      <a
                        href="/projects"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-lime-600 text-white px-4 py-2 font-semibold hover:bg-lime-500 transition-colors"
                      >
                        See it in production
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <CTA />
          )}
        </article>
      </BlogErrorBoundary>
    </BlogImageGalleryWrapper>
  );
}
