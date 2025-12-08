import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

// Define error types
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
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Increment the view count in Sanity using the write client
    try {
      await writeClient
        .patch(postId)
        .setIfMissing({ views: 0 })
        .inc({ views: 1 })
        .commit();

      return NextResponse.json({ success: true });
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
    console.error('Error incrementing view count:', requestError);
    return NextResponse.json(
      {
        error: 'Failed to increment view count',
        details: requestError.message
      },
      { status: 500 }
    );
  }
}
