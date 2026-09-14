import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://firsttorquex.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
                "/vendor/",
                "/admin",
                "/admin/",
                "/*/admin",
                "/*/admin/",
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
