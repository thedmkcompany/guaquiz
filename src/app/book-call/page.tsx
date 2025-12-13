import { Suspense } from "react";
import { BookCallClient } from "./book-call-client";

export const metadata = {
  title: "Book Your Free Discovery Call | DMK",
  description: "Schedule a free 20-minute call to see if the Transform program is right for you.",
};

export default function BookCallPage() {
  return (
    <Suspense fallback={<BookCallLoading />}>
      <BookCallClient />
    </Suspense>
  );
}

function BookCallLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  );
}
