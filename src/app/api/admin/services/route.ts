import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { ServiceItemModel } from "@/lib/models/ServiceItem";
import { getAdminSession } from "@/lib/auth";
import { servicesData } from "@/data/services";

// GET all services
export async function GET() {
    try {
        await connectToDatabase();
        await seedDatabase();
        let services = await ServiceItemModel.find().sort({ number: 1 }).lean();
        if (!services || services.length === 0) {
            services = servicesData.map((s) => ({ ...s, serviceId: s.id })) as any;
        }
        return NextResponse.json({ services, connected: true });
    } catch (error) {
        return NextResponse.json({
            services: servicesData.map((s) => ({ ...s, serviceId: s.id })),
            connected: false,
            fallback: true,
        });
    }
}

// POST create service
export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();

        const service = await ServiceItemModel.create(body);
        return NextResponse.json({ success: true, service }, { status: 201 });
    } catch (error: any) {
        console.error("Create Service Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create service" }, { status: 500 });
    }
}

import mongoose from "mongoose";

// PUT update service
export async function PUT(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();
        const { _id, serviceId, ...updateData } = body;

        const targetId = serviceId || _id;
        const filterConditions: any[] = [];

        if (_id && mongoose.Types.ObjectId.isValid(_id)) {
            filterConditions.push({ _id });
        }
        if (targetId) {
            filterConditions.push({ serviceId: targetId });
        }

        let updated = null;
        if (filterConditions.length > 0) {
            updated = await ServiceItemModel.findOneAndUpdate(
                { $or: filterConditions },
                { ...updateData, serviceId: targetId },
                { new: true, upsert: true }
            );
        } else {
            updated = await ServiceItemModel.create({
                ...updateData,
                serviceId: targetId || `service-${Date.now()}`,
            });
        }

        return NextResponse.json({ success: true, service: updated });
    } catch (error: any) {
        console.error("Update Service Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update service" }, { status: 500 });
    }
}

// DELETE service
export async function DELETE(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const filterConditions: any[] = [{ serviceId: id }];
        if (mongoose.Types.ObjectId.isValid(id)) {
            filterConditions.push({ _id: id });
        }

        await ServiceItemModel.deleteOne({ $or: filterConditions });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Service Error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete service" }, { status: 500 });
    }
}
