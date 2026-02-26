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
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-wine/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse delay-700" />
      <div className="glass-card rounded-full shadow-medium border border-white/60 px-8 py-4 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <div className="text-forest font-subheader font-medium">Loading...</div>
      </div>
    </div>
  );
}
