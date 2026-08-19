import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "FTX – First Torque X | Luxury Automotive Protection & Detailing Studio Dubai",
        template: "%s | FTX Dubai",
    },
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
        title: "FTX – First Torque X | Luxury Automotive Protection Studio Dubai",
        description: "Bespoke Paint Protection Film (PPF), Ceramic Coating & Surgical Detailing in Dubai.",
        url: "https://ftx.ae",
        siteName: "FTX – First Torque X",
        images: [
            {
                url: "/brand/ftx-3d-logo.png",
                width: 1200,
                height: 630,
                alt: "FTX Automotive Protection Studio Dubai",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "FTX – Luxury Automotive Protection Studio Dubai",
        description: "Bespoke Paint Protection Film (PPF), Ceramic Coating & Surgical Detailing in Dubai.",
        images: ["/brand/ftx-3d-logo.png"],
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
            { url: "/brand/ftx-3d-logo.png", type: "image/png" },
        ],
        shortcut: "/brand/ftx-3d-logo.png",
        apple: "/brand/ftx-3d-logo.png",
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
            <body>{children}</body>
        </html>
    );
}
