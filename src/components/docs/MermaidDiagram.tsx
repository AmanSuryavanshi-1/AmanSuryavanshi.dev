'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ZoomIn,
    ZoomOut,
    Maximize2,
    Minimize2,
    Copy,
    Download,
    Zap,
    ZapOff,
    Hand,
    MousePointer,
    RotateCcw,
    Check,
    Loader2,
    HelpCircle,
    Info
} from 'lucide-react';

interface MermaidDiagramProps {
    chart: string;
}

// ══════════════════════════════════════════════════════════════════════════
// FOREST-SAGE-LIME DESIGN SYSTEM VARIABLES FOR MERMAID
// ══════════════════════════════════════════════════════════════════════════
const darkThemeVariables = {
    darkMode: true,
    background: 'transparent',
    mainBkg: '#122a1e',           // dark-elevated
    nodeBorder: '#375F4B',        // forest-600
    textColor: '#D3E6BB',         // sage-50 / dark-primary text
    primaryColor: '#122a1e',
    primaryTextColor: '#D3E6BB',
    primaryBorderColor: '#375F4B',
    lineColor: '#9DCF6F',         // lime-500 / dark-accent (vibrant flow lines)
    edgeColor: '#9DCF6F',
    secondaryColor: '#1E4435',     // forest-800
    tertiaryColor: '#0a1f15',      // forest-950
    actorBorder: '#5C8B6C',        // forest-400
    actorBkg: '#122a1e',
    actorTextColor: '#D3E6BB',
    signalColor: '#B1DB8A',        // lime-400
    signalLineColor: '#78A689',    // forest-300
    labelBoxBkgColor: '#122a1e',
    labelBoxBorderColor: '#375F4B',
    labelTextColor: '#ADBC9F',     // sage-300
    loopTextColor: '#D3E6BB',
    noteBorderColor: '#ADBC9F',
    noteBkgColor: '#1E4435',
    noteTextColor: '#FBFADA'       // sage-100
};

const lightThemeVariables = {
    darkMode: false,
    background: 'transparent',
    mainBkg: '#E4F0D4',           // light-elevated
    nodeBorder: '#98C0A8',        // forest-200
    textColor: '#12372A',         // forest-900 / primary text
    primaryColor: '#E4F0D4',
    primaryTextColor: '#12372A',
    primaryBorderColor: '#98C0A8',
    lineColor: '#436850',         // forest-500 / secondary text
    edgeColor: '#436850',
    secondaryColor: '#BAD9C8',     // forest-100
    tertiaryColor: '#FBFADA',      // sage-100
    actorBorder: '#436850',
    actorBkg: '#E4F0D4',
    actorTextColor: '#12372A',
    signalColor: '#749A48',        // lime-700 / secondary accent
    signalLineColor: '#436850',
    labelBoxBkgColor: '#E4F0D4',
    labelBoxBorderColor: '#98C0A8',
    labelTextColor: '#436850',
    loopTextColor: '#12372A',
    noteBorderColor: '#78A689',    // forest-300
    noteBkgColor: '#FBFADA',
    noteTextColor: '#12372A'
};

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
    const { resolvedTheme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    
    // UI / RENDER STATES
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);
    
    // INTERACTIVE STATES
    const [scale, setScale] = useState<number>(1);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isPanMode, setIsPanMode] = useState<boolean>(true);
    const [isAnimated, setIsAnimated] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [showHelp, setShowHelp] = useState<boolean>(false);

    const isDark = resolvedTheme === 'dark';

    // Initialize & Render Diagram on Chart / Theme Change
    useEffect(() => {
        setIsLoading(true);
        setError(false);
        
        try {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'base',
                themeVariables: isDark ? darkThemeVariables : lightThemeVariables,
                fontFamily: 'var(--font-geist-sans), "Inter", system-ui, sans-serif',
                securityLevel: 'loose',
                flowchart: {
                    htmlLabels: true,
                    curve: 'basis',
                    useMaxWidth: true
                }
            });

            const renderChart = async () => {
                try {
                    const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
                    // Replace any legacy layout values to ensure custom styling can override them
                    const cleanedChart = chart.replace(/style\s+[\w,-]+\s+fill:[^;\n]+;?/gi, '');
                    const { svg: renderedSvg } = await mermaid.render(id, cleanedChart);
                    
                    setSvg(renderedSvg);
                    setError(false);
                } catch (err) {
                    console.error('Mermaid rendering failed', err);
                    setError(true);
                } finally {
                    setIsLoading(false);
                }
            };

            renderChart();
        } catch (err) {
            console.error('Mermaid initialization failed', err);
            setError(true);
            setIsLoading(false);
        }
    }, [chart, isDark]);

    // Handle interactive operations
    const handleZoomIn = () => setScale(s => Math.min(s + 0.15, 3));
    const handleZoomOut = () => setScale(s => Math.max(s - 0.15, 0.45));
    const handleReset = () => {
        setScale(1);
        setOffset({ x: 0, y: 0 });
    };

    // Pan Event Handlers (Mouse)
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isPanMode || isLoading || error) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !isPanMode || isLoading || error) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Pan Event Handlers (Touch for mobile responsiveness)
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isPanMode || isLoading || error || e.touches.length !== 1) return;
        setIsDragging(true);
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !isPanMode || isLoading || error || e.touches.length !== 1) return;
        const touch = e.touches[0];
        setOffset({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y
        });
    };

    // Zoom on Mouse Wheel (holding Ctrl makes it clean, or zoom normally on focus)
    const handleWheel = (e: React.WheelEvent) => {
        if (isLoading || error) return;
        e.preventDefault();
        
        const zoomFactor = 0.05;
        const direction = e.deltaY < 0 ? 1 : -1;
        const nextScale = Math.max(0.45, Math.min(3, scale + direction * zoomFactor));
        
        setScale(nextScale);
    };

    // Utilities
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(chart);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const downloadSVG = () => {
        if (!svg) return;
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `architecture-diagram-${new Date().toISOString().split('T')[0]}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Custom CSS injection to implement dynamic micro-animations & layout tweaks
    const customStyles = `
        .custom-mermaid text {
            font-family: var(--font-geist-sans), "Inter", system-ui, sans-serif !important;
            font-size: 13px !important;
        }
        .custom-mermaid .node rect, 
        .custom-mermaid .node circle, 
        .custom-mermaid .node polygon,
        .custom-mermaid .node path {
            rx: 10px !important;
            ry: 10px !important;
            stroke-width: 1.5px !important;
            filter: drop-shadow(0 2px 4px rgba(18, 55, 42, 0.04));
            transition: fill 0.3s ease, stroke 0.3s ease, filter 0.3s ease !important;
        }
        .custom-mermaid .node:hover rect, 
        .custom-mermaid .node:hover circle, 
        .custom-mermaid .node:hover polygon,
        .custom-mermaid .node:hover path {
            filter: drop-shadow(0 8px 16px rgba(157, 207, 111, 0.15)) !important;
            stroke-width: 2px !important;
        }
        .custom-mermaid .edgePath .path {
            stroke-width: 2px !important;
            transition: stroke-dasharray 0.3s ease !important;
            ${isAnimated ? 'stroke-dasharray: 8, 4; animation: mermaidFlow 1.2s linear infinite;' : ''}
        }
        @keyframes mermaidFlow {
            to {
                stroke-dashoffset: -20;
            }
        }
        .custom-mermaid .edgeLabel rect {
            fill: ${isDark ? '#122a1e' : '#E4F0D4'} !important;
            rx: 4px !important;
            ry: 4px !important;
        }
    `;

    // Render Canvas content (split for reuse in fullscreen)
    const renderCanvas = (isOverlay = false) => {
        return (
            <div
                ref={canvasRef}
                className="relative flex-1 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-transparent"
                style={{
                    backgroundImage: isDark
                        ? 'radial-gradient(rgba(157, 207, 111, 0.06) 1.5px, transparent 1.5px)'
                        : 'radial-gradient(rgba(18, 55, 42, 0.04) 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px',
                    cursor: !isPanMode ? 'default' : isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                onWheel={handleWheel}
                onDoubleClick={handleReset}
            >
                <div
                    className="w-full h-full flex items-center justify-center p-8 transition-transform duration-75 ease-out"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        transformOrigin: 'center center'
                    }}
                >
                    <div 
                        className="custom-mermaid flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: svg + `<style>${customStyles}</style>` }}
                    />
                </div>

                {/* Micro instructions overlay */}
                {isPanMode && !isDragging && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-forest-900/60 backdrop-blur-md border border-forest-200/30 dark:border-forest-800/50 rounded-full text-[11px] font-medium text-forest-600 dark:text-sage-300 pointer-events-none shadow-sm transition-opacity duration-300 hover:opacity-10">
                        <Info className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                        <span>Drag to pan • Pinch / Scroll to zoom • Double click to reset</span>
                    </div>
                )}
            </div>
        );
    };

    if (error) {
        return (
            <div className="group my-8 overflow-hidden rounded-2xl border border-red-500/20 bg-red-50/50 dark:bg-red-950/10 backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-between border-b border-red-500/20 px-5 py-3.5 bg-red-100/30 dark:bg-red-950/20">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                            Mermaid Compiler Error
                        </span>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-red-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Code</span>
                    </button>
                </div>
                <div className="p-5 overflow-x-auto max-h-[300px]">
                    <pre className="text-xs font-mono text-red-700 dark:text-red-400/90 whitespace-pre">
                        <code>{chart}</code>
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* ─── REGULAR DISPLAY CONTAINER ─── */}
            <div
                ref={containerRef}
                className="relative group/mermaid w-full min-h-[360px] max-h-[580px] md:max-h-[640px] flex flex-col my-8 bg-white/40 dark:bg-forest-950/40 backdrop-blur-md border border-forest-200/50 dark:border-forest-800/80 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden"
            >
                {/* Stunning Floating Glass Toolbar */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                    {/* Badge Indicator */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/70 dark:bg-forest-900/70 backdrop-blur-md border border-forest-200/40 dark:border-forest-800/60 rounded-full shadow-sm text-xs font-semibold text-forest-800 dark:text-sage-200 pointer-events-auto">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                        </div>
                        <span>Architecture Diagram</span>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 p-1.5 bg-white/70 dark:bg-forest-900/70 backdrop-blur-md border border-forest-200/40 dark:border-forest-800/60 rounded-full shadow-md pointer-events-auto">
                        {/* Pan vs Text selection */}
                        <button
                            onClick={() => setIsPanMode(!isPanMode)}
                            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-105 ${
                                isPanMode
                                    ? 'bg-lime-500/20 text-lime-700 dark:text-lime-400'
                                    : 'text-forest-500 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-800/60'
                            }`}
                            title={isPanMode ? 'Switch to Selection Mode' : 'Switch to Interactive Pan'}
                        >
                            {isPanMode ? <Hand className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}
                        </button>

                        <div className="w-px h-4 bg-forest-200 dark:bg-forest-800" />

                        {/* Zoom buttons */}
                        <button
                            onClick={handleZoomIn}
                            className="p-1.5 text-forest-500 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-800/60 rounded-full transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-mono font-bold px-1 text-forest-700 dark:text-sage-300 min-w-[32px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={handleZoomOut}
                            className="p-1.5 text-forest-500 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-800/60 rounded-full transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleReset}
                            className="p-1.5 text-forest-500 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-800/60 rounded-full transition-colors"
                            title="Reset Perspective"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>

                        <div className="w-px h-4 bg-forest-200 dark:bg-forest-800" />

                        {/* Flow animation toggle */}
                        <button
                            onClick={() => setIsAnimated(!isAnimated)}
                            className={`p-1.5 rounded-full transition-all duration-200 ${
                                isAnimated
                                    ? 'bg-lime-500/20 text-lime-700 dark:text-lime-400'
                                    : 'text-forest-400 dark:text-sage-500 hover:bg-forest-100 dark:hover:bg-forest-800/60'
                            }`}
                            title={isAnimated ? 'Pause Flow' : 'Animate Flow'}
                        >
                            {isAnimated ? (
                                <Zap className="w-4 h-4 animate-[pulse_2s_infinite]" />
                            ) : (
                                <ZapOff className="w-4 h-4" />
                            )}
                        </button>

                        {/* Fullscreen */}
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="p-1.5 text-forest-500 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-800/60 rounded-full transition-colors"
                            title="Enter Fullscreen"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>

                        <div className="w-px h-4 bg-forest-200 dark:bg-forest-800" />

                        {/* Code Copy & SVG download */}
                        <button
                            onClick={copyToClipboard}
                            className="p-1.5 text-forest-500 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-800/60 rounded-full transition-colors relative"
                            title="Copy Mermaid Code"
                        >
                            {copied ? <Check className="w-4 h-4 text-lime-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={downloadSVG}
                            className="p-1.5 text-forest-500 dark:text-sage-400 hover:bg-forest-100 dark:hover:bg-forest-800/60 rounded-full transition-colors"
                            title="Download SVG"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Interactive Area */}
                <div className="flex-1 w-full min-h-[300px] flex items-center justify-center relative mt-16 overflow-hidden">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/10 dark:bg-forest-950/10 backdrop-blur-sm z-20">
                            <Loader2 className="w-8 h-8 text-lime-500 dark:text-lime-400 animate-spin" />
                            <span className="text-xs font-mono tracking-widest text-forest-600 dark:text-sage-400 uppercase">
                                Compiling Architecture...
                            </span>
                        </div>
                    ) : null}
                    {renderCanvas()}
                </div>
            </div>

            {/* ─── FULLSCREEN MODAL VIEW ─── */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-forest-950/98 backdrop-blur-lg select-none"
                    >
                        {/* Fullscreen Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-200/50 dark:border-forest-800/80 bg-white/70 dark:bg-forest-950/70 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
                                </div>
                                <span className="font-semibold text-lg text-forest-900 dark:text-sage-100">
                                    System Architecture Canvas
                                </span>
                            </div>

                            {/* Fullscreen Controls */}
                            <div className="flex items-center gap-2.5 p-1 bg-forest-100/50 dark:bg-forest-900/50 border border-forest-200/30 dark:border-forest-800/40 rounded-full">
                                {/* Mode switcher */}
                                <button
                                    onClick={() => setIsPanMode(!isPanMode)}
                                    className={`p-2 rounded-full transition-all duration-200 ${
                                        isPanMode
                                            ? 'bg-lime-500/20 text-lime-700 dark:text-lime-400 shadow-sm'
                                            : 'text-forest-500 dark:text-sage-400 hover:bg-forest-200 dark:hover:bg-forest-850'
                                    }`}
                                    title={isPanMode ? 'Switch to Selection Mode' : 'Switch to Interactive Pan'}
                                >
                                    {isPanMode ? <Hand className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}
                                </button>

                                <div className="w-px h-5 bg-forest-250 dark:bg-forest-800" />

                                {/* Zoom controls */}
                                <button
                                    onClick={handleZoomIn}
                                    className="p-2 text-forest-500 dark:text-sage-400 hover:bg-forest-200 dark:hover:bg-forest-850 rounded-full transition-colors"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-mono font-bold px-1 text-forest-800 dark:text-sage-200 min-w-[38px] text-center">
                                    {Math.round(scale * 100)}%
                                </span>
                                <button
                                    onClick={handleZoomOut}
                                    className="p-2 text-forest-500 dark:text-sage-400 hover:bg-forest-200 dark:hover:bg-forest-850 rounded-full transition-colors"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="p-2 text-forest-500 dark:text-sage-400 hover:bg-forest-200 dark:hover:bg-forest-850 rounded-full transition-colors"
                                    title="Reset View"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>

                                <div className="w-px h-5 bg-forest-250 dark:bg-forest-800" />

                                {/* Flow animation toggle */}
                                <button
                                    onClick={() => setIsAnimated(!isAnimated)}
                                    className={`p-2 rounded-full transition-all duration-200 ${
                                        isAnimated
                                            ? 'bg-lime-500/20 text-lime-700 dark:text-lime-400 shadow-sm'
                                            : 'text-forest-400 dark:text-sage-500 hover:bg-forest-200 dark:hover:bg-forest-850'
                                    }`}
                                    title={isAnimated ? 'Pause Flow' : 'Animate Flow'}
                                >
                                    {isAnimated ? (
                                        <Zap className="w-4 h-4 animate-[pulse_2s_infinite]" />
                                    ) : (
                                        <ZapOff className="w-4 h-4" />
                                    )}
                                </button>

                                <div className="w-px h-5 bg-forest-250 dark:bg-forest-800" />

                                {/* Copy and Download */}
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 text-forest-500 dark:text-sage-400 hover:bg-forest-200 dark:hover:bg-forest-850 rounded-full transition-colors relative"
                                    title="Copy Code"
                                >
                                    {copied ? <Check className="w-4 h-4 text-lime-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={downloadSVG}
                                    className="p-2 text-forest-500 dark:text-sage-400 hover:bg-forest-200 dark:hover:bg-forest-850 rounded-full transition-colors"
                                    title="Download SVG"
                                >
                                    <Download className="w-4 h-4" />
                                </button>

                                <div className="w-px h-5 bg-forest-250 dark:bg-forest-800" />

                                {/* Close Fullscreen */}
                                <button
                                    onClick={() => setIsFullscreen(false)}
                                    className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all duration-200"
                                    title="Exit Fullscreen"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Interactive Area */}
                        <div className="flex-1 w-full h-full overflow-hidden relative">
                            {renderCanvas(true)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MermaidDiagram;
