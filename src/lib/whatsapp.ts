import { contactConfig } from "@/config/contact";

export interface WhatsAppOptions {
    service?: string;
    packageName?: string;
    locale?: "en" | "ar";
}

export function getWhatsAppUrl(options: WhatsAppOptions = {}): string {
    const number = contactConfig.whatsappNumber;
    const isAr = options.locale === "ar";

    let text = isAr
        ? "مرحباً FTX، أود الاستفسار عن خدمات حماية وتلميع السيارات لدى مركزكم."
        : "Hello FTX, I would like to know more about your services.";

    if (options.packageName) {
        text = isAr
            ? `مرحباً FTX، أنا مهتم بحجز باقة (${options.packageName}) لسيارتي.`
            : `Hello FTX, I am interested in booking the (${options.packageName}) package for my vehicle.`;
    } else if (options.service) {
        const serviceName = options.service.toUpperCase();
        text = isAr
            ? `مرحباً FTX، أنا مهتم بخدمة (${serviceName}) لسيارتي.`
            : `Hello FTX, I am interested in ${serviceName} services for my vehicle.`;
    }

    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
