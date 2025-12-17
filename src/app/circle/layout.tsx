import type { Metadata } from "next";
import { getPageMetadata, siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = getPageMetadata({
  title: "Circle - Your Sisterhood to Unstoppable",
  description:
    "Join 100+ women in Circle - your transformation sisterhood. Live workouts 5x/week, 4-pillar system (fitness, beauty, finance, confidence), WhatsApp community, expert coaching. ₹4,499/month. Cancel anytime.",
  keywords: [
    "women fitness community",
    "transformation program",
    "live workouts India",
    "fitness accountability",
    "women empowerment",
    "Circle membership",
    "online fitness program",
    "Indian women fitness",
    "group coaching",
    "sisterhood accountability",
  ],
  ogImage: "/api/og?program=circle",
  canonical: `${siteConfig.url}/circle`,
});

export default function CircleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
