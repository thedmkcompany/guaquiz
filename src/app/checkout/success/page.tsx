import Link from "next/link";
import { CheckCircle, Mail, ArrowRight, Crown, Sparkles } from "lucide-react";
import { getProgramBySlug } from "@/lib/programs";

export const metadata = {
  title: "Welcome, Queen! | Payment Successful",
  description: "Your payment has been processed successfully. Welcome to your transformation journey!",
};

interface SearchParams {
  paymentId?: string;
  orderId?: string;
  subscriptionId?: string;
  program?: string;
  gateway?: string;
  txnid?: string;
  amount?: string;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const program = params.program ? getProgramBySlug(params.program) : null;
  const isSubscription = !!params.subscriptionId;
  const isTrial = program?.tier === "trial";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Crown Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, Queen!
          </h1>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-purple-600 font-medium">
              Your transformation begins now
            </span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>

          <p className="text-gray-600 mb-6">
            {isTrial
              ? "Your trial access is now active! Get ready to experience the magic."
              : isSubscription
              ? "Your subscription has been activated. You'll be charged automatically on renewal dates."
              : "Thank you for joining us. Check your email for everything you need to get started."}
          </p>

          {/* Order Details */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6 text-left">
            {program && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Program</span>
                <span className="text-sm font-medium text-gray-900">{program.name}</span>
              </div>
            )}
            {params.paymentId && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Payment ID</span>
                <span className="text-sm font-mono text-gray-700 text-xs">{params.paymentId}</span>
              </div>
            )}
            {params.subscriptionId && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Subscription ID</span>
                <span className="text-sm font-mono text-gray-700 text-xs">{params.subscriptionId}</span>
              </div>
            )}
            {params.txnid && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Transaction ID</span>
                <span className="text-sm font-mono text-gray-700 text-xs">{params.txnid}</span>
              </div>
            )}
            {params.amount && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Amount Paid</span>
                <span className="text-sm font-medium text-gray-900">
                  ₹{parseFloat(params.amount).toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Email Notice */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6 bg-gray-50 rounded-lg p-3">
            <Mail className="w-4 h-4 text-purple-500" />
            <span>Check your email for access instructions</span>
          </div>

          {/* What's Next */}
          <div className="text-left mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-600 font-medium text-xs">1</span>
                <span>Check your inbox for the welcome email (check spam too!)</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-600 font-medium text-xs">2</span>
                <span>Set up your password to access the member area</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-600 font-medium text-xs">3</span>
                <span>Start your transformation journey!</span>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
            >
              Return to Home
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isTrial && program?.upsellTo && (
              <Link
                href={`/results/${program.upsellTo}`}
                className="block w-full px-6 py-3 text-base font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                Ready for more? Upgrade to Circle
              </Link>
            )}
          </div>
        </div>

        {/* Support Links */}
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-500">
            Questions? We&apos;re here to help!
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="text-sm text-purple-600 font-medium hover:underline"
            >
              Chat with us
            </Link>
            <span className="text-gray-300">|</span>
            <a
              href="mailto:support@example.com"
              className="text-sm text-purple-600 font-medium hover:underline"
            >
              Email support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
