import { NextRequest, NextResponse } from "next/server";
import {
  PROGRAM_MANAGER_COOKIE,
  isValidProgramManagerSession,
} from "@/lib/program-manager-auth";
import { updateTestimonial } from "@/lib/testimonials-store";

function isAuthorized(request: NextRequest): boolean {
  const session = request.cookies.get(PROGRAM_MANAGER_COOKIE)?.value;
  return isValidProgramManagerSession(session);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const body = (await request.json()) as {
      name?: string;
      program?: string;
      text?: string;
      profileImageUrl?: string;
      videoUrl?: string;
      pinned?: boolean;
    };
    const updated = await updateTestimonial(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ testimonial: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

