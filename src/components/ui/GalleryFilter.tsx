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
    Tag
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
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const formatDropdownRef = useRef<HTMLDivElement>(null);

    // Close mobile dropdowns when clicking outside
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
        <div className="py-4 border-b border-ftx-surface-high/50 mb-8 space-y-4">
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
                            className={`absolute ltr:left-0 rtl:right-0 top-full mt-2 z-50 min-w-[200px] bg-ftx-surface/95 backdrop-blur-md border border-ftx-surface-high ftx-squircle-lg p-2 shadow-2xl space-y-1.5 ftx-dropdown-anim ltr:origin-top-left rtl:origin-top-right ${categoryOpen
                                ? "opacity-100 scale-100 translate-y-0 duration-250 pointer-events-auto"
                                : "opacity-0 scale-[0.96] -translate-y-2 duration-200 pointer-events-none"
                                }`}
                        >
                            {categories.map((cat) => {
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            onSelectCategory(cat.id);
                                            setCategoryOpen(false);
                                        }}
                                        className={`w-full text-left rtl:text-right px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech flex items-center justify-between ${isActive
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
                            className={`absolute ltr:left-0 rtl:right-0 top-full mt-2 z-50 min-w-[180px] bg-ftx-surface/95 backdrop-blur-md border border-ftx-surface-high ftx-squircle-lg p-2 shadow-2xl space-y-1.5 ftx-dropdown-anim ltr:origin-top-left rtl:origin-top-right ${formatOpen
                                ? "opacity-100 scale-100 translate-y-0 duration-250 pointer-events-auto"
                                : "opacity-0 scale-[0.96] -translate-y-2 duration-200 pointer-events-none"
                                }`}
                        >
                            {mediaTypes.map((media) => {
                                const isActive = activeMediaType === media.id;
                                return (
                                    <button
                                        key={media.id}
                                        onClick={() => {
                                            onSelectMediaType(media.id);
                                            setFormatOpen(false);
                                        }}
                                        className={`w-full text-left rtl:text-right px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech flex items-center justify-between ${isActive
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

            {/* Desktop Layout (hidden sm:block): Top Row Category Filter + Layout Switcher, Bottom Row Media Format Filter SECOND */}
            <div className="hidden sm:block space-y-4">
                {/* Top Row: Category Filter Tabs FIRST + Layout Switcher */}
                <div className="flex items-center justify-between gap-4">
                    {/* 1. Category Filter Tabs (FIRST) */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-ftx-lime text-xs font-mono font-bold uppercase tracking-wider mr-1" title="Category Filter">
                            <Filter className="w-3.5 h-3.5" />
                        </div>
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => onSelectCategory(cat.id)}
                                    title={cat.label}
                                    className={`px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 border flex items-center gap-2 ${isActive
                                        ? "bg-ftx-lime text-ftx-black border-ftx-lime shadow-lime-glow"
                                        : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border-ftx-surface-high"
                                        }`}
                                >
                                    {getCategoryIcon(cat.id)}
                                    <span>{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Smooth Animated Layout Switcher (Desktop) */}
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

                {/* Bottom Row: Media Format Filter SECOND */}
                <div className="flex items-center gap-2 pt-2">
                    <div className="flex items-center gap-1.5 text-ftx-lime text-xs font-mono font-bold uppercase tracking-wider mr-1" title="Format Filter">
                        <Tag className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {mediaTypes.map((media) => {
                            const isActive = activeMediaType === media.id;
                            return (
                                <button
                                    key={media.id}
                                    onClick={() => onSelectMediaType(media.id)}
                                    title={media.label}
                                    className={`px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 border flex items-center gap-2 ${isActive
                                        ? "bg-ftx-lime text-ftx-black border-ftx-lime shadow-lime-glow"
                                        : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border-ftx-surface-high"
                                        }`}
                                >
                                    {getMediaIcon(media.id)}
                                    <span>{media.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
