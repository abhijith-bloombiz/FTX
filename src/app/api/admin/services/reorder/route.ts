import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ServiceItemModel } from "@/lib/models/ServiceItem";
import { getAdminSession } from "@/lib/auth";
import { servicesData } from "@/data/services";
import { invalidateCmsCache } from "@/lib/cms";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { services } = body;

        if (!Array.isArray(services)) {
            return NextResponse.json({ error: "Services array is required" }, { status: 400 });
        }

        // Re-assign number based on array index (e.g. 01, 02, 03, ...)
        const reordered = services.map((item: any, idx: number) => {
            const numStr = String(idx + 1).padStart(2, "0");
            return {
                ...item,
                number: numStr,
            };
        });

        // 1. Update in-memory fallback array
        reordered.forEach((item: any) => {
            const sId = item.serviceId || item.id || item._id;
            const fallbackIdx = servicesData.findIndex(
                (s: any) => s.id === sId || s.serviceId === sId || (s._id && String(s._id) === String(sId))
            );
            if (fallbackIdx !== -1) {
                servicesData[fallbackIdx] = {
                    ...servicesData[fallbackIdx],
                    number: item.number,
                };
            }
        });

        // Sort in-memory fallback by number
        servicesData.sort((a: any, b: any) => parseInt(a.number || "99", 10) - parseInt(b.number || "99", 10));

        // 2. Update Database if connected
        try {
            await connectToDatabase();
            const bulkOps = reordered.map((item: any) => {
                const targetId = item.serviceId || item.id || item._id;
                const filterConditions: any[] = [];
                if (item._id && mongoose.Types.ObjectId.isValid(item._id)) {
                    filterConditions.push({ _id: item._id });
                }
                if (targetId) {
                    filterConditions.push({ serviceId: targetId });
                }

                return {
                    updateOne: {
                        filter: filterConditions.length > 0 ? { $or: filterConditions } : { serviceId: targetId },
                        update: { $set: { number: item.number } },
                    },
                };
            });

            if (bulkOps.length > 0) {
                await ServiceItemModel.bulkWrite(bulkOps);
            }

            invalidateCmsCache("services");
            return NextResponse.json({ success: true, services: reordered });
        } catch (dbErr: any) {
            console.warn("DB offline during POST /api/admin/services/reorder, fallback applied:", dbErr.message);
            return NextResponse.json({ success: true, services: reordered, fallback: true });
        }
    } catch (error: any) {
        console.error("Reorder Services Error:", error);
        return NextResponse.json({ error: error.message || "Failed to reorder services" }, { status: 500 });
    }
}
