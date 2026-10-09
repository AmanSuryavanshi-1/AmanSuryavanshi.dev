import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BlogIndexPage from '../page';
import { client } from '@/sanity/lib/client';

jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}));

jest.mock('@/sanity/lib/image', () => ({
  urlFor: jest.fn(() => ({
    url: () => 'https://cdn.sanity.io/images/mock-image',
  })),
}));

jest.mock('@/components/sanity/Banner', () => function MockBanner() {
  return <div data-testid="banner">Mock Banner</div>;
});

const mockPosts = [
  {
    _id: 'post-1',
    _type: 'post',
    title: 'Building Production AI Agents: Part 1',
    slug: { current: 'ai-agents-part-1' },
    _createdAt: '2026-03-01T00:00:00Z',
    series: 'Building Production AI Agents',
    series_part: 1,
    pillar_post: true,
    status: 'published',
  },
  {
    _id: 'post-2',
    _type: 'post',
    title: 'Building Production AI Agents: Part 2',
    slug: { current: 'ai-agents-part-2' },
    _createdAt: '2026-03-02T00:00:00Z',
    series: 'Building Production AI Agents',
    series_part: 2,
    status: 'published',
  },
  {
    _id: 'post-3',
    _type: 'post',
    title: 'Unrelated Solo Article',
    slug: { current: 'unrelated-article' },
    _createdAt: '2026-03-03T00:00:00Z',
    status: 'published',
  },
];

describe('Blogs Listing Page - Series Filtering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (client.fetch as jest.Mock).mockImplementation(async (query: string) => {
      if (query.includes('_type == "post"')) return mockPosts;
      if (query.includes('_type == "tag"')) return [];
      if (query.includes('_type == "author"')) return null;
      return [];
    });
  });

  it('filters posts by initial series from searchParams', async () => {
    const pageComponent = await BlogIndexPage({
      searchParams: Promise.resolve({ series: 'Building Production AI Agents' }),
    });

    render(pageComponent);

    await waitFor(() => {
      expect(screen.getByText('Building Production AI Agents: Part 1')).toBeInTheDocument();
      expect(screen.getByText('Building Production AI Agents: Part 2')).toBeInTheDocument();
    });

    expect(screen.queryByText('Unrelated Solo Article')).not.toBeInTheDocument();
    expect(screen.getByText('Series: "Building Production AI Agents"')).toBeInTheDocument();
  });

  it('handles repeated array series searchParams by taking the first value', async () => {
    const pageComponent = await BlogIndexPage({
      searchParams: Promise.resolve({ series: ['Building Production AI Agents', 'Other Series'] }),
    });

    render(pageComponent);

    await waitFor(() => {
      expect(screen.getByText('Building Production AI Agents: Part 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Series: "Building Production AI Agents"')).toBeInTheDocument();
  });

  it('displays all published posts when series searchParam is omitted', async () => {
    const pageComponent = await BlogIndexPage({});

    render(pageComponent);

    await waitFor(() => {
      expect(screen.getByText('Building Production AI Agents: Part 1')).toBeInTheDocument();
      expect(screen.getByText('Building Production AI Agents: Part 2')).toBeInTheDocument();
      expect(screen.getByText('Unrelated Solo Article')).toBeInTheDocument();
    });
  });
});
