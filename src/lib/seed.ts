import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import { AdminUser } from "./models/AdminUser";
import { ServiceItemModel } from "./models/ServiceItem";
import { PackageItemModel } from "./models/PackageItem";
import { GalleryItemModel } from "./models/GalleryItem";
import { TestimonialItemModel } from "./models/TestimonialItem";
import { PageSection } from "./models/PageSection";

import { servicesData } from "@/data/services";
import { packagesData } from "@/data/packages";
import { galleryData } from "@/data/gallery";
import { testimonialsData } from "@/data/testimonials";

declare global {
    var isDatabaseSeeded: boolean | undefined;
    var databaseSeedPromise: Promise<void> | undefined;
}

export async function seedDatabase() {
    if (global.isDatabaseSeeded) return;
    if (global.databaseSeedPromise) {
        return global.databaseSeedPromise;
    }

    global.databaseSeedPromise = (async () => {
        try {
            await connectToDatabase();

            // 1. Seed Admin User (only if no admin accounts exist in database)
            const adminEmail = (process.env.ADMIN_EMAIL || "abhijith.bloombiz@gmail.com").toLowerCase();
            const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminSecretPass2026!";

            const adminCount = await AdminUser.countDocuments();
            if (adminCount === 0) {
                const passwordHash = await bcrypt.hash(initialPassword, 10);
                await AdminUser.create({
                    email: adminEmail,
                    passwordHash,
                    name: "FTX Lead Admin",
                });
                console.log(`Seeded Admin User: ${adminEmail}`);
            }

            // 2. Seed / Sync Services (Ensure all services in servicesData exist in DB)
            const existingServices = await ServiceItemModel.find({}, "serviceId").lean();
            const existingServiceIds = new Set(existingServices.map((s: any) => s.serviceId));
            const missingServices = servicesData
                .filter((s) => !existingServiceIds.has(s.id))
                .map((s) => ({
                    ...s,
                    serviceId: s.id,
                }));

            if (missingServices.length > 0) {
                await ServiceItemModel.insertMany(missingServices);
                console.log(`Synced ${missingServices.length} new service(s) to Services collection`);
            }

            // Sync updated process, benefits, and footer note for underbody-rust-proof
            const underbodyData = servicesData.find((s) => s.id === "underbody-rust-proof");
            if (underbodyData) {
                await ServiceItemModel.updateOne(
                    { serviceId: "underbody-rust-proof" },
                    {
                        $set: {
                            process: underbodyData.process,
                            benefits: underbodyData.benefits,
                            footerNote: underbodyData.footerNote,
                        }
                    }
                );
            }

            // Sync default buttonText for existing services if missing or empty
            for (const s of servicesData) {
                if (s.buttonText) {
                    await ServiceItemModel.updateMany(
                        {
                            serviceId: s.id,
                            $or: [
                                { buttonText: { $exists: false } },
                                { "buttonText.en": { $exists: false } },
                                { "buttonText.en": "" }
                            ]
                        },
                        { $set: { buttonText: s.buttonText } }
                    );
                }
            }

        // 3. Seed Packages
        const packageCount = await PackageItemModel.countDocuments();
        if (packageCount === 0) {
            const packagesToInsert = packagesData.map((p) => ({
                ...p,
                packageId: p.id,
            }));
            await PackageItemModel.insertMany(packagesToInsert);
            console.log("Seeded Packages collection");
        }

        // 4. Seed Gallery
        const galleryCount = await GalleryItemModel.countDocuments();
        if (galleryCount === 0) {
            const galleryToInsert = galleryData.map((g) => ({
                ...g,
                itemId: g.id,
            }));
            await GalleryItemModel.insertMany(galleryToInsert);
            console.log("Seeded Gallery collection");
        }

        // 5. Seed Testimonials
        const testimonialCount = await TestimonialItemModel.countDocuments();
        if (testimonialCount === 0) {
            const testimonialsToInsert = testimonialsData.map((t) => ({
                ...t,
                testimonialId: t.id,
            }));
            await TestimonialItemModel.insertMany(testimonialsToInsert);
            console.log("Seeded Testimonials collection");
        }

        // 6. Seed Page Sections (Home, About, Services, Gallery, Packages, Contact)
        const initialPageSections = [
            // HOME SECTIONS
            {
                page: "home",
                sectionKey: "intro",
                title: {
                    en: "SURGICAL PRECISION FOR HYPERCARS & LUXURY AUTOMOBILES",
                    ar: "دقة جراحية للسيارات الخارقة والسيارات الفاخرة",
                },
                subtitle: {
                    en: "ENGINEERED FOR PROTECTION. CRAFTED FOR PERFECTION.",
                    ar: "صُمِمَت لِلْحِمَايَة. صُنِعَت لِلْكَمَال.",
                },
                content: {
                    en: "At FTX - First Torque X, we treat every vehicle as a masterwork of design and engineering. Our studio environment is designed for maximum clarity and surgical execution. From exotic supercars to high-performance daily drivers, our specialized technicians apply world-class paint protection film and hydrophobic coatings with unyielding precision.",
                    ar: "في FTX - فيرست تورك إكس، نتعامل مع كل سيارة كتحفة فنية في التصميم والهندسة. بيئة استوديو العناية لدينا مصممة لأقصى درجات الوضوح والتنفيذ الدقيق. من السيارات الخارقة إلى السيارات الرياضية اليومية، يطبق فنيونا المتخصصون أفلام حماية الطلاء العالمية والطلاء السيراميكي بدقة لا تضاهى.",
                },
                metadata: {
                    establishedYear: "2024",
                    studioLocation: "UAE",
                },
            },
            {
                page: "home",
                sectionKey: "services",
                title: {
                    en: "PROTECTION & DETAILING SERVICES",
                    ar: "خدمات الحماية والتفصيل الدقيق",
                },
                subtitle: {
                    en: "AUTOMOTIVE DEFENSE",
                    ar: "حماية السيارات الفائقة",
                },
                content: {
                    en: "Explore our specialized services engineered to shield factory paint and enhance visual depth.",
                    ar: "استكشف خدماتنا المتخصصة المصممة لحماية طلاء المصنع وتعزيز عُمق اللمعان.",
                },
            },
            {
                page: "home",
                sectionKey: "why_ftx",
                title: {
                    en: "WHY CHOOSE FTX",
                    ar: "لماذا تختار FTX",
                },
                subtitle: {
                    en: "THE SURGICAL STANDARD IN VEHICLE PROTECTION",
                    ar: "المعيار الجراحي في حماية السيارات",
                },
                content: {
                    en: "Four core pillars that set our studio environment apart from conventional detailing shops.",
                    ar: "أربعة ركائز أساسية تميز استوديو العناية لدينا عن المراكز التقليدية.",
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
                title: {
                    en: "FTX AUTOMOTIVE PORTFOLIO",
                    ar: "معرض أعمال FTX للسيارات",
                },
                subtitle: {
                    en: "PRECISION EXECUTION SHOWCASE",
                    ar: "استعراض التنفيذ الدقيق الفاخر",
                },
                content: {
                    en: "Filter through recent supercar paint protection film, ceramic coating, and bespoke detailing projects.",
                    ar: "تصفح المشاريع الأخيرة لحماية السيارات الخارقة والطلاء السيراميكي والعناية الشاملة.",
                },
            },
            {
                page: "home",
                sectionKey: "testimonials",
                title: {
                    en: "CLIENT EXPERIENCES",
                    ar: "آراء وانطباعات العملاء",
                },
                subtitle: {
                    en: "TRUSTED BY DISCERNING AUTOMOTIVE ENTHUSIASTS",
                    ar: "ثقة ملاك وعشاق السيارات الفاخرة",
                },
                content: {
                    en: "Read genuine feedback from supercar collectors and automotive enthusiasts.",
                    ar: "اقرأ التقييمات الحقيقية من ملاك وعشاق السيارات الخارقة والرياضية.",
                },
            },
            {
                page: "home",
                sectionKey: "contact",
                title: {
                    en: "BOOK CONSULTATION",
                    ar: "حجز استشارة",
                },
                subtitle: {
                    en: "UNYIELDING PRECISION",
                    ar: "دقة فائقة",
                },
                content: {
                    en: "Connect directly with our master technicians to discuss custom paint protection film or ceramic coating packages.",
                    ar: "تواصل مباشرة مع كبير الفنيين لمناقشة باقات أفلام الحماية والطلاء السيراميكي المخصصة لسيارتك.",
                },
            },

            // ABOUT PAGE SECTIONS
            {
                page: "about",
                sectionKey: "hero",
                title: {
                    en: "ABOUT FTX",
                    ar: "عن FTX",
                },
                subtitle: {
                    en: "PRECISION PROTECTION",
                    ar: "دقة وحماية",
                },
                content: {
                    en: "FTX stands as an elite studio dedicated exclusively to the preservation and aesthetic perfection of high-value automotive masterworks.",
                    ar: "FTX استوديو نخبة مخصص حصرياً للحفاظ على تحف السيارات الفاخرة وإتقان مظهرها الجمالي.",
                },
            },
            {
                page: "about",
                sectionKey: "philosophy",
                title: {
                    en: "OUR STUDIO PHILOSOPHY",
                    ar: "فلسفة استوديو FTX",
                },
                subtitle: {
                    en: "CLARITY. REFINEMENT. INTEGRITY.",
                    ar: "الوضوح. الإتقان. النزاهة.",
                },
                content: {
                    en: "We operate in climate-controlled isolation bays designed to eliminate ambient airborne dust. Every cut is digitally mapped using high-precision CAD software before application.",
                    ar: "نعمل في كبائن معزولة ومتحكم ببيئتها حرارياً للقضاء على الغبار والشوائب الهوائية. يتم قص كل فلم رقمياً باستخدام برامج CAD فائقة الدقة قبل التركيب.",
                },
            },

            // SERVICES PAGE SECTIONS
            {
                page: "services",
                sectionKey: "header",
                title: {
                    en: "AUTOMOTIVE PROTECTION SERVICES",
                    ar: "خدمات حماية وتفصيل السيارات",
                },
                subtitle: {
                    en: "WORLD-CLASS COATINGS & FILMS",
                    ar: "طلاءات وأفلام عالمية المستوى",
                },
                content: {
                    en: "Detailed breakdown of Paint Protection Film (PPF), Nano Ceramic Coating, and Professional Detailing.",
                    ar: "استعراض تفصيلي لأفلام حماية الطلاء (PPF)، الطلاء السيراميكي، والتلميع الشامل.",
                },
            },

            // GALLERY PAGE SECTIONS
            {
                page: "gallery",
                sectionKey: "header",
                title: {
                    en: "CINEMATIC GALLERY & PORTFOLIO",
                    ar: "معرض الصور والفيديوهات السينمائي",
                },
                subtitle: {
                    en: "SIGHT & SOUND OF AUTOMOTIVE PERFECTION",
                    ar: "مشاهد أصالة وإتقان حماية السيارات",
                },
                content: {
                    en: "Watch high-definition 4K studio process clips and high-resolution photo highlights.",
                    ar: "شاهد مقاطع استوديو عالية الدقة وصور الأعمال التخصصية.",
                },
            },

            // PACKAGES PAGE SECTIONS
            {
                page: "packages",
                sectionKey: "header",
                title: {
                    en: "TAILORED PROTECTION PACKAGES",
                    ar: "باقات الحماية المخصصة",
                },
                subtitle: {
                    en: "TRANSPARENT PRICING & GUARANTEED DEFENSE",
                    ar: "أسعار شفافة وضمان دائم للحماية",
                },
                content: {
                    en: "Choose from our signature Front Track, Full Body, Ceramic 9H, or Interior Spa packages.",
                    ar: "اختر من بين باقات حماية المقدمة، التغليف الكامل، السيراميك، أو العناية بالجلد.",
                },
            },

            // CONTACT PAGE SECTIONS
            {
                page: "contact",
                sectionKey: "info",
                title: {
                    en: "CONTACT US",
                    ar: "تواصل معنا",
                },
                subtitle: {
                    en: "AUTOMOTIVE PRECISION DISTRICT",
                    ar: "منطقة تميز السيارات",
                },
                content: {
                    en: "Visit our state-of-the-art studio bay or send an inquiry to book your vehicle consultation.",
                    ar: "تفضل بزيارة استوديو FTX أو أرسل استفسارك لحجز موعد استشارة سيارتك.",
                },
                metadata: {
                    phone: "+971 50 000 0000",
                    email: "info@ftxdetailing.ae",
                    addressEn: "Automotive Precision District, Bay 14, UAE",
                    addressAr: "منطقة تميز السيارات، المجمع 14، الإمارات العربية المتحدة",
                    workingHoursEn: "Mon - Sat: 9:00 AM - 8:00 PM (Sun: Closed)",
                    workingHoursAr: "الإثنين - السبت: 9:00 صباحاً - 8:00 مساءً (الأحد: مغلق)",
                    social: {
                        instagram: "https://instagram.com/ftxdetailing",
                        youtube: "https://youtube.com/@ftxdetailing",
                        facebook: "https://facebook.com/ftxdetailing",
                    },
                },
            },
        ];

            const pageSectionCount = await PageSection.countDocuments();
            if (pageSectionCount === 0) {
                await PageSection.insertMany(initialPageSections);
                // Apply specific overrides on initial seed
                await PageSection.updateOne(
                    { page: "home", sectionKey: "contact" },
                    { $set: { "title.en": "BOOK CONSULTATION", "title.ar": "حجز استشارة", "subtitle.en": "UNYIELDING PRECISION", "subtitle.ar": "دقة فائقة" } }
                );
                await PageSection.updateOne(
                    { page: "home", sectionKey: "services" },
                    { $set: { "title.en": "PROTECTION & DETAILING SERVICES", "title.ar": "خدمات الحماية والتفصيل الدقيق", "subtitle.en": "AUTOMOTIVE DEFENSE", "subtitle.ar": "حماية السيارات الفائقة" } }
                );
                await PageSection.updateOne(
                    { page: "about", sectionKey: "hero" },
                    {
                        $set: {
                            "content.en": "FTX stands as an elite studio dedicated exclusively to the preservation and aesthetic perfection of high-value automotive masterworks.",
                            "content.ar": "FTX استوديو نخبة مخصص حصرياً للحفاظ على تحف السيارات الفاخرة وإتقان مظهرها الجمالي."
                        }
                    }
                );
                console.log("Seeded Page Sections successfully!");
            }

            // Ensure About page hero title is updated to "ABOUT FTX"
            await PageSection.updateOne(
                { page: "about", sectionKey: "hero", "title.en": { $regex: /FIRST TORQUE X/i } },
                {
                    $set: {
                        "title.en": "ABOUT FTX",
                        "title.ar": "عن FTX",
                    }
                }
            );

            global.isDatabaseSeeded = true;
        } catch (error) {
            console.error("Database Seeding Error:", error);
        } finally {
            global.databaseSeedPromise = undefined;
        }
    })();

    return global.databaseSeedPromise;
}
