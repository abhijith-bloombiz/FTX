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
        buttonText: {
            en: "EXPLORE PPF PACKAGES",
            ar: "استكشف باقات الـ PPF",
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
        buttonText: {
            en: "VIEW CERAMIC OPTIONS",
            ar: "عرض خيارات السيراميك",
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
        buttonText: {
            en: "EXPLORE DETAILING PACKAGES",
            ar: "استكشف باقات التلميع",
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
        buttonText: {
            en: "BOOK WINDOW TINTING",
            ar: "احجز خدمة التظليل الحراري",
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
    {
        id: "underbody-rust-proof",
        number: "05",
        badge: {
            en: "CHASSIS DEFENSE",
            ar: "حماية الشاسيه والهيكل",
        },
        title: {
            en: "UNDERBODY RUST-PROOF COATING",
            ar: "طلاء حماية أسفل السيارة من الصدأ",
        },
        subtitle: {
            en: "Protect Your Car From Underneath — Advanced Chassis & Underbody Barrier",
            ar: "احمِ سيارتك من الأسفل — عازل وحماية متطورة لشاسيه وأسفل السيارة",
        },
        description: {
            en: "Your vehicle’s underbody is constantly exposed to road dust, moisture, mud, chemicals, sand and harsh Gulf conditions. Over time, this exposure can cause corrosion and rust, affecting the chassis and other exposed metal components. Our Professional Underbody Rust-Proof Coating provides an additional protective barrier against moisture, corrosion and road contaminants.",
            ar: "يتعرض الجزء السفلي لسيارتك باستمرار لغبار الطرق، الرطوبة، الطين، المواد الكيميائية، والرمال وظروف الخليج القاسية. بمرور الوقت، تسبب هذه العوامل التآكل والصدأ للشاسيه والأجزاء المعدنية المكشوفة. يوفر طلاء الحماية الاحترافي لأسفل السيارة حاجزاً وقائياً فائقاً ضد الرطوبة والصدأ ورواسب الطرق.",
        },
        buttonText: {
            en: "BOOK UNDERBODY TREATMENT",
            ar: "احجز حماية أسفل الهيكل",
        },
        benefits: {
            en: [
                "Helps prevent rust and corrosion",
                "Protects against moisture, dust and road contaminants",
                "Helps preserve the vehicle’s chassis and underbody",
                "Ideal for Saudi Arabia’s harsh climate and road conditions",
                "Keeps your vehicle better protected for the long term",
            ],
            ar: [
                "يساعد على منع الصدأ وتآكل الأجزاء المعدنية",
                "حماية متقدمة ضد الرطوبة والأتربة ورواسب الطرق",
                "يحافظ على متانة وقوة الشاسيه والسطح السفلي للسيارة",
                "مثالي لمناخ وطرق المملكة العربية السعودية وظروف الخليج القاسية",
                "يحافظ على حماية سيارتك بشكل أفضل للمدى الطويل",
            ],
        },
        highlights: [
            {
                icon: "shield",
                title: { en: "Chassis Shield", ar: "درع الشاسيه" },
                description: {
                    en: "Forms an impenetrable molecular barrier on exposed metal and suspension joints.",
                    ar: "يشكل طبقة عازلة تمنع الصدأ تماماً على الأجزاء المعدنية ونظام التعليق.",
                },
            },
            {
                icon: "droplet",
                title: { en: "Moisture & Dust Barrier", ar: "عازل الرطوبة والغبار" },
                description: {
                    en: "Seals underbody components against high humidity, mud, chemicals, and road salts.",
                    ar: "يعزل أسفل الهيكل عن الرطوبة العالية، الأملاح، والمواد الكيميائية الضارة.",
                },
            },
            {
                icon: "car",
                title: { en: "Long-Term Value", ar: "حفظ قيمة السيارة" },
                description: {
                    en: "Maintains vehicle structural health and factory condition for superior longevity.",
                    ar: "يحافظ على سلامة الشاسيه والقوام المعدني الأصلي لضمان عمر أطول للمركبة.",
                },
            },
        ],
        process: [
            {
                number: "01",
                title: { en: "Complete underbody cleaning and degreasing", ar: "تنظيف وإزالة دهون أسفل الهيكل بالكامل" },
                description: {
                    en: "High-pressure thorough underbody cleaning and degreasing to dissolve road grime, oil, and mud.",
                    ar: "غسيل ضغط عالي متكامل لأسفل المركبة مع إزالة الزيوت والأوساخ والدهون العالقة.",
                },
            },
            {
                number: "02",
                title: { en: "Removal of accumulated dirt, mud and contaminants", ar: "إزالة الأوساخ والطين والرواسب المتراكمة" },
                description: {
                    en: "Mechanical extraction and meticulous decontamination of accumulated dirt, road grime, and contaminants from chassis cavities.",
                    ar: "إزالة دقيقة لكافة الأتربة والرواسب العالقة في تجاويف وهيكل السيارة.",
                },
            },
            {
                number: "03",
                title: { en: "Thorough drying and inspection", ar: "التجفيف الشامل وفحص الشاسيه" },
                description: {
                    en: "Complete industrial heated air-drying and comprehensive mechanical inspection under lift studio lights.",
                    ar: "تجفيف هوائي حراري كامل مع فحص ميكانيكي دقيق للشاسيه تحت إضاءة الرفع المتخصصة.",
                },
            },
            {
                number: "04",
                title: { en: "Application of professional-grade rust-proof protective coating", ar: "تطبيق طلاء الحماية الاحترافي ضد الصدأ" },
                description: {
                    en: "Precision spray application of heavy-duty rust inhibitor creating an impenetrable protective barrier against corrosion.",
                    ar: "رش دقيق لمركبات عازلة فائقة القوة تشكل حاجزاً منيعاً يحمي المعدن من التآكل.",
                },
            },
            {
                number: "05",
                title: { en: "Even coverage of exposed underbody areas and wheel arches", ar: "تغطية متساوية للمناطق المكشوفة وأقواس العجلات" },
                description: {
                    en: "Uniform protective layer application across all exposed subframe components, wheel wells, and chassis mountings.",
                    ar: "تطبيق متجانس لطبقة الحماية على كامل الشاسيه السفلي وأقواس العجلات وبطاناتها.",
                },
            },
            {
                number: "06",
                title: { en: "Final quality inspection", ar: "الفحص النهائي الشامل للجودة" },
                description: {
                    en: "Multi-point quality sign-off to ensure total seal integrity and perfect finish before vehicle handover.",
                    ar: "اعتماد الجودة عبر فحص متعدد النقاط لضمان اكتمال العازل ومطابقته لأعلى معايير الحماية.",
                },
            },
        ],
        footerNote: {
            en: "Give your car the protection it needs — not just on the outside, but underneath too. 📲 Book your Underbody Rust-Proof Treatment today.",
            ar: "امنح سيارتك الحماية التي تحتاجها — ليس فقط من الخارج، بل ومن الأسفل أيضاً. 📲 احجز علاج حماية أسفل السيارة من الصدأ اليوم.",
        },
        image: "/images/services/underbody-coating.jpg",
        detailImages: [
            "/images/services/underbody-coating.jpg",
            "/images/gallery/before.png",
        ],
    },
];
