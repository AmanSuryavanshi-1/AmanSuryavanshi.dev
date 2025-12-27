'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Calendar,
    ArrowLeft,
    ChevronRight,
    List,
    FileText,
    Activity,
    ExternalLink,
    ArrowRight,
    X,
    Home,
    FolderOpen,
    Layers,
    Code2,
    BookOpen
} from 'lucide-react';
import Link from 'next/link';
import MarkdownViewer from './MarkdownViewer';
import { Project } from '@/data/portfolio';
import { ImageGalleryProvider } from '@/context/ImageGalleryContext';
import Lightbox from '@/components/ui/Lightbox';

interface DocPageClientProps {
    project: Project;
    content: string;
    slug: string;
}

const DocPageClient: React.FC<DocPageClientProps> = ({ project, content, slug }) => {
    const [activeHeading, setActiveHeading] = useState<string>('');
    const [readingTime, setReadingTime] = useState(0);
    const [tocItems, setTocItems] = useState<{ id: string; text: string; level: number }[]>([]);
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

    // Determine doc type
    const isTechnicalDoc = slug.includes('technical');
    const docType = isTechnicalDoc ? 'Technical Documentation' : 'Executive Summary';
    const DocIcon = isTechnicalDoc ? Activity : FileText;

    // Calculate reading time
    useEffect(() => {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        setReadingTime(Math.ceil(words / wordsPerMinute));
    }, [content]);


    // Generate TOC with delay for DOM readiness
    useEffect(() => {
        const timer = setTimeout(() => {
            const contentContainer = document.querySelector('.markdown-content');
            if (!contentContainer) {
                console.warn('TOC: markdown-content container not found');
                return;
            }

            const headings = contentContainer.querySelectorAll('h1, h2, h3');
            const items: { id: string; text: string; level: number }[] = [];

            headings.forEach((heading) => {
                const text = heading.textContent || '';
                // Read the ID that was already assigned by MarkdownViewer
                const id = heading.id;
                if (id) {
                    items.push({
                        id,
                        text,
                        level: parseInt(heading.tagName.substring(1)),
                    });
                }
            });

            setTocItems(items);
            console.log('TOC: Generated', items.length, 'items from existing headings');

            // Scroll spy
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveHeading(entry.target.id);
                        }
                    });
                },
                { rootMargin: '-100px 0px -60% 0px' }
            );

            headings.forEach((h) => observer.observe(h));
            return () => observer.disconnect();
        }, 500); // Delay for DOM readiness

        return () => clearTimeout(timer);
    }, [content]);


    const scrollToHeading = (id: string) => {
        console.log('TOC: Scrolling to', id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
            setActiveHeading(id);
            setIsMobileTocOpen(false);
        } else {
            console.warn('TOC: Element not found for id', id);
        }
    };

    return (
        <ImageGalleryProvider>
            {/* Lightbox for image zoom */}
            <Lightbox />
            {/* Main Section - Matches BlogList: bg-sage-50 */}
            <section className="py-12 sm:py-16 bg-sage-50 min-h-screen">
                <div className="container mx-auto px-2 sm:px-4 lg:px-6">

                    {/* Breadcrumb - Enhanced with icons */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-forest-600">
                            <Link href="/" className="hover:text-lime-600 transition-colors flex items-center gap-1">
                                <Home className="w-4 h-4" />
                            </Link>
                            <ChevronRight className="w-4 h-4 text-forest-400" />
                            <Link href="/#projects" className="hover:text-lime-600 transition-colors flex items-center gap-1">
                                <FolderOpen className="w-4 h-4" />
                                <span>Projects</span>
                            </Link>
                            <ChevronRight className="w-4 h-4 text-forest-400" />
                            <span className="text-forest-700 truncate max-w-[200px]">{project.title}</span>
                            <ChevronRight className="w-4 h-4 text-forest-400" />
                            <span className="text-forest-900 font-medium flex items-center gap-1.5">
                                <DocIcon className="w-4 h-4 text-lime-600" />
                                {docType}
                            </span>
                        </div>
                    </div>

                    {/* Header Section */}
                    <div className="mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Badges - Match homepage style */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1.5 bg-white border border-forest-200/50 text-forest-700 text-sm font-medium rounded-full">
                                    {docType}
                                </span>
                                <span className="px-3 py-1.5 bg-forest-900 text-white text-sm font-medium rounded-full flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> {readingTime} min read
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-forest-900 tracking-tight leading-tight">
                                {project.title}
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg sm:text-xl text-forest-600 max-w-3xl">
                                {project.tagLine}
                            </p>

                            {/* Action Buttons - Match homepage */}
                            <div className="flex flex-wrap gap-3 pt-4">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime-500 text-forest-900 font-medium rounded-full hover:bg-lime-400 transition-all shadow-sm"
                                    >
                                        <ArrowRight className="w-4 h-4" /> Live Demo
                                    </a>
                                )}
                                <Link
                                    href="/#projects"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-forest-200 text-forest-700 font-medium rounded-full hover:bg-forest-50 transition-all"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Grid Layout */}
                    <div className="lg:grid lg:grid-cols-12 lg:gap-4">

                        {/* LEFT SIDEBAR - Document Meta */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6">

                                {/* Document Info Card - WHITE like blog cards */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-forest-200/50 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center">
                                            <DocIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-forest-500 uppercase tracking-wider">Document Type</p>
                                            <p className="text-sm font-semibold text-forest-900">{docType}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-forest-100">
                                        <div className="flex items-center gap-2 text-sm text-forest-600">
                                            <Clock className="w-4 h-4 text-forest-400" />
                                            <span>{readingTime} min read</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-forest-600">
                                            <Calendar className="w-4 h-4 text-forest-400" />
                                            <span>Updated Dec 2025</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Stack - Match homepage badges */}
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-forest-200/50 shadow-sm">
                                        <h4 className="text-xs font-bold text-forest-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-lime-600" />
                                            Technologies
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.slice(0, 8).map((tech: string) => (
                                                <span
                                                    key={tech}
                                                    className="px-2.5 py-1 bg-forest-50 border border-forest-200/50 text-xs text-forest-700 rounded-lg"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* MAIN CONTENT */}
                        <article className="lg:col-span-6 min-w-0">
                            {/* Content Card - Clean white background */}
                            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-forest-200/50 shadow-sm markdown-content overflow-x-hidden">
                                <MarkdownViewer content={content} />
                            </div>

                            {/* Footer Navigation */}
                            <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                <Link
                                    href="/#projects"
                                    className="group block p-5 rounded-xl bg-white border border-forest-200/50 hover:border-lime-400 hover:shadow-md transition-all"
                                >
                                    <div className="text-xs font-semibold text-forest-500 uppercase tracking-wider mb-1">Previous</div>
                                    <div className="font-semibold text-forest-900 flex items-center gap-2 group-hover:text-lime-600">
                                        <ArrowLeft className="w-4 h-4" /> All Projects
                                    </div>
                                </Link>

                                <Link
                                    href={`/projects/${isTechnicalDoc
                                        ? slug.replace('technical-documentation', 'executive-summary')
                                        : slug.replace('executive-summary', 'technical-documentation')}`}
                                    className="group block p-5 rounded-xl bg-white border border-forest-200/50 hover:border-lime-400 hover:shadow-md transition-all text-right"
                                >
                                    <div className="text-xs font-semibold text-forest-500 uppercase tracking-wider mb-1">Related</div>
                                    <div className="font-semibold text-forest-900 flex items-center justify-end gap-2 group-hover:text-lime-600">
                                        {isTechnicalDoc ? 'Executive Summary' : 'Technical Docs'} <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            </div>
                        </article>

                        {/* RIGHT SIDEBAR - Table of Contents */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-forest-200/50 shadow-sm">
                                    <h5 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <List className="w-4 h-4 text-lime-600" /> On this page
                                    </h5>

                                    {/* Scrollable TOC */}
                                    <nav className="max-h-[60vh] overflow-y-auto pr-1 space-y-1">
                                        {tocItems.length > 0 ? (
                                            tocItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => scrollToHeading(item.id)}
                                                    className={`
                                                        block w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200
                                                        ${item.level === 2 ? 'pl-5' : item.level === 3 ? 'pl-7' : ''}
                                                        ${activeHeading === item.id
                                                            ? 'bg-forest-900 text-white font-medium shadow-sm'
                                                            : 'text-forest-600 hover:text-forest-900 hover:bg-forest-50'}
                                                    `}
                                                >
                                                    <span className="line-clamp-2">{item.text}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-sm text-forest-500 italic">Loading contents...</p>
                                        )}
                                    </nav>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Mobile TOC Button - Matches website button style */}
                <div className="lg:hidden fixed bottom-6 right-6 z-40">
                    <button
                        onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                        className="bg-forest-900 text-white p-4 rounded-full shadow-xl hover:bg-forest-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-900"
                    >
                        <List className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile TOC Drawer */}
                <AnimatePresence>
                    {isMobileTocOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
                                onClick={() => setIsMobileTocOpen(false)}
                            />
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[75vh] overflow-hidden flex flex-col shadow-2xl border-t border-forest-200"
                            >
                                <div className="flex items-center justify-between p-4 border-b border-forest-100">
                                    <span className="font-semibold text-forest-900 flex items-center gap-2">
                                        <List className="w-4 h-4 text-lime-600" /> Table of Contents
                                    </span>
                                    <button
                                        onClick={() => setIsMobileTocOpen(false)}
                                        className="p-2 hover:bg-forest-50 rounded-full text-forest-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="overflow-y-auto p-4 space-y-1">
                                    {tocItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToHeading(item.id)}
                                            className={`
                                                block w-full text-left py-3 px-4 rounded-xl text-sm transition-all
                                                ${item.level === 2 ? 'pl-6' : item.level === 3 ? 'pl-8' : ''}
                                                ${activeHeading === item.id
                                                    ? 'bg-forest-900 text-white font-medium'
                                                    : 'text-forest-600 hover:bg-forest-50'}
                                            `}
                                        >
                                            {item.text}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </section>
        </ImageGalleryProvider>
    );
};

export default DocPageClient;
