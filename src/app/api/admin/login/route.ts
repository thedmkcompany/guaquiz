import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  areAdminCredentialsConfigured,
  createAdminSessionValue,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { user?: string; pass?: string };
    const user = (body.user || "").trim();
    const pass = body.pass || "";

    if (!areAdminCredentialsConfigured()) {
      return NextResponse.json(
        { error: "Admin credentials are not configured on the server." },
        { status: 503 }
      );
    }

    if (!verifyAdminCredentials(user, pass)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const session = createAdminSessionValue(user);
    if (!session) {
      return NextResponse.json({ error: "Session secret not configured." }, { status: 503 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: session,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}

