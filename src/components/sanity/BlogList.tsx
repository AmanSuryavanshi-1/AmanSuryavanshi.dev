'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import type { Post } from '@/sanity/sanity';
import FeaturedPost from './FeaturedPost';
import BlogTabs from './BlogTabs';
import { motion } from 'framer-motion';

const POSTS_QUERY = `*[ _type == "post" && defined(slug.current) && status == "published" ] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  _createdAt,
  _updatedAt,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  },
  excerpt,
  body,
  views,
  author->{
    _id,
    _type,
    name,
    image {
      asset->{
        _id,
        url
      }
    },
    bio
  },
  categories[]->{
    _id,
    _type,
    title,
    description
  },
  tags,
  status
}`;

const DEFAULT_AUTHOR_QUERY = `*[_type == "author" && name == "Aman Suryavanshi"][0]{
  _id,
  _type,
  name,
  image {
    asset->{
      _id,
      url
    }
  },
  bio
}`;

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await client.fetch<Post[]>(POSTS_QUERY);
        
        // Fetch default author for posts without author
        const defaultAuthor = await client.fetch(DEFAULT_AUTHOR_QUERY);
        
        // Assign default author to posts without author
        const postsWithAuthor = fetchedPosts.map(post => {
          if (!post.author && defaultAuthor) {
            return { ...post, author: defaultAuthor };
          }
          return post;
        });
        
        setPosts(postsWithAuthor || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!posts.length) {
    return <div className="min-h-screen flex items-center justify-center">No posts found.</div>;
  }

  // Helper function to check if a post belongs to a category
  const hasCategory = (post: Post, categoryName: string) => 
    post?.categories?.some(category => category?.title?.toLowerCase() === categoryName.toLowerCase());

  // Filter posts by category, including the featured post if it matches
  const getPostsByCategory = (categoryName: string) => {
    const categoryPosts = posts.filter(post => hasCategory(post, categoryName));
    return categoryPosts;
  };

  // Get posts marked as featured
  const getFeaturedPosts = () => {
    const featured = posts.filter(post => hasCategory(post, 'featured'));
    return featured.slice(0, 3); // Limit to 3 featured posts
  };

  const featuredPosts = getFeaturedPosts();
  const projectPosts = getPostsByCategory('project');
  const reactPosts = getPostsByCategory('react');
  const javascriptPosts = getPostsByCategory('javascript');

  return (
    <section id="featured"  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-20 py-16 max-md:px-4">
      <div className="space-y-12">
        {featuredPosts.length > 0 && (
          <>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold font-serif text-forest-900 text-center"
            >
              Featured <span className="text-lime-500">Posts</span>
            </motion.h2>
            <div className={`grid gap-6 ${
              featuredPosts.length === 1 ? 'grid-cols-1' : 
              featuredPosts.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {featuredPosts.map((post) => (
                <FeaturedPost 
                  key={post._id} 
                  post={post} 
                  isSingle={featuredPosts.length === 1} 
                />
              ))}
            </div>
          </>
        )}
        <BlogTabs
          posts={posts}
          projectPosts={projectPosts}
          reactPosts={reactPosts}
          javascriptPosts={javascriptPosts}
        />
      </div>
    </section>
  );
}
