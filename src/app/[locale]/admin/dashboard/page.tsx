"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    LayoutDashboard,
    Home as HomeIcon,
    Info as InfoIcon,
    Wrench,
    Image as ImageIcon,
    Package as PackageIcon,
    MessageSquare,
    PhoneCall,
    Plus,
    Edit3,
    Trash2,
    Save,
    LogOut,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    RefreshCw,
    Eye,
    ChevronDown,
    Video,
    User as UserIcon,
} from "lucide-react";
import { servicesData } from "@/data/services";
import { packagesData } from "@/data/packages";
import { galleryData } from "@/data/gallery";
import { testimonialsData } from "@/data/testimonials";

export default function AdminDashboardPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    const [activeTab, setActiveTab] = useState<
        "home" | "about" | "services" | "gallery" | "packages" | "testimonials" | "contact" | "inquiries"
    >("home");
    const [homeDropdownOpen, setHomeDropdownOpen] = useState<boolean>(true);
    const [selectedHomeSubSection, setSelectedHomeSubSection] = useState<string>("intro");

    const [aboutDropdownOpen, setAboutDropdownOpen] = useState<boolean>(true);
    const [selectedAboutSubSection, setSelectedAboutSubSection] = useState<string>("hero");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Data States
    const [sections, setSections] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [gallery, setGallery] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);

    // Modal / Form Edit States
    const [editModalItem, setEditModalItem] = useState<any | null>(null);
    const [editModalType, setEditModalType] = useState<"service" | "package" | "gallery" | "testimonial" | null>(null);
    const [isCreateNew, setIsCreateNew] = useState(false);

    useEffect(() => {
        checkAuthAndFetch();
    }, []);

    const checkAuthAndFetch = async () => {
        setLoading(true);
        try {
            const authRes = await fetch("/api/auth/me");
            if (!authRes.ok) {
                router.push(`/${locale}/admin/login`);
                return;
            }

            await fetchAllData();
        } catch (err) {
            router.push(`/${locale}/admin/login`);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllData = async () => {
        try {
            const [secRes, servRes, pkgRes, galRes, testRes, inqRes] = await Promise.all([
                fetch("/api/admin/sections"),
                fetch("/api/admin/services"),
                fetch("/api/admin/packages"),
                fetch("/api/admin/gallery"),
                fetch("/api/admin/testimonials"),
                fetch("/api/admin/inquiries"),
            ]);

            if (secRes.ok) setSections((await secRes.json()).sections || []);

            if (servRes.ok) {
                const sData = (await servRes.json()).services || [];
                setServices(sData.length > 0 ? sData : (servicesData as any));
            } else {
                setServices(servicesData as any);
            }

            if (pkgRes.ok) {
                const pData = (await pkgRes.json()).packages || [];
                setPackages(pData.length > 0 ? pData : (packagesData as any));
            } else {
                setPackages(packagesData as any);
            }

            if (galRes.ok) {
                const gData = (await galRes.json()).gallery || [];
                setGallery(gData.length > 0 ? gData : (galleryData as any));
            } else {
                setGallery(galleryData as any);
            }

            if (testRes.ok) {
                const tData = (await testRes.json()).testimonials || [];
                setTestimonials(tData.length > 0 ? tData : (testimonialsData as any));
            } else {
                setTestimonials(testimonialsData as any);
            }

            if (inqRes.ok) setInquiries((await inqRes.json()).inquiries || []);
        } catch (error) {
            console.error("Error fetching admin content:", error);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push(`/${locale}/admin/login`);
    };

    const handleSaveSection = async (section: any) => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/admin/sections", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(section),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save section");
            setMessage({ type: "success", text: `Updated ${section.page} / ${section.sectionKey} successfully!` });
            fetchAllData();
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Failed to update section" });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteItem = async (type: string, id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/${type}?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`Failed to delete ${type}`);
            setMessage({ type: "success", text: `Deleted item successfully!` });
            fetchAllData();
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveModalItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editModalType || !editModalItem) return;
        setSaving(true);
        try {
            const method = isCreateNew ? "POST" : "PUT";
            const apiPath = editModalType === "gallery" ? "gallery" : `${editModalType}s`;
            const res = await fetch(`/api/admin/${apiPath}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editModalItem),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Operation failed");
            }

            setMessage({ type: "success", text: `Successfully ${isCreateNew ? "created" : "updated"} item!` });
            setEditModalItem(null);
            setEditModalType(null);
            fetchAllData();
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateInquiryStatus = async (id: string, status: string) => {
        try {
            await fetch("/api/admin/inquiries", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            fetchAllData();
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div className="admin-portal min-h-screen bg-ftx-obsidian text-white flex flex-col pt-0 font-body">
            {/* Top Bar Header */}
            <header className="bg-ftx-surface border-b border-ftx-surface-high px-6 py-4 flex items-center justify-between z-30 sticky top-0 backdrop-blur-md">
                <div className="flex items-center">
                    {/* Logo Section sized to align divider exactly at 256px sidebar border */}
                    <div className="w-48 sm:w-56 md:w-[232px] shrink-0 flex items-center">
                        <div className="relative w-36 h-9 sm:w-40 sm:h-10">
                            <Image
                                src="/brand/ftx-3d-logo.webp"
                                alt="FTX – First Torque X"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </div>

                    {/* Vertical Divider aligned with Sidebar Right Border */}
                    <div className="h-8 w-[1px] bg-ftx-surface-high shrink-0 hidden md:block mr-6" />

                    {/* CMS Title Block */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-sm sm:text-base font-heading font-bold uppercase tracking-wider text-white leading-snug">
                            FTX CONTENT MANAGEMENT SYSTEM
                        </h1>
                        <p className="text-[10px] font-mono text-ftx-silver-muted uppercase tracking-wider">
                            LOGGED IN AS: <span className="text-ftx-lime font-semibold">ABHIJITH.BLOOMBIZ@GMAIL.COM</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await fetchAllData();
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="p-2.5 text-ftx-silver hover:text-ftx-lime bg-ftx-obsidian border border-ftx-surface-high rounded-lg transition-colors"
                        title="Refresh Content"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-ftx-lime" : ""}`} />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>LOGOUT</span>
                    </button>
                </div>
            </header>

            {/* Main Content Dashboard Area */}
            <div className="flex-1 flex flex-col md:flex-row">
                {/* Left Navigation Sidebar */}
                <aside className="w-full md:w-64 bg-ftx-surface/50 border-r border-ftx-surface-high p-4 space-y-1 shrink-0">
                    <div className="text-[10px] font-mono text-ftx-silver-muted uppercase tracking-widest px-3 py-2">
                        PAGES & SECTIONS
                    </div>

                    {/* Navigation Items */}
                    <div>
                        {/* HOME PAGE (SECTIONS) WITH DROPDOWN */}
                        <div className="space-y-1">
                            <button
                                onClick={() => {
                                    setActiveTab("home");
                                    setHomeDropdownOpen(!homeDropdownOpen);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === "home"
                                    ? "bg-ftx-lime text-ftx-black shadow-lime-glow scale-[1.02]"
                                    : "text-ftx-silver hover:text-white hover:bg-ftx-surface"
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <HomeIcon className="w-4 h-4 shrink-0" />
                                    <span>Home Page</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${homeDropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown list for individual Home sections */}
                            {homeDropdownOpen && (
                                <div className="pl-3.5 pt-1 pb-1 space-y-1 border-l border-ftx-surface-high/60 ml-4">
                                    {[
                                        { id: "intro", label: "Intro Section" },
                                        { id: "services", label: "Services Section" },
                                        { id: "why_ftx", label: "Why FTX Section" },
                                        { id: "gallery", label: "Gallery Section" },
                                        { id: "testimonials", label: "Testimonials Section" },
                                        { id: "contact", label: "Contact Section" },
                                    ].map((sub) => {
                                        const isSubActive = activeTab === "home" && selectedHomeSubSection === sub.id;
                                        return (
                                            <button
                                                key={sub.id}
                                                onClick={() => {
                                                    setActiveTab("home");
                                                    setSelectedHomeSubSection(sub.id);
                                                }}
                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-[11px] font-mono transition-all text-left ${isSubActive
                                                    ? "bg-ftx-lime/20 text-ftx-lime font-bold border-l-2 border-ftx-lime"
                                                    : "text-ftx-silver-muted hover:text-white hover:bg-ftx-surface/80"
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubActive ? "bg-ftx-lime" : "bg-ftx-silver-muted/50"}`} />
                                                <span>{sub.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ABOUT PAGE (SECTIONS) WITH DROPDOWN */}
                        <div className="space-y-1 pt-1">
                            <button
                                onClick={() => {
                                    setActiveTab("about");
                                    setAboutDropdownOpen(!aboutDropdownOpen);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === "about"
                                    ? "bg-ftx-lime text-ftx-black shadow-lime-glow scale-[1.02]"
                                    : "text-ftx-silver hover:text-white hover:bg-ftx-surface"
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <InfoIcon className="w-4 h-4 shrink-0" />
                                    <span>About Page</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown list for individual About sections */}
                            {aboutDropdownOpen && (
                                <div className="pl-3.5 pt-1 pb-1 space-y-1 border-l border-ftx-surface-high/60 ml-4">
                                    {[
                                        { id: "hero", label: "Hero Section" },
                                        { id: "philosophy", label: "Philosophy & Story" },
                                        { id: "infrastructure", label: "Infrastructure Section" },
                                        { id: "metrics", label: "Performance Metrics" },
                                    ].map((sub) => {
                                        const isSubActive = activeTab === "about" && selectedAboutSubSection === sub.id;
                                        return (
                                            <button
                                                key={sub.id}
                                                onClick={() => {
                                                    setActiveTab("about");
                                                    setSelectedAboutSubSection(sub.id);
                                                }}
                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-[11px] font-mono transition-all text-left ${isSubActive
                                                    ? "bg-ftx-lime/20 text-ftx-lime font-bold border-l-2 border-ftx-lime"
                                                    : "text-ftx-silver-muted hover:text-white hover:bg-ftx-surface/80"
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubActive ? "bg-ftx-lime" : "bg-ftx-silver-muted/50"}`} />
                                                <span>{sub.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* OTHER CMS TABS */}
                        <div className="space-y-1 pt-1">
                            {[
                                { id: "services", label: "Services CMS", icon: Wrench },
                                { id: "gallery", label: "Gallery Media", icon: ImageIcon },
                                { id: "packages", label: "Packages & Pricing", icon: PackageIcon },
                                { id: "testimonials", label: "Testimonials", icon: MessageSquare },
                                { id: "contact", label: "Contact Page", icon: PhoneCall, badge: inquiries.filter((i) => i.status === "new").length },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${isActive
                                            ? "bg-ftx-lime text-ftx-black shadow-lime-glow scale-[1.02]"
                                            : "text-ftx-silver hover:text-white hover:bg-ftx-surface"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span>{tab.label}</span>
                                        </div>
                                        {tab.badge ? (
                                            <span className="px-2 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-bold">
                                                {tab.badge}
                                            </span>
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Right Panel Main Workspace */}
                <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-7xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-ftx-surface/30 border border-ftx-surface-high/50 ftx-squircle-xl p-12">
                            <div className="p-4 rounded-full bg-ftx-lime/10 border border-ftx-lime/30 text-ftx-lime shadow-lime-glow">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                                    LOADING DATA FROM DATABASE...
                                </p>
                                <p className="text-xs font-mono text-ftx-silver-muted">
                                    Fetching latest CMS sections & content records
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {message && (
                                <div
                                    className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${message.type === "success"
                                        ? "bg-ftx-lime/10 border-ftx-lime/40 text-ftx-lime"
                                        : "bg-rose-500/10 border-rose-500/40 text-rose-400"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {message.type === "success" ? (
                                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                        )}
                                        <span>{message.text}</span>
                                    </div>
                                    <button onClick={() => setMessage(null)} className="hover:opacity-75">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* TAB 1: HOME PAGE SECTIONS */}
                            {activeTab === "home" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-heading font-bold uppercase">
                                                HOME PAGE SECTIONS {selectedHomeSubSection !== "all" && `— ${selectedHomeSubSection.toUpperCase().replace("_", " ")}`}
                                            </h2>
                                            <p className="text-xs text-ftx-silver-muted font-mono">
                                                Edit Intro, Services, Why FTX, Gallery, Testimonials, & Contact sections
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {sections
                                            .filter((s) => {
                                                if (s.page !== "home") return false;
                                                const allowed = ["intro", "services", "why_ftx", "gallery", "testimonials", "contact"];
                                                if (!allowed.includes(s.sectionKey)) return false;
                                                if (selectedHomeSubSection !== "all" && s.sectionKey !== selectedHomeSubSection) return false;
                                                return true;
                                            })
                                            .map((sec, idx) => (
                                                <div key={`home-${sec.sectionKey}-${idx}`} className="space-y-6">
                                                    <SectionEditCard section={sec} onSave={handleSaveSection} saving={saving} />

                                                    {/* If viewing Services Section under Home Page, render real Service Items management below header */}
                                                    {sec.sectionKey === "services" && (
                                                        <div className="bg-ftx-surface/80 border border-ftx-surface-high p-6 ftx-squircle-lg space-y-6">
                                                            <div className="flex items-center justify-between border-b border-ftx-surface-high pb-4">
                                                                <div>
                                                                    <h3 className="text-lg font-heading font-bold uppercase text-ftx-lime flex items-center gap-2">
                                                                        <Wrench className="w-5 h-5" />
                                                                        <span>SERVICES CMS — LIVE SERVICE ITEMS</span>
                                                                    </h3>
                                                                    <p className="text-xs text-ftx-silver-muted font-mono mt-0.5">
                                                                        Manage Paint Protection Film (PPF), Ceramic Coating, Pro Detailing & custom services displayed on public portal
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        setIsCreateNew(true);
                                                                        setEditModalType("service");
                                                                        setEditModalItem({
                                                                            serviceId: `service-${Date.now()}`,
                                                                            number: `0${services.length + 1}`,
                                                                            badge: { en: "NEW SERVICE", ar: "خدمة جديدة" },
                                                                            title: { en: "NEW SERVICE TITLE", ar: "عنوان الخدمة الجديدة" },
                                                                            subtitle: { en: "Service Subtitle", ar: "وصف فرعي للخدمة" },
                                                                            description: { en: "Service description text", ar: "نص تفصيلي للخدمة" },
                                                                            benefits: { en: ["Benefit 1"], ar: ["ميزة 1"] },
                                                                            image: "/images/services/ppf-main.png",
                                                                            detailImages: [],
                                                                            highlights: [],
                                                                            process: [],
                                                                        });
                                                                    }}
                                                                    className="px-4 py-2.5 bg-ftx-lime text-ftx-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-lime-glow flex items-center gap-2 hover:bg-ftx-lime-bright transition-all"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                    <span>ADD NEW SERVICE</span>
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-1 gap-4">
                                                                {services.length === 0 ? (
                                                                    <div className="p-8 bg-ftx-obsidian border border-ftx-surface-high text-center text-xs font-mono text-ftx-silver-muted rounded-xl">
                                                                        NO SERVICES FOUND IN DATABASE. CLICK "ADD NEW SERVICE" TO CREATE ONE.
                                                                    </div>
                                                                ) : (
                                                                    services.map((serv) => (
                                                                        <div
                                                                            key={serv._id}
                                                                            className="bg-ftx-obsidian border border-ftx-surface-high p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-ftx-lime/30 transition-colors"
                                                                        >
                                                                            <div className="flex items-center gap-4">
                                                                                {serv.image && (
                                                                                    <div className="w-16 h-16 bg-ftx-surface border border-ftx-surface-high rounded-lg overflow-hidden shrink-0">
                                                                                        <img src={serv.image} alt={serv.title?.en} className="w-full h-full object-cover" />
                                                                                    </div>
                                                                                )}
                                                                                <div className="space-y-1">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="px-2 py-0.5 bg-ftx-surface text-ftx-lime border border-ftx-lime/30 text-[10px] font-mono font-bold uppercase">
                                                                                            #{serv.number || "01"} {serv.badge?.en || "SERVICE"}
                                                                                        </span>
                                                                                        <span className="text-[10px] font-mono text-ftx-silver-muted">
                                                                                            ID: {serv.serviceId}
                                                                                        </span>
                                                                                    </div>
                                                                                    <h4 className="text-sm font-bold font-heading text-white uppercase">
                                                                                        {serv.title?.en} / {serv.title?.ar}
                                                                                    </h4>
                                                                                    <p className="text-xs text-ftx-silver-muted font-body line-clamp-1">
                                                                                        {serv.subtitle?.en || serv.description?.en}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setIsCreateNew(false);
                                                                                        setEditModalType("service");
                                                                                        setEditModalItem(serv);
                                                                                    }}
                                                                                    className="px-3 py-2 bg-ftx-surface hover:bg-ftx-surface-high border border-ftx-surface-high text-ftx-silver hover:text-ftx-lime text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
                                                                                >
                                                                                    <Edit3 className="w-3.5 h-3.5" />
                                                                                    <span>EDIT</span>
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteItem("services", serv._id)}
                                                                                    className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                    <span>DELETE</span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: ABOUT PAGE */}
                            {activeTab === "about" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-heading font-bold uppercase">
                                            ABOUT PAGE SECTIONS — {selectedAboutSubSection.toUpperCase().replace("_", " ")}
                                        </h2>
                                        <p className="text-xs text-ftx-silver-muted font-mono">
                                            Edit Hero, Philosophy, Infrastructure, & Performance Metrics content for the About Page
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {sections
                                            .filter((s) => s.page === "about" && (selectedAboutSubSection === "all" || s.sectionKey === selectedAboutSubSection))
                                            .map((sec, idx) => (
                                                <SectionEditCard key={`about-${sec.sectionKey}-${idx}`} section={sec} onSave={handleSaveSection} saving={saving} />
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: SERVICES CMS */}
                            {activeTab === "services" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-heading font-bold uppercase">SERVICES MANAGEMENT</h2>
                                            <p className="text-xs text-ftx-silver-muted font-mono">
                                                Full CRUD for PPF, Ceramic, & Detailing Services
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsCreateNew(true);
                                                setEditModalType("service");
                                                setEditModalItem({
                                                    serviceId: `service-${Date.now()}`,
                                                    number: `0${services.length + 1}`,
                                                    badge: { en: "NEW SERVICE", ar: "خدمة جديدة" },
                                                    title: { en: "NEW SERVICE TITLE", ar: "عنوان الخدمة الجديدة" },
                                                    subtitle: { en: "Service Subtitle", ar: "وصف فرعي للخدمة" },
                                                    description: { en: "Service description text", ar: "نص تفصيلي للخدمة" },
                                                    benefits: { en: ["Benefit 1"], ar: ["ميزة 1"] },
                                                    image: "/images/services/ppf-main.png",
                                                    detailImages: [],
                                                    highlights: [],
                                                    process: [],
                                                });
                                            }}
                                            className="px-4 py-2.5 bg-ftx-lime text-ftx-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-lime-glow flex items-center gap-2 hover:bg-ftx-lime-bright transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>ADD NEW SERVICE</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {services.map((serv, idx) => (
                                            <div
                                                key={serv._id || serv.id || serv.serviceId || `serv-${idx}`}
                                                className="bg-ftx-surface border border-ftx-surface-high p-5 ftx-squircle-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 text-[10px] font-mono font-bold uppercase">
                                                            #{serv.number} {serv.badge?.en}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-bold font-heading text-white uppercase">
                                                        {serv.title?.en} / {serv.title?.ar}
                                                    </h3>
                                                    <p className="text-xs text-ftx-silver-muted font-body line-clamp-1">
                                                        {serv.subtitle?.en}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => {
                                                            setIsCreateNew(false);
                                                            setEditModalType("service");
                                                            setEditModalItem(serv);
                                                        }}
                                                        className="px-3 py-2 bg-ftx-obsidian hover:bg-ftx-surface-high border border-ftx-surface-high text-ftx-silver hover:text-ftx-lime text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                        <span>EDIT</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem("services", serv._id || serv.id || serv.serviceId)}
                                                        className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span>DELETE</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: GALLERY MANAGEMENT */}
                            {activeTab === "gallery" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-heading font-bold uppercase">GALLERY SHOWCASE MANAGEMENT</h2>
                                            <p className="text-xs text-ftx-silver-muted font-mono">
                                                Full CRUD for Videos, Showcase Images, and Before & After sliders
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsCreateNew(true);
                                                setEditModalType("gallery");
                                                setEditModalItem({
                                                    itemId: `g-${Date.now()}`,
                                                    title: { en: "NEW GALLERY ITEM", ar: "عنصر معرض جديد" },
                                                    category: "ppf",
                                                    vehicle: { en: "SUPERCAR MODEL", ar: "طراز السيارة" },
                                                    image: "/images/gallery/gt3rs-ppf.jpg",
                                                    video: "",
                                                    isVideo: false,
                                                    description: { en: "Description text", ar: "الوصف التفصيلي" },
                                                    tags: ["PPF", "Supercar"],
                                                });
                                            }}
                                            className="px-4 py-2.5 bg-ftx-lime text-ftx-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-lime-glow flex items-center gap-2 hover:bg-ftx-lime-bright transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>ADD MEDIA ITEM</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {gallery.map((item, idx) => (
                                            <div
                                                key={item._id || item.id || item.itemId || `gallery-card-${idx}`}
                                                className="bg-ftx-surface border border-ftx-surface-high rounded-xl overflow-hidden flex flex-col justify-between"
                                            >
                                                <div className="relative aspect-video bg-ftx-obsidian">
                                                    <img src={item.image} alt={item.title?.en} className="w-full h-full object-cover" />
                                                    <div className="absolute top-3 left-3 px-2 py-1 bg-ftx-obsidian/90 text-ftx-lime border border-ftx-lime/30 text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1">
                                                        {item.isVideo ? (
                                                            <>
                                                                <Video className="w-3 h-3 text-ftx-lime inline" />
                                                                <span>VIDEO ({item.category?.toUpperCase()})</span>
                                                            </>
                                                        ) : (
                                                            <span>{item.category?.toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                    {item.category === "before-after" && (
                                                        <div className="absolute top-3 right-3 px-2 py-1 bg-ftx-lime text-ftx-black text-[9px] font-mono font-bold rounded uppercase">
                                                            SLIDER
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="text-[10px] font-mono text-ftx-silver uppercase tracking-wider">
                                                            {typeof item.vehicle === "object" ? item.vehicle?.en : item.vehicle}
                                                        </div>
                                                        <h4 className="text-sm font-heading font-bold text-white uppercase line-clamp-1">
                                                            {item.title?.en}
                                                        </h4>
                                                        <p className="text-xs text-ftx-silver-muted font-body line-clamp-2 mt-1">
                                                            {typeof item.description === "object" ? item.description?.en : item.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 pt-3 border-t border-ftx-surface-high">
                                                        <button
                                                            onClick={() => {
                                                                setIsCreateNew(false);
                                                                setEditModalType("gallery");
                                                                setEditModalItem(item);
                                                            }}
                                                            className="flex-1 py-2 bg-ftx-obsidian hover:bg-ftx-surface-high border border-ftx-surface-high text-ftx-silver hover:text-ftx-lime text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                            <span>EDIT</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem("gallery", item._id)}
                                                            className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: PACKAGES MANAGEMENT */}
                            {activeTab === "packages" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-heading font-bold uppercase">PACKAGES & PRICING MANAGEMENT</h2>
                                            <p className="text-xs text-ftx-silver-muted font-mono">
                                                Full CRUD for PPF, Ceramic, & Detailing Packages
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsCreateNew(true);
                                                setEditModalType("package");
                                                setEditModalItem({
                                                    packageId: `ppf-${Date.now()}`,
                                                    category: "ppf",
                                                    name: { en: "NEW PACKAGE NAME", ar: "اسم الباقة الجديدة" },
                                                    description: { en: "Package description", ar: "وصف الباقة" },
                                                    price: { en: "Starting at AED 5,000", ar: "يبدأ من 5,000 د.إ" },
                                                    badge: { en: "POPULAR", ar: "الأكثر طلباً" },
                                                    popular: false,
                                                    features: { en: ["Feature 1"], ar: ["ميزة 1"] },
                                                });
                                            }}
                                            className="px-4 py-2.5 bg-ftx-lime text-ftx-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-lime-glow flex items-center gap-2 hover:bg-ftx-lime-bright transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>ADD NEW PACKAGE</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {packages.map((pkg) => (
                                            <div
                                                key={pkg._id}
                                                className="bg-ftx-surface border border-ftx-surface-high p-5 ftx-squircle-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 text-[10px] font-mono font-bold uppercase">
                                                            {pkg.category?.toUpperCase()}
                                                        </span>
                                                        <span className="text-xs font-mono text-ftx-lime font-bold">
                                                            {pkg.price?.en}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-bold font-heading text-white uppercase">
                                                        {pkg.name?.en} / {pkg.name?.ar}
                                                    </h3>
                                                    <p className="text-xs text-ftx-silver-muted font-body line-clamp-1">
                                                        {pkg.description?.en}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => {
                                                            setIsCreateNew(false);
                                                            setEditModalType("package");
                                                            setEditModalItem(pkg);
                                                        }}
                                                        className="px-3 py-2 bg-ftx-obsidian hover:bg-ftx-surface-high border border-ftx-surface-high text-ftx-silver hover:text-ftx-lime text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                        <span>EDIT</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem("packages", pkg._id)}
                                                        className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span>DELETE</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 6: TESTIMONIALS MANAGEMENT */}
                            {activeTab === "testimonials" && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-heading font-bold uppercase text-white">TESTIMONIALS MANAGEMENT</h2>
                                            <p className="text-xs text-ftx-silver-muted font-mono">Full CRUD & Bilingual Content Control for Client Reviews</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsCreateNew(true);
                                                setEditModalType("testimonial");
                                                setEditModalItem({
                                                    testimonialId: `t-${Date.now()}`,
                                                    id: `t-${Date.now()}`,
                                                    name: "Client Name",
                                                    role: { en: "Supercar Owner", ar: "مالك سيارة فاخرة" },
                                                    vehicle: "Porsche 911 GT3",
                                                    avatar: "/images/testimonials/avatar-1.jpg",
                                                    rating: 5,
                                                    content: { en: "The precision and quality of FTX detailing is unmatched in Dubai.", ar: "الدقة والجودة في العناية بالسيارات لدى FTX لا مثيل لها في دبي." },
                                                });
                                            }}
                                            className="px-4 py-2.5 bg-ftx-lime text-ftx-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-lime-glow flex items-center gap-2 hover:bg-ftx-lime-bright transition-all shrink-0"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>ADD NEW TESTIMONIAL</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {testimonials.map((test) => {
                                            const itemId = test.testimonialId || test.id || test._id;
                                            return (
                                                <div
                                                    key={itemId}
                                                    className="bg-ftx-surface border border-ftx-surface-high p-6 ftx-squircle-xl flex flex-col justify-between space-y-4 shadow-xl hover:border-ftx-lime/50 transition-all group"
                                                >
                                                    <div className="space-y-4">
                                                        {/* Avatar & Header Info */}
                                                        <div className="flex items-start gap-4">
                                                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-ftx-lime/40 shrink-0 bg-ftx-obsidian">
                                                                <img
                                                                    src={test.avatar || "/images/testimonials/avatar-1.jpg"}
                                                                    alt={test.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <h4 className="text-base font-bold text-white font-heading truncate">{test.name}</h4>
                                                                </div>
                                                                <div className="text-xs font-mono text-ftx-lime truncate mt-0.5">
                                                                    {typeof test.role === "object" ? test.role?.en : test.role} • {test.vehicle}
                                                                </div>
                                                                {typeof test.role === "object" && test.role?.ar && (
                                                                    <div className="text-[11px] font-body text-ftx-silver-muted truncate text-right dir-rtl mt-0.5">
                                                                        {test.role.ar}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* English Quote */}
                                                        <div className="bg-ftx-obsidian/60 border border-ftx-surface-high/60 p-3 rounded-lg space-y-1">
                                                            <div className="text-[10px] font-mono font-bold text-ftx-lime uppercase">ENGLISH QUOTE</div>
                                                            <p className="text-xs text-ftx-silver font-body italic leading-relaxed">
                                                                "{typeof test.content === "object" ? test.content?.en : test.content}"
                                                            </p>
                                                        </div>

                                                        {/* Arabic Quote */}
                                                        {typeof test.content === "object" && test.content?.ar && (
                                                            <div className="bg-ftx-obsidian/60 border border-ftx-surface-high/60 p-3 rounded-lg space-y-1 text-right">
                                                                <div className="text-[10px] font-mono font-bold text-ftx-lime uppercase text-left">ARABIC QUOTE - التقييم بالعربية</div>
                                                                <p className="text-xs text-ftx-silver font-body italic leading-relaxed dir-rtl">
                                                                    "{test.content.ar}"
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-3 pt-3 border-t border-ftx-surface-high">
                                                        <button
                                                            onClick={() => {
                                                                setIsCreateNew(false);
                                                                setEditModalType("testimonial");
                                                                setEditModalItem(test);
                                                            }}
                                                            className="flex-1 py-2.5 bg-ftx-obsidian hover:bg-ftx-surface-high border border-ftx-surface-high text-ftx-silver hover:text-ftx-lime text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                            <span>EDIT TESTIMONIAL</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem("testimonials", itemId)}
                                                            className="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* TAB 7: CONTACT PAGE CMS & INQUIRIES */}
                            {(activeTab === "contact" || activeTab === "inquiries") && (
                                <div className="space-y-8">
                                    {/* SECTION 1: CONTACT PAGE DATA & LOCATION CMS */}
                                    {(() => {
                                        const contactSec = sections.find((s) => s.page === "contact") || {
                                            page: "contact",
                                            sectionKey: "info",
                                            title: { en: "CONTACT & STUDIO LOCATION", ar: "معلومات التواصل وموقع الاستوديو" },
                                            subtitle: { en: "AL QUOZ INDUSTRIAL AREA, DUBAI", ar: "منطقة القوز الصناعية، دبي" },
                                            content: { en: "Visit our state-of-the-art studio bay or send an inquiry to book your vehicle consultation.", ar: "تفضل بزيارة استوديو FTX أو أرسل استفسارك لحجز موعد استشارة سيارتك." },
                                            metadata: {
                                                phone: "+971 50 123 4567",
                                                email: "info@ftxdetailing.ae",
                                                addressEn: "Automotive Precision District, Bay 14, Al Quoz, Dubai, UAE",
                                                addressAr: "منطقة تميز السيارات، المجمع 14، القوز، دبي، الإمارات العربية المتحدة",
                                                workingHoursEn: "Monday – Saturday: 9:00 AM – 8:00 PM (Sunday Closed)",
                                                workingHoursAr: "الإثنين – السبت: 9:00 صباحاً – 8:00 مساءً (الأحد مغلق)",
                                                mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14446.857640277353!2d55.2287957!3d25.1453086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6a27e366f019%3A0xb3ff76c24389df94!2sAl%20Quoz%20Industrial%20Area%203%20-%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                                            }
                                        };

                                        return (
                                            <div className="bg-ftx-surface border border-ftx-surface-high p-6 sm:p-8 ftx-squircle-xl space-y-6 shadow-2xl">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ftx-surface-high pb-4">
                                                    <div>
                                                        <h2 className="text-xl font-heading font-bold uppercase text-white">CONTACT PAGE DATA & STUDIO DETAILS</h2>
                                                        <p className="text-xs text-ftx-silver-muted font-mono">
                                                            Manage real public contact metadata, studio location, operating hours, phone, email, and map link
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleSaveSection(contactSec)}
                                                        disabled={saving}
                                                        className="px-5 py-2.5 bg-ftx-lime text-ftx-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-lime-glow flex items-center gap-2 hover:bg-ftx-lime-bright transition-all shrink-0 disabled:opacity-50"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        <span>{saving ? "SAVING..." : "SAVE CONTACT CMS"}</span>
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                                                    {/* Header Title (EN / AR) */}
                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">SECTION TITLE (ENGLISH)</label>
                                                        <input
                                                            type="text"
                                                            value={contactSec.title?.en || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, title: { ...s.title, en: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-mono focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">SECTION TITLE (ARABIC - العنوان بالعربية)</label>
                                                        <input
                                                            type="text"
                                                            dir="rtl"
                                                            value={contactSec.title?.ar || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, title: { ...s.title, ar: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-body focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Subtitle / Location Badge (EN / AR) */}
                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">SUBTITLE / BADGE (ENGLISH)</label>
                                                        <input
                                                            type="text"
                                                            value={contactSec.subtitle?.en || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, subtitle: { ...s.subtitle, en: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-mono focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">SUBTITLE / BADGE (ARABIC - العنوان الفرعي)</label>
                                                        <input
                                                            type="text"
                                                            dir="rtl"
                                                            value={contactSec.subtitle?.ar || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, subtitle: { ...s.subtitle, ar: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-body focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Description (EN / AR) */}
                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">DESCRIPTION / INTRO (ENGLISH)</label>
                                                        <textarea
                                                            rows={2}
                                                            value={contactSec.content?.en || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, content: { ...s.content, en: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-mono focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">DESCRIPTION / INTRO (ARABIC - الوصف بالعربية)</label>
                                                        <textarea
                                                            rows={2}
                                                            dir="rtl"
                                                            value={contactSec.content?.ar || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, content: { ...s.content, ar: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-body focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Contact Metadata: Phone & Email */}
                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">TELEPHONE NUMBER</label>
                                                        <input
                                                            type="text"
                                                            value={contactSec.metadata?.phone || "+971 50 123 4567"}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, metadata: { ...s.metadata, phone: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-mono focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">EMAIL ADDRESS</label>
                                                        <input
                                                            type="text"
                                                            value={contactSec.metadata?.email || "info@ftxdetailing.ae"}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, metadata: { ...s.metadata, email: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-mono focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Address (EN / AR) */}
                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">STUDIO ADDRESS (ENGLISH)</label>
                                                        <input
                                                            type="text"
                                                            value={contactSec.metadata?.addressEn || "Automotive Precision District, Bay 14, Al Quoz, Dubai, UAE"}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, metadata: { ...s.metadata, addressEn: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-mono focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">STUDIO ADDRESS (ARABIC)</label>
                                                        <input
                                                            type="text"
                                                            dir="rtl"
                                                            value={contactSec.metadata?.addressAr || "منطقة تميز السيارات، المجمع 14، القوز، دبي، الإمارات العربية المتحدة"}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, metadata: { ...s.metadata, addressAr: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-body focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Operating Hours (EN / AR) */}
                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">OPERATING HOURS (ENGLISH)</label>
                                                        <input
                                                            type="text"
                                                            value={contactSec.metadata?.workingHoursEn || "Monday – Saturday: 9:00 AM – 8:00 PM (Sunday Closed)"}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, metadata: { ...s.metadata, workingHoursEn: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-mono focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">OPERATING HOURS (ARABIC)</label>
                                                        <input
                                                            type="text"
                                                            dir="rtl"
                                                            value={contactSec.metadata?.workingHoursAr || "الإثنين – السبت: 9:00 صباحاً – 8:00 مساءً (الأحد مغلق)"}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, metadata: { ...s.metadata, workingHoursAr: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-body focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Google Maps Embed URL */}
                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-ftx-lime font-bold uppercase block">GOOGLE MAPS EMBED IFRAME URL</label>
                                                        <input
                                                            type="text"
                                                            value={contactSec.metadata?.mapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14446.857640277353!2d55.2287957!3d25.1453086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6a27e366f019%3A0xb3ff76c24389df94!2sAl%20Quoz%20Industrial%20Area%203%20-%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSections((prev) =>
                                                                    prev.map((s) => s.page === "contact" ? { ...s, metadata: { ...s.metadata, mapsUrl: val } } : s)
                                                                );
                                                            }}
                                                            className="w-full bg-ftx-obsidian border border-ftx-surface-high p-3 rounded-lg text-white text-xs font-mono focus:border-ftx-lime focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* SECTION 2: CUSTOMER CONTACT INQUIRIES LEADS */}
                                    <div className="space-y-4">
                                        <div className="border-b border-ftx-surface-high pb-3">
                                            <h2 className="text-xl font-heading font-bold uppercase text-white">CUSTOMER FORM INQUIRIES</h2>
                                            <p className="text-xs text-ftx-silver-muted font-mono">
                                                Lead submissions received from the website contact form
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {inquiries.length === 0 ? (
                                                <div className="p-8 text-center bg-ftx-surface border border-ftx-surface-high rounded-xl text-ftx-silver-muted font-mono text-xs">
                                                    NO CONTACT INQUIRIES SUBMITTED YET.
                                                </div>
                                            ) : (
                                                inquiries.map((inq) => (
                                                    <div
                                                        key={inq._id}
                                                        className="bg-ftx-surface border border-ftx-surface-high p-5 ftx-squircle-lg space-y-3"
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ftx-surface-high pb-3">
                                                            <div>
                                                                <h3 className="text-base font-heading font-bold text-white uppercase">
                                                                    {inq.name}
                                                                </h3>
                                                                <p className="text-xs font-mono text-ftx-silver">
                                                                    EMAIL: {inq.email} | PHONE: {inq.phone}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    value={inq.status}
                                                                    onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                                                                    className="bg-ftx-obsidian border border-ftx-surface-high text-xs font-mono font-bold text-ftx-lime px-3 py-1.5 rounded-lg focus:outline-none"
                                                                >
                                                                    <option value="new">NEW LEAD</option>
                                                                    <option value="contacted">CONTACTED</option>
                                                                    <option value="closed">CLOSED</option>
                                                                </select>

                                                                <button
                                                                    onClick={() => handleDeleteItem("inquiries", inq._id)}
                                                                    className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-ftx-silver-muted">
                                                            <div>VEHICLE: <span className="text-white">{inq.vehicleModel || "N/A"}</span></div>
                                                            <div>SERVICE: <span className="text-white">{inq.serviceCategory || "N/A"}</span></div>
                                                            <div>DATE: <span className="text-white">{inq.preferredDate || "N/A"}</span></div>
                                                        </div>

                                                        <div className="p-3 bg-ftx-obsidian border border-ftx-surface-high/60 rounded-lg text-xs text-ftx-silver font-body">
                                                            "{inq.message}"
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* CREATE / EDIT MODAL FOR SERVICES, PACKAGES, GALLERY, TESTIMONIALS */}
            {editModalItem && (
                <div
                    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
                    data-lenis-prevent
                >
                    <div className="bg-ftx-surface border border-ftx-surface-high w-full max-w-2xl p-6 sm:p-8 ftx-squircle-xl space-y-5 my-auto shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between border-b border-ftx-surface-high pb-4 shrink-0">
                            <h3 className="text-lg font-heading font-bold uppercase text-white">
                                {isCreateNew ? "CREATE NEW" : "EDIT"} {editModalType?.toUpperCase()}
                            </h3>
                            <button
                                onClick={() => {
                                    setEditModalItem(null);
                                    setEditModalType(null);
                                }}
                                className="text-ftx-silver hover:text-white"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSaveModalItem}
                            className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-ftx-surface-high"
                            data-lenis-prevent
                        >
                            {/* Generic Title EN / AR */}
                            {editModalItem.title && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">TITLE (EN)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.title.en || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    title: { ...editModalItem.title, en: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">TITLE (AR)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.title.ar || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    title: { ...editModalItem.title, ar: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Name EN / AR for Packages & Testimonials */}
                            {editModalItem.name && typeof editModalItem.name === "object" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">NAME (EN)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.name.en || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    name: { ...editModalItem.name, en: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">NAME (AR)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.name.ar || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    name: { ...editModalItem.name, ar: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* String Name for Testimonial */}
                            {typeof editModalItem.name === "string" && (
                                <div className="space-y-1">
                                    <label className="text-[11px] font-mono text-ftx-silver uppercase">CLIENT NAME</label>
                                    <input
                                        type="text"
                                        value={editModalItem.name || ""}
                                        onChange={(e) => setEditModalItem({ ...editModalItem, name: e.target.value })}
                                        className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                        required
                                    />
                                </div>
                            )}

                            {/* Price EN / AR for Packages */}
                            {editModalItem.price && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">PRICE (EN)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.price.en || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    price: { ...editModalItem.price, en: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">PRICE (AR)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.price.ar || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    price: { ...editModalItem.price, ar: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Service Specific Fields: Index Number & Slug ID */}
                            {editModalType === "service" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">INDEX NUMBER (E.G. 01, 02)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.number || ""}
                                            onChange={(e) => setEditModalItem({ ...editModalItem, number: e.target.value })}
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                            placeholder="01"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">SERVICE ID / SLUG (E.G. ppf, ceramic)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.serviceId || ""}
                                            onChange={(e) => setEditModalItem({ ...editModalItem, serviceId: e.target.value })}
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                            placeholder="ppf"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Service Badge EN / AR */}
                            {editModalItem.badge && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">BADGE TEXT (EN)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.badge.en || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    badge: { ...editModalItem.badge, en: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">BADGE TEXT (AR)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.badge.ar || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    badge: { ...editModalItem.badge, ar: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Service Subtitle EN / AR */}
                            {editModalItem.subtitle && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">SUBTITLE / HIGHLIGHT (EN)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.subtitle.en || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    subtitle: { ...editModalItem.subtitle, en: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">SUBTITLE / HIGHLIGHT (AR)</label>
                                        <input
                                            type="text"
                                            value={editModalItem.subtitle.ar || ""}
                                            onChange={(e) =>
                                                setEditModalItem({
                                                    ...editModalItem,
                                                    subtitle: { ...editModalItem.subtitle, ar: e.target.value },
                                                })
                                            }
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Image / Video URLs */}
                            {editModalItem.image !== undefined && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">IMAGE URL & PREVIEW</label>
                                        <label className="text-[10px] font-mono text-ftx-lime hover:underline cursor-pointer">
                                            <span>+ UPLOAD IMAGE FILE</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    try {
                                                        const res = await fetch("/api/admin/upload", {
                                                            method: "POST",
                                                            body: formData,
                                                        });
                                                        const data = await res.json();
                                                        if (data.url) {
                                                            setEditModalItem((prev: any) => ({ ...prev, image: data.url }));
                                                        }
                                                    } catch (err) {
                                                        console.error("Upload error", err);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {/* LIVE IMAGE PREVIEW BOX */}
                                    <div className="relative w-full h-44 bg-ftx-obsidian border border-ftx-surface-high rounded-xl overflow-hidden flex items-center justify-center group">
                                        {editModalItem.image ? (
                                            <>
                                                <img
                                                    src={editModalItem.image}
                                                    alt="Image Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display = "none";
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                    <span className="text-[10px] font-mono font-bold text-white bg-ftx-obsidian/90 border border-ftx-lime/40 px-2.5 py-1 rounded-md uppercase">
                                                        IMAGE PREVIEW
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditModalItem({ ...editModalItem, image: "" })}
                                                        className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/30 px-2.5 py-1 rounded-md uppercase transition-colors"
                                                    >
                                                        REMOVE
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-ftx-silver-muted p-4 text-center">
                                                <ImageIcon className="w-6 h-6 text-ftx-silver-muted/60" />
                                                <span className="text-[11px] font-mono">No Image Selected</span>
                                                <span className="text-[10px] font-mono text-ftx-silver-muted/60">
                                                    Click "+ UPLOAD IMAGE FILE" above or paste an image URL below
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        value={editModalItem.image || ""}
                                        onChange={(e) => setEditModalItem({ ...editModalItem, image: e.target.value })}
                                        className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                        placeholder="/images/services/ppf-main.png"
                                    />
                                </div>
                            )}

                            {editModalType === "gallery" && (
                                <div className="space-y-4 pt-2 border-t border-ftx-surface-high">
                                    {/* CATEGORY SELECTOR */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">GALLERY CATEGORY</label>
                                        <select
                                            value={editModalItem.category || "ppf"}
                                            onChange={(e) => setEditModalItem({ ...editModalItem, category: e.target.value })}
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                        >
                                            <option value="ppf">Paint Protection Film (PPF)</option>
                                            <option value="ceramic">Ceramic Coating</option>
                                            <option value="detailing">Detailing & Restoration</option>
                                            <option value="before-after">Before & After Slider</option>
                                        </select>
                                    </div>

                                    {/* VEHICLE MODEL / NAME (EN & AR) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">VEHICLE MODEL / LABEL (EN)</label>
                                            <input
                                                type="text"
                                                value={typeof editModalItem.vehicle === "object" ? editModalItem.vehicle?.en || "" : editModalItem.vehicle || ""}
                                                onChange={(e) => {
                                                    const curVehicle = typeof editModalItem.vehicle === "object" ? editModalItem.vehicle : { en: "", ar: "" };
                                                    setEditModalItem({ ...editModalItem, vehicle: { ...curVehicle, en: e.target.value } });
                                                }}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                                placeholder="Porsche 911 GT3 RS"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">VEHICLE MODEL / LABEL (AR)</label>
                                            <input
                                                type="text"
                                                value={typeof editModalItem.vehicle === "object" ? editModalItem.vehicle?.ar || "" : editModalItem.vehicle || ""}
                                                onChange={(e) => {
                                                    const curVehicle = typeof editModalItem.vehicle === "object" ? editModalItem.vehicle : { en: "", ar: "" };
                                                    setEditModalItem({ ...editModalItem, vehicle: { ...curVehicle, ar: e.target.value } });
                                                }}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                                placeholder="بورشه 911 GT3 RS"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* VIDEO SETTINGS */}
                                    <div className="p-3 bg-ftx-obsidian/60 border border-ftx-surface-high rounded-xl space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="isVideo"
                                                checked={editModalItem.isVideo || false}
                                                onChange={(e) => setEditModalItem({ ...editModalItem, isVideo: e.target.checked })}
                                                className="w-4 h-4 accent-ftx-lime"
                                            />
                                            <label htmlFor="isVideo" className="text-xs font-mono text-white font-bold">
                                                IS VIDEO MEDIA CARD
                                            </label>
                                        </div>

                                        {editModalItem.isVideo && (
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-mono text-ftx-silver uppercase">VIDEO FILE URL (.mp4)</label>
                                                <input
                                                    type="text"
                                                    value={editModalItem.video || ""}
                                                    onChange={(e) => setEditModalItem({ ...editModalItem, video: e.target.value })}
                                                    className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                                    placeholder="/video/gallery/6159208-hd_1920_1080_30fps.mp4"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* BEFORE & AFTER IMAGES (IF CATEGORY IS BEFORE-AFTER) */}
                                    {editModalItem.category === "before-after" && (
                                        <div className="p-3 bg-ftx-obsidian/60 border border-ftx-surface-high rounded-xl space-y-4">
                                            <span className="text-[11px] font-mono font-bold text-ftx-lime uppercase block">
                                                BEFORE & AFTER SLIDER IMAGES
                                            </span>

                                            {/* Before Image */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] font-mono text-ftx-silver uppercase">BEFORE IMAGE URL</label>
                                                    <label className="text-[10px] font-mono text-ftx-lime hover:underline cursor-pointer">
                                                        <span>+ UPLOAD BEFORE IMAGE</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                const formData = new FormData();
                                                                formData.append("file", file);
                                                                try {
                                                                    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                                                    const data = await res.json();
                                                                    if (data.url) setEditModalItem((prev: any) => ({ ...prev, beforeImage: data.url }));
                                                                } catch (err) { console.error(err); }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={editModalItem.beforeImage || ""}
                                                    onChange={(e) => setEditModalItem({ ...editModalItem, beforeImage: e.target.value })}
                                                    className="w-full p-2.5 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                                    placeholder="/images/gallery/before.png"
                                                />
                                            </div>

                                            {/* After Image */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] font-mono text-ftx-silver uppercase">AFTER IMAGE URL</label>
                                                    <label className="text-[10px] font-mono text-ftx-lime hover:underline cursor-pointer">
                                                        <span>+ UPLOAD AFTER IMAGE</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                const formData = new FormData();
                                                                formData.append("file", file);
                                                                try {
                                                                    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                                                    const data = await res.json();
                                                                    if (data.url) setEditModalItem((prev: any) => ({ ...prev, afterImage: data.url }));
                                                                } catch (err) { console.error(err); }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={editModalItem.afterImage || ""}
                                                    onChange={(e) => setEditModalItem({ ...editModalItem, afterImage: e.target.value })}
                                                    className="w-full p-2.5 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                                    placeholder="/images/gallery/after.png"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* DESCRIPTION (EN & AR) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">DESCRIPTION (EN)</label>
                                            <textarea
                                                value={typeof editModalItem.description === "object" ? editModalItem.description?.en || "" : editModalItem.description || ""}
                                                onChange={(e) => {
                                                    const curDesc = typeof editModalItem.description === "object" ? editModalItem.description : { en: "", ar: "" };
                                                    setEditModalItem({ ...editModalItem, description: { ...curDesc, en: e.target.value } });
                                                }}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none min-h-[90px]"
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">DESCRIPTION (AR)</label>
                                            <textarea
                                                value={typeof editModalItem.description === "object" ? editModalItem.description?.ar || "" : editModalItem.description || ""}
                                                onChange={(e) => {
                                                    const curDesc = typeof editModalItem.description === "object" ? editModalItem.description : { en: "", ar: "" };
                                                    setEditModalItem({ ...editModalItem, description: { ...curDesc, ar: e.target.value } });
                                                }}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none min-h-[90px]"
                                                rows={3}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* TAGS (COMMA SEPARATED) */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-mono text-ftx-silver uppercase">TAGS (COMMA SEPARATED)</label>
                                        <input
                                            type="text"
                                            value={Array.isArray(editModalItem.tags) ? editModalItem.tags.join(", ") : editModalItem.tags || ""}
                                            onChange={(e) => {
                                                const raw = e.target.value;
                                                const arr = raw.split(",").map((t) => t.trim());
                                                setEditModalItem({ ...editModalItem, tags: arr });
                                            }}
                                            className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                            placeholder="PPF, Stealth, Porsche, Video"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TESTIMONIAL SPECIFIC EDIT MODAL FORM */}
                            {editModalType === "testimonial" && (
                                <div className="space-y-4 pt-2 border-t border-ftx-surface-high">
                                    {/* Client Name & Vehicle Model */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">CLIENT NAME</label>
                                            <input
                                                type="text"
                                                value={editModalItem.name || ""}
                                                onChange={(e) => setEditModalItem({ ...editModalItem, name: e.target.value })}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                                placeholder="e.g. Sheikh Rashid Al Maktoum"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">VEHICLE MODEL / BRAND</label>
                                            <input
                                                type="text"
                                                value={typeof editModalItem.vehicle === "object" ? editModalItem.vehicle?.en || "" : editModalItem.vehicle || ""}
                                                onChange={(e) => setEditModalItem({ ...editModalItem, vehicle: e.target.value })}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                                placeholder="e.g. Porsche 911 GT3 RS"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Role (EN & AR) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">CLIENT ROLE / TITLE (EN)</label>
                                            <input
                                                type="text"
                                                value={typeof editModalItem.role === "object" ? editModalItem.role?.en || "" : editModalItem.role || ""}
                                                onChange={(e) => {
                                                    const curRole = typeof editModalItem.role === "object" ? editModalItem.role : { en: editModalItem.role || "", ar: "" };
                                                    setEditModalItem({ ...editModalItem, role: { ...curRole, en: e.target.value } });
                                                }}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                                placeholder="e.g. Supercar Collector"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">CLIENT ROLE / TITLE (AR)</label>
                                            <input
                                                type="text"
                                                dir="rtl"
                                                value={typeof editModalItem.role === "object" ? editModalItem.role?.ar || "" : ""}
                                                onChange={(e) => {
                                                    const curRole = typeof editModalItem.role === "object" ? editModalItem.role : { en: editModalItem.role || "", ar: "" };
                                                    setEditModalItem({ ...editModalItem, role: { ...curRole, ar: e.target.value } });
                                                }}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none text-right"
                                                placeholder="مثال: جامع سيارات فاخرة"
                                            />
                                        </div>
                                    </div>


                                    {/* Avatar URL & Upload Preview */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">CLIENT AVATAR IMAGE</label>
                                            <label className="text-[10px] font-mono text-ftx-lime hover:underline cursor-pointer">
                                                <span>+ UPLOAD AVATAR FILE</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const formData = new FormData();
                                                        formData.append("file", file);
                                                        try {
                                                            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                                            const data = await res.json();
                                                            if (data.url) {
                                                                setEditModalItem((prev: any) => ({ ...prev, avatar: data.url }));
                                                            }
                                                        } catch (err) {
                                                            console.error("Upload avatar error", err);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        <div className="flex items-center gap-4 p-3 bg-ftx-obsidian border border-ftx-surface-high rounded-xl">
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-ftx-lime/50 bg-black shrink-0 flex items-center justify-center">
                                                {editModalItem.avatar ? (
                                                    <img src={editModalItem.avatar} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
                                                ) : (
                                                    <UserIcon className="w-6 h-6 text-ftx-silver-muted" />
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={editModalItem.avatar || ""}
                                                onChange={(e) => setEditModalItem({ ...editModalItem, avatar: e.target.value })}
                                                className="flex-1 p-2.5 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                                placeholder="/images/testimonials/avatar-1.jpg"
                                            />
                                        </div>
                                    </div>

                                    {/* Content / Quotes (EN & AR) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">TESTIMONIAL QUOTE (EN)</label>
                                            <textarea
                                                value={typeof editModalItem.content === "object" ? editModalItem.content?.en || "" : editModalItem.content || ""}
                                                onChange={(e) => {
                                                    const curContent = typeof editModalItem.content === "object" ? editModalItem.content : { en: editModalItem.content || "", ar: "" };
                                                    setEditModalItem({ ...editModalItem, content: { ...curContent, en: e.target.value } });
                                                }}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none min-h-[90px]"
                                                rows={4}
                                                placeholder="Write client testimonial quote in English..."
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-mono text-ftx-silver uppercase">TESTIMONIAL QUOTE (AR)</label>
                                            <textarea
                                                dir="rtl"
                                                value={typeof editModalItem.content === "object" ? editModalItem.content?.ar || "" : ""}
                                                onChange={(e) => {
                                                    const curContent = typeof editModalItem.content === "object" ? editModalItem.content : { en: editModalItem.content || "", ar: "" };
                                                    setEditModalItem({ ...editModalItem, content: { ...curContent, ar: e.target.value } });
                                                }}
                                                className="w-full p-3 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none min-h-[90px] text-right"
                                                rows={4}
                                                placeholder="اكتب تقييم العميل باللغة العربية..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SERVICE SPECIFIC ADVANCED EDITORS (BENEFITS, HIGHLIGHTS, PROCESS, DETAIL IMAGES) */}
                            {editModalType === "service" && (
                                <div className="space-y-6 pt-4 border-t border-ftx-surface-high">
                                    {/* 1. KEY BENEFITS LIST */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-mono text-ftx-lime uppercase block font-bold tracking-wider">
                                                KEY BENEFITS (EN & AR)
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const curEn = editModalItem.benefits?.en || [];
                                                    const curAr = editModalItem.benefits?.ar || [];
                                                    setEditModalItem({
                                                        ...editModalItem,
                                                        benefits: {
                                                            en: [...curEn, ""],
                                                            ar: [...curAr, ""],
                                                        },
                                                    });
                                                }}
                                                className="text-[10px] font-mono text-ftx-lime hover:underline cursor-pointer"
                                            >
                                                + ADD BENEFIT ITEM
                                            </button>
                                        </div>

                                        {(!editModalItem.benefits?.en || editModalItem.benefits.en.length === 0) ? (
                                            <p className="text-xs text-ftx-silver-muted font-mono italic">No benefit bullet points added yet.</p>
                                        ) : (
                                            (editModalItem.benefits.en || []).map((bEn: string, bIdx: number) => (
                                                <div key={`benefit-${bIdx}`} className="p-3 bg-ftx-obsidian border border-ftx-surface-high rounded-lg space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-mono text-ftx-silver uppercase">BENEFIT #{bIdx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newEn = [...(editModalItem.benefits?.en || [])];
                                                                const newAr = [...(editModalItem.benefits?.ar || [])];
                                                                newEn.splice(bIdx, 1);
                                                                newAr.splice(bIdx, 1);
                                                                setEditModalItem({
                                                                    ...editModalItem,
                                                                    benefits: { en: newEn, ar: newAr },
                                                                });
                                                            }}
                                                            className="text-rose-400 text-[10px] font-mono hover:underline cursor-pointer"
                                                        >
                                                            REMOVE
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={bEn}
                                                        onChange={(e) => {
                                                            const newEn = [...(editModalItem.benefits?.en || [])];
                                                            newEn[bIdx] = e.target.value;
                                                            setEditModalItem({
                                                                ...editModalItem,
                                                                benefits: { ...editModalItem.benefits, en: newEn },
                                                            });
                                                        }}
                                                        placeholder="English benefit description..."
                                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-body rounded focus:border-ftx-lime focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        dir="rtl"
                                                        value={editModalItem.benefits?.ar?.[bIdx] || ""}
                                                        onChange={(e) => {
                                                            const newAr = [...(editModalItem.benefits?.ar || [])];
                                                            newAr[bIdx] = e.target.value;
                                                            setEditModalItem({
                                                                ...editModalItem,
                                                                benefits: { ...editModalItem.benefits, ar: newAr },
                                                            });
                                                        }}
                                                        placeholder="وصف الميزة باللغة العربية..."
                                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-body rounded focus:border-ftx-lime focus:outline-none text-right"
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* 2. FEATURE HIGHLIGHT CARDS */}
                                    <div className="space-y-3 pt-2 border-t border-ftx-surface-high/60">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-mono text-ftx-lime uppercase block font-bold tracking-wider">
                                                FEATURE HIGHLIGHT CARDS
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const cur = editModalItem.highlights || [];
                                                    setEditModalItem({
                                                        ...editModalItem,
                                                        highlights: [
                                                            ...cur,
                                                            {
                                                                icon: "shield",
                                                                title: { en: "Feature Title", ar: "عنوان الميزة" },
                                                                description: { en: "Feature details...", ar: "تفاصيل الميزة..." },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                className="text-[10px] font-mono text-ftx-lime hover:underline cursor-pointer"
                                            >
                                                + ADD HIGHLIGHT CARD
                                            </button>
                                        </div>

                                        {(!editModalItem.highlights || editModalItem.highlights.length === 0) ? (
                                            <p className="text-xs text-ftx-silver-muted font-mono italic">No highlight cards configured.</p>
                                        ) : (
                                            editModalItem.highlights.map((hl: any, hIdx: number) => (
                                                <div key={`hl-${hIdx}`} className="p-3.5 bg-ftx-obsidian border border-ftx-surface-high rounded-lg space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-mono text-ftx-silver uppercase">CARD #{hIdx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newHl = [...(editModalItem.highlights || [])];
                                                                newHl.splice(hIdx, 1);
                                                                setEditModalItem({ ...editModalItem, highlights: newHl });
                                                            }}
                                                            className="text-rose-400 text-[10px] font-mono hover:underline cursor-pointer"
                                                        >
                                                            REMOVE
                                                        </button>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-mono text-ftx-silver uppercase">ICON TYPE</label>
                                                        <select
                                                            value={hl.icon || "shield"}
                                                            onChange={(e) => {
                                                                const newHl = [...(editModalItem.highlights || [])];
                                                                newHl[hIdx] = { ...newHl[hIdx], icon: e.target.value };
                                                                setEditModalItem({ ...editModalItem, highlights: newHl });
                                                            }}
                                                            className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded focus:border-ftx-lime focus:outline-none"
                                                        >
                                                            <option value="shield">Shield (Impact / Protection)</option>
                                                            <option value="refresh">Refresh (Self-Healing / Renew)</option>
                                                            <option value="droplet">Droplet (Hydrophobic / Water)</option>
                                                            <option value="sparkles">Sparkles (Gloss / Polish)</option>
                                                            <option value="wand">Wand (Paint Correction)</option>
                                                            <option value="car">Car (Interior / Vehicle)</option>
                                                        </select>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={hl.title?.en || ""}
                                                            onChange={(e) => {
                                                                const newHl = [...(editModalItem.highlights || [])];
                                                                newHl[hIdx] = { ...newHl[hIdx], title: { ...newHl[hIdx].title, en: e.target.value } };
                                                                setEditModalItem({ ...editModalItem, highlights: newHl });
                                                            }}
                                                            placeholder="Highlight Title (EN)..."
                                                            className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded focus:border-ftx-lime focus:outline-none"
                                                        />
                                                        <input
                                                            type="text"
                                                            dir="rtl"
                                                            value={hl.title?.ar || ""}
                                                            onChange={(e) => {
                                                                const newHl = [...(editModalItem.highlights || [])];
                                                                newHl[hIdx] = { ...newHl[hIdx], title: { ...newHl[hIdx].title, ar: e.target.value } };
                                                                setEditModalItem({ ...editModalItem, highlights: newHl });
                                                            }}
                                                            placeholder="عنوان الميزة (عربي)..."
                                                            className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded focus:border-ftx-lime focus:outline-none text-right"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <textarea
                                                            rows={2}
                                                            value={hl.description?.en || ""}
                                                            onChange={(e) => {
                                                                const newHl = [...(editModalItem.highlights || [])];
                                                                newHl[hIdx] = { ...newHl[hIdx], description: { ...newHl[hIdx].description, en: e.target.value } };
                                                                setEditModalItem({ ...editModalItem, highlights: newHl });
                                                            }}
                                                            placeholder="Description (EN)..."
                                                            className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-body rounded focus:border-ftx-lime focus:outline-none"
                                                        />
                                                        <textarea
                                                            rows={2}
                                                            dir="rtl"
                                                            value={hl.description?.ar || ""}
                                                            onChange={(e) => {
                                                                const newHl = [...(editModalItem.highlights || [])];
                                                                newHl[hIdx] = { ...newHl[hIdx], description: { ...newHl[hIdx].description, ar: e.target.value } };
                                                                setEditModalItem({ ...editModalItem, highlights: newHl });
                                                            }}
                                                            placeholder="الوصف التفصيلي (عربي)..."
                                                            className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-body rounded focus:border-ftx-lime focus:outline-none text-right"
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* 3. PROCESS STEPS */}
                                    <div className="space-y-3 pt-2 border-t border-ftx-surface-high/60">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-mono text-ftx-lime uppercase block font-bold tracking-wider">
                                                PROCESS STEPS
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const cur = editModalItem.process || [];
                                                    setEditModalItem({
                                                        ...editModalItem,
                                                        process: [
                                                            ...cur,
                                                            {
                                                                number: `0${cur.length + 1}`,
                                                                title: { en: "Step Title", ar: "عنوان المرحلة" },
                                                                description: { en: "Step description...", ar: "تفاصيل المرحلة..." },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                className="text-[10px] font-mono text-ftx-lime hover:underline cursor-pointer"
                                            >
                                                + ADD PROCESS STEP
                                            </button>
                                        </div>

                                        {(!editModalItem.process || editModalItem.process.length === 0) ? (
                                            <p className="text-xs text-ftx-silver-muted font-mono italic">No process steps added.</p>
                                        ) : (
                                            editModalItem.process.map((step: any, pIdx: number) => (
                                                <div key={`step-${pIdx}`} className="p-3.5 bg-ftx-obsidian border border-ftx-surface-high rounded-lg space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-mono text-ftx-silver uppercase">STEP #{pIdx + 1}</span>
                                                            <input
                                                                type="text"
                                                                value={step.number || `0${pIdx + 1}`}
                                                                onChange={(e) => {
                                                                    const newP = [...(editModalItem.process || [])];
                                                                    newP[pIdx] = { ...newP[pIdx], number: e.target.value };
                                                                    setEditModalItem({ ...editModalItem, process: newP });
                                                                }}
                                                                className="w-12 p-1 bg-ftx-surface border border-ftx-surface-high text-ftx-lime text-center text-xs font-mono rounded"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newP = [...(editModalItem.process || [])];
                                                                newP.splice(pIdx, 1);
                                                                setEditModalItem({ ...editModalItem, process: newP });
                                                            }}
                                                            className="text-rose-400 text-[10px] font-mono hover:underline cursor-pointer"
                                                        >
                                                            REMOVE
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={step.title?.en || ""}
                                                            onChange={(e) => {
                                                                const newP = [...(editModalItem.process || [])];
                                                                newP[pIdx] = { ...newP[pIdx], title: { ...newP[pIdx].title, en: e.target.value } };
                                                                setEditModalItem({ ...editModalItem, process: newP });
                                                            }}
                                                            placeholder="Step Title (EN)..."
                                                            className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded focus:border-ftx-lime focus:outline-none"
                                                        />
                                                        <input
                                                            type="text"
                                                            dir="rtl"
                                                            value={step.title?.ar || ""}
                                                            onChange={(e) => {
                                                                const newP = [...(editModalItem.process || [])];
                                                                newP[pIdx] = { ...newP[pIdx], title: { ...newP[pIdx].title, ar: e.target.value } };
                                                                setEditModalItem({ ...editModalItem, process: newP });
                                                            }}
                                                            placeholder="عنوان المرحلة (عربي)..."
                                                            className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded focus:border-ftx-lime focus:outline-none text-right"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <textarea
                                                            rows={2}
                                                            value={step.description?.en || ""}
                                                            onChange={(e) => {
                                                                const newP = [...(editModalItem.process || [])];
                                                                newP[pIdx] = { ...newP[pIdx], description: { ...newP[pIdx].description, en: e.target.value } };
                                                                setEditModalItem({ ...editModalItem, process: newP });
                                                            }}
                                                            placeholder="Step Description (EN)..."
                                                            className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-body rounded focus:border-ftx-lime focus:outline-none"
                                                        />
                                                        <textarea
                                                            rows={2}
                                                            dir="rtl"
                                                            value={step.description?.ar || ""}
                                                            onChange={(e) => {
                                                                const newP = [...(editModalItem.process || [])];
                                                                newP[pIdx] = { ...newP[pIdx], description: { ...newP[pIdx].description, ar: e.target.value } };
                                                                setEditModalItem({ ...editModalItem, process: newP });
                                                            }}
                                                            placeholder="تفاصيل المرحلة (عربي)..."
                                                            className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-body rounded focus:border-ftx-lime focus:outline-none text-right"
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* 4. DETAIL IMAGES GALLERY */}
                                    <div className="space-y-3 pt-2 border-t border-ftx-surface-high/60">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-mono text-ftx-lime uppercase block font-bold tracking-wider">
                                                GALLERY SHOWCASE IMAGES
                                            </label>
                                            <label className="text-[10px] font-mono text-ftx-lime hover:underline cursor-pointer">
                                                <span>+ UPLOAD SHOWCASE IMAGE</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const formData = new FormData();
                                                        formData.append("file", file);
                                                        try {
                                                            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                                            const data = await res.json();
                                                            if (data.url) {
                                                                const cur = editModalItem.detailImages || [];
                                                                setEditModalItem({ ...editModalItem, detailImages: [...cur, data.url] });
                                                            }
                                                        } catch (err) {
                                                            console.error("Upload error", err);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        {(!editModalItem.detailImages || editModalItem.detailImages.length === 0) ? (
                                            <p className="text-xs text-ftx-silver-muted font-mono italic">No additional showcase images uploaded.</p>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {editModalItem.detailImages.map((imgUrl: string, imgIdx: number) => (
                                                    <div key={`detail-img-${imgIdx}`} className="relative aspect-video bg-ftx-obsidian border border-ftx-surface-high rounded-lg overflow-hidden group">
                                                        <img src={imgUrl} alt={`Showcase ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newImgs = [...(editModalItem.detailImages || [])];
                                                                newImgs.splice(imgIdx, 1);
                                                                setEditModalItem({ ...editModalItem, detailImages: newImgs });
                                                            }}
                                                            className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <XCircle className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-ftx-surface-high">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditModalItem(null);
                                        setEditModalType(null);
                                    }}
                                    className="px-4 py-2.5 bg-ftx-obsidian hover:bg-ftx-surface-high border border-ftx-surface-high text-ftx-silver text-xs font-mono font-bold uppercase rounded-lg"
                                >
                                    CANCEL
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-ftx-lime text-ftx-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-lime-glow hover:bg-ftx-lime-bright transition-all flex items-center gap-2"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>SAVE CHANGES</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Subcomponent for editing section cards
function SectionEditCard({ section, onSave, saving }: { section: any; onSave: (sec: any) => void; saving: boolean }) {
    const isIntroOrPhilosophy = section.sectionKey === "intro" || section.sectionKey === "philosophy";
    const isInfrastructure = section.sectionKey === "infrastructure";
    const isMetrics = section.sectionKey === "metrics";
    const isServices = section.sectionKey === "services";
    const isWhyFtx = section.sectionKey === "why_ftx";

    const [titleEn, setTitleEn] = useState(section.title?.en || "");
    const [titleAr, setTitleAr] = useState(section.title?.ar || "");
    const [subtitleEn, setSubtitleEn] = useState(section.subtitle?.en || "");
    const [subtitleAr, setSubtitleAr] = useState(section.subtitle?.ar || "");
    const [contentEn, setContentEn] = useState(section.content?.en || "");
    const [contentAr, setContentAr] = useState(section.content?.ar || "");

    const [imageUrl, setImageUrl] = useState(section.metadata?.imageUrl || (isIntroOrPhilosophy ? "/images/about/craftsmanship.jpg" : ""));
    const [badgeTitleEn, setBadgeTitleEn] = useState(section.metadata?.badgeTitle?.en || (isIntroOrPhilosophy ? "SURGICAL PRECISION" : ""));
    const [badgeTitleAr, setBadgeTitleAr] = useState(section.metadata?.badgeTitle?.ar || (isIntroOrPhilosophy ? "دقة جراحية" : ""));
    const [badgeSubEn, setBadgeSubEn] = useState(section.metadata?.badgeSub?.en || (isIntroOrPhilosophy ? "Climate-Controlled Studio Bays" : ""));
    const [badgeSubAr, setBadgeSubAr] = useState(section.metadata?.badgeSub?.ar || (isIntroOrPhilosophy ? "ورش مكيفة ومحايدة للحرارة" : ""));

    const [card1Image, setCard1Image] = useState(section.metadata?.card1Image || (isWhyFtx ? "/images/pillars/precision.jpg" : "/images/about/plotter.jpg"));
    const [card1TitleEn, setCard1TitleEn] = useState(section.metadata?.card1Title?.en || (isWhyFtx ? "PRECISION" : "Surgical Plotter Cutting"));
    const [card1TitleAr, setCard1TitleAr] = useState(section.metadata?.card1Title?.ar || (isWhyFtx ? "الدقة المتناهية" : "قص كمبيوتري دقيق (Plotter)"));
    const [card1DescEn, setCard1DescEn] = useState(section.metadata?.card1Desc?.en || (isWhyFtx ? "Microscopic attention to detail with optical-grade alignment." : "Computer-guided DAP software plots vehicle-specific templates so blades never touch your vehicle's factory paint."));
    const [card1DescAr, setCard1DescAr] = useState(section.metadata?.card1Desc?.ar || (isWhyFtx ? "عناية ميكروسكوبية بالتفاصيل مع محاذاة بصرية دقيقة." : "برنامج DAP للقص المباشر يضمن عدم ملامسة المشرط لطلاء المصنع إطلاقاً."));

    const [card2Image, setCard2Image] = useState(section.metadata?.card2Image || (isWhyFtx ? "/images/pillars/protection.jpg" : "/images/about/hepa-bay.jpg"));
    const [card2TitleEn, setCard2TitleEn] = useState(section.metadata?.card2Title?.en || (isWhyFtx ? "PROTECTION" : "HEPA Filtered Air"));
    const [card2TitleAr, setCard2TitleAr] = useState(section.metadata?.card2Title?.ar || (isWhyFtx ? "الحماية الكاملة" : "نظام تصفية الهواء HEPA"));
    const [card2DescEn, setCard2DescEn] = useState(section.metadata?.card2Desc?.en || (isWhyFtx ? "Self-healing thermoplastic shield preserving factory paint." : "Positive air pressure studio bays eliminate airborne dust particles during the PPF installation process."));
    const [card2DescAr, setCard2DescAr] = useState(section.metadata?.card2Desc?.ar || (isWhyFtx ? "درع حراري ذاتي المعالجة يحمي طلاء المصنع." : "نظام الضغط الموجابي يمنع دخول أي ذرات غبار أثناء تركيب فلم الحماية."));

    const [card3Image, setCard3Image] = useState(section.metadata?.card3Image || (isWhyFtx ? "/images/pillars/craftsmanship.jpg" : "/images/about/infrared.jpg"));
    const [card3TitleEn, setCard3TitleEn] = useState(section.metadata?.card3Title?.en || (isWhyFtx ? "CRAFTSMANSHIP" : "Curing Infrared Lamps"));
    const [card3TitleAr, setCard3TitleAr] = useState(section.metadata?.card3Title?.ar || (isWhyFtx ? "الحرفية العالية" : "أشعة التجفيف بالإنفراريد"));
    const [card3DescEn, setCard3DescEn] = useState(section.metadata?.card3Desc?.en || (isWhyFtx ? "Certified master applicators working in climate-controlled bays." : "Shortwave infrared curing locks in ceramic coatings at optimal temperature matrices for maximum gloss and durability."));
    const [card3DescAr, setCard3DescAr] = useState(section.metadata?.card3Desc?.ar || (isWhyFtx ? "فنيون محترفون معتمدون يعملون في بيئة معقمة ومكيفة." : "المعالجة بالأشعة تحت الحمراء تضمن ثبات السيراميك لأقصى لمعان ومتانة."));

    const [card4Image, setCard4Image] = useState(section.metadata?.card4Image || "/images/pillars/performance.jpg");
    const [card4TitleEn, setCard4TitleEn] = useState(section.metadata?.card4Title?.en || "PERFORMANCE");
    const [card4TitleAr, setCard4TitleAr] = useState(section.metadata?.card4Title?.ar || "الأداء المتميز");
    const [card4DescEn, setCard4DescEn] = useState(section.metadata?.card4Desc?.en || "Hydrophobic repellency and deep obsidian gloss enhancement.");
    const [card4DescAr, setCard4DescAr] = useState(section.metadata?.card4Desc?.ar || "خصائص فائقة لطرد المياه ولمعان عميق.");

    const [metric1Val, setMetric1Val] = useState(section.metadata?.metric1Val || "10");
    const [metric1Suffix, setMetric1Suffix] = useState(section.metadata?.metric1Suffix || "+");
    const [metric1LabelEn, setMetric1LabelEn] = useState(section.metadata?.metric1Label?.en || "YEARS EXPERIENCE");
    const [metric1LabelAr, setMetric1LabelAr] = useState(section.metadata?.metric1Label?.ar || "سنوات خبرة");

    const [metric2Val, setMetric2Val] = useState(section.metadata?.metric2Val || "5");
    const [metric2Suffix, setMetric2Suffix] = useState(section.metadata?.metric2Suffix || "K+");
    const [metric2LabelEn, setMetric2LabelEn] = useState(section.metadata?.metric2Label?.en || "VEHICLES PROTECTED");
    const [metric2LabelAr, setMetric2LabelAr] = useState(section.metadata?.metric2Label?.ar || "سيارة تم حمايتها");

    const [metric3Val, setMetric3Val] = useState(section.metadata?.metric3Val || "100");
    const [metric3Suffix, setMetric3Suffix] = useState(section.metadata?.metric3Suffix || "%");
    const [metric3LabelEn, setMetric3LabelEn] = useState(section.metadata?.metric3Label?.en || "SATISFACTION FOCUS");
    const [metric3LabelAr, setMetric3LabelAr] = useState(section.metadata?.metric3Label?.ar || "تركيز على رضا العملاء");

    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        setTitleEn(section.title?.en || "");
        setTitleAr(section.title?.ar || "");
        setSubtitleEn(section.subtitle?.en || "");
        setSubtitleAr(section.subtitle?.ar || "");
        setContentEn(section.content?.en || "");
        setContentAr(section.content?.ar || "");

        const isIntroOrPhil = section.sectionKey === "intro" || section.sectionKey === "philosophy";
        setImageUrl(section.metadata?.imageUrl || (isIntroOrPhil ? "/images/about/craftsmanship.jpg" : ""));
        setBadgeTitleEn(section.metadata?.badgeTitle?.en || (isIntroOrPhil ? "SURGICAL PRECISION" : ""));
        setBadgeTitleAr(section.metadata?.badgeTitle?.ar || (isIntroOrPhil ? "دقة جراحية" : ""));
        setBadgeSubEn(section.metadata?.badgeSub?.en || (isIntroOrPhil ? "Climate-Controlled Studio Bays" : ""));
        setBadgeSubAr(section.metadata?.badgeSub?.ar || (isIntroOrPhil ? "ورش مكيفة ومحايدة للحرارة" : ""));

        const isWhyFtxSec = section.sectionKey === "why_ftx";
        setCard1Image(section.metadata?.card1Image || (isWhyFtxSec ? "/images/pillars/precision.jpg" : "/images/about/plotter.jpg"));
        setCard1TitleEn(section.metadata?.card1Title?.en || (isWhyFtxSec ? "PRECISION" : "Surgical Plotter Cutting"));
        setCard1TitleAr(section.metadata?.card1Title?.ar || (isWhyFtxSec ? "الدقة المتناهية" : "قص كمبيوتري دقيق (Plotter)"));
        setCard1DescEn(section.metadata?.card1Desc?.en || (isWhyFtxSec ? "Microscopic attention to detail with optical-grade alignment." : "Computer-guided DAP software plots vehicle-specific templates so blades never touch your vehicle's factory paint."));
        setCard1DescAr(section.metadata?.card1Desc?.ar || (isWhyFtxSec ? "عناية ميكروسكوبية بالتفاصيل مع محاذاة بصرية دقيقة." : "برنامج DAP للقص المباشر يضمن عدم ملامسة المشرط لطلاء المصنع إطلاقاً."));

        setCard2Image(section.metadata?.card2Image || (isWhyFtxSec ? "/images/pillars/protection.jpg" : "/images/about/hepa-bay.jpg"));
        setCard2TitleEn(section.metadata?.card2Title?.en || (isWhyFtxSec ? "PROTECTION" : "HEPA Filtered Air"));
        setCard2TitleAr(section.metadata?.card2Title?.ar || (isWhyFtxSec ? "الحماية الكاملة" : "نظام تصفية الهواء HEPA"));
        setCard2DescEn(section.metadata?.card2Desc?.en || (isWhyFtxSec ? "Self-healing thermoplastic shield preserving factory paint." : "Positive air pressure studio bays eliminate airborne dust particles during the PPF installation process."));
        setCard2DescAr(section.metadata?.card2Desc?.ar || (isWhyFtxSec ? "درع حراري ذاتي المعالجة يحمي طلاء المصنع." : "نظام الضغط الموجابي يمنع دخول أي ذرات غبار أثناء تركيب فلم الحماية."));

        setCard3Image(section.metadata?.card3Image || (isWhyFtxSec ? "/images/pillars/craftsmanship.jpg" : "/images/about/infrared.jpg"));
        setCard3TitleEn(section.metadata?.card3Title?.en || (isWhyFtxSec ? "CRAFTSMANSHIP" : "Curing Infrared Lamps"));
        setCard3TitleAr(section.metadata?.card3Title?.ar || (isWhyFtxSec ? "الحرفية العالية" : "أشعة التجفيف بالإنفراريد"));
        setCard3DescEn(section.metadata?.card3Desc?.en || (isWhyFtxSec ? "Certified master applicators working in climate-controlled bays." : "Shortwave infrared curing locks in ceramic coatings at optimal temperature matrices for maximum gloss and durability."));
        setCard3DescAr(section.metadata?.card3Desc?.ar || (isWhyFtxSec ? "فنيون محترفون معتمدون يعملون في بيئة معقمة ومكيفة." : "المعالجة بالأشعة تحت الحمراء تضمن ثبات السيراميك لأقصى لمعان ومتانة."));

        setCard4Image(section.metadata?.card4Image || "/images/pillars/performance.jpg");
        setCard4TitleEn(section.metadata?.card4Title?.en || "PERFORMANCE");
        setCard4TitleAr(section.metadata?.card4Title?.ar || "الأداء المتميز");
        setCard4DescEn(section.metadata?.card4Desc?.en || "Hydrophobic repellency and deep obsidian gloss enhancement.");
        setCard4DescAr(section.metadata?.card4Desc?.ar || "خصائص فائقة لطرد المياه ولمعان عميق.");

        setMetric1Val(section.metadata?.metric1Val || "10");
        setMetric1Suffix(section.metadata?.metric1Suffix || "+");
        setMetric1LabelEn(section.metadata?.metric1Label?.en || "YEARS EXPERIENCE");
        setMetric1LabelAr(section.metadata?.metric1Label?.ar || "سنوات خبرة");

        setMetric2Val(section.metadata?.metric2Val || "5");
        setMetric2Suffix(section.metadata?.metric2Suffix || "K+");
        setMetric2LabelEn(section.metadata?.metric2Label?.en || "VEHICLES PROTECTED");
        setMetric2LabelAr(section.metadata?.metric2Label?.ar || "سيارة تم حمايتها");

        setMetric3Val(section.metadata?.metric3Val || "100");
        setMetric3Suffix(section.metadata?.metric3Suffix || "%");
        setMetric3LabelEn(section.metadata?.metric3Label?.en || "SATISFACTION FOCUS");
        setMetric3LabelAr(section.metadata?.metric3Label?.ar || "تركيز على رضا العملاء");
    }, [section]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, cardKey?: "card1Image" | "card2Image" | "card3Image" | "card4Image") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                if (cardKey === "card1Image") setCard1Image(data.url);
                else if (cardKey === "card2Image") setCard2Image(data.url);
                else if (cardKey === "card3Image") setCard3Image(data.url);
                else if (cardKey === "card4Image") setCard4Image(data.url);
                else setImageUrl(data.url);
            }
        } catch (err) {
            console.error("Image upload failed:", err);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = () => {
        onSave({
            ...section,
            title: { en: titleEn, ar: titleAr },
            subtitle: { en: subtitleEn, ar: subtitleAr },
            content: { en: contentEn, ar: contentAr },
            metadata: {
                ...section.metadata,
                ...(imageUrl ? { imageUrl } : {}),
                ...(isInfrastructure || isWhyFtx
                    ? {
                        card1Image,
                        card1Title: { en: card1TitleEn, ar: card1TitleAr },
                        card1Desc: { en: card1DescEn, ar: card1DescAr },
                        card2Image,
                        card2Title: { en: card2TitleEn, ar: card2TitleAr },
                        card2Desc: { en: card2DescEn, ar: card2DescAr },
                        card3Image,
                        card3Title: { en: card3TitleEn, ar: card3TitleAr },
                        card3Desc: { en: card3DescEn, ar: card3DescAr },
                        ...(isWhyFtx
                            ? {
                                card4Image,
                                card4Title: { en: card4TitleEn, ar: card4TitleAr },
                                card4Desc: { en: card4DescEn, ar: card4DescAr },
                            }
                            : {}),
                    }
                    : {}),
                ...(isMetrics
                    ? {
                        metric1Val,
                        metric1Suffix,
                        metric1Label: { en: metric1LabelEn, ar: metric1LabelAr },
                        metric2Val,
                        metric2Suffix,
                        metric2Label: { en: metric2LabelEn, ar: metric2LabelAr },
                        metric3Val,
                        metric3Suffix,
                        metric3Label: { en: metric3LabelEn, ar: metric3LabelAr },
                    }
                    : {}),
                ...(badgeTitleEn || badgeTitleAr ? { badgeTitle: { en: badgeTitleEn, ar: badgeTitleAr } } : {}),
                ...(badgeSubEn || badgeSubAr ? { badgeSub: { en: badgeSubEn, ar: badgeSubAr } } : {}),
            },
        });
    };

    return (
        <div className="bg-ftx-surface border border-ftx-surface-high p-6 ftx-squircle-lg space-y-6">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-ftx-surface-high pb-4">
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 text-xs font-mono font-bold uppercase rounded-md">
                        {section.page.toUpperCase()} / {section.sectionKey.toUpperCase()}
                    </span>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 bg-ftx-lime hover:bg-ftx-lime-bright text-ftx-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow-lime-glow transition-all flex items-center gap-2"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>SAVE SECTION</span>
                </button>
            </div>

            {/* Section Media & Image Upload Bar (Only shown for Intro section or when image metadata exists) */}
            {(isIntroOrPhilosophy || imageUrl) && (
                <div className="bg-ftx-obsidian border border-ftx-surface-high p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-ftx-lime uppercase">SECTION MEDIA & IMAGE</span>
                        <span className="text-[10px] font-mono text-ftx-silver-muted">PNG, JPG, WEBP SUPPORTED</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Live Image Preview Thumbnail */}
                        <div className="relative w-28 h-20 bg-ftx-surface border border-ftx-surface-high rounded-lg overflow-hidden shrink-0">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Section media" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-ftx-silver-muted font-mono">No Image</div>
                            )}
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="/images/about/craftsmanship.jpg or https://..."
                                    className="flex-1 p-2.5 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                />
                                <label className="px-4 py-2.5 bg-ftx-surface-high hover:bg-ftx-surface text-white text-xs font-mono font-bold uppercase rounded-lg cursor-pointer transition-colors shrink-0 flex items-center gap-2 border border-ftx-silver/20">
                                    {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5 text-ftx-lime" />}
                                    <span>{uploadingImage ? "UPLOADING..." : "UPLOAD FILE"}</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Infrastructure or Why FTX Cards Block */}
            {(isInfrastructure || isWhyFtx) && (
                <div className="bg-ftx-obsidian border border-ftx-surface-high p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-ftx-lime uppercase">
                            {isWhyFtx ? "WHY CHOOSE FTX PILLARS (4 CARDS)" : "INFRASTRUCTURE FACILITY IMAGES (3 CARDS)"}
                        </span>
                        <span className="text-[10px] font-mono text-ftx-silver-muted font-bold">IMAGE UPLOAD & URL EDITING</span>
                    </div>

                    <div className={`grid grid-cols-1 ${isWhyFtx ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"} gap-4`}>
                        {/* Card 1 */}
                        <div className="space-y-2.5 bg-ftx-surface/50 p-3 rounded-lg border border-ftx-surface-high/50">
                            <span className="text-[10px] font-mono font-bold text-white uppercase block">
                                {isWhyFtx ? "CARD 1: PRECISION" : "CARD 1: PLOTTER CUTTING"}
                            </span>
                            <div className="relative w-full aspect-[16/10] bg-ftx-surface border border-ftx-surface-high rounded-md overflow-hidden">
                                {card1Image ? (
                                    <img src={card1Image} alt="Card 1" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-ftx-silver-muted font-mono">No Image</div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={card1Image}
                                onChange={(e) => setCard1Image(e.target.value)}
                                placeholder="/images/pillars/precision.jpg"
                                className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                            />
                            <label className="w-full py-2 bg-ftx-surface-high hover:bg-ftx-surface text-white text-[11px] font-mono font-bold uppercase rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5 border border-ftx-silver/20">
                                {uploadingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3 text-ftx-lime" />}
                                <span>UPLOAD IMAGE</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "card1Image")} className="hidden" />
                            </label>

                            <div className="space-y-1 pt-1">
                                <span className="text-[9px] font-mono text-ftx-silver uppercase block">TITLE (EN / AR)</span>
                                <input
                                    type="text"
                                    value={card1TitleEn}
                                    onChange={(e) => setCard1TitleEn(e.target.value)}
                                    placeholder="Title (EN)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none mb-1"
                                />
                                <input
                                    type="text"
                                    value={card1TitleAr}
                                    onChange={(e) => setCard1TitleAr(e.target.value)}
                                    placeholder="العنوان (بالعربية)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none text-right"
                                />
                            </div>

                            <div className="space-y-1">
                                <span className="text-[9px] font-mono text-ftx-silver uppercase block">DESCRIPTION (EN / AR)</span>
                                <textarea
                                    rows={2}
                                    value={card1DescEn}
                                    onChange={(e) => setCard1DescEn(e.target.value)}
                                    placeholder="Description (EN)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-body rounded-md focus:border-ftx-lime focus:outline-none mb-1 leading-normal"
                                />
                                <textarea
                                    rows={2}
                                    value={card1DescAr}
                                    onChange={(e) => setCard1DescAr(e.target.value)}
                                    placeholder="الوصف (بالعربية)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-body rounded-md focus:border-ftx-lime focus:outline-none text-right leading-normal"
                                />
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="space-y-2.5 bg-ftx-surface/50 p-3 rounded-lg border border-ftx-surface-high/50">
                            <span className="text-[10px] font-mono font-bold text-white uppercase block">
                                {isWhyFtx ? "CARD 2: PROTECTION" : "CARD 2: HEPA BAY AIR"}
                            </span>
                            <div className="relative w-full aspect-[16/10] bg-ftx-surface border border-ftx-surface-high rounded-md overflow-hidden">
                                {card2Image ? (
                                    <img src={card2Image} alt="Card 2" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-ftx-silver-muted font-mono">No Image</div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={card2Image}
                                onChange={(e) => setCard2Image(e.target.value)}
                                placeholder="/images/pillars/protection.jpg"
                                className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                            />
                            <label className="w-full py-2 bg-ftx-surface-high hover:bg-ftx-surface text-white text-[11px] font-mono font-bold uppercase rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5 border border-ftx-silver/20">
                                {uploadingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3 text-ftx-lime" />}
                                <span>UPLOAD IMAGE</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "card2Image")} className="hidden" />
                            </label>

                            <div className="space-y-1 pt-1">
                                <span className="text-[9px] font-mono text-ftx-silver uppercase block">TITLE (EN / AR)</span>
                                <input
                                    type="text"
                                    value={card2TitleEn}
                                    onChange={(e) => setCard2TitleEn(e.target.value)}
                                    placeholder="Title (EN)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none mb-1"
                                />
                                <input
                                    type="text"
                                    value={card2TitleAr}
                                    onChange={(e) => setCard2TitleAr(e.target.value)}
                                    placeholder="العنوان (بالعربية)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none text-right"
                                />
                            </div>

                            <div className="space-y-1">
                                <span className="text-[9px] font-mono text-ftx-silver uppercase block">DESCRIPTION (EN / AR)</span>
                                <textarea
                                    rows={2}
                                    value={card2DescEn}
                                    onChange={(e) => setCard2DescEn(e.target.value)}
                                    placeholder="Description (EN)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-body rounded-md focus:border-ftx-lime focus:outline-none mb-1 leading-normal"
                                />
                                <textarea
                                    rows={2}
                                    value={card2DescAr}
                                    onChange={(e) => setCard2DescAr(e.target.value)}
                                    placeholder="الوصف (بالعربية)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-body rounded-md focus:border-ftx-lime focus:outline-none text-right leading-normal"
                                />
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="space-y-2.5 bg-ftx-surface/50 p-3 rounded-lg border border-ftx-surface-high/50">
                            <span className="text-[10px] font-mono font-bold text-white uppercase block">
                                {isWhyFtx ? "CARD 3: CRAFTSMANSHIP" : "CARD 3: INFRARED CURING"}
                            </span>
                            <div className="relative w-full aspect-[16/10] bg-ftx-surface border border-ftx-surface-high rounded-md overflow-hidden">
                                {card3Image ? (
                                    <img src={card3Image} alt="Card 3" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-ftx-silver-muted font-mono">No Image</div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={card3Image}
                                onChange={(e) => setCard3Image(e.target.value)}
                                placeholder="/images/pillars/craftsmanship.jpg"
                                className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                            />
                            <label className="w-full py-2 bg-ftx-surface-high hover:bg-ftx-surface text-white text-[11px] font-mono font-bold uppercase rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5 border border-ftx-silver/20">
                                {uploadingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3 text-ftx-lime" />}
                                <span>UPLOAD IMAGE</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "card3Image")} className="hidden" />
                            </label>

                            <div className="space-y-1 pt-1">
                                <span className="text-[9px] font-mono text-ftx-silver uppercase block">TITLE (EN / AR)</span>
                                <input
                                    type="text"
                                    value={card3TitleEn}
                                    onChange={(e) => setCard3TitleEn(e.target.value)}
                                    placeholder="Title (EN)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none mb-1"
                                />
                                <input
                                    type="text"
                                    value={card3TitleAr}
                                    onChange={(e) => setCard3TitleAr(e.target.value)}
                                    placeholder="العنوان (بالعربية)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none text-right"
                                />
                            </div>

                            <div className="space-y-1">
                                <span className="text-[9px] font-mono text-ftx-silver uppercase block">DESCRIPTION (EN / AR)</span>
                                <textarea
                                    rows={2}
                                    value={card3DescEn}
                                    onChange={(e) => setCard3DescEn(e.target.value)}
                                    placeholder="Description (EN)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-body rounded-md focus:border-ftx-lime focus:outline-none mb-1 leading-normal"
                                />
                                <textarea
                                    rows={2}
                                    value={card3DescAr}
                                    onChange={(e) => setCard3DescAr(e.target.value)}
                                    placeholder="الوصف (بالعربية)"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-body rounded-md focus:border-ftx-lime focus:outline-none text-right leading-normal"
                                />
                            </div>
                        </div>

                        {/* Card 4 (Why FTX only) */}
                        {isWhyFtx && (
                            <div className="space-y-2.5 bg-ftx-surface/50 p-3 rounded-lg border border-ftx-surface-high/50">
                                <span className="text-[10px] font-mono font-bold text-white uppercase block">CARD 4: PERFORMANCE</span>
                                <div className="relative w-full aspect-[16/10] bg-ftx-surface border border-ftx-surface-high rounded-md overflow-hidden">
                                    {card4Image ? (
                                        <img src={card4Image} alt="Card 4" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-ftx-silver-muted font-mono">No Image</div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={card4Image}
                                    onChange={(e) => setCard4Image(e.target.value)}
                                    placeholder="/images/pillars/performance.jpg"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                                />
                                <label className="w-full py-2 bg-ftx-surface-high hover:bg-ftx-surface text-white text-[11px] font-mono font-bold uppercase rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5 border border-ftx-silver/20">
                                    {uploadingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3 text-ftx-lime" />}
                                    <span>UPLOAD IMAGE</span>
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "card4Image")} className="hidden" />
                                </label>

                                <div className="space-y-1 pt-1">
                                    <span className="text-[9px] font-mono text-ftx-silver uppercase block">TITLE (EN / AR)</span>
                                    <input
                                        type="text"
                                        value={card4TitleEn}
                                        onChange={(e) => setCard4TitleEn(e.target.value)}
                                        placeholder="Title (EN)"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none mb-1"
                                    />
                                    <input
                                        type="text"
                                        value={card4TitleAr}
                                        onChange={(e) => setCard4TitleAr(e.target.value)}
                                        placeholder="العنوان (بالعربية)"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-mono rounded-md focus:border-ftx-lime focus:outline-none text-right"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-ftx-silver uppercase block">DESCRIPTION (EN / AR)</span>
                                    <textarea
                                        rows={2}
                                        value={card4DescEn}
                                        onChange={(e) => setCard4DescEn(e.target.value)}
                                        placeholder="Description (EN)"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-body rounded-md focus:border-ftx-lime focus:outline-none mb-1 leading-normal"
                                    />
                                    <textarea
                                        rows={2}
                                        value={card4DescAr}
                                        onChange={(e) => setCard4DescAr(e.target.value)}
                                        placeholder="الوصف (بالعربية)"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-[11px] font-body rounded-md focus:border-ftx-lime focus:outline-none text-right leading-normal"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Performance Metrics Cards Management Block */}
            {isMetrics && (
                <div className="bg-ftx-obsidian border border-ftx-lime/30 p-5 rounded-xl space-y-4 shadow-lg shadow-ftx-lime/5">
                    <div className="flex items-center justify-between border-b border-ftx-surface-high pb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-ftx-lime animate-pulse"></span>
                            <span className="text-xs font-mono font-bold text-ftx-lime uppercase">PERFORMANCE METRICS COUNTERS (3 CARDS)</span>
                        </div>
                        <span className="text-[10px] font-mono text-ftx-silver-muted">LIVE COUNTER ANIMATIONS</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Metric 1 */}
                        <div className="space-y-3 bg-ftx-surface/50 p-3.5 rounded-lg border border-ftx-surface-high/50">
                            <span className="text-[10px] font-mono font-bold text-white uppercase block">METRIC 1 (E.G. 10+)</span>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-ftx-silver uppercase block">NUMBER</span>
                                    <input
                                        type="text"
                                        value={metric1Val}
                                        onChange={(e) => setMetric1Val(e.target.value)}
                                        placeholder="10"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-ftx-silver uppercase block">SUFFIX</span>
                                    <input
                                        type="text"
                                        value={metric1Suffix}
                                        onChange={(e) => setMetric1Suffix(e.target.value)}
                                        placeholder="+"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 pt-1">
                                <span className="text-[9px] font-mono text-ftx-silver uppercase block">LABEL (EN / AR)</span>
                                <input
                                    type="text"
                                    value={metric1LabelEn}
                                    onChange={(e) => setMetric1LabelEn(e.target.value)}
                                    placeholder="YEARS EXPERIENCE"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none mb-1"
                                />
                                <input
                                    type="text"
                                    value={metric1LabelAr}
                                    onChange={(e) => setMetric1LabelAr(e.target.value)}
                                    placeholder="سنوات خبرة"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none text-right"
                                />
                            </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="space-y-3 bg-ftx-surface/50 p-3.5 rounded-lg border border-ftx-surface-high/50">
                            <span className="text-[10px] font-mono font-bold text-white uppercase block">METRIC 2 (E.G. 5K+)</span>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-ftx-silver uppercase block">NUMBER</span>
                                    <input
                                        type="text"
                                        value={metric2Val}
                                        onChange={(e) => setMetric2Val(e.target.value)}
                                        placeholder="5"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-ftx-silver uppercase block">SUFFIX</span>
                                    <input
                                        type="text"
                                        value={metric2Suffix}
                                        onChange={(e) => setMetric2Suffix(e.target.value)}
                                        placeholder="K+"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 pt-1">
                                <span className="text-[9px] font-mono text-ftx-silver uppercase block">LABEL (EN / AR)</span>
                                <input
                                    type="text"
                                    value={metric2LabelEn}
                                    onChange={(e) => setMetric2LabelEn(e.target.value)}
                                    placeholder="VEHICLES PROTECTED"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none mb-1"
                                />
                                <input
                                    type="text"
                                    value={metric2LabelAr}
                                    onChange={(e) => setMetric2LabelAr(e.target.value)}
                                    placeholder="سيارة تم حمايتها"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none text-right"
                                />
                            </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="space-y-3 bg-ftx-surface/50 p-3.5 rounded-lg border border-ftx-surface-high/50">
                            <span className="text-[10px] font-mono font-bold text-white uppercase block">METRIC 3 (E.G. 100%)</span>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-ftx-silver uppercase block">NUMBER</span>
                                    <input
                                        type="text"
                                        value={metric3Val}
                                        onChange={(e) => setMetric3Val(e.target.value)}
                                        placeholder="100"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-ftx-silver uppercase block">SUFFIX</span>
                                    <input
                                        type="text"
                                        value={metric3Suffix}
                                        onChange={(e) => setMetric3Suffix(e.target.value)}
                                        placeholder="%"
                                        className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 pt-1">
                                <span className="text-[9px] font-mono text-ftx-silver uppercase block">LABEL (EN / AR)</span>
                                <input
                                    type="text"
                                    value={metric3LabelEn}
                                    onChange={(e) => setMetric3LabelEn(e.target.value)}
                                    placeholder="SATISFACTION FOCUS"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none mb-1"
                                />
                                <input
                                    type="text"
                                    value={metric3LabelAr}
                                    onChange={(e) => setMetric3LabelAr(e.target.value)}
                                    placeholder="تركيز على رضا العملاء"
                                    className="w-full p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-md focus:border-ftx-lime focus:outline-none text-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section Badge Card Inputs (Only shown for Intro section or when badge metadata exists) */}
            {(isIntroOrPhilosophy || badgeTitleEn || badgeSubEn) && (
                <div className="bg-ftx-obsidian/60 border border-ftx-surface-high/60 p-4 rounded-xl space-y-3">
                    <span className="text-xs font-mono font-bold text-ftx-silver uppercase block">OVERLAY BADGE CARD (SURGICAL PRECISION / CLINIC BAY)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-[10px] font-mono text-ftx-silver-muted uppercase block">BADGE TITLE (EN & AR)</span>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={badgeTitleEn}
                                    onChange={(e) => setBadgeTitleEn(e.target.value)}
                                    placeholder="SURGICAL PRECISION"
                                    className="p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                />
                                <input
                                    type="text"
                                    value={badgeTitleAr}
                                    onChange={(e) => setBadgeTitleAr(e.target.value)}
                                    placeholder="دقة جراحية"
                                    className="p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none text-right"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-mono text-ftx-silver-muted uppercase block">BADGE SUBTITLE (EN & AR)</span>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={badgeSubEn}
                                    onChange={(e) => setBadgeSubEn(e.target.value)}
                                    placeholder="Climate-Controlled Studio Bays"
                                    className="p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                                />
                                <input
                                    type="text"
                                    value={badgeSubAr}
                                    onChange={(e) => setBadgeSubAr(e.target.value)}
                                    placeholder="ورش مكيفة ومحايدة للحرارة"
                                    className="p-2 bg-ftx-surface border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none text-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Form Grid */}
            {!isMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[11px] font-mono text-ftx-lime uppercase block font-bold tracking-wider">
                            ENGLISH CONTENT
                        </label>

                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-ftx-silver uppercase block">TITLE (EN)</span>
                            <input
                                type="text"
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                className="w-full p-2.5 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-ftx-silver uppercase block">SUBTITLE (EN)</span>
                            <input
                                type="text"
                                value={subtitleEn}
                                onChange={(e) => setSubtitleEn(e.target.value)}
                                className="w-full p-2.5 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none"
                            />
                        </div>

                        {!isInfrastructure && !isServices && !isWhyFtx && (
                            <div className="space-y-1">
                                <span className="text-[10px] font-mono text-ftx-silver uppercase block">MAIN BODY (EN)</span>
                                <textarea
                                    rows={4}
                                    value={contentEn}
                                    onChange={(e) => setContentEn(e.target.value)}
                                    className="w-full p-2.5 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-body rounded-lg focus:border-ftx-lime focus:outline-none leading-relaxed"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3" dir="rtl">
                        <label className="text-[11px] font-mono text-ftx-lime uppercase block font-bold text-right tracking-wider">
                            المحتوى باللغة العربية
                        </label>

                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-ftx-silver uppercase block text-right">العنوان الرئيسي</span>
                            <input
                                type="text"
                                value={titleAr}
                                onChange={(e) => setTitleAr(e.target.value)}
                                className="w-full p-2.5 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none text-right"
                            />
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-ftx-silver uppercase block text-right">العنوان الفرعي</span>
                            <input
                                type="text"
                                value={subtitleAr}
                                onChange={(e) => setSubtitleAr(e.target.value)}
                                className="w-full p-2.5 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-mono rounded-lg focus:border-ftx-lime focus:outline-none text-right"
                            />
                        </div>

                        {!isInfrastructure && !isServices && !isWhyFtx && (
                            <div className="space-y-1">
                                <span className="text-[10px] font-mono text-ftx-silver uppercase block text-right">المتن التفصيلي</span>
                                <textarea
                                    rows={4}
                                    value={contentAr}
                                    onChange={(e) => setContentAr(e.target.value)}
                                    className="w-full p-2.5 bg-ftx-obsidian border border-ftx-surface-high text-white text-xs font-body rounded-lg focus:border-ftx-lime focus:outline-none text-right leading-relaxed"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
