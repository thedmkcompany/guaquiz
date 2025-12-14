"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, ArrowLeft, Loader2 } from "lucide-react";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";

function FailedContent() {
  const params = useSearchParams();
  const error = params.get("error");
  const txnid = params.get("txnid");

  const errorMessage = error
    ? decodeURIComponent(error)
    : "Payment could not be processed. Please try again.";

  return (
    <>
      {/* Error Icon */}
      <div className="w-20 h-20 bg-wine/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-wine/20">
        <XCircle className="w-10 h-10 text-wine" />
      </div>

      <h1 className="text-2xl font-bold font-headline text-forest mb-2">
        Payment Failed
      </h1>

      <p className="text-forest/70 mb-6 font-body">{errorMessage}</p>

      {/* Transaction Details */}
      {txnid && (
        <div className="bg-white/40 rounded-xl p-4 mb-6 text-left border border-white/40">
          <div className="flex justify-between items-center">
            <span className="text-sm text-forest/60 font-subheader">Transaction ID</span>
            <span className="text-sm font-mono text-forest">{txnid}</span>
          </div>
        </div>
      )}

      {/* Common Issues */}
      <div className="text-left mb-8 bg-forest/5 rounded-xl p-5 border border-forest/5">
        <p className="text-sm font-semibold font-subheader text-forest mb-3">Common reasons:</p>
        <ul className="text-sm text-forest/70 space-y-2 font-body">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-wine/60" />
            Insufficient balance
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-wine/60" />
            Card declined by bank
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-wine/60" />
            Network connectivity issues
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-wine/60" />
            Transaction timeout
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 w-full px-6 py-4 text-base font-semibold text-white btn-luxe rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-subheader"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full px-6 py-4 text-base font-semibold text-forest hover:text-forest-light bg-transparent rounded-full hover:bg-forest/5 transition-colors font-subheader"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </Link>
      </div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-forest/40 animate-spin" />
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body flex items-center justify-center px-4 relative overflow-hidden">
      <DecorativeBlobs />

      <div className="max-w-md w-full text-center relative z-10">
        <div className="glass-card rounded-[2.5rem] shadow-float border border-white/60 flex flex-col p-8">
          <Suspense fallback={<LoadingFallback />}>
            <FailedContent />
          </Suspense>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-sm text-forest/60 font-body">
          Need help?{" "}
          <a
            href="mailto:support@thedmk.in"
            className="text-wine font-semibold hover:underline font-subheader"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
