'use client';

import { motion } from 'framer-motion';
import ZoomableBlogImage from '@/components/blog/ZoomableBlogImage';

interface SanityImageWrapperProps {
    value: any;
    isExternal?: boolean;
}

export default function SanityImageWrapper({ value, isExternal = false }: SanityImageWrapperProps) {
    if (isExternal) {
        // Handle external image constructed value
        // The value passed here is already formatted as { url, alt, caption } by the parent if it was external
        // But wait, the parent was constructing it.
        // Let's keep it simple: The parent passes the 'value' prop that ZoomableBlogImage expects.

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="my-10"
            >
                <ZoomableBlogImage value={value} />
            </motion.div>
        );
    }

    // Default PortableText image
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="my-10"
        >
            <ZoomableBlogImage value={value} />
        </motion.div>
    );
}
