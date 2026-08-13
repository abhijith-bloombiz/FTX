"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ContactFormData } from "@/types/contact";
import { validateContactForm } from "@/lib/validation/contact";
import { Locale } from "@/i18n/config";

interface ContactFormProps {
    locale: Locale;
    messages: any;
}

export function ContactForm({ locale, messages }: ContactFormProps) {
    const searchParams = useSearchParams();
    const preService = searchParams.get("service") || "";
    const prePackage = searchParams.get("package") || "";

    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle, high-end 3D tilt angle (max 3.5 degrees)
        const rotateX = ((y - centerY) / centerY) * -3.5;
        const rotateY = ((x - centerX) / centerX) * 3.5;

        setTilt({ rotateX, rotateY, scale: 1.005 });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
    };

    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        phone: "",
        email: "",
        vehicleModel: "",
        service: preService,
        package: prePackage,
        message: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [responseMsg, setResponseMsg] = useState("");

    useEffect(() => {
        if (preService || prePackage) {
            setFormData((prev) => ({
                ...prev,
                service: preService || prev.service,
                package: prePackage || prev.package,
            }));
        }
    }, [preService, prePackage]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof ContactFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateContactForm(formData);
        if (!validation.success && validation.errors) {
            setErrors(validation.errors);
            return;
        }

        setErrors({});
        setStatus("submitting");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const json = await res.json();

            if (res.ok && json.success) {
                setStatus("success");
                setResponseMsg(json.message || messages.contact.successMsg);
                setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    vehicleModel: "",
                    service: "",
                    package: "",
                    message: "",
                });
            } else {
                setStatus("error");
                setResponseMsg(json.message || messages.contact.errorMsg);
            }
        } catch (err) {
            setStatus("error");
            setResponseMsg(messages.contact.errorMsg);
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1500px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`,
                transition: tilt.scale === 1 ? "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "transform 0.08s ease-out",
                transformStyle: "preserve-3d",
            }}
            className="bg-ftx-surface/90 border border-ftx-surface-high p-6 sm:p-10 ftx-squircle-xl shadow-2xl relative overflow-hidden group hover:border-ftx-lime/50 transition-colors duration-300"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-ftx-lime/5 rounded-bl-full pointer-events-none" />

            <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-wider mb-2">
                {messages.contact.formTitle}
            </h3>
            <p className="text-xs text-ftx-silver-muted mb-8 font-body">
                Fill out the details below for a customized studio quotation.
            </p>

            {status === "success" && (
                <div className="mb-6 p-4 bg-ftx-lime/10 border border-ftx-lime/50 rounded flex items-start gap-3 text-ftx-lime text-xs font-mono">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>{responseMsg}</div>
                </div>
            )}

            {status === "error" && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded flex items-start gap-3 text-red-400 text-xs font-mono">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>{responseMsg}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                            {messages.contact.name} *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Alex Mercer"
                            className={`w-full px-4 py-3 bg-ftx-obsidian text-white border ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-colors ${errors.name ? "border-red-500" : "border-ftx-surface-high"
                                }`}
                        />
                        {errors.name && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                            {messages.contact.phone} *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g. +971 50 123 4567"
                            className={`w-full px-4 py-3 bg-ftx-obsidian text-white border ftx-squircle-sm text-xs font-mono focus:outline-none focus:border-ftx-lime transition-colors ${errors.phone ? "border-red-500" : "border-ftx-surface-high"
                                }`}
                        />
                        {errors.phone && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.phone}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email Address */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                            {messages.contact.email} *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. alex@example.com"
                            className={`w-full px-4 py-3 bg-ftx-obsidian text-white border ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-colors ${errors.email ? "border-red-500" : "border-ftx-surface-high"
                                }`}
                        />
                        {errors.email && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.email}</p>}
                    </div>

                    {/* Vehicle Make & Model */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                            {messages.contact.vehicle} *
                        </label>
                        <input
                            type="text"
                            name="vehicleModel"
                            value={formData.vehicleModel}
                            onChange={handleChange}
                            placeholder="e.g. Porsche 911 GT3 RS"
                            className={`w-full px-4 py-3 bg-ftx-obsidian text-white border ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-colors ${errors.vehicleModel ? "border-red-500" : "border-ftx-surface-high"
                                }`}
                        />
                        {errors.vehicleModel && (
                            <p className="text-[10px] text-red-400 font-mono mt-1">{errors.vehicleModel}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Service Selection */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                            {messages.contact.service} *
                        </label>
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-ftx-obsidian text-white border ftx-squircle-sm text-xs font-mono focus:outline-none focus:border-ftx-lime transition-colors ${errors.service ? "border-red-500" : "border-ftx-surface-high"
                                }`}
                        >
                            <option value="">-- Choose Service --</option>
                            <option value="ppf">Paint Protection Film (PPF)</option>
                            <option value="ceramic">Ceramic Coating</option>
                            <option value="detailing">Professional Detailing</option>
                        </select>
                        {errors.service && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.service}</p>}
                    </div>

                    {/* Package Selection (Optional) */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                            {messages.contact.package}
                        </label>
                        <input
                            type="text"
                            name="package"
                            value={formData.package}
                            onChange={handleChange}
                            placeholder="e.g. Full Body PPF / Ceramic 5-Yr"
                            className="w-full px-4 py-3 bg-ftx-obsidian text-white border border-ftx-surface-high ftx-squircle-sm text-xs font-mono focus:outline-none focus:border-ftx-lime transition-colors"
                        />
                    </div>
                </div>

                {/* Message / Requirements */}
                <div>
                    <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                        {messages.contact.message}
                    </label>
                    <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us any specific requirements, timeline, or vehicle condition details..."
                        className="w-full px-4 py-3 bg-ftx-obsidian text-white border border-ftx-surface-high ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-colors resize-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="ftx-btn-tech ftx-btn-specular w-full inline-flex items-center justify-center gap-2 py-4 text-xs font-mono font-bold tracking-widest text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright transition-all duration-200 shadow-lime-glow disabled:opacity-50"
                >
                    {status === "submitting" ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{messages.contact.submitting}</span>
                        </>
                    ) : (
                        <>
                            <span>{messages.contact.submit}</span>
                            <Send className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
