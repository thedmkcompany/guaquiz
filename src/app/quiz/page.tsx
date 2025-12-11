import { Quiz } from "@/components/quiz/quiz";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Find Your Perfect Program | Quiz",
  description: "Take our smart quiz to find the program that's right for you.",
};

export default function QuizPage() {
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

      {/* Quiz Container */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Find Your Perfect Program
            </h1>
            <p className="text-gray-600">
              Answer a few questions and we&apos;ll recommend the best program for
              you.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
            <Quiz />
          </div>
        </div>
      </main>
    </div>
  );
}
