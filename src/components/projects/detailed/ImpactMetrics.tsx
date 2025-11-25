"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Zap, Target, Award, BarChart } from "lucide-react";

interface ImpactMetricsProps {
    metrics: Array<{ label: string; value: string }>;
}

export default function ImpactMetrics({ metrics }: ImpactMetricsProps) {
    if (!metrics || metrics.length === 0) return null;

    const getIcon = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes("user") || l.includes("traffic")) return Users;
        if (l.includes("revenue") || l.includes("sale")) return TrendingUp;
        if (l.includes("performance") || l.includes("speed") || l.includes("load")) return Zap;
        if (l.includes("accuracy") || l.includes("quality")) return Target;
        if (l.includes("rating") || l.includes("score")) return Award;
        return BarChart;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-6">
            {metrics.map((metric, index) => {
                const Icon = getIcon(metric.label);
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative group overflow-hidden rounded-xl border border-forest-700/50 bg-forest-950/50 backdrop-blur-sm p-3 hover:border-lime-500/30 transition-colors"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-forest-900/50 text-lime-500">
                                <Icon className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-[10px] text-sage-300 uppercase tracking-wider font-medium">
                                    {metric.label}
                                </p>
                                <div className="text-lg font-bold text-white">
                                    {metric.value}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
