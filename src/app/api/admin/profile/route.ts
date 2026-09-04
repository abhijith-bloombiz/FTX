import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";
import { getAdminSession, signAdminToken, setAdminSessionCookie } from "@/lib/auth";

export async function PUT(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { newEmail, newPassword } = body;

        if ((!newEmail || !newEmail.trim()) && (!newPassword || !newPassword.trim())) {
            return NextResponse.json({ error: "Please provide a new email or new password to update." }, { status: 400 });
        }

        await connectToDatabase();

        const currentEmail = session.email.toLowerCase().trim();
        // Lookup admin by email (case-insensitive) or fallback to primary admin user document
        let admin = await AdminUser.findOne({ email: { $regex: new RegExp(`^${currentEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } });
        if (!admin) {
            admin = await AdminUser.findOne({});
        }

        // Determine final updated email and password hash
        const targetEmail = newEmail && newEmail.trim() ? newEmail.toLowerCase().trim() : currentEmail;

        // If email is changing, check if another admin already uses that email
        if (targetEmail !== currentEmail) {
            const existingOther = await AdminUser.findOne({ email: targetEmail });
            if (existingOther && (!admin || existingOther._id.toString() !== admin._id.toString())) {
                return NextResponse.json({ error: "Email address is already in use by another admin" }, { status: 400 });
            }
        }

        let newHash = admin ? admin.passwordHash : await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD || "AdminSecretPass2026!", 10);
        if (newPassword && newPassword.trim().length > 0) {
            if (newPassword.trim().length < 6) {
                return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 });
            }
            newHash = await bcrypt.hash(newPassword.trim(), 10);
        }

        if (admin) {
            admin.email = targetEmail;
            admin.passwordHash = newHash;
            await admin.save();
        } else {
            admin = await AdminUser.create({
                email: targetEmail,
                passwordHash: newHash,
                name: "FTX Lead Admin",
            });
        }

        // Re-issue JWT session token with updated email
        const token = await signAdminToken({
            email: targetEmail,
            id: "admin-session",
        });
        await setAdminSessionCookie(token);

        return NextResponse.json({
            success: true,
            message: "Account credentials updated successfully!",
            user: {
                email: targetEmail,
                name: admin.name || "FTX Lead Admin",
            },
        });
    } catch (error: any) {
        console.error("Error updating admin profile:", error);
        return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
    }
}
