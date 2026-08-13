import { NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation/contact";
import { ContactFormData } from "@/types/contact";

export async function POST(request: Request) {
    try {
        const body: ContactFormData = await request.json();

        // Validate incoming payload
        const validation = validateContactForm(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed. Please check the highlighted form fields.",
                    errors: validation.errors,
                },
                { status: 400 }
            );
        }

        // In a production setup, send email via Nodemailer / SendGrid / Resend here.
        console.log("New Quote Request Received:", body);

        return NextResponse.json(
            {
                success: true,
                message: "Your quote request has been received. Our specialist will contact you shortly.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An internal server error occurred. Please try again later.",
            },
            { status: 500 }
        );
    }
}
