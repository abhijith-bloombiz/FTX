import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { PackageItemModel } from "@/lib/models/PackageItem";
import { getAdminSession } from "@/lib/auth";
import { packagesData } from "@/data/packages";
import { deleteUploadedFile } from "@/lib/deleteFile";
import { invalidateCmsCache } from "@/lib/cms";
import mongoose from "mongoose";

function triggerPackagesRevalidation() {
    try {
        revalidatePath("/[locale]/packages", "page");
        revalidatePath("/en/packages");
        revalidatePath("/ar/packages");
        revalidatePath("/[locale]/services", "page");
        revalidatePath("/en/services");
        revalidatePath("/ar/services");
    } catch (e) {
        console.warn("revalidatePath error:", e);
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        let packages = await PackageItemModel.find().sort({ category: 1 }).lean();
        if (!packages || packages.length === 0) {
            await seedDatabase();
            packages = await PackageItemModel.find().sort({ category: 1 }).lean();
            if (!packages || packages.length === 0) {
                packages = packagesData.map((p) => ({ ...p, packageId: p.id })) as any;
            }
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
    let body: any = {};
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        body = await req.json();

        const cleanBody = { ...body };
        if (!cleanBody._id || cleanBody._id === "") delete cleanBody._id;
        if (!cleanBody.packageId) cleanBody.packageId = `pkg-${Date.now()}`;

        try {
            await connectToDatabase();
            const pkg = await PackageItemModel.create(cleanBody);
            invalidateCmsCache("packages");
            triggerPackagesRevalidation();
            return NextResponse.json({ success: true, package: pkg }, { status: 201 });
        } catch (dbErr: any) {
            console.warn("DB connection error/offline during POST /api/admin/packages, updating fallback memory:", dbErr.message);
            const fallbackItem = { ...cleanBody, id: cleanBody.packageId, _id: cleanBody.packageId };
            packagesData.push(fallbackItem as any);
            return NextResponse.json({ success: true, package: fallbackItem, fallback: true }, { status: 201 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to create package" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    let body: any = {};
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        body = await req.json();
        const { _id, packageId, ...updateData } = body;
        const targetId = packageId || _id || `pkg-${Date.now()}`;

        try {
            await connectToDatabase();
            const filterConditions: any[] = [];

            if (_id && mongoose.Types.ObjectId.isValid(_id)) {
                filterConditions.push({ _id });
            }
            if (targetId) {
                filterConditions.push({ packageId: targetId });
            }

            let updated = null;
            if (filterConditions.length > 0) {
                const existing: any = await PackageItemModel.findOne({ $or: filterConditions }).lean();
                if (existing) {
                    if (updateData.image && existing.image && updateData.image !== existing.image) {
                        await deleteUploadedFile(existing.image);
                    }
                }

                updated = await PackageItemModel.findOneAndUpdate(
                    { $or: filterConditions },
                    { ...updateData, packageId: targetId },
                    { returnDocument: "after", upsert: true }
                );
            } else {
                updated = await PackageItemModel.create({
                    ...updateData,
                    packageId: targetId,
                });
            }

            invalidateCmsCache("packages");
            triggerPackagesRevalidation();
            return NextResponse.json({ success: true, package: updated });
        } catch (dbErr: any) {
            console.warn("DB connection offline during PUT /api/admin/packages, applying fallback response.");
            return NextResponse.json({ success: true, package: { ...body, packageId: targetId }, fallback: true });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update package" }, { status: 500 });
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
            const filterConditions: any[] = [{ packageId: id }];
            if (mongoose.Types.ObjectId.isValid(id)) {
                filterConditions.push({ _id: id });
            }

            const existing: any = await PackageItemModel.findOne({ $or: filterConditions }).lean();
            if (existing) {
                await deleteUploadedFile(existing.image);
            }

            await PackageItemModel.deleteOne({ $or: filterConditions });
            invalidateCmsCache("packages");
            triggerPackagesRevalidation();
            return NextResponse.json({ success: true });
        } catch (dbErr: any) {
            console.warn("DB connection offline during DELETE /api/admin/packages, applying fallback response.");
            return NextResponse.json({ success: true, fallback: true });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete package" }, { status: 500 });
    }
}
