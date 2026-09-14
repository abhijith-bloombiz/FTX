import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://firsttorquex.com";
    const locales = ["en", "ar"];
    const routes = ["", "/about", "/services", "/packages", "/gallery", "/contact"];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    locales.forEach((locale) => {
        routes.forEach((route) => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: route === "" ? "daily" : "weekly",
                priority: route === "" ? 1.0 : 0.8,
            });
        });
    });

    return sitemapEntries;
}
