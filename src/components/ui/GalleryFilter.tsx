"use client";

import { useState, useRef, useEffect } from "react";
import { LayoutGrid, List, Filter, ChevronDown } from "lucide-react";
import { GalleryCategory } from "@/types/gallery";

interface GalleryFilterProps {
    categories: { id: GalleryCategory; label: string }[];
    activeCategory: GalleryCategory;
    onSelectCategory: (category: GalleryCategory) => void;
    layoutMode?: "grid" | "list";
    onLayoutChange?: (mode: "grid" | "list") => void;
}

export function GalleryFilter({
    categories,
    activeCategory,
    onSelectCategory,
    layoutMode = "grid",
    onLayoutChange,
}: GalleryFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeCatObj = categories.find((cat) => cat.id === activeCategory);

    // Close mobile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-row items-center justify-between gap-4 py-4 border-b border-ftx-surface-high/50 mb-8 relative">
            {/* Mobile Filter Button (sm:hidden) - Only Single Filter Icon */}
            <div ref={dropdownRef} className="sm:hidden relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-2.5 ftx-btn-tech shadow-xl transition-all duration-200 flex items-center justify-center ${isOpen || activeCategory !== "all"
                        ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-bold"
                        : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                        }`}
                    title="Filter Gallery"
                >
                    <Filter className="w-4 h-4" />
                </button>

                <div
                    className={`absolute left-0 top-full mt-2 z-50 min-w-[200px] bg-ftx-surface/95 backdrop-blur-md border border-ftx-surface-high ftx-squircle-lg p-2 shadow-2xl space-y-1.5 ftx-dropdown-anim origin-top-left ${isOpen
                        ? "opacity-100 scale-100 translate-y-0 duration-250 pointer-events-auto"
                        : "opacity-0 scale-[0.96] -translate-y-2 duration-200 pointer-events-none"
                        }`}
                >
                    {categories.map((cat, idx) => {
                        const isActive = activeCategory === cat.id;
                        const delay = isOpen ? idx * 45 : (categories.length - 1 - idx) * 35;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    onSelectCategory(cat.id);
                                    setIsOpen(false);
                                }}
                                style={{ transitionDelay: `${delay}ms` }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech ftx-dropdown-anim flex items-center justify-between ${isOpen
                                    ? "opacity-100 translate-x-0 duration-250"
                                    : "opacity-0 -translate-x-2.5 duration-200 pointer-events-none"
                                    } ${isActive
                                        ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-black"
                                        : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                    }`}
                            >
                                <span>{cat.label}</span>
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ftx-black" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Category Filter Tabs (hidden sm:flex) */}
            <div className="hidden sm:flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 border ${isActive
                                ? "bg-ftx-lime text-ftx-black border-ftx-lime shadow-lime-glow"
                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border-ftx-surface-high"
                                }`}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Right Side Layout Switcher */}
            {onLayoutChange && (
                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-[10px] font-mono font-bold text-ftx-silver uppercase tracking-widest">
                        LAYOUT
                    </span>
                    <div className="flex items-center gap-1 p-1 bg-ftx-surface border border-ftx-surface-high ftx-squircle-sm">
                        <button
                            onClick={() => onLayoutChange("grid")}
                            className={`p-1.5 rounded transition-colors ${layoutMode === "grid"
                                ? "bg-ftx-lime text-ftx-black"
                                : "text-ftx-silver hover:text-white"
                                }`}
                            title="Grid Layout"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onLayoutChange("list")}
                            className={`p-1.5 rounded transition-colors ${layoutMode === "list"
                                ? "bg-ftx-lime text-ftx-black"
                                : "text-ftx-silver hover:text-white"
                                }`}
                            title="List Layout"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
