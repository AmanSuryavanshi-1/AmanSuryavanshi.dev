'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
    onClear: () => void;
}

export default function EmptyState({ onClear }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-lime-100 rounded-full blur-xl opacity-50" />
                <div className="relative bg-white p-4 rounded-full shadow-sm border border-forest-100">
                    <Search className="w-8 h-8 text-forest-400" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-0.5 bg-forest-400 rotate-45" />
                </div>
            </div>

            <h3 className="text-xl font-bold text-forest-900 mb-2">
                No posts found matching your criteria
            </h3>
            <p className="text-forest-500 mb-8 max-w-md mx-auto">
                Try adjusting your search or filters to find what you&apos;re looking for.
            </p>

            <button
                onClick={onClear}
                className="px-6 py-2.5 bg-lime-500 text-white font-medium rounded-full hover:bg-lime-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
                Clear all filters
            </button>
        </div>
    );
}
