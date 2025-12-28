'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useImageGallery } from '@/context/ImageGalleryContext';
import Image from 'next/image';
import { FallbackImageManager } from '@/lib/fallback-image-manager';

export default function Lightbox() {
    const { isOpen, images, currentIndex, closeGallery, nextImage, prevImage } = useImageGallery();
    const [scale, setScale] = React.useState(1);
    const [imageErrors, setImageErrors] = React.useState<Record<number, boolean>>({});

    // Reset scale and errors when image changes
    useEffect(() => {
        setScale(1);
    }, [currentIndex]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeGallery, nextImage, prevImage]);

    if (!isOpen) return null;

    const currentImage = images[currentIndex];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-950/90 backdrop-blur-md"
                    onClick={closeGallery}
                >
                    {/* Controls */}
                    <div className="absolute top-4 right-4 z-50 flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + 0.5, 3)); }}
                            className="p-2 rounded-full bg-forest-900/50 text-white hover:bg-lime-500 hover:text-forest-900 transition-colors"
                        >
                            <ZoomIn className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(s - 0.5, 1)); }}
                            className="p-2 rounded-full bg-forest-900/50 text-white hover:bg-lime-500 hover:text-forest-900 transition-colors"
                        >
                            <ZoomOut className="w-6 h-6" />
                        </button>
                        <button
                            onClick={closeGallery}
                            className="p-2 rounded-full bg-forest-900/50 text-white hover:bg-red-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 p-3 rounded-full bg-forest-900/50 text-white hover:bg-lime-500 hover:text-forest-900 transition-colors z-50 max-md:hidden"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 p-3 rounded-full bg-forest-900/50 text-white hover:bg-lime-500 hover:text-forest-900 transition-colors z-50 max-md:hidden"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Optional: Click outside image to close
                            // closeGallery();
                        }}
                        onWheel={(e) => {
                            // Prevent default scroll behavior if possible, but mainly handle zoom
                            // Note: e.preventDefault() might needed on a non-passive listener for window, 
                            // but here we just handle the logic.
                            if (e.ctrlKey || true) { // Always allow wheel zoom for better UX
                                const delta = -e.deltaY * 0.005;
                                setScale(s => Math.min(Math.max(1, s + delta), 4));
                            }
                        }}
                    >
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: scale }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                            style={{
                                cursor: scale > 1 ? 'grab' : 'zoom-in',
                                touchAction: 'none' // Important for gestures
                            }}
                            drag={scale > 1}
                            dragConstraints={{
                                left: -1000 * (scale - 1),
                                right: 1000 * (scale - 1),
                                top: -1000 * (scale - 1),
                                bottom: 1000 * (scale - 1)
                            }}
                            dragElastic={0.05}
                            dragMomentum={true}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                setScale(s => s > 1 ? 1 : 2.5); // Toggle zoom
                            }}
                            whileTap={{ cursor: scale > 1 ? 'grabbing' : 'zoom-in' }}
                        >
                            {/* We use standard img tag here for the lightbox to avoid Next.js Image complexity with dynamic external URLs if not fully configured, 
                                but since we configured remotePatterns, we can try Next.js Image or fallback to img if needed. 
                                Using standard img for simplicity in lightbox context often avoids layout shifts issues with unknown dimensions.
                            */}
                            <img
                                src={imageErrors[currentIndex]
                                    ? FallbackImageManager.getRandomFallback().path
                                    : currentImage.src}
                                alt={currentImage.alt}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                                draggable={false}
                                onError={() => {
                                    if (!imageErrors[currentIndex]) {
                                        setImageErrors(prev => ({ ...prev, [currentIndex]: true }));
                                    }
                                }}
                            />
                            {currentImage.alt && (
                                <div className="absolute -bottom-16 left-0 right-0 text-center pointer-events-none">
                                    <p className="text-forest-100 text-lg font-medium bg-forest-900/50 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
                                        {currentImage.alt}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-forest-200 font-mono bg-forest-900/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
