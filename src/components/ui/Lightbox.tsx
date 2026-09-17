"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Info, Volume2, VolumeX, Play, Pause, Maximize } from "lucide-react";
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

const getItemId = (i: any) => i?._id || i?.itemId || i?.id || i?.image || "";

const getLocalizedText = (text: any, locale: Locale): string => {
    if (!text) return "";
    if (typeof text === "string") return text;
    return text[locale] || text.en || text.ar || "";
};

const getItemImage = (item: any): string => {
    const img = item?.image;
    if (img && typeof img === "string" && !img.endsWith(".mp4") && !img.endsWith(".webm") && !img.startsWith("blob:") && img.trim().length > 0) {
        if (img.includes("ppf-studio-hero.jpg")) return "/images/gallery/gt3rs-ppf.jpg";
        return img;
    }
    return "/images/gallery/gt3rs-ppf.jpg";
};

const getItemVideo = (item: any): string => {
    if (item?.video && typeof item.video === "string" && item.video.trim().length > 0) {
        return item.video;
    }
    return "";
};

const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export function Lightbox({ item, locale, onClose, onPrev, onNext }: LightboxProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [slideState, setSlideState] = useState<"idle" | "exiting">("idle");
    const [displayItem, setDisplayItem] = useState<GalleryItem | null>(item);
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const triggerControls = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3500);
        }
    };

    useEffect(() => {
        if (!isPlaying) {
            setShowControls(true);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        } else {
            triggerControls();
        }
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [isPlaying, displayItem]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX.current;
        const deltaY = touchEndY - touchStartY.current;

        // Minimum swipe distance threshold of 40px and horizontal dominance check
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                // Swiped Left
                if (locale === "ar") {
                    if (onPrev) handlePrev();
                } else {
                    if (onNext) handleNext();
                }
            } else {
                // Swiped Right
                if (locale === "ar") {
                    if (onNext) handleNext();
                } else {
                    if (onPrev) handlePrev();
                }
            }
        }

        touchStartX.current = null;
        touchStartY.current = null;
    };

    useEffect(() => {
        setIsMounted(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore key events if focused on input/textarea elements
            if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
                return;
            }

            if (e.key === "Escape") {
                handleClose();
            } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                e.preventDefault();
                if (locale === "ar") {
                    if (onNext) handleNext();
                } else {
                    if (onPrev) handlePrev();
                }
            } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                e.preventDefault();
                if (locale === "ar") {
                    if (onPrev) handlePrev();
                } else {
                    if (onNext) handleNext();
                }
            }
        };

        if (item) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [item, locale, onClose, onPrev, onNext, slideState]);

    // Synchronize displayItem whenever item prop changes
    useEffect(() => {
        if (!item) return;
        setDisplayItem(item);
        setSlideState("idle");
        setIsPlaying(true);
        setCurrentTime(0);
    }, [item]);

    // Handle unmuting video on mount/load
    useEffect(() => {
        const videoSrc = getItemVideo(displayItem);
        if (videoRef.current && videoSrc) {
            videoRef.current.muted = isMuted;
            videoRef.current.volume = 1.0;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => setIsPlaying(true)).catch(() => {
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        setIsMuted(true);
                        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
                    }
                });
            }
        }
    }, [displayItem ? getItemId(displayItem) : null, isMuted]);

    const toggleAudio = () => {
        if (videoRef.current) {
            const nextMutedState = !isMuted;
            videoRef.current.muted = nextMutedState;
            videoRef.current.volume = 1.0;
            setIsMuted(nextMutedState);
            if (nextMutedState === false) {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
            }
        }
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setCurrentTime(val);
        if (videoRef.current) {
            videoRef.current.currentTime = val;
        }
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        } else {
            videoRef.current.requestFullscreen().catch(() => { });
        }
    };

    if (!item || !displayItem || !isMounted) return null;

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
        }, 150);
    };

    const handleNext = () => {
        if (!onNext || slideState === "exiting") return;
        setDirection("next");
        setSlideState("exiting");
        setTimeout(() => {
            onNext();
        }, 150);
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

    const videoSrc = getItemVideo(displayItem);
    const imageSrc = getItemImage(displayItem);
    const isVideo = Boolean(videoSrc || displayItem.isVideo);
    const titleText = getLocalizedText(displayItem.title, locale);
    const descText = getLocalizedText(displayItem.description, locale);
    const vehicleText = getVehicleLabel(displayItem.vehicle, locale);
    const tags = Array.isArray(displayItem.tags) ? displayItem.tags : [];

    // Dynamic Media Max-Height to keep controls & details panel 100% visible on all viewports
    const mediaMaxHeightClass = showDetails
        ? "max-h-[42vh] sm:max-h-[46vh]"
        : "max-h-[68vh] sm:max-h-[72vh]";

    return createPortal(
        <div
            className={`fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 pt-24 sm:pt-28 transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${isClosing
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
                    {vehicleText}
                </div>

                {/* Top Right Action Controls: Info (i) + Close (X) */}
                <div className={`flex items-center gap-2 transition-all duration-300 ${isClosing ? "opacity-0 translate-y-[-10px]" : ""}`}>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className={`p-2.5 border text-xs font-mono font-bold uppercase rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${showDetails
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
                        className="p-2.5 text-ftx-silver hover:text-ftx-lime bg-ftx-surface/90 hover:bg-ftx-surface-high border border-ftx-surface-high rounded-full transition-colors backdrop-blur-md shadow-lg cursor-pointer"
                        aria-label="Close image lightbox"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Max Viewport Full Image/Video Area with Embedded Navigation Controls */}
            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative w-full max-w-6xl flex-1 min-h-0 my-1 sm:my-2 flex items-center justify-center select-none touch-pan-y"
            >
                <div className={`relative w-full h-full ${mediaMaxHeightClass} flex items-center justify-center transition-all duration-300`}>
                    {isVideo && videoSrc ? (
                        <div
                            className={`relative max-w-full ${mediaMaxHeightClass} flex items-center justify-center group transition-all duration-300`}
                            onMouseMove={triggerControls}
                        >
                            <video
                                ref={videoRef}
                                key={getItemId(displayItem)}
                                src={videoSrc}
                                poster={imageSrc}
                                autoPlay
                                loop
                                playsInline
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                                onClick={() => {
                                    togglePlay();
                                    triggerControls();
                                }}
                                className={`max-w-full ${mediaMaxHeightClass} w-auto h-auto object-contain ftx-squircle-xl shadow-2xl border border-ftx-surface-high/50 transition-all duration-300 cubic-bezier(0.16,1,0.3,1) cursor-pointer ${isClosing
                                    ? "scale-90 opacity-0"
                                    : !isMounted
                                        ? "scale-90 opacity-0"
                                        : getSlideClass()
                                    }`}
                            />

                            {/* Floating Tech Video Controls Bar */}
                            <div
                                dir="ltr"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    triggerControls();
                                }}
                                className={`absolute bottom-3 sm:bottom-4 left-0 right-0 mx-auto w-[92%] sm:w-[88%] max-w-xl z-50 bg-ftx-obsidian/95 border border-ftx-lime/50 backdrop-blur-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-2.5 text-white transition-opacity duration-300 ${showControls
                                    ? "opacity-100 pointer-events-auto"
                                    : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                                    }`}
                            >
                                {/* Play / Pause */}
                                <button
                                    onClick={togglePlay}
                                    className="p-1.5 text-ftx-silver hover:text-ftx-lime transition-colors cursor-pointer shrink-0"
                                    title={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                                </button>

                                {/* Time Counter */}
                                <span className="text-[10px] sm:text-[11px] font-mono text-ftx-silver shrink-0 tabular-nums select-none">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>

                                {/* Progress Bar / Seek Slider */}
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 100}
                                    step={0.1}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full accent-ftx-lime h-1.5 bg-ftx-surface-high rounded-lg cursor-pointer min-w-[40px]"
                                />

                                {/* Audio Mute/Unmute */}
                                <button
                                    onClick={toggleAudio}
                                    className="p-1.5 text-ftx-silver hover:text-ftx-lime transition-colors cursor-pointer shrink-0"
                                    title={isMuted ? "Unmute" : "Mute"}
                                >
                                    {!isMuted ? <Volume2 className="w-4 h-4 text-ftx-lime" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                                </button>

                                {/* Fullscreen */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-1.5 text-ftx-silver hover:text-ftx-lime transition-colors cursor-pointer shrink-0"
                                    title="Fullscreen"
                                >
                                    <Maximize className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <img
                            key={getItemId(displayItem)}
                            src={imageSrc}
                            alt={titleText}
                            className={`max-w-full ${mediaMaxHeightClass} w-auto h-auto object-contain ftx-squircle-xl shadow-2xl border border-ftx-surface-high/50 transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${isClosing
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
                            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 text-white hover:text-ftx-lime bg-black/15 hover:bg-black/40 sm:bg-ftx-surface/85 sm:hover:bg-ftx-surface-high border border-white/15 sm:border-ftx-surface-high rounded-full transition-all shadow-lg backdrop-blur-sm sm:backdrop-blur-md active:scale-95 cursor-pointer ${isClosing ? "opacity-0 scale-90" : ""}`}
                            aria-label="Previous vehicle"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    )}

                    {/* Next Control Aligned Perfectly to Image Center */}
                    {onNext && (
                        <button
                            onClick={handleNext}
                            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 text-white hover:text-ftx-lime bg-black/15 hover:bg-black/40 sm:bg-ftx-surface/85 sm:hover:bg-ftx-surface-high border border-white/15 sm:border-ftx-surface-high rounded-full transition-all shadow-lg backdrop-blur-sm sm:backdrop-blur-md active:scale-95 cursor-pointer ${isClosing ? "opacity-0 scale-90" : ""}`}
                            aria-label="Next vehicle"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Collapsible Info Drawer Overlay with Synchronized Smooth Transitions */}
            <div
                className={`w-full max-w-4xl z-30 overflow-hidden transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${showDetails && !isClosing
                    ? "max-h-[220px] opacity-100 translate-y-0 mb-1 sm:mb-2"
                    : "max-h-0 opacity-0 translate-y-4 pointer-events-none mb-0"
                    }`}
            >
                <div className={`p-4 sm:p-5 bg-ftx-surface/95 border border-ftx-surface-high ftx-squircle-lg shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-300 ${getDetailsSlideClass()}`}>
                    <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            {vehicleText}
                        </span>
                        <h3 className="text-base sm:text-lg font-heading font-bold text-white uppercase">
                            {titleText}
                        </h3>
                        <p className="text-xs text-ftx-silver-muted max-w-xl font-body leading-relaxed">
                            {descText}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                        {tags.map((tag: string) => (
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
        </div>,
        document.body
    );
}
