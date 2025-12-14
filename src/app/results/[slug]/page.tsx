import { notFound, redirect } from "next/navigation";
import { getProgramBySlug, getAllPrograms } from "@/lib/programs";
import { ResultPageClient } from "./result-page-client";
import { TrialResultClient } from "./trial-result-client";
import { TransformResultClient } from "./transform-result-client";
import { EssentialsResultClient } from "./essentials-result-client";

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

  // Circle has its own dedicated page
  if (slug === "circle") {
    return {
      title: "Circle - Your Sisterhood to Unstoppable | Glow Up Academy",
      description: "Join 2,500+ women in the Circle community. Live workouts, 4-pillar transformation, and sisterhood accountability.",
    };
  }

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

  // Redirect Circle results to the dedicated Circle landing page
  if (slug === "circle") {
    redirect("/circle");
  }

  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  // Use specialized result pages for each program
  if (program.slug === "trial") {
    return <TrialResultClient program={program} />;
  }

  if (program.slug === "transform") {
    return <TransformResultClient program={program} />;
  }

  if (program.slug === "essentials") {
    return <EssentialsResultClient program={program} />;
  }

  return <ResultPageClient program={program} />;
}
