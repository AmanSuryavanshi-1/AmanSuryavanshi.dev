'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Layers, Bookmark, CheckCircle2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { SeriesPostSibling } from '@/sanity/sanity';
import { cn } from '@/lib/utils';

export interface SeriesSyllabusProps {
  series: string;
  currentSlug: string;
  currentPart?: number;
  seriesPosts: SeriesPostSibling[];
  className?: string;
}

export default function SeriesSyllabus({
  series,
  currentSlug,
  currentPart,
  seriesPosts,
  className,
}: SeriesSyllabusProps) {
  // Deterministic sorting: sort by series_part ascending, with title tie-breaker
  const sortedPosts = useMemo(() => {
    if (!seriesPosts || seriesPosts.length <= 1) return [];
    return [...seriesPosts].sort((a, b) => {
      const partA = a.series_part ?? Infinity;
      const partB = b.series_part ?? Infinity;
      if (partA !== partB) return partA - partB;
      return (a.title || '').localeCompare(b.title || '');
    });
  }, [seriesPosts]);

  // Defensive guard: Only render if valid series name exists and there are at least 2 parts
  if (!series || sortedPosts.length <= 1) {
    return null;
  }

  // Identify current post index and part number (guarding against series_part <= 0)
  const currentIndex = sortedPosts.findIndex(
    (p) => p.slug?.current === currentSlug
  );
  const detectedPart =
    currentPart ??
    (currentIndex !== -1 ? sortedPosts[currentIndex].series_part : undefined);
  const activePartNumber =
    detectedPart != null && detectedPart > 0
      ? detectedPart
      : currentIndex !== -1
      ? currentIndex + 1
      : 1;

  return (
    <div
      className={cn(
        'rounded-2xl border border-sage-200 dark:border-forest-800 bg-white/90 dark:bg-forest-950/90 shadow-sm overflow-hidden',
        className
      )}
      data-testid="series-syllabus"
    >
      <Accordion type="single" collapsible defaultValue="series-syllabus-item">
        <AccordionItem value="series-syllabus-item" className="border-none">
          <AccordionTrigger className="px-5 sm:px-6 py-4 hover:no-underline hover:bg-forest-50/50 dark:hover:bg-forest-900/30 transition-colors">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-xl bg-lime-100/80 dark:bg-lime-950/40 text-lime-700 dark:text-lime-400 shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                <span className="font-serif font-bold text-forest-900 dark:text-sage-100 text-sm sm:text-base">
                  Series: <span className="text-lime-700 dark:text-lime-400 font-sans">{series}</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300 w-fit">
                  Part {activePartNumber} of {sortedPosts.length}
                </span>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-5 sm:px-6 pb-4 pt-1">
            <div className="divide-y divide-sage-100 dark:divide-forest-800/60 border-t border-sage-100 dark:border-forest-800/60 mt-1">
              {sortedPosts.map((sibling, idx) => {
                const isCurrent = sibling.slug?.current === currentSlug;
                const partNumber =
                  sibling.series_part != null && sibling.series_part > 0
                    ? sibling.series_part
                    : idx + 1;

                const content = (
                  <div className="flex items-center justify-between gap-3 py-3 w-full group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          'flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-colors',
                          isCurrent
                            ? 'bg-lime-500 text-forest-950 shadow-sm'
                            : 'bg-sage-100 dark:bg-forest-900 text-forest-700 dark:text-sage-400 group-hover:bg-lime-100 dark:group-hover:bg-lime-950/60 group-hover:text-lime-700 dark:group-hover:text-lime-400'
                        )}
                      >
                        {partNumber}
                      </span>
                      <span
                        className={cn(
                          'text-sm truncate transition-colors',
                          isCurrent
                            ? 'font-bold text-forest-950 dark:text-white'
                            : 'text-forest-700 dark:text-sage-300 group-hover:text-lime-700 dark:group-hover:text-lime-400'
                        )}
                      >
                        {sibling.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {sibling.pillar_post && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300">
                          <Bookmark className="h-3 w-3 text-lime-600 dark:text-lime-400" />
                          Pillar
                        </span>
                      )}
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-lime-500/20 text-lime-800 dark:text-lime-300 border border-lime-500/30">
                          <CheckCircle2 className="h-3 w-3 text-lime-600 dark:text-lime-400" />
                          Current Part
                        </span>
                      ) : null}
                    </div>
                  </div>
                );

                if (isCurrent) {
                  return (
                    <div key={sibling._id || idx} className="cursor-default">
                      {content}
                    </div>
                  );
                }

                return (
                  <Link
                    key={sibling._id || idx}
                    href={`/blogs/${encodeURIComponent(sibling.slug?.current || '')}`}
                    className="block hover:no-underline"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
