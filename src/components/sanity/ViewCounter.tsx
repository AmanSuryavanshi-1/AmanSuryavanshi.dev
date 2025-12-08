'use client';

import { useEffect, useState, useRef } from 'react';
import { client } from '@/sanity/lib/client';

interface ViewCounterProps {
  postId: string;
  noCount?: boolean;
  increment?: boolean;
}

export default function ViewCounter({ postId, noCount = false, increment = false }: ViewCounterProps) {
  const [views, setViews] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const hasIncremented = useRef(false);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        // Get the current views
        const currentViews = await client.fetch(
          `*[_id == $postId][0].views`,
          { postId }
        );

        setViews(currentViews || 0);

        // Only increment if we're on the blog post page and haven't incremented yet
        if (increment && !hasIncremented.current) {
          hasIncremented.current = true;

          try {
            const response = await fetch('/api/increment-views', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ postId }),
            });

            const data = await response.json();

            if (!response.ok) {
              console.error('Failed to increment views. Status:', response.status);
              console.error('Error details:', data);
              return;
            }

            // Update the local state only if the API call was successful
            setViews((prev) => prev + 1);
          } catch (incrementError) {
            console.error('Error during view increment:', incrementError);
          }
        }
      } catch (error) {
        console.error('Error fetching views:', error);
        setError(true);
      }
    };

    fetchViews();
  }, [postId, increment]);

  if (noCount) {
    return null;
  }

  if (error) {
    return <span>Error loading views</span>;
  }

  return <span>{views} views</span>;
}
