import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { TestimonialItemModel } from "@/lib/models/TestimonialItem";
import { getAdminSession } from "@/lib/auth";
import { testimonialsData } from "@/data/testimonials";
import { deleteUploadedFile } from "@/lib/deleteFile";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDatabase();
        await seedDatabase();
        let testimonials = await TestimonialItemModel.find().sort({ createdAt: -1 }).lean();
        if (!testimonials || testimonials.length === 0) {
            testimonials = testimonialsData.map((t) => ({ ...t, testimonialId: t.id, id: t.id })) as any;
        } else {
            testimonials = testimonials.map((t) => ({
                ...t,
                id: t.testimonialId || (t._id as any).toString(),
                testimonialId: t.testimonialId || (t._id as any).toString(),
            })) as any;
        }
        return NextResponse.json({ testimonials, connected: true });
    } catch (error) {
        return NextResponse.json({
            testimonials: testimonialsData.map((t) => ({ ...t, testimonialId: t.id, id: t.id })),
            connected: false,
            fallback: true,
        });
    }
}

export async function POST(req: NextRequest) {
    let body: any = {};
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        body = await req.json();
        const testimonialId = body.testimonialId || body.id || `t-${Date.now()}`;
        const newTestimonial = { ...body, testimonialId, id: testimonialId };

        try {
            await connectToDatabase();
            const testimonial = await TestimonialItemModel.create(newTestimonial);
            return NextResponse.json({ success: true, testimonial }, { status: 201 });
        } catch (dbErr: any) {
            console.warn("DB Connection failed in POST /api/admin/testimonials, using fallback mode:", dbErr.message);
            return NextResponse.json({ success: true, testimonial: newTestimonial, fallback: true }, { status: 201 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to create testimonial" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { _id, testimonialId, id, ...updateData } = body;
        const targetId = testimonialId || id || _id || `t-${Date.now()}`;
        const updatedItem = { ...body, testimonialId: targetId, id: targetId };

        try {
            await connectToDatabase();
            const filterConditions: any[] = [];
            if (_id && mongoose.Types.ObjectId.isValid(_id)) {
                filterConditions.push({ _id });
            }
            if (targetId) {
                filterConditions.push({ testimonialId: targetId });
            }

            let updated = null;
            if (filterConditions.length > 0) {
                const existing: any = await TestimonialItemModel.findOne({ $or: filterConditions }).lean();
                if (existing) {
                    if (updateData.avatar && existing.avatar && updateData.avatar !== existing.avatar) {
                        await deleteUploadedFile(existing.avatar);
                    }
                    if (updateData.image && existing.image && updateData.image !== existing.image) {
                        await deleteUploadedFile(existing.image);
                    }
                }

                updated = await TestimonialItemModel.findOneAndUpdate(
                    { $or: filterConditions },
                    { ...updateData, testimonialId: targetId },
                    { returnDocument: "after", upsert: true }
                );
            } else {
                updated = await TestimonialItemModel.create({
                    ...updateData,
                    testimonialId: targetId,
                });
            }
            return NextResponse.json({ success: true, testimonial: updated });
        } catch (dbErr: any) {
            console.warn("DB Connection failed in PUT /api/admin/testimonials, using fallback mode:", dbErr.message);
            return NextResponse.json({ success: true, testimonial: updatedItem, fallback: true });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update testimonial" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        try {
            await connectToDatabase();
            const filterConditions: any[] = [{ testimonialId: id }];
            if (mongoose.Types.ObjectId.isValid(id)) {
                filterConditions.push({ _id: id });
            }

            const existing: any = await TestimonialItemModel.findOne({ $or: filterConditions }).lean();
            if (existing) {
                await deleteUploadedFile(existing.avatar);
                await deleteUploadedFile(existing.image);
            }

            await TestimonialItemModel.deleteOne({ $or: filterConditions });
            return NextResponse.json({ success: true });
        } catch (dbErr: any) {
            console.warn("DB Connection failed in DELETE /api/admin/testimonials, using fallback mode:", dbErr.message);
            return NextResponse.json({ success: true, fallback: true });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete testimonial" }, { status: 500 });
    }
}
