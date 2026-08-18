"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
    target: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    className?: string;
}

export function AnimatedCounter({
    target,
    prefix = "",
    suffix = "",
    duration = 1800,
    className = "",
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    let startTime: number | null = null;
                    const step = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Cubic ease-out curve for smooth decelerating animation
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                        const currentVal = Math.floor(easeOutCubic * target);

                        setCount(currentVal);

                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            setCount(target);
                        }
                    };

                    requestAnimationFrame(step);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [target, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}
