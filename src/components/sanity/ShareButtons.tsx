'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter as X, Linkedin, Facebook, Copy } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'sonner';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

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

  const shareLinks = [
    {
      name: 'Twitter',
      icon: X,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <motion.div
      className="flex items-center gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {shareLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest-900 hover:text-lime-700 transition-colors duration-300"
          variants={itemVariants}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className="h-5 w-5" />
        </motion.a>
      ))}
      <motion.button
        onClick={copyToClipboard}
        className="text-forest-900 hover:text-lime-700 transition-colors duration-300"
        variants={itemVariants}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Copy link"
      >
        <Copy className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );
}
