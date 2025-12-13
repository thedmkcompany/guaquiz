import { Suspense } from "react";
import { CheckoutPageClient } from "./checkout-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | DMK",
  description: "Complete your purchase and start your transformation journey.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutPageClient />
    </Suspense>
  );
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="animate-pulse text-charcoal/50">Loading checkout...</div>
    </div>
  );
}
