'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
    postId: string;
    initialLikes?: number;
    size?: 'sm' | 'md' | 'lg';
    showCount?: boolean;
}

/**
 * LikeButton - Interactive like button with local storage persistence
 * 
 * Features:
 * - Heart animation on like/unlike
 * - Persists liked state in localStorage
 * - Optimistic UI updates
 * - Error recovery
 */
export default function LikeButton({
    postId,
    initialLikes = 0,
    size = 'md',
    showCount = true
}: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check localStorage on mount for liked state
    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
        if (likedPosts[postId]) {
            setIsLiked(true);
        }
    }, [postId]);

    const toggleLike = useCallback(async () => {
        if (isLoading) return;

        const newIsLiked = !isLiked;
        const action = newIsLiked ? 'like' : 'unlike';

        // Optimistic update
        setIsLiked(newIsLiked);
        setLikes(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
        setIsAnimating(true);
        setIsLoading(true);

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
                headers: {
                    'Content-Type': 'application/json',
                },
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
            setIsLoading(false);
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [postId, isLiked, isLoading]);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const buttonSizeClasses = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-2.5',
    };

    return (
        <button
            onClick={toggleLike}
            disabled={isLoading}
            aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
            className={`
        group flex items-center gap-1.5 rounded-full transition-all duration-200
        ${buttonSizeClasses[size]}
        ${isLiked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-forest-500 dark:text-sage-400 hover:text-red-500 dark:hover:text-red-400'
                }
        hover:bg-red-50 dark:hover:bg-red-500/10
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
        >
            <Heart
                className={`
          ${sizeClasses[size]}
          transition-all duration-200
          ${isLiked ? 'fill-current' : 'fill-none'}
          ${isAnimating ? 'scale-125' : 'scale-100'}
          group-hover:scale-110
        `}
            />
            {showCount && (
                <span className={`
          text-sm font-medium
          ${isLiked ? 'text-red-500' : 'text-forest-600 dark:text-sage-300'}
        `}>
                    {likes}
                </span>
            )}
        </button>
    );
}
