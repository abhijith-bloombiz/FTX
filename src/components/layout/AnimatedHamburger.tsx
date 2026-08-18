"use client";

import React from "react";

interface AnimatedHamburgerProps {
    isOpen: boolean;
    onClick: () => void;
    className?: string;
}

export function AnimatedHamburger({ isOpen, onClick, className = "" }: AnimatedHamburgerProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none select-none transition-colors active:scale-95 ${className}`}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
        >
            {/* Top Bar */}
            <span
                className={`w-7 h-[3.5px] bg-ftx-silver group-hover:text-ftx-lime rounded-[1.5px] transition-all duration-300 ease-out origin-center ${isOpen
                    ? "translate-y-[9.5px] rotate-45 bg-ftx-lime"
                    : "translate-y-0 rotate-0 bg-ftx-silver"
                    }`}
            />

            {/* Middle Bar (Green Accent) */}
            <span
                className={`w-7 h-[3.5px] bg-ftx-lime rounded-[1.5px] transition-all duration-300 ease-out origin-center ${isOpen
                    ? "opacity-0 -translate-x-2.5 scale-x-50"
                    : "opacity-100 translate-x-0 scale-x-100"
                    }`}
            />

            {/* Bottom Bar */}
            <span
                className={`w-7 h-[3.5px] rounded-[1.5px] transition-all duration-300 ease-out origin-center ${isOpen
                    ? "-translate-y-[9.5px] -rotate-45 bg-ftx-lime"
                    : "translate-y-0 rotate-0 bg-ftx-silver"
                    }`}
            />
        </button>
    );
}
