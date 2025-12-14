import { Suspense } from "react";
import { SuccessPageClient } from "./success-client";

export const metadata = {
  title: "Welcome to DMK, Queen! | Payment Successful",
  description: "Your transformation starts now. Welcome to the DMK community!",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessPageClient />
    </Suspense>
  );
}

function SuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-wine/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse delay-700" />

      <div className="glass-card rounded-full shadow-medium border border-white/60 px-8 py-4 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <div className="text-forest font-subheader font-medium">Finalizing your order...</div>
      </div>
    </div>
  );
}
