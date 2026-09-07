import { getCmsServices, getCmsPackages } from "@/lib/cms";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServicesListClient } from "@/components/sections/ServicesListClient";

export const dynamic = "force-dynamic";

async function getMessages(locale: Locale) {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
}

interface ServicesPageProps {
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: ServicesPageProps) {
    const isAr = locale === "ar";
    return {
        title: "First Torque X",
        description: isAr
            ? "استكشف خدمات FTX المتخصصة في أفلام حماية الطلاء PPF، وطلاء السيراميك 9H، والتلميع الساطع، والعناية الكاملة بالسيارات الفاخرة."
            : "Explore FTX's suite of luxury automotive protection services in Dubai: Paint Protection Film (PPF), 9H Ceramic Coating, Paint Correction & Detailing.",
        alternates: {
            canonical: `https://ftx.ae/${locale}/services`,
            languages: {
                en: "https://ftx.ae/en/services",
                ar: "https://ftx.ae/ar/services",
            },
        },
    };
}

export default async function ServicesPage({ params: { locale } }: ServicesPageProps) {
    const [messages, servicesData, packagesData] = await Promise.all([
        getMessages(locale),
        getCmsServices(),
        getCmsPackages(),
    ]);

    return (
        <div className="pt-[88px] sm:pt-[96px] pb-0 bg-black min-h-screen relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Top Right) */}
            <div
                className="absolute top-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse 80% 70% at 100% 0%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />
            {/* Global Header */}
            <PageHeader
                badge={messages.servicesSection?.badge || messages.common.ourServices || (locale === "ar" ? "خدماتنا" : "OUR SERVICES")}
                titleLine1={locale === "ar" ? "خدمات" : "PRECISION"}
                titleLine2={locale === "ar" ? "احترافية." : "SERVICES."}
                subtitle={messages.servicesPage?.heroSub || messages.hero?.description}
            />

            {/* Interactive Services List with Details Actions */}
            <ServicesListClient services={servicesData} packages={packagesData} locale={locale} messages={messages} />
        </div>
    );
}
