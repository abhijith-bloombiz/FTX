import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPackageItem extends Document {
    packageId: string;
    category: "ppf" | "ceramic" | "detailing";
    name: { en: string; ar: string };
    description: { en: string; ar: string };
    price: { en: string; ar: string };
    badge?: { en: string; ar: string };
    popular: boolean;
    features: { en: string[]; ar: string[] };
}

const PackageItemSchema = new Schema<IPackageItem>(
    {
        packageId: { type: String, required: true, unique: true },
        category: { type: String, required: true, enum: ["ppf", "ceramic", "detailing"] },
        name: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
        description: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
        price: {
            en: { type: String, required: true },
            ar: { type: String, required: true },
        },
        badge: {
            en: { type: String, default: "" },
            ar: { type: String, default: "" },
        },
        popular: { type: Boolean, default: false },
        features: {
            en: [{ type: String }],
            ar: [{ type: String }],
        },
    },
    { timestamps: true }
);

export const PackageItemModel: Model<IPackageItem> =
    mongoose.models.PackageItem || mongoose.model<IPackageItem>("PackageItem", PackageItemSchema);
