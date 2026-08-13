import { PackageItem } from "@/types/package";

export const packagesData: PackageItem[] = [
    // PPF PACKAGES
    {
        id: "ppf-front-track",
        category: "ppf",
        name: {
            en: "FRONT TRACK SHIELD (PPF)",
            ar: "حماية المقدمة الرياضية (PPF)",
        },
        description: {
            en: "Essential high-impact defense covering full bonnet, front bumper, front wings, side mirrors, and headlights.",
            ar: "حماية أساسية لمناطق الصدمات تشمل الكبوت الكامل، الصدام الأمامي، الرفارف الأمامية، مرايا الجوانب والشمعات.",
        },
        price: {
            en: "Starting at AED 4,500",
            ar: "يبدأ من 4,500 د.إ",
        },
        badge: {
            en: "POPULAR CHOICE",
            ar: "الأكثر طلباً",
        },
        popular: true,
        features: {
            en: [
                "Full Bonnet & Front Wings PPF Coverage",
                "Front Bumper & Headlight Protection Film",
                "Side Mirror Caps & Door Cup Guards",
                "Self-Healing Thermoplastic Technology",
                "10-Year Anti-Yellowing Warranty",
                "Complimentary 1-Month Inspection & Wash",
            ],
            ar: [
                "تغطية كاملة للكبوت والرفارف الأمامية بفيلم PPF",
                "فيلم حماية الصدام الأمامي والإضاءة الأمامية",
                "حماية أغطية المرايا ومقابض الأبواب",
                "تقنية المعالجة الذاتية الحرارية للخدوش",
                "ضمان 10 سنوات ضد الاصفرار والتحبب",
                "فحص وغسيل مجاني بعد شهر من التركيب",
            ],
        },
    },
    {
        id: "ppf-full-body",
        category: "ppf",
        name: {
            en: "FULL BODY ULTIMATE SHIELD",
            ar: "الحماية الشاملة لجميع أجزاء الهيكل",
        },
        description: {
            en: "Complete 100% exterior panel paint protection film fitment with wrapped seams and hydrophobic topcoat.",
            ar: "تغليف كامل 100% لجميع الألواح الخارجية لسيارتك بفيلم الحماية مع طي كامل للحواف.",
        },
        price: {
            en: "Starting at AED 11,500",
            ar: "يبدأ من 11,500 د.إ",
        },
        badge: {
            en: "MAXIMUM DEFENSE",
            ar: "أقصى درجات الحماية",
        },
        popular: false,
        features: {
            en: [
                "100% Vehicle Exterior Panel PPF Fitment",
                "Seamless Edge Wrapping Around All Panels",
                "Full Roof, Pillars, Rocker Panels & Tailgate",
                "Complimentary Hydrophobic Ceramic Top Coat",
                "10-Year Comprehensive Warranty",
                "Free Bi-Annual Maintenance Inspection",
            ],
            ar: [
                "تغليف 100% لجميع الألواح الخارجية للسيارة",
                "طي الحواف بدون أي فاصل ظاهري حول جميع الأجزاء",
                "حماية السقف، الدعاميات، العتبات الجانبية والشنطة",
                "طلاء سيراميك نانو مجاني فوق فلم الحماية",
                "ضمان شامل لمدة 10 سنوات",
                "فحص صيانة مجاني كل 6 أشهر",
            ],
        },
    },
    {
        id: "ppf-matte-satin",
        category: "ppf",
        name: {
            en: "STEALTH MATTE / SATIN PPF",
            ar: "حماية المات المطفأ / الساتان",
        },
        description: {
            en: "Transform glossy vehicle paint into a satin matte finish while gaining full self-healing protection.",
            ar: "تحويل لون السيارة اللامع إلى لمسة مطفية فاخرة (Matte) مع الحصول على حماية ذاتية كاملة.",
        },
        price: {
            en: "Starting at AED 13,000",
            ar: "يبدأ من 13,000 د.إ",
        },
        features: {
            en: [
                "Converts Gloss Finish to Deep Satin Matte Aesthetic",
                "Self-Healing Technology Against Swirls & Scratches",
                "100% Full Body Panel Coverage",
                "Full Edge Wrap Alignment for Factory Matte Look",
                "10-Year Global Manufacturer Warranty",
            ],
            ar: [
                "تحويل اللمعان إلى مظهر مطفي (Satin Matte) فاخر",
                "تقنية المعالجة الذاتية ضد الدوائر والخدوش",
                "تغطية كاملة 100% لجميع ألواح السيارة",
                "محاذاة كاملة للحواف لمظهر مصنع أصلي",
                "ضمان مصنعي عالمي لمدة 10 سنوات",
            ],
        },
    },

    // CERAMIC PACKAGES
    {
        id: "ceramic-pro-3yr",
        category: "ceramic",
        name: {
            en: "CERAMIC MATRIX 9H (3-YEAR)",
            ar: "سيراميك ماتريكس 9H (3 سنوات)",
        },
        description: {
            en: "Dual-layer ceramic application delivering high hydrophobicity, UV barrier, and glass mirror reflection.",
            ar: "تطبيق سيراميك ثنائي الطبقات يقدم خاصية طرد مياه مذهلة وحماية ضد الشمس ولمعاناً مرآوياً.",
        },
        price: {
            en: "Starting at AED 2,200",
            ar: "يبدأ من 2,200 د.إ",
        },
        features: {
            en: [
                "2 Layers of 9H High Purity SiO2 Ceramic",
                "Single-Stage Paint Correction Included",
                "Hydrophobic Glass & Wheel Face Coating",
                "3-Year Written Performance Warranty",
                "Includes Annual Maintenance Re-top",
            ],
            ar: [
                "طبقتان من نانو السيراميك النقية بصلابة 9H",
                "تلميع وتصحيح طلاء بمرحلة واحدة شامل",
                "طلاء الزجاج والجنوط الخارجية بالسيراميك",
                "ضمان كتابي لمدة 3 سنوات",
                "إعادة إنعاش وتنشيط مجاني سنوياً",
            ],
        },
    },
    {
        id: "ceramic-ultra-5yr",
        category: "ceramic",
        name: {
            en: "CERAMIC FLAGSHIP 9H+ (5-YEAR)",
            ar: "سيراميك فلاجشيب 9H+ (5 سنوات)",
        },
        description: {
            en: "Multi-layer obsidian ceramic coating with short-wave IR light curing for maximum chemical resistance.",
            ar: "طلاء سيراميك سيراميك متعدد الطبقات مع تجفيف حراري بالإنفراريد لأقصى مقاومة كيميائية.",
        },
        price: {
            en: "Starting at AED 3,800",
            ar: "يبدأ من 3,800 د.إ",
        },
        badge: {
            en: "RECOMMENDED",
            ar: "موصى به",
        },
        popular: true,
        features: {
            en: [
                "4 Layers of 9H+ Nano-Ceramic Protection",
                "Multi-Stage Paint Defect Correction",
                "Infrared Lamp Accelerated Curing Process",
                "Full Wheel Barrel & Brake Caliper Coating",
                "5-Year Written Performance Guarantee",
            ],
            ar: [
                "4 طبقات حماية نانو سيراميك بصلابة 9H+",
                "تصحيح طلاء متعدد المراحل لإزالة عيوب الطلاء",
                "معالجة حرارية سريعة بمصابيح الإنفراريد",
                "طلاء الجنوط بالكامل وفحمات الفرامل",
                "ضمان كتابي دائم لمدة 5 سنوات",
            ],
        },
    },

    // DETAILING PACKAGES
    {
        id: "detailing-signature",
        category: "detailing",
        name: {
            en: "FTX SIGNATURE CORRECTION",
            ar: "التلميع الاحترافي المميز",
        },
        description: {
            en: "Multi-stage paint correction removing paint defects, swirl marks, light scratches, and oxidation.",
            ar: "تصحيح طلاء على مراحل متعددة لإزالة دوائر التلميع والخدوش الخفيفة والأكسدة وزيادة اللمعان.",
        },
        price: {
            en: "Starting at AED 1,500",
            ar: "يبدأ من 1,500 د.إ",
        },
        features: {
            en: [
                "Decontamination Foam Wash & Synthetic Clay Treatment",
                "2-Stage Dual Action Machine Polish Defect Removal",
                "Engine Bay Degreasing & Dressing",
                "Full Interior Leather & Fabric Deep Cleaning",
                "Exhaust Tip Metal Restoration",
            ],
            ar: [
                "غسيل بالرغوة وتنظيف بالصلصال لإزالة الترسبات",
                "تلميع ميكانيكي بمرحلتين لإزالة عيوب ودوائر الطلاء",
                "تنظيف وتلميع حجرة المحرك بعناية",
                "تنظيف شامل للجلد الداخلي والأقمشة بالبخار",
                "تلميع مخرج العادم والجزء المعدني",
            ],
        },
    },
];
