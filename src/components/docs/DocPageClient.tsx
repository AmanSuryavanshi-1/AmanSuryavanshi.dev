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
    project: Omit<Project, 'technologies'>;
    content: string;
    slug: string;
    multiDocs?: { id: string; title: string; href?: string }[];
    currentDocId?: string;
    docTitle?: string;
    docCleanTitle?: string;
    projectShortTitle?: string;
    docCategory?: string;
    docType?: string;
}

const DocPageClient: React.FC<DocPageClientProps> = ({ 
    project, 
    content, 
    slug, 
    multiDocs, 
    currentDocId,
    docTitle,
    docCleanTitle,
    projectShortTitle,
    docCategory,
    docType: docTypeProp
}) => {
    const [activeHeading, setActiveHeading] = useState<string>('');
    const [readingTime, setReadingTime] = useState(0);
    const [tocItems, setTocItems] = useState<{ id: string; text: string; level: number }[]>([]);
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
    const [headerImage, setHeaderImage] = useState<string | null>(null);

    // Determine doc type & semantic icons
    const isTechnicalDoc = slug.includes('technical') || (docTitle && docTitle.toLowerCase().includes('technical'));
    const isSeries = docTypeProp === 'series' || (multiDocs && multiDocs.length > 0);
    const displayDocType = docCategory || (isSeries ? 'Series Documentation' : (isTechnicalDoc ? 'Technical Documentation' : 'Executive Summary'));
    const DocIcon = isSeries ? Layers : (isTechnicalDoc ? Activity : FileText);

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
        let observer: IntersectionObserver | null = null;

        const timer = setTimeout(() => {
            const contentContainer = document.querySelector('.markdown-content');
            if (!contentContainer) {
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

            // Scroll spy
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveHeading(entry.target.id);
                        }
                    });
                },
                { rootMargin: '-100px 0px -60% 0px' }
            );

            headings.forEach((h) => observer?.observe(h));
        }, 500); // Delay for DOM readiness

        return () => {
            clearTimeout(timer);
            observer?.disconnect();
        };
    }, [content]);


    const scrollToHeading = (id: string) => {
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
        }
    };

    return (
        <ImageGalleryProvider>
            {/* Lightbox for image zoom */}
            <Lightbox />
            {/* Main Section - Matches BlogList: bg-sage-50 */}
            <section className="py-12 sm:py-16 bg-[#D3E6BB] dark:bg-[#0a1f15] min-h-screen transition-colors duration-300">
                <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb - Semantic W3C WAI-ARIA pattern & WCAG 2.2 AA */}
                    <nav aria-label="Breadcrumb" className="mb-8">
                        <ol className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-forest-700 dark:text-sage-300 bg-white/50 dark:bg-[#162c22]/80 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-forest-100/50 dark:border-white/10 shadow-sm dark:shadow-black/20">
                            <li className="inline-flex items-center">
                                <Link href="/" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors flex items-center gap-1 group">
                                    <Home className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                                    <span className="sr-only">Home</span>
                                </Link>
                            </li>
                            <li className="inline-flex items-center gap-1.5 sm:gap-2">
                                <ChevronRight className="w-3.5 h-3.5 text-forest-300 dark:text-sage-500" aria-hidden="true" />
                                <Link href="/projects" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors flex items-center gap-1 font-medium">
                                    <FolderOpen className="w-4 h-4" aria-hidden="true" />
                                    <span>Projects</span>
                                </Link>
                            </li>
                            <li className="inline-flex items-center gap-1.5 sm:gap-2">
                                <ChevronRight className="w-3.5 h-3.5 text-forest-300 dark:text-sage-500" aria-hidden="true" />
                                <Link href={`/projects#${project.id}`} className="text-forest-800 dark:text-sage-200 hover:text-lime-600 dark:hover:text-lime-400 transition-colors font-medium truncate max-w-[140px] sm:max-w-[200px]">
                                    {projectShortTitle || project.title.split(':')[0].trim()}
                                </Link>
                            </li>
                            <li className="inline-flex items-center gap-1.5 sm:gap-2" aria-current="page">
                                <ChevronRight className="w-3.5 h-3.5 text-forest-300 dark:text-sage-500" aria-hidden="true" />
                                <span className="text-forest-900 dark:text-sage-100 font-semibold flex items-center gap-1.5 truncate max-w-[160px] sm:max-w-[260px]">
                                    <DocIcon className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" aria-hidden="true" />
                                    <span className="truncate">{docCleanTitle || docTitle || displayDocType}</span>
                                </span>
                            </li>
                        </ol>
                    </nav>

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
                                    <DocIcon className="w-3.5 h-3.5" aria-hidden="true" />
                                    {displayDocType}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs font-medium backdrop-blur-md">
                                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                                    {readingTime} min read
                                </span>
                            </div>

                            {/* Main Title & Tagline */}
                            <div className="max-w-4xl space-y-4">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-[1.1] tracking-tight drop-shadow-sm">
                                    <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                                        {isSeries ? (docTitle || project.title) : project.title}
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
                                    href="/projects"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base rounded-full transition-all backdrop-blur-md border border-white/10 hover:border-white/20"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Grid Layout - Refined percentages for wider content with optimal column widths */}
                    <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_250px] lg:gap-6 xl:gap-8">

                        {/* LEFT SIDEBAR - Document Navigation & Tech Stack */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-5 custom-scrollbar dark-scrollbar pr-1">

                                {/* Multi-Page Navigation Menu (Primary when multiple docs exist) */}
                                {multiDocs && multiDocs.length > 0 ? (
                                    <div className="bg-white dark:bg-[#162c22] rounded-2xl p-4 sm:p-5 border border-forest-100 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                        <h4 className="text-xs font-bold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                                            Documentation
                                        </h4>
                                        <nav className="flex flex-col gap-1.5">
                                            {multiDocs.map((doc) => {
                                                const isActive = doc.id === currentDocId;
                                                const cleanTitle = doc.title.replace(/^\d+\.\s*/, '');
                                                return (
                                                    <Link
                                                        key={doc.id}
                                                        href={doc.href || `/docs/${project.id}/${doc.id}`}
                                                        className={cn(
                                                            "text-xs sm:text-sm py-2 px-3 rounded-xl transition-all duration-200 line-clamp-2 leading-snug border-l-2",
                                                            isActive
                                                                ? "border-l-lime-500 bg-lime-50 dark:bg-lime-500/15 text-forest-900 dark:text-lime-300 font-semibold shadow-sm"
                                                                : "border-l-transparent text-forest-600 dark:text-sage-300 hover:text-forest-900 dark:hover:text-white hover:bg-forest-50 dark:hover:bg-forest-800/50"
                                                        )}
                                                        title={cleanTitle}
                                                    >
                                                        {cleanTitle}
                                                    </Link>
                                                );
                                            })}
                                        </nav>
                                    </div>
                                ) : (
                                    /* Single Doc Meta Card (Fallback only when no multi-doc navigation exists) */
                                    <div className="bg-white dark:bg-[#162c22] rounded-2xl p-5 border border-forest-100 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-lime-500/10 flex items-center justify-center text-forest-900 dark:text-lime-400 shrink-0">
                                                <DocIcon className="w-5 h-5 text-lime-600 dark:text-lime-400" aria-hidden="true" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-0.5">Document Type</p>
                                                <p className="text-sm font-bold text-forest-900 dark:text-sage-100 leading-tight">{displayDocType}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-forest-100 dark:border-forest-600">
                                            <div className="flex items-center gap-3 text-sm text-forest-600 dark:text-sage-300 bg-forest-50/50 dark:bg-forest-800/50 p-2.5 rounded-lg">
                                                <Clock className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                                                <span><strong>{readingTime} min</strong> read time</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-forest-600 dark:text-sage-300 bg-forest-50/50 dark:bg-forest-800/50 p-2.5 rounded-lg">
                                                <Calendar className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                                                <span>Status <strong>Production</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tech Stack */}
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="bg-white dark:bg-[#162c22] rounded-2xl p-4 sm:p-5 border border-forest-100 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
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
                                                    zoom={project.id === 'aviators-training-centre' ? 1.0 : 1.3}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content Card - Clean white background with refined padding for comfortable reading */}
                            <div className="bg-white dark:bg-[#162c22] rounded-3xl p-6 sm:p-8 lg:p-10 border border-forest-100 dark:border-white/10 shadow-[0_5px_30px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] markdown-content overflow-x-hidden min-h-[500px]">
                                <MarkdownViewer content={content} />
                            </div>

                            {/* Footer Navigation */}
                            <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                {(() => {
                                    if (multiDocs && currentDocId) {
                                        const currentIndex = multiDocs.findIndex(d => d.id === currentDocId);
                                        const prevDoc = currentIndex > 0 ? multiDocs[currentIndex - 1] : null;
                                        const nextDoc = currentIndex < multiDocs.length - 1 ? multiDocs[currentIndex + 1] : null;

                                        return (
                                            <>
                                                {prevDoc ? (
                                                    <Link
                                                        href={prevDoc.href || `/docs/${project.id}/${prevDoc.id}`}
                                                        className="group block p-5 rounded-xl bg-white dark:bg-[#162c22] border border-forest-200/50 dark:border-white/10 hover:border-lime-400 dark:hover:border-lime-500/50 hover:shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all"
                                                    >
                                                        <div className="text-xs font-semibold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-1">Previous</div>
                                                        <div className="font-semibold text-forest-900 dark:text-sage-100 flex items-center gap-2 group-hover:text-lime-600 dark:group-hover:text-lime-400 line-clamp-1">
                                                            <ArrowLeft className="w-4 h-4 shrink-0" /> {prevDoc.title.replace(/^\d+\.\s*/, '')}
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <div className="hidden sm:block" />
                                                )}

                                                {nextDoc ? (
                                                    <Link
                                                        href={nextDoc.href || `/docs/${project.id}/${nextDoc.id}`}
                                                        className="group block p-5 rounded-xl bg-white dark:bg-[#162c22] border border-forest-200/50 dark:border-white/10 hover:border-lime-400 dark:hover:border-lime-500/50 hover:shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all text-right"
                                                    >
                                                        <div className="text-xs font-semibold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-1">Next</div>
                                                        <div className="font-semibold text-forest-900 dark:text-sage-100 flex items-center justify-end gap-2 group-hover:text-lime-600 dark:group-hover:text-lime-400 line-clamp-1">
                                                            {nextDoc.title.replace(/^\d+\.\s*/, '')} <ArrowRight className="w-4 h-4 shrink-0" />
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <div className="hidden sm:block" />
                                                )}
                                            </>
                                        );
                                    }

                                    // Fallback to original layout for single-page documentation like other projects
                                    const alternateDoc = project.documentation?.find(d =>
                                        isTechnicalDoc
                                            ? (d.title.toLowerCase().includes('summary') || d.title.toLowerCase().includes('executive'))
                                            : (d.title.toLowerCase().includes('technical') || d.title.toLowerCase().includes('architecture') || (d.title.toLowerCase().includes('documentation') && !d.title.toLowerCase().includes('summary')))
                                    );

                                    return (
                                        <>
                                            <Link
                                                href="/projects"
                                                className="group block p-5 rounded-xl bg-white dark:bg-[#162c22] border border-forest-200/50 dark:border-white/10 hover:border-lime-400 dark:hover:border-lime-500/50 hover:shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all"
                                            >
                                                <div className="text-xs font-semibold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-1">Previous</div>
                                                <div className="font-semibold text-forest-900 dark:text-sage-100 flex items-center gap-2 group-hover:text-lime-600 dark:group-hover:text-lime-400">
                                                    <ArrowLeft className="w-4 h-4 shrink-0" /> All Projects
                                                </div>
                                            </Link>
                                            <Link
                                                href={alternateDoc?.url || "/projects"}
                                                className="group block p-5 rounded-xl bg-white dark:bg-[#162c22] border border-forest-200/50 dark:border-white/10 hover:border-lime-400 dark:hover:border-lime-500/50 hover:shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all text-right"
                                            >
                                                <div className="text-xs font-semibold text-forest-500 dark:text-sage-400 uppercase tracking-wider mb-1">
                                                    {alternateDoc ? "Related" : "Explore"}
                                                </div>
                                                <div className="font-semibold text-forest-900 dark:text-sage-100 flex items-center justify-end gap-2 group-hover:text-lime-600 dark:group-hover:text-lime-400">
                                                    {alternateDoc
                                                        ? (isTechnicalDoc ? 'Executive Summary' : 'Technical Docs')
                                                        : 'View More Projects'
                                                    }
                                                    <ArrowRight className="w-4 h-4 shrink-0" />
                                                </div>
                                            </Link>
                                        </>
                                    );
                                })()}
                            </div>
                        </article>

                        {/* RIGHT SIDEBAR - Table of Contents */}
                        <aside className="hidden xl:block">
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
                <div className="xl:hidden fixed bottom-6 right-6 z-40">
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
                                className="fixed inset-0 bg-black/30 z-40 xl:hidden backdrop-blur-sm"
                                onClick={() => setIsMobileTocOpen(false)}
                            />
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 xl:hidden max-h-[75vh] overflow-hidden flex flex-col shadow-2xl border-t border-forest-200"
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
                                <div className="overflow-y-auto p-4 space-y-4">
                                    {multiDocs && multiDocs.length > 0 && (
                                        <div className="pb-3 border-b border-forest-100">
                                            <p className="text-[11px] font-bold text-forest-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                                                <Layers className="w-3.5 h-3.5 text-lime-600" /> Documentation
                                            </p>
                                            <div className="space-y-1">
                                                {multiDocs.map((doc) => {
                                                    const isActive = doc.id === currentDocId;
                                                    const cleanTitle = doc.title.replace(/^\d+\.\s*/, '');
                                                    return (
                                                        <Link
                                                            key={doc.id}
                                                            href={doc.href || `/docs/${project.id}/${doc.id}`}
                                                            onClick={() => setIsMobileTocOpen(false)}
                                                            className={cn(
                                                                "block py-2.5 px-3 rounded-xl text-sm transition-all",
                                                                isActive
                                                                    ? "bg-lime-50 text-forest-900 font-semibold border-l-2 border-l-lime-500"
                                                                    : "text-forest-600 hover:bg-forest-50"
                                                            )}
                                                        >
                                                            {cleanTitle}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-1">
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
