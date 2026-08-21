export type MediaTypeFilter = "all" | "image" | "video";
export type GalleryCategory = "all" | "ppf" | "ceramic" | "detailing" | "before-after";

export interface GalleryItem {
    id: string;
    title: Record<"en" | "ar", string>;
    category: "ppf" | "ceramic" | "detailing" | "before-after" | "video";
    vehicle: string | Record<"en" | "ar", string>;
    image: string;
    video?: string;
    isVideo?: boolean;
    beforeImage?: string;
    afterImage?: string;
    description: Record<"en" | "ar", string>;
    tags: string[];
}
