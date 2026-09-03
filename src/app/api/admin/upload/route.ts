import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const allowedExtensions = /\.(jpg|jpeg|png|webp|svg|gif|avif|mp4|webm|mov|mkv|avi)$/i;
        if (!allowedExtensions.test(file.name)) {
            return NextResponse.json(
                { error: "Invalid file format. Only images and videos are allowed." },
                { status: 400 }
            );
        }

        const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|mkv|avi)$/i.test(file.name);
        const maxVideoSize = 50 * 1024 * 1024; // 50 MB limit for single video
        const maxImageSize = 10 * 1024 * 1024; // 10 MB limit for single image

        if (isVideo && file.size > maxVideoSize) {
            return NextResponse.json(
                { error: `Video file size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit.` },
                { status: 400 }
            );
        }

        if (!isVideo && file.size > maxImageSize) {
            return NextResponse.json(
                { error: `Image file size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit.` },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/${filename}`;
        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
