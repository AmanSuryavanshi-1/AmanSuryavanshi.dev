'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { portfolioData, ServiceData } from '@/data/portfolio';
import { AlertCircle, Lightbulb, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const ServiceCard: React.FC<{ service: ServiceData, index: number }> = ({ service, index }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="group h-full flex flex-col overflow-hidden border-2 border-sage-100 bg-white/50 backdrop-blur-sm 
                       hover:border-lime-500 hover:shadow-xl hover:shadow-lime-500/10 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-2xl bg-forest-50 border border-sage-100 text-forest-900 
                          group-hover:bg-lime-500 group-hover:text-forest-900 transition-colors duration-300">
              <div className="[&>svg]:w-6 [&>svg]:h-6">
                {service.icon}
              </div>
            </div>
            <Badge variant="secondary" className="bg-sage-100/50 text-forest-700 border-sage-100">
              0{index + 1}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-forest-900 group-hover:text-lime-600 transition-colors duration-300">
            {service.title}
          </CardTitle>
          <p className="text-sm font-medium text-lime-600 mt-1">
            {service.subtitle}
          </p>
        </CardHeader>

        <CardContent className="flex-grow flex flex-col gap-4">
          {/* Problem & Solution */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-forest-700">
                <span className="font-semibold text-forest-900">Problem: </span>
                {service.problem}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-lime-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-forest-700">
                <span className="font-semibold text-forest-900">Solution: </span>
                {service.solution}
              </p>
            </div>
          </div>

          {/* Outcomes */}
          <div className="bg-forest-50/50 rounded-xl p-3 border border-sage-100">
            <p className="text-xs font-semibold text-forest-900 mb-2 uppercase tracking-wide">Outcomes</p>
            <div className="flex flex-wrap gap-1.5">
              {service.outcomes.map((outcome, idx) => (
                <Badge key={idx} variant="secondary" className="bg-lime-100 text-forest-800 border-lime-200 text-xs">
                  {outcome}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1">
            {service.tech.map((tech, idx) => (
              <Badge key={idx} variant="outline" className="text-xs border-sage-200 text-forest-600 bg-white/50">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Ideal Client */}
          <div className="flex items-start gap-2 text-xs text-forest-600 italic">
            <Users className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span><span className="font-medium">Ideal for:</span> {service.idealClient}</span>
          </div>

          {/* Related Projects - Inline badges like Experience section */}
          {service.relatedProjects && service.relatedProjects.length > 0 && (
            <div className="mt-auto pt-3 border-t border-sage-100">
              <p className="text-xs font-semibold text-forest-900 mb-2 uppercase tracking-wide">Related Projects</p>
              <div className="flex flex-wrap gap-2">
                {service.relatedProjects.map((project, idx) => (
                  <Link
                    key={idx}
                    href={project.url}
                    className="inline-flex items-center gap-1.5 bg-forest-50 border border-forest-200 text-forest-700 
                             hover:bg-lime-100 hover:border-lime-400 hover:text-lime-800 
                             transition-all duration-200 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer group"
                  >
                    {project.title}
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="w-full py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-lime-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-lime-500 text-forest-900 px-4 py-1">
            Consulting Services
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">
            <span className="text-forest-900">Client Problems → </span>
            <span className="text-lime-500">My Solutions</span>
          </h2>
          <p className="text-forest-700 max-w-2xl mx-auto text-lg">
            I specialize in turning disconnected tools into seamless automated systems that deliver measurable business outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {portfolioData.services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
