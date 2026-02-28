import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glowupacademy.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/checkout/success",
        "/checkout/failed",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
