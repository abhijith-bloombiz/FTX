export const contactConfig = {
    phone: "+971 50 123 4567",
    phoneRaw: "+971501234567",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971501234567",
    email: "info@ftxdetailing.com",
    address: {
        en: "Automotive Precision District, Bay 14, Dubai, United Arab Emirates",
        ar: "منطقة تميز السيارات، المجمع 14، دبي، الإمارات العربية المتحدة",
    },
    workingHours: {
        en: "Monday – Saturday: 9:00 AM – 8:00 PM (Sunday Closed)",
        ar: "الإثنين – السبت: 9:00 صباحاً – 8:00 مساءً (الأحد مغلق)",
    },
    mapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "https://maps.google.com/?q=FTX+First+Torque+X",
    social: {
        instagram: "https://instagram.com/ftxdetailing",
        youtube: "https://youtube.com/@ftxdetailing",
        facebook: "https://facebook.com/ftxdetailing",
        tiktok: "https://tiktok.com/@ftxdetailing",
    },
};
