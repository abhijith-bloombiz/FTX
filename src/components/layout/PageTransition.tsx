"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PageTransitionProps {
    children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        // Trigger fast ~350ms top laser sweep on route change
        setAnimating(true);
        const timer = setTimeout(() => {
            setAnimating(false);
        }, 350);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <div className="relative w-full">
            {/* Subtle Green Specular Light Sweep on Page Transition */}
            <div
                className={`fixed inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-ftx-lime to-transparent z-[99] pointer-events-none transition-all duration-500 ${animating ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
            />

            {/* Page Content Container - Render children directly to prevent React fiber unmounting removal errors */}
            <div
                className={`w-full transition-opacity duration-300 ease-out ${animating ? "opacity-60" : "opacity-100"
                    }`}
            >
                {children}
            </div>
        </div>
    );
}
