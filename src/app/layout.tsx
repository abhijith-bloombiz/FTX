import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Hanken_Grotesk, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
    subsets: ["latin"],
    variable: "--font-hanken-grotesk",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
    subsets: ["arabic"],
    weight: ["400", "500", "700", "900"],
    variable: "--font-noto-sans-arabic",
    display: "swap",
    preload: false,
});

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
            { url: "/brand/ftx-3d-logo.webp", type: "image/webp" },
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
        <html
            lang="en"
            className={`dark ${spaceGrotesk.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} ${notoSansArabic.variable}`}
        >
            <body className="bg-ftx-black text-ftx-silver antialiased overflow-x-hidden">
                {children}
            </body>
        </html>
    );
}
