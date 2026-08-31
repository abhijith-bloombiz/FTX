import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";
import { signAdminToken, setAdminSessionCookie } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const envEmail = (process.env.ADMIN_EMAIL || "abhijith.bloombiz@gmail.com").toLowerCase().trim();
        const envPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminSecretPass2026!";

        let isAuthenticated = false;
        let adminName = "FTX Lead Admin";

        try {
            await connectToDatabase();
            await seedDatabase();

            const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
            if (admin) {
                const isMatch = await bcrypt.compare(password, admin.passwordHash);
                if (isMatch) {
                    isAuthenticated = true;
                    adminName = admin.name || adminName;
                }
            }
        } catch (dbErr) {
            console.warn("MongoDB unavailable during login, checking fallback env credentials:", dbErr);
        }

        if (!isAuthenticated) {
            if (email.toLowerCase().trim() === envEmail && password === envPassword) {
                isAuthenticated = true;
            }
        }

        if (!isAuthenticated) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signAdminToken({
            email: email.toLowerCase().trim(),
            id: "admin-session",
        });

        await setAdminSessionCookie(token);

        return NextResponse.json({
            success: true,
            user: {
                email: email.toLowerCase().trim(),
                name: adminName,
            },
        });
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
    }
}
