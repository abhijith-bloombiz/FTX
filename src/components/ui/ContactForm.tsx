"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, AlertCircle, Loader2, ChevronDown, Check } from "lucide-react";
import { ContactFormData } from "@/types/contact";
import { validateContactForm } from "@/lib/validation/contact";
import { Locale } from "@/i18n/config";

interface ContactFormProps {
    locale: Locale;
    messages: any;
}

const serviceOptions = [
    { value: "", label: "Select detailing service" },
    { value: "ppf", label: "Paint Protection Film (PPF)" },
    { value: "ceramic", label: "Ceramic Coating" },
    { value: "detailing", label: "Professional Detailing" },
];

export function ContactForm({ locale, messages }: ContactFormProps) {
    const searchParams = useSearchParams();
    const preService = searchParams.get("service") || "";
    const prePackage = searchParams.get("package") || "";

    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsServiceOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -((y - centerY) / centerY) * 3;
        const rotateY = ((x - centerX) / centerX) * 3;

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof ContactFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleServiceSelect = (val: string) => {
        setFormData((prev) => ({ ...prev, service: val }));
        setIsServiceOpen(false);
        if (errors.service) {
            setErrors((prev) => ({ ...prev, service: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validation = validateContactForm(formData);

        if (!validation.isValid && !validation.success) {
            setErrors(validation.errors || {});
            return;
        }

        setStatus("submitting");
        setErrors({});

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const json = await res.json();

            if (res.ok) {
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

    const selectedServiceObj = serviceOptions.find(opt => opt.value === formData.service);

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
            {/* Honeycomb Pattern Carbon Texture Background Overlay */}
            <div className="absolute inset-0 bg-honeycomb opacity-30 pointer-events-none z-0" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-ftx-lime/10 blur-2xl rounded-bl-full pointer-events-none z-0" />

            <div className="relative z-10">
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
                                {messages.contact.name} <span className="text-ftx-lime font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className={`w-full px-4 py-3 bg-ftx-obsidian/90 text-white border ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-colors ${errors.name ? "border-red-500" : "border-ftx-surface-high"
                                    }`}
                            />
                            {errors.name && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.name}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                                {messages.contact.phone} <span className="text-ftx-lime font-bold">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className={`w-full px-4 py-3 bg-ftx-obsidian/90 text-white border ftx-squircle-sm text-xs font-mono focus:outline-none focus:border-ftx-lime transition-colors ${errors.phone ? "border-red-500" : "border-ftx-surface-high"
                                    }`}
                            />
                            {errors.phone && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                                {messages.contact.email} <span className="text-ftx-lime font-bold">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className={`w-full px-4 py-3 bg-ftx-obsidian/90 text-white border ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-colors ${errors.email ? "border-red-500" : "border-ftx-surface-high"
                                    }`}
                            />
                            {errors.email && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.email}</p>}
                        </div>

                        {/* Vehicle Make & Model */}
                        <div>
                            <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                                {messages.contact.vehicle} <span className="text-ftx-lime font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                name="vehicleModel"
                                value={formData.vehicleModel}
                                onChange={handleChange}
                                placeholder="Enter vehicle make & model"
                                className={`w-full px-4 py-3 bg-ftx-obsidian/90 text-white border ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-colors ${errors.vehicleModel ? "border-red-500" : "border-ftx-surface-high"
                                    }`}
                            />
                            {errors.vehicleModel && (
                                <p className="text-[10px] text-red-400 font-mono mt-1">{errors.vehicleModel}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Custom Animated Service Selection Dropdown */}
                        <div className="relative z-30" ref={dropdownRef}>
                            <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                                {messages.contact.service} <span className="text-ftx-lime font-bold">*</span>
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsServiceOpen(!isServiceOpen)}
                                className={`w-full px-4 py-3 bg-ftx-obsidian/90 text-left flex items-center justify-between border ftx-squircle-sm text-xs font-mono focus:outline-none transition-all duration-300 ${isServiceOpen
                                    ? "border-ftx-lime shadow-[0_0_20px_rgba(164,214,94,0.2)] text-white"
                                    : errors.service
                                        ? "border-red-500 text-white"
                                        : "border-ftx-surface-high hover:border-ftx-silver/40 text-white"
                                    }`}
                            >
                                <span className={formData.service ? "text-white font-bold" : "text-ftx-silver-muted"}>
                                    {selectedServiceObj ? selectedServiceObj.label : "Select detailing service"}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-ftx-silver transition-transform duration-300 ${isServiceOpen ? "rotate-180 text-ftx-lime" : ""
                                        }`}
                                />
                            </button>

                            {/* Animated Glassmorphic Dropdown Panel */}
                            {isServiceOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-ftx-obsidian/95 border border-ftx-surface-high ftx-squircle-sm shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-1.5">
                                        {serviceOptions.map((opt) => {
                                            const isSelected = formData.service === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => handleServiceSelect(opt.value)}
                                                    className={`w-full px-4 py-2.5 text-left text-xs font-mono flex items-center justify-between transition-colors duration-150 ${isSelected
                                                        ? "bg-ftx-lime/15 text-ftx-lime font-bold"
                                                        : opt.value === ""
                                                            ? "text-ftx-silver-muted hover:bg-ftx-surface-high hover:text-white"
                                                            : "text-ftx-silver hover:bg-ftx-surface-high hover:text-ftx-lime"
                                                        }`}
                                                >
                                                    <span>{opt.label}</span>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-ftx-lime" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {errors.service && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.service}</p>}
                        </div>

                        {/* Preferred Package */}
                        <div>
                            <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2">
                                {messages.contact.package}
                            </label>
                            <input
                                type="text"
                                name="package"
                                value={formData.package}
                                onChange={handleChange}
                                placeholder="Specify package or custom options"
                                className="w-full px-4 py-3 bg-ftx-obsidian/90 text-white border border-ftx-surface-high ftx-squircle-sm text-xs font-mono focus:outline-none focus:border-ftx-lime transition-colors"
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
                            placeholder="Share any specific requests, timeline, or vehicle details..."
                            className="w-full px-4 py-3 bg-ftx-obsidian/90 text-white border border-ftx-surface-high ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-colors resize-none"
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
                                <Loader2 className="w-4 h-4 animate-spin text-ftx-black" />
                                <span>{messages.contact.submitting || "SUBMITTING..."}</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 text-ftx-black" />
                                <span>{messages.contact.submit || messages.contact.submitBtn || "SUBMIT QUOTE REQUEST"}</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
