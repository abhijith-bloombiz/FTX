export type GalleryCategory = "all" | "ppf" | "ceramic" | "detailing" | "before-after";

export interface GalleryItem {
    id: string;
    title: Record<"en" | "ar", string>;
    category: "ppf" | "ceramic" | "detailing" | "before-after";
    vehicle: string;
    image: string;
    beforeImage?: string;
    afterImage?: string;
    description: Record<"en" | "ar", string>;
    tags: string[];
}
