import { notFound } from "next/navigation";
import { getProgramBySlug, getAllPrograms, formatPrice } from "@/lib/programs";
import { ResultPageClient } from "./result-page-client";

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

  return <ResultPageClient program={program} />;
}
