'use client'

import Link from 'next/link'
import { motion, useAnimationControls } from 'framer-motion'
import { FaHome } from 'react-icons/fa'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useEffect } from 'react'

const Tree = ({ height = '30vh', left = 0, delay = 0 }) => (
  <motion.div
    className="absolute bottom-0"
    style={{
      left: `${left}%`,
      height,
      aspectRatio: '1/2',
    }}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 0.8 }}
    transition={{ duration: 0.5, delay }}
  >
    <svg viewBox="0 0 100 200" className="w-full h-full text-forest-900/40">
      <path d="M50 0 L10 80 H90 Z" fill="currentColor" />
      <path d="M50 40 L0 120 H100 Z" fill="currentColor" />
      <path d="M50 80 L5 160 H95 Z" fill="currentColor" />
      <rect x="45" y="160" width="10" height="40" fill="currentColor" />
    </svg>
  </motion.div>
)

const GlowingBall = ({ delay = 0, left = 50 }) => (
  <motion.div
    className="absolute top-0 pointer-events-none"
    style={{
      left: `${left}%`,
      width: '6px',
      height: '6px',
      background: 'white',
      borderRadius: '50%',
      boxShadow: `
        0 0 4px 2px rgba(255, 255, 255, 0.3),
        0 0 8px 4px rgba(255, 255, 255, 0.2),
        0 0 12px 6px rgba(255, 255, 255, 0.1)
      `
    }}
    initial={{ y: -20, opacity: 0 }}
    animate={{
      y: ['0vh', '100vh'],
      opacity: [0, 1, 0],
      scale: [0.8, 1.2, 0.8]
    }}
    transition={{
      duration: 5 + Math.random() * 3,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  />
)

const EyesAnimation = () => {
  const leftEyeControls = useAnimationControls()
  const rightEyeControls = useAnimationControls()

  useEffect(() => {
    const blink = async () => {
      await Promise.all([
        leftEyeControls.start({ scaleY: 0.2 }, { duration: 0.1 }),
        rightEyeControls.start({ scaleY: 0.2 }, { duration: 0.1 })
      ])
      await Promise.all([
        leftEyeControls.start({ scaleY: 1 }, { duration: 0.1 }),
        rightEyeControls.start({ scaleY: 1 }, { duration: 0.1 })
      ])
    }

    const blinkInterval = setInterval(() => {
      if (Math.random() < 0.7) {
        blink()
      }
    }, 2000)

    const sequence = async () => {
      const readLine = async (startX: number, endX: number, y: number) => {
        for (let x = startX; x <= endX; x += 1) {
          await Promise.all([
            leftEyeControls.start({ x, y, transition: { duration: 0.2 } }),
            rightEyeControls.start({ x, y, transition: { duration: 0.2 } })
          ])
        }
        await new Promise(resolve => setTimeout(resolve, 300))
      }

      while (true) {
        await Promise.all([
          leftEyeControls.start({ x: 0, y: 2, scale: 1 }),
          rightEyeControls.start({ x: 0, y: 2, scale: 1 })
        ])
        await new Promise(resolve => setTimeout(resolve, 1000))

        await readLine(-3, 3, 4)
        await readLine(-4, 4, 6)
        await readLine(-4, 4, 7)

        for (let i = 0; i < 3; i++) {
          const x = Math.random() * 6 - 3
          const y = Math.random() * 4
          await Promise.all([
            leftEyeControls.start({ x, y, transition: { duration: 0.5 } }),
            rightEyeControls.start({ x, y, transition: { duration: 0.5 } })
          ])
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    }

    sequence()
    return () => clearInterval(blinkInterval)
  }, [leftEyeControls, rightEyeControls])

  return (
    <motion.div
      className="w-40 h-40 md:w-44 md:h-44 mx-auto mb-8 relative"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Spring Antenna */}
      <motion.div
        className="absolute -top-6 left-1/2 -translate-x-1/2"
        animate={{
          rotateZ: [-4, 4, -4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-1.5 bg-forest-700" style={{ height: '20px' }}>
          <svg width="6" height="20" viewBox="0 0 6 20">
            <path
              d="M3,0 Q6,4 3,8 Q0,12 3,16 Q6,20 3,20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="w-3 h-3 rounded-full bg-lime-500 absolute -top-1.5 left-1/2 -translate-x-1/2
                     shadow-[0_0_8px_rgba(157,207,111,0.6)]" />
      </motion.div>

      {/* Head */}
      <div className="w-full h-full bg-sage-100 rounded-xl flex items-center justify-center
                    relative border-2 border-forest-900 shadow-lg">
        {/* Side Panels */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-3 h-7 bg-lime-500 rounded-l-lg border-2 border-forest-900" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-3 h-7 bg-lime-500 rounded-r-lg border-2 border-forest-900" />

        {/* Rivets */}
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-forest-700" />
        <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-forest-700" />
        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-forest-700" />
        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-forest-700" />

        {/* Eyes */}
        <div className="flex gap-6 -mt-2">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-sage-300 flex items-center justify-center relative
                       border-2 border-forest-900">
            <motion.div
              className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-lime-500 absolute
                       shadow-[0_0_8px_rgba(157,207,111,0.4)]"
              animate={leftEyeControls}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-sage-100 rounded-full" />
              </div>
            </motion.div>
          </div>
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-sage-300 flex items-center justify-center relative
                       border-2 border-forest-900">
            <motion.div
              className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-lime-500 absolute
                       shadow-[0_0_8px_rgba(157,207,111,0.4)]"
              animate={rightEyeControls}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-sage-100 rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mouth */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-3 bg-sage-300 rounded-sm
                     border-2 border-forest-900" />
      </div>
    </motion.div>
  )
}

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-screen max-md:h-auto py-12 pt-32 relative bg-gradient-to-br from-forest-900 via-forest-700 to-forest-900 overflow-hidden">
      {/* Trees */}
      <Tree height="60vh" left={2} delay={0} />
      <Tree height="35vh" left={15} delay={0.2} />

      {/* Glowing Balls */}
      {[...Array(30)].map((_, i) => (
        <GlowingBall
          key={i}
          delay={i * 0.2}
          left={Math.random() * 100}
        />
      ))}

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EyesAnimation />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lime-500 font-medium font-sans text-2xl mb-6 tracking-wider"
          >
            404 ERROR
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-sage-100 leading-tight">
            Oops! You&apos;ve wandered off the trail.
          </h1>

          <p className="text-xl text-sage-300 max-w-lg mx-auto leading-relaxed">
            Don&apos;t worry, even the most experienced explorers get lost sometimes. Let&apos;s get you back on track!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link
              href="/"
              className="group flex items-center gap-3 px-8 py-4 bg-lime-500 text-forest-900 rounded-xl
                       hover:bg-lime-700 transition-all duration-300 font-medium shadow-lg"
            >
              <FaHome className="w-5 h-5" />
              <span>Return to Base Camp</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-3 px-8 py-4 text-sage-100 rounded-xl
                       border-2 border-sage-300/20 hover:border-sage-300/40 hover:bg-sage-300/5
                       transition-all duration-300"
            >
              <IoArrowBackOutline className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
              <span>Retrace Your Steps</span>
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}