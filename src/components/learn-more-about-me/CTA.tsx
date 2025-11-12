'use client'

import { motion } from 'framer-motion'
import { Briefcase, Code2, BookOpen, MessageSquare, Linkedin, Github, Instagram, Twitter as X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import PreviewCard from './PreviewCard'
import { TransparentButton } from '../transparent-button'

export default function CTA() {
  const [activePreview, setActivePreview] = useState<string | null>(null)
  const pathname = usePathname()

  const isInBlogPost = pathname?.startsWith('/blogs/')
  const isInLearnMore = pathname === '/learn-more-about-me'

  const handleProjectsClick = () => {
    if (isInBlogPost) {
      window.location.href = '/blogs#projects-tab'
    } else if (isInLearnMore) {
      window.location.href = '/projects'
    }
  }

  const handleJourneyClick = () => {
    if (isInBlogPost) {
      window.location.href = '/blogs'
    } else if (isInLearnMore) {
      window.location.href = '/#experience'
    }
  }

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  }

  const socialLinks = [
    { Icon: X, href: "https://twitter.com/_AmanSurya", label: "Twitter", color: "hover:text-[#1DA1F2]" },
    { Icon: Github, href: "https://github.com/AmanSuryavanshi-1", label: "GitHub", color: "hover:text-lime-500" },
    { Icon: Linkedin, href: "https://www.linkedin.com/in/aman-suryavanshi-6b0aba347/", label: "LinkedIn", color: "hover:text-[#0077B5]" },
    { Icon: Instagram, href: "https://www.instagram.com/__aman_suryavanshi__/", label: "Instagram", color: "hover:text-[#E4405F]" },
  ]

  return (
    <section className="w-full py-12 space-y-16 sm:py-16 sm:pb-52">
      {/* Contact Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        className="container max-w-4xl mx-auto px-4 sm:px-6"
      >
        <motion.div 
          custom={0.2}
          variants={fadeInUpVariants}
          className="text-center space-y-8 py-12 bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-forest-100"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-forest-900">Let&apos;s Create Something Amazing Together!</h3>
            <p className="text-forest-900/70 max-w-2xl mx-auto">
              Whether you have a project in mind or just want to connect, I&apos;m always excited to collaborate and bring ideas to life.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {/* <SolidButton
                    href="https://api.whatsapp.com/send?phone=+918745030106&text=Hello%20there!"
                    icon={MessageSquare}
                    label="Chat on WhatsApp"
                    className="transform hover:scale-105 transition-transform"
              /> */}
              <TransparentButton
                href="/#contact" 
                icon={MessageSquare}
                label="Let&apos;s Work Together"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-forest-100">
            <p className="text-forest-900/70 mb-6">
              Connect with me on social media
            </p>
            <motion.div 
              className="flex justify-center gap-8"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { 
                    staggerChildren: 0.1,
                    delayChildren: 0.4,
                  }
                }
              }}
            >
              {socialLinks.map(({ Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative text-2xl text-forest-900 transition-all duration-300 ${color} transform hover:scale-110`}
                  aria-label={`Visit Aman Suryavanshi's ${label} profile`}
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Icon className="w-7 h-7" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Journey Section */}
        <motion.div 
          custom={0.4}
          variants={fadeInUpVariants}
          className="mt-24 space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold font-serif text-forest-900">
              Continue the <span className="text-lime-500">Journey</span>
            </h2>
            <p className="text-forest-900/80 max-w-2xl mx-auto">
              Thanks for taking the time to explore my work! Let&apos;s connect and create something amazing together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Experience Button */}
            <motion.div
              variants={fadeInUpVariants}
              custom={0.5}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleJourneyClick}
                className="w-full group relative overflow-hidden bg-forest-900 text-sage-100 
                         rounded-r-full shadow-lg transition-all duration-300 px-6 py-4
                         hover:bg-lime-500 hover:shadow-xl"
              >
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <Briefcase className="w-6 h-6 text-lime-500 group-hover:text-sage-100 transition-colors" />
                  <span className="font-medium group-hover:text-sage-100">Continue Journey</span>
                </div>
              </button>
            </motion.div>

            {/* Projects Preview Button */}
            <motion.div
              variants={fadeInUpVariants}
              custom={0.6}
              className="relative"
              onMouseEnter={() => setActivePreview('projects')}
              onMouseLeave={() => setActivePreview(null)}
            >
              <motion.button
                onClick={handleProjectsClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative overflow-hidden bg-forest-900 text-sage-100 
                         rounded-full shadow-lg transition-all duration-300 px-6 py-4
                         hover:bg-lime-500 hover:shadow-xl"
              >
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <Code2 className="w-6 h-6 text-lime-500 group-hover:text-sage-100 transition-colors" />
                  <span className="font-medium group-hover:text-sage-100">Projects</span>
                </div>
              </motion.button>
              {activePreview === 'projects' && (
                <PreviewCard 
                  type="projects"
                  onEnter={handleProjectsClick}
                />
              )}
            </motion.div>

            {/* Blogs Preview Button */}
            <motion.div
              variants={fadeInUpVariants}
              custom={0.7}
              className="relative"
              onMouseEnter={() => setActivePreview('blogs')}
              onMouseLeave={() => setActivePreview(null)}
            >
              <motion.button
                onClick={() => window.location.href = '/blogs'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative overflow-hidden bg-forest-900 text-sage-100 
                         rounded-l-full shadow-lg transition-all duration-300 px-6 py-4
                         hover:bg-lime-500 hover:shadow-xl"
              >
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <BookOpen className="w-6 h-6 text-lime-500 group-hover:text-sage-100 transition-colors" />
                  <span className="font-medium group-hover:text-sage-100">Blogs</span>
                </div>
              </motion.button>
              {activePreview === 'blogs' && (
                <PreviewCard 
                  type="blogs"
                  onEnter={() => window.location.href = '/blogs'}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
