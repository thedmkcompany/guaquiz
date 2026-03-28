import { NextResponse } from "next/server";
import { PROGRAM_MANAGER_COOKIE } from "@/lib/program-manager-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: PROGRAM_MANAGER_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
