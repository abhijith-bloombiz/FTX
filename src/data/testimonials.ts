export interface TestimonialItem {
    id: string;
    name: string;
    role: Record<"en" | "ar", string>;
    vehicle: string;
    avatar: string;
    rating: number;
    content: Record<"en" | "ar", string>;
}

export const testimonialsData: TestimonialItem[] = [
    {
        id: "t1",
        name: "Tariq Al-Mansoori",
        role: {
            en: "Supercar Collector",
            ar: "جامع سيارات فائقة",
        },
        vehicle: "Porsche 911 GT3 RS",
        avatar: "/images/testimonials/avatar-1.jpg",
        rating: 5,
        content: {
            en: "The precision on my GT3 RS is unmatched. The wrapped edges on the PPF are completely invisible. FTX is the gold standard in Dubai.",
            ar: "الدقة في عمل جيب البورشه لم أَرَ لها مثيلاً. حواف فلم الحماية غير مرئية كلياً. FTX هم المعيار الذهبي في التلميع والحماية.",
        },
    },
    {
        id: "t2",
        name: "Marcus Vance",
        role: {
            en: "Automotive Enthusiast",
            ar: "متذوق سيارات رياضية",
        },
        vehicle: "Ferrari F8 Tributo",
        avatar: "/images/testimonials/avatar-2.jpg",
        rating: 5,
        content: {
            en: "The ceramic glass gloss on my F8 Tributo turns heads everywhere. Water slides right off. Truly surgical execution by the FTX master team.",
            ar: "اللمعان السيراميكي الزجاجي في الفيراري يجذب الأنظار في كل مكان. المياه تنزلق فوراً. عمل دقيق واحترافي للغاية من فريق FTX.",
        },
    },
    {
        id: "t3",
        name: "Khalid Bin Sultan",
        role: {
            en: "AMG Owner",
            ar: "مالك مرسيدس AMG",
        },
        vehicle: "Mercedes-AMG G63",
        avatar: "/images/testimonials/avatar-3.jpg",
        rating: 5,
        content: {
            en: "From the initial consultation to the final handover under studio lights, FTX handled my G63 with extreme care. 10/10 experience.",
            ar: "منذ الاستشارة الأولى وحتى التسليم النهائي تحت أضواء الاستوديو، تعامل فريق FTX مع سيارتي باهتمام فائق. تجربة 10/10.",
        },
    },
];
