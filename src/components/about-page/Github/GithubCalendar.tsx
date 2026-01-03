"use client"

import React from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

// Dynamically import GitHubCalendar with ssr: false
const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((mod) => mod.default),
  { ssr: false }
)

export const GithubCalendarComponent: React.FC = () => {

  return (
    <div className="w-full max-w-6xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-forest-900 dark:text-sage-100 mb-6 md:mb-4"
      >
        My <span className="text-lime-600 dark:text-lime-400">GitHub</span> Contributions
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-forest-700 dark:text-sage-300 max-w-3xl mx-auto mb-6 md:mb-12 text-base md:text-lg leading-relaxed"
      >
        Exploring the digital landscape, one commit at a time. My GitHub journey reflects a passion for continuous learning, innovative solutions, and collaborative development.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="group h-full overflow-hidden rounded-3xl 
                         border border-sage-200/60 dark:border-white/10 
                         bg-white/60 dark:bg-forest-900/40 
                         backdrop-blur-md 
                         transition-all duration-300 
                         shadow-xl hover:shadow-2xl 
                         hover:bg-white/80 dark:hover:bg-forest-800/50">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-center w-full gap-4 mb-8">
              <div className="p-3 rounded-xl bg-forest-100 dark:bg-forest-800 text-forest-900 dark:text-sage-200 group-hover:bg-lime-500 group-hover:text-white transition-colors duration-300">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-forest-900 dark:text-sage-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-300">
                Contribution Landscape
              </h3>
            </div>

            {/* Calendar Container */}
            <div className="w-full overflow-x-auto flex justify-center items-center py-6">
              <div className="flex justify-center min-w-fit">
                {/* Light mode calendar */}
                <div className="block dark:hidden">
                  <GitHubCalendar
                    username="AmanSuryavanshi-1"
                    blockSize={14}
                    blockMargin={5}
                    fontSize={16}
                    colorScheme="light"
                    theme={{
                      light: [
                        '#e8f0de', // Level 0 - light sage
                        '#dcfce7', // Level 1 - lime-100
                        '#84cc16', // Level 2 - lime-500
                        '#4d7c0f', // Level 3 - lime-700
                        '#12372A', // Level 4 - forest-900
                      ],
                      dark: [
                        '#1a3a2a', // Level 0
                        '#2d5a3d', // Level 1
                        '#4d7c0f', // Level 2
                        '#65a30d', // Level 3
                        '#84cc16', // Level 4
                      ]
                    }}
                  />
                </div>
                {/* Dark mode calendar */}
                <div className="hidden dark:block">
                  <GitHubCalendar
                    username="AmanSuryavanshi-1"
                    blockSize={14}
                    blockMargin={5}
                    fontSize={16}
                    colorScheme="dark"
                    theme={{
                      light: [
                        '#e8f0de', // Level 0
                        '#dcfce7', // Level 1
                        '#84cc16', // Level 2
                        '#4d7c0f', // Level 3
                        '#12372A', // Level 4
                      ],
                      dark: [
                        '#1a3a2a', // Level 0 - darker forest
                        '#224d36', // Level 1 - medium forest
                        '#3d6f4a', // Level 2 - lighter forest
                        '#65a30d', // Level 3 - lime-600
                        '#84cc16', // Level 4 - lime-500
                      ]
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-forest-700 dark:text-sage-400 mt-6 max-w-4xl mx-auto text-center leading-relaxed">
              This graph showcases my GitHub activity over the past year. Each square represents a day, with darker colors indicating more contributions.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default GithubCalendarComponent