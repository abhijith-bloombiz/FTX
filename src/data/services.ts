import { ServiceItem } from "@/types/service";

export const servicesData: ServiceItem[] = [
    {
        id: "ppf",
        number: "01",
        badge: {
            en: "FLAGSHIP PROTECTION",
            ar: "حماية فائقة",
        },
        title: {
            en: "PAINT PROTECTION FILM (PPF)",
            ar: "أفلام حماية الطلاء (PPF)",
        },
        subtitle: {
            en: "Self-Healing Thermoplastic Shield Engineered for High-Impact Defense",
            ar: "درع حماية ذاتي المعالجة للحماية ضد الصدمات والحصى",
        },
        description: {
            en: "Our optical-grade Paint Protection Film provides an invisible layer of armor that absorbs stone chips, road debris, bug splatter, and minor abrasions while preserving factory paint clarity.",
            ar: "توفر أفلام حماية الطلاء البصرية من FTX طبقة غير مرئية تمتص صدمات الحجارة، والخدوش، وفضلات الطيور مع الحفاظ على نقاء طلاء المصنع الأصلي.",
        },
        benefits: {
            en: [
                "Instant heat-activated self-healing property for swirl marks",
                "Hydrophobic top coat repels dirt, mud, and water stains",
                "10-Year manufacturer warranty against yellowing & bubbling",
                "Precision CAD digital computer-cut pattern alignment",
                "Wrapped edges around panel borders for invisible finish",
            ],
            ar: [
                "معالجة ذاتية تفعيل بالحرارة لإخفاء دقيق للخدوش الدقيقة",
                "طبقة فائقة لطرد المياه والأتربة والأوساخ",
                "ضمان لمدة 10 سنوات ضد الاصفرار والتحبب",
                "قص إلكتروني دقيق بالكمبيوتر (CAD) مطابق تماماً لسيارتك",
                "تغليف الحواف حول أطراف الألواح لمظهر خفي تماماً",
            ],
        },
        highlights: [
            {
                icon: "shield",
                title: { en: "Impact Resistance", ar: "مقاومة الصدمات" },
                description: {
                    en: "Deflects high-velocity debris, preventing permanent paint damage.",
                    ar: "يمتص صدمات الحصى المتطايرة ويمنع الأضرار الدائمة للطلاء.",
                },
            },
            {
                icon: "refresh",
                title: { en: "Self-Healing", ar: "المعالجة الذاتية" },
                description: {
                    en: "Advanced polymers reform when exposed to heat, eliminating fine scratches.",
                    ar: "بوليمرات متطورة تتجدد وتخفي الخدوش عند التعرض للحرارة.",
                },
            },
        ],
        process: [
            {
                number: "01",
                title: { en: "Decontamination Wash", ar: "الغسيل والمعالجة الأولية" },
                description: {
                    en: "Multi-stage foam wash, iron remover, and synthetic clay bar treatment to remove microscopic contaminants.",
                    ar: "غسيل بالرغوة على مراحل متعددة مع إزالة الرواسب الحديدية واستخدام الصلصال الصناعي للتنظيف الميكروسكوبي.",
                },
            },
            {
                number: "02",
                title: { en: "Paint Correction & Prep", ar: "تصحيح الطلاء والتجهيز" },
                description: {
                    en: "Single or multi-stage paint correction under studio lights to ensure paint is flawless before film application.",
                    ar: "تصحيح الطلاء بمرحلة أو مراحل متعددة تحت إضاءة استوديو متخصصة لضمان خلو الطلاء من الخدوش قبل تركيب الفلم.",
                },
            },
            {
                number: "03",
                title: { en: "Custom Pattern Fitting", ar: "التركيب والتثبيت الدقيق" },
                description: {
                    en: "CAD-designed precision template installation with slip-solution positioning and seam wrapping.",
                    ar: "تثبيت دقيق بقوالب الكمبيوتر المعايرة مسبقاً مع طي الحواف بسلاسة حول الأجزاء.",
                },
            },
            {
                number: "04",
                title: { en: "Curing & Final Inspection", ar: "التجفيف والفحص النهائي" },
                description: {
                    en: "Climate-controlled curing bay setup followed by 50-point master technician QA review.",
                    ar: "تجفيف في كبينة متحكم بخصائصها الحرارية يعقبه فحص جودة دقيق من 50 نقطة بواسطة كبير الفنيين.",
                },
            },
        ],
        image: "/images/services/ppf-main.png",
        detailImages: [
            "/images/gallery/gt3rs-ppf.jpg",
            "/images/gallery/ppf-studio-hero.jpg",
        ],
    },
    {
        id: "ceramic",
        number: "02",
        badge: {
            en: "NANO TECHNOLOGY",
            ar: "تقنية النانو السيراميك",
        },
        title: {
            en: "CERAMIC COATING",
            ar: "الطلاء السيراميكي",
        },
        subtitle: {
            en: "Multi-Layer SiO2 Glass Matrix for Deep Obsidian Gloss & UV Defense",
            ar: "طبقات نانو سيراميك SiO2 للمعان زجاجي وعميق وحماية ضد الشمس",
        },
        description: {
            en: "Engineered molecular bonding creating a 9H hardness ceramic barrier over vehicle surfaces. Provides unmatched hydrophobic water beading, chemical resistance, and mirror reflection.",
            ar: "ترابط جزيئي متطور يشكل حاجزاً سيراميكياً بصلابة 9H على أسطح السيارة. يمنح خاصية طرد مياه مذهلة ومقاومة للمواد الكيميائية ولمعاناً مرآوياً.",
        },
        benefits: {
            en: [
                "9H Extreme hardness layer resisting light micro-scratches",
                "Permanent molecular chemical bond with clear coat",
                "Intense hydrophobic effect with 110° water contact angle",
                "Blocks UV radiation preventing paint oxidation & fading",
                "Includes glass, wheel caliper, and trim protection",
            ],
            ar: [
                "طبقة سيراميك بصلابة 9H تقاوم الدوائر والخدوش الخفيفة",
                "ترابط جزيئي دائم مع طبقة الحماية الشفافة",
                "خاصية طرد مياه فائقة بلقاء زاوية قطرة 110 درجات",
                "حماية للأشعة فوق البنفسجية تمنع أكسدة وبهتان لون الطلاء",
                "تشمل حماية الزجاج، والجنوط، والقطع البلاستيكية الخارجية",
            ],
        },
        highlights: [
            {
                icon: "droplet",
                title: { en: "Hydrophobic", ar: "طارد فائق للمياه" },
                description: {
                    en: "Repels water and dirt effortlessly, significantly reducing maintenance time.",
                    ar: "يطرد المياه والأتربة بسهولة لتسهيل عملية التنظيف والصيانة.",
                },
            },
            {
                icon: "sparkles",
                title: { en: "Candy Gloss", ar: "بريق مرآوي عميق" },
                description: {
                    en: "Enhances paint depth and clarity, producing a permanent 'wet look' finish.",
                    ar: "يعزز عمق ونقاء اللون ويعطي مظهراً رطباً ولامعاً كالسيراميك.",
                },
            },
        ],
        process: [
            {
                number: "01",
                title: { en: "Surface Stripping & Polish", ar: "إزالة المواد القديمة والتلميع" },
                description: {
                    en: "Removal of old waxes or silicones followed by optical dual-action machine polishing.",
                    ar: "إزالة أي شمع أو زيوت سابقة ثم تلميع ميكانيكي دقيق لإظهار عُمق الطلاء الأصلي.",
                },
            },
            {
                number: "02",
                title: { en: "Alcohol Surface Wipe", ar: "التطهير الكحولي السطحي" },
                description: {
                    en: "Isopropyl alcohol (IPA) panel wipe to leave pure, unadulterated clear coat.",
                    ar: "مسح السطح بمطهر كحولي متخصص IPA لضمان الالتصاق الجزيئي المباشر بالطلاء.",
                },
            },
            {
                number: "03",
                title: { en: "Multi-Layer Application", ar: "تطبيق الطبقات المتعددة" },
                description: {
                    en: "Hand application of base SiO2 hardness coat followed by top hydrophobic slickness layer.",
                    ar: "تطبيق يدوياً لطبقة القاعدة السيراميكية الصلبة تليها الطبقة الخارجية فائقة النعومة والجلاء.",
                },
            },
            {
                number: "04",
                title: { en: "Infrared Curing", ar: "التجفيف بأشعة الإنفراريد" },
                description: {
                    en: "Short-wave infrared lamp exposure accelerating ceramic crystal grid hardening.",
                    ar: "تعريض السيارة لمصابيح الإنفراريد قصيرة الموجة لتسريع كريستالة وتصلب السيراميك.",
                },
            },
        ],
        image: "/images/services/ceramic-main.png",
        detailImages: [
            "/images/gallery/ceramic-beading.jpg",
            "/images/gallery/g63-after.jpg",
        ],
    },
    {
        id: "detailing",
        number: "03",
        badge: {
            en: "PRECISION CRAFT",
            ar: "العناية والتفصيل الدقيق",
        },
        title: {
            en: "PROFESSIONAL DETAILING",
            ar: "التلميع والعناية الشاملة",
        },
        subtitle: {
            en: "Meticulous Multi-Stage Paint Restoration & Bespoke Interior Revitalizing",
            ar: "استعادة وتصحيح كامل للطلاء وتجديد دقيق للمقصورة الداخلية",
        },
        description: {
            en: "A comprehensive restorative service addressing paint defects, orange peel reduction, leather conditioning, engine bay detailing, and high-purity interior ozone sanitization.",
            ar: "خدمة ترميم شاملة تعالج عيوب الطلاء، الخدوش الدقيقة، تنظيف وتغذية الجلد الطبيعي، تلميع حجرة المحرك، وتعقيم المقصورة الداخلية بالأوزون.",
        },
        benefits: {
            en: [
                "Up to 95% swirl, haze, and defect elimination",
                "Deep leather nourishing preventing cracking & stiffness",
                "Interior steam extraction sanitizing carpets and upholstery",
                "Precision engine bay degreasing and protective dressing",
                "Exhaust tip metal polishing & brake caliper restoration",
            ],
            ar: [
                "إزالة تصل إلى 95% من الخدوش الدقيقة والدوائر وبهتان الطلاء",
                "تغذية عميقة للجلد الطبيعي تمنع التققق والصلابة",
                "تنظيف المقصورة بالبخار لتعقيم السجاد والمقاعد",
                "إزالة دهون حجرة المحرك وحمايتها بعناية",
                "تلميع مخارج العادم واستعادة لمعان الفحمات والجنوط",
            ],
        },
        highlights: [
            {
                icon: "wand",
                title: { en: "Paint Correction", ar: "تصحيح الطلاء" },
                description: {
                    en: "Multi-stage machine polishing to permanently remove swirl marks and defects.",
                    ar: "تلميع متعدد المراحل لإزالة الخدوش الدقيقة والدوائر بصفة دائمة.",
                },
            },
            {
                icon: "car",
                title: { en: "Interior Revival", ar: "تجديد المقصورة" },
                description: {
                    en: "Deep extraction, leather conditioning, and comprehensive surface sanitization.",
                    ar: "تنظيف عميق بالبخار، تغذية الجلد، وتعقيمي شامل بالأسطح.",
                },
            },
        ],
        process: [
            {
                number: "01",
                title: { en: "Defect Analysis", ar: "تحليل عيوب الطلاء" },
                description: {
                    en: "Digital paint gauge depth check and inspection under LED light spectrum.",
                    ar: "قياس سماكة الطلاء بجهاز ديجيتال وفحصه تحت أطياف مختلفة من إضاءة LED.",
                },
            },
            {
                number: "02",
                title: { en: "Multi-Step Correction", ar: "التصحيح والتلميع على مراحل" },
                description: {
                    en: "Heavy cut rotary compound followed by fine finishing pad gloss polish.",
                    ar: "تلميع خشن بمكائن دوارة لإزالة الخدوش يليه تلميع ناعم بفرشاة مايكروفايبر للمعان النقي.",
                },
            },
            {
                number: "03",
                title: { en: "Interior Deep Spa", ar: "العناية الفائقة بالمقصورة" },
                description: {
                    en: "PH-balanced leather treatment, alcantara restoration, and carpet extraction.",
                    ar: "تنظيف ومعالجة الجلد بمركبات متوازنة الـ PH وتنظيف وتنشيط شامواه الألكانتارا.",
                },
            },
            {
                number: "04",
                title: { en: "Final Dressing & Shield", ar: "التغذية النهائية والحماية" },
                description: {
                    en: "Application of matte trim sealant and crystal window clarity wipe.",
                    ar: "تطبيق حماية مطفية للقطع البلاستيكية الخارجية والداخلية وتلميع الزجاج النهائي.",
                },
            },
        ],
        image: "/images/services/detailing-main.png",
        detailImages: [
            "/images/gallery/before.png",
            "/images/gallery/after.png",
        ],
    },
    {
        id: "window-films",
        number: "04",
        badge: {
            en: "HEAT & UV PROTECTION",
            ar: "حماية الحرارة والأشعة",
        },
        title: {
            en: "AUTOMOTIVE WINDOW HEAT-INSULATION FILMS",
            ar: "أفلام العزل الحراري لتظليل السيارات",
        },
        subtitle: {
            en: "More Comfort. Less Heat. Lasting Protection.",
            ar: "راحة أكثر. حرارة أقل. حماية دائمة.",
        },
        description: {
            en: "FTX offers high-quality automotive window heat-insulation films designed to reduce solar heat entering the cabin, block harmful UV rays, and minimize glare—providing a more comfortable driving experience while maintaining clear visibility and a sleek, refined appearance.",
            ar: "تقدم FTX أفلام العزل الحراري عالية الجودة للنوافذ والمصممة لتقليل الحرارة الشمسية داخل المقصورة، وحجب الأشعة فوق البنفسجية الضارة، وتقليل التوهج—مما يمنحك تجربة قيادة مريحة وأنيقة مع الحفاظ على وضوح الرؤية لمظهر متميز.",
        },
        benefits: {
            en: [
                "Blocks up to 99% of harmful UV rays preventing interior fading & skin damage",
                "Reduces solar heat buildup by up to 70% for maximum cabin climate comfort",
                "Minimizes glare from direct sunlight and night headlights",
                "Enhances privacy and security without affecting signal reception",
                "High optical clarity preserving crystal-clear driving visibility",
                "FTX — Protection on the outside. Comfort on the inside.",
            ],
            ar: [
                "حجب حتى 99% من الأشعة فوق البنفسجية الضارة لمنع بهتان الجلد وتلف البشرة",
                "تقليل تراكم الحرارة الشمسية حتى 70% لتوفير أقصى درجات الراحة داخل السيارة",
                "تقليل التوهج الناتج عن أشعة الشمس المباشرة وأضواء السيارات الليلية",
                "تعزيز الخصوصية والأمان دون التأثير على إشارات الهاتف أو الملاحة",
                "وضوح بصري نقي يحافظ على الرؤية الكريستالية أثناء القيادة",
                "FTX — حماية من الخارج. وراحة من الداخل.",
            ],
        },
        highlights: [
            {
                icon: "shield",
                title: { en: "01 — Light Tint", ar: "01 — تظليل خفيف" },
                description: {
                    en: "High visibility with a near-factory glass appearance, while providing effective heat insulation and protection from harmful UV rays.",
                    ar: "رؤية عالية ومظهر شبه شفاف كالمصنع مع عزل حراري وحماية ممتازة من الأشعة فوق البنفسجية.",
                },
            },
            {
                icon: "refresh",
                title: { en: "02 — Medium Tint", ar: "02 — تظليل متوسط" },
                description: {
                    en: "The ideal balance of heat insulation, privacy, and visibility—perfect for everyday driving.",
                    ar: "التوازن المثالي بين العزل الحراري، الخصوصية، والرؤية الروتينية القيادية.",
                },
            },
            {
                icon: "sparkles",
                title: { en: "03 — Dark Tint", ar: "03 — تظليل داكن" },
                description: {
                    en: "Enhanced privacy and a bolder appearance, with reduced sun glare and improved comfort inside the cabin.",
                    ar: "خصوصية متقدمة ومظهر أكثر قوة، مع تقليل توهج الشمس لأقصى درجات الراحة داخل المقصورة.",
                },
            },
        ],
        process: [
            {
                number: "01",
                title: { en: "Glass Surface Decontamination", ar: "تنظيف وتعقيم سطح الزجاج" },
                description: {
                    en: "Surgical glass cleaning and razor scraping to ensure zero dust particles under the film.",
                    ar: "تنظيف جراحي دقيق للزجاج مع كشط أي رواسب لضمان خلو الفلم من أي ذرات غبار.",
                },
            },
            {
                number: "02",
                title: { en: "Precision Heat-Shrink Fitting", ar: "الكبس والتشكيل الحراري الدقيق" },
                description: {
                    en: "Hand heat-forming to match the exact curvature of windshield and side windows.",
                    ar: "تشكيل وتشكيل حراري يدوي ليتطابق تماماً مع انحناءات الزجاج الأمامي والجانبي.",
                },
            },
            {
                number: "03",
                title: { en: "Clean-Room Slip Solution Fit", ar: "التركيب في بيئة خالية من الغبار" },
                description: {
                    en: "Dust-free slip installation squeegeed for edge-to-edge bubble-free clarity.",
                    ar: "تركيب بمحلول خاص في استوديو معقم لمنع الفراغات وتثبيت الحواف بدقة.",
                },
            },
            {
                number: "04",
                title: { en: "Micro-Edge Trimming & Inspection", ar: "قص الحواف الدقيق والفحص" },
                description: {
                    en: "Micro-edge shaving aligned with window borders and final optical clarity review.",
                    ar: "قص دقيق جداً متطابق مع حواف النوافذ مع فحص الوضوح البصري النهائي.",
                },
            },
        ],
        image: "/images/services/ppf-main.png",
        detailImages: [
            "/images/gallery/ppf-studio-hero.jpg",
            "/images/gallery/gt3rs-ppf.jpg",
        ],
    },
];
