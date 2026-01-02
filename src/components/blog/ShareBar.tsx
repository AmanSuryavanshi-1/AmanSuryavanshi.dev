'use client';

import { useState, useEffect } from 'react';
import { BiLogoLinkedin, BiCopy, BiLike, BiSolidLike } from 'react-icons/bi';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';

interface ShareBarProps {
    title: string;
    slug: string;
}

export default function ShareBar({ title, slug }: ShareBarProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined' ? `${window.location.origin}/blogs/${slug}` : '';

    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        setIsLiked(likedPosts.includes(slug));

        // Listen for storage changes to sync like state
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'liked_posts') {
                const likedPosts = JSON.parse(e.newValue || '[]');
                setIsLiked(likedPosts.includes(slug));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [slug]);

    const toggleLike = () => {
        const newState = !isLiked;
        setIsLiked(newState);

        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        if (newState) {
            localStorage.setItem('liked_posts', JSON.stringify([...likedPosts, slug]));
        } else {
            localStorage.setItem('liked_posts', JSON.stringify(likedPosts.filter((s: string) => s !== slug)));
        }

        // Dispatch storage event to sync across components
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'liked_posts',
            newValue: localStorage.getItem('liked_posts'),
            storageArea: localStorage
        }));
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareToLinkedin = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-b border-sage-200 dark:border-forest-700/50 my-12">
            <div className="flex items-center gap-4">
                <span className="text-forest-900 dark:text-sage-100 font-bold tracking-wide text-sm uppercase">Share this article</span>
                <div className="flex gap-2">
                    <button
                        onClick={shareToTwitter}
                        className="p-2.5 rounded-full bg-sage-100/50 dark:bg-forest-800/80 text-forest-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-forest-700 hover:text-forest-900 dark:hover:text-sage-100 transition-all duration-200 shadow-sm hover:scale-105"
                        aria-label="Share on X"
                    >
                        <FaXTwitter size={18} />
                    </button>
                    <button
                        onClick={shareToLinkedin}
                        className="p-2.5 rounded-full bg-sage-100/50 dark:bg-forest-800/80 text-forest-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-forest-700 hover:text-forest-900 dark:hover:text-sage-100 transition-all duration-200 shadow-sm hover:scale-105"
                        aria-label="Share on LinkedIn"
                    >
                        <BiLogoLinkedin size={20} />
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="p-2.5 rounded-full bg-sage-100/50 dark:bg-forest-800/80 text-forest-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-forest-700 hover:text-forest-900 dark:hover:text-sage-100 transition-all duration-200 shadow-sm hover:scale-105 relative"
                        aria-label="Copy Link"
                    >
                        <BiCopy size={20} />
                        {copied && (
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-forest-900 dark:bg-lime-500 text-white dark:text-forest-900 font-bold text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
                                Copied!
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-forest-900 dark:text-sage-100 font-bold tracking-wide text-sm uppercase">Enjoyed it?</span>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleLike}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 shadow-sm ${isLiked
                        ? 'border-lime-200 dark:border-lime-500/30 bg-lime-50 dark:bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold'
                        : 'border-sage-200 dark:border-forest-600 bg-white dark:bg-forest-800/50 text-forest-700 dark:text-sage-300 hover:border-lime-300 dark:hover:border-lime-500/50 hover:text-lime-600 dark:hover:text-lime-400'
                        }`}
                >
                    {isLiked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                    <span className="font-medium">{isLiked ? 'Liked' : 'Like'}</span>
                </motion.button>
            </div>
        </div>
    );
}
