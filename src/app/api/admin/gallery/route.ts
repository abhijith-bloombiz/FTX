import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { GalleryItemModel } from "@/lib/models/GalleryItem";
import { getAdminSession } from "@/lib/auth";
import { galleryData } from "@/data/gallery";
import { deleteUploadedFile } from "@/lib/deleteFile";
import { invalidateCmsCache } from "@/lib/cms";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

function sanitizeAssetUrl(url?: string | null, fallback: string = ""): string {
    if (!url || typeof url !== "string") return fallback;
    if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
        const cleanPath = url.replace(/^\/?/, "");
        const localFilePath = path.join(process.cwd(), "public", cleanPath);
        if (!fs.existsSync(localFilePath)) {
            return fallback;
        }
    }
    return url;
}

export async function GET() {
    try {
        await connectToDatabase();
        let gallery = await GalleryItemModel.find().sort({ createdAt: -1 }).lean();
        if (!gallery || gallery.length === 0) {
            await seedDatabase();
            gallery = await GalleryItemModel.find().sort({ createdAt: -1 }).lean();
            if (!gallery || gallery.length === 0) {
                gallery = galleryData.map((g) => ({ ...g, itemId: g.id })) as any;
            }
        }

        const sanitizedGallery = (gallery || []).map((item: any) => ({
            ...item,
            image: sanitizeAssetUrl(item.image, "/images/gallery/ppf-studio-hero.jpg"),
            video: sanitizeAssetUrl(item.video, ""),
            beforeImage: item.beforeImage ? sanitizeAssetUrl(item.beforeImage, "") : item.beforeImage,
            afterImage: item.afterImage ? sanitizeAssetUrl(item.afterImage, "") : item.afterImage,
        }));

        return NextResponse.json(
            { gallery: sanitizedGallery, connected: true },
            {
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate",
                },
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                gallery: galleryData.map((g) => ({ ...g, itemId: g.id })),
                connected: false,
                fallback: true,
            },
            {
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate",
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

        await connectToDatabase();
        body = await req.json();
        const { id, itemId, ...rest } = body;
        const finalItemId = itemId || id || `g-${Date.now()}`;

        const item = await GalleryItemModel.create({
            ...rest,
            itemId: finalItemId,
        });
        invalidateCmsCache("gallery");
        return NextResponse.json({ success: true, galleryItem: item }, { status: 201 });
    } catch (error: any) {
        const isConnErr = error?.message?.includes("ECONNREFUSED") || error?.name === "MongooseServerSelectionError" || error?.name === "MongooseError" || error?.message?.includes("connect") || error?.message?.includes("timed out");
        if (isConnErr) {
            return NextResponse.json({
                success: true,
                connected: false,
                fallback: true,
                galleryItem: body,
                message: "Applied in fallback mode (MongoDB offline)",
            }, { status: 200 });
        }
        return NextResponse.json({ error: error.message || "Failed to create gallery item" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    let body: any = {};
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        body = await req.json();
        const { _id, itemId, id, ...updateData } = body;

        const targetId = itemId || id || (_id && mongoose.Types.ObjectId.isValid(_id) ? _id : null) || `g-${Date.now()}`;
        const filterConditions: any[] = [];

        if (_id && mongoose.Types.ObjectId.isValid(_id)) {
            filterConditions.push({ _id });
        }
        if (targetId) {
            filterConditions.push({ itemId: targetId });
        }

        let updated = null;
        if (filterConditions.length > 0) {
            const existing: any = await GalleryItemModel.findOne({ $or: filterConditions }).lean();
            if (existing) {
                if (updateData.image && existing.image && updateData.image !== existing.image) {
                    await deleteUploadedFile(existing.image);
                }
                if (updateData.video && existing.video && updateData.video !== existing.video) {
                    await deleteUploadedFile(existing.video);
                }
                if (updateData.beforeImage && existing.beforeImage && updateData.beforeImage !== existing.beforeImage) {
                    await deleteUploadedFile(existing.beforeImage);
                }
                if (updateData.afterImage && existing.afterImage && updateData.afterImage !== existing.afterImage) {
                    await deleteUploadedFile(existing.afterImage);
                }
            }

            updated = await GalleryItemModel.findOneAndUpdate(
                { $or: filterConditions },
                { ...updateData, itemId: targetId },
                { returnDocument: "after", upsert: true }
            );
        } else {
            updated = await GalleryItemModel.create({
                ...updateData,
                itemId: targetId,
            });
        }

        invalidateCmsCache("gallery");
        return NextResponse.json({ success: true, galleryItem: updated });
    } catch (error: any) {
        const isConnErr = error?.message?.includes("ECONNREFUSED") || error?.name === "MongooseServerSelectionError" || error?.name === "MongooseError" || error?.message?.includes("connect") || error?.message?.includes("timed out");
        if (isConnErr) {
            return NextResponse.json({
                success: true,
                connected: false,
                fallback: true,
                galleryItem: body,
                message: "Updated in fallback mode (MongoDB offline)",
            }, { status: 200 });
        }
        return NextResponse.json({ error: error.message || "Failed to update gallery item" }, { status: 500 });
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

        const filterConditions: any[] = [{ itemId: id }];
        if (mongoose.Types.ObjectId.isValid(id)) {
            filterConditions.push({ _id: id });
        }

        const existing: any = await GalleryItemModel.findOne({ $or: filterConditions }).lean();
        if (existing) {
            await deleteUploadedFile(existing.image);
            await deleteUploadedFile(existing.video);
            await deleteUploadedFile(existing.beforeImage);
            await deleteUploadedFile(existing.afterImage);
        }

        await GalleryItemModel.deleteOne({ $or: filterConditions });
        invalidateCmsCache("gallery");
        return NextResponse.json({ success: true });
    } catch (error: any) {
        const isConnErr = error?.message?.includes("ECONNREFUSED") || error?.name === "MongooseServerSelectionError" || error?.name === "MongooseError" || error?.message?.includes("connect") || error?.message?.includes("timed out");
        if (isConnErr) {
            return NextResponse.json({
                success: true,
                connected: false,
                fallback: true,
                message: "Deleted in fallback mode (MongoDB offline)",
            }, { status: 200 });
        }
        return NextResponse.json({ error: error.message || "Failed to process gallery item" }, { status: 500 });
    }
}
