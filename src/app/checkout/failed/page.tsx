import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Payment Failed",
  description: "Your payment could not be processed.",
};

interface SearchParams {
  error?: string;
  txnid?: string;
  gateway?: string;
}

export default async function CheckoutFailedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const errorMessage = params.error
    ? decodeURIComponent(params.error)
    : "Payment could not be processed. Please try again.";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>

          <p className="text-gray-600 mb-6">{errorMessage}</p>

          {/* Transaction Details */}
          {params.txnid && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Transaction ID</span>
                <span className="text-sm font-mono text-gray-700">{params.txnid}</span>
              </div>
            </div>
          )}

          {/* Common Issues */}
          <div className="text-left mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Common reasons:</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Insufficient balance in your account</li>
              <li>• Card declined by your bank</li>
              <li>• Network connectivity issues</li>
              <li>• Transaction timeout</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-6 text-sm text-gray-500">
          Need help?{" "}
          <a
            href="mailto:support@glowupacademy.com"
            className="text-primary font-medium hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
