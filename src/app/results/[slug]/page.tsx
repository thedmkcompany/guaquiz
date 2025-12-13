import { notFound } from "next/navigation";
import { getProgramBySlug, getAllPrograms } from "@/lib/programs";
import { ResultPageClient } from "./result-page-client";
import { TrialResultClient } from "./trial-result-client";

interface ResultPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const programs = getAllPrograms();
  return programs.map((program) => ({
    slug: program.slug,
  }));
}

export async function generateMetadata({ params }: ResultPageProps) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    return { title: "Program Not Found" };
  }

  return {
    title: `Your Result: ${program.name} | DMK`,
    description: program.description,
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  // Use specialized trial result page for the trial program
  if (program.slug === "trial") {
    return <TrialResultClient program={program} />;
  }

  return <ResultPageClient program={program} />;
}
