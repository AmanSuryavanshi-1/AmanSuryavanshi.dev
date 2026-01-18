'use client';

import { useState, useEffect, useCallback } from 'react';
import { BiLogoLinkedin, BiCopy } from 'react-icons/bi';
import { FaXTwitter } from 'react-icons/fa6';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShareBarProps {
    title: string;
    slug: string;
    postId: string;
    initialLikes?: number;
}

export default function ShareBar({ title, slug, postId, initialLikes = 0 }: ShareBarProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined' ? `${window.location.origin}/blogs/${slug}` : '';

    useEffect(() => {
        // Use object format, matching FloatingActions and MobileActionBar
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
        setIsLiked(!!likedPosts[postId]);

        // Listen for sync events from other components (FloatingActions)
        const handleStorageChange = () => {
            const updatedLikedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
            setIsLiked(!!updatedLikedPosts[postId]);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('likesUpdated', handleStorageChange);

        return () => {
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

        // Update localStorage (object format)
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
            } else {
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
                    disabled={isLikeLoading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 shadow-sm ${isLiked
                        ? 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold'
                        : 'border-sage-200 dark:border-forest-600 bg-white dark:bg-forest-800/50 text-forest-700 dark:text-sage-300 hover:border-red-300 dark:hover:border-red-500/50 hover:text-red-600 dark:hover:text-red-400'
                        } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                    <span className="font-medium">{likes}</span>
                </motion.button>
            </div>
        </div>
    );
}
