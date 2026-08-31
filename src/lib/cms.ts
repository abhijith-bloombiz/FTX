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

export async function getCmsServices() {
    try {
        await connectToDatabase();
        await seedDatabase();
        const services = await ServiceItemModel.find().lean();
        if (services && services.length > 0) {
            return services.map((s) => ({
                ...s,
                id: s.serviceId || (s._id as any).toString(),
            }));
        }
    } catch (e) {
        console.error("getCmsServices error:", e);
    }
    return fallbackServices;
}

export async function getCmsPackages() {
    try {
        await connectToDatabase();
        await seedDatabase();
        const pkgs = await PackageItemModel.find().lean();
        if (pkgs && pkgs.length > 0) {
            return pkgs.map((p) => ({
                ...p,
                id: p.packageId || (p._id as any).toString(),
            }));
        }
    } catch (e) {
        console.error("getCmsPackages error:", e);
    }
    return fallbackPackages;
}

export async function getCmsGallery() {
    try {
        await connectToDatabase();
        await seedDatabase();
        const items = await GalleryItemModel.find().lean();
        if (items && items.length > 0) {
            return items.map((g) => ({
                ...g,
                id: g.itemId || (g._id as any).toString(),
            }));
        }
    } catch (e) {
        console.error("getCmsGallery error:", e);
    }
    return fallbackGallery;
}

export async function getCmsTestimonials() {
    try {
        await connectToDatabase();
        await seedDatabase();
        const items = await TestimonialItemModel.find().lean();
        if (items && items.length > 0) {
            return items.map((t) => ({
                ...t,
                id: t.testimonialId || (t._id as any).toString(),
            }));
        }
    } catch (e) {
        console.error("getCmsTestimonials error:", e);
    }
    return fallbackTestimonials;
}

export async function getCmsPageSection(page: string, sectionKey: string) {
    try {
        await connectToDatabase();
        await seedDatabase();
        const sec = await PageSection.findOne({ page, sectionKey }).lean();
        if (sec) return sec;
    } catch (e) {
        console.error("getCmsPageSection error:", e);
    }
    return null;
}
