import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

interface SanityError extends Error {
    message: string;
    statusCode?: number;
}

interface RequestError extends Error {
    message: string;
}

export async function POST(request: Request) {
    if (!process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN) {
        console.error('Sanity write token is missing in API route');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const { postId, action } = await request.json();

        if (!postId) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        if (!action || !['like', 'unlike'].includes(action)) {
            return NextResponse.json(
                { error: 'Action must be "like" or "unlike"' },
                { status: 400 }
            );
        }

        try {
            if (action === 'like') {
                // Increment likes
                await writeClient
                    .patch(postId)
                    .setIfMissing({ likes: 0 })
                    .inc({ likes: 1 })
                    .commit();
            } else {
                // Decrement likes (but don't go below 0)
                const currentPost = await writeClient.fetch(
                    `*[_id == $postId][0].likes`,
                    { postId }
                );

                if (currentPost && currentPost > 0) {
                    await writeClient
                        .patch(postId)
                        .dec({ likes: 1 })
                        .commit();
                }
            }

            // Fetch updated likes count
            const updatedLikes = await writeClient.fetch(
                `*[_id == $postId][0].likes`,
                { postId }
            );

            return NextResponse.json({
                success: true,
                likes: updatedLikes || 0,
                action
            });
        } catch (error) {
            const sanityError = error as SanityError;
            console.error('Sanity mutation error:', sanityError);
            return NextResponse.json(
                {
                    error: 'Failed to update Sanity document',
                    details: sanityError.message
                },
                { status: 500 }
            );
        }
    } catch (error) {
        const requestError = error as RequestError;
        console.error('Error toggling like:', requestError);
        return NextResponse.json(
            {
                error: 'Failed to toggle like',
                details: requestError.message
            },
            { status: 500 }
        );
    }
}
