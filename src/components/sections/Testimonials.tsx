"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Quote } from "lucide-react";
import { testimonialsData } from "@/data/testimonials";
import { Locale } from "@/i18n/config";
import { TextReveal } from "@/components/motion/TextReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface TestimonialsProps {
    locale: Locale;
    messages: any;
}

export function Testimonials({ locale, messages }: TestimonialsProps) {
    const [testimonials, setTestimonials] = useState<any[]>(testimonialsData);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const isIdleRef = useRef(true);
    const sectionRef = useRef<HTMLElement>(null);
    const [isInView, setIsInView] = useState(true);

    // Viewport Awareness: Only run carousel when section is in view
    useEffect(() => {
        if (!sectionRef.current || typeof window === "undefined" || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Scroll Detector: Pause carousel while scrolling without triggering React re-renders
    useEffect(() => {
        if (typeof window === "undefined") return;

        let scrollTimer: NodeJS.Timeout | null = null;

        const handleScroll = () => {
            isIdleRef.current = false;
            if (scrollTimer) clearTimeout(scrollTimer);

            scrollTimer = setTimeout(() => {
                isIdleRef.current = true;
            }, 2500);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimer) clearTimeout(scrollTimer);
        };
    }, []);

    const isRTL = locale === "ar";

    useEffect(() => {
        fetch("/api/admin/testimonials")
            .then((res) => res.json())
            .then((data) => {
                if (data.testimonials && data.testimonials.length > 0) {
                    setTestimonials(data.testimonials);
                }
            })
            .catch(() => { });
    }, []);

    // Handle responsive items per page
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(3);
            } else if (window.innerWidth >= 640) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(1);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    // Autoplay effect (ONLY cycles when visible, idle, and not hovered/paused)
    useEffect(() => {
        if (isPaused || !isInView) return;

        const interval = setInterval(() => {
            if (isIdleRef.current) {
                handleNext();
            }
        }, 4500);

        return () => clearInterval(interval);
    }, [isPaused, isInView, handleNext]);

    // Touch swipe handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        const isSwipeLeft = distance > 40;
        const isSwipeRight = distance < -40;

        if (isSwipeLeft) {
            isRTL ? handlePrev() : handleNext();
        } else if (isSwipeRight) {
            isRTL ? handleNext() : handlePrev();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <section ref={sectionRef} className="py-10 sm:py-16 bg-black relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Left Side - Desktop Only for GPU Optimization) */}
            <div
                className="absolute bottom-0 left-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0 hidden sm:block"
                style={{ background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Title */}
                <div className="mb-8 sm:mb-10 text-left max-w-3xl space-y-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                        <span>{messages.testimonials.badge}</span>
                    </div>
                    <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight sm:leading-[0.95]">
                        <span>{messages.testimonials.title}</span>
                    </TextReveal>
                </div>

                {/* Carousel Track Container with Smooth ScrollReveal */}
                <ScrollReveal type="card" delay={120} duration={1200}>
                    <div
                        className="overflow-hidden w-full relative touch-pan-y"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex -mx-3 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{
                                transform: isRTL
                                    ? `translateX(${currentIndex * (100 / itemsPerPage)}%)`
                                    : `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                            }}
                        >
                            {testimonials.map((item) => {
                                const itemId = item.testimonialId || item.id || item._id;
                                const contentText = typeof item.content === "object" ? item.content[locale] || item.content.en : item.content;
                                const roleText = typeof item.role === "object" ? item.role[locale] || item.role.en : item.role;

                                return (
                                    <div
                                        key={itemId}
                                        className="px-3 shrink-0"
                                        style={{ width: `${100 / itemsPerPage}%` }}
                                    >
                                        <div className="ftx-btn-specular bg-ftx-surface border border-ftx-surface-high ftx-squircle-xl pt-4 pb-4 px-6 sm:pt-5 sm:pb-5 sm:px-8 flex flex-col justify-between relative group hover:border-ftx-lime/50 hover:shadow-[0_0_30px_rgba(164,214,94,0.22)] transition-[border-color,box-shadow,transform] duration-500 h-full min-h-[160px]">
                                            <Quote className="absolute top-3 right-3 w-7 h-7 text-ftx-lime/20 group-hover:text-ftx-lime/40 transition-colors z-10" />

                                            <div className="relative z-10">
                                                <p className="text-xs sm:text-sm text-ftx-silver font-body leading-relaxed italic pr-6">
                                                    &ldquo;{contentText}&rdquo;
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 pt-3 mt-3 border-t border-ftx-surface-high relative z-10">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-ftx-lime/40 shrink-0 bg-ftx-obsidian">
                                                    <img
                                                        src={item.avatar || "/images/testimonials/avatar-1.jpg"}
                                                        alt={item.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-mono font-bold text-white uppercase">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-[10px] font-mono text-ftx-lime">
                                                        {roleText} • {item.vehicle}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Carousel Pagination Dots */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx
                                    ? "w-8 bg-ftx-lime shadow-[0_0_12px_rgba(164,214,94,0.6)]"
                                    : "w-2.5 bg-white/20 hover:bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
