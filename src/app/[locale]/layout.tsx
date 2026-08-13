import { notFound } from "next/navigation";
import { locales, isRtl, Locale } from "@/i18n/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CinematicLoader } from "@/components/ui/CinematicLoader";
import { PageTransition } from "@/components/layout/PageTransition";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { FloatingContactWidget } from "@/components/ui/FloatingContactWidget";

async function getMessages(locale: Locale) {
    try {
        return (await import(`@/i18n/messages/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: { locale: Locale };
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: LocaleLayoutProps) {
    if (!locales.includes(locale)) {
        notFound();
    }

    const messages = await getMessages(locale);
    const rtl = isRtl(locale);

    return (
        <div dir={rtl ? "rtl" : "ltr"} className={`min-h-screen bg-ftx-black text-ftx-silver ${rtl ? 'font-arabic' : 'font-body'}`}>
            <CustomCursor />
            <SmoothScrollProvider>
                <CinematicLoader />
                <Navbar locale={locale} messages={messages} />
                <main className="relative z-0 min-h-screen">
                    <PageTransition>{children}</PageTransition>
                </main>
                <Footer locale={locale} messages={messages} />
                <FloatingContactWidget locale={locale} />
            </SmoothScrollProvider>
        </div>
    );
}
