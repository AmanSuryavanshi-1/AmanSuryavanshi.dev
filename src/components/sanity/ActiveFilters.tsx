'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';

interface ActiveFiltersProps {
    searchQuery: string;
    selectedTags: string[];
    onClearSearch: () => void;
    onRemoveTag: (tag: string) => void;
    onResetAll: () => void;
}

export default function ActiveFilters({
    searchQuery,
    selectedTags,
    onClearSearch,
    onRemoveTag,
    onResetAll
}: ActiveFiltersProps) {
    if (!searchQuery && selectedTags.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-xs font-bold text-forest-500 uppercase tracking-wider mr-1">
                Active Filters:
            </span>

            {/* Search Query Chip */}
            {searchQuery && (
                <button
                    onClick={onClearSearch}
                    className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-forest-900 text-xs font-medium border border-lime-200 hover:bg-lime-200 transition-colors"
                >
                    <span>Search: &quot;{searchQuery}&quot;</span>
                    <X size={12} className="text-forest-500 group-hover:text-forest-900" />
                </button>
            )}

            {/* Tag Chips */}
            {selectedTags.map(tag => (
                <button
                    key={tag}
                    onClick={() => onRemoveTag(tag)}
                    className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-medium border border-forest-200 hover:bg-forest-200 transition-colors"
                >
                    <span>{tag}</span>
                    <X size={12} className="text-forest-500 group-hover:text-forest-900" />
                </button>
            ))}

            {/* Reset All Button */}
            <button
                onClick={onResetAll}
                className="flex items-center gap-1.5 px-3 py-1 ml-auto sm:ml-2 text-xs font-medium text-forest-500 hover:text-forest-700 hover:bg-forest-100 rounded-full transition-colors"
            >
                <RotateCcw size={12} />
                Reset All
            </button>
        </div>
    );
}
