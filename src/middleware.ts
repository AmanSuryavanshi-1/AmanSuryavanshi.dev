import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Check if the request is coming from the Vercel URL
  if (hostname === 'amansuryavanshi-dev.vercel.app') {
    const url = request.nextUrl.clone();
    url.host = 'amansuryavanshi.me';
    url.protocol = 'https:';
    
    // Use 307 (Temporary Redirect) to preserve the request method
    return NextResponse.redirect(url, 307);
  }
  
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: '/:path*',
};