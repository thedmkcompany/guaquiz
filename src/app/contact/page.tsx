import Link from "next/link";
import { ArrowLeft, MessageCircle, Mail, Phone, Clock } from "lucide-react";
import { WhatsAppButton } from "@/components/support";

export const metadata = {
  title: "Contact Us | DMK",
  description: "Have questions? We're here to help. Reach out via WhatsApp, email, or book a call.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              We&apos;re Here to Help
            </h1>
            <p className="text-gray-600">
              Have questions about our programs? Want to know which one is right
              for you? Reach out - we typically respond within a few hours.
            </p>
          </div>

          {/* Contact Options */}
          <div className="space-y-4">
            {/* WhatsApp - Primary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 mb-1">
                    WhatsApp (Fastest)
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Chat with us directly. We usually reply within minutes
                    during business hours.
                  </p>
                  <WhatsAppButton
                    message="Hi! I have a question about the programs."
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 mb-1">Email</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    For detailed inquiries or if you prefer email
                    communication.
                  </p>
                  <a
                    href="mailto:support@example.com"
                    className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700"
                  >
                    support@example.com
                  </a>
                </div>
              </div>
            </div>

            {/* Book a Call */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 mb-1">
                    Book a Call
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Prefer to talk? Schedule a free 20-minute discovery call
                    with us.
                  </p>
                  <Link
                    href="/book-call"
                    className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                  >
                    Schedule a Call
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="mt-8 bg-gray-100 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Average Response Time</span>
            </div>
            <p className="text-gray-500 text-sm">
              WhatsApp: Within minutes | Email: Within 24 hours
            </p>
          </div>

          {/* FAQ Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Looking for quick answers?</p>
            <Link
              href="/#faq"
              className="text-purple-600 font-medium hover:underline"
            >
              Check our FAQ section
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
