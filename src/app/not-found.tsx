import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-ftx-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ftx-lime/5 rounded-full blur-[120px] pointer-events-none" />

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

                {/* Error Code */}
                <div className="inline-block px-3 py-1 bg-ftx-lime/10 border border-ftx-lime/30 rounded-full">
                    <span className="text-xs font-mono font-bold text-ftx-lime tracking-widest uppercase">
                        ERROR 404 • ROUTE NOT FOUND
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white">
                    LOST OFF THE TRACK
                </h1>

                <p className="text-sm text-ftx-silver-muted leading-relaxed font-body max-w-md mx-auto">
                    The page you are looking for may have been relocated, removed, or does not exist in our directory.
                </p>

                {/* Navigation CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Link
                        href="/en"
                        className="w-full sm:w-auto px-6 py-3 bg-ftx-lime text-ftx-black font-heading font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-ftx-lime-glow transition-all duration-300 shadow-lg shadow-ftx-lime/20"
                    >
                        Return to Homepage
                    </Link>
                    <Link
                        href="/en/contact"
                        className="w-full sm:w-auto px-6 py-3 bg-ftx-surface border border-ftx-surface-high text-ftx-silver hover:text-white hover:border-ftx-lime/50 font-heading font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-300"
                    >
                        Contact Concierge
                    </Link>
                </div>
            </div>
        </main>
    );
}
