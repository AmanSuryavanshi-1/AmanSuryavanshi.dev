'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BiShareAlt,
    BiUpArrowAlt,
    BiLogoLinkedin,
    BiCopy
} from 'react-icons/bi';
import { FaXTwitter } from 'react-icons/fa6';
import { Heart } from 'lucide-react';

interface FloatingActionsProps {
    title: string;
    slug: string;
    postId: string;
    initialLikes?: number;
}

export default function FloatingActions({ title, slug, postId, initialLikes = 0 }: FloatingActionsProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const url = typeof window !== 'undefined' ? `${window.location.origin}/blogs/${slug}` : '';

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        // Check local storage for like state (using postId for consistency)
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
        setIsLiked(!!likedPosts[postId]);

        // Listen for localStorage changes to sync with other components (ShareBar)
        const handleStorageChange = () => {
            const updatedLikedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
            setIsLiked(!!updatedLikedPosts[postId]);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('storage', handleStorageChange);
        // Also listen for custom event for same-tab sync
        window.addEventListener('likesUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('likesUpdated', handleStorageChange);
        };
    }, [postId]);

    const toggleLike = useCallback(async () => {
        if (isLikeLoading) return;

        const newIsLiked = !isLiked;
        const action = newIsLiked ? 'like' : 'unlike';

        // Optimistic update
        setIsLiked(newIsLiked);
        setLikes(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
        setIsLikeLoading(true);

        // Update localStorage
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
        if (newIsLiked) {
            likedPosts[postId] = true;
        } else {
            delete likedPosts[postId];
        }
        localStorage.setItem('liked_posts', JSON.stringify(likedPosts));

        try {
            const response = await fetch('/api/toggle-like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, action }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Revert on error
                setIsLiked(!newIsLiked);
                setLikes(prev => !newIsLiked ? prev + 1 : Math.max(0, prev - 1));
                console.error('Failed to toggle like:', data);

                // Revert localStorage
                if (!newIsLiked) {
                    likedPosts[postId] = true;
                } else {
                    delete likedPosts[postId];
                }
                localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
            } else {
                // Sync with server value
                setLikes(data.likes);
            }
        } catch (error) {
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikes(prev => !newIsLiked ? prev + 1 : Math.max(0, prev - 1));
            console.error('Error toggling like:', error);
        } finally {
            setIsLikeLoading(false);
            // Dispatch custom event to sync with other components
            window.dispatchEvent(new CustomEvent('likesUpdated'));
        }
    }, [postId, isLiked, isLikeLoading]);


    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setShowShareMenu(false);
            // Ideally show a toast here
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        setShowShareMenu(false);
    };

    const shareToLinkedin = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        setShowShareMenu(false);
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            {/* Like Button - No count, syncs with ShareBar */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLike}
                disabled={isLikeLoading}
                className={`p-3 rounded-full shadow-lg transition-all duration-200 ${isLiked
                    ? 'bg-red-500 text-white shadow-red-500/30'
                    : 'bg-white dark:bg-forest-800 text-forest-700 dark:text-sage-300 hover:text-red-500 dark:hover:text-red-400 border border-transparent dark:border-forest-700'
                    } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={isLiked ? 'Unlike post' : 'Like post'}
            >
                <Heart
                    size={24}
                    className={`transition-all duration-200 ${isLiked ? 'fill-current' : ''}`}
                />
            </motion.button>

            {/* Share Button & Menu */}
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className={`p-3 rounded-full shadow-lg transition-colors border border-transparent dark:border-forest-700 ${showShareMenu
                        ? 'bg-forest-900 text-white dark:bg-lime-500 dark:text-forest-900'
                        : 'bg-white dark:bg-forest-800 text-forest-600 dark:text-sage-300 hover:text-lime-600 dark:hover:text-lime-400'}`}
                    aria-label="Share post"
                >
                    <BiShareAlt size={24} />
                </motion.button>

                <AnimatePresence>
                    {showShareMenu && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className="absolute left-full top-0 ml-4 flex flex-col gap-2 bg-white dark:bg-forest-800 p-2 rounded-xl shadow-xl border border-gray-100 dark:border-forest-700 z-50 min-w-[50px] items-center"
                        >
                            <button onClick={shareToTwitter} className="p-2.5 hover:bg-sage-50 dark:hover:bg-forest-700 rounded-lg text-forest-600 dark:text-sage-300 hover:text-forest-900 dark:hover:text-white transition-colors" title="Share on X">
                                <FaXTwitter size={20} />
                            </button>
                            <button onClick={shareToLinkedin} className="p-2.5 hover:bg-sage-50 dark:hover:bg-forest-700 rounded-lg text-forest-600 dark:text-sage-300 hover:text-forest-900 dark:hover:text-white transition-colors" title="Share on LinkedIn">
                                <BiLogoLinkedin size={22} />
                            </button>
                            <button onClick={copyToClipboard} className="p-2.5 hover:bg-sage-50 dark:hover:bg-forest-700 rounded-lg text-forest-600 dark:text-sage-300 hover:text-forest-900 dark:hover:text-white transition-colors" title="Copy Link">
                                <BiCopy size={22} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Scroll to Top */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="mt-6 p-3 rounded-full shadow-lg bg-forest-900 dark:bg-lime-500 text-white dark:text-forest-900 hover:bg-forest-800 dark:hover:bg-lime-400 transition-colors"
                        aria-label="Scroll to top"
                    >
                        <BiUpArrowAlt size={24} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
