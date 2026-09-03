import fs from "fs";
import path from "path";

/**
 * Safely deletes an uploaded file from disk if it resides inside public/uploads/.
 * Ignores system images (/images/...), external URLs (http/https), and missing files.
 */
export async function deleteUploadedFile(fileUrl?: string | null) {
    if (!fileUrl || typeof fileUrl !== "string") return;

    // Normalize URL string
    const trimmed = fileUrl.trim();

    // Check if the URL points to the local /uploads directory
    if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
        const relativePath = trimmed.replace(/^\/?uploads\//, "");
        // Prevent path traversal attacks
        const safeFileName = path.basename(relativePath);
        const absolutePath = path.join(process.cwd(), "public", "uploads", safeFileName);

        try {
            if (fs.existsSync(absolutePath)) {
                await fs.promises.unlink(absolutePath);
                console.log(`[File Cleanup] Successfully deleted old upload: ${safeFileName}`);
            }
        } catch (err) {
            console.error(`[File Cleanup Error] Failed to delete file ${safeFileName}:`, err);
        }
    }
}
