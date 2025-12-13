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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  );
}
