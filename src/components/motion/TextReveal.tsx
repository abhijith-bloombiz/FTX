"use client";

import React, { useEffect, useRef, useState } from "react";

interface TextRevealProps {
    children: React.ReactNode;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p" | "span";
    delay?: number;
    duration?: number;
    stagger?: number;
    className?: string;
}

export function TextReveal({
    children,
    as: Component = "div",
    delay = 0,
    duration = 850,
    stagger = 70,
    className = "",
}: TextRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            { threshold: 0.15 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    const childArray = React.Children.toArray(children);

    return (
        <Component ref={ref as any} className={`relative ${className}`}>
            {childArray.map((child, idx) => {
                if (React.isValidElement(child) && child.type === "br") {
                    return <br key={idx} />;
                }

                const itemDelay = delay + idx * stagger;
                return (
                    <span
                        key={idx}
                        className="inline-block overflow-hidden py-0.5 align-bottom"
                    >
                        <span
                            className="inline-block transition-all ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity]"
                            style={{
                                transitionDuration: `${duration}ms`,
                                transitionDelay: `${itemDelay}ms`,
                                transform: isVisible
                                    ? "translate3d(0, 0%, 0)"
                                    : "translate3d(0, 105%, 0)",
                                opacity: isVisible ? 1 : 0,
                            }}
                        >
                            {child}
                        </span>
                    </span>
                );
            })}
        </Component>
    );
}
