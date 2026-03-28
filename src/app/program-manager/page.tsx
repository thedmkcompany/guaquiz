import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  PROGRAM_MANAGER_COOKIE,
  isValidProgramManagerSession,
} from "@/lib/program-manager-auth";

export default async function ProgramManagerPortalPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(PROGRAM_MANAGER_COOKIE)?.value;

  if (!isValidProgramManagerSession(session)) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#f7f3e8] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-[#cdbf9a] bg-[#fff8ea] p-6 sm:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <p className="text-xs uppercase tracking-[0.14em] text-[#7e0f1d] font-semibold">
            Program Manager Portal
          </p>
          <h1 className="mt-2 text-3xl font-headline text-[#123b34]">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[#0f3c36]/75">
            This route is intentionally hidden from navigation. Access is only via
            <code className="mx-1">/login</code>.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Link
              href="/program-manager/testimonials"
              className="rounded-xl border border-[#cdbf9a] bg-white px-4 py-3 text-[#123b34] hover:bg-[#f7f3e8] transition-colors"
            >
              Open Testimonials
            </Link>
            <Link
              href="/admin/sync-status"
              className="rounded-xl border border-[#cdbf9a] bg-white px-4 py-3 text-[#123b34] hover:bg-[#f7f3e8] transition-colors"
            >
              Open Sync Status Dashboard
            </Link>
            <form action="/api/program-manager/logout" method="post">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#7e0f1d] text-[#f7f3e8] px-4 py-3 font-semibold hover:bg-[#6b0c18] transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
