'use client'

import { motion } from 'framer-motion';
import { Linkedin, Github, Instagram } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import type { FC } from 'react';

interface HeaderSocialProps {
  className?: string;
}

const HeaderSocial: FC<HeaderSocialProps> = ({ className = '' }) => {
  const socialIcons = [
    { Icon: FaXTwitter, href: "https://twitter.com/_AmanSurya", label: "Twitter" },
    { Icon: Github, href: "https://github.com/AmanSuryavanshi-1", label: "GitHub" },
    { Icon: Linkedin, href: "https://www.linkedin.com/in/aman-suryavanshi-6b0aba347/", label: "LinkedIn" },
    { Icon: Instagram, href: "https://www.instagram.com/__aman_suryavanshi__/", label: "Instagram" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`flex justify-center gap-6 mb-4 lg:grid header_socials lg:justify-start lg:mb-0 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {socialIcons.map(({ Icon, href, label }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative text-2xl text-forest-900 transition-colors hover:text-lime-500"
          aria-label={`Visit Aman Suryavanshi's profile`}
          variants={itemVariants}
          whileHover={{ scale: 1.3, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="absolute inset-0 bg-forest-700 rounded-full"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
          <motion.div className="relative z-10">
            <Icon className="w-5 h-5" />
          </motion.div>
        </motion.a>
      ))}
    </motion.div>
  );
};

export default HeaderSocial;