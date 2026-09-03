"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, AlertCircle, Loader2, ChevronDown, Check } from "lucide-react";
import { ContactFormData } from "@/types/contact";
import { validateContactForm } from "@/lib/validation/contact";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getFormWhatsAppUrl } from "@/lib/whatsapp";

interface ContactFormProps {
    locale: Locale;
    messages: any;
    initialServices?: any[];
}

export function ContactForm({ locale, messages, initialServices }: ContactFormProps) {
    const [servicesList, setServicesList] = useState<any[]>(initialServices || []);

    useEffect(() => {
        const fetchCmsServices = async () => {
            try {
                const res = await fetch("/api/admin/services");
                if (res.ok) {
                    const data = await res.json();
                    if (data.services && Array.isArray(data.services) && data.services.length > 0) {
                        setServicesList(data.services);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch CMS services for contact form:", err);
            }
        };

        if (!initialServices || initialServices.length === 0) {
            fetchCmsServices();
        }
    }, [initialServices]);

    const serviceOptions = [
        { value: "", label: messages.contact?.selectService || "Select detailing service" },
        ...(servicesList.length > 0
            ? servicesList.map((s: any) => {
                const val = s.serviceId || s.id || s._id;
                let label = val;
                if (typeof s.title === "object" && s.title !== null) {
                    label = s.title[locale] || s.title.en || s.title.ar || val;
                } else if (typeof s.title === "string" && s.title.trim() !== "") {
                    label = s.title;
                }
                return { value: val, label };
            })
            : [
                { value: "ppf", label: messages.contact?.ppf || "Paint Protection Film (PPF)" },
                { value: "ceramic", label: messages.contact?.ceramic || "Ceramic Coating" },
                { value: "detailing", label: messages.contact?.detailing || "Professional Detailing" },
            ]
        )
    ];

    const searchParams = useSearchParams();
    const preService = searchParams.get("service") || "";
    const prePackage = searchParams.get("package") || "";

    const cardRef = useRef<HTMLDivElement>(null);
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
        if (!cardRef.current || typeof window === "undefined") return;
        // Only run 3D hover tilt on desktop pointer devices
        if (!window.matchMedia("(pointer: fine)").matches) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -((y - centerY) / centerY) * 2;
        const rotateY = ((x - centerX) / centerX) * 2;

        card.style.transform = `perspective(1500px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.002, 1.002, 1.002)`;
        card.style.transition = "transform 0.08s ease-out";
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = "perspective(1500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        cardRef.current.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
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
    const [cmsPhone, setCmsPhone] = useState<string>("");

    useEffect(() => {
        const sParam = searchParams.get("service");
        const pParam = searchParams.get("package");
        if (sParam !== null || pParam !== null) {
            let matchedService = sParam || "";
            if (matchedService === "paint-protection-film") matchedService = "ppf";
            if (matchedService === "ceramic-coating") matchedService = "ceramic";

            setFormData((prev) => ({
                ...prev,
                service: matchedService || prev.service,
                package: pParam !== null ? pParam : prev.package,
            }));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchCmsPhone = async () => {
            try {
                const res = await fetch("/api/admin/sections");
                if (res.ok) {
                    const data = await res.json();
                    const infoSec = data.sections?.find((s: any) => s.page === "contact" || s.sectionKey === "info");
                    if (infoSec?.metadata?.phone) {
                        setCmsPhone(infoSec.metadata.phone);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch CMS phone number:", err);
            }
        };
        fetchCmsPhone();
    }, []);

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

        // 1. Generate WhatsApp URL with pre-filled form details & CMS phone
        const waUrl = getFormWhatsAppUrl({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            vehicleModel: formData.vehicleModel,
            service: formData.service,
            package: formData.package,
            message: formData.message,
            locale: locale as "en" | "ar",
            phoneNumber: cmsPhone,
        });

        // 2. Open WhatsApp in new tab immediately to bypass popup blockers
        window.open(waUrl, "_blank", "noopener,noreferrer");

        try {
            // 3. Submit inquiry to database for Admin Dashboard tracking
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    serviceCategory: formData.service || formData.package || ""
                }),
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
        <ScrollReveal type="card" duration={800}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="bg-[#121212] border border-white/10 p-4 sm:p-6 ftx-squircle-xl shadow-2xl relative overflow-hidden group hover:border-ftx-lime/50 transition-all duration-500 transform-gpu"
            >
                {/* Form Card Ambient Corner Highlight */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-ftx-lime/5 rounded-bl-full pointer-events-none z-0" />

                <div className="relative z-10">
                    <ScrollReveal type="editorial" delay={100} duration={600}>
                        <div className="rejoin-header">
                            <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-wider mb-1">
                                {messages.contact.formTitle}
                            </h3>
                            <p className="text-xs text-ftx-silver-muted mb-4 font-body">
                                {messages.contact?.formSub || "Fill out the details below for a customized studio quotation."}
                            </p>
                        </div>
                    </ScrollReveal>

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

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {/* Row 1: Name & Phone */}
                        <ScrollReveal type="editorial" delay={180} duration={650}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {/* Full Name */}
                                <div className="rejoin-left">
                                    <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2 ltr:text-left rtl:text-right">
                                        {messages.contact.name} <span className="text-ftx-lime font-bold">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={messages.contact?.namePlaceholder || "Enter full name"}
                                        className={`w-full px-4 py-3 bg-[#0a0a0a] text-white border border-white/10 ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-all duration-300 ease-out transform-gpu focus:scale-[1.01] focus:-translate-y-0.5 focus:shadow-[0_4px_20px_rgba(164,214,94,0.15)] ltr:text-left rtl:text-right ${errors.name ? "border-red-500" : "border-ftx-surface-high"
                                            }`}
                                    />
                                    {errors.name && <p className="text-[10px] text-red-400 font-mono mt-1 ltr:text-left rtl:text-right">{errors.name}</p>}
                                </div>

                                {/* Phone Number */}
                                <div className="rejoin-right">
                                    <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-2 ltr:text-left rtl:text-right">
                                        {messages.contact.phone} <span className="text-ftx-lime font-bold">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder={messages.contact?.phonePlaceholder || "Enter phone number"}
                                        className={`w-full px-4 py-3 bg-[#0a0a0a] text-white border border-white/10 ftx-squircle-sm text-xs font-mono focus:outline-none focus:border-ftx-lime transition-all duration-300 ease-out transform-gpu focus:scale-[1.01] focus:-translate-y-0.5 focus:shadow-[0_4px_20px_rgba(164,214,94,0.15)] ltr:text-left rtl:text-right ${errors.phone ? "border-red-500" : "border-ftx-surface-high"
                                            }`}
                                    />
                                    {errors.phone && <p className="text-[10px] text-red-400 font-mono mt-1 ltr:text-left rtl:text-right">{errors.phone}</p>}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Row 2: Email & Vehicle */}
                        <ScrollReveal type="editorial" delay={260} duration={650}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {/* Email Address */}
                                <div className="rejoin-left">
                                    <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-1.5 ltr:text-left rtl:text-right">
                                        {messages.contact.email} <span className="text-ftx-lime font-bold">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder={messages.contact?.emailPlaceholder || "Enter email address"}
                                        className={`w-full px-4 py-2.5 bg-[#0a0a0a] text-white border border-white/10 ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-all duration-300 ease-out transform-gpu focus:scale-[1.01] focus:-translate-y-0.5 focus:shadow-[0_4px_20px_rgba(164,214,94,0.15)] ltr:text-left rtl:text-right ${errors.email ? "border-red-500" : "border-ftx-surface-high"
                                            }`}
                                    />
                                    {errors.email && <p className="text-[10px] text-red-400 font-mono mt-1 ltr:text-left rtl:text-right">{errors.email}</p>}
                                </div>

                                {/* Vehicle Make & Model */}
                                <div className="rejoin-right">
                                    <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-1.5 ltr:text-left rtl:text-right">
                                        {messages.contact.vehicle} <span className="text-ftx-lime font-bold">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicleModel"
                                        value={formData.vehicleModel}
                                        onChange={handleChange}
                                        placeholder={messages.contact?.vehiclePlaceholder || "Enter vehicle make & model"}
                                        className={`w-full px-4 py-2.5 bg-[#0a0a0a] text-white border border-white/10 ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-all duration-300 ease-out transform-gpu focus:scale-[1.01] focus:-translate-y-0.5 focus:shadow-[0_4px_20px_rgba(164,214,94,0.15)] ltr:text-left rtl:text-right ${errors.vehicleModel ? "border-red-500" : "border-ftx-surface-high"
                                            }`}
                                    />
                                    {errors.vehicleModel && (
                                        <p className="text-[10px] text-red-400 font-mono mt-1 ltr:text-left rtl:text-right">{errors.vehicleModel}</p>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Row 3: Service Selection Dropdown & Preferred Package */}
                        <ScrollReveal type="editorial" delay={340} duration={650} className={`relative ${isServiceOpen ? "z-40" : "z-10"}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {/* Custom Animated Service Selection Dropdown */}
                                <div className="relative z-30 rejoin-left" ref={dropdownRef}>
                                    <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-1.5 ltr:text-left rtl:text-right">
                                        {messages.contact.service} <span className="text-ftx-lime font-bold">*</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setIsServiceOpen(!isServiceOpen)}
                                        className={`w-full px-4 py-2.5 bg-[#0a0a0a] flex items-center justify-between border ftx-squircle-sm text-xs font-mono focus:outline-none transition-all duration-300 ease-out transform-gpu focus:scale-[1.01] focus:-translate-y-0.5 focus:shadow-[0_4px_20px_rgba(164,214,94,0.15)] ltr:text-left rtl:text-right ${isServiceOpen
                                            ? "border-ftx-lime shadow-[0_0_20px_rgba(164,214,94,0.2)] text-white"
                                            : errors.service
                                                ? "border-red-500 text-white"
                                                : "border-ftx-surface-high hover:border-ftx-silver/40 text-white"
                                            }`}
                                    >
                                        <span className={formData.service ? "text-white font-bold" : "text-ftx-silver-muted"}>
                                            {selectedServiceObj ? selectedServiceObj.label : (messages.contact?.selectService || "Select detailing service")}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-ftx-silver transition-transform duration-300 ${isServiceOpen ? "rotate-180 text-ftx-lime" : ""
                                                }`}
                                        />
                                    </button>

                                    {/* Animated Glassmorphic Dropdown Panel */}
                                    {isServiceOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-ftx-obsidian border border-ftx-surface-high ftx-squircle-sm shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div
                                                data-lenis-prevent
                                                onWheel={(e) => e.stopPropagation()}
                                                onTouchMove={(e) => e.stopPropagation()}
                                                className="py-1.5 max-h-[155px] overflow-y-auto overscroll-contain"
                                            >
                                                {serviceOptions.map((opt) => {
                                                    const isSelected = formData.service === opt.value;
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => handleServiceSelect(opt.value)}
                                                            className={`w-full px-4 py-2.5 text-xs font-mono flex items-center justify-between transition-colors duration-150 ltr:text-left rtl:text-right ${isSelected
                                                                ? "bg-ftx-lime/15 text-ftx-lime font-bold"
                                                                : opt.value === ""
                                                                    ? "text-ftx-silver-muted hover:bg-ftx-surface-high hover:text-white"
                                                                    : "text-ftx-silver hover:bg-[#1a1a1a] hover:text-ftx-lime"
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

                                    {errors.service && <p className="text-[10px] text-red-400 font-mono mt-1 ltr:text-left rtl:text-right">{errors.service}</p>}
                                </div>

                                {/* Preferred Package */}
                                <div className="rejoin-right">
                                    <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-1.5 ltr:text-left rtl:text-right">
                                        {messages.contact.package}
                                    </label>
                                    <input
                                        type="text"
                                        name="package"
                                        value={formData.package}
                                        onChange={handleChange}
                                        placeholder={messages.contact?.packagePlaceholder || "Specify package or custom options"}
                                        className="w-full px-4 py-2.5 bg-[#0a0a0a] text-white border border-white/10 ftx-squircle-sm text-xs font-mono focus:outline-none focus:border-ftx-lime transition-all duration-300 ease-out transform-gpu focus:scale-[1.01] focus:-translate-y-0.5 focus:shadow-[0_4px_20px_rgba(164,214,94,0.15)] ltr:text-left rtl:text-right"
                                    />
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Message / Requirements */}
                        <ScrollReveal type="editorial" delay={420} duration={650}>
                            <div className="rejoin-bottom">
                                <label className="block text-xs font-mono font-bold text-ftx-silver uppercase mb-1.5 ltr:text-left rtl:text-right">
                                    {messages.contact.message}
                                </label>
                                <textarea
                                    name="message"
                                    rows={3}
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={messages.contact?.messagePlaceholder || "Share any specific requests, timeline, or vehicle details..."}
                                    className="w-full px-4 py-2.5 bg-[#0a0a0a] text-white border border-white/10 ftx-squircle-sm text-xs font-body focus:outline-none focus:border-ftx-lime transition-all duration-300 ease-out transform-gpu focus:scale-[1.01] focus:-translate-y-0.5 focus:shadow-[0_4px_20px_rgba(164,214,94,0.15)] resize-none ltr:text-left rtl:text-right"
                                />
                            </div>
                        </ScrollReveal>

                        {/* Submit Button */}
                        <ScrollReveal type="editorial" delay={500} duration={650}>
                            <div className="rejoin-bottom pt-1">
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="ftx-btn-tech ftx-btn-specular w-full inline-flex items-center justify-center gap-2 py-4 text-xs font-mono font-bold tracking-widest text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright transition-all duration-300 ease-out transform-gpu hover:scale-[1.01] hover:-translate-y-0.5 shadow-lime-glow disabled:opacity-50"
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
                            </div>
                        </ScrollReveal>
                    </form>
                </div>
            </div>
        </ScrollReveal>
    );
}
