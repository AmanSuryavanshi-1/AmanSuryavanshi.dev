"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

// Declare YouTube API types
declare global {
    interface Window {
        YT: {
            Player: new (
                elementId: string | HTMLElement,
                config: {
                    videoId: string;
                    playerVars?: Record<string, string | number>;
                    events?: {
                        onReady?: (event: { target: YTPlayer }) => void;
                        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
                    };
                }
            ) => YTPlayer;
            PlayerState: {
                ENDED: number;
                PLAYING: number;
                PAUSED: number;
                BUFFERING: number;
                CUED: number;
            };
        };
        onYouTubeIframeAPIReady: () => void;
    }
}

interface YTPlayer {
    playVideo: () => void;
    pauseVideo: () => void;
    mute: () => void;
    unMute: () => void;
    isMuted: () => boolean;
    getCurrentTime: () => number;
    getDuration: () => number;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    getPlayerState: () => number;
    destroy: () => void;
}

interface CustomVideoPlayerProps {
    videoId: string;
    title?: string;
    className?: string;
    poster?: string;
    accentColor?: string;
}

// Global flag to track if YouTube API is loaded
let isYouTubeAPILoaded = false;
let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
    if (isYouTubeAPILoaded) {
        return Promise.resolve();
    }

    if (apiLoadPromise) {
        return apiLoadPromise;
    }

    apiLoadPromise = new Promise((resolve) => {
        // Check if already loaded
        if (window.YT && window.YT.Player) {
            isYouTubeAPILoaded = true;
            resolve();
            return;
        }

        // Set callback before loading script
        window.onYouTubeIframeAPIReady = () => {
            isYouTubeAPILoaded = true;
            resolve();
        };

        // Load the API script
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
    });

    return apiLoadPromise;
}

/**
 * CustomVideoPlayer - Premium video player with YouTube IFrame API
 * 
 * Features:
 * - Full playback control via YouTube IFrame API
 * - Accurate progress tracking
 * - Auto-play on viewport intersection
 * - Preloads to avoid YouTube's red play button
 * - Custom styled controls matching site design
 */
export default function CustomVideoPlayer({
    videoId,
    title = "Video",
    className,
    poster,
    accentColor = "#84cc16",
}: CustomVideoPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YTPlayer | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [showPoster, setShowPoster] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [isInViewport, setIsInViewport] = useState(false);
    const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

    const playerId = useRef(`yt-player-${videoId}-${Math.random().toString(36).substr(2, 9)}`);

    // YouTube thumbnail URLs
    const thumbnailUrl = poster || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    // Load YouTube API and create player on mount
    useEffect(() => {
        let isMounted = true;

        const initPlayer = async () => {
            await loadYouTubeAPI();

            if (!isMounted || !playerContainerRef.current) return;

            // Create player container element
            const playerDiv = document.createElement("div");
            playerDiv.id = playerId.current;
            playerContainerRef.current.appendChild(playerDiv);

            // Initialize YouTube player
            playerRef.current = new window.YT.Player(playerId.current, {
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    mute: 1,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                    fs: 0,
                    disablekb: 1,
                    origin: window.location.origin,
                },
                events: {
                    onReady: (event) => {
                        if (!isMounted) return;
                        setIsPlayerReady(true);
                        setDuration(event.target.getDuration());
                    },
                    onStateChange: (event) => {
                        if (!isMounted) return;
                        const state = event.data;

                        if (state === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                            startProgressTracking();
                        } else if (state === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                            stopProgressTracking();
                        } else if (state === window.YT.PlayerState.ENDED) {
                            setIsPlaying(false);
                            setProgress(100);
                            stopProgressTracking();
                        }
                    },
                },
            });
        };

        initPlayer();

        return () => {
            isMounted = false;
            stopProgressTracking();
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [videoId]);

    // Intersection Observer for auto-play on viewport
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsInViewport(entry.isIntersecting);

                    // Auto-play when entering viewport (only once)
                    if (entry.isIntersecting && isPlayerReady && !hasAutoPlayed) {
                        setShowPoster(false);
                        setHasAutoPlayed(true);
                        playerRef.current?.playVideo();
                    }

                    // Pause when leaving viewport
                    if (!entry.isIntersecting && isPlaying) {
                        playerRef.current?.pauseVideo();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isPlayerReady, hasAutoPlayed, isPlaying]);

    // Progress tracking
    const startProgressTracking = () => {
        if (progressIntervalRef.current) return;

        progressIntervalRef.current = setInterval(() => {
            if (playerRef.current) {
                const current = playerRef.current.getCurrentTime();
                const total = playerRef.current.getDuration();
                setCurrentTime(current);
                setDuration(total);
                setProgress((current / total) * 100);
            }
        }, 250);
    };

    const stopProgressTracking = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    // Auto-hide controls after inactivity
    useEffect(() => {
        if (isPlaying && !isHovering && !showPoster) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        } else {
            setShowControls(true);
        }

        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [isPlaying, isHovering, showPoster]);

    // Mouse movement shows controls
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        if (isPlaying && !showPoster) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        if (!playerRef.current || !isPlayerReady) return;

        if (showPoster) {
            setShowPoster(false);
        }

        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    }, [isPlaying, isPlayerReady, showPoster]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        if (!playerRef.current) return;

        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    }, [isMuted]);

    // Seek +/- seconds
    const seekBy = useCallback((seconds: number) => {
        if (!playerRef.current) return;
        const current = playerRef.current.getCurrentTime();
        const newTime = Math.max(0, Math.min(current + seconds, duration));
        playerRef.current.seekTo(newTime, true);
        setCurrentTime(newTime);
        setProgress((newTime / duration) * 100);
    }, [duration]);

    // Seek to position (for progress bar click)
    const seekToProgress = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!playerRef.current || !duration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * duration;

        playerRef.current.seekTo(newTime, true);
        setCurrentTime(newTime);
        setProgress(percentage * 100);
    }, [duration]);

    // Toggle fullscreen
    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            await containerRef.current.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (!isPlayerReady) return;

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'm':
                    toggleMute();
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    seekBy(-5);
                    break;
                case 'arrowright':
                    e.preventDefault();
                    seekBy(5);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [isPlayerReady, togglePlay, toggleMute, seekBy]);

    // Format time for display
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full overflow-hidden bg-forest-900 group cursor-pointer",
                isFullscreen ? "fixed inset-0 z-50" : "rounded-xl",
                className
            )}
            style={{ aspectRatio: isFullscreen ? undefined : "16/9" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* YouTube Player Container - Hidden but preloaded */}
            <div
                ref={playerContainerRef}
                className={cn(
                    "absolute inset-0 overflow-hidden",
                    showPoster && "opacity-0"
                )}
            >
                {/* Player will be injected here by YouTube API */}
                <style jsx>{`
                    div :global(iframe) {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 120%;
                        height: 120%;
                        transform: translate(-50%, -50%);
                        pointer-events: none;
                    }
                `}</style>
            </div>

            {/* Poster Image with Play Button */}
            {showPoster && (
                <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={togglePlay}
                >
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackThumbnail;
                        }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Centered Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative group/play">
                            {/* Pulsing ring */}
                            <div
                                className="absolute inset-0 rounded-full animate-ping opacity-30"
                                style={{ backgroundColor: accentColor }}
                            />
                            {/* Play button */}
                            <button
                                className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-white"
                                style={{ color: "#1a2e1a" }}
                            >
                                <Play className="w-8 h-8 ml-1" fill="currentColor" />
                            </button>
                        </div>
                    </div>

                    {/* Video title */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-semibold text-lg drop-shadow-lg line-clamp-1">
                            {title}
                        </p>
                        <p className="text-white/70 text-sm mt-1">Click to play walkthrough</p>
                    </div>
                </div>
            )}

            {/* Custom Controls Overlay - Only when playing */}
            {!showPoster && (
                <>
                    {/* Click area to toggle play */}
                    <div
                        className="absolute inset-0 z-20"
                        onClick={togglePlay}
                    />

                    {/* Controls container */}
                    <div
                        className={cn(
                            "absolute bottom-0 left-0 right-0 z-30 transition-all duration-300",
                            showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                        )}
                    >
                        {/* Gradient background for controls */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                        {/* Progress bar - Clickable */}
                        <div
                            className="relative h-1.5 mx-4 mb-3 bg-white/20 rounded-full cursor-pointer group/progress hover:h-2 transition-all"
                            onClick={(e) => { e.stopPropagation(); seekToProgress(e); }}
                        >
                            {/* Buffered progress */}
                            <div
                                className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
                                style={{ width: `${Math.min(progress + 10, 100)}%` }}
                            />
                            {/* Current progress */}
                            <div
                                className="absolute inset-y-0 left-0 rounded-full transition-all"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: accentColor
                                }}
                            />
                            {/* Scrubber handle */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
                                style={{ left: `calc(${progress}% - 8px)` }}
                            />
                        </div>

                        {/* Control buttons */}
                        <div className="relative flex items-center justify-between px-4 pb-4">
                            {/* Left controls */}
                            <div className="flex items-center gap-2">
                                {/* Play/Pause */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-5 h-5" fill="currentColor" />
                                    ) : (
                                        <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                                    )}
                                </button>

                                {/* -5 seconds */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); seekBy(-5); }}
                                    className="flex items-center justify-center px-2 h-8 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-xs font-medium"
                                >
                                    -5s
                                </button>

                                {/* +5 seconds */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); seekBy(5); }}
                                    className="flex items-center justify-center px-2 h-8 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-xs font-medium"
                                >
                                    +5s
                                </button>

                                {/* Volume */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                                >
                                    {isMuted ? (
                                        <VolumeX className="w-4 h-4" />
                                    ) : (
                                        <Volume2 className="w-4 h-4" />
                                    )}
                                </button>

                                {/* Time display */}
                                <span className="text-white/80 text-sm font-medium ml-2">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>

                            {/* Right controls */}
                            <div className="flex items-center gap-2">
                                {/* Fullscreen */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                                >
                                    {isFullscreen ? (
                                        <Minimize className="w-4 h-4" />
                                    ) : (
                                        <Maximize className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Center play/pause indicator */}
                    <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
                        <div className={cn(
                            "w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300",
                            "opacity-0 group-active:opacity-100"
                        )}>
                            {isPlaying ? (
                                <Pause className="w-8 h-8 text-white" fill="currentColor" />
                            ) : (
                                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
