'use client';

import { useState, useEffect, useMemo } from 'react';
import { client } from '@/sanity/lib/client';
import type { Post } from '@/sanity/sanity';
import FeaturedPost from './FeaturedPost';
import BlogPostCard, { BlogPostSkeleton } from './BlogPostCard';
import TagCloud from './TagCloud';
import SearchBar from './SearchBar';
import FilterSort from './FilterSort';
import EmptyState from './EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllRelatedTags } from '@/lib/tag-utils';

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

const TAGS_QUERY = `*[_type == "category"] {title}`;

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

type SortOption = 'latest' | 'oldest' | 'popular';
type ViewMode = 'grid' | 'list';

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allSanityTags, setAllSanityTags] = useState<{ title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await client.fetch<Post[]>(POSTS_QUERY);
        const fetchedTags = await client.fetch(TAGS_QUERY);
        const defaultAuthor = await client.fetch(DEFAULT_AUTHOR_QUERY);

        setAllSanityTags(fetchedTags || []);

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

  // Filter Logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch =
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => {
          const relatedTags = getAllRelatedTags(tag);

          const hasMatchingTag = post.tags?.some(postTag =>
            relatedTags.some(related => related.toLowerCase() === postTag.toLowerCase())
          );

          const hasMatchingCategory = post.categories?.some(cat =>
            relatedTags.some(related => related.toLowerCase() === cat.title?.toLowerCase())
          );

          return hasMatchingTag || hasMatchingCategory;
        });

      return matchesSearch && matchesTags;
    });
  }, [posts, searchQuery, selectedTags]);

  // Sort Logic
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      if (sortBy === 'latest') return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      return 0;
    });
  }, [filteredPosts, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTags, sortBy]);

  const handleTagSelect = (tag: string) => {
    if (tag === 'ALL') {
      setSelectedTags([]);
    } else {
      setSelectedTags(prev =>
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      );
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('latest');
    setCurrentPage(1);
  };

  // Featured Posts
  const featuredPosts = posts.filter(post =>
    post.categories?.some(c => c.title?.toLowerCase() === 'featured')
  );

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-forest-900 text-white rounded-lg hover:bg-forest-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-20 bg-sage-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Featured Section - Only show on first page */}
        {!isLoading && currentPage === 1 && featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-forest-900 mb-8">Featured Articles</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {featuredPosts.slice(0, 2).map(post => (
                <FeaturedPost key={post._id} post={post} isSingle={false} />
              ))}
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left: Search & Tags */}
          <div className="flex-grow space-y-6">
            <SearchBar value={searchQuery} onSearch={setSearchQuery} />
            <TagCloud
              posts={posts}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              allTags={allSanityTags} // Pass all tags
            />
          </div>

          {/* Right: Sort & View Toggle */}
          <div className="flex flex-row sm:flex-col gap-4 justify-between sm:justify-start shrink-0">
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-forest-100 shadow-sm self-start">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'text-forest-500 hover:bg-forest-50'
                  }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'text-forest-500 hover:bg-forest-50'
                  }`}
                aria-label="List view"
              >
                <ListIcon size={20} />
              </button>
            </div>

            <FilterSort value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-forest-100 pb-4 mt-16 mb-8">
            <h2 id="all-articles" className="text-3xl md:text-4xl font-bold text-forest-900">
              All Articles
              <span className="ml-3 text-lg font-normal text-forest-500">
                ({filteredPosts.length})
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              : "space-y-6"
            }>
              {[...Array(6)].map((_, i) => (
                <BlogPostSkeleton key={i} viewMode={viewMode} />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              <motion.div
                layout
                className={viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                  : "space-y-6"
                }
              >
                <AnimatePresence mode="popLayout">
                  {paginatedPosts.map(post => (
                    <motion.div
                      key={post._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BlogPostCard post={post} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-forest-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-forest-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-forest-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-forest-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-forest-50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState onClear={handleClearFilters} />
          )}
        </div>
      </div>
    </section>
  );
}
