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
    <section className="flex items-center justify-center w-full px-4 py-12 md:py-16">
      <div className="w-full max-w-6xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-forest-900 mb-6 md:mb-4"
        >
          My <span className="text-lime-500">GitHub</span> Contributions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-forest-700 max-w-3xl mx-auto mb-6 md:mb-12 text-base md:text-lg leading-relaxed"
        >
          Exploring the digital landscape, one commit at a time. My GitHub journey reflects a passion for continuous learning, innovative solutions, and collaborative development.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{
            y: -10,
            transition: { type: "spring", stiffness: 300 }
          }}
          className="w-full"
        >
          <Card className="group h-full overflow-hidden rounded-3xl border-4 border-sage-100 bg-gradient-to-br from-lime-500 to-lime-100 hover:from-forest-900 hover:to-forest-500 transition-all duration-300 shadow-lg shadow-forest-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-full gap-4 mb-6">
                <div className="p-4 rounded-full bg-forest-900 border-[3px] shadow-md shadow-forest-900 border-sage-100 text-lime-500 group-hover:bg-lime-500 group-hover:text-forest-900 transition-colors duration-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold text-forest-900 group-hover:text-lime-500 transition-colors duration-300">
                  Contribution Landscape
                </h3>
              </div>

              <div className="w-full overflow-x-auto flex justify-center items-center py-4">
                <div className="flex justify-center min-w-fit text-forest-900 group-hover:text-lime-500">
                  <GitHubCalendar
                    username="AmanSuryavanshi-1"
                    blockSize={14}
                    blockMargin={5}
                    fontSize={16}
                    theme={{
                      dark: [
                        '#ADBC9F',
                        '#749A48',
                        '#436850',
                        '#2A5741',
                        '#12372A',
                      ]
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-forest-700 group-hover:text-sage-100 transition-colors duration-300 max-w-4xl text-center">
                This graph showcases my GitHub activity over the past year. Each square represents a day, with darker colors indicating more contributions.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default GithubCalendarComponent