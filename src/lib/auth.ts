import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "ftx-super-secret-jwt-key-2026-production-token-string"
);

export interface AdminJwtPayload {
    email: string;
    id: string;
}

export async function signAdminToken(payload: AdminJwtPayload): Promise<string> {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminJwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as AdminJwtPayload;
    } catch (error) {
        return null;
    }
}

export async function getAdminSession(): Promise<AdminJwtPayload | null> {
    const token = cookies().get("ftx_admin_token")?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
}

export async function setAdminSessionCookie(token: string) {
    cookies().set("ftx_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function clearAdminSessionCookie() {
    cookies().set("ftx_admin_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}
