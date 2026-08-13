"use client";

import React from "react";
import { ScrollReveal as UnifiedScrollReveal, ScrollRevealType } from "@/components/motion/ScrollReveal";

interface ScrollRevealProps {
    children: React.ReactNode;
    type?: ScrollRevealType | "editorial" | "image-mask" | "horizontal" | "scale" | "heading-inset";
    direction?: "left" | "right" | "up" | "down";
    delay?: number;
    duration?: number;
    className?: string;
    threshold?: number;
    style?: React.CSSProperties;
}

export function ScrollReveal({
    children,
    type = "card",
    direction = "left",
    delay = 0,
    duration = 850,
    className = "",
    threshold = 0.15,
    style = {},
}: ScrollRevealProps) {
    const dir = direction === "right" ? "right" : "left";
    const mappedType = type === "heading-inset" ? "heading-inset" : (type as ScrollRevealType);

    return (
        <UnifiedScrollReveal
            type={mappedType}
            direction={dir}
            delay={delay}
            duration={duration}
            threshold={threshold}
            className={className}
            style={style}
        >
            {children}
        </UnifiedScrollReveal>
    );
}
