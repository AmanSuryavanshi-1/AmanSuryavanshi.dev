'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
//  useScroll, useTransform 
import { Menu, X, Sun, Moon, Home, FolderGit2, User2, Briefcase, BookOpen, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import logo from "../../public/Profile/PFP-Cricular.webp"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('Home')
  // const { scrollY } = useScroll()
  const { theme, setTheme } = useTheme()

  // const headerBackground = useTransform(
  //   scrollY,
  //   [0, 50],
  //   ['rgba(18, 55, 42, 0)', 'rgba(78, 135, 115, 0.95)']
  // )

  const navItems = [
    { name: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Projects', href: '/#projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { name: 'Services', href: '/#services', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'About', href: '/#about', icon: <User2 className="w-4 h-4" /> },
    { name: 'Blogs', href: '/blogs', icon: <BookOpen className="w-4 h-4" /> },
  ]

  return (
    <motion.header
      // style={{ background: headerBackground }}
      className="fixed w-full z-50 top-0 h-[9vh] flex items-center"
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="w-40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="AS Logo"
                width={40}
                height={40}
                className='rounded-full'
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation - Centered with glass effect */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <motion.div
              className="flex items-center bg-forest-900/30 backdrop-blur-lg border border-forest-900/20 rounded-full px-1 py-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {navItems.map((item, index) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setActiveItem(item.name)}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all duration-300 rounded-full",
                      activeItem === item.name
                        ? "text-forest-900 bg-lime-500"
                        : "text-sage-100 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <motion.span
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.icon}
                      {item.name}
                    </motion.span>
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2 w-40 justify-end">
            {/* Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-text-primary hover:text-lime-500 dark:text-text-dark-primary dark:hover:text-lime-400 transition-interaction"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/#contact">
                <Button
                  variant="default"
                  className="bg-btn-primary-bg hover:bg-btn-primary-bg-hover text-btn-primary-text dark:bg-btn-dark-primary-bg dark:hover:bg-btn-dark-primary-hover-bg dark:text-btn-dark-primary-text flex items-center gap-2 rounded-full transition-interaction"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            className="md:hidden"
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-sage-100 hover:text-lime-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </motion.div>
        </nav>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isOpen ? {
            height: 'auto',
            opacity: 1,
            transition: {
              height: { duration: 0.3 },
              opacity: { duration: 0.2 }
            }
          } : {
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.3 },
              opacity: { duration: 0.2 }
            }
          }}
          className="md:hidden overflow-hidden fixed top-[4rem] left-0 right-0 z-50 bg-forest-900/30 backdrop-blur-lg border-y border-forest-900/20"
        >
          <div className="px-4 py-4 space-y-2 max-w-screen-xl mx-auto">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.name)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg transition-colors",
                    activeItem === item.name
                      ? "text-forest-900 bg-lime-500"
                      : "text-sage-100 hover:text-lime-500"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              className="flex items-center justify-between px-3 py-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Theme Toggle - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-sage-100 hover:text-lime-500 dark:text-text-dark-primary dark:hover:text-lime-400"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Link href="/#contact">
                <Button
                  variant="default"
                  className="bg-btn-primary-bg hover:bg-btn-primary-bg-hover text-btn-primary-text dark:bg-btn-dark-primary-bg dark:hover:bg-btn-dark-primary-hover-bg dark:text-btn-dark-primary-text flex items-center gap-2 rounded-full transition-interaction"
                  onClick={() => setIsOpen(false)}
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default Header