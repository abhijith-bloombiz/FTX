import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactInquiryModel } from "@/lib/models/ContactInquiry";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const inquiries = await ContactInquiryModel.find().sort({ createdAt: -1 });
        return NextResponse.json({ inquiries, connected: true });
    } catch (error) {
        return NextResponse.json({ inquiries: [], connected: false, fallback: true });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const { id, status } = await req.json();

        if (!id || !status) return NextResponse.json({ error: "ID and status required" }, { status: 400 });

        const updated = await ContactInquiryModel.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json({ success: true, inquiry: updated });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update inquiry status" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await ContactInquiryModel.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
    }
}
