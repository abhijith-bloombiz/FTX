export type MediaTypeFilter = "all" | "image" | "video";
export type GalleryCategory = string;

export interface GalleryItem {
    id: string;
    title: Record<"en" | "ar", string>;
    category: string;
    vehicle: string | Record<"en" | "ar", string>;
    image: string;
    video?: string;
    isVideo?: boolean;
    beforeImage?: string;
    afterImage?: string;
    description: Record<"en" | "ar", string>;
    tags: string[];
}
