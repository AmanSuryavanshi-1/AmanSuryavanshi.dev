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

export interface Category {
  _id: string;
  _type: 'category';
  title: string;
  description?: string;
  tags?: Tag[];
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
  tags?: Tag[]; // Updated from string[] to Tag[]
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  publishedAt?: string;
  readingTime?: number;
  focusKeyword?: string;
  seoTitle?: string;
  metaDescription?: string;
  _createdAt: string;
  _updatedAt: string;
  viewCount?: number;
  views?: number;
}
