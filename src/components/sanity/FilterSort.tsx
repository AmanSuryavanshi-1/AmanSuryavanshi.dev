'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, CalendarDays, TrendingUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SortOption = 'latest' | 'oldest' | 'popular';

interface SortOptionConfig {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
    description: string;
}

interface FilterSortProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

const sortOptions: SortOptionConfig[] = [
    {
        value: 'latest',
        label: 'Latest First',
        icon: <Calendar className="h-4 w-4" />,
        description: 'Newest posts first'
    },
    {
        value: 'oldest',
        label: 'Oldest First',
        icon: <CalendarDays className="h-4 w-4" />,
        description: 'Oldest posts first'
    },
    {
        value: 'popular',
        label: 'Most Popular',
        icon: <TrendingUp className="h-4 w-4" />,
        description: 'By view count'
    }
];

export default function FilterSort({ value, onChange }: FilterSortProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = sortOptions.find(opt => opt.value === value) || sortOptions[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: SortOption) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          group relative w-full sm:w-auto min-w-[200px]
          flex items-center justify-between gap-3
          px-5 py-3.5 rounded-xl
          bg-white/90 backdrop-blur-sm
          border-2 transition-all duration-300
          text-forest-900 font-medium text-sm
          shadow-lg shadow-forest-900/5
          hover:shadow-xl hover:shadow-forest-900/10
          ${isOpen
                        ? 'border-lime-500 shadow-xl shadow-lime-500/10 scale-[1.02]'
                        : 'border-forest-200 hover:border-sage-300'
                    }
        `}
            >
                {/* Glow effect */}
                <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-lime-500 via-sage-300 to-forest-500 
            rounded-xl opacity-0 blur transition-opacity duration-500
            ${isOpen ? 'opacity-30' : 'group-hover:opacity-20'}
          `}
                />

                {/* Button content */}
                <div className="relative flex items-center gap-2.5">
                    <div className={`transition-all duration-300 ${isOpen ? 'text-lime-500 scale-110' : 'text-forest-500'}`}>
                        {selectedOption.icon}
                    </div>
                    <span className="font-semibold">{selectedOption.label}</span>
                </div>

                <ChevronDown
                    className={`h-4 w-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-lime-500' : 'text-forest-500'
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop overlay to block content behind */}
                        <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute top-full left-0 right-0 mt-2 z-[9999]"
                        >
                            <div className="relative">
                                {/* Background glow - behind the menu */}
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-lime-500 via-sage-300 to-forest-500 rounded-xl opacity-20 blur-sm -z-10" />

                                {/* Menu container - Fully opaque background */}
                                <div className="relative bg-white rounded-xl border-2 border-forest-200 shadow-2xl overflow-hidden">
                                    <div className="p-1.5">
                                        {sortOptions.map((option, index) => {
                                            const isSelected = option.value === value;

                                            return (
                                                <motion.button
                                                    key={option.value}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => handleSelect(option.value)}
                                                    className={`
                          group/item relative w-full
                          flex items-center justify-between gap-3
                          px-4 py-3 rounded-lg
                          transition-all duration-200
                          ${isSelected
                                                            ? 'bg-gradient-to-r from-lime-500/20 to-sage-300/20 text-forest-900'
                                                            : 'hover:bg-sage-100/50 text-forest-700'
                                                        }
                        `}
                                                >
                                                    {/* Animated background highlight */}
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-lime-500/10 to-sage-300/10 rounded-lg"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        whileHover={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    />

                                                    {/* Content */}
                                                    <div className="relative flex items-center gap-3">
                                                        <div
                                                            className={`transition-all duration-200 ${isSelected
                                                                ? 'text-lime-500 scale-110'
                                                                : 'text-forest-500 group-hover/item:text-forest-700 group-hover/item:scale-105'
                                                                }`}
                                                        >
                                                            {option.icon}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className={`font-semibold text-sm ${isSelected ? 'text-forest-900' : ''}`}>
                                                                {option.label}
                                                            </div>
                                                            <div className="text-xs text-forest-400 mt-0.5">
                                                                {option.description}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Check mark */}
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0, rotate: -180 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                                            className="relative"
                                                        >
                                                            <Check className="h-5 w-5 text-lime-500" />
                                                            <div className="absolute inset-0 bg-lime-500/20 rounded-full animate-ping" />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
