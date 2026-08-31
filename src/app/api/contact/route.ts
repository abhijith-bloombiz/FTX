import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactInquiryModel } from "@/lib/models/ContactInquiry";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const { name, email, phone, vehicleModel, serviceCategory, preferredDate, message } = body;

        if (!name || !email || !phone || !message) {
            return NextResponse.json(
                { error: "Name, email, phone, and message are required." },
                { status: 400 }
            );
        }

        const inquiry = await ContactInquiryModel.create({
            name,
            email,
            phone,
            vehicleModel: vehicleModel || "",
            serviceCategory: serviceCategory || "",
            preferredDate: preferredDate || "",
            message,
            status: "new",
        });

        return NextResponse.json({ success: true, inquiryId: (inquiry._id as any).toString() });
    } catch (error) {
        console.error("Contact Form Submission Error:", error);
        return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
    }
}
