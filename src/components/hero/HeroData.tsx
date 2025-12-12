'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { TransparentButton } from '@/components/transparent-button';
import { SolidButton } from '@/components/solid-button';
import { portfolioData } from '@/data/portfolio';

const Data: React.FC = () => {
    const { name, title, subtitle, tagline, description, descriptionHighlight, stats, buttons, meta } = portfolioData.hero;

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

    const nameArray = name.split("");

    return (
        <motion.div
            className="max-w-full px-4 text-center md:text-left md:px-0 flex flex-col items-center md:items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Key Stats */}
            <motion.div
                className="flex flex-wrap justify-center md:justify-start gap-2 mb-4 text-xs md:text-sm"
                variants={itemVariants}
            >
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center px-3 py-1 rounded-full border-2 border-white bg-lime-500/50 shadow-md backdrop-blur-sm"
                    >
                        <span className="text-forest-900 font-semibold">{stat}</span>
                    </div>
                ))}
            </motion.div>
            {/* Name */}
            <motion.h1
                className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-lime-500 tracking-tight leading-none mb-3"
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

            {/* Subtitle */}
            <motion.div
                className="flex items-center justify-center md:justify-start gap-1 mb-4"
                variants={itemVariants}
            >
                <div className="p-1.5 bg-lime-100 rounded-full">
                    <Sparkles className="w-4 h-4 text-lime-600" />
                </div>
                <h2 className="font-sans text-base sm:text-lg md:text-xl font-medium text-forest-800" style={{ textWrap: 'balance' }}>
                    {subtitle}
                </h2>
            </motion.div>

            {/* Divider */}
            <motion.div
                className="w-16 h-1 bg-lime-500 rounded-full mb-4 hidden md:block"
                variants={itemVariants}
            />

            {/* Content Group */}
            <div className="space-y-2 max-w-xl mx-auto md:mx-0 mb-8">
                {/* Tagline */}
                <motion.h3
                    className="font-serif text-md sm:text-lg font-medium text-forest-500 leading-snug"
                    variants={itemVariants}
                    style={{ textWrap: 'balance' }}
                >
                    {tagline}
                </motion.h3>
                {/* Description */}
                <motion.p
                    className="text-sm sm:text-base text-forest-600 leading-relaxed"
                    variants={itemVariants}
                    style={{ textWrap: 'pretty' }}
                >
                    <span className="font-semibold text-forest-800 block mb-2">
                        {descriptionHighlight}
                    </span>
                    {description}
                </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 md:justify-start w-full sm:w-auto"
                variants={itemVariants}
            >
                <SolidButton
                    href={buttons.primary.href}
                    icon={ArrowRight}
                    label={buttons.primary.label}
                />

                <TransparentButton
                    href={buttons.secondary.href}
                    icon={MessageCircle}
                    label={buttons.secondary.label}
                />
            </motion.div>

            <meta itemProp="name" content={meta.name} />
            <meta itemProp="description" content={meta.description} />
        </motion.div>
    );
}

export default Data;
