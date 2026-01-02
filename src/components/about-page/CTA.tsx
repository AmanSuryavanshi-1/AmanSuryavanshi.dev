'use client'

import { motion } from 'framer-motion'
import { Briefcase, Code2, BookOpen, MessageSquare, Linkedin, Github, Instagram } from 'lucide-react'
import { FaXTwitter } from 'react-icons/fa6'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import PreviewCard from './PreviewCard'
import { TransparentButton } from '../transparent-button'

const socialLinks = [
  { Icon: FaXTwitter, href: "https://twitter.com/_AmanSurya", label: "Twitter" },
  { Icon: Github, href: "https://github.com/AmanSuryavanshi-1", label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/amansuryavanshi-ai/", label: "LinkedIn" },
  { Icon: Instagram, href: "https://www.instagram.com/__aman_suryavanshi__/", label: "Instagram" },
]

export default function CTA() {
  const [activePreview, setActivePreview] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const isInBlogPost = pathname?.startsWith('/blogs/')
  const isInLearnMore = pathname === '/about'

  const handleProjectsClick = () => {
    // Always redirect to main projects page for consistent experience
    router.push('/projects')
  }

  const handleJourneyClick = () => {
    if (isInBlogPost) {
      router.push('/blogs')
    } else if (isInLearnMore) {
      router.push('/#experience')
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

  return (
    <section className="w-full py-12 sm:py-20 sm:pb-32">
      {/* Contact Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container max-w-4xl mx-auto px-4 sm:px-6"
      >
        <motion.div
          custom={0.2}
          variants={fadeInUpVariants}
          className="text-center space-y-6 py-10 bg-gradient-to-br from-white to-sage-50 dark:from-[#0f291e] dark:to-[#0a1f15] rounded-3xl p-6 md:p-10 shadow-lg border border-sage-100 dark:border-forest-700/50 relative overflow-hidden group hover:border-lime-500/30 transition-all duration-500"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-lime-500 to-transparent opacity-50" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl group-hover:bg-lime-500/20 transition-all duration-500" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-forest-500/10 rounded-full blur-3xl group-hover:bg-forest-500/20 transition-all duration-500" />

          <div className="space-y-4 relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold font-serif text-forest-900 dark:text-sage-100">
              Let&apos;s Create Something <span className="text-lime-600 dark:text-lime-400">Amazing</span> Together!
            </h3>
            <p className="text-forest-700 dark:text-sage-300 text-base max-w-xl mx-auto leading-relaxed">
              Whether you have a project in mind or just want to connect, I&apos;m always excited to collaborate and bring ideas to life.
            </p>
            <div className="flex justify-center pt-3">
              <TransparentButton
                href="/#contact"
                icon={MessageSquare}
                label="Let&apos;s Work Together"
              />
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-forest-900/5 dark:border-sage-100/10 relative z-10 w-full max-w-lg mx-auto">
            <p className="text-forest-400 dark:text-sage-400 mb-6 font-medium uppercase tracking-widest text-xs">
              Connect with me on social media
            </p>
            <motion.div
              className="flex justify-center gap-5"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                }
              }}
            >
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-2.5 rounded-xl bg-white dark:bg-forest-800 border border-sage-100 dark:border-forest-700 text-forest-600 dark:text-sage-300 transition-all duration-200 hover:scale-110 hover:shadow-md hover:text-lime-600 dark:hover:text-lime-400 hover:border-lime-200 dark:hover:border-lime-500/30"
                  aria-label={`Visit Aman Suryavanshi's ${label} profile`}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Journey Section */}
        <motion.div
          custom={0.4}
          variants={fadeInUpVariants}
          className="mt-16 space-y-8"
        >
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold font-serif text-forest-900 dark:text-sage-100">
              Continue the <span className="text-lime-600 dark:text-lime-400">Journey</span>
            </h2>
            <p className="text-forest-600 dark:text-sage-300 max-w-xl mx-auto text-sm">
              Thanks for taking the time to explore my work! Let&apos;s connect and create something amazing together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 max-w-3xl mx-auto">
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
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 z-50">
                  <PreviewCard
                    type="projects"
                    onEnter={handleProjectsClick}
                  />
                </div>
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
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 z-50">
                  <PreviewCard
                    type="blogs"
                    onEnter={() => window.location.href = '/blogs'}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
