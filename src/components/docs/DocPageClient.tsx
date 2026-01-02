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
import { FallbackImageManager } from '@/lib/fallback-image-manager';
import CustomVideoPlayer from '@/components/ui/CustomVideoPlayer';
import { cn } from '@/lib/utils';

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
    const [headerImage, setHeaderImage] = useState<string | null>(null);

    // Determine doc type
    const isTechnicalDoc = slug.includes('technical');
    const docType = isTechnicalDoc ? 'Technical Documentation' : 'Executive Summary';
    const DocIcon = isTechnicalDoc ? Activity : FileText;

    // Extract first image from markdown content for header background
    // Priority: 1. project.imageUrl (from portfolio.tsx) 
    //           2. project.image
    //           3. First image from markdown (GitHub CDN)
    //           4. Fallback image from public folder
    useEffect(() => {
        let imageFound = false;

        // Priority 1: Try project.imageUrl (explicit URL from portfolio.tsx)
        if (project.imageUrl && project.imageUrl.trim() !== '') {
            setHeaderImage(project.imageUrl);
            imageFound = true;
        }

        // Priority 2: Try project.image (mapped field)
        if (!imageFound && project.image && project.image.trim() !== '') {
            setHeaderImage(project.image);
            imageFound = true;
        }

        // Priority 3: Extract first image from markdown content
        if (!imageFound) {
            // Try HTML img tag first (most common in these docs): <img src="url" ...>
            const htmlImgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (htmlImgMatch && htmlImgMatch[1]) {
                setHeaderImage(htmlImgMatch[1]);
                imageFound = true;
            } else {
                // Try standard markdown image syntax: ![alt](url)
                const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
                if (markdownMatch && markdownMatch[1]) {
                    setHeaderImage(markdownMatch[1]);
                    imageFound = true;
                }
            }
        }

        // Priority 4: Fallback to centralized fallback system based on project context
        if (!imageFound) {
            const fallback = FallbackImageManager.getContextualFallback({
                title: project.title,
                projectId: project.id,
                techStack: project.techStack
            });
            setHeaderImage(fallback.path);
        }
    }, [content, project.image, project.imageUrl, project.id, project.title, project.techStack]);

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
            <section className="py-12 sm:py-16 bg-[#D3E6BB] dark:bg-[#0a1f15] min-h-screen transition-colors duration-300">
                <div className="container mx-auto px-2 sm:px-4 lg:px-6">

                    {/* Breadcrumb - Enhanced with icons and glass effect */}
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 text-sm text-forest-700 dark:text-sage-300 bg-white/50 dark:bg-[#162c22]/80 backdrop-blur-md px-4 py-2 rounded-full border border-forest-100/50 dark:border-white/10 shadow-sm dark:shadow-black/20">
                            <Link href="/" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors flex items-center gap-1 group">
                                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 text-forest-300 dark:text-sage-500" />
                            <Link href="/#projects" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors flex items-center gap-1 font-medium">
                                <FolderOpen className="w-4 h-4" />
                                <span>Projects</span>
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 text-forest-300 dark:text-sage-500" />
                            <span className="text-forest-900 dark:text-sage-100 font-semibold truncate max-w-[200px]">{project.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-forest-300 dark:text-sage-500" />
                            <span className="text-forest-600 dark:text-sage-400 flex items-center gap-1.5">
                                <DocIcon className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                                {docType}
                            </span>
                        </div>
                    </div>

                    {/* Header Section - Premium Hero Design */}
                    <div className="mb-8 relative overflow-hidden rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(34,58,34,0.15)] group">
                        {/* Complex Background Layering */}
                        {headerImage ? (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={headerImage}
                                    alt=""
                                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                                    aria-hidden="true"
                                />
                                {/* Deep Gradient Overlay - Matches FeaturedHero vibe */}
                                <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-900/85 to-forest-800/70" />
                                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-transparent to-transparent" />
                                {/* Detail Accents */}
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
                            </div>
                        ) : (
                            <div className="absolute inset-0 z-0 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                            </div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col h-full justify-center min-h-[350px]"
                        >
                            {/* Top Meta Badges */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                    <DocIcon className="w-3.5 h-3.5" />
                                    {docType}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs font-medium backdrop-blur-md">
                                    <Clock className="w-3.5 h-3.5" />
                                    {readingTime} min read
                                </span>
                            </div>

                            {/* Main Title & Tagline */}
                            <div className="max-w-4xl space-y-4">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-[1.1] tracking-tight drop-shadow-sm">
                                    <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                                        {project.title}
                                    </span>
                                </h1>
                                <p className="text-base sm:text-lg lg:text-xl text-forest-100/90 font-light leading-relaxed max-w-2xl border-l-2 border-lime-500/50 pl-4">
                                    {project.tagLine}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 pt-8 mt-auto">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold text-sm sm:text-base rounded-full transition-all shadow-lg hover:shadow-lime-500/25 hover:-translate-y-0.5"
                                    >
                                        <ExternalLink className="w-4 h-4" /> Live Demo
                                    </a>
                                )}
                                <Link
                                    href="/#projects"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base rounded-full transition-all backdrop-blur-md border border-white/10 hover:border-white/20"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Grid Layout - Refined percentages for wider content using FR units */}
                    <div className="lg:grid lg:grid-cols-[20fr_60fr_20fr] lg:gap-6">

                        {/* LEFT SIDEBAR - Document Meta */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6">

                                {/* Document Info Card */}
                                <div className="bg-white dark:bg-[#162c22] rounded-2xl p-5 border border-forest-100 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] sticky-card">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-lime-500/10 flex items-center justify-center text-forest-900 dark:text-lime-400 shrink-0">
                                            <DocIcon className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-0.5">Document Type</p>
                                            <p className="text-sm font-bold text-forest-900 dark:text-sage-100 leading-tight">{docType}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-forest-100 dark:border-forest-600">
                                        <div className="flex items-center gap-3 text-sm text-forest-600 dark:text-sage-300 bg-forest-50/50 dark:bg-forest-800/50 p-2.5 rounded-lg">
                                            <Clock className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                                            <span><strong>{readingTime} min</strong> read time</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-forest-600 dark:text-sage-300 bg-forest-50/50 dark:bg-forest-800/50 p-2.5 rounded-lg">
                                            <Calendar className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                                            <span>Updated <strong>Dec 2025</strong></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Stack - Match homepage badges */}
                                {/* Tech Stack */}
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="bg-white dark:bg-[#162c22] rounded-2xl p-5 border border-forest-100 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                        <h4 className="text-xs font-bold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                                            Core Technologies
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.techStack.slice(0, 10).map((tech: string) => (
                                                <span
                                                    key={tech}
                                                    className="px-2.5 py-1 bg-white dark:bg-forest-800 border border-forest-100 dark:border-forest-600 text-xs font-medium text-forest-700 dark:text-sage-300 rounded-lg shadow-sm hover:border-lime-200 dark:hover:border-lime-500/50 transition-colors"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* MAIN CONTENT CENTER */}
                        <article className="min-w-0">
                            {/* Video Walkthrough - Show on all documentation pages if available */}
                            {project.videoYouTubeId && (
                                <div className="mb-10">
                                    <div className="bg-white rounded-3xl overflow-hidden border border-forest-100 shadow-xl ring-1 ring-forest-100/50">
                                        <div className="p-4 px-6 border-b border-forest-100 bg-forest-50/50 flex items-center gap-3">
                                            <div className="p-1.5 bg-lime-100 rounded-lg">
                                                <Activity className="w-4 h-4 text-lime-700" />
                                            </div>
                                            <h3 className="font-bold text-forest-900 text-sm uppercase tracking-wide">Project Walkthrough</h3>
                                        </div>
                                        <div className="p-2 bg-forest-50/30">
                                            <div className="rounded-2xl overflow-hidden shadow-sm">
                                                <CustomVideoPlayer
                                                    videoId={project.videoYouTubeId}
                                                    title={`${project.title} - Full Walkthrough`}
                                                    poster={project.imageUrl || project.image}
                                                    accentColor="#84cc16"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content Card - Clean white background */}
                            <div className="bg-white dark:bg-[#162c22] rounded-3xl p-8 sm:p-12 border border-forest-100 dark:border-white/10 shadow-[0_5px_30px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] markdown-content overflow-x-hidden min-h-[500px]">
                                <MarkdownViewer content={content} />
                            </div>

                            {/* Footer Navigation */}
                            <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                <Link
                                    href="/#projects"
                                    className="group block p-5 rounded-xl bg-white dark:bg-[#162c22] border border-forest-200/50 dark:border-white/10 hover:border-lime-400 dark:hover:border-lime-500/50 hover:shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all"
                                >
                                    <div className="text-xs font-semibold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-1">Previous</div>
                                    <div className="font-semibold text-forest-900 dark:text-sage-100 flex items-center gap-2 group-hover:text-lime-600 dark:group-hover:text-lime-400">
                                        <ArrowLeft className="w-4 h-4" /> All Projects
                                    </div>
                                </Link>

                                {(() => {
                                    // Calculate target slug for the alternate documentation
                                    const targetSlug = isTechnicalDoc
                                        ? slug.replace('technical-documentation', 'executive-summary')
                                        : slug.replace('executive-summary', 'technical-documentation');

                                    // Check if the alternate documentation exists in the project data
                                    const hasAlternateDoc = project.documentation?.some(doc => doc.url.includes(targetSlug));

                                    return (
                                        <Link
                                            href={hasAlternateDoc ? `/projects/${targetSlug}` : "/#projects"}
                                            className="group block p-5 rounded-xl bg-white dark:bg-[#162c22] border border-forest-200/50 dark:border-white/10 hover:border-lime-400 dark:hover:border-lime-500/50 hover:shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all text-right"
                                        >
                                            <div className="text-xs font-semibold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-1">
                                                {hasAlternateDoc ? "Related" : "Explore"}
                                            </div>
                                            <div className="font-semibold text-forest-900 dark:text-sage-100 flex items-center justify-end gap-2 group-hover:text-lime-600 dark:group-hover:text-lime-400">
                                                {hasAlternateDoc
                                                    ? (isTechnicalDoc ? 'Executive Summary' : 'Technical Docs')
                                                    : 'View More Projects'
                                                }
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </Link>
                                    );
                                })()}
                            </div>
                        </article>

                        {/* RIGHT SIDEBAR - Table of Contents */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                                <div className="bg-white dark:bg-[#162c22] rounded-2xl p-6 border border-forest-100 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                    <h5 className="text-xs font-bold text-forest-900 dark:text-sage-100 uppercase tracking-wider mb-4 flex items-center gap-2 px-2">
                                        <List className="w-4 h-4 text-lime-600 dark:text-lime-400" /> On this page
                                    </h5>

                                    {/* Scrollable TOC */}
                                    <nav className="max-h-[60vh] overflow-y-auto pr-1 space-y-1 custom-scrollbar dark-scrollbar">
                                        {tocItems.length > 0 ? (
                                            tocItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => scrollToHeading(item.id)}
                                                    className={cn(
                                                        "block w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 border-l-2",
                                                        item.level === 2 ? "pl-4" : item.level === 3 ? "pl-6" : "",
                                                        activeHeading === item.id
                                                            ? "border-lime-500 bg-lime-50 dark:bg-lime-500/20 text-forest-900 dark:text-lime-300 font-medium"
                                                            : "border-transparent text-forest-500 dark:text-sage-200 hover:text-forest-700 dark:hover:text-white hover:bg-forest-50 dark:hover:bg-forest-700"
                                                    )}
                                                >
                                                    <span className="line-clamp-2">{item.text}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-sm text-forest-400 dark:text-sage-400 italic px-2">Loading contents...</p>
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
