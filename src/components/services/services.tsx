'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { portfolioData, ServiceData } from '@/data/portfolio';
import { SolidButton } from '@/components/solid-button';
import { AlertCircle, Lightbulb, Users, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ServiceCard: React.FC<{ service: ServiceData, index: number }> = ({ service, index }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full group perspective-1000"
    >
      <div className="h-full relative transition-all duration-500 transform group-hover:-translate-y-2 group-hover:rotate-x-2">
        {/* Shadow element that appears on hover */}
        <div className="absolute inset-x-4 -bottom-4 h-12 bg-lime-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <Card className="h-full flex flex-col overflow-hidden border border-white/60 bg-white/70 backdrop-blur-md 
                        shadow-lg shadow-forest-900/5
                        group-hover:shadow-2xl group-hover:shadow-lime-500/10 group-hover:border-lime-500/30 
                        transition-all duration-500 relative rounded-3xl">

          {/* Top decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-forest-100 via-lime-500 to-forest-100 opacity-50 group-hover:opacity-100 transition-opacity" />

          <CardHeader className="pb-3 pt-5 sm:pt-6 px-4 sm:px-5 md:px-6">
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-500 blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full" />
                <div className="relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-forest-50 border border-forest-100 text-forest-900 
                                group-hover:bg-lime-500 group-hover:text-white transition-colors duration-500">
                  <div className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
                    {service.icon}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-forest-50 text-forest-700 font-mono text-[10px] tracking-wider border border-forest-100">
                0{index + 1}
              </Badge>
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold font-serif text-forest-900 group-hover:text-lime-700 transition-colors duration-300">
              {service.title}
            </CardTitle>
            <p className="text-sm font-medium text-forest-500 mt-1.5 group-hover:text-forest-700 transition-colors">
              {service.subtitle}
            </p>
          </CardHeader>

          <CardContent className="flex-grow flex flex-col gap-3 sm:gap-4 px-4 sm:px-5 md:px-6 pb-5 sm:pb-6">
            {/* Problem & Solution */}
            <div className="space-y-2.5 sm:space-y-3 p-3 sm:p-3.5 rounded-xl bg-forest-50/50 border border-forest-100/50 group-hover:bg-forest-50 group-hover:border-forest-100 transition-colors duration-300">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1 rounded-full bg-amber-100 text-amber-600 shrink-0">
                  <AlertCircle className="w-3 h-3" />
                </div>
                <p className="text-xs md:text-sm text-forest-600 leading-relaxed">
                  <span className="font-semibold text-forest-900 block mb-0.5">Problem</span>
                  {service.problem}
                </p>
              </div>
              <div className="w-full h-px bg-forest-200/30" />
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1 rounded-full bg-lime-100 text-lime-600 shrink-0">
                  <Lightbulb className="w-3 h-3" />
                </div>
                <p className="text-xs md:text-sm text-forest-600 leading-relaxed">
                  <span className="font-semibold text-forest-900 block mb-0.5">Solution</span>
                  {service.solution}
                </p>
              </div>
            </div>

            {/* Outcomes */}
            <div>
              <p className="text-[10px] font-bold text-forest-400 uppercase tracking-widest mb-2">Outcomes</p>
              <div className="flex flex-wrap gap-1.5">
                {service.outcomes.map((outcome, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-white border text-forest-600 border-forest-100 text-[10px] py-0.5 px-2 hover:border-lime-300 hover:text-lime-700 transition-colors">
                    {outcome}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              {service.tech.map((tech, idx) => (
                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded-full border border-forest-200 text-forest-500 bg-transparent">
                  {tech}
                </span>
              ))}
            </div>

            {/* Related Projects Link */}
            {service.relatedProjects && service.relatedProjects.length > 0 && (
              <div className="mt-auto pt-3 border-t border-forest-100 flex items-center justify-between group/link">
                <span className="text-[10px] font-semibold text-forest-900 uppercase tracking-wide">
                  See in Action
                </span>
                <div className="flex -space-x-1.5">
                  {service.relatedProjects.map((project, idx) => (
                    <Link key={idx} href={project.url} title={project.title}>
                      <div className="w-7 h-7 rounded-full bg-forest-100 border-2 border-white flex items-center justify-center text-forest-600 hover:bg-lime-500 hover:text-white hover:z-10 transition-colors relative">
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

const ServicesCarousel: React.FC<{ services: ServiceData[] }> = ({ services }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(1);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Minimum swipe distance for gesture recognition
  const minSwipeDistance = 50;

  React.useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 2 : 1);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalChunks = Math.ceil(services.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalChunks);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalChunks) % totalChunks);
  };

  // Touch gesture handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Group services into chunks
  const chunks = [];
  for (let i = 0; i < services.length; i += itemsPerPage) {
    chunks.push(services.slice(i, i + itemsPerPage));
  }

  // Safe current chunk
  const currentChunk = chunks[currentIndex] || chunks[0];

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-12">
      {/* Fixed height container with relative positioning for buttons */}
      <div className="relative h-[550px] sm:h-[580px] lg:h-[480px]">
        {/* Scrollable content area with touch gestures */}
        <div
          className="overflow-hidden py-4 h-full touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="region"
          aria-label="Services carousel - swipe left or right to navigate"
          aria-live="polite"
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10"
            >
              {currentChunk.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons - positioned relative to fixed-height container */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/80 backdrop-blur-md border border-forest-100 text-forest-600 hover:bg-forest-900 hover:text-white hover:border-forest-900 transition-all duration-300 shadow-lg -ml-1 sm:-ml-2 lg:-ml-6"
          aria-label="Previous services"
        >
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/80 backdrop-blur-md border border-forest-100 text-forest-600 hover:bg-forest-900 hover:text-white hover:border-forest-900 transition-all duration-300 shadow-lg -mr-1 sm:-mr-2 lg:-mr-6"
          aria-label="Next services"
        >
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Pagination Dots - outside fixed container */}
      <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Carousel navigation">
        {chunks.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-forest-900 w-8' : 'bg-forest-200 w-2 hover:bg-forest-400'
              }`}
            aria-label={`Go to slide ${idx + 1} of ${chunks.length}`}
            aria-selected={currentIndex === idx}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="w-full relative py-8 lg:py-12 overflow-hidden">

      {/* Background Elements - Clean global background now */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-lime-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 lg:mb-8"
        >
          <Badge variant="outline" className="mb-3 border-lime-500 bg-white/50 text-forest-900 px-3 py-1">
            Consulting Services
          </Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif mb-3 tracking-tight">
            <span className="text-forest-900">Solving  </span>
            <span className="text-lime-600">Real Problems</span>
          </h2>
          <p className="text-forest-600 max-w-2xl mx-auto text-base">
            I specialize in turning disconnected tools into seamless automated systems that deliver measurable business outcomes.
          </p>
        </motion.div>

        <ServicesCarousel services={portfolioData.services} />

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <p className="text-forest-500 mb-4 text-sm">Have a specific challenge? Let's discuss a custom solution.</p>
          <div className="inline-flex justify-center">
            <SolidButton
              href="#contact"
              icon={ArrowRight}
              label="Book a discovery call"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
