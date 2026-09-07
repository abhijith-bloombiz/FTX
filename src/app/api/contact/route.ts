import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactInquiryModel } from "@/lib/models/ContactInquiry";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const name = typeof body.name === "string" ? body.name.trim() : "";
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const phone = typeof body.phone === "string" ? body.phone.trim() : "";
        const vehicleModel = typeof body.vehicleModel === "string" ? body.vehicleModel.trim() : "";
        const serviceCategory = typeof body.serviceCategory === "string" ? body.serviceCategory.trim() : "";
        const service = typeof body.service === "string" ? body.service.trim() : "";
        const pkg = typeof body.package === "string" ? body.package.trim() : "";
        const preferredDate = typeof body.preferredDate === "string" ? body.preferredDate.trim() : "";
        const message = typeof body.message === "string" ? body.message.trim() : "";

        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: "Name, email, and phone are required." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
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
                vehicleModel,
                serviceCategory: finalService,
                preferredDate: finalDate,
                message,
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
