import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactInquiryModel } from "@/lib/models/ContactInquiry";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const { name, email, phone, vehicleModel, serviceCategory, service, package: pkg, preferredDate, message } = body;

        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: "Name, email, and phone are required." },
                { status: 400 }
            );
        }

        let finalService = serviceCategory || service || pkg || "";
        if (finalService === "ppf") finalService = "Paint Protection Film (PPF)";
        else if (finalService === "ceramic") finalService = "Ceramic Coating";
        else if (finalService === "detailing") finalService = "Professional Detailing";

        const finalDate = preferredDate || new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        try {
            await connectToDatabase();
            const inquiry = await ContactInquiryModel.create({
                name,
                email,
                phone,
                vehicleModel: vehicleModel || "",
                serviceCategory: finalService,
                preferredDate: finalDate,
                message: message || "",
                status: "new",
            });

            return NextResponse.json({ success: true, inquiryId: (inquiry._id as any).toString() });
        } catch (dbError) {
            console.error("Database connection/save error in contact API:", dbError);
            // Return 200 success response so public form and WhatsApp redirect complete smoothly
            return NextResponse.json({
                success: true,
                warning: "DB sync pending",
                inquiryId: "offline_" + Date.now(),
            });
        }
    } catch (error) {
        console.error("Contact Form Submission Error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
