import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const rawHost = request.headers.get('host') || request.nextUrl.hostname || '';
  const hostname = rawHost.split(':')[0].toLowerCase();
  
  // Issue permanent 301 redirects for legacy domains to the canonical domain
  if (
    hostname === 'amansuryavanshi.me' ||
    hostname === 'www.amansuryavanshi.me' ||
    hostname === 'amansuryavanshi-dev.vercel.app'
  ) {
    const url = request.nextUrl.clone();
    url.host = 'amansuryavanshi.com';
    url.port = '';
    url.protocol = 'https:';
    
    // Permanent 301 redirect to consolidate domain authority
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: '/:path*',
};