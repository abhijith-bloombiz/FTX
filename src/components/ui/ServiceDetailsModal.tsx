"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, CheckCircle2, ListChecks, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Locale } from "@/i18n/config";
import { useLenis } from "@/components/motion/SmoothScrollProvider";

interface ServiceDetailsModalProps {
    service: any;
    locale: Locale;
    onClose: () => void;
}

export function ServiceDetailsModal({ service, locale, onClose }: ServiceDetailsModalProps) {
    const isAr = locale === "ar";
    const [isMounted, setIsMounted] = useState(false);
    const { lenis } = useLenis();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!service) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        lenis?.stop();
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            lenis?.start();
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [service, onClose, lenis]);

    if (!service || !isMounted) return null;

    const getLangText = (field: any, fallbackStr: string = "") => {
        if (!field) return fallbackStr;
        if (typeof field === "string") return field;
        return isAr ? (field.ar || field.en || fallbackStr) : (field.en || field.ar || fallbackStr);
    };

    const benefits = service.benefits
        ? Array.isArray(service.benefits)
            ? service.benefits
            : isAr
                ? service.benefits.ar || service.benefits.en || []
                : service.benefits.en || service.benefits.ar || []
        : [];

    const processSteps = service.process && Array.isArray(service.process) ? service.process : [];

    const processHeading =
        service.id === "underbody-rust-proof"
            ? isAr ? "مراحل العملية والتنفيذ:" : "OUR PROCESS INCLUDES:"
            : isAr ? "مراحل تنفيذ الخدمة:" : "STEP-BY-STEP PROCESS:";

    const benefitsHeading =
        service.id === "underbody-rust-proof"
            ? isAr ? "لماذا تحمي أسفل سيارتك؟" : "WHY PROTECT YOUR UNDERBODY?"
            : isAr ? "أبرز مميزات وفوائد الخدمة:" : "WHY CHOOSE THIS PROTECTION?";

    const modalContent = (
        <div
            data-lenis-prevent
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent
                className="relative w-full max-w-3xl max-h-[88vh] sm:max-h-[90vh] flex flex-col bg-[#131313] border border-white/15 ftx-squircle-xl shadow-2xl shadow-black/90 overflow-hidden animate-ftx-dropdown"
            >
                {/* Modal Header */}
                <div className="relative z-10 shrink-0 px-5 sm:px-7 py-4 sm:py-5 border-b border-white/10 bg-black/40 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-ftx-lime px-2.5 py-1 bg-ftx-obsidian border border-ftx-lime/30 ftx-squircle-sm shrink-0">
                            {service.number || "01"}
                        </span>
                        <h2 className="text-base sm:text-lg font-heading font-black text-white uppercase tracking-tight truncate">
                            {getLangText(service.title)}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full border border-white/10 hover:border-ftx-lime/50 bg-ftx-surface hover:bg-ftx-surface-high text-white hover:text-ftx-lime transition-colors cursor-pointer shrink-0"
                        aria-label={isAr ? "إغلاق" : "Close"}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content Body */}
                <div
                    data-lenis-prevent
                    className="overflow-y-auto overscroll-contain flex-1 min-h-0 px-5 sm:px-7 py-6 space-y-6 text-left rtl:text-right touch-pan-y"
                >
                    {/* Section 1: Process Steps */}
                    {processSteps.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                                <ListChecks className="w-4 h-4 text-ftx-lime shrink-0" />
                                <h3 className="text-xs sm:text-sm font-mono font-bold tracking-widest text-white uppercase">
                                    {processHeading}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                {processSteps.map((step: any, sIdx: number) => (
                                    <div
                                        key={sIdx}
                                        className="p-3 sm:p-3.5 ftx-squircle-sm bg-ftx-surface/70 border border-white/5 hover:border-ftx-lime/30 transition-colors flex items-center gap-3.5"
                                    >
                                        <span className="font-mono text-xs font-black text-ftx-lime bg-ftx-obsidian border border-ftx-lime/30 px-2.5 py-1 ftx-squircle-sm shrink-0">
                                            {step.number || `0${sIdx + 1}`}
                                        </span>
                                        <h4 className="text-xs sm:text-sm font-heading font-bold text-white leading-snug">
                                            {getLangText(step.title)}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Section 2: Why Protect / Benefits Checklist */}
                    {benefits.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                                <ShieldCheck className="w-4 h-4 text-ftx-lime shrink-0" />
                                <h3 className="text-xs sm:text-sm font-mono font-bold tracking-widest text-white uppercase">
                                    {benefitsHeading}
                                </h3>
                            </div>

                            <div className="space-y-2 pt-1">
                                {benefits.map((benefit: string, bIdx: number) => (
                                    <div
                                        key={bIdx}
                                        className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-ftx-lime shrink-0 mt-0.5" />
                                        <span className="font-body leading-relaxed">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer: Book This Service CTA */}
                <div className="shrink-0 px-5 sm:px-7 py-3.5 sm:py-4 border-t border-white/10 bg-black/60 flex items-center justify-between gap-4">
                    <Link
                        href={`/${locale}/contact?service=${encodeURIComponent(service.serviceId || service.id || "")}#quote-form`}
                        onClick={onClose}
                        className="ftx-btn-tech ftx-btn-specular w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs font-mono font-bold tracking-wider uppercase text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright shadow-lime-glow transition-all active:scale-98"
                    >
                        <span>{isAr ? "حجز الخدمة / طلب عرض سعر" : "BOOK THIS SERVICE / GET QUOTE"}</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
