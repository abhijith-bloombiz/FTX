import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "First Torque X",
    description: "Dubai's premier automotive protection studio specializing in Paint Protection Film (PPF), 9H+ Ceramic Coatings, Surgical Paint Correction, and Bespoke Car Detailing.",
    keywords: [
        "Paint Protection Film Dubai",
        "PPF Dubai",
        "Ceramic Coating Dubai",
        "Car Detailing Dubai",
        "Luxury Car Protection",
        "Paint Correction Dubai",
        "FTX",
        "First Torque X",
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ftx.ae"),
    alternates: {
        canonical: "/",
        languages: {
            "en": "/en",
            "ar": "/ar",
        },
    },
    openGraph: {
        title: "First Torque X",
        description: "Bespoke Paint Protection Film (PPF), Ceramic Coating & Surgical Detailing in Dubai.",
        url: "https://ftx.ae",
        siteName: "First Torque X",
        images: [
            {
                url: "/brand/ftx-3d-logo.webp",
                width: 1200,
                height: 630,
                alt: "First Torque X Automotive Protection Studio Dubai",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "First Torque X",
        description: "Bespoke Paint Protection Film (PPF), Ceramic Coating & Surgical Detailing in Dubai.",
        images: ["/brand/ftx-3d-logo.webp"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: [
            { url: "/brand/ftx-3d-logo.webp", type: "image/png" },
        ],
        shortcut: "/brand/ftx-3d-logo.webp",
        apple: "/brand/ftx-3d-logo.webp",
    },
};

export const viewport: Viewport = {
    themeColor: "#070707",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                {/* Preload initial critical 3D Hero car frames for instant zero-lag canvas rendering */}
                <link rel="preload" as="image" href="/video/frames/frame_0001.webp" type="image/webp" />
                <link rel="preload" as="image" href="/video/frames/frame_0002.webp" type="image/webp" />
                <link rel="preload" as="image" href="/video/frames/frame_0003.webp" type="image/webp" />
                <link rel="preload" as="image" href="/video/frames/frame_0004.webp" type="image/webp" />
                <link rel="preload" as="image" href="/video/frames/frame_0005.webp" type="image/webp" />
                <link rel="preload" as="image" href="/video/frames/frame_0006.webp" type="image/webp" />
                <link rel="preload" as="image" href="/video/frames/frame_0007.webp" type="image/webp" />
                <link rel="preload" as="image" href="/video/frames/frame_0008.webp" type="image/webp" />

                {/* Preload Navbar Menu Item SVG Text Images */}
                <link rel="preload" as="image" href="/fonts/nav/home.svg" type="image/svg+xml" />
                <link rel="preload" as="image" href="/fonts/nav/about.svg" type="image/svg+xml" />
                <link rel="preload" as="image" href="/fonts/nav/services.svg" type="image/svg+xml" />
                <link rel="preload" as="image" href="/fonts/nav/gallery.svg" type="image/svg+xml" />
                <link rel="preload" as="image" href="/fonts/nav/packages.svg" type="image/svg+xml" />
                <link rel="preload" as="image" href="/fonts/nav/contact.svg" type="image/svg+xml" />

                {/* Preload Hero & Brand Text Assets */}
                <link rel="preload" as="image" href="/images/FTX loading/brand name.webp" type="image/webp" />
                <link rel="preload" as="image" href="/images/FTX loading/text.webp" type="image/webp" />
            </head>
            <body>{children}</body>
        </html>
    );
}
