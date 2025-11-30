'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { TransparentButton } from '@/components/transparent-button';
import { SolidButton } from '@/components/solid-button';

const Data: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const nameArray = "Aman Suryavanshi".split("");

    return (
        <motion.div
            className="max-w-full px-4 text-center md:text-left md:px-0 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Name */}
            <motion.h1
                className="font-serif text-3xl font-bold md:text-5xl text-lime-500 tracking-tight leading-tight"
                variants={itemVariants}
            >
                {nameArray.map((char, index) => (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 0.2,
                            delay: index * 0.1,
                        }}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.h1>

            <motion.div
                className="flex items-center justify-center md:justify-start gap-2"
                variants={itemVariants}
            >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-lime-500" />
                <h2 className="font-serif text-md md:text-lg font-semibold text-forest-900">
                    AI Automation Engineer + Full-Stack Developer
                </h2>
            </motion.div>

            {/* Tagline */}
            <motion.h3
                className="font-serif text-base md:text-md font-medium text-forest-700 leading-relaxed"
                variants={itemVariants}
            >
                Building Next.js apps with intelligent n8n automation backends
            </motion.h3>

            {/* Description */}
            <motion.p
                className="max-w-xl mx-auto md:mx-0 text-sm md:text-base text-forest-700 leading-relaxed"
                variants={itemVariants}
            >
                <span className="font-serif text-base md:text-md font-medium text-forest-700 leading-relaxed block mb-1">Gluing tools together to create powerful AI-driven solutions.</span>
                I specialize in connecting apps, APIs, and services into seamless workflows. From integrating LangChain with n8n, connecting OpenAI to your database, or orchestrating multi-platform automation—I make different tools work together beautifully. Built production systems delivering ₹300K+ revenue with 80% cost reduction.
            </motion.p>

            {/* Key Stats */}
            <motion.div
                className="flex flex-wrap justify-center md:justify-start gap-2 text-xs md:text-sm"
                variants={itemVariants}
            >
                <div className="flex items-center px-3 py-1 rounded-full border-2 border-white bg-lime-500/50 shadow-md backdrop-blur-sm">
                    <span className="text-forest-900 font-semibold">Integration Specialist</span>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full border-2 border-white bg-lime-500/50 shadow-md backdrop-blur-sm">
                    <span className="text-forest-900 font-semibold">n8n + AI Expert</span>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full border-2 border-white bg-lime-500/50 shadow-md backdrop-blur-sm">
                    <span className="text-forest-900 font-semibold">Next.js Full-Stack</span>
                </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
                className="flex flex-col justify-center gap-4 md:flex-row md:gap-5 md:justify-start pt-2"
                variants={itemVariants}
            >
                <SolidButton
                    href="/#projects"
                    icon={ArrowRight}
                    label="View Portfolio"
                />

                <TransparentButton
                    href="/#contact"
                    icon={MessageCircle}
                    label="Schedule Consultation"
                />
            </motion.div>

            <meta itemProp="name" content="Aman Suryavanshi" />
            <meta itemProp="description" content="AI Automation Engineer specializing in gluing tools together. Expert at connecting apps, APIs, and services with n8n automation, LangChain, and OpenAI to create seamless workflows." />
        </motion.div>
    );
}

export default Data;
