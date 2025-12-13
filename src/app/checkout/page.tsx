import { Suspense } from "react";
import { CheckoutPageClient } from "./checkout-client";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading checkout...</div>
    </div>
  );
}
