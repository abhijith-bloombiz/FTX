"use client";

import { LayoutGrid, List } from "lucide-react";
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
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-ftx-surface-high/50 mb-8">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 ${isActive
                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow"
                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
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
