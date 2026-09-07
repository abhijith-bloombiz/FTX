import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServiceItem extends Document {
    serviceId: string;
    number: string;
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    description: { en: string; ar: string };
    benefits: { en: string[]; ar: string[] };
    highlights: Array<{
        icon: string;
        title: { en: string; ar: string };
        description: { en: string; ar: string };
    }>;
    process: Array<{
        number: string;
        title: { en: string; ar: string };
        description: { en: string; ar: string };
    }>;
    image: string;
    detailImages: string[];
    footerNote?: { en: string; ar: string };
    buttonText?: { en: string; ar: string };
}

const ServiceItemSchema = new Schema<IServiceItem>(
    {
        serviceId: { type: String, required: true },
        number: { type: String, default: "01" },
        badge: {
            en: { type: String, default: "SERVICE" },
            ar: { type: String, default: "خدمة" },
        },
        title: {
            en: { type: String, default: "NEW SERVICE" },
            ar: { type: String, default: "خدمة جديدة" },
        },
        subtitle: {
            en: { type: String, default: "" },
            ar: { type: String, default: "" },
        },
        description: {
            en: { type: String, default: "" },
            ar: { type: String, default: "" },
        },
        buttonText: {
            en: { type: String, default: "" },
            ar: { type: String, default: "" },
        },
        benefits: {
            en: [{ type: String }],
            ar: [{ type: String }],
        },
        highlights: [
            {
                icon: { type: String, default: "shield" },
                title: { en: { type: String, default: "" }, ar: { type: String, default: "" } },
                description: { en: { type: String, default: "" }, ar: { type: String, default: "" } },
            },
        ],
        process: [
            {
                number: { type: String, default: "01" },
                title: { en: { type: String, default: "" }, ar: { type: String, default: "" } },
                description: { en: { type: String, default: "" }, ar: { type: String, default: "" } },
            },
        ],
        image: { type: String, default: "/images/services/ppf-main.png" },
        detailImages: [{ type: String }],
        footerNote: {
            en: { type: String, default: "" },
            ar: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

if (mongoose.models.ServiceItem) {
    delete (mongoose.models as any).ServiceItem;
}

export const ServiceItemModel: Model<IServiceItem> =
    mongoose.models.ServiceItem || mongoose.model<IServiceItem>("ServiceItem", ServiceItemSchema);
