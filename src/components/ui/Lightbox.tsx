"use client";

import { useEffect, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Info, Volume2, VolumeX } from "lucide-react";
import { GalleryItem } from "@/types/gallery";
import { Locale } from "@/i18n/config";
import { getVehicleLabel } from "@/data/gallery";

interface LightboxProps {
    item: GalleryItem | null;
    locale: Locale;
    onClose: () => void;
    onPrev?: () => void;
    onNext?: () => void;
}

export function Lightbox({ item, locale, onClose, onPrev, onNext }: LightboxProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [slideState, setSlideState] = useState<"idle" | "exiting">("idle");
    const [displayItem, setDisplayItem] = useState<GalleryItem | null>(item);
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setIsMounted(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
            if (e.key === "ArrowLeft" && onPrev) handlePrev();
            if (e.key === "ArrowRight" && onNext) handleNext();
        };
        if (item) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [item, onClose, onPrev, onNext]);

    useEffect(() => {
        if (item && item.id !== displayItem?.id) {
            setSlideState("exiting");
            const timer = setTimeout(() => {
                setDisplayItem(item);
                setSlideState("idle");
            }, 180);
            return () => clearTimeout(timer);
        }
    }, [item?.id]);

    // Handle unmuting video on mount/load
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
            videoRef.current.volume = 1.0;
            // Attempt unmuted play
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Browser autoplay policy blocked unmuted audio, fallback to muted autoplay
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        setIsMuted(true);
                        videoRef.current.play().catch(() => { });
                    }
                });
            }
        }
    }, [displayItem?.id, isMuted]);

    const toggleAudio = () => {
        if (videoRef.current) {
            const nextMutedState = !isMuted;
            videoRef.current.muted = nextMutedState;
            videoRef.current.volume = 1.0;
            setIsMuted(nextMutedState);
            if (nextMutedState === false) {
                videoRef.current.play().catch(() => { });
            }
        }
    };

    if (!item || !displayItem) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 220);
    };

    const handlePrev = () => {
        if (!onPrev || slideState === "exiting") return;
        setDirection("prev");
        setSlideState("exiting");
        setTimeout(() => {
            onPrev();
        }, 180);
    };

    const handleNext = () => {
        if (!onNext || slideState === "exiting") return;
        setDirection("next");
        setSlideState("exiting");
        setTimeout(() => {
            onNext();
        }, 180);
    };

    const getSlideClass = () => {
        if (slideState === "exiting") {
            return direction === "next"
                ? "-translate-x-20 opacity-0 scale-95"
                : "translate-x-20 opacity-0 scale-95";
        }
        return "translate-x-0 opacity-100 scale-100";
    };

    const getDetailsSlideClass = () => {
        if (slideState === "exiting") {
            return direction === "next"
                ? "-translate-x-12 opacity-0"
                : "translate-x-12 opacity-0";
        }
        return "translate-x-0 opacity-100";
    };

    const isVideo = displayItem.video || displayItem.isVideo;

    return (
        <div
            className={`fixed inset-0 z-[99999] bg-black/50 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 pt-24 sm:pt-28 transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${isClosing
                ? "opacity-0 backdrop-blur-none pointer-events-none"
                : isMounted
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }`}
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            {/* Top Navigation & Controls Bar */}
            <div className="w-full flex items-center justify-between z-20 max-w-6xl">
                <div className={`px-3.5 py-1.5 bg-ftx-surface/80 border border-ftx-surface-high text-[10px] sm:text-xs font-mono font-bold text-ftx-lime uppercase tracking-widest rounded-full backdrop-blur-md shadow-md transition-all duration-300 ${isClosing ? "opacity-0 translate-y-[-10px]" : getDetailsSlideClass()}`}>
                    {getVehicleLabel(displayItem.vehicle, locale)}
                </div>

                {/* Top Right Action Controls: Sound Toggle + Info (i) + Close (X) */}
                <div className={`flex items-center gap-2 transition-all duration-300 ${isClosing ? "opacity-0 translate-y-[-10px]" : ""}`}>
                    {isVideo && (
                        <button
                            onClick={toggleAudio}
                            className={`px-3 py-2.5 border text-xs font-mono font-bold uppercase rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all duration-300 ${!isMuted
                                ? "bg-ftx-lime text-ftx-black border-ftx-lime scale-105 shadow-lime-glow"
                                : "bg-ftx-surface/90 hover:bg-ftx-surface-high border-ftx-surface-high text-ftx-silver hover:text-ftx-lime"
                                }`}
                            aria-label="Toggle video audio"
                            title={isMuted ? "Unmute Audio" : "Mute Audio"}
                        >
                            {!isMuted ? (
                                <>
                                    <Volume2 className="w-4 h-4" />
                                    <span className="text-[10px] hidden sm:inline">{locale === "ar" ? "الصوت مفعل" : "AUDIO ON"}</span>
                                </>
                            ) : (
                                <>
                                    <VolumeX className="w-4 h-4 text-rose-400" />
                                    <span className="text-[10px] hidden sm:inline text-rose-400">{locale === "ar" ? "الصوت مكتوم" : "MUTED"}</span>
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className={`p-2.5 border text-xs font-mono font-bold uppercase rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 ${showDetails
                            ? "bg-ftx-lime text-ftx-black border-ftx-lime scale-105 shadow-lime-glow"
                            : "bg-ftx-surface/90 hover:bg-ftx-surface-high border-ftx-surface-high text-ftx-silver hover:text-ftx-lime"
                            }`}
                        aria-label="Toggle vehicle details"
                        title="Project Details"
                    >
                        <Info className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleClose}
                        className="p-2.5 text-ftx-silver hover:text-ftx-lime bg-ftx-surface/90 hover:bg-ftx-surface-high border border-ftx-surface-high rounded-full transition-colors backdrop-blur-md shadow-lg"
                        aria-label="Close image lightbox"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Max Viewport Full Image/Video Area with Embedded Navigation Controls */}
            <div className="relative w-full max-w-6xl flex-1 my-2 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
                    {isVideo ? (
                        <video
                            ref={videoRef}
                            key={displayItem.id}
                            src={displayItem.video}
                            poster={displayItem.image}
                            autoPlay
                            loop
                            playsInline
                            controls
                            className={`max-w-full max-h-[70vh] w-auto h-auto object-contain ftx-squircle-xl shadow-2xl border border-ftx-surface-high/50 transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${isClosing
                                ? "scale-90 opacity-0"
                                : !isMounted
                                    ? "scale-90 opacity-0"
                                    : getSlideClass()
                                }`}
                        />
                    ) : (
                        <img
                            key={displayItem.id}
                            src={displayItem.image}
                            alt={displayItem.title[locale]}
                            className={`max-w-full max-h-[70vh] w-auto h-auto object-contain ftx-squircle-xl shadow-2xl border border-ftx-surface-high/50 transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${isClosing
                                ? "scale-90 opacity-0"
                                : !isMounted
                                    ? "scale-90 opacity-0"
                                    : getSlideClass()
                                }`}
                        />
                    )}

                    {/* Prev Control Aligned Perfectly to Image Center */}
                    {onPrev && (
                        <button
                            onClick={handlePrev}
                            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 text-ftx-silver hover:text-ftx-lime bg-ftx-surface/85 hover:bg-ftx-surface-high border border-ftx-surface-high rounded-full transition-all shadow-xl backdrop-blur-md active:scale-95 ${isClosing ? "opacity-0 scale-90" : ""}`}
                            aria-label="Previous vehicle"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    )}

                    {/* Next Control Aligned Perfectly to Image Center */}
                    {onNext && (
                        <button
                            onClick={handleNext}
                            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 text-ftx-silver hover:text-ftx-lime bg-ftx-surface/85 hover:bg-ftx-surface-high border border-ftx-surface-high rounded-full transition-all shadow-xl backdrop-blur-md active:scale-95 ${isClosing ? "opacity-0 scale-90" : ""}`}
                            aria-label="Next vehicle"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Collapsible Info Drawer Overlay with Synchronized Smooth Transitions */}
            <div
                className={`w-full max-w-4xl z-30 overflow-hidden transition-all duration-500 cubic-bezier(0.16,1,0.3,1) ${showDetails && !isClosing
                    ? "max-h-[300px] opacity-100 translate-y-0 mb-2"
                    : "max-h-0 opacity-0 translate-y-4 pointer-events-none mb-0"
                    }`}
            >
                <div className={`p-4 sm:p-6 bg-ftx-surface/95 border border-ftx-surface-high ftx-squircle-lg shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${getDetailsSlideClass()}`}>
                    <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            {getVehicleLabel(displayItem.vehicle, locale)}
                        </span>
                        <h3 className="text-base sm:text-lg font-heading font-bold text-white uppercase">
                            {displayItem.title[locale]}
                        </h3>
                        <p className="text-xs text-ftx-silver-muted max-w-xl font-body leading-relaxed">
                            {displayItem.description[locale]}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                        {displayItem.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 text-[10px] font-mono text-ftx-silver bg-ftx-obsidian border border-ftx-surface-high ftx-squircle-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
