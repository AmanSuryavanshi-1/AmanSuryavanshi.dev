import type { Image } from 'sanity';
import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImage extends Image {
  alt?: string;
}

export interface SanityVideo {
  _type: 'video';
  videoUrl: string;
  caption?: string;
  alt: string;
}

export interface PortableTextChild {
  _key: string;
  _type: 'span';
  marks: string[];
  text: string;
}

export interface PortableTextBlockType extends PortableTextBlock {
  _type: 'block' | 'video';
  children: PortableTextChild[];
  videoUrl?: string;
  caption?: string;
  alt?: string;
}

export interface Author {
  _id: string;
  _type: 'author';
  name: string;
  image?: SanityImage;
  bio?: PortableTextBlockType[];
}

export interface Tag {
  _id: string;
  _type: 'tag';
  name: string;
  slug: { current: string; _type: 'slug' };
  description?: string;
  color?: string;
  icon?: string;
  featured?: boolean;
  seoMetadata?: {
    title?: string;
    description?: string;
  };
}

// Inline tag for n8n automation (embedded in post, not a reference)
export interface InlineTag {
  _key: string;
  label: string;
  slug: string;
  color?: string; // Optional color support (legacy tags have color)
}

export interface Category {
  _id: string;
  _type: 'category';
  title: string;
  description?: string;
  tags?: Tag[];
}

// FAQ item for AI SEO
export interface FaqItem {
  _key?: string;
  question: string;
  answer: string;
}

export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: { current: string; _type: 'slug' };
  excerpt?: string;
  mainImage?: SanityImage;
  socialImage?: SanityImage;
  body: PortableTextBlockType[];
  author?: Author;
  // categories?: Category[]; // Deprecated
  tags?: InlineTag[]; // Updated for n8n automation format
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  publishedAt?: string;
  readingTime?: number;
  focusKeyword?: string;
  seoTitle?: string;
  metaDescription?: string;
  seoDescription?: string; // Alias for metaDescription (automation compatibility)
  articleType?: 'case-study' | 'tutorial' | 'guide' | 'opinion';
  estimatedReadTime?: number;
  faqItems?: FaqItem[];
  keyTakeaways?: string[];
  // AI SEO Enhancement Fields
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  aiSeoScore?: number;
  lastSeoEnhanced?: string;
  quotableSnippet?: string;
  contentSummary?: string;
  canonicalUrl?: string;
  _createdAt: string;
  _updatedAt: string;
  viewCount?: number;
  views?: number;
}
