import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Hanken_Grotesk, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const ethnocentric = localFont({
    src: "../../public/fonts/Ethnocentric-Regular.otf",
    variable: "--font-ethnocentric",
    display: "swap",
});

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
    title: {
        default: "First Torque X – Premier Automotive Protection Studio",
        template: "%s",
    },
    description: "Premier automotive protection studio specializing in Paint Protection Film (PPF), 9H+ Ceramic Coatings, Surgical Paint Correction, and Bespoke Car Detailing.",
    keywords: [
        "Paint Protection Film",
        "PPF",
        "Ceramic Coating",
        "Car Detailing",
        "Luxury Car Protection",
        "Paint Correction",
        "FTX",
        "First Torque X",
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://firsttorquex.com"),
    alternates: {
        canonical: "/",
        languages: {
            "en": "/en",
            "ar": "/ar",
            "x-default": "/en",
        },
    },
    openGraph: {
        title: "First Torque X",
        description: "Bespoke Paint Protection Film (PPF), Ceramic Coating & Surgical Detailing.",
        url: "https://firsttorquex.com",
        siteName: "First Torque X",
        images: [
            {
                url: "/brand/ftx-og-image.jpg",
                width: 1200,
                height: 630,
                type: "image/jpeg",
                alt: "First Torque X Automotive Protection Studio",
            },
            {
                url: "/brand/ftx-og-square.jpg",
                width: 600,
                height: 600,
                type: "image/jpeg",
                alt: "First Torque X Automotive Protection Studio",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "First Torque X",
        description: "Bespoke Paint Protection Film (PPF), Ceramic Coating & Surgical Detailing.",
        images: ["/brand/ftx-og-image.jpg"],
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
    manifest: "/site.webmanifest",
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
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
            suppressHydrationWarning
            className={`dark ${spaceGrotesk.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} ${notoSansArabic.variable} ${ethnocentric.variable}`}
        >
            <body className="bg-ftx-black text-ftx-silver antialiased overflow-x-hidden">
                {children}
            </body>
        </html>
    );
}
