"use client";

import { useState, useRef, useEffect } from "react";
import {
    LayoutGrid,
    List,
    Filter,
    Image as ImageIcon,
    Video as VideoIcon,
    Layers,
    ShieldCheck,
    Sparkles,
    Wrench,
    Grid,
    Tag,
    ChevronDown
} from "lucide-react";
import { GalleryCategory, MediaTypeFilter } from "@/types/gallery";

interface GalleryFilterProps {
    mediaTypes: { id: MediaTypeFilter; label: string }[];
    activeMediaType: MediaTypeFilter;
    onSelectMediaType: (mediaType: MediaTypeFilter) => void;
    categories: { id: GalleryCategory; label: string }[];
    activeCategory: GalleryCategory;
    onSelectCategory: (category: GalleryCategory) => void;
    layoutMode?: "grid" | "list";
    onLayoutChange?: (mode: "grid" | "list") => void;
}

export function GalleryFilter({
    mediaTypes,
    activeMediaType,
    onSelectMediaType,
    categories,
    activeCategory,
    onSelectCategory,
    layoutMode = "grid",
    onLayoutChange,
}: GalleryFilterProps) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [formatOpen, setFormatOpen] = useState(false);
    const [desktopCategoryOpen, setDesktopCategoryOpen] = useState(false);
    const [desktopFormatOpen, setDesktopFormatOpen] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const formatDropdownRef = useRef<HTMLDivElement>(null);
    const desktopCategoryRef = useRef<HTMLDivElement>(null);
    const desktopFormatRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(event.target as Node)
            ) {
                setCategoryOpen(false);
            }
            if (
                formatDropdownRef.current &&
                !formatDropdownRef.current.contains(event.target as Node)
            ) {
                setFormatOpen(false);
            }
            if (
                desktopCategoryRef.current &&
                !desktopCategoryRef.current.contains(event.target as Node)
            ) {
                setDesktopCategoryOpen(false);
            }
            if (
                desktopFormatRef.current &&
                !desktopFormatRef.current.contains(event.target as Node)
            ) {
                setDesktopFormatOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getMediaIcon = (type: MediaTypeFilter) => {
        switch (type) {
            case "image":
                return <ImageIcon className="w-3.5 h-3.5" />;
            case "video":
                return <VideoIcon className="w-3.5 h-3.5" />;
            default:
                return <Layers className="w-3.5 h-3.5" />;
        }
    };

    const getCategoryIcon = (catId: GalleryCategory) => {
        switch (catId) {
            case "ppf":
                return <ShieldCheck className="w-3.5 h-3.5" />;
            case "ceramic":
                return <Sparkles className="w-3.5 h-3.5" />;
            case "detailing":
                return <Wrench className="w-3.5 h-3.5" />;
            default:
                return <Grid className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="py-4 sm:pt-2 sm:pb-4 border-b border-ftx-surface-high/50 mb-8 space-y-4">
            {/* Mobile Controls Row (sm:hidden): Category Filter FIRST, Media Format SECOND */}
            <div className="flex sm:hidden items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    {/* 1. Category Single Icon Button (FIRST) */}
                    <div ref={categoryDropdownRef} className="relative">
                        <button
                            onClick={() => {
                                setCategoryOpen(!categoryOpen);
                                setFormatOpen(false);
                            }}
                            className={`p-2.5 ftx-btn-tech shadow-xl transition-all duration-200 flex items-center justify-center ${categoryOpen || activeCategory !== "all"
                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-bold"
                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                }`}
                            title="Filter Category"
                        >
                            <Filter className="w-4 h-4" />
                        </button>

                        <div
                            className={`absolute ltr:left-0 rtl:right-0 top-full mt-2 z-50 min-w-[200px] bg-ftx-surface/95 backdrop-blur-xl border border-ftx-surface-high/80 ftx-squircle-lg p-1.5 shadow-2xl space-y-1 ltr:origin-top-left rtl:origin-top-right transform-gpu transition-all duration-150 ease-out ${categoryOpen
                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                                }`}
                        >
                            {categories.map((cat, idx) => {
                                const isActive = activeCategory === cat.id;
                                const delay = categoryOpen ? idx * 40 : (categories.length - 1 - idx) * 25;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            onSelectCategory(cat.id);
                                            setCategoryOpen(false);
                                        }}
                                        style={{ transitionDelay: `${delay}ms` }}
                                        className={`w-full text-left rtl:text-right px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech flex items-center justify-between transition-all duration-200 ease-out transform-gpu ${categoryOpen
                                            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                            : "opacity-0 -translate-y-1.5 scale-95 pointer-events-none"
                                            } ${isActive
                                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-black"
                                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {getCategoryIcon(cat.id)}
                                            <span>{cat.label}</span>
                                        </span>
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ftx-black" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. Format Single Icon Button (SECOND) */}
                    <div ref={formatDropdownRef} className="relative">
                        <button
                            onClick={() => {
                                setFormatOpen(!formatOpen);
                                setCategoryOpen(false);
                            }}
                            className={`p-2.5 ftx-btn-tech shadow-xl transition-all duration-200 flex items-center justify-center ${formatOpen || activeMediaType !== "all"
                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-bold"
                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                }`}
                            title="Filter Media Format"
                        >
                            <Tag className="w-4 h-4" />
                        </button>

                        <div
                            className={`absolute ltr:left-0 rtl:right-0 top-full mt-2 z-50 min-w-[180px] bg-ftx-surface/95 backdrop-blur-xl border border-ftx-surface-high/80 ftx-squircle-lg p-1.5 shadow-2xl space-y-1 ltr:origin-top-left rtl:origin-top-right transform-gpu transition-all duration-150 ease-out ${formatOpen
                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                                }`}
                        >
                            {mediaTypes.map((media, idx) => {
                                const isActive = activeMediaType === media.id;
                                const delay = formatOpen ? idx * 40 : (mediaTypes.length - 1 - idx) * 25;

                                return (
                                    <button
                                        key={media.id}
                                        onClick={() => {
                                            onSelectMediaType(media.id);
                                            setFormatOpen(false);
                                        }}
                                        style={{ transitionDelay: `${delay}ms` }}
                                        className={`w-full text-left rtl:text-right px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech flex items-center justify-between transition-all duration-200 ease-out transform-gpu ${formatOpen
                                            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                            : "opacity-0 -translate-y-1.5 scale-95 pointer-events-none"
                                            } ${isActive
                                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-black"
                                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {getMediaIcon(media.id)}
                                            <span>{media.label}</span>
                                        </span>
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ftx-black" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Smooth Animated Layout Switcher (Mobile) */}
                {onLayoutChange && (
                    <div className="relative grid grid-cols-2 items-center p-1 bg-ftx-surface border border-ftx-surface-high ftx-squircle-sm w-[68px] [direction:ltr]">
                        {/* Smooth Active Sliding Pill */}
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-6px)] bg-ftx-lime rounded-md shadow-lime-glow transition-all duration-300 ease-out pointer-events-none ${layoutMode === "list" ? "left-[calc(50%+2px)]" : "left-1"
                                }`}
                        />
                        <button
                            onClick={() => onLayoutChange("grid")}
                            className={`relative z-10 p-1.5 flex items-center justify-center rounded transition-colors duration-200 ${layoutMode === "grid" ? "text-ftx-black font-bold" : "text-ftx-silver hover:text-white"
                                }`}
                            title="Grid Layout"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onLayoutChange("list")}
                            className={`relative z-10 p-1.5 flex items-center justify-center rounded transition-colors duration-200 ${layoutMode === "list" ? "text-ftx-black font-bold" : "text-ftx-silver hover:text-white"
                                }`}
                            title="List Layout"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Desktop Layout (hidden sm:block): Category Dropdown + Media Format Dropdown + Layout Switcher */}
            <div className="hidden sm:flex items-center justify-between gap-4">
                {/* Left Side: Filter Dropdown Buttons */}
                <div className="flex items-center gap-3">
                    {/* 1. Category Dropdown Button */}
                    <div ref={desktopCategoryRef} className="relative">
                        <button
                            onClick={() => {
                                setDesktopCategoryOpen(!desktopCategoryOpen);
                                setDesktopFormatOpen(false);
                            }}
                            className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 border flex items-center gap-2.5 ${desktopCategoryOpen || activeCategory !== "all"
                                ? "bg-ftx-lime text-ftx-black border-ftx-lime shadow-lime-glow"
                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border-ftx-surface-high"
                                }`}
                        >
                            {getCategoryIcon(activeCategory)}
                            <span>{categories.find((c) => c.id === activeCategory)?.label || "CATEGORY"}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${desktopCategoryOpen ? "rotate-180" : ""}`} />
                        </button>

                        <div
                            className={`absolute ltr:left-0 rtl:right-0 top-full mt-2 z-50 min-w-[210px] bg-ftx-surface/95 backdrop-blur-xl border border-ftx-surface-high/80 ftx-squircle-lg p-1.5 shadow-2xl space-y-1 ltr:origin-top-left rtl:origin-top-right transform-gpu transition-all duration-150 ease-out ${desktopCategoryOpen
                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                                }`}
                        >
                            {categories.map((cat, idx) => {
                                const isActive = activeCategory === cat.id;
                                const delay = desktopCategoryOpen ? idx * 40 : (categories.length - 1 - idx) * 25;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            onSelectCategory(cat.id);
                                            setDesktopCategoryOpen(false);
                                        }}
                                        style={{ transitionDelay: `${delay}ms` }}
                                        className={`w-full text-left rtl:text-right px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech flex items-center justify-between transition-all duration-200 ease-out transform-gpu ${desktopCategoryOpen
                                            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                            : "opacity-0 -translate-y-1.5 scale-95 pointer-events-none"
                                            } ${isActive
                                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-black"
                                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {getCategoryIcon(cat.id)}
                                            <span>{cat.label}</span>
                                        </span>
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ftx-black" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. Media Format Dropdown Button */}
                    <div ref={desktopFormatRef} className="relative">
                        <button
                            onClick={() => {
                                setDesktopFormatOpen(!desktopFormatOpen);
                                setDesktopCategoryOpen(false);
                            }}
                            className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 border flex items-center gap-2.5 ${desktopFormatOpen || activeMediaType !== "all"
                                ? "bg-ftx-lime text-ftx-black border-ftx-lime shadow-lime-glow"
                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                }`}
                        >
                            {getMediaIcon(activeMediaType)}
                            <span>{mediaTypes.find((m) => m.id === activeMediaType)?.label || "FORMAT"}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${desktopFormatOpen ? "rotate-180" : ""}`} />
                        </button>

                        <div
                            className={`absolute ltr:left-0 rtl:right-0 top-full mt-2 z-50 min-w-[190px] bg-ftx-surface/95 backdrop-blur-xl border border-ftx-surface-high/80 ftx-squircle-lg p-1.5 shadow-2xl space-y-1 ltr:origin-top-left rtl:origin-top-right transform-gpu transition-all duration-150 ease-out ${desktopFormatOpen
                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                                }`}
                        >
                            {mediaTypes.map((media, idx) => {
                                const isActive = activeMediaType === media.id;
                                const delay = desktopFormatOpen ? idx * 40 : (mediaTypes.length - 1 - idx) * 25;

                                return (
                                    <button
                                        key={media.id}
                                        onClick={() => {
                                            onSelectMediaType(media.id);
                                            setDesktopFormatOpen(false);
                                        }}
                                        style={{ transitionDelay: `${delay}ms` }}
                                        className={`w-full text-left rtl:text-right px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech flex items-center justify-between transition-all duration-200 ease-out transform-gpu ${desktopFormatOpen
                                            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                            : "opacity-0 -translate-y-1.5 scale-95 pointer-events-none"
                                            } ${isActive
                                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-black"
                                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {getMediaIcon(media.id)}
                                            <span>{media.label}</span>
                                        </span>
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ftx-black" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Side: Smooth Animated Layout Switcher (Desktop) */}
                {onLayoutChange && (
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-ftx-silver uppercase tracking-widest">
                            LAYOUT
                        </span>
                        <div className="relative grid grid-cols-2 items-center p-1 bg-ftx-surface border border-ftx-surface-high ftx-squircle-sm w-[68px] [direction:ltr]">
                            {/* Smooth Active Sliding Pill */}
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-6px)] bg-ftx-lime rounded-md shadow-lime-glow transition-all duration-300 ease-out pointer-events-none ${layoutMode === "list" ? "left-[calc(50%+2px)]" : "left-1"
                                    }`}
                            />
                            <button
                                onClick={() => onLayoutChange("grid")}
                                className={`relative z-10 p-1.5 flex items-center justify-center rounded transition-colors duration-200 ${layoutMode === "grid" ? "text-ftx-black font-bold" : "text-ftx-silver hover:text-white"
                                    }`}
                                title="Grid Layout"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onLayoutChange("list")}
                                className={`relative z-10 p-1.5 flex items-center justify-center rounded transition-colors duration-200 ${layoutMode === "list" ? "text-ftx-black font-bold" : "text-ftx-silver hover:text-white"
                                    }`}
                                title="List Layout"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
