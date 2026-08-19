import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ftx.ae";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/vendor/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
