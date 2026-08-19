import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Award, Wrench } from "lucide-react";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

async function getMessages(locale: Locale) {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
}

interface AboutPageProps {
    params: { locale: Locale };
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
    const messages = await getMessages(locale);

    return (
        <div className="pt-24 pb-0 bg-black min-h-screen relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Top Right) */}
            <div className="absolute top-20 -right-24 w-[600px] h-[600px] bg-ftx-lime/15 blur-[130px] rounded-full pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_top_right,rgba(164,214,94,0.15),transparent_70%)] pointer-events-none z-0" />
            {/* Synchronized Global Header */}
            <PageHeader
                badge={messages.about?.heroBadge || messages.nav?.about || (locale === "ar" ? "عن FTX" : "ABOUT FTX")}
                titleLine1={locale === "ar" ? "دقة" : "SURGICAL"}
                titleLine2={locale === "ar" ? "جراحية." : "PERFECTION."}
                subtitle={messages.about?.heroSub || messages.intro?.p1}
            />

            {/* Studio Philosophy & Craftsmanship */}
            <section className="py-10 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <ScrollReveal type="editorial" className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-ftx-surface border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime uppercase rounded">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{locale === "ar" ? "معيار FTX" : "THE FTX STANDARD"}</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
                            {locale === "ar"
                                ? "هندسة السيارات الدقيقة تلتقي بالتلميع الجراحي"
                                : "PRECISION AUTOMOTIVE ENGINEERING MEETS SURGICAL DETAILING"}
                        </h2>

                        <div className="space-y-4 text-xs sm:text-sm text-ftx-silver font-body leading-relaxed">
                            <p>{messages.intro.p1}</p>
                            <p>{messages.intro.p2}</p>
                            <p>
                                {locale === "ar"
                                    ? "تأسست FTX – First Torque X على يد نخبة من عشاق كمال السيارات، لوضع معيار عالمي جديد في تركيب أفلام حماية السيارات الفائقة، طلاء السيراميك، وتصحيح الطلاء في دبي."
                                    : "Founded by passionate automotive perfectionists, FTX – First Torque X was created to set a new global benchmark in supercar protection film installation, ceramic paint coating, and bespoke paint correction in Dubai."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-ftx-surface border border-ftx-surface-high ftx-squircle-md">
                                <div className="text-2xl sm:text-3xl font-mono font-black text-ftx-lime">
                                    <AnimatedCounter target={100} suffix="%" />
                                </div>
                                <div className="text-[10px] font-mono text-ftx-silver uppercase mt-1">
                                    {locale === "ar" ? "كبائن خالية من الغبار" : "Dust-Free Bays"}
                                </div>
                            </div>
                            <div className="p-4 bg-ftx-surface border border-ftx-surface-high ftx-squircle-md">
                                <div className="text-2xl sm:text-3xl font-mono font-black text-ftx-lime">
                                    <AnimatedCounter target={1500} suffix="+" />
                                </div>
                                <div className="text-[10px] font-mono text-ftx-silver uppercase mt-1">
                                    {locale === "ar" ? "سيارة فائقة تم حمايتها" : "Supercars Protected"}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal type="image-mask" delay={150} className="lg:col-span-6 relative">
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-ftx-surface-high shadow-2xl">
                            <Image
                                src="/images/about/craftsmanship.jpg"
                                alt="FTX Studio Master Technicians"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Facilities & Equipment Highlights */}
            <section className="py-6 sm:py-8 bg-black relative overflow-hidden">
                {/* Atmospheric Lime Ambient Glow (Bottom Left) */}
                <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-ftx-lime/15 blur-[130px] rounded-full pointer-events-none z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_bottom_left,rgba(164,214,94,0.18),transparent_70%)] pointer-events-none z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal type="editorial" className="text-left rtl:text-right mb-6 sm:mb-8">
                        <span className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-widest">
                            {locale === "ar" ? "البنية التحتية" : "INFRASTRUCTURE"}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase mt-1">
                            {locale === "ar" ? "كبائن دقيقة ببيئة حرارية متحكم بها" : "CLIMATE-CONTROLLED PRECISION BAYS"}
                        </h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ScrollReveal type="editorial" delay={100}>
                            <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface border border-ftx-surface-high flex flex-col justify-between h-full shadow-xl">
                                <div className="relative w-full aspect-[16/10] overflow-hidden">
                                    <Image
                                        src="/images/about/plotter.jpg"
                                        alt="Surgical Plotter Cutting"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-surface via-ftx-surface/40 to-transparent opacity-90" />
                                    <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform">
                                        <Wrench className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                    <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                        {locale === "ar" ? "قص كمبيوتري دقيق (Plotter)" : "Surgical Plotter Cutting"}
                                    </h3>
                                    <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                        {locale === "ar"
                                            ? "برنامج DAP للقص المباشر يضمن عدم ملامسة المشرط لطلاء المصنع إطلاقاً."
                                            : "Computer-guided DAP software plots vehicle-specific templates so blades never touch your vehicle's factory paint."}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal type="editorial" delay={200}>
                            <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface border border-ftx-surface-high flex flex-col justify-between h-full shadow-xl">
                                <div className="relative w-full aspect-[16/10] overflow-hidden">
                                    <Image
                                        src="/images/about/hepa-bay.jpg"
                                        alt="HEPA Filtered Air"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-surface via-ftx-surface/40 to-transparent opacity-90" />
                                    <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                    <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                        {locale === "ar" ? "نظام تصفية الهواء HEPA" : "HEPA Filtered Air"}
                                    </h3>
                                    <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                        {locale === "ar"
                                            ? "نظام الضغط الموجابي يمنع دخول أي ذرات غبار أثناء تركيب فلم الحماية."
                                            : "Positive air pressure studio bays eliminate airborne dust particles during the PPF installation process."}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal type="editorial" delay={300}>
                            <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface border border-ftx-surface-high flex flex-col justify-between h-full shadow-xl">
                                <div className="relative w-full aspect-[16/10] overflow-hidden">
                                    <Image
                                        src="/images/about/infrared.jpg"
                                        alt="Curing Infrared Lamps"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-surface via-ftx-surface/40 to-transparent opacity-90" />
                                    <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform">
                                        <Award className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                    <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                        {locale === "ar" ? "أشعة التجفيف بالإنفراريد" : "Curing Infrared Lamps"}
                                    </h3>
                                    <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                        {locale === "ar"
                                            ? "المعالجة بالأشعة تحت الحمراء تضمن ثبات السيراميك لأقصى لمعان ومتانة."
                                            : "Shortwave infrared curing locks in ceramic coatings at optimal temperature matrices for maximum gloss and durability."}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Bottom Metrics Banner matching design specification with animated counters */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
                <ScrollReveal type="editorial" delay={100}>
                    <div className="bg-ftx-surface/80 ftx-squircle-xl p-8 sm:p-12 border border-ftx-surface-high shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {/* Metric 1 */}
                            <div className="border-l-2 border-ftx-lime pl-5 sm:pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-5 rtl:pr-6 space-y-1">
                                <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight">
                                    <AnimatedCounter target={10} suffix="+" />
                                </div>
                                <div className="text-xs sm:text-sm font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                    {locale === "ar" ? "سنوات خبرة" : "YEARS EXPERIENCE"}
                                </div>
                            </div>

                            {/* Metric 2 */}
                            <div className="border-l-2 border-ftx-lime pl-5 sm:pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-5 rtl:pr-6 space-y-1">
                                <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight">
                                    <AnimatedCounter target={5} suffix="K+" />
                                </div>
                                <div className="text-xs sm:text-sm font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                    {locale === "ar" ? "سيارة تم حمايتها" : "VEHICLES PROTECTED"}
                                </div>
                            </div>

                            {/* Metric 3 */}
                            <div className="border-l-2 border-ftx-lime pl-5 sm:pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-5 rtl:pr-6 space-y-1">
                                <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight">
                                    <AnimatedCounter target={100} suffix="%" />
                                </div>
                                <div className="text-xs sm:text-sm font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                    {locale === "ar" ? "تركيز على رضا العملاء" : "SATISFACTION FOCUS"}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

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
