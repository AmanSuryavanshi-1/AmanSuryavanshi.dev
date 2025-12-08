'use client';

import { ImageGalleryProvider } from '@/context/ImageGalleryContext';
import Lightbox from '@/components/ui/Lightbox';

export default function BlogImageGalleryWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ImageGalleryProvider>
            <Lightbox />
            {children}
        </ImageGalleryProvider>
    );
}
