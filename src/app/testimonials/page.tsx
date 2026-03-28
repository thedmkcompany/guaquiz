import Link from "next/link";
import type { Metadata } from "next";
import { listTestimonials } from "@/lib/testimonials-store";
import { siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: `Community Testimonials | ${siteConfig.name}`,
  description:
    "Stories from women in the Glow Up Academy community — shared by our program team.",
};

export default async function AllTestimonialsPage() {
  const testimonials = await listTestimonials();

  return (
    <main className="min-h-screen bg-[#f7f3e8] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-[#7e0f1d] hover:underline"
          >
            ← Back to home
          </Link>
          <h1 className="mt-4 font-headline text-3xl sm:text-4xl font-bold text-[#0f3c36]">
            Community testimonials
          </h1>
          <p className="mt-2 text-[#0f3c36]/75 text-base max-w-2xl">
            More stories from women we work with — added by our program team as they come in.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="rounded-2xl border border-[#cdbf9a] bg-[#fff8ea] px-6 py-10 text-center">
            <p className="text-[#0f3c36]/80">
              No additional testimonials here yet. Check back soon, or scroll the homepage for featured
              transformations.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-semibold text-[#7e0f1d] hover:underline"
            >
              Return to home
            </Link>
          </div>
        ) : (
          <ul className="space-y-8">
            {testimonials.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-[#0f3c36]/12 bg-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    {t.profileImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.profileImageUrl}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-full object-cover border border-[#cdbf9a]"
                      />
                    ) : (
                      <div className="h-14 w-14 shrink-0 rounded-full bg-[#c2a85a]/40 text-[#0f3c36] font-semibold text-sm flex items-center justify-center border border-[#cdbf9a]">
                        {(t.name || "?").slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[#0f3c36]">{t.name}</p>
                      <p className="text-sm text-[#0f3c36]/60">{t.program}</p>
                    </div>
                  </div>
                  {t.text ? (
                    <p className="mt-4 text-[15px] leading-relaxed text-[#0f3c36]/85 italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  ) : null}
                  {t.videoUrl ? (
                    <video
                      src={t.videoUrl}
                      controls
                      className="mt-4 w-full max-h-[min(70vh,420px)] rounded-xl border border-[#e6dcc2] bg-black/5"
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
