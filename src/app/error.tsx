"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service in production
        console.error("Application Runtime Error:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-ftx-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full text-center space-y-6">
                {/* Brand Logo */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-44 h-12">
                        <Image
                            src="/brand/ftx-3d-logo.webp"
                            alt="FTX – First Torque X"
                            fill
                            sizes="176px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Error Status Badge */}
                <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
                    <span className="text-xs font-mono font-bold text-red-400 tracking-widest uppercase">
                        APPLICATION INTERRUPTION
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-white">
                    SOMETHING WENT WRONG
                </h1>

                <p className="text-sm text-ftx-silver-muted leading-relaxed font-body max-w-md mx-auto">
                    An unexpected issue occurred while rendering this interface. Our team has been notified.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto px-6 py-3 bg-ftx-lime text-ftx-black font-heading font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-ftx-lime-glow transition-all duration-300 shadow-lg shadow-ftx-lime/20 cursor-pointer"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/en"
                        className="w-full sm:w-auto px-6 py-3 bg-ftx-surface border border-ftx-surface-high text-ftx-silver hover:text-white hover:border-ftx-lime/50 font-heading font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-300"
                    >
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </main>
    );
}
