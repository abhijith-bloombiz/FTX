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
    let body: any = {};
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        body = await req.json();

        // Sanitize body to avoid CastErrors on empty _id
        const cleanBody = { ...body };
        if (!cleanBody._id || cleanBody._id === "") delete cleanBody._id;

        if (!cleanBody.serviceId) {
            cleanBody.serviceId = `service-${Date.now()}`;
        }
        if (!cleanBody.number) {
            cleanBody.number = "04";
        }
        if (!cleanBody.image) {
            cleanBody.image = "/images/services/ppf-main.png";
        }

        try {
            await connectToDatabase();
            const service = await ServiceItemModel.create(cleanBody);

            const plainService = service.toObject ? service.toObject() : service;
            const fallbackItem = { ...plainService, id: plainService.serviceId };
            const existingIdx = servicesData.findIndex((s: any) => s.id === fallbackItem.id || (s as any).serviceId === fallbackItem.id);
            if (existingIdx !== -1) {
                servicesData[existingIdx] = fallbackItem as any;
            } else {
                servicesData.push(fallbackItem as any);
            }

            return NextResponse.json({ success: true, service }, { status: 201 });
        } catch (dbErr: any) {
            const isConnErr = dbErr?.message?.includes("ECONNREFUSED") || dbErr?.name === "MongooseServerSelectionError" || dbErr?.name === "MongooseError" || dbErr?.message?.includes("connect") || dbErr?.message?.includes("timed out");
            if (isConnErr) {
                console.warn("DB connection offline during POST /api/admin/services, updating fallback memory:", dbErr.message);
                const fallbackItem = { ...cleanBody, id: cleanBody.serviceId, _id: cleanBody.serviceId };
                servicesData.push(fallbackItem as any);
                return NextResponse.json({ success: true, service: fallbackItem, fallback: true }, { status: 201 });
            }
            console.error("Mongoose Service Creation Error:", dbErr);
            return NextResponse.json({ error: dbErr.message || "Failed to save service item to database" }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Create Service Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create service" }, { status: 500 });
    }
}

import mongoose from "mongoose";

// PUT update service
export async function PUT(req: NextRequest) {
    let body: any = {};
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        body = await req.json();
        const { _id, serviceId, ...updateData } = body;
        const targetId = serviceId || _id || `service-${Date.now()}`;

        try {
            await connectToDatabase();
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
                    serviceId: targetId,
                });
            }

            if (updated) {
                const plainUpdated = updated.toObject ? updated.toObject() : updated;
                const fallbackItem = { ...plainUpdated, id: plainUpdated.serviceId };
                const idx = servicesData.findIndex((s) => s.id === targetId || (s as any).serviceId === targetId);
                if (idx !== -1) {
                    servicesData[idx] = fallbackItem as any;
                } else {
                    servicesData.push(fallbackItem as any);
                }
            }

            return NextResponse.json({ success: true, service: updated });
        } catch (dbErr: any) {
            const isConnErr = dbErr?.message?.includes("ECONNREFUSED") || dbErr?.name === "MongooseServerSelectionError" || dbErr?.name === "MongooseError" || dbErr?.message?.includes("connect") || dbErr?.message?.includes("timed out");
            if (isConnErr) {
                console.warn("DB connection offline during PUT /api/admin/services, applying fallback response.");
                const idx = servicesData.findIndex((s) => s.id === targetId || (s as any).serviceId === targetId);
                if (idx !== -1) {
                    servicesData[idx] = { ...servicesData[idx], ...updateData };
                }
                return NextResponse.json({ success: true, service: { ...body, serviceId: targetId }, fallback: true });
            }
            console.error("Mongoose Service Update Error:", dbErr);
            return NextResponse.json({ error: dbErr.message || "Failed to update service item in database" }, { status: 500 });
        }
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

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        try {
            await connectToDatabase();
            const filterConditions: any[] = [{ serviceId: id }];
            if (mongoose.Types.ObjectId.isValid(id)) {
                filterConditions.push({ _id: id });
            }

            await ServiceItemModel.deleteOne({ $or: filterConditions });
            return NextResponse.json({ success: true });
        } catch (dbErr: any) {
            console.warn("DB connection offline during DELETE /api/admin/services, applying fallback response.");
            return NextResponse.json({ success: true, fallback: true });
        }
    } catch (error: any) {
        console.error("Delete Service Error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete service" }, { status: 500 });
    }
}
