'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { portfolioData, ServiceData } from '@/data/portfolio';
import { SolidButton } from '@/components/solid-button';
import { AlertCircle, Lightbulb, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Premium ServiceCard with Image Banner - Compact for 100vh fit
const ServiceCard: React.FC<{ service: ServiceData, index: number }> = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full group/card select-none" // Named group for isolation
    >
      <div className="h-full relative transition-all duration-500 transform group-hover/card:-translate-y-2">
        {/* Glow effect on hover */}
        <div className="absolute inset-x-4 -bottom-4 h-12 bg-lime-500/20 blur-xl rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="h-full flex flex-col overflow-hidden rounded-2xl
                        border border-sage-200/60 dark:border-white/5
                        bg-white dark:bg-[#162c22]
                        shadow-lg shadow-forest-900/5 dark:shadow-black/30
                        group-hover/card:shadow-2xl group-hover/card:shadow-lime-500/15 
                        group-hover/card:border-lime-500/40 dark:group-hover/card:border-lime-500/30
                        transition-all duration-500">

          {/* Image Banner with Tech Tags Overlay */}
          <div className="relative h-32 md:h-36 w-full overflow-hidden bg-forest-900/5 dark:bg-forest-950/50">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-700 group-hover/card:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/20 to-transparent" />

            {/* Tech Stack Tags - On Image */}
            <div className="absolute bottom-2 left-3 right-3 flex flex-wrap gap-1">
              {service.tech.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[9px] px-1.5 py-0.5 rounded-full 
                             border border-white/30
                             text-white/90
                             bg-black/30 backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Service number badge */}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 dark:bg-forest-900/90 text-forest-700 dark:text-sage-300 font-mono text-[10px] tracking-wider border-0 backdrop-blur-sm">
                0{index + 1}
              </Badge>
            </div>
          </div>

          {/* Content Section - Compact Layout */}
          <div className="flex-grow flex flex-col p-4 md:p-5 gap-3">

            {/* Icon + Title Row */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-forest-50 dark:bg-forest-800 border border-forest-100 dark:border-forest-600 
                              text-forest-900 dark:text-sage-100
                              group-hover/card:bg-lime-500 group-hover/card:text-white group-hover/card:border-lime-500
                              transition-all duration-300 shrink-0">
                <div className="[&>svg]:w-5 [&>svg]:h-5">
                  {service.icon}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-forest-900 dark:text-sage-100 
                               group-hover/card:text-lime-700 dark:group-hover/card:text-lime-400 
                               transition-colors duration-300 leading-tight">
                  {service.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-forest-500 dark:text-sage-400 mt-0.5 line-clamp-1">
                  {service.subtitle}
                </p>
              </div>
            </div>

            {/* Problem/Solution Section - Readable Size */}
            <div className="space-y-2.5 p-3 rounded-lg bg-forest-50/50 dark:bg-forest-800/30 border border-forest-100/50 dark:border-forest-600/30">
              {/* Problem */}
              <div className="flex items-start gap-2">
                <div className="mt-0.5 p-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-forest-900 dark:text-sage-100 block mb-0.5">Problem</span>
                  <p className="text-xs text-forest-600 dark:text-sage-300 leading-relaxed">
                    {service.problem}
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-forest-200/30 dark:bg-sage-300/10" />

              {/* Solution */}
              <div className="flex items-start gap-2">
                <div className="mt-0.5 p-1 rounded-full bg-lime-100 dark:bg-lime-500/20 text-lime-600 dark:text-lime-400 shrink-0">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-forest-900 dark:text-sage-100 block mb-0.5">Solution</span>
                  <p className="text-xs text-forest-600 dark:text-sage-300 leading-relaxed">
                    {service.solution}
                  </p>
                </div>
              </div>
            </div>

            {/* Outcomes Badges - Intuitive Results */}
            <div className="flex flex-wrap gap-1.5">
              {service.outcomes.slice(0, 3).map((outcome, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-1 rounded-full 
                             border border-lime-200 dark:border-lime-500/30 
                             text-lime-700 dark:text-lime-400 
                             bg-lime-50 dark:bg-lime-500/10
                             font-medium"
                >
                  ✓ {outcome}
                </span>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* See Proof Links */}
            {service.relatedProjects && service.relatedProjects.length > 0 && (
              <div className="pt-2 border-t border-forest-100/50 dark:border-forest-600/30">
                {service.relatedProjects.filter(p => p && p.url).map((project, idx) => (
                  <Link
                    key={idx}
                    href={project.url}
                    className="inline-flex items-center gap-1 text-[10px] font-medium 
                               text-lime-600 dark:text-lime-400 
                               hover:text-lime-800 dark:hover:text-lime-300 
                               transition-colors group/proof"
                  >
                    <span className="text-forest-400 dark:text-sage-500">See Proof:</span>
                    <span className="underline underline-offset-2 line-clamp-1">{project.title}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/proof:opacity-100 group-hover/proof:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Services Carousel with Side Navigation & Touch Swipe
const ServicesCarousel: React.FC<{ services: ServiceData[] }> = ({ services }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(1);
  const [isPaused, setIsPaused] = React.useState(false);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  React.useEffect(() => {
    const handleResize = () => {
      // Prioritize 2 cards for tablet/desktop
      if (window.innerWidth >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(services.length / itemsPerPage);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Autoplay functionality - 5 seconds
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) nextSlide(); // Swipe Left -> Next
    if (distance < -minSwipeDistance) prevSlide(); // Swipe Right -> Prev
  };

  const visibleServices = services.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <div
      className="relative group/carousel px-2 max-w-6xl mx-auto" // Named group for carousel
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Side Navigation Buttons - Desktop/Tablet Only */}
      {totalPages > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 items-center justify-center rounded-full 
                       bg-white/80 dark:bg-forest-900/80 backdrop-blur-sm
                       border border-forest-100 dark:border-forest-700
                       text-forest-600 dark:text-sage-300
                       shadow-lg hover:bg-lime-500 hover:text-white hover:border-lime-500 hover:scale-110
                       transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 items-center justify-center rounded-full 
                       bg-white/80 dark:bg-forest-900/80 backdrop-blur-sm
                       border border-forest-100 dark:border-forest-700
                       text-forest-600 dark:text-sage-300
                       shadow-lg hover:bg-lime-500 hover:text-white hover:border-lime-500 hover:scale-110
                       transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Cards Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 touch-pan-y" // Enable vertical scroll, horizontal swipe handled
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          {visibleServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={currentIndex * itemsPerPage + index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Dots (Context only, simplified) */}
      {
        totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex
                  ? 'bg-lime-500 w-8'
                  : 'bg-forest-200 dark:bg-forest-800 w-2 hover:bg-lime-300'
                  }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )
      }
    </div >
  );
};

// Main Services Section
const ServicesSection: React.FC = () => {
  const services = portfolioData.services;

  return (
    <section
      id="services"
      className="py-12 md:py-16 scroll-mt-20 bg-gradient-to-b from-transparent via-forest-50/30 to-transparent dark:via-forest-950/20"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <Badge variant="secondary" className="mb-2 bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-500/30">
            Systems I Build
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-forest-900 dark:text-sage-100 mb-3">
            Production-Grade <span className="text-lime-500">AI Systems</span>
          </h2>
          <p className="text-forest-600 dark:text-sage-300 max-w-xl mx-auto text-xs sm:text-sm">
            Revenue-generating systems with self-healing architecture, deployed in production.
          </p>
        </motion.div>

        <ServicesCarousel services={services} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <SolidButton
            href="/#contact"
            label="Book Your System Audit"
            icon={ArrowRight}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
