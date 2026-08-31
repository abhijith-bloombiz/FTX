import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        try {
            await connectToDatabase();
            const admin = await AdminUser.findOne({ email: session.email }).select("-passwordHash");
            if (admin) {
                return NextResponse.json({
                    authenticated: true,
                    user: {
                        email: admin.email,
                        name: admin.name,
                    },
                });
            }
        } catch (dbErr) {
            console.warn("MongoDB unavailable during /api/auth/me, using session payload fallback:", dbErr);
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                email: session.email,
                name: "FTX Lead Admin",
            },
        });
    } catch (error) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
