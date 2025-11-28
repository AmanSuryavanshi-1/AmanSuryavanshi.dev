'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import services from './servicesData';
import { ArrowRight } from 'lucide-react';
import { MotionButton } from '@/components/big-button';

interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  image: string;
}

// Add interface for ServiceCard props
interface ServiceCardProps {
  service: Service;
  index: number;
}

// Add type annotations to ServiceCard component
const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{
        y: -20,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="w-full"
    >
      <Card className="group h-full overflow-hidden rounded-3xl border-4 border-sage-100 bg-gradient-to-br from-lime-500 to-lime-100 hover:from-forest-900 hover:to-forest-500 transition-all duration-300 shadow-lg shadow-forest-500">
        <CardContent className="p-8">
          {/* Service Icon Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 rounded-full bg-forest-900 border-[3px] shadow-md shadow-forest-900 border-sage-100 text-lime-500 group-hover:bg-lime-500 group-hover:text-forest-900 transition-colors duration-300">
              {service.icon}
            </div>
            <h3 className="text-xl font-bold text-forest-900 group-hover:text-lime-500 transition-colors duration-300">
              {service.title}
            </h3>
          </div>

          <p className="text-forest-700 group-hover:text-sage-100 mb-6 text-sm transition-colors duration-300">
            {service.description}
          </p>

          <ul className="space-y-3">
            {service.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center text-sm text-forest-700 group-hover:text-lime-100 transition-colors duration-300"
              >
                <span className="w-2 h-2 rounded-full bg-lime-500 mr-3 group-hover:bg-sage-100" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Add type annotation to ServicesSection component
const ServicesSection: React.FC = () => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          id='services'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 pt-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold font-serif mb-4">
            <span className="text-forest-900">Our </span>
            <span className="text-lime-500">Services</span>
          </h2>
          <p className="text-forest-700 max-w-2xl mx-auto">
            Transforming ideas into exceptional digital experiences through our comprehensive range of services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <MotionButton
            href="/#contact"
            icon={ArrowRight}
            label="Start Your Project Today"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;