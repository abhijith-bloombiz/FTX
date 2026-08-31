import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryItem extends Document {
    itemId: string;
    title: { en: string; ar: string };
    category: string;
    vehicle: { en: string; ar: string };
    image: string;
    video?: string;
    isVideo?: boolean;
    beforeImage?: string;
    afterImage?: string;
    description: { en: string; ar: string };
    tags: string[];
}

const GalleryItemSchema = new Schema<IGalleryItem>(
    {
        itemId: { type: String, required: true, unique: true },
        title: { type: Schema.Types.Mixed, required: true },
        category: { type: String, required: true },
        vehicle: { type: Schema.Types.Mixed, required: true },
        image: { type: String, required: true },
        video: { type: String, default: "" },
        isVideo: { type: Boolean, default: false },
        beforeImage: { type: String, default: "" },
        afterImage: { type: String, default: "" },
        description: { type: Schema.Types.Mixed, required: true },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

export const GalleryItemModel: Model<IGalleryItem> =
    mongoose.models.GalleryItem || mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);
