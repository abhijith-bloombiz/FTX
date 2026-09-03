export interface ServiceProcessStep {
    number: string;
    title: Record<"en" | "ar", string>;
    description: Record<"en" | "ar", string>;
}

export interface ServiceHighlight {
    icon: "shield" | "refresh" | "droplet" | "sparkles" | "wand" | "car";
    title: Record<"en" | "ar", string>;
    description?: Record<"en" | "ar", string>;
}

export interface ServiceItem {
    id: "ppf" | "ceramic" | "detailing";
    number: string;
    badge?: Record<"en" | "ar", string>;
    title: Record<"en" | "ar", string>;
    subtitle?: Record<"en" | "ar", string>;
    description: Record<"en" | "ar", string>;
    benefits?: Record<"en" | "ar", string[]>;
    highlights?: ServiceHighlight[];
    process?: ServiceProcessStep[];
    image: string;
    detailImages: string[];
}
