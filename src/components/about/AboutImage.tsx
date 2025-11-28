'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/Profile/Me1.jpg',
  '/Profile/Me2.jpg'
];

const imageAltTexts = [
  'Aman Suryavanshi - Solutions Architect and AI Automation Consultant specializing in N8N workflow orchestration and Next.js development',
  'Aman Suryavanshi - Expert in business process automation, Firebase integration, and intelligent system architecture'
];

const AboutImage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px]">
        {/* Background decorative images */}
        <div
          className="absolute inset-0 -rotate-6 translate-x-4 translate-y-4"
          style={{
            background: 'rgba(34, 197, 94, 0.2)', // lime-500 with opacity
            borderRadius: '1.5rem',
            border: '8px solid white',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 rotate-3 -translate-x-4 -translate-y-4"
          style={{
            background: 'rgba(22, 101, 52, 0.2)', // forest-900 with opacity
            borderRadius: '1.5rem',
            border: '8px solid white',
          }}
          aria-hidden="true"
        />

        {/* Main image */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentImage]}
              alt={imageAltTexts[currentImage]}
              fill
              className="object-cover rounded-3xl shadow-xl shadow-forest-500 border-8 border-white"
              priority={currentImage === 0}
              sizes="(max-width: 768px) 280px, 320px"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AboutImage;
