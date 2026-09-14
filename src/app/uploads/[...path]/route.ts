import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
};

export async function GET(
    _req: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        if (!params.path || params.path.length === 0) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const filePathParam = params.path.join("/");
        // Prevent path traversal
        const safePath = path.normalize(filePathParam).replace(/^(\.\.[\/\\])+/, "");
        const fullPath = path.join(process.cwd(), "public", "uploads", safePath);

        const fileStat = await stat(fullPath);
        if (!fileStat.isFile()) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const ext = path.extname(fullPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        const buffer = await readFile(fullPath);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": fileStat.size.toString(),
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new NextResponse("Not Found", { status: 404 });
    }
}
