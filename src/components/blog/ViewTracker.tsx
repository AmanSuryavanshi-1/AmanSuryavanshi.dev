'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
    postId: string;
}

/**
 * ViewTracker - A client component that increments view count when mounted
 * 
 * This component:
 * - Calls /api/increment-views once on mount
 * - Uses a ref to prevent double-counting in React Strict Mode
 * - Renders nothing (invisible side-effect only)
 */
export default function ViewTracker({ postId }: ViewTrackerProps) {
    const hasIncremented = useRef(false);

    useEffect(() => {
        // Prevent double increment in React Strict Mode / dev mode
        if (hasIncremented.current) return;
        hasIncremented.current = true;

        const incrementView = async () => {
            try {
                const response = await fetch('/api/increment-views', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error('Failed to increment view:', data);
                }
            } catch (error) {
                console.error('Error incrementing view:', error);
            }
        };

        incrementView();
    }, [postId]);

    // This component renders nothing - it's purely for side effects
    return null;
}
