import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Payment Successful",
  description: "Your payment has been processed successfully.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You will receive a confirmation email
            shortly with details on how to access your program.
          </p>

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Check your email for next steps and login instructions.
            </p>

            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Questions? Contact us at{" "}
          <a
            href="mailto:support@example.com"
            className="text-black font-medium hover:underline"
          >
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
