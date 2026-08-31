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
}

const ServiceItemSchema = new Schema<IServiceItem>(
    {
        serviceId: { type: String, required: true, unique: true },
        number: { type: String, required: true },
        badge: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
        title: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
        subtitle: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
        description: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
        benefits: {
            en: [{ type: String }],
            ar: [{ type: String }],
        },
        highlights: [
            {
                icon: { type: String, default: "shield" },
                title: { en: { type: String }, ar: { type: String } },
                description: { en: { type: String }, ar: { type: String } },
            },
        ],
        process: [
            {
                number: { type: String },
                title: { en: { type: String }, ar: { type: String } },
                description: { en: { type: String }, ar: { type: String } },
            },
        ],
        image: { type: String, required: true },
        detailImages: [{ type: String }],
    },
    { timestamps: true }
);

export const ServiceItemModel: Model<IServiceItem> =
    mongoose.models.ServiceItem || mongoose.model<IServiceItem>("ServiceItem", ServiceItemSchema);
