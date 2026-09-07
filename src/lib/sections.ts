import { connectToDatabase } from "@/lib/db";
import { PageSection } from "@/lib/models/PageSection";

export const DEFAULT_SECTIONS = [
    {
        page: "home",
        sectionKey: "intro",
        title: { en: "ENGINEERED FOR PROTECTION. CRAFTED FOR PERFECTION.", ar: "مُصمم للحماية. صُنِع للكمال." },
        subtitle: { en: "THE PHILOSOPHY", ar: "فلسفتنا" },
        content: {
            en: "At FTX - First Torque X, we treat every vehicle as a masterwork of design and engineering. Our studio environment is designed for maximum clarity and surgical execution.\n\nFrom exotic supercars to high-performance daily drivers, our specialized technicians apply world-class paint protection film and hydrophobic coatings with unyielding precision.",
            ar: "في FTX - فيرست تورك إكس، نتعامل مع كل سيارة كتحفة هندسية وفنية. مركزنا مجهز بالكامل لتقديم أعلى مستويات الدقة والرعاية.\n\nمن السيارات الفائقة إلى السيارات اليومية القوية، يقدم فنيونا المعتمدون أفضل تطبيقات الحماية والطلاء النانو سيراميك بدقة متناهية."
        },
        metadata: {
            imageUrl: "/images/about/craftsmanship.jpg",
            badgeTitle: { en: "SURGICAL PRECISION", ar: "دقة جراحية" },
            badgeSub: { en: "Climate-Controlled Studio Bays", ar: "ورش مكيفة ومحايدة للحرارة" }
        }
    },
    {
        page: "home",
        sectionKey: "services",
        title: { en: "WORLD-CLASS PROTECTION & DETAILING", ar: "حماية وعناية على مستوى عالمي" },
        subtitle: { en: "MASTERCLASS SERVICES", ar: "خدمات احترافية" },
        content: {
            en: "01. PAINT PROTECTION FILM (PPF) - Ultra-clear self-healing protection against rock chips & scratches.\n02. CERAMIC COATING - Multi-layer nano-ceramic hydrophobic shield delivering permanent gloss & UV defense.\n03. PROFESSIONAL DETAILING - Meticulous paint correction, interior restoration, and engine bay revival.",
            ar: "01. أفلام حماية الطلاء (PPF) - حماية شفافة ذاتية المعالجة ضد حصى الطرق والخدوش.\n02. الطلاء السيراميكي - طبقات نانو سيراميك فائقة الحماية توفر لمعاناً دائماً.\n03. التلميع والعناية الشاملة - تصحيح دقيق للطلاء، استعادة المقصورة الداخلية، وتجديد المحرك."
        }
    },
    {
        page: "home",
        sectionKey: "why_ftx",
        title: { en: "THE STANDARDS OF AUTOMOTIVE EXCELLENCE", ar: "معايير التميز في عالم السيارات" },
        subtitle: { en: "WHY CHOOSE FTX", ar: "لماذا FTX" },
        content: {
            en: "PRECISION: Microscopic attention to detail with optical-grade alignment.\nPROTECTION: Self-healing thermoplastic shield preserving factory paint.\nCRAFTSMANSHIP: Certified master applicators working in climate-controlled bays.\nPERFORMANCE: Hydrophobic repellency and deep obsidian gloss enhancement.",
            ar: "الدقة المتناهية: عناية ميكروسكوبية بالتفاصيل مع محاذاة بصرية دقيقة.\nالحماية الكاملة: درع حراري ذاتي المعالجة يحمي طلاء المصنع.\nالحرفية العالية: فنيون محترفون معتمدون يعملون في بيئة معقمة ومكيفة.\nالأداء المتميز: خصائص فائقة لطرد المياه ولمعان عميق."
        },
        metadata: {
            card1Image: "/images/pillars/precision.jpg",
            card1Title: { en: "PRECISION", ar: "الدقة المتناهية" },
            card1Desc: { en: "Microscopic attention to detail with optical-grade alignment.", ar: "عناية ميكروسكوبية بالتفاصيل مع محاذاة بصرية دقيقة." },
            card2Image: "/images/pillars/protection.jpg",
            card2Title: { en: "PROTECTION", ar: "الحماية الكاملة" },
            card2Desc: { en: "Self-healing thermoplastic shield preserving factory paint.", ar: "درع حراري ذاتي المعالجة يحمي طلاء المصنع." },
            card3Image: "/images/pillars/craftsmanship.jpg",
            card3Title: { en: "CRAFTSMANSHIP", ar: "الحرفية العالية" },
            card3Desc: { en: "Certified master applicators working in climate-controlled bays.", ar: "فنيون محترفون معتمدون يعملون في بيئة معقمة ومكيفة." },
            card4Image: "/images/pillars/performance.jpg",
            card4Title: { en: "PERFORMANCE", ar: "الأداء المتميز" },
            card4Desc: { en: "Hydrophobic repellency and deep obsidian gloss enhancement.", ar: "خصائص فائقة لطرد المياه ولمعان عميق." }
        }
    },
    {
        page: "home",
        sectionKey: "gallery",
        title: { en: "BUILT TO BE SEEN.", ar: "صُنِعت لتلفت الأنظار." },
        subtitle: { en: "FEATURED WORK & TRANSFORMATIONS", ar: "معرض الأعمال والتحولات" },
        content: {
            en: "Explore recent FTX automotive transformations, supercar paint protection film fits, and high-gloss ceramic glass finishes.",
            ar: "استكشف أحدث أعمالنا في حماية السيارات وتطبيقات أفلام الـ PPF ودروع السيراميك."
        }
    },
    {
        page: "home",
        sectionKey: "testimonials",
        title: { en: "TRUSTED BY DISCERNING OWNERS", ar: "ثقة ملاك السيارات الفاخرة" },
        subtitle: { en: "CLIENT REVIEWS & FEEDBACK", ar: "آراء وتقييمات العملاء" },
        content: {
            en: "Read reviews from luxury supercar owners who trust FTX with their automotive protection in Al Quoz, Dubai.",
            ar: "اقرأ تقييمات وتجارب ملاك السيارات الفاخرة الذين يثقون بشركة FTX لحماية سياراتهم في دبي."
        }
    },
    {
        page: "home",
        sectionKey: "contact",
        title: { en: "LET'S PROTECT YOUR VEHICLE.", ar: "دعنا نحمي سيارتك." },
        subtitle: { en: "VISIT OUR AL QUOZ STUDIO, DUBAI", ar: "تواصل مع استوديو FTX في دبي" },
        content: {
            en: "Address: AL QUOZ INDUSTRIAL AREA 3, DUBAI.\nFacility: Climate-Controlled Supercar Enclosure & VIP Waiting Lounge.\nGet in touch with our studio team for custom quote requests.",
            ar: "العنوان: منطقة القوز الصناعية 3، دبي.\nالمرفق: منطقة مخصصة للسيارات الفائقة ومكيفة بالكامل مع صالة كبار الشخصيات.\nتواصل مع فريق الاستوديو للحصول على عرض سعر مخصص."
        },
        metadata: {
            mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.4337222165036!2d55.2289!3d25.1208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA3JzE0LjkiTiA1NcKwMTMnNDQuMCJF!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae",
            phone: "+971 50 123 4567",
            email: "info@ftxdetailing.com",
            addressEn: "Automotive Precision District, Bay 14, Dubai, United Arab Emirates",
            addressAr: "منطقة تميز السيارات، المجمع 14، دبي، الإمارات العربية المتحدة",
            workingHoursEn: "Monday – Saturday: 9:00 AM – 8:00 PM (Sunday Closed)",
            workingHoursAr: "الإثنين – السبت: 9:00 صباحاً – 8:00 مساءً (الأحد مغلق)",
        }
    },
    {
        page: "contact",
        sectionKey: "info",
        title: { en: "GET IN TOUCH", ar: "تواصل معنا" },
        subtitle: { en: "STUDIO LOCATION & QUOTATION", ar: "تواصل معنا" },
        content: {
            en: "Get in touch with our studio team in Al Quoz, Dubai or submit a custom quote request below.",
            ar: "تواصل مع استوديو FTX في القوز دبي لحجز موعد استشارة حماية وتلميع سيارتك."
        },
        metadata: {
            mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.4337222165036!2d55.2289!3d25.1208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA3JzE0LjkiTiA1NcKwMTMnNDQuMCJF!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae",
            phone: "+971 50 123 4567",
            email: "info@ftxdetailing.com",
            addressEn: "Automotive Precision District, Bay 14, Dubai, United Arab Emirates",
            addressAr: "منطقة تميز السيارات، المجمع 14، دبي، الإمارات العربية المتحدة",
            workingHoursEn: "Monday – Saturday: 9:00 AM – 8:00 PM (Sunday Closed)",
            workingHoursAr: "الإثنين – السبت: 9:00 صباحاً – 8:00 مساءً (الأحد مغلق)",
        }
    },
    {
        page: "about",
        sectionKey: "hero",
        title: { en: "SURGICAL PERFECTION.", ar: "دقة جراحية." },
        subtitle: { en: "ABOUT FTX AUTOMOTIVE", ar: "عن FTX" },
        content: {
            en: "Engineered for perfection with surgical paint protection, ceramic coatings, and high-end detailing in Al Quoz, Dubai.",
            ar: "تعرف على فلسفة FTX وشغفنا بالكمال في حماية وتجميل أحدث السيارات الفاخرة والدقيقة في دبي."
        }
    },
    {
        page: "about",
        sectionKey: "philosophy",
        title: { en: "PRECISION AUTOMOTIVE ENGINEERING MEETS SURGICAL DETAILING", ar: "هندسة السيارات الدقيقة تلتقي بالتلميع الجراحي" },
        subtitle: { en: "THE FTX STANDARD", ar: "معيار FTX" },
        content: {
            en: "Founded by passionate automotive perfectionists, FTX – First Torque X was created to set a new global benchmark in supercar protection film installation, ceramic paint coating, and bespoke paint correction in Dubai.",
            ar: "تأسست FTX – First Torque X على يد نخبة من عشاق كمال السيارات، لوضع معيار عالمي جديد في تركيب أفلام حماية السيارات الفائقة، طلاء السيراميك، وتصحيح الطلاء في دبي."
        },
        metadata: {
            imageUrl: "/images/about/craftsmanship.jpg",
            badgeTitle: { en: "100%", ar: "100%" },
            badgeSub: { en: "Dust-Free Bays", ar: "كبائن خالية من الغبار" }
        }
    },
    {
        page: "about",
        sectionKey: "infrastructure",
        title: { en: "CLIMATE-CONTROLLED PRECISION BAYS", ar: "كبائن دقيقة ببيئة حرارية متحكم بها" },
        subtitle: { en: "INFRASTRUCTURE", ar: "البنية التحتية" },
        content: {
            en: "Computer-guided DAP software plots vehicle-specific templates so blades never touch factory paint. Positive air pressure studio bays eliminate airborne dust particles during PPF installation.",
            ar: "برنامج DAP للقص المباشر يضمن عدم ملامسة المشرط لطلاء المصنع إطلاقاً. نظام الضغط الموجابي يمنع دخول أي ذرات غبار أثناء تركيب فلم الحماية."
        },
        metadata: {
            card1Image: "/images/about/plotter.jpg",
            card1Title: { en: "Surgical Plotter Cutting", ar: "قص كمبيوتري دقيق (Plotter)" },
            card1Desc: { en: "Computer-guided DAP software plots vehicle-specific templates so blades never touch your vehicle's factory paint.", ar: "برنامج DAP للقص المباشر يضمن عدم ملامسة المشرط لطلاء المصنع إطلاقاً." },
            card2Image: "/images/about/hepa-bay.jpg",
            card2Title: { en: "HEPA Filtered Air", ar: "نظام تصفية الهواء HEPA" },
            card2Desc: { en: "Positive air pressure studio bays eliminate airborne dust particles during the PPF installation process.", ar: "نظام الضغط الموجابي يمنع دخول أي ذرات غبار أثناء تركيب فلم الحماية." },
            card3Image: "/images/about/infrared.jpg",
            card3Title: { en: "Curing Infrared Lamps", ar: "أشعة التجفيف بالإنفراريد" },
            card3Desc: { en: "Shortwave infrared curing locks in ceramic coatings at optimal temperature matrices for maximum gloss and durability.", ar: "المعالجة بالأشعة تحت الحمراء تضمن ثبات السيراميك لأقصى لمعان ومتانة." }
        }
    },
    {
        page: "about",
        sectionKey: "metrics",
        title: { en: "PERFORMANCE METRICS", ar: "مؤشرات الأداء والتميز" },
        subtitle: { en: "THE FTX NUMBERS", ar: "أرقام إنجازات FTX" },
        content: {
            en: "10+ Years Experience | 5K+ Vehicles Protected | 100% Satisfaction Focus",
            ar: "10+ سنوات خبرة | 5K+ سيارة تم حمايتها | 100% تركيز على رضا العملاء"
        },
        metadata: {
            metric1Val: "10",
            metric1Suffix: "+",
            metric1Label: { en: "YEARS EXPERIENCE", ar: "سنوات خبرة" },
            metric2Val: "5",
            metric2Suffix: "K+",
            metric2Label: { en: "VEHICLES PROTECTED", ar: "سيارة تم حمايتها" },
            metric3Val: "100",
            metric3Suffix: "%",
            metric3Label: { en: "SATISFACTION FOCUS", ar: "تركيز على رضا العملاء" }
        }
    }
];

export let inMemoryStore: any[] = JSON.parse(JSON.stringify(DEFAULT_SECTIONS));

const SECTION_CACHE_TTL_MS = 60 * 1000;
interface SectionCacheEntry {
    data: any[];
    timestamp: number;
}
const pageSectionsCache: Record<string, SectionCacheEntry> = {};

export function invalidatePageSectionsCache(page?: string) {
    if (page) {
        delete pageSectionsCache[page];
    } else {
        Object.keys(pageSectionsCache).forEach((k) => delete pageSectionsCache[k]);
    }
}

export async function getSectionsForPage(page: string) {
    const now = Date.now();
    const cached = pageSectionsCache[page];
    if (cached && now - cached.timestamp < SECTION_CACHE_TTL_MS) {
        return cached.data;
    }

    const targetDefaults = DEFAULT_SECTIONS.filter((s) => s.page === page);
    let dbSections: any[] = [];

    try {
        await connectToDatabase();
        const rawDbSections = await PageSection.find({ page }).lean();
        dbSections = JSON.parse(JSON.stringify(rawDbSections));
    } catch (e) {
        dbSections = inMemoryStore.filter((s) => s.page === page);
    }

    const result = targetDefaults.map((def) => {
        const dbSec = dbSections.find((s: any) => s.page === def.page && s.sectionKey === def.sectionKey);
        const memSec = inMemoryStore.find((s: any) => s.page === def.page && s.sectionKey === def.sectionKey);

        const source = dbSec || memSec;
        if (!source) return def;

        return {
            ...def,
            ...source,
            isVisible: source.isVisible !== undefined ? Boolean(source.isVisible) : true,
            _id: source._id ? String(source._id) : undefined,
            title: { ...def.title, ...(source.title || {}) },
            subtitle: { ...def.subtitle, ...(source.subtitle || {}) },
            content: { ...def.content, ...(source.content || {}) },
            metadata: { ...def.metadata, ...(source.metadata || {}) },
        };
    });

    pageSectionsCache[page] = { data: result, timestamp: now };
    return result;
}

export function updateInMemorySection(page: string, sectionKey: string, updateData: any) {
    invalidatePageSectionsCache(page);
    const idx = inMemoryStore.findIndex((s) => s.page === page && s.sectionKey === sectionKey);
    if (idx >= 0) {
        inMemoryStore[idx] = {
            ...inMemoryStore[idx],
            ...updateData,
            metadata: { ...(inMemoryStore[idx].metadata || {}), ...(updateData.metadata || {}) },
        };
    } else {
        inMemoryStore.push({ page, sectionKey, ...updateData });
    }
}
