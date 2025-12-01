"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { portfolioData } from "@/data/portfolio";
import * as LucideIcons from "lucide-react";

const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Code; // Default to Code icon if not found
};

const SkillsShowcase = () => {
    const { skills: { categories, subTitle } } = portfolioData;
    const [activeTab, setActiveTab] = useState(categories[0]?.id);

    return (
        <section className="py-24 bg-forest-50/50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-lime-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-forest-900/5 rounded-full blur-3xl" />
            </div>

            <div className="container max-w-7xl mx-auto relative z-10">
                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <Badge variant="outline" className="mb-4 border-lime-500 text-forest-900 px-4 py-1">
                        Technical Proficiency
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">
                        <span className="text-forest-900">Expertise & </span>
                        <span className="text-lime-500">Capabilities</span>
                    </h2>
                    <p className="text-forest-700 max-w-2xl mx-auto text-lg">
                        {subTitle}
                    </p>
                </motion.div>

                {/* Skills Tabs */}
                <Tabs defaultValue={categories[0]?.id} value={activeTab} className="w-full" onValueChange={setActiveTab}>
                    <div className="flex justify-center mb-12">
                        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 justify-center">
                            {categories.map((category) => {
                                const Icon = getIconComponent(category.icon);
                                return (
                                    <TabsTrigger
                                        key={category.id}
                                        value={category.id}
                                        className="data-[state=active]:bg-forest-900 data-[state=active]:text-sage-100 
                                                         bg-white border-2 border-sage-100 text-forest-700 
                                                         px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300
                                                         hover:border-lime-500 hover:text-forest-900
                                                         flex items-center gap-2 shadow-sm"
                                    >
                                        <Icon className="w-4 h-4" />
                                        {category.title}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>

                    <AnimatePresence mode="wait">
                        {categories.map((category) => (
                            <TabsContent key={category.id} value={category.id} className="mt-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                                >
                                    {/* Flatten groups to show all items */}
                                    {category.groups.flatMap((group) =>
                                        group.items.map((item, index) => {
                                            const CategoryIcon = getIconComponent(category.icon);

                                            return (
                                                <motion.div
                                                    key={`${item.label}-${index}`}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    whileHover={{ y: -5 }}
                                                >
                                                    <Card
                                                        className="group h-full overflow-hidden border-2 border-sage-100 bg-white/50 backdrop-blur-sm 
                                                                         hover:border-lime-500 hover:shadow-lg hover:shadow-lime-500/10 transition-all duration-300
                                                                         cursor-pointer relative"
                                                    >
                                                        <CardContent className="p-6 flex flex-col items-start gap-4 h-full relative z-10">
                                                            <div className="flex items-center gap-3 w-full">
                                                                <div className="p-2 rounded-xl bg-forest-50/50 group-hover:bg-lime-500/10 transition-colors duration-300 shrink-0">
                                                                    <CategoryIcon className="w-6 h-6 text-forest-900 group-hover:text-lime-600 transition-colors duration-300" />
                                                                </div>
                                                                <h3 className="font-bold text-forest-900 leading-tight">{item.label}</h3>
                                                            </div>

                                                            <div className="text-sm text-forest-700">
                                                                {item.value}
                                                            </div>

                                                            {/* Hover Overlay Effect */}
                                                            <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </motion.div>
                            </TabsContent>
                        ))}
                    </AnimatePresence>
                </Tabs>
            </div>
        </section>
    );
};

export default SkillsShowcase;