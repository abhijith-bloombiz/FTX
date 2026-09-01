import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactInquiry extends Document {
    name: string;
    email: string;
    phone: string;
    vehicleModel?: string;
    serviceCategory?: string;
    preferredDate?: string;
    message: string;
    status: "new" | "contacted" | "closed";
    createdAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        vehicleModel: { type: String, default: "" },
        serviceCategory: { type: String, default: "" },
        preferredDate: { type: String, default: "" },
        message: { type: String, default: "" },
        status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
    },
    { timestamps: true }
);

export const ContactInquiryModel: Model<IContactInquiry> =
    mongoose.models.ContactInquiry || mongoose.model<IContactInquiry>("ContactInquiry", ContactInquirySchema);
