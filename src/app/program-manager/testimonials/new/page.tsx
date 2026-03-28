import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  PROGRAM_MANAGER_COOKIE,
  isValidProgramManagerSession,
} from "@/lib/program-manager-auth";
import TestimonialForm from "@/components/program-manager/TestimonialForm";

export default async function ProgramManagerAddTestimonialPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(PROGRAM_MANAGER_COOKIE)?.value;
  if (!isValidProgramManagerSession(session)) redirect("/login");

  return (
    <main className="min-h-screen bg-[#f7f3e8] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-[#cdbf9a] bg-[#fff8ea] p-6 sm:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <p className="text-xs uppercase tracking-[0.14em] text-[#7e0f1d] font-semibold">
            Program Manager Portal
          </p>
          <h1 className="mt-2 text-3xl font-headline text-[#123b34]">Testimonials</h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/program-manager/testimonials" className="rounded-xl border border-[#cdbf9a] bg-white px-4 py-2.5 text-sm text-[#123b34] hover:bg-[#f7f3e8]">
              Testimonials
            </Link>
            <span className="rounded-xl bg-[#7e0f1d] text-[#f7f3e8] px-4 py-2.5 text-sm font-semibold">Add New</span>
          </div>
        </div>
        <div className="mt-6">
          <TestimonialForm />
        </div>
      </div>
    </main>
  );
}

