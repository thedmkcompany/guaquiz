import { NextRequest, NextResponse } from "next/server";
import {
  PROGRAM_MANAGER_COOKIE,
  isValidProgramManagerSession,
} from "@/lib/program-manager-auth";
import { addTestimonial, listTestimonials } from "@/lib/testimonials-store";

function isAuthorized(request: NextRequest): boolean {
  const session = request.cookies.get(PROGRAM_MANAGER_COOKIE)?.value;
  return isValidProgramManagerSession(session);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await listTestimonials();
  return NextResponse.json({ testimonials: items });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as {
      name?: string;
      program?: string;
      text?: string;
      profileImageUrl?: string;
      videoUrl?: string;
      pinned?: boolean;
    };
    const created = await addTestimonial(body);
    return NextResponse.json({ testimonial: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

