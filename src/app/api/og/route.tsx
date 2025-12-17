/**
 * Dynamic OG Image Generation API
 *
 * Generates Open Graph images for social media sharing.
 * Uses @vercel/og to create images with brand colors, fonts, and content.
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getProgramBySlug } from "@/lib/programs";

export const runtime = "edge";

// Brand colors matching 09-BRAND-COLORS.md
const colors = {
  wine: "#6B3E3E",
  gold: "#C9A24B",
  beige: "#F2EBD9",
  forest: "#2B3A2B",
  ivory: "#FAF7F2",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const program = searchParams.get("program");

    // Determine which OG image to generate
    let title = "Glow Up Academy";
    let subtitle = "Where Unstoppable Becomes Your Identity";
    let price = "";
    let badge = "";

    if (program) {
      const programData = getProgramBySlug(program);
      if (programData) {
        title = programData.name;
        subtitle = programData.tagline || programData.description;
        price = `₹${programData.price.toLocaleString("en-IN")}`;
        badge = programData.tier.toUpperCase();
      }
    } else if (page === "home") {
      title = "Transform Your Body, Mind & Wealth";
      subtitle = "Join 2,500+ women who became hot and unstoppable";
    } else if (page === "programs") {
      title = "Our Programs";
      subtitle = "Find your perfect transformation path";
    } else if (page === "about") {
      title = "Meet Disha";
      subtitle = "Your Transformation Architect";
    } else if (page === "contact") {
      title = "Get in Touch";
      subtitle = "Start your transformation journey today";
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${colors.ivory} 0%, ${colors.beige} 50%, ${colors.gold}15 100%)`,
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Background decorative elements */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "-10%",
              width: "400px",
              height: "400px",
              background: colors.wine,
              opacity: 0.1,
              borderRadius: "50%",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              right: "-10%",
              width: "500px",
              height: "500px",
              background: colors.gold,
              opacity: 0.15,
              borderRadius: "50%",
              filter: "blur(80px)",
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px",
              textAlign: "center",
              zIndex: 10,
              width: "100%",
              maxWidth: "1000px",
            }}
          >
            {/* Badge */}
            {badge && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: colors.wine,
                  color: colors.ivory,
                  padding: "12px 32px",
                  borderRadius: "100px",
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  marginBottom: "40px",
                  textTransform: "uppercase",
                }}
              >
                {badge}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontSize: badge ? "72px" : "80px",
                fontWeight: 800,
                color: colors.forest,
                margin: 0,
                marginBottom: "24px",
                lineHeight: 1.1,
                maxWidth: "900px",
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "36px",
                color: colors.wine,
                margin: 0,
                marginBottom: price ? "32px" : "0",
                lineHeight: 1.4,
                maxWidth: "800px",
                opacity: 0.9,
              }}
            >
              {subtitle}
            </p>

            {/* Price */}
            {price && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.wine} 100%)`,
                  color: colors.ivory,
                  padding: "16px 48px",
                  borderRadius: "100px",
                  fontSize: "48px",
                  fontWeight: 700,
                  marginTop: "20px",
                }}
              >
                {price}
              </div>
            )}
          </div>

          {/* Footer with logo/brand */}
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: colors.wine,
                fontStyle: "italic",
                letterSpacing: "0.05em",
              }}
            >
              Glow Up Academy
            </div>
          </div>

          {/* Decorative corner elements */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "40px",
              width: "80px",
              height: "80px",
              borderTop: `4px solid ${colors.gold}`,
              borderLeft: `4px solid ${colors.gold}`,
              borderTopLeftRadius: "20px",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              width: "80px",
              height: "80px",
              borderBottom: `4px solid ${colors.wine}`,
              borderRight: `4px solid ${colors.wine}`,
              borderBottomRightRadius: "20px",
              opacity: 0.6,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
