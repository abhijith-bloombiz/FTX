import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ServiceItemModel } from "@/lib/models/ServiceItem";
import { getAdminSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { services } = body; // Array of { _id, serviceId, number } or full items

        if (!Array.isArray(services)) {
            return NextResponse.json({ error: "Invalid payload format. Expected array of services." }, { status: 400 });
        }

        try {
            await connectToDatabase();

            const updatePromises = services.map(async (item: any, index: number) => {
                const targetNumber = String(index + 1).padStart(2, "0");
                const targetId = item.serviceId || item.id || item._id;

                const filterConditions: any[] = [];
                if (item._id && mongoose.Types.ObjectId.isValid(item._id)) {
                    filterConditions.push({ _id: item._id });
                }
                if (targetId) {
                    filterConditions.push({ serviceId: targetId });
                }

                if (filterConditions.length > 0) {
                    return ServiceItemModel.findOneAndUpdate(
                        { $or: filterConditions },
                        { $set: { number: targetNumber } },
                        { new: true }
                    );
                }
            });

            await Promise.all(updatePromises);

            const updatedList = await ServiceItemModel.find().sort({ number: 1 }).lean();
            return NextResponse.json({ success: true, services: updatedList });
        } catch (dbErr: any) {
            console.warn("Database offline during service reorder, returning fallback updated response.", dbErr);
            const fallbackServices = services.map((s: any, idx: number) => ({
                ...s,
                number: String(idx + 1).padStart(2, "0"),
            }));
            return NextResponse.json({ success: true, services: fallbackServices, fallback: true });
        }
    } catch (error: any) {
        console.error("Service Reorder Error:", error);
        return NextResponse.json({ error: error.message || "Failed to reorder services" }, { status: 500 });
    }
}
