'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Mail, MapPin, Download, Home, User2,
  Briefcase, FolderGit2, BookOpen, ArrowUpRight,
  Bot, Network, Code2, Zap, ShieldCheck, Layers
} from 'lucide-react'
import { motion } from 'framer-motion'
import HeaderSocial from './hero/HeroSocial'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  
  const quickLinks = [
    { name: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'About', href: '/#about', icon: <User2 className="w-4 h-4" /> },
    { name: 'Services', href: '/#services', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Projects', href: '/#projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { name: 'Blogs', href: '/blogs', icon: <BookOpen className="w-4 h-4" /> },
    { href: "/AmanSuryavanshi_Resume_Latest.pdf", name: "Resume", icon: <Download className="w-4 h-4" />, download: true }
  ]

  const seoKeywords = [
    "n8n Automation Expert",
    "LangGraph Architect",
    "Next.js Systems Builder",
    "AI Workflow Automation India",
    "Technical Authority",
    "Systems Architect"
  ]

  return (
    <footer className="w-full bg-[#0a1f15] text-sage-200 border-t border-forest-800/40 transition-colors duration-300 flex flex-col relative">
      
      {/* Decorative Ambient Top Glow Overlay */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-lime-500/25 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full pt-10 pb-6 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Personal Branding Section */}
          <motion.div
            className="flex flex-col items-center lg:items-start space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center lg:justify-start items-center space-x-4">
              <div className="rounded-full p-2 border border-forest-800 bg-lime-500 shadow-[0_0_15px_rgba(133,184,90,0.25)]">
                <Image
                  src="/Profile/Logo.webp"
                  alt="AS Logo"
                  width={32}
                  height={32}
                />
              </div>
              <Image
                src="/Profile/PFP-Cricular.webp"
                alt="Aman Suryavanshi"
                width={56}
                height={56}
                className="rounded-full border border-forest-800 shadow-sm"
              />
            </div>
            
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-lime-400 tracking-tight">Aman Suryavanshi</h3>
              <p className="text-sage-300 mt-1 font-medium text-xs">AI Workflow Architect & Systems Builder</p>
            </div>

            <div className="pt-1">
              <HeaderSocial 
                className="!flex !flex-row gap-4 mb-0 lg:mb-0 justify-center lg:justify-start" 
                isInverted={true}
              />
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            className="flex flex-col items-center lg:items-start space-y-4 lg:pl-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xs uppercase tracking-wider font-bold text-sage-400">Navigation</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 font-medium text-sage-200 hover:text-lime-400 transition-colors group justify-center lg:justify-start"
                  target={link.name === "Resume" ? "_blank" : "_self"}
                  download={link.download}
                >
                  <span className="text-sage-500 group-hover:text-lime-400 transition-colors">{link.icon}</span>
                  <span className="group-hover:translate-x-1 transition-transform text-sm">{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact & CTA Section */}
          <motion.div
            className="flex flex-col items-center lg:items-end space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xs uppercase tracking-wider font-bold text-sage-400 w-full text-center lg:text-right">Connect</h4>
            <div className="space-y-3 w-full flex flex-col items-center lg:items-end">
              <a
                href="mailto:amansurya.work@gmail.com"
                className="flex items-center space-x-3 text-sage-200 hover:text-lime-400 transition-colors font-medium group text-sm"
              >
                <span>amansurya.work@gmail.com</span>
                <Mail size={16} className="text-sage-500 group-hover:text-lime-400 transition-colors" />
              </a>
              <div className="flex items-center space-x-3 text-sage-200 font-medium text-sm">
                <span>Delhi, India</span>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-sage-500" />
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lime-500"></span>
                  </span>
                </div>
              </div>
              
              <div className="pt-2">
                <Link
                  href="/#contact"
                  className="bg-lime-500 text-forest-950 px-5 py-2 rounded-full font-bold text-sm
                  hover:bg-lime-400 transition-all duration-300 hover:scale-[1.02] group flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(133,184,90,0.25)]"
                >
                  <span>Let&apos;s Work Together</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Copyright Section (Decreased Margin/Padding) */}
        <div className="mt-8 pt-4 border-t border-forest-800/40 px-6 flex justify-center">
          <p className="text-[11px] font-medium text-sage-400/50">
            &copy; {currentYear} Aman Suryavanshi. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Compressed Typographic Specialization Grid (Fits in a single line on desktop) */}
      <div className="w-full border-t border-forest-800/30 bg-[#010906] py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-3">
              <span className="h-px w-6 bg-forest-800/40"></span>
              <span className="text-[9px] tracking-[0.25em] font-bold text-sage-400/40 uppercase">
                Expertise & Specializations
              </span>
              <span className="h-px w-6 bg-forest-800/40"></span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {[
                { text: 'n8n Automation Expert', icon: <Bot className="w-3.5 h-3.5" /> },
                { text: 'LangGraph Architect', icon: <Network className="w-3.5 h-3.5" /> },
                { text: 'Next.js Systems Builder', icon: <Code2 className="w-3.5 h-3.5" /> },
                { text: 'AI Workflow Automation India', icon: <Zap className="w-3.5 h-3.5" /> },
                { text: 'Technical Authority', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                { text: 'Systems Architect', icon: <Layers className="w-3.5 h-3.5" /> }
              ].map((badge, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-2 px-3 py-1 rounded-full border border-forest-800/50 bg-[#06180e] hover:border-lime-500/40 hover:bg-[#0c2e1c] transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-lime-500/80 group-hover:text-lime-400 transition-colors duration-300">
                    {badge.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-sage-200 tracking-wide">
                    {badge.text}
                  </span>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lime-500"></span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer