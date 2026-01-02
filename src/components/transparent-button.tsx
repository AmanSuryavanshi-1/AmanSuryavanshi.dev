import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface TransparentButtonProps {
  href: string
  icon: LucideIcon
  label: string
  external?: boolean
  download?: boolean
}

export function TransparentButton({
  href,
  icon: Icon,
  label,
  external,
  download
}: TransparentButtonProps) {
  const ButtonWrapper = external ? motion.a : motion(Link)
  const buttonProps = external ? {
    href,
    target: "_blank",
    rel: "noopener noreferrer",
    download: download
  } : { href }

  return (
    <Button
      asChild
      size="lg"
      className="group relative border-4 rounded-3xl overflow-hidden bg-transparent
        shadow-md shadow-sage-300 border-lime-500 hover:bg-lime-500 text-forest-900
        dark:shadow-black/30 dark:border-lime-500/70 dark:hover:border-lime-400 dark:hover:bg-lime-500 dark:text-sage-100 dark:hover:text-forest-950"
    >
      <ButtonWrapper
        {...buttonProps}
        whileHover={{ scale: 1.05, rotate: 3 }}
        whileTap={{ scale: 0.95, rotate: -3 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.span
          className="absolute inset-0 bg-lime-400 dark:bg-lime-500"
          initial={{ x: "100%" }}
          whileHover={{ x: 0 }}
          transition={{ type: "tween", ease: "easeInOut" }}
        />
        <span className="relative z-10 flex items-center">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="w-5 h-5 mr-2" />
          </motion.div>
          <span>{label}</span>
        </span>
      </ButtonWrapper>
    </Button>
  )
} 