import { contactConfig } from "@/config/contact";

export interface WhatsAppOptions {
    service?: string;
    packageName?: string;
    locale?: "en" | "ar";
    phoneNumber?: string;
}

export interface FormWhatsAppOptions {
    name: string;
    phone: string;
    email?: string;
    vehicleModel?: string;
    service?: string;
    package?: string;
    message?: string;
    locale?: "en" | "ar";
    phoneNumber?: string;
}

export function getWhatsAppUrl(options: WhatsAppOptions = {}): string {
    const rawNumber = options.phoneNumber || contactConfig.whatsappNumber;
    const number = rawNumber.replace(/\D/g, "");
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

export function getFormWhatsAppUrl(data: FormWhatsAppOptions): string {
    const rawNumber = data.phoneNumber || contactConfig.whatsappNumber;
    const number = rawNumber.replace(/\D/g, "");
    const isAr = data.locale === "ar";

    const lines: string[] = [];

    if (isAr) {
        lines.push("مرحباً FTX، أود طلب استشارة / طلب سعر جديد من الموقع:");
        if (data.name) lines.push(`الاسم: ${data.name}`);
        if (data.phone) lines.push(`رقم التواصل: ${data.phone}`);
        if (data.email) lines.push(`البريد الإلكتروني: ${data.email}`);
        if (data.vehicleModel) lines.push(`نوع / موديل السيارة: ${data.vehicleModel}`);
        if (data.service) lines.push(`الخدمة المطلوبة: ${data.service}`);
        if (data.package) lines.push(`الباقة: ${data.package}`);
        if (data.message) lines.push(`الملاحظات / الرسالة: ${data.message}`);
    } else {
        lines.push("Hello FTX, I would like to request a studio quotation from your website:");
        if (data.name) lines.push(`Name: ${data.name}`);
        if (data.phone) lines.push(`Phone: ${data.phone}`);
        if (data.email) lines.push(`Email: ${data.email}`);
        if (data.vehicleModel) lines.push(`Vehicle Model: ${data.vehicleModel}`);
        if (data.service) lines.push(`Service: ${data.service}`);
        if (data.package) lines.push(`Package: ${data.package}`);
        if (data.message) lines.push(`Message: ${data.message}`);
    }

    const text = lines.join("\n");
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

