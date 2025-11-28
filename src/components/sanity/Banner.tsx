'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Banner = () => {
  const scrollToArticles = () => {
    const articlesElement = document.getElementById('all-articles');
    if (articlesElement) {
      articlesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden min-h-[40vh] flex items-center bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 shadow-lg">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-500/10 to-transparent animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-12 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Main Heading */}
          <motion.h1
            className="font-serif text-2xl md:text-4xl font-bold tracking-tight text-sage-100 leading-[1.2]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to My <span className="text-lime-500">Blog</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-4 text-lg sm:text-xl leading-relaxed text-sage-300 max-w-2xl line-clamp-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Exploring the realms of Web Development, Agentic AI, n8n Automations, and documenting my Project Journey
          </motion.p>

          {/* Call to Action Button */}
          <motion.button
            className="group mt-8 px-8 py-3 bg-transparent border border-lime-500/50 text-lime-400 font-medium rounded-full hover:bg-lime-500 hover:text-forest-900 hover:border-lime-500 transition-all duration-300 shadow-[0_0_20px_rgba(132,204,22,0.1)] hover:shadow-[0_0_30px_rgba(132,204,22,0.4)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={scrollToArticles}
          >
            Explore Articles
            <ArrowRight className="inline-block ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>

      {/* Animated Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-900 via-lime-500 to-forest-900 animate-gradient-x"></div>
    </div>
  );
};

export default Banner;