import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";
import AdminUsersManager from "@/components/admin/AdminUsersManager";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isValidAdminSession(session)) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f7f3e8] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-[#cdbf9a] bg-[#fff8ea] p-6 sm:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <p className="text-xs uppercase tracking-[0.14em] text-[#7e0f1d] font-semibold">
            Admin Portal
          </p>
          <h1 className="mt-2 text-3xl font-headline text-[#123b34]">
            User Management
          </h1>
          <p className="mt-2 text-sm text-[#0f3c36]/75">
            Add and manage additional portal users (coaches, program managers, assistants).
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/sync-status"
              className="rounded-xl border border-[#cdbf9a] bg-white px-4 py-2.5 text-[#123b34] hover:bg-[#f7f3e8] transition-colors text-sm"
            >
              Open Sync Status Dashboard
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-xl bg-[#7e0f1d] text-[#f7f3e8] px-4 py-2.5 font-semibold hover:bg-[#6b0c18] transition-colors text-sm"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6">
          <AdminUsersManager />
        </div>
      </div>
    </main>
  );
}

