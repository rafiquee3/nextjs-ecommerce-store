'use client';

import { useEffect, useState } from "react";

const getBreakpoint = (width: number, defaultCount: number) => {
    if (width < 600) return 2;
    if (width < 870) return 3;   // Mobile
    if (width < 1280) return 4;  // Tablet
    if (width > 1281) return 5; 
    
    return defaultCount; // Desktop
};

export function useBreakpoint(defaultCount: number): number {
    const [displayCount, setDisplayCount] = useState<number>(defaultCount);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setDisplayCount(getBreakpoint(window.innerWidth, defaultCount));
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, []);

    return displayCount;
}