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
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-wine/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse delay-700" />

      <div className="glass-card rounded-full shadow-medium border border-white/60 px-8 py-4 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <div className="text-forest font-subheader font-medium">Loading checkout...</div>
      </div>
    </div>
  );
}
