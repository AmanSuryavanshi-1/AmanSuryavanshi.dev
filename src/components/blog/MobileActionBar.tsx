'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BiShareAlt,
    BiListUl,
    BiX
} from 'react-icons/bi';
import { Heart } from 'lucide-react';
import TableOfContents from './TableOfContents';

interface MobileActionBarProps {
    title: string;
    slug: string;
    postId: string;
    initialLikes?: number;
}

export default function MobileActionBar({ title, slug, postId, initialLikes = 0 }: MobileActionBarProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [showToc, setShowToc] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const url = typeof window !== 'undefined' ? `${window.location.origin}/blogs/${slug}` : '';

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        // Check local storage (using object format, matching FloatingActions)
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
        setIsLiked(!!likedPosts[postId]);

        // Listen for sync events from other components
        const handleLikeSync = () => {
            const updatedLikedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
            setIsLiked(!!updatedLikedPosts[postId]);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('storage', handleLikeSync);
        window.addEventListener('likesUpdated', handleLikeSync);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', handleLikeSync);
            window.removeEventListener('likesUpdated', handleLikeSync);
        };
    }, [lastScrollY, postId]);

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

    const sharePost = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <>
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: isVisible ? 0 : 100 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 bg-forest-900/95 backdrop-blur-lg border-t border-forest-800 px-6 py-3 z-40 lg:hidden safe-area-bottom"
            >
                <div className="flex justify-around items-center max-w-md mx-auto">
                    <button
                        onClick={toggleLike}
                        disabled={isLikeLoading}
                        className={`flex flex-col items-center gap-1 text-xs font-medium ${isLiked ? 'text-red-500' : 'text-sage-300'} ${isLikeLoading ? 'opacity-50' : ''}`}
                    >
                        <Heart size={24} className={isLiked ? 'fill-current' : ''} />
                        <span>{likes}</span>
                    </button>

                    <button
                        onClick={() => setShowToc(true)}
                        className="flex flex-col items-center gap-1 text-xs font-medium text-sage-300"
                    >
                        <BiListUl size={24} />
                        <span>Contents</span>
                    </button>

                    <button
                        onClick={sharePost}
                        className="flex flex-col items-center gap-1 text-xs font-medium text-sage-300"
                    >
                        <BiShareAlt size={24} />
                        <span>Share</span>
                    </button>
                </div>
            </motion.div>

            {/* TOC Drawer */}
            <AnimatePresence>
                {showToc && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowToc(false)}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-hidden flex flex-col lg:hidden"
                        >
                            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                                <h3 className="font-bold text-lg text-gray-900">Table of Contents</h3>
                                <button
                                    onClick={() => setShowToc(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <BiX size={24} />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-4 pb-safe">
                                <TableOfContents mobile onClose={() => setShowToc(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
