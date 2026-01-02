import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface SolidButtonProps {
  href: string
  icon: LucideIcon
  label: string
  external?: boolean
}

export function SolidButton({
  href,
  icon: Icon,
  label,
  external
}: SolidButtonProps) {
  const ButtonWrapper = external ? motion.a : motion(Link)
  const buttonProps = external ? {
    href,
    target: "_blank",
    rel: "noopener noreferrer"
  } : { href }

  return (
    <Button
      asChild
      size="lg"
      className="group relative border-4 rounded-3xl overflow-hidden 
        border-forest-900 bg-forest-900 hover:bg-forest-700 hover:border-forest-700 text-sage-100
        dark:border-lime-500 dark:bg-lime-500 dark:hover:bg-lime-400 dark:hover:border-lime-400 dark:text-forest-950"
    >
      <ButtonWrapper
        {...buttonProps}
        whileHover={{ scale: 1.05, rotate: 3 }}
        whileTap={{ scale: 0.95, rotate: -3 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.span
          className="absolute inset-0 bg-forest-700 dark:bg-lime-400"
          initial={{ y: "100%" }}
          whileHover={{ y: 0 }}
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