import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonialItem extends Document {
    testimonialId: string;
    name: string;
    role: { en: string; ar: string };
    vehicle: string;
    avatar: string;
    rating: number;
    content: { en: string; ar: string };
}

const TestimonialItemSchema = new Schema<ITestimonialItem>(
    {
        testimonialId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        role: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
        vehicle: { type: String, required: true },
        avatar: { type: String, required: true },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        content: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
    },
    { timestamps: true }
);

export const TestimonialItemModel: Model<ITestimonialItem> =
    mongoose.models.TestimonialItem || mongoose.model<ITestimonialItem>("TestimonialItem", TestimonialItemSchema);
