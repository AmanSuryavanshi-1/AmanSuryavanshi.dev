'use client';

import { useState, useEffect } from 'react';
import { BiLogoTwitter, BiLogoLinkedin, BiCopy, BiLike, BiSolidLike } from 'react-icons/bi';
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-b border-gray-100 my-12">
            <div className="flex items-center gap-4">
                <span className="text-gray-500 font-medium">Share this article</span>
                <div className="flex gap-2">
                    <button
                        onClick={shareToTwitter}
                        className="p-2 rounded-full bg-blue-50 text-blue-400 hover:bg-blue-100 transition-colors"
                        aria-label="Share on Twitter"
                    >
                        <BiLogoTwitter size={20} />
                    </button>
                    <button
                        onClick={shareToLinkedin}
                        className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        aria-label="Share on LinkedIn"
                    >
                        <BiLogoLinkedin size={20} />
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors relative"
                        aria-label="Copy Link"
                    >
                        <BiCopy size={20} />
                        {copied && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                Copied!
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-gray-500 font-medium">Enjoyed it?</span>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${isLiked
                            ? 'border-emerald-200 bg-emerald-50 text-[#059669]'
                            : 'border-gray-200 hover:border-emerald-200 hover:text-[#059669]'
                        }`}
                >
                    {isLiked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                </motion.button>
            </div>
        </div>
    );
}
