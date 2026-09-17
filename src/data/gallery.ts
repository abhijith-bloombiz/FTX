import { GalleryItem } from "@/types/gallery";
import { Locale } from "@/i18n/config";

export function getVehicleLabel(vehicle: string | Record<"en" | "ar", string> | undefined, locale: Locale): string {
    if (!vehicle) return "";
    if (typeof vehicle === "string") return vehicle;
    return vehicle[locale] || vehicle.en;
}

export const galleryData: GalleryItem[] = [
    {
        id: "g-hero",
        title: {
            en: "Porsche 911 GT3 RS – Climate-Controlled Studio Fitment",
            ar: "بورشه 911 GT3 RS – التركيب الدقيق في الاستوديو المعقم",
        },
        category: "ppf",
        vehicle: {
            en: "Porsche 911 GT3 RS",
            ar: "بورشه 911 GT3 RS",
        },
        image: "/images/gallery/gt3rs-ppf.jpg",
        description: {
            en: "Full custom ceramic & stealth film fitment with edge wrapping inside our premier climate-controlled detailing bay.",
            ar: "تركيب كامل لفيلم الحماية مع طي الحواف داخل استوديو العناية بالفخامة المتطور.",
        },
        tags: ["PPF", "Studio", "Porsche", "Custom Fitment"],
    },
    {
        id: "g-ceramic",
        title: {
            en: "Supercar Hydrophobic Ceramic Matrix – Extreme Beading",
            ar: "سيراميك نانو فائق الهيدروفوبيك – طرد الماء والزيوت",
        },
        category: "ceramic",
        vehicle: {
            en: "Hypercar Gloss Matrix",
            ar: "مصفوفة لمعان السيارات الفائقة",
        },
        image: "/images/gallery/ceramic-beading.jpg",
        description: {
            en: "Macro perspective of 9H+ SiO2 hydrophobic ceramic matrix showing high-contact angle water drop repulsion.",
            ar: "لقطة دقيقة لسطح السيراميك المعالج بزاوية طرد فائقة للماء وحماية الهيكل خارق.",
        },
        tags: ["Ceramic", "9H+", "Hydrophobic", "Beading"],
    },
    {
        id: "g1",
        title: {
            en: "Porsche 911 GT3 RS – Full Body Stealth PPF",
            ar: "بورشه 911 GT3 RS – حماية مات ستيلث كاملة",
        },
        category: "ppf",
        vehicle: {
            en: "Porsche 911 GT3 RS",
            ar: "بورشه 911 GT3 RS",
        },
        image: "/images/gallery/gt3rs-ppf.jpg",
        description: {
            en: "Complete custom satin matte film fitment with wrapped seams and high-gloss carbon fiber accents protection.",
            ar: "تركيب كامل لفيلم الحماية المطفي المصنوع خصيصاً مع طي الحواف وحماية الألياف الكربونية اللامعة.",
        },
        tags: ["PPF", "Stealth", "Porsche", "Track Shield"],
    },
    {
        id: "g2",
        title: {
            en: "Ferrari F8 Tributo – 9H+ Nano Ceramic Glass Matrix",
            ar: "فيراري F8 تريبوتو – سيراميك نانو 9H+ زجاجي",
        },
        category: "ceramic",
        vehicle: {
            en: "Ferrari F8 Tributo",
            ar: "فيراري F8 تريبوتو",
        },
        image: "/images/services/ceramic-main.png",
        description: {
            en: "4-Layer SiO2 obsidian glass coating cured under infrared heat lamps for intense hydrophobicity.",
            ar: "4 طبقات نانو سيراميك معالجة بأشعة الإنفراريد للحصول على لمعان ودرع حماية فائق من المياه.",
        },
        tags: ["Ceramic", "Ferrari", "9H+", "Hydrophobic"],
    },
    {
        id: "g3",
        title: {
            en: "Lamborghini Huracán STO – Multi-Stage Paint Restoration",
            ar: "لامبورغيني هوراكان STO – تصحيح طلاء وتلميع شامل",
        },
        category: "detailing",
        vehicle: {
            en: "Lamborghini Huracán STO",
            ar: "لامبورغيني هوراكان STO",
        },
        image: "/images/services/detailing-main.png",
        description: {
            en: "Multi-stage dual-action polish eliminating swirl marks and restoring optical depth before protective coating.",
            ar: "تصحيح وتلميع ميكانيكي بمراحل متعددة لإزالة الدوائر والخدوش قبل تطبيق حماية السيراميك.",
        },
        tags: ["Detailing", "Paint Correction", "Lamborghini"],
    },
    {
        id: "g4",
        title: {
            en: "Mercedes-AMG G63 – Front Track PPF & Ceramic",
            ar: "مرسيدس AMG G63 – حماية مقدمة وسيراميك كامل",
        },
        category: "before-after",
        vehicle: {
            en: "Mercedes-AMG G63",
            ar: "مرسيدس AMG G63",
        },
        image: "/images/gallery/after.webp",
        beforeImage: "/images/gallery/before.webp",
        afterImage: "/images/gallery/after.webp",
        description: {
            en: "Complete stone-chip prevention package with ceramic glass top coat for high-velocity highway driving.",
            ar: "باقة كاملة لحماية المقدمة من حصى الطرق مع سيراميك للجنوط والزجاج للقيادة على الطرق السريعة.",
        },
        tags: ["Before & After", "AMG", "PPF", "Ceramic"],
    },
    {
        id: "g5",
        title: {
            en: "McLaren 720S – High Gloss Optical Clear Bra",
            ar: "ماكلارين 720S – حماية شفافة بصرية عالي اللمعان",
        },
        category: "ppf",
        vehicle: {
            en: "McLaren 720S",
            ar: "ماكلارين 720S",
        },
        image: "/images/services/ppf-main.png",
        description: {
            en: "Invisible self-healing thermoplastic protection ensuring zero orange-peel texture distortion.",
            ar: "فيلم حماية شفاف ذاتي المعالجة بدون أي تشويه لبنية الطلاء أو مظهر قشرة البرتقال.",
        },
        tags: ["PPF", "McLaren", "Clear Bra"],
    },
    {
        id: "g6",
        title: {
            en: "Rolls-Royce Cullinan – Interior Leather & Obsidian Ceramic Spa",
            ar: "رولز رويس كولينان – عناية بالجلد الداخلي وسيراميك الأسود الملكي",
        },
        category: "detailing",
        vehicle: {
            en: "Rolls-Royce Cullinan",
            ar: "رولز رويس كولينان",
        },
        image: "/images/services/detailing-main.png",
        description: {
            en: "Bespoke interior skin nourishment, alcantara restoration, and hydrophobic leather shield.",
            ar: "تغذية وتنظيف دقيق للجلد الطبيعي وتجديد الألكانتارا وحماية الجلد بطبقة نانو كارهة للسوائل.",
        },
        tags: ["Detailing", "Interior Spa", "Rolls-Royce"],
    },
];
