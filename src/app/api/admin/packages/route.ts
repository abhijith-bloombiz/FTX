import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { PackageItemModel } from "@/lib/models/PackageItem";
import { getAdminSession } from "@/lib/auth";
import { packagesData } from "@/data/packages";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDatabase();
        await seedDatabase();
        let packages = await PackageItemModel.find().sort({ category: 1 }).lean();
        if (!packages || packages.length === 0) {
            packages = packagesData.map((p) => ({ ...p, packageId: p.id })) as any;
        }
        return NextResponse.json(
            { packages, connected: true },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
                },
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                packages: packagesData.map((p) => ({ ...p, packageId: p.id })),
                connected: false,
                fallback: true,
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
                },
            }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();

        const pkg = await PackageItemModel.create(body);
        return NextResponse.json({ success: true, package: pkg }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to create package" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();
        const { _id, packageId, ...updateData } = body;

        const targetId = packageId || _id;
        const filterConditions: any[] = [];

        if (_id && mongoose.Types.ObjectId.isValid(_id)) {
            filterConditions.push({ _id });
        }
        if (targetId) {
            filterConditions.push({ packageId: targetId });
        }

        let updated = null;
        if (filterConditions.length > 0) {
            updated = await PackageItemModel.findOneAndUpdate(
                { $or: filterConditions },
                { ...updateData, packageId: targetId },
                { new: true, upsert: true }
            );
        } else {
            updated = await PackageItemModel.create({
                ...updateData,
                packageId: targetId || `pkg-${Date.now()}`,
            });
        }

        return NextResponse.json({ success: true, package: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update package" }, { status: 500 });
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

        const filterConditions: any[] = [{ packageId: id }];
        if (mongoose.Types.ObjectId.isValid(id)) {
            filterConditions.push({ _id: id });
        }

        await PackageItemModel.deleteOne({ $or: filterConditions });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete package" }, { status: 500 });
    }
}
