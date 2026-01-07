"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, X, ZoomIn, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/data/portfolio";
import { FallbackImageManager } from "@/lib/fallback-image-manager";
import CustomVideoPlayer from "@/components/ui/CustomVideoPlayer";

interface ProjectMediaCarouselProps {
    project: Project;
    className?: string;
}

interface MediaSlide {
    type: "youtube" | "video" | "image";
    src: string;
    alt: string;
    youtubeId?: string;
}

export default function ProjectMediaCarousel({ project, className }: ProjectMediaCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [youtubeLoaded, setYoutubeLoaded] = useState(false);
    const [showYoutubePoster, setShowYoutubePoster] = useState(true);

    // Lightbox state - now includes video
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Track image errors for fallback handling
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    // Get contextual fallback for this project
    const getProjectFallback = useCallback(() => {
        return FallbackImageManager.getContextualFallback({
            title: project.title,
            projectId: project.id,
            techStack: project.technologies.map(t => t.name)
        }).path;
    }, [project]);

    // Handle image error
    const handleImageError = useCallback((src: string) => {
        setImageErrors(prev => ({ ...prev, [src]: true }));
    }, []);

    // Build media slides array - video first, then gallery images
    const buildMediaSlides = useCallback((): MediaSlide[] => {
        const slides: MediaSlide[] = [];

        // First slide: Video (YouTube or native) or fallback image
        if (project.videoYouTubeId) {
            slides.push({
                type: "youtube",
                src: project.image || getProjectFallback(),
                alt: project.title,
                youtubeId: project.videoYouTubeId,
            });
        } else if (project.video) {
            slides.push({
                type: "video",
                src: project.video,
                alt: project.title,
            });
        }

        // Add gallery images
        if (project.gallery && project.gallery.length > 0) {
            project.gallery.forEach((item) => {
                if (item.type === "image") {
                    slides.push({
                        type: "image",
                        src: item.src,
                        alt: item.alt,
                    });
                }
            });
        }

        // If no video and no gallery, add main image
        if (slides.length === 0 && project.image) {
            slides.push({
                type: "image",
                src: project.image,
                alt: project.title,
            });
        }

        return slides;
    }, [project]);

    const mediaSlides = buildMediaSlides();

    // Intersection Observer for viewport detection
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsInView(entry.isIntersecting);

                    if (!entry.isIntersecting && videoRef.current && isVideoPlaying) {
                        videoRef.current.pause();
                        setIsVideoPlaying(false);
                    }
                });
            },
            { threshold: 0.3, rootMargin: "50px" }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isVideoPlaying]);

    // Auto-load YouTube when in view
    useEffect(() => {
        if (isInView && currentSlide === 0 && mediaSlides[0]?.type === "youtube") {
            const timer = setTimeout(() => {
                setYoutubeLoaded(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isInView, currentSlide, mediaSlides]);

    // Hide YouTube poster after iframe loads
    useEffect(() => {
        if (youtubeLoaded) {
            const timer = setTimeout(() => {
                setShowYoutubePoster(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [youtubeLoaded]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowRight") setLightboxIndex(prev => (prev + 1) % mediaSlides.length);
            if (e.key === "ArrowLeft") setLightboxIndex(prev => (prev - 1 + mediaSlides.length) % mediaSlides.length);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, mediaSlides.length]);

    // Navigation handlers
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        if (index !== 0) {
            setYoutubeLoaded(false);
            setShowYoutubePoster(true);
        }
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev === 0 ? mediaSlides.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev === mediaSlides.length - 1 ? 0 : prev + 1));
    };

    // Native video toggle
    const toggleVideo = () => {
        if (videoRef.current) {
            if (isVideoPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsVideoPlaying(!isVideoPlaying);
        }
    };

    // Open lightbox at specific index
    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // Build YouTube embed URL
    const buildYoutubeUrl = (videoId: string, controls: boolean = false, autoplay: boolean = true) => {
        const params = new URLSearchParams({
            autoplay: autoplay ? "1" : "0",
            mute: controls ? "0" : "1",
            loop: "1",
            controls: controls ? "1" : "0",
            modestbranding: "1",
            rel: "0",
            showinfo: "0",
            iv_load_policy: "3",
            playsinline: "1",
            playlist: videoId,
        });
        return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
    };

    // Don't render if no slides
    if (mediaSlides.length === 0) {
        return (
            <div className={cn("relative w-full h-full bg-forest-100 flex items-center justify-center", className)}>
                <span className="text-forest-400">No media available</span>
            </div>
        );
    }

    const currentMedia = mediaSlides[currentSlide];

    return (
        <>
            <div
                ref={containerRef}
                className={cn(
                    "relative w-full h-full overflow-hidden bg-forest-900 group/carousel",
                    className
                )}
            >
                {/* Main Slide Container */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        {currentMedia.type === "youtube" && currentMedia.youtubeId ? (
                            // YouTube Embed - clickable to open in lightbox
                            <div className="relative w-full h-full cursor-pointer" onClick={() => openLightbox(currentSlide)}>
                                {/* Themed gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950">
                                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(132,204,22,0.15),transparent_70%)]" />
                                    {currentMedia.src && (
                                        <Image
                                            src={currentMedia.src}
                                            alt=""
                                            fill
                                            className="object-cover blur-2xl opacity-40 scale-110"
                                            priority={false}
                                        />
                                    )}
                                </div>

                                {/* YouTube iframe */}
                                {youtubeLoaded && isInView && (
                                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-[1]">
                                        <iframe
                                            src={buildYoutubeUrl(currentMedia.youtubeId, false, true)}
                                            title={currentMedia.alt}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="border-0 pointer-events-none min-w-[300%] min-h-[300%] transition-opacity duration-500"
                                            style={{ aspectRatio: "16/9" }}
                                        />
                                    </div>
                                )}

                                {/* Poster overlay */}
                                {showYoutubePoster && currentMedia.src && (
                                    <div className="absolute inset-0 z-10">
                                        <Image
                                            src={currentMedia.src}
                                            alt={currentMedia.alt}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg">
                                                <Play className="w-6 h-6 fill-current ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Expand button overlay */}
                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-forest-900 shadow-xl">
                                        <Maximize2 className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        ) : currentMedia.type === "video" ? (
                            // Native Video - clickable to open in lightbox
                            <div
                                className="relative w-full h-full cursor-pointer"
                                onClick={() => openLightbox(currentSlide)}
                            >
                                <video
                                    ref={videoRef}
                                    src={currentMedia.src}
                                    className="w-full h-full object-cover"
                                    loop
                                    muted
                                    playsInline
                                    autoPlay
                                    poster={project.image}
                                />
                                {/* Expand button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
                                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-forest-900 shadow-xl">
                                        <Maximize2 className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Image - clickable to open in lightbox
                            <button
                                type="button"
                                className="relative w-full h-full cursor-zoom-in block border-none p-0 bg-transparent"
                                onClick={() => openLightbox(currentSlide)}
                            >
                                <Image
                                    src={currentMedia.src}
                                    alt={currentMedia.alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover/carousel:scale-105"
                                    loading={currentSlide === 0 ? "eager" : "lazy"}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                                        <ZoomIn className="w-5 h-5" />
                                    </div>
                                </div>
                            </button>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {mediaSlides.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-forest-900 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); goToNext(); }}
                            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-forest-900 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </>
                )}

                {/* Dot Indicators */}
                {mediaSlides.length > 1 && (
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md">
                        {mediaSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                                className={cn(
                                    "transition-all duration-300 rounded-full",
                                    currentSlide === index
                                        ? "w-5 sm:w-6 h-1.5 sm:h-2 bg-white"
                                        : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Slide Counter */}
                {mediaSlides.length > 1 && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 px-2 sm:px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium">
                        {currentSlide + 1} / {mediaSlides.length}
                    </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
                    <div className={cn(
                        "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md text-xs font-semibold uppercase tracking-wider shadow-sm",
                        currentMedia.type === "youtube" || currentMedia.type === "video"
                            ? "bg-lime-500/90 text-forest-900"
                            : "bg-white/90 text-forest-900"
                    )}>
                        {currentMedia.type === "youtube" || currentMedia.type === "video" ? "Video" : "Gallery"}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal - Supports Video + Images */}
            <AnimatePresence>
                {lightboxOpen && mediaSlides.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Counter */}
                        <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
                            {lightboxIndex + 1} / {mediaSlides.length} • {project.title}
                        </div>

                        {/* Main Content - Expanded to fill more viewport */}
                        <div
                            className="relative w-full h-full max-w-[95vw] max-h-[90vh] mx-4 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {mediaSlides[lightboxIndex].type === "youtube" && mediaSlides[lightboxIndex].youtubeId ? (
                                // YouTube in lightbox - full video with subtitles visible
                                // Using height-based sizing to maximize video area while keeping 16:9 aspect ratio
                                <div className="relative flex items-center justify-center w-full h-full">
                                    {/* Blurred background fills empty space around video */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950">
                                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(132,204,22,0.2),transparent_70%)]" />
                                    </div>
                                    {/* Video container - maintains 16:9 aspect ratio, fits within viewport */}
                                    <div
                                        className="relative rounded-lg overflow-hidden shadow-2xl z-[1]"
                                        style={{
                                            width: '90vw',
                                            height: '85vh',
                                            maxWidth: '1600px', // Prevent too wide on huge screens
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="absolute inset-0 bg-black">
                                            <CustomVideoPlayer
                                                videoId={mediaSlides[lightboxIndex].youtubeId!}
                                                title={mediaSlides[lightboxIndex].alt}
                                                poster={mediaSlides[lightboxIndex].type === 'image' ? mediaSlides[lightboxIndex].src : undefined}
                                                accentColor="#84cc16"
                                                // Apply 1.0 zoom (no zoom) for Aviators to show subtitles
                                                // Apply 1.5 zoom for others for clean/sleek look
                                                zoom={project.id === 'aviators-training-centre' ? 1.0 : 1.5}
                                                className="h-full w-full"
                                                style={{ aspectRatio: 'unset' }} // Allow filling the container
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : mediaSlides[lightboxIndex].type === "video" ? (
                                // Native video in lightbox - larger
                                <video
                                    src={mediaSlides[lightboxIndex].src}
                                    className="max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl"
                                    controls
                                    autoPlay
                                    loop
                                />
                            ) : (
                                // Image in lightbox with blurred background fill
                                <div className="relative w-full h-full">
                                    {/* Blurred background - fills empty space with color-matched blur */}
                                    <Image
                                        src={mediaSlides[lightboxIndex].src}
                                        alt=""
                                        fill
                                        className="object-cover blur-3xl scale-125 opacity-60"
                                        priority={false}
                                    />
                                    {/* Main image - maintains aspect ratio, larger */}
                                    <Image
                                        src={mediaSlides[lightboxIndex].src}
                                        alt={mediaSlides[lightboxIndex].alt}
                                        fill
                                        className="object-contain relative z-[1]"
                                        priority
                                        sizes="95vw"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Caption */}
                        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-10 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white text-sm max-w-md text-center">
                            {mediaSlides[lightboxIndex].alt}
                        </div>

                        {/* Navigation */}
                        {mediaSlides.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => (prev - 1 + mediaSlides.length) % mediaSlides.length);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => (prev + 1) % mediaSlides.length);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Thumbnails */}
                        {mediaSlides.length > 1 && (
                            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-md max-w-[90vw] overflow-x-auto">
                                {mediaSlides.map((slide, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                        className={cn(
                                            "relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200",
                                            lightboxIndex === idx
                                                ? "ring-2 ring-white scale-105"
                                                : "opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        {slide.type === "youtube" || slide.type === "video" ? (
                                            // Video thumbnail
                                            <div className="w-full h-full bg-forest-800 flex items-center justify-center">
                                                <Play className="w-4 h-4 text-white fill-current" />
                                            </div>
                                        ) : (
                                            <Image
                                                src={slide.src}
                                                alt={slide.alt}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
