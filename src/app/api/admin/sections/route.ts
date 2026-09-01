import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PageSection } from "@/lib/models/PageSection";
import { getAdminSession } from "@/lib/auth";
import { getSectionsForPage, updateInMemorySection } from "@/lib/sections";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    if (page && page !== "all") {
        const sections = await getSectionsForPage(page);
        return NextResponse.json({ sections, connected: true });
    }

    const homeSections = await getSectionsForPage("home");
    const aboutSections = await getSectionsForPage("about");
    const contactSections = await getSectionsForPage("contact");
    const sections = [...homeSections, ...aboutSections, ...contactSections];

    return NextResponse.json({ sections, connected: true });
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized - Please Log In" }, { status: 401 });
        }

        const body = await req.json();
        const { page, sectionKey, title, subtitle, content, metadata } = body;

        if (!page || !sectionKey) {
            return NextResponse.json({ error: "Page and sectionKey are required" }, { status: 400 });
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (subtitle !== undefined) updateData.subtitle = subtitle;
        if (content !== undefined) updateData.content = content;
        if (metadata !== undefined) updateData.metadata = metadata;

        let section: any = null;
        let connected = false;

        try {
            await connectToDatabase();
            section = await PageSection.findOneAndUpdate(
                { page, sectionKey },
                { $set: updateData },
                { new: true, upsert: true, runValidators: false }
            ).lean();
            connected = true;
        } catch (dbErr) {
            console.warn("MongoDB offline during PUT, updating in-memory store.");
        }

        updateInMemorySection(page, sectionKey, updateData);

        return NextResponse.json({ success: true, section: section || updateData, connected });
    } catch (error: any) {
        console.error("Update Section Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update section" }, { status: 500 });
    }
}
