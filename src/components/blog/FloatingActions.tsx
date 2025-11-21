'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BiShareAlt,
    BiLike,
    BiSolidLike,
    BiUpArrowAlt,
    BiLogoTwitter,
    BiLogoLinkedin,
    BiCopy
} from 'react-icons/bi';

interface FloatingActionsProps {
    title: string;
    slug: string;
}

export default function FloatingActions({ title, slug }: FloatingActionsProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const url = typeof window !== 'undefined' ? `${window.location.origin}/blogs/${slug}` : '';

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        // Check local storage for like state
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        setIsLiked(likedPosts.includes(slug));

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
    };

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
            {/* Like Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLike}
                className={`p-3 rounded-full shadow-md transition-colors ${isLiked ? 'bg-emerald-50 text-[#059669]' : 'bg-white text-gray-600 hover:text-[#059669]'
                    }`}
                aria-label="Like post"
            >
                {isLiked ? <BiSolidLike size={24} /> : <BiLike size={24} />}
            </motion.button>

            {/* Share Button & Menu */}
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 rounded-full shadow-md bg-white text-gray-600 hover:text-blue-500 transition-colors"
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
                            className="absolute left-full top-0 ml-4 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-xl border border-gray-100 z-50"
                        >
                            <button onClick={shareToTwitter} className="p-2 hover:bg-gray-50 rounded-lg text-blue-400 transition-colors" title="Share on Twitter">
                                <BiLogoTwitter size={20} />
                            </button>
                            <button onClick={shareToLinkedin} className="p-2 hover:bg-gray-50 rounded-lg text-blue-700 transition-colors" title="Share on LinkedIn">
                                <BiLogoLinkedin size={20} />
                            </button>
                            <button onClick={copyToClipboard} className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors" title="Copy Link">
                                <BiCopy size={20} />
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
                        className="mt-8 p-3 rounded-full shadow-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                        aria-label="Scroll to top"
                    >
                        <BiUpArrowAlt size={24} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
