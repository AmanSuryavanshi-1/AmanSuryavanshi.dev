import Banner from '@/components/sanity/Banner'
import BlogList from '@/components/sanity/BlogList'
import React, { Suspense } from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technical Blog | AI, Automation & Web Development',
  description: 'Explore in-depth technical articles on AI automation, n8n workflows, Next.js development, and large-scale system architecture by Aman Suryavanshi.',
  keywords: [
    'AI automation blog',
    'n8n tutorials',
    'Next.js guides',
    'web development blog',
    'LLM integration',
    'software engineering',
    'Aman Suryavanshi blog'
  ],
  alternates: {
    canonical: 'https://amansuryavanshi.me/blogs',
  },
  openGraph: {
    title: 'Technical Blog | Aman Suryavanshi',
    description: 'Expert insights on AI automation, n8n, and modern web development.',
    type: 'website',
  }
}

interface PageProps {
  searchParams?: Promise<{ series?: string | string[] }>;
}

const page = async ({ searchParams }: PageProps) => {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const rawSeries = resolvedParams?.series;
  const initialSeries = Array.isArray(rawSeries) ? rawSeries[0] : rawSeries;

  return (
    <div>
      <Banner />
      <Suspense fallback={null}>
        <BlogList initialSeries={initialSeries} />
      </Suspense>
    </div>
  )
}

export default page
