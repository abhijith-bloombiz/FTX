import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "FTX – First Torque X | Premium Automotive Protection & Detailing Studio Dubai",
    description: "Dubai's premier automotive protection studio specializing in Paint Protection Film (PPF), 9H+ Ceramic Coatings, and surgical Paint Correction.",
    icons: {
        icon: [
            { url: "/brand/ftx-3d-logo.png", type: "image/png" },
        ],
        shortcut: "/brand/ftx-3d-logo.png",
        apple: "/brand/ftx-3d-logo.png",
    },
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
