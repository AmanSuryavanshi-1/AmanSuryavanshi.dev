'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { SeriesPostSibling } from '@/sanity/sanity';
import { cn } from '@/lib/utils';

export interface SeriesNavProps {
  series: string;
  currentSlug: string;
  currentPart?: number;
  seriesPosts: SeriesPostSibling[];
  className?: string;
}

export default function SeriesNav({
  series,
  currentSlug,
  currentPart,
  seriesPosts,
  className,
}: SeriesNavProps) {
  // Deterministic sorting with slug validation
  const sortedPosts = useMemo(() => {
    if (!seriesPosts || seriesPosts.length <= 1) return [];
    return [...seriesPosts]
      .filter((p) => Boolean(p.slug?.current))
      .sort((a, b) => {
        const partA = a.series_part ?? Infinity;
        const partB = b.series_part ?? Infinity;
        if (partA !== partB) return partA - partB;
        return (a.title || '').localeCompare(b.title || '');
      });
  }, [seriesPosts]);

  // Only render if series exists and has multiple valid posts
  if (!series || sortedPosts.length <= 1) {
    return null;
  }

  const currentIndex = sortedPosts.findIndex(
    (p) => p.slug?.current === currentSlug
  );

  if (currentIndex === -1) {
    return null;
  }

  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <nav
      className={cn('w-full', className)}
      aria-label={`Series navigation for ${series}`}
      data-testid="series-nav"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {previousPost && previousPost.slug?.current ? (
          <Link
            href={`/blogs/${encodeURIComponent(previousPost.slug.current)}`}
            className="group flex flex-col justify-between p-5 rounded-2xl border border-sage-200 dark:border-forest-800 bg-white/85 dark:bg-forest-950/85 hover:border-lime-500 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-lime-700 dark:text-lime-400 mb-2">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 shrink-0" />
              <span>
                Previous Part
                {previousPost.series_part != null && previousPost.series_part > 0
                  ? ` (Part ${previousPost.series_part})`
                  : ''}
              </span>
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-forest-900 dark:text-sage-100 group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors line-clamp-2">
              {previousPost.title}
            </h4>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextPost && nextPost.slug?.current ? (
          <Link
            href={`/blogs/${encodeURIComponent(nextPost.slug.current)}`}
            className="group flex flex-col justify-between p-5 rounded-2xl border border-sage-200 dark:border-forest-800 bg-white/85 dark:bg-forest-950/85 hover:border-lime-500 hover:shadow-md transition-all text-left sm:text-right"
          >
            <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-lime-700 dark:text-lime-400 mb-2">
              <span>
                Next Part
                {nextPost.series_part != null && nextPost.series_part > 0
                  ? ` (Part ${nextPost.series_part})`
                  : ''}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 shrink-0" />
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-forest-900 dark:text-sage-100 group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors line-clamp-2">
              {nextPost.title}
            </h4>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
