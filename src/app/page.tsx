import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Find Your Perfect
              <span className="block text-gray-600">Program</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Not sure which program is right for you? Take our smart quiz and
              we&apos;ll recommend the perfect fit based on your goals, experience,
              and preferences.
            </p>
            <div className="mt-10">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
              >
                Take the Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Takes only 2 minutes to complete
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Take the Quiz
              </h3>
              <p className="text-gray-600">
                Answer a few questions about your goals, experience level, and
                preferences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get Your Match
              </h3>
              <p className="text-gray-600">
                Our smart algorithm analyzes your answers and recommends the
                best program for you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Learning
              </h3>
              <p className="text-gray-600">
                Enroll in your recommended program and begin your journey to
                success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Our Programs
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We offer 4 specialized programs designed to meet different needs and
            skill levels.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((num) => (
              <Link
                key={num}
                href={`/programs/program-${num}`}
                className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Program {num}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Perfect for those looking for a specific solution.
                </p>
                <span className="text-black font-medium inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Not sure which one is right for you?
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
            >
              Take the Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
