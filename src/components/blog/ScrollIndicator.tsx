'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ScrollIndicator() {
    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 100], [1, 0])

    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            // Hide completely when scrolled to avoid blocking clicks
            if (latest > 100) {
                setIsVisible(false)
            } else {
                setIsVisible(true)
            }
        })
    }, [scrollY])

    if (!isVisible) return null

    return (
        <motion.div
            style={{ opacity }}
            className="absolute bottom-6 right-6 md:right-10 pointer-events-none z-30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
        >
            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="p-2.5 rounded-full border border-white/20 bg-black/20 backdrop-blur-md shadow-lg"
            >
                <ArrowDown className="w-4 h-4 text-lime-400 drop-shadow-sm" strokeWidth={2.5} />
            </motion.div>
        </motion.div>
    )
}
