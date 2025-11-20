import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/components/projects/projectsData'
import { useRef, useEffect, useState } from 'react'
import { client } from '@/sanity/lib/client'
import type { Post } from '@/sanity/sanity'
import { format } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'

interface PreviewCardProps {
  type: 'projects' | 'blogs'
  onEnter: () => void
}

export default function PreviewCard({ type, onEnter }: PreviewCardProps) {
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const [posts, setPosts] = useState<Post[]>([])

  const videoProjects = projects.filter(project => project.video).slice(0, 2)

  useEffect(() => {
    // Intersection Observer to play the videos when they are in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef1.current?.play()
            videoRef2.current?.play()
          } else {
            videoRef1.current?.pause()
            videoRef2.current?.pause()
          }
        })
      },
      { threshold: 0.5 }
    )

    const currentVideoRef1 = videoRef1.current
    const currentVideoRef2 = videoRef2.current

    if (currentVideoRef1) observer.observe(currentVideoRef1)
    if (currentVideoRef2) observer.observe(currentVideoRef2)

    return () => {
      if (currentVideoRef1) observer.unobserve(currentVideoRef1)
      if (currentVideoRef2) observer.unobserve(currentVideoRef2)
    }
  }, [])

  useEffect(() => {
    if (type === 'blogs') {
      const fetchPosts = async () => {
        try {
          const query = `*[_type == "post" && defined(slug.current)] | order(_createdAt desc)[0...2] {
            _id,
            title,
            slug,
            _createdAt,
            mainImage,
            excerpt
          }`
          const fetchedPosts = await client.fetch<Post[]>(query)
          setPosts(fetchedPosts)
        } catch (error) {
          console.error('Error fetching posts:', error)
        }
      }
      fetchPosts()
    }
  }, [type])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 w-full mt-2 bg-forest-900 rounded-lg shadow-xl border-2 border-sage-300 p-4 z-10"
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h3 className="text-sage-100 font-semibold">
            {type === 'projects' ? 'Featured Projects' : 'Latest Blogs'}
          </h3>
          {type === 'projects' ? (
            <div className="grid grid-cols-2 gap-2">
              {videoProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="bg-forest-700 p-2 rounded group hover:bg-forest-500 transition-colors duration-300"
                >
                  <video
                    ref={index === 0 ? videoRef1 : videoRef2}
                    src={project.video}
                    className="w-full h-20 object-cover rounded"
                    muted
                    loop
                    playsInline
                  />
                  <p className="text-sage-100 text-sm mt-2 line-clamp-1">{project.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post._id} className="bg-forest-700 p-2 rounded hover:bg-forest-500 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    {post.mainImage && (
                      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={urlFor(post.mainImage).width(48).height(48).url()}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sage-100 text-sm font-medium line-clamp-1">{post.title}</p>
                      <p className="text-sage-300 text-xs">
                        {format(new Date(post._createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={onEnter}
          className="w-full bg-lime-500 hover:bg-lime-700 text-forest-900 font-semibold group"
        >
          View All {type === 'projects' ? 'Projects' : 'Blogs'}
          <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  )
}