'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface GalleryImage {
    src: string;
    alt: string;
    title?: string;
}

interface ImageGalleryContextType {
    images: GalleryImage[];
    isOpen: boolean;
    currentIndex: number;
    registerImage: (image: GalleryImage) => void;
    openGallery: (index: number) => void;
    closeGallery: () => void;
    nextImage: () => void;
    prevImage: () => void;
}

const ImageGalleryContext = createContext<ImageGalleryContextType | undefined>(undefined);

export function ImageGalleryProvider({ children }: { children: React.ReactNode }) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const registerImage = useCallback((image: GalleryImage) => {
        setImages(prev => {
            // Avoid duplicates based on src
            if (prev.some(img => img.src === image.src)) return prev;
            return [...prev, image];
        });
    }, []);

    const openGallery = useCallback((index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
    }, []);

    const closeGallery = useCallback(() => {
        setIsOpen(false);
    }, []);

    const nextImage = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    return (
        <ImageGalleryContext.Provider value={{
            images,
            isOpen,
            currentIndex,
            registerImage,
            openGallery,
            closeGallery,
            nextImage,
            prevImage
        }}>
            {children}
        </ImageGalleryContext.Provider>
    );
}

export function useImageGallery() {
    const context = useContext(ImageGalleryContext);
    if (context === undefined) {
        throw new Error('useImageGallery must be used within an ImageGalleryProvider');
    }
    return context;
}
