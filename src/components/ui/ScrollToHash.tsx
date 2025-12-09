"use client";

import { useEffect } from "react";

export default function ScrollToHash() {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            // Small delay to ensure DOM is rendered
            const timeoutId = setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, []);

    return null;
}
