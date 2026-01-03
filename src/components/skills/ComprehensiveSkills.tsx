'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, X, Filter, ExternalLink, ChevronDown,
    // Skill Icons
    Bot, Brain, Zap, Workflow, Code2, Layout, Database, Server,
    Rocket, Globe, Palette, Terminal, FileText, GitBranch, Lock,
    Smartphone, MessageSquare, Cpu, Layers, Puzzle, Cloud,
    Package, Shield, Settings, LineChart, Mail, Calendar,
    Video, Image as ImageIcon, Share2
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

// ══════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE SKILLS ARSENAL - Production Grade with Full Dark Mode
// Keywords targeted: n8n automation expert, AI workflow architect, LangGraph specialist
// ══════════════════════════════════════════════════════════════════════════

// Skill Icon Mapping - Maps skill names to relevant icons
const getSkillIcon = (skillName: string, category: string) => {
    const name = skillName.toLowerCase();

    // AI & Automation
    if (name.includes('n8n') || name.includes('workflow')) return Workflow;
    if (name.includes('langchain') || name.includes('llm') || name.includes('gpt')) return Brain;
    if (name.includes('groq') || name.includes('ai') || name.includes('openai')) return Bot;
    if (name.includes('serp') || name.includes('search') || name.includes('api')) return Search;
    if (name.includes('automation') || name.includes('zapier')) return Zap;
    if (name.includes('anthropic') || name.includes('claude')) return Brain;
    if (name.includes('perplexity')) return Search;

    // Frontend Development
    if (name.includes('next') || name.includes('nextjs')) return Rocket;
    if (name.includes('react')) return Code2;
    if (name.includes('typescript')) return FileText;
    if (name.includes('tailwind') || name.includes('css')) return Palette;
    if (name.includes('framer') || name.includes('motion')) return Layers;
    if (name.includes('shadcn') || name.includes('components')) return Puzzle;

    // Backend & Infrastructure
    if (name.includes('firebase') || name.includes('database') || name.includes('firestore')) return Database;
    if (name.includes('node') || name.includes('express') || name.includes('server')) return Server;
    if (name.includes('docker') || name.includes('deployment')) return Package;
    if (name.includes('powershell') || name.includes('terminal') || name.includes('cli')) return Terminal;
    if (name.includes('graphql')) return Share2;
    if (name.includes('sanity') || name.includes('cms')) return Layout;

    // Tools & Workflow
    if (name.includes('git') || name.includes('github') || name.includes('version')) return GitBranch;
    if (name.includes('figma') || name.includes('design')) return Palette;
    if (name.includes('postman') || name.includes('testing')) return Settings;
    if (name.includes('analytics') || name.includes('seo')) return LineChart;
    if (name.includes('email') || name.includes('resend')) return Mail;
    if (name.includes('calendar') || name.includes('scheduling') || name.includes('cal.com')) return Calendar;

    // Security & Auth
    if (name.includes('auth') || name.includes('security') || name.includes('oauth')) return Lock;
    if (name.includes('jwt') || name.includes('token')) return Shield;

    // Media
    if (name.includes('image') || name.includes('photo') || name.includes('pdfjs')) return ImageIcon;
    if (name.includes('video')) return Video;

    // Mobile & Communication
    if (name.includes('mobile') || name.includes('responsive')) return Smartphone;
    if (name.includes('chat') || name.includes('messaging') || name.includes('telegram')) return MessageSquare;

    // Default icons by category
    if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('automation')) return Bot;
    if (category.toLowerCase().includes('frontend')) return Code2;
    if (category.toLowerCase().includes('backend')) return Server;
    if (category.toLowerCase().includes('tools')) return Settings;

    // Fallback
    return Cpu;
};

const ComprehensiveSkills = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Extract all categories from skillsData
    const allCategories = useMemo(() => {
        if (!portfolioData.skills.categories || !Array.isArray(portfolioData.skills.categories)) {
            return ['All'];
        }
        return ['All', ...portfolioData.skills.categories.map(cat => cat.title)];
    }, []);

    // Extract and flatten all skills with their category info
    const allSkills = useMemo(() => {
        const skills: any[] = [];

        // Add Core Specialty Skills
        if (portfolioData.skills.coreSpecialty && Array.isArray(portfolioData.skills.coreSpecialty.skills)) {
            portfolioData.skills.coreSpecialty.skills.forEach((skill) => {
                skills.push({
                    name: skill.name,
                    label: skill.name,
                    value: skill.details,
                    category: portfolioData.skills.coreSpecialty.title,
                    groupTitle: "Core Expertise",
                    projectTitle: skill.projectTitle,
                    projectUrl: skill.projectUrl,
                    relatedProjects: skill.relatedProjects
                });
            });
        }

        // Add Category Skills
        if (portfolioData.skills.categories && Array.isArray(portfolioData.skills.categories)) {
            portfolioData.skills.categories.forEach((category) => {
                if (category.groups && Array.isArray(category.groups)) {
                    category.groups.forEach((group) => {
                        if (group.items && Array.isArray(group.items)) {
                            group.items.forEach((item) => {
                                skills.push({
                                    name: `${item.label}: ${item.value}`,
                                    label: item.label,
                                    value: item.value,
                                    category: category.title,
                                    groupTitle: group.title,
                                    footer: category.footer,
                                    projectTitle: item.projectTitle,
                                    projectUrl: item.projectUrl,
                                    relatedProjects: item.relatedProjects
                                });
                            });
                        }
                    });
                }
            });
        }

        return skills;
    }, []);

    // Filter skills based on search and category
    const filteredSkills = useMemo(() => {
        let results = allSkills;

        // Filter by category
        if (selectedCategory !== 'All') {
            results = results.filter(skill => skill.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            results = results.filter(skill =>
                skill.name.toLowerCase().includes(query) ||
                skill.label?.toLowerCase().includes(query) ||
                skill.value?.toLowerCase().includes(query) ||
                skill.groupTitle?.toLowerCase().includes(query) ||
                skill.category.toLowerCase().includes(query) ||
                skill.projectTitle?.toLowerCase().includes(query)
            );
        }

        return results;
    }, [allSkills, searchQuery, selectedCategory]);

    const clearSearch = () => setSearchQuery('');

    return (
        <section id="skills" className="w-full py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
            <div className="container max-w-7xl mx-auto">

                {/* Header - Enhanced for SEO with dark mode */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold font-serif mb-6 text-forest-900 dark:text-sage-100"
                    >
                        Complete <span className="text-lime-600 dark:text-lime-400">Skills Arsenal</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-forest-700 dark:text-sage-300 max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        n8n Automation Expert • AI Workflow Architect • LangGraph Specialist
                    </motion.p>
                </div>

                {/* Search and Filter Bar - High Contrast Dark Mode */}
                <div className="mb-12 flex flex-col md:flex-row gap-4 items-center z-20 relative max-w-4xl mx-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full z-10 group">
                        <input
                            type="text"
                            placeholder="Search skills (e.g., n8n, React, Firebase)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-12 py-4 
                                       text-forest-900 dark:text-sage-100 
                                       bg-white/60 dark:bg-forest-900/80 
                                       backdrop-blur-md 
                                       border border-sage-200/60 dark:border-white/20 
                                       rounded-2xl 
                                       focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 dark:focus:border-lime-400
                                       transition-all 
                                       shadow-lg shadow-forest-900/5 dark:shadow-black/20
                                       placeholder:text-forest-400 dark:placeholder:text-sage-400"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 
                                         text-forest-400 dark:text-sage-400 
                                         group-focus-within:text-lime-600 dark:group-focus-within:text-lime-400 
                                         transition-colors pointer-events-none z-10" />

                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full 
                                           hover:bg-forest-900/5 dark:hover:bg-white/10 
                                           text-forest-400 dark:text-sage-300 
                                           hover:text-forest-900 dark:hover:text-sage-100 
                                           transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter Dropdown */}
                    <div className="relative min-w-[240px] z-20 w-full md:w-auto">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                            className="w-full flex items-center justify-between px-6 py-4 
                                       text-forest-900 dark:text-sage-100 
                                       bg-white/60 dark:bg-forest-900/80 
                                       backdrop-blur-md 
                                       border border-sage-200/60 dark:border-white/20 
                                       rounded-2xl 
                                       focus:outline-none focus:ring-2 focus:ring-lime-500/50 
                                       transition-all duration-300 
                                       hover:bg-white/80 dark:hover:bg-forest-800/80 
                                       shadow-lg shadow-forest-900/5 dark:shadow-black/20 
                                       group"
                        >
                            <div className="flex items-center gap-3">
                                <Filter className="w-5 h-5 text-forest-500 dark:text-sage-300 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors" />
                                <span className="font-medium truncate">{selectedCategory}</span>
                            </div>
                            <ChevronDown
                                className={`w-5 h-5 text-forest-400 dark:text-sage-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-lime-600 dark:text-lime-400' : ''}`}
                            />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 right-0 mt-2 
                                               bg-white/95 dark:bg-forest-950/95 
                                               backdrop-blur-xl 
                                               border border-sage-200/60 dark:border-white/10 
                                               rounded-2xl shadow-xl dark:shadow-black/40 
                                               overflow-hidden py-2 max-h-[300px] overflow-y-auto custom-scrollbar z-50"
                                >
                                    {allCategories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 transition-colors flex items-center justify-between group
                                                ${selectedCategory === category
                                                    ? 'bg-lime-50 dark:bg-lime-500/20 text-forest-900 dark:text-sage-100 font-bold'
                                                    : 'text-forest-600 dark:text-sage-300 hover:bg-sage-50 dark:hover:bg-forest-800/50 hover:text-forest-900 dark:hover:text-sage-100'
                                                }`}
                                        >
                                            <span>{category}</span>
                                            {selectedCategory === category && (
                                                <motion.div
                                                    layoutId="activeCheck"
                                                    className="w-2 h-2 rounded-full bg-lime-500"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Results Count - Dark Mode High Contrast */}
                <div className="mb-8 text-center">
                    <span className="text-sm text-forest-600 dark:text-sage-300 font-medium 
                                     bg-white/50 dark:bg-forest-800/80 
                                     inline-block px-4 py-1.5 rounded-full 
                                     backdrop-blur-sm 
                                     border border-sage-200/40 dark:border-white/10">
                        Found <span className="font-bold text-forest-900 dark:text-white">{filteredSkills.length}</span> skill{filteredSkills.length !== 1 ? 's' : ''}
                        {selectedCategory !== 'All' && <span className="text-lime-600 dark:text-lime-400"> in {selectedCategory}</span>}
                    </span>
                </div>

                {/* Skills Grid - High Contrast Dark Mode */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedCategory}-${searchQuery}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredSkills.map((skill, index) => {
                            const SkillIcon = getSkillIcon(skill.label, skill.category);

                            return (
                                <motion.div
                                    key={`${skill.name}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="group h-full"
                                >
                                    <div className="flex flex-col h-full overflow-hidden rounded-2xl 
                                                    border border-sage-200/60 dark:border-white/10 
                                                    bg-white/60 dark:bg-forest-900/60 
                                                    backdrop-blur-md 
                                                    transition-all duration-300 
                                                    hover:bg-white/80 dark:hover:bg-forest-800/80 
                                                    hover:shadow-xl hover:shadow-lime-500/10 
                                                    hover:-translate-y-1 
                                                    hover:border-lime-500/30 dark:hover:border-lime-500/30">
                                        <div className="p-5 flex flex-col h-full">
                                            {/* Category & Group Tags */}
                                            <div className="flex items-start gap-2 mb-3 flex-wrap">
                                                <span
                                                    className="px-2 py-0.5 text-[10px] font-bold text-white 
                                                               bg-forest-800 dark:bg-lime-600/90 
                                                               rounded-md uppercase tracking-wider shadow-sm"
                                                    title={skill.category}
                                                >
                                                    {skill.category}
                                                </span>
                                                {skill.groupTitle && (
                                                    <span
                                                        className="px-2 py-0.5 text-[10px] 
                                                                   text-forest-600 dark:text-sage-200 
                                                                   bg-forest-50 dark:bg-forest-800/80 
                                                                   border border-forest-100 dark:border-forest-600/50 
                                                                   rounded-md font-medium uppercase tracking-wide truncate max-w-[100px]"
                                                        title={skill.groupTitle}
                                                    >
                                                        {skill.groupTitle}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Skill Name with Icon */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-xl 
                                                                bg-forest-50 dark:bg-forest-800/80 
                                                                border border-forest-100 dark:border-forest-700 
                                                                flex items-center justify-center 
                                                                group-hover:scale-110 group-hover:bg-lime-50 dark:group-hover:bg-lime-500/20
                                                                transition-all duration-300">
                                                    <SkillIcon className="w-5 h-5 text-forest-600 dark:text-sage-200 group-hover:text-lime-600 dark:group-hover:text-lime-300 transition-colors" />
                                                </div>
                                                <h3 className="text-base font-serif font-bold 
                                                               text-forest-900 dark:text-white 
                                                               group-hover:text-lime-600 dark:group-hover:text-lime-400 
                                                               transition-colors duration-300 line-clamp-2 leading-tight">
                                                    {skill.label}
                                                </h3>
                                            </div>

                                            {/* Value/Details - Enhanced Readability */}
                                            <p className="text-sm text-forest-600 dark:text-sage-200 leading-relaxed mb-4 flex-grow line-clamp-3 font-medium opacity-90">
                                                {skill.value}
                                            </p>

                                            {/* Related Projects Links */}
                                            {skill.relatedProjects && skill.relatedProjects.length > 0 ? (
                                                <div className="mt-auto pt-3 border-t border-forest-100 dark:border-white/10">
                                                    <p className="text-[10px] text-forest-500 dark:text-sage-400 mb-2 uppercase tracking-wider font-bold opacity-80">Used In</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {skill.relatedProjects.slice(0, 2).map((project: { title: string; url: string }, idx: number) => (
                                                            <a
                                                                key={idx}
                                                                href={project.url}
                                                                className="inline-flex items-center gap-1 text-[11px] font-medium 
                                                                           text-forest-700 dark:text-sage-100 
                                                                           hover:text-lime-600 dark:hover:text-lime-300 
                                                                           transition-colors 
                                                                           bg-forest-50 dark:bg-white/5 
                                                                           hover:bg-lime-50 dark:hover:bg-lime-500/20 
                                                                           px-2 py-1 rounded-lg 
                                                                           border border-forest-100 dark:border-white/10 
                                                                           hover:border-lime-200 dark:hover:border-lime-500/30"
                                                            >
                                                                <span className="truncate max-w-[80px]">{project.title}</span>
                                                                <ExternalLink className="w-2.5 h-2.5 flex-shrink-0 opacity-70" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : skill.projectUrl && (
                                                <div className="mt-auto pt-3 border-t border-forest-100 dark:border-white/10">
                                                    <a
                                                        href={skill.projectUrl}
                                                        className="inline-flex items-center gap-2 text-xs font-bold 
                                                                   text-forest-900 dark:text-white 
                                                                   hover:text-lime-600 dark:hover:text-lime-400 
                                                                   transition-colors group/link 
                                                                   bg-forest-50 dark:bg-white/5 
                                                                   hover:bg-lime-50 dark:hover:bg-lime-500/20 
                                                                   px-3 py-2 rounded-xl w-full justify-center"
                                                    >
                                                        <span className="truncate">View Project</span>
                                                        <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* No Results - Dark Mode */}
                {filteredSkills.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 
                                   bg-white/50 dark:bg-forest-900/40 
                                   backdrop-blur-sm rounded-3xl 
                                   border border-sage-200/50 dark:border-white/10"
                    >
                        <div className="text-6xl mb-6 opacity-50">🔍</div>
                        <h3 className="text-2xl font-bold text-forest-900 dark:text-sage-100 mb-3">No skills found</h3>
                        <p className="text-forest-600 dark:text-sage-300 mb-8 max-w-md mx-auto">
                            We couldn't find any skills matching your search. Try adjusting your filters or search terms.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="px-8 py-3 rounded-xl 
                                       bg-forest-900 dark:bg-lime-600 
                                       text-white font-bold 
                                       hover:bg-lime-600 dark:hover:bg-lime-500 
                                       transition-all duration-300 
                                       shadow-lg hover:shadow-lime-500/20"
                        >
                            Clear All Filters
                        </button>
                    </motion.div>
                )}

            </div>
        </section>
    );
};

export default ComprehensiveSkills;
