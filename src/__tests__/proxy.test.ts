/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { proxy } from '../proxy';

describe('Edge Proxy Redirect Middleware', () => {
  it('redirects amansuryavanshi.me to amansuryavanshi.com with 301', () => {
    const request = new NextRequest('https://amansuryavanshi.me/projects', {
      headers: { host: 'amansuryavanshi.me' },
    });
    const response = proxy(request);
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://amansuryavanshi.com/projects');
  });

  it('redirects www.amansuryavanshi.me to amansuryavanshi.com with 301', () => {
    const request = new NextRequest('https://www.amansuryavanshi.me/blogs/test', {
      headers: { host: 'www.amansuryavanshi.me' },
    });
    const response = proxy(request);
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://amansuryavanshi.com/blogs/test');
  });

  it('redirects amansuryavanshi-dev.vercel.app to amansuryavanshi.com with 301', () => {
    const request = new NextRequest('https://amansuryavanshi-dev.vercel.app/about', {
      headers: { host: 'amansuryavanshi-dev.vercel.app' },
    });
    const response = proxy(request);
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://amansuryavanshi.com/about');
  });

  it('handles host headers with port', () => {
    const request = new NextRequest('http://amansuryavanshi.me:3000/contact', {
      headers: { host: 'amansuryavanshi.me:3000' },
    });
    const response = proxy(request);
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://amansuryavanshi.com/contact');
  });

  it('passes through canonical requests for amansuryavanshi.com', () => {
    const request = new NextRequest('https://amansuryavanshi.com/projects', {
      headers: { host: 'amansuryavanshi.com' },
    });
    const response = proxy(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });
});
