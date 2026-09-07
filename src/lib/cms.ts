import { connectToDatabase } from "./db";
import { seedDatabase } from "./seed";
import { ServiceItemModel } from "./models/ServiceItem";
import { PackageItemModel } from "./models/PackageItem";
import { GalleryItemModel } from "./models/GalleryItem";
import { TestimonialItemModel } from "./models/TestimonialItem";
import { PageSection } from "./models/PageSection";

import { servicesData as fallbackServices } from "@/data/services";
import { packagesData as fallbackPackages } from "@/data/packages";
import { galleryData as fallbackGallery } from "@/data/gallery";
import { testimonialsData as fallbackTestimonials } from "@/data/testimonials";
import { getSectionsForPage } from "./sections";

const CACHE_TTL_MS = 60 * 1000; // 60 seconds

interface MemoryCache<T> {
    data: T;
    timestamp: number;
}

let servicesCache: MemoryCache<any[]> | null = null;
let packagesCache: MemoryCache<any[]> | null = null;
let galleryCache: MemoryCache<any[]> | null = null;
let testimonialsCache: MemoryCache<any[]> | null = null;

export function invalidateCmsCache(type?: "services" | "packages" | "gallery" | "testimonials") {
    if (!type || type === "services") servicesCache = null;
    if (!type || type === "packages") packagesCache = null;
    if (!type || type === "gallery") galleryCache = null;
    if (!type || type === "testimonials") testimonialsCache = null;
}

export async function getCmsServices() {
    const now = Date.now();
    if (servicesCache && now - servicesCache.timestamp < CACHE_TTL_MS) {
        return servicesCache.data;
    }

    try {
        await connectToDatabase();
        let services = await ServiceItemModel.find().sort({ number: 1, serviceId: 1 }).lean();
        
        // Only seed if the database is truly empty
        if (!services || services.length === 0) {
            await seedDatabase();
            services = await ServiceItemModel.find().sort({ number: 1, serviceId: 1 }).lean();
        }

        if (services && services.length > 0) {
            const plainServices = JSON.parse(JSON.stringify(services));
            const mapped = plainServices.map((s: any) => ({
                ...s,
                id: s.serviceId || s._id,
            }));
            const result = mapped.sort((a: any, b: any) => {
                const numA = parseInt(a.number || "99", 10);
                const numB = parseInt(b.number || "99", 10);
                return numA - numB;
            });
            servicesCache = { data: result, timestamp: now };
            return result;
        }
    } catch (e) {
        console.error("getCmsServices error:", e);
    }
    return fallbackServices;
}

export async function getCmsPackages() {
    const now = Date.now();
    if (packagesCache && now - packagesCache.timestamp < CACHE_TTL_MS) {
        return packagesCache.data;
    }

    try {
        await connectToDatabase();
        let pkgs = await PackageItemModel.find().lean();

        if (!pkgs || pkgs.length === 0) {
            await seedDatabase();
            pkgs = await PackageItemModel.find().lean();
        }

        if (pkgs && pkgs.length > 0) {
            const plainPkgs = JSON.parse(JSON.stringify(pkgs));
            const result = plainPkgs.map((p: any) => ({
                ...p,
                id: p.packageId || p._id,
            }));
            packagesCache = { data: result, timestamp: now };
            return result;
        }
    } catch (e) {
        console.error("getCmsPackages error:", e);
    }
    return fallbackPackages;
}

export async function getCmsGallery() {
    const now = Date.now();
    if (galleryCache && now - galleryCache.timestamp < CACHE_TTL_MS) {
        return galleryCache.data;
    }

    try {
        await connectToDatabase();
        let items = await GalleryItemModel.find().lean();

        if (!items || items.length === 0) {
            await seedDatabase();
            items = await GalleryItemModel.find().lean();
        }

        if (items && items.length > 0) {
            const plainItems = JSON.parse(JSON.stringify(items));
            const result = plainItems.map((g: any) => ({
                ...g,
                id: g.itemId || g._id,
            }));
            galleryCache = { data: result, timestamp: now };
            return result;
        }
    } catch (e) {
        console.error("getCmsGallery error:", e);
    }
    return fallbackGallery;
}

export async function getCmsTestimonials() {
    const now = Date.now();
    if (testimonialsCache && now - testimonialsCache.timestamp < CACHE_TTL_MS) {
        return testimonialsCache.data;
    }

    try {
        await connectToDatabase();
        let items = await TestimonialItemModel.find().lean();

        if (!items || items.length === 0) {
            await seedDatabase();
            items = await TestimonialItemModel.find().lean();
        }

        if (items && items.length > 0) {
            const plainItems = JSON.parse(JSON.stringify(items));
            const result = plainItems.map((t: any) => ({
                ...t,
                id: t.testimonialId || t._id,
            }));
            testimonialsCache = { data: result, timestamp: now };
            return result;
        }
    } catch (e) {
        console.error("getCmsTestimonials error:", e);
    }
    return fallbackTestimonials;
}

export async function getCmsPageSection(page: string, sectionKey: string) {
    try {
        const sections = await getSectionsForPage(page);
        const sec = sections.find((s: any) => s.sectionKey === sectionKey);
        if (sec) return sec;
    } catch (e) {
        console.error("getCmsPageSection error:", e);
    }
    return null;
}
