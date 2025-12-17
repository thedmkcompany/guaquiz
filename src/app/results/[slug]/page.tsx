import { notFound, redirect } from "next/navigation";
import { getProgramBySlug, getAllPrograms } from "@/lib/programs";
import { ResultPageClient } from "./result-page-client";
import { WebinarResultClient } from "./webinar-result-client";
import { EssentialsResultClient } from "./essentials-result-client";
import { getProgramMetadata } from "@/lib/seo-config";

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
    redirect("/circle");
  }

  // Transform has its own dedicated page
  if (slug === "transform") {
    redirect("/transform");
  }

  const program = getProgramBySlug(slug);

  if (!program) {
    return { title: "Program Not Found" };
  }

  // Use centralized program metadata
  return getProgramMetadata(slug);
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { slug } = await params;

  // Redirect Circle results to the dedicated Circle landing page
  if (slug === "circle") {
    redirect("/circle");
  }

  // Redirect Transform results to the dedicated Transform landing page
  if (slug === "transform") {
    redirect("/transform");
  }

  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  // Use specialized result pages for each program
  if (program.slug === "webinar") {
    return <WebinarResultClient program={program} />;
  }

  if (program.slug === "essentials") {
    return <EssentialsResultClient program={program} />;
  }

  return <ResultPageClient program={program} />;
}
