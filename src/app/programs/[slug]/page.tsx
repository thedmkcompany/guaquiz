import { notFound } from "next/navigation";
import { programs, getProgramBySlug } from "@/lib/programs";
import { ProgramLanding } from "./program-landing";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return programs.map((program) => ({
    slug: program.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    return {
      title: "Program Not Found",
    };
  }

  return {
    title: `${program.name} | Programs`,
    description: program.description,
  };
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return <ProgramLanding program={program} />;
}
