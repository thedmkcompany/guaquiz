"use client";

import { useSearchParams } from "next/navigation";
import { getProgramBySlug } from "@/lib/programs";
import { EssentialsThankYou } from "@/components/checkout/EssentialsThankYou";
import { WebinarThankYou } from "@/components/checkout/WebinarThankYou";
import { CircleThankYou } from "@/components/checkout/CircleThankYou";
import { TransformThankYou } from "@/components/checkout/TransformThankYou";

export function SuccessPageClient() {
  const searchParams = useSearchParams();
  const programSlug = searchParams.get("program") || "";
  const customerEmail = searchParams.get("email") || "your email";
  const startDateParam = searchParams.get("start_date");

  const program = programSlug ? getProgramBySlug(programSlug) : null;

  // Parse start date if provided (works for both Circle and Essentials)
  const startDate = startDateParam ? new Date(startDateParam) : null;

  // Route to program-specific thank you pages
  switch (programSlug) {
    case "essentials":
      return <EssentialsThankYou customerEmail={customerEmail} startDate={startDate} />;

    case "webinar":
      return <WebinarThankYou customerEmail={customerEmail} sessionDate={startDate} />;

    case "circle":
      return <CircleThankYou customerEmail={customerEmail} startDate={startDate} />;

    case "transform-strategy-call":
    case "transform":
      return (
        <TransformThankYou
          customerEmail={customerEmail}
          schedulerUrl={program?.schedulerUrl}
        />
      );

    default:
      // Fallback for unknown programs
      return (
        <div className="min-h-screen bg-gradient-pastel flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-forest mb-4">Thank you for your purchase!</h1>
            <p className="text-forest/70 mb-4">Check your email at {customerEmail} for details.</p>
          </div>
        </div>
      );
  }
}
