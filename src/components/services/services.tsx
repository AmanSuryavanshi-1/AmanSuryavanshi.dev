'use client';
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { portfolioData, ServiceData } from '@/data/portfolio';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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
          <p className="text-forest-700 text-sm leading-relaxed">
            {service.description}
          </p>

          <div className="mt-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="features" className="border-sage-100">
                <AccordionTrigger className="text-sm font-semibold text-forest-900 hover:text-lime-600 hover:no-underline py-2">
                  Key Features
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pt-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-forest-700">
                        <CheckCircle2 className="w-4 h-4 text-lime-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              variant="ghost"
              className="w-full mt-4 group/btn hover:bg-forest-50 hover:text-lime-600 justify-between"
              onClick={() => {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span>View Related Projects</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
          </div>
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
            What I Do
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">
            <span className="text-forest-900">Premium </span>
            <span className="text-lime-500">Services</span>
          </h2>
          <p className="text-forest-700 max-w-2xl mx-auto text-lg">
            Comprehensive design and development solutions tailored to elevate your digital presence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {portfolioData.services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;