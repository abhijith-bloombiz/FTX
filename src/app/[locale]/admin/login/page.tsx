"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            router.push(`/${locale}/admin/dashboard`);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-portal min-h-screen bg-ftx-obsidian flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ftx-lime/10 blur-[140px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md bg-ftx-surface border border-ftx-surface-high p-8 sm:p-10 ftx-squircle-xl shadow-2xl relative z-10 space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ftx-lime/10 border border-ftx-lime/30 text-ftx-lime mb-2 shadow-lime-glow">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide uppercase">
                        FTX CMS ADMIN
                    </h1>
                    <p className="text-xs font-mono text-ftx-silver-muted uppercase tracking-widest">
                        SECURE MANAGEMENT CONSOLE
                    </p>
                </div>

                {error && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-ftx-silver uppercase tracking-wider block">
                            ADMIN EMAIL ADDRESS
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-ftx-silver-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                                className="w-full pl-10 pr-4 py-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-sm focus:border-ftx-lime focus:outline-none transition-colors ftx-squircle-sm font-mono"
                                placeholder="admin@domain.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-ftx-silver uppercase tracking-wider block">
                            PASSWORD
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-ftx-silver-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="w-full pl-10 pr-10 py-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-sm focus:border-ftx-lime focus:outline-none transition-colors ftx-squircle-sm font-mono"
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ftx-silver-muted hover:text-ftx-lime transition-colors focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-ftx-lime hover:bg-ftx-lime-bright text-ftx-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 ftx-squircle-sm shadow-lime-glow transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>AUTHENTICATING...</span>
                            </>
                        ) : (
                            <>
                                <span>LOG IN TO DASHBOARD</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}
