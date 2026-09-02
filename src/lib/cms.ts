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
            const plainServices = JSON.parse(JSON.stringify(services));
            return plainServices.map((s: any) => ({
                ...s,
                id: s.serviceId || s._id,
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
            const plainPkgs = JSON.parse(JSON.stringify(pkgs));
            return plainPkgs.map((p: any) => ({
                ...p,
                id: p.packageId || p._id,
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
            const plainItems = JSON.parse(JSON.stringify(items));
            return plainItems.map((g: any) => ({
                ...g,
                id: g.itemId || g._id,
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
            const plainItems = JSON.parse(JSON.stringify(items));
            return plainItems.map((t: any) => ({
                ...t,
                id: t.testimonialId || t._id,
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
        if (sec) return JSON.parse(JSON.stringify(sec));
    } catch (e) {
        console.error("getCmsPageSection error:", e);
    }
    return null;
}
