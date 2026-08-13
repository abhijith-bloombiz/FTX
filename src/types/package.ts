export type PackageCategory = "ppf" | "ceramic" | "detailing";

export interface PackageItem {
    id: string;
    category: PackageCategory;
    name: Record<"en" | "ar", string>;
    description: Record<"en" | "ar", string>;
    price: Record<"en" | "ar", string>;
    popular?: boolean;
    features: Record<"en" | "ar", string[]>;
    badge?: Record<"en" | "ar", string>;
}
