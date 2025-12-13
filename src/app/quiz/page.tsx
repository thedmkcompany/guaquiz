import { Quiz } from "@/components/quiz/quiz";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Find Your Perfect Program | Quiz",
  description: "Take our smart quiz to find the program that's right for you.",
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-pastel font-body">
      {/* Header - Glass effect */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-overlay border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center text-forest hover:text-forest-light transition-colors font-subheader font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <div className="text-forest font-headline font-bold text-lg">Glow Up Academy</div>
          <div className="w-16"></div> {/* Spacer for centering if needed, or empty */}
        </div>
      </header>

      {/* Quiz Container - Centered content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
        <div className="max-w-xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-forest mb-3">
              Your Skin Journey
            </h1>
            <p className="text-charcoal/70 font-body text-base sm:text-lg">
              Let's customize your perfect routine.
            </p>
          </div>

          <div className="w-full">
            <Quiz />
          </div>
        </div>
      </main>
    </div>
  );
}
