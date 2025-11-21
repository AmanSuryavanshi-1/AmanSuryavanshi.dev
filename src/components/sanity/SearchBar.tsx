'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    value?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search posts...', value }: SearchBarProps) {
    const [query, setQuery] = useState(value || '');
    const [isFocused, setIsFocused] = useState(false);

    // Sync local state with prop value (for clearing from parent)
    useEffect(() => {
        if (value !== undefined) {
            setQuery(value);
        }
    }, [value]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <div className="relative w-full max-w-md group">
            {/* Background glow effect */}
            <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-lime-500 via-sage-300 to-forest-500 rounded-full opacity-0 blur transition-opacity duration-500 ${isFocused ? 'opacity-30' : 'group-hover:opacity-20'
                    }`}
            />

            {/* Main search container */}
            <div className="relative">
                {/* Search icon with pulse animation */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Search
                        className={`h-5 w-5 transition-all duration-300 ${isFocused
                            ? 'text-lime-600 scale-110'
                            : 'text-forest-700'
                            }`}
                    />
                    {isFocused && (
                        <span className="absolute inset-0 h-5 w-5 rounded-full bg-lime-500 animate-ping opacity-20" />
                    )}
                </div>

                {/* Input field */}
                <input
                    type="text"
                    className={`block w-full pl-12 pr-12 py-3.5 rounded-full leading-5 
                        bg-white
                        border-2 transition-all duration-300
                        placeholder-forest-500
                        text-forest-900 font-medium
                        shadow-lg shadow-forest-900/5
                        focus:outline-none 
                        sm:text-sm
                        ${isFocused
                            ? 'border-lime-500 shadow-xl shadow-lime-500/10 scale-[1.02]'
                            : 'border-forest-200 hover:border-sage-300 hover:shadow-xl hover:shadow-forest-900/10'
                        }`}
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {/* Clear button with smooth animation */}
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-forest-400 
                            hover:text-forest-700 transition-all duration-300 
                            hover:scale-110 active:scale-95
                            group/clear"
                        aria-label="Clear search"
                    >
                        <div className="relative">
                            <X className="h-5 w-5 transition-transform duration-300 group-hover/clear:rotate-90" />
                            <div className="absolute inset-0 bg-forest-400/20 rounded-full scale-0 
                                group-hover/clear:scale-150 transition-transform duration-300" />
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}
