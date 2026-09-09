import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Award, Wrench } from "lucide-react";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

import { getSectionsForPage } from "@/lib/sections";

export const dynamic = "force-dynamic";

async function getMessages(locale: Locale) {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
}

interface AboutPageProps {
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: AboutPageProps) {
    const isAr = locale === "ar";
    return {
        title: isAr
            ? "من نحن | معايير الدقة الجراحية وحماية السيارات | First Torque X"
            : "About Us | Surgical Standards & Luxury Car Protection | First Torque X",
        description: isAr
            ? "تعرف على فلسفة FTX وشغفنا بالكمال في حماية وتجميل أحدث السيارات الفاخرة والدقيقة داخل كبائن معقمة ومتحكم بها مناخياً."
            : "Discover the ethos of FTX. Engineered for perfection with surgical paint protection film (PPF), nano-ceramic coatings, and bespoke detailing inside climate-controlled studio bays.",
        alternates: {
            canonical: `https://ftx.ae/${locale}/about`,
            languages: {
                en: "https://ftx.ae/en/about",
                ar: "https://ftx.ae/ar/about",
            },
        },
        openGraph: {
            title: isAr
                ? "من نحن | استوديو First Torque X"
                : "About Us | First Torque X Automotive Studio",
            description: isAr
                ? "تعرف على فلسفة FTX ومعايير الدقة الجراحية في حماية وتلميع السيارات الفاخرة."
                : "Discover the craftsmanship and climate-controlled studio infrastructure of First Torque X.",
            url: `https://ftx.ae/${locale}/about`,
            siteName: "First Torque X",
            images: [
                {
                    url: "/images/about/craftsmanship.jpg",
                    width: 1200,
                    height: 630,
                    alt: "FTX Craftsmanship & Detailing Bay",
                },
            ],
            locale: isAr ? "ar_AE" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: isAr ? "من نحن | First Torque X" : "About Us | First Torque X",
            description: isAr
                ? "تعرف على فلسفة FTX ومعايير الدقة الجراحية في حماية السيارات."
                : "Discover the ethos and precision studio bays of First Torque X.",
            images: ["/images/about/craftsmanship.jpg"],
        },
    };
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
    const messages = await getMessages(locale);
    const sections = await getSectionsForPage("about");

    const heroSec = sections.find((s) => s.sectionKey === "hero");
    const philosophySec = sections.find((s) => s.sectionKey === "philosophy");
    const infraSec = sections.find((s) => s.sectionKey === "infrastructure");
    const metricsSec = sections.find((s) => s.sectionKey === "metrics");

    const isAr = locale === "ar";

    const heroBadge = heroSec?.subtitle?.[locale] || messages.about?.heroBadge || messages.nav?.about || (isAr ? "دقة وحماية" : "PRECISION PROTECTION");
    const heroTitle = heroSec?.title?.[locale] || (isAr ? "دقة وإتقان." : "DRIVEN BY PRECISION.");
    const heroSub = heroSec?.content?.[locale] || messages.about?.heroSub || messages.intro?.p1;

    const philosophyBadge = philosophySec?.subtitle?.[locale] || (isAr ? "معيار FTX" : "THE FTX STANDARD");
    const philosophyTitle = philosophySec?.title?.[locale] || (isAr ? "هندسة السيارات تلتقي بدقة التلميع" : "PRECISION AUTOMOTIVE ENGINEERING MEETS BESPOKE DETAILING");
    const philosophyContent = philosophySec?.content?.[locale] || messages.intro?.p1;
    const philosophyImage = philosophySec?.metadata?.imageUrl || "/images/about/craftsmanship.jpg";

    const stat1Val = Number(philosophySec?.metadata?.stat1Val) || 100;
    const stat1Suffix = philosophySec?.metadata?.stat1Suffix ?? "%";
    const stat1Label = philosophySec?.metadata?.stat1Label?.[locale] || (isAr ? "كبائن خالية من الغبار" : "Dust-Free Bays");

    const stat2Val = Number(philosophySec?.metadata?.stat2Val) || 1500;
    const stat2Suffix = philosophySec?.metadata?.stat2Suffix ?? "+";
    const stat2Label = philosophySec?.metadata?.stat2Label?.[locale] || (isAr ? "سيارة فائقة تم حمايتها" : "Supercars Protected");

    const infraBadge = infraSec?.subtitle?.[locale] || (isAr ? "البنية التحتية" : "INFRASTRUCTURE");
    const infraTitle = infraSec?.title?.[locale] || (isAr ? "كبائن دقيقة ببيئة حرارية متحكم بها" : "CLIMATE-CONTROLLED PRECISION BAYS");
    const infraContent = infraSec?.content?.[locale];

    const infraCard1Image = infraSec?.metadata?.card1Image || "/images/about/plotter.jpg";
    const infraCard1Title = infraSec?.metadata?.card1Title?.[locale] || (isAr ? "قص كمبيوتري دقيق (Plotter)" : "Precision Plotter Cutting");
    const infraCard1Desc = infraSec?.metadata?.card1Desc?.[locale] || (isAr ? "برنامج DAP للقص المباشر يضمن عدم ملامسة المشرط لطلاء المصنع إطلاقاً." : "Computer-guided DAP software plots vehicle-specific templates so blades never touch your vehicle's factory paint.");

    const infraCard2Image = infraSec?.metadata?.card2Image || "/images/about/hepa-bay.jpg";
    const infraCard2Title = infraSec?.metadata?.card2Title?.[locale] || (isAr ? "نظام تصفية الهواء HEPA" : "HEPA Filtered Air");
    const infraCard2Desc = infraSec?.metadata?.card2Desc?.[locale] || (isAr ? "نظام الضغط الموجابي يمنع دخول أي ذرات غبار أثناء تركيب فلم الحماية." : "Positive air pressure studio bays eliminate airborne dust particles during the PPF installation process.");

    const infraCard3Image = infraSec?.metadata?.card3Image || "/images/about/infrared.jpg";
    const infraCard3Title = infraSec?.metadata?.card3Title?.[locale] || (isAr ? "أشعة التجفيف بالإنفراريد" : "Curing Infrared Lamps");
    const infraCard3Desc = infraSec?.metadata?.card3Desc?.[locale] || (isAr ? "المعالجة بالأشعة تحت الحمراء تضمن ثبات السيراميك لأقصى لمعان ومتانة." : "Shortwave infrared curing locks in ceramic coatings at optimal temperature matrices for maximum gloss and durability.");

    const metric1Val = Number(metricsSec?.metadata?.metric1Val) || 10;
    const metric1Suffix = metricsSec?.metadata?.metric1Suffix ?? "+";
    const metric1Label = metricsSec?.metadata?.metric1Label?.[locale] || (isAr ? "سنوات خبرة" : "YEARS EXPERIENCE");

    const metric2Val = Number(metricsSec?.metadata?.metric2Val) || 5;
    const metric2Suffix = metricsSec?.metadata?.metric2Suffix ?? "K+";
    const metric2Label = metricsSec?.metadata?.metric2Label?.[locale] || (isAr ? "سيارة تم حمايتها" : "VEHICLES PROTECTED");

    const metric3Val = Number(metricsSec?.metadata?.metric3Val) || 100;
    const metric3Suffix = metricsSec?.metadata?.metric3Suffix ?? "%";
    const metric3Label = metricsSec?.metadata?.metric3Label?.[locale] || (isAr ? "تركيز على رضا العملاء" : "SATISFACTION FOCUS");

    return (
        <div className="pt-[88px] sm:pt-[96px] pb-0 bg-black min-h-screen relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Top Right) */}
            <div
                className="absolute top-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse 80% 70% at 100% 0%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />
            {/* Synchronized Global Header */}
            <PageHeader
                badge={heroBadge}
                title={heroTitle}
                subtitle={heroSub}
            />

            {/* Studio Philosophy & Craftsmanship */}
            {philosophySec?.isVisible !== false && (
                <section className="py-10 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <ScrollReveal type="editorial" className="lg:col-span-6 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ftx-surface border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime uppercase rounded">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>{philosophyBadge}</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
                                {philosophyTitle}
                            </h2>

                            <div className="space-y-4 text-xs sm:text-sm text-ftx-silver font-body leading-relaxed">
                                <p>{philosophyContent}</p>
                                <p>{messages.intro?.p2}</p>
                            </div>

                            {(philosophySec?.metadata?.showStatCards !== false) && (
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="p-4 bg-ftx-surface border border-ftx-surface-high ftx-squircle-md">
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-ftx-lime">
                                            <AnimatedCounter target={stat1Val} suffix={stat1Suffix} />
                                        </div>
                                        <div className="text-[10px] font-mono text-ftx-silver uppercase mt-1">
                                            {stat1Label}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-ftx-surface border border-ftx-surface-high ftx-squircle-md">
                                        <div className="text-2xl sm:text-3xl font-mono font-black text-ftx-lime">
                                            <AnimatedCounter target={stat2Val} suffix={stat2Suffix} />
                                        </div>
                                        <div className="text-[10px] font-mono text-ftx-silver uppercase mt-1">
                                            {stat2Label}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </ScrollReveal>

                        <ScrollReveal type="image-mask" delay={150} className="lg:col-span-6 relative">
                            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-ftx-surface-high shadow-2xl">
                                <Image
                                    src={philosophyImage}
                                    alt="FTX Studio Master Technicians"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* Facilities & Equipment Highlights */}
            {infraSec?.isVisible !== false && (
                <section className="py-6 sm:py-8 bg-black relative overflow-hidden">
                    {/* Atmospheric Lime Ambient Glow (Bottom Left) */}
                    <div
                        className="absolute bottom-0 left-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
                        style={{ background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
                    />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <ScrollReveal type="editorial" className="text-left rtl:text-right mb-6 sm:mb-8">
                            <span className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                {infraBadge}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase mt-1">
                                {infraTitle}
                            </h2>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <ScrollReveal type="editorial" delay={100} className="h-full flex flex-col">
                                <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface border border-ftx-surface-high h-full shadow-xl">
                                    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-ftx-surface">
                                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-ftx-surface">
                                            <Image
                                                src={infraCard1Image}
                                                alt="Surgical Plotter Cutting"
                                                fill
                                                className="object-cover transform-gpu transition-transform duration-700 ease-out md:group-hover:scale-110"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ftx-surface via-ftx-surface/60 to-transparent pointer-events-none z-10" />
                                            <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform z-20">
                                                <Wrench className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between bg-ftx-surface relative z-10">
                                            <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                                {infraCard1Title}
                                            </h3>
                                            <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                                {infraCard1Desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal type="editorial" delay={200} className="h-full flex flex-col">
                                <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface border border-ftx-surface-high h-full shadow-xl">
                                    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-ftx-surface">
                                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-ftx-surface">
                                            <Image
                                                src={infraCard2Image}
                                                alt="HEPA Filtered Air"
                                                fill
                                                className="object-cover transform-gpu transition-transform duration-700 ease-out md:group-hover:scale-110"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ftx-surface via-ftx-surface/60 to-transparent pointer-events-none z-10" />
                                            <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform z-20">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between bg-ftx-surface relative z-10">
                                            <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                                {infraCard2Title}
                                            </h3>
                                            <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                                {infraCard2Desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal type="editorial" delay={300} className="h-full flex flex-col">
                                <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface border border-ftx-surface-high h-full shadow-xl">
                                    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-ftx-surface">
                                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-ftx-surface">
                                            <Image
                                                src={infraCard3Image}
                                                alt="Curing Infrared Lamps"
                                                fill
                                                className="object-cover transform-gpu transition-transform duration-700 ease-out md:group-hover:scale-110"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ftx-surface via-ftx-surface/60 to-transparent pointer-events-none z-10" />
                                            <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform z-20">
                                                <Award className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between bg-ftx-surface relative z-10">
                                            <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                                {infraCard3Title}
                                            </h3>
                                            <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                                {infraCard3Desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            )}

            {/* Bottom Metrics Banner matching design specification with animated counters */}
            {(metricsSec?.metadata?.showMetricsCards !== false) && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
                    <ScrollReveal type="editorial" delay={100}>
                        <div className="bg-ftx-surface/80 ftx-squircle-xl p-8 sm:p-12 border border-ftx-surface-high shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                                {/* Metric 1 */}
                                <div className="border-l-2 border-ftx-lime pl-5 sm:pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-5 rtl:pr-6 space-y-1">
                                    <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight">
                                        <AnimatedCounter target={metric1Val} suffix={metric1Suffix} />
                                    </div>
                                    <div className="text-xs sm:text-sm font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                        {metric1Label}
                                    </div>
                                </div>

                                {/* Metric 2 */}
                                <div className="border-l-2 border-ftx-lime pl-5 sm:pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-5 rtl:pr-6 space-y-1">
                                    <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight">
                                        <AnimatedCounter target={metric2Val} suffix={metric2Suffix} />
                                    </div>
                                    <div className="text-xs sm:text-sm font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                        {metric2Label}
                                    </div>
                                </div>

                                {/* Metric 3 */}
                                <div className="border-l-2 border-ftx-lime pl-5 sm:pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-5 rtl:pr-6 space-y-1">
                                    <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight">
                                        <AnimatedCounter target={metric3Val} suffix={metric3Suffix} />
                                    </div>
                                    <div className="text-xs sm:text-sm font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                        {metric3Label}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>
            )}

            {/* Book Visit Banner */}
            <section className="py-10 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <ScrollReveal type="scale">
                    <div className="p-12 bg-gradient-to-r from-ftx-surface via-ftx-obsidian to-ftx-surface border border-ftx-lime/30 ftx-squircle-xl space-y-6">
                        <h2 className="text-3xl font-heading font-black text-white uppercase">
                            {locale === "ar" ? "عايش تجربة استوديو FTX بنفسك" : "EXPERIENCE THE FTX STUDIO IN PERSON"}
                        </h2>
                        <p className="text-xs sm:text-sm text-ftx-silver max-w-xl mx-auto font-body">
                            {locale === "ar"
                                ? "احجز استشارة خاصة مع خبراء التلميع واطلع على أحدث مشاريع الحماية والسيراميك."
                                : "Schedule a private consultation with our master detailers and inspect our active PPF & Ceramic projects."}
                        </p>
                        <div>
                            <Link
                                href={`/${locale}/contact`}
                                className="ftx-btn-tech ftx-btn-specular inline-flex items-center gap-2 px-8 py-4 text-xs font-mono font-bold tracking-wider text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright transition-colors shadow-lime-glow"
                            >
                                <span>{messages.contact.formTitle}</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}
