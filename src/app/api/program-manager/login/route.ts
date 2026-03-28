import { NextRequest, NextResponse } from "next/server";
import {
  PROGRAM_MANAGER_COOKIE,
  areProgramManagerCredentialsConfigured,
  createProgramManagerSessionValue,
  verifyProgramManagerCredentials,
} from "@/lib/program-manager-auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { user?: string; pass?: string };
    const user = (body.user || "").trim();
    const pass = body.pass || "";

    if (!areProgramManagerCredentialsConfigured()) {
      return NextResponse.json(
        { error: "Program manager credentials are not configured on the server." },
        { status: 503 }
      );
    }

    if (!verifyProgramManagerCredentials(user, pass)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const session = createProgramManagerSessionValue(user);
    if (!session) {
      return NextResponse.json(
        { error: "Session secret not configured." },
        { status: 503 }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: PROGRAM_MANAGER_COOKIE,
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
