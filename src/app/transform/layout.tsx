import type { Metadata } from "next";
import { getPageMetadata, siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = getPageMetadata({
  title: "Transform - Complete 1:1 Transformation with Disha",
  description:
    "Premium 1:1 transformation program with Disha Methi Khandelwal. 6 months of personal coaching, custom fitness & nutrition plans, beauty consultation, financial guidance, and VIP support. ₹1,99,999 investment for complete life transformation. Book your ₹9,999 strategy call today.",
  keywords: [
    "personal transformation coach",
    "1:1 coaching India",
    "premium transformation",
    "Disha Methi Khandelwal",
    "high-ticket coaching",
    "VIP transformation program",
    "personal fitness coach India",
    "holistic life coaching",
    "executive wellness program",
  ],
  ogImage: "/api/og?program=transform",
  canonical: `${siteConfig.url}/transform`,
});

export default function TransformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
