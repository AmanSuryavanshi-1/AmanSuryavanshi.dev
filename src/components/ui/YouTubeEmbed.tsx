"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
    videoId: string;
    title?: string;
    className?: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    autoplayOnViewport?: boolean;
    poster?: string;
    /** When true, enables user interaction (timeline, play/pause, volume, fullscreen). Default: false (background video mode) */
    interactive?: boolean;
}

/**
 * YouTubeEmbed - Seamless YouTube embed that looks like native video
 * 
 * Key features to match Cloudinary quality:
 * - CSS object-cover technique (scale iframe to fill, hide overflow)
 * - Poster image visible until video is actually playing (not just loaded)
 * - Preload iframe when component mounts for faster playback
 * - No visible loading spinners or YouTube branding
 */
export default function YouTubeEmbed({
    videoId,
    title = "Video",
    className,
    autoplay = true,
    muted = true,
    loop = true,
    controls = false,
    autoplayOnViewport = true,
    poster,
    interactive = false,
}: YouTubeEmbedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [iframeReady, setIframeReady] = useState(false);
    const [showPoster, setShowPoster] = useState(true);

    // IntersectionObserver for viewport detection
    useEffect(() => {
        if (!autoplayOnViewport || !containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                    }
                });
            },
            { threshold: 0.3, rootMargin: "100px" } // Preload 100px before visible
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [autoplayOnViewport]);

    // Build YouTube embed URL with parameters
    const buildEmbedUrl = useCallback(() => {
        const params = new URLSearchParams({
            autoplay: autoplay ? "1" : "0",
            mute: muted ? "1" : "0",
            loop: loop ? "1" : "0",
            controls: (controls || interactive) ? "1" : "0",
            modestbranding: "1",
            rel: "0",
            showinfo: "0",
            iv_load_policy: "3",
            playsinline: "1",
            enablejsapi: "1",
            origin: typeof window !== 'undefined' ? window.location.origin : '',
            start: "0",
            // Enable keyboard controls for interactive mode
            ...(interactive && { keyboard: "1" }),
        });

        if (loop) {
            params.set("playlist", videoId);
        }

        return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
    }, [videoId, autoplay, muted, loop, controls, interactive]);

    // Handle iframe load - wait a bit for video to start playing before hiding poster
    const handleIframeLoad = () => {
        setIframeReady(true);
        // Give YouTube time to start playing before hiding poster
        // This hides the loading spinner
        setTimeout(() => {
            setShowPoster(false);
        }, 1500); // 1.5s delay to let video start
    };

    const shouldRenderIframe = isInView || !autoplayOnViewport;

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-full overflow-hidden bg-forest-900",
                className
            )}
        >
            {/* 
             * YouTube iframe with object-cover effect
             * We scale the iframe larger than the container and center it
             * This crops the letterbox (black bars) and fills the container
             */}
            {shouldRenderIframe && (
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center overflow-hidden",
                    interactive && "pointer-events-auto"
                )}>
                    <iframe
                        src={buildEmbedUrl()}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                        className={cn(
                            "border-0",
                            // Interactive mode: normal sizing with pointer events
                            interactive ? "w-full h-full pointer-events-auto" : "w-[180%] h-[180%] pointer-events-none",
                            // Transition for smooth reveal
                            "transition-opacity duration-500",
                            !iframeReady && "opacity-0"
                        )}
                        style={{
                            aspectRatio: "16/9",
                        }}
                        onLoad={handleIframeLoad}
                    />
                </div>
            )}

            {/* 
             * Poster image overlay - stays visible until video is playing
             * This completely hides YouTube's loading spinner
             */}
            {poster && showPoster && (
                <div className="absolute inset-0 z-10">
                    <Image
                        src={poster}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}
        </div>
    );
}
