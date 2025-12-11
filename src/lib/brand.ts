/**
 * GLOW UP ACADEMY - Brand Configuration
 *
 * Visual Identity Reference:
 * - Style: Soft lighting, blush tones, sparkles, elegant overlays
 * - Vibe: Feminine frames, aspirational lifestyle, transformation energies
 */

export const brand = {
  name: "Glow Up Academy",
  tagline: "Your Transformation Starts Here",

  colors: {
    // Primary Palette
    blushPink: {
      DEFAULT: "#F8D7DA",
      light: "#FDF2F4",
      dark: "#E8B4B8",
    },
    deepCherry: {
      DEFAULT: "#8B2942",
      light: "#A93D58",
      dark: "#6D1F33",
    },
    // Accent Colors
    emerald: {
      DEFAULT: "#2D6A4F",
      light: "#40916C",
      dark: "#1B4332",
    },
    gold: {
      DEFAULT: "#D4AF37",
      light: "#E5C76B",
      dark: "#B8960C",
    },
    // Neutrals
    deepGrey: "#2D2D2D",
    ivory: {
      DEFAULT: "#FFFFF0",
      dark: "#F5F5DC",
    },
    nude: "#E8D5C4",
    beige: {
      DEFAULT: "#F5E6D3",
      light: "#FAF3EB",
    },
  },

  fonts: {
    headline: {
      name: "Holiday",
      fallback: "Playfair Display, Georgia, serif",
      usage: "Main headlines, hero text, luxe emphasis",
    },
    subheader: {
      name: "Roca Two",
      fallback: "Poppins, sans-serif",
      usage: "Sub-headers, section titles, CTAs",
    },
    body: {
      name: "Be Vietnam Pro",
      fallback: "Inter, sans-serif",
      usage: "Body text, descriptions, UI elements",
    },
  },

  // Semantic color mappings for components
  semantic: {
    primary: "deepCherry",
    primaryLight: "blushPink",
    accent: "gold",
    highlight: "emerald",
    background: "ivory",
    backgroundSoft: "beige.light",
    text: "deepGrey",
  },
} as const;

// CSS class helpers
export const brandClasses = {
  // Text colors
  textPrimary: "text-deep-cherry",
  textAccent: "text-gold",
  textHighlight: "text-emerald",
  textMuted: "text-deep-grey/70",

  // Background colors
  bgPrimary: "bg-deep-cherry",
  bgPrimaryLight: "bg-blush-pink",
  bgSoft: "bg-beige-light",
  bgIvory: "bg-ivory",

  // Borders
  borderPrimary: "border-deep-cherry",
  borderSoft: "border-blush-pink-dark",

  // Typography
  fontHeadline: "font-headline",
  fontSubheader: "font-subheader",
  fontBody: "font-body",

  // Special effects
  goldFoil: "text-gold-foil",
  btnLuxe: "btn-luxe",
  cardPremium: "card-premium",
  glowSoft: "glow-soft",
} as const;

// Component-specific brand styles
export const brandStyles = {
  button: {
    primary: "bg-deep-cherry hover:bg-deep-cherry-dark text-white",
    secondary: "bg-blush-pink hover:bg-blush-pink-dark text-deep-cherry",
    outline: "border-2 border-deep-cherry text-deep-cherry hover:bg-deep-cherry hover:text-white",
    gold: "bg-gold hover:bg-gold-dark text-deep-grey",
  },
  card: {
    default: "bg-ivory border border-blush-pink-dark rounded-2xl",
    elevated: "bg-ivory border border-blush-pink-dark rounded-2xl shadow-lg glow-soft",
  },
  input: {
    default: "border-blush-pink-dark focus:border-deep-cherry focus:ring-deep-cherry/20",
  },
} as const;

export type BrandColor = keyof typeof brand.colors;
export type BrandFont = keyof typeof brand.fonts;
