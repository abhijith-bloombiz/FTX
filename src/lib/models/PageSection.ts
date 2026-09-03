import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageSection extends Document {
    page: string; // "home" | "about" | "services" | "gallery" | "packages" | "contact"
    sectionKey: string; // "intro" | "services" | "why_ftx" | "gallery" | "testimonials" | "contact" | "hero" | "philosophy" | "stats" | etc.
    title: {
        en: string;
        ar: string;
    };
    subtitle?: {
        en: string;
        ar: string;
    };
    content?: {
        en: string;
        ar: string;
    };
    isVisible?: boolean;
    metadata?: Record<string, any>;
    updatedAt: Date;
}

const PageSectionSchema = new Schema<IPageSection>(
    {
        page: { type: String, required: true, index: true },
        sectionKey: { type: String, required: true, index: true },
        title: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
        subtitle: {
            en: { type: String, default: "" },
            ar: { type: String, default: "" },
        },
        content: {
            en: { type: String, default: "" },
            ar: { type: String, default: "" },
        },
        isVisible: { type: Boolean, default: true },
        metadata: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

PageSectionSchema.index({ page: 1, sectionKey: 1 }, { unique: true });

export const PageSection: Model<IPageSection> =
    mongoose.models.PageSection || mongoose.model<IPageSection>("PageSection", PageSectionSchema);
