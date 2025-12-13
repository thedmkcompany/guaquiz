/**
 * DESIGN TOKENS - Glow Up Academy
 * ================================
 * Single source of truth for all design decisions.
 * Import these tokens in components for consistent styling.
 *
 * Brand reference: /docs/integration/09-BRAND-COLORS.md
 */

// ============================================
// SPACING SCALE (Based on 4px grid)
// ============================================
export const spacing = {
  0: "0",
  1: "0.25rem",   // 4px
  2: "0.5rem",    // 8px
  3: "0.75rem",   // 12px
  4: "1rem",      // 16px
  5: "1.25rem",   // 20px
  6: "1.5rem",    // 24px
  8: "2rem",      // 32px
  10: "2.5rem",   // 40px
  12: "3rem",     // 48px
  14: "3.5rem",   // 56px
  16: "4rem",     // 64px
  20: "5rem",     // 80px
  24: "6rem",     // 96px
} as const;

// ============================================
// MAX WIDTH SCALE (Container widths)
// ============================================
export const maxWidth = {
  xs: "20rem",    // 320px - Very narrow (mobile)
  sm: "24rem",    // 384px - Small
  md: "28rem",    // 448px - Medium
  lg: "32rem",    // 512px - Large
  xl: "36rem",    // 576px - Extra large
  "2xl": "42rem", // 672px - 2x large (body copy)
  "3xl": "48rem", // 768px - 3x large
  "4xl": "56rem", // 896px - 4x large (hero)
  "5xl": "64rem", // 1024px - 5x large (sections)
  "6xl": "72rem", // 1152px - 6x large (header/footer)
  "7xl": "80rem", // 1280px - Full width
} as const;

// ============================================
// TYPOGRAPHY SCALE
// ============================================
export const fontSize = {
  xs: ["0.75rem", { lineHeight: "1rem" }],       // 12px
  sm: ["0.875rem", { lineHeight: "1.25rem" }],   // 14px
  base: ["1rem", { lineHeight: "1.5rem" }],      // 16px
  lg: ["1.125rem", { lineHeight: "1.75rem" }],   // 18px
  xl: ["1.25rem", { lineHeight: "1.75rem" }],    // 20px
  "2xl": ["1.5rem", { lineHeight: "2rem" }],     // 24px
  "3xl": ["1.875rem", { lineHeight: "2.25rem" }],// 30px
  "4xl": ["2.25rem", { lineHeight: "2.5rem" }],  // 36px
  "5xl": ["3rem", { lineHeight: "1.1" }],        // 48px
  "6xl": ["3.75rem", { lineHeight: "1.1" }],     // 60px
  "7xl": ["4.5rem", { lineHeight: "1.1" }],      // 72px
} as const;

// Font families (from 09-BRAND-COLORS.md)
// Custom fonts loaded from /public/fonts/:
// - Holiday: Headlines, hero text, luxe emphasis (luxe feminine serif)
// - Roca Two: Sub-headers, section titles, CTAs (modern geometric sans)
// - Be Vietnam Pro: Body text, captions (via Google Fonts)
// - The Seasons: Quotes, signatures (accent serif)
export const fontFamily = {
  headline: "'Holiday', var(--font-playfair), 'Playfair Display', Georgia, serif",
  subheader: "'Roca Two', var(--font-poppins), 'Poppins', system-ui, sans-serif",
  body: "var(--font-be-vietnam), 'Be Vietnam Pro', system-ui, sans-serif",
  accent: "'The Seasons', var(--font-playfair), Georgia, serif",
} as const;

// Font weights
export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

// ============================================
// COLOR PALETTE (from 09-BRAND-COLORS.md)
// ============================================
export const colors = {
  // Primary: Deep Forest Green - Strength & sophistication
  forest: {
    DEFAULT: "#012D26",
    light: "#034D40",
    dark: "#001A17",
  },
  // Accent 1: Soft Gold Metallic - Prestige & warmth
  gold: {
    DEFAULT: "#D4AF37",
    light: "#E5C76B",
    dark: "#B8960C",
  },
  // Secondary: Rich Wine / Maroon - Passion & luxury
  wine: {
    DEFAULT: "#800000",
    light: "#A32020",
    dark: "#5C0000",
  },
  // Accent 2: Ivory / Off-White - Purity & calm
  ivory: "#FAF6F0",
  // Accent 3: Satin Beige - Soft femininity
  beige: {
    DEFAULT: "#E8DCC3",
    light: "#F2EBD9",
    dark: "#D4C5A9",
  },
  charcoal: "#1A1A1A",
  slate: "#4A4A4A",
  // Semantic
  white: "#ffffff",
  black: "#000000",
} as const;

// ============================================
// BORDER RADIUS (Super-rounded system)
// ============================================
export const borderRadius = {
  none: "0",
  sm: "0.375rem",    // 6px
  md: "0.5rem",      // 8px
  lg: "0.75rem",     // 12px
  xl: "1rem",        // 16px
  "2xl": "1.5rem",   // 24px
  "3xl": "2rem",     // 32px - Cards, sections
  "4xl": "2.5rem",   // 40px - Large cards
  full: "9999px",    // Pills, buttons
} as const;

// ============================================
// SHADOWS (Soft depth system)
// ============================================
export const shadows = {
  none: "none",
  // Soft shadows (no harsh black)
  sm: "0 4px 20px -2px rgba(0,0,0,0.05)",
  md: "0 8px 30px -4px rgba(0,0,0,0.06)",
  lg: "0 20px 50px rgba(0,0,0,0.06)",
  xl: "0 25px 60px rgba(0,0,0,0.08)",
  // Hover states
  "hover-sm": "0 6px 25px -2px rgba(0,0,0,0.08)",
  "hover-md": "0 12px 40px -4px rgba(0,0,0,0.1)",
  "hover-lg": "0 25px 60px rgba(0,0,0,0.1)",
  // Glow effects
  "glow-gold": "0 0 40px rgba(212, 175, 55, 0.3)",
  "glow-forest": "0 0 40px rgba(1, 45, 38, 0.2)",
} as const;

// ============================================
// GLASS EFFECTS (Enhanced for modern aesthetic)
// ============================================
export const glass = {
  // Strong glass - for primary cards
  strong: {
    bg: "rgba(255, 255, 255, 0.85)",
    border: "rgba(255, 255, 255, 0.6)",
    blur: "blur(24px)",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
  },
  // Light glass - for secondary cards
  light: {
    bg: "rgba(255, 255, 255, 0.7)",
    border: "rgba(255, 255, 255, 0.5)",
    blur: "blur(20px)",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
  },
  // Medium glass - for overlays
  medium: {
    bg: "rgba(255, 255, 255, 0.5)",
    border: "rgba(255, 255, 255, 0.3)",
    blur: "blur(16px)",
    shadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
  },
  // Frosted - for subtle backgrounds
  frosted: {
    bg: "rgba(255, 255, 255, 0.4)",
    border: "rgba(255, 255, 255, 0.2)",
    blur: "blur(12px)",
    shadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
  },
} as const;

// ============================================
// GRADIENT BACKGROUNDS
// ============================================
export const gradients = {
  // Soft pastel using brand colors
  pastel: "linear-gradient(135deg, #F2EBD9 0%, #FAF6F0 25%, #E8DCC3 50%, #F2EBD9 75%, #FAF6F0 100%)",
  pastelVertical: "linear-gradient(to bottom, #FAF6F0 0%, #F2EBD9 50%, #E8DCC3 100%)",
  // Subtle overlay
  soft: "linear-gradient(135deg, rgba(250, 246, 240, 0.8) 0%, rgba(242, 235, 217, 0.9) 50%, rgba(232, 220, 195, 0.8) 100%)",
  // Gold shimmer
  goldShimmer: "linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(229, 199, 107, 0.15) 50%, rgba(212, 175, 55, 0.1) 100%)",
} as const;

// ============================================
// BUTTON VARIANTS
// ============================================
export const buttonVariants = {
  // Primary: Gold pill button
  primary: {
    base: "bg-gold text-charcoal font-semibold",
    hover: "hover:bg-gold-dark",
    active: "active:bg-gold-dark",
    disabled: "disabled:bg-beige disabled:text-charcoal/50",
  },
  // Secondary: Forest outline
  secondary: {
    base: "bg-transparent text-forest border-2 border-forest font-semibold",
    hover: "hover:bg-forest hover:text-ivory",
    active: "active:bg-forest-dark",
    disabled: "disabled:border-beige disabled:text-charcoal/50",
  },
  // Ghost: Subtle hover
  ghost: {
    base: "bg-transparent text-forest font-medium",
    hover: "hover:bg-beige-light",
    active: "active:bg-beige",
    disabled: "disabled:text-charcoal/50",
  },
  // Glass: For overlays
  glass: {
    base: "bg-white/10 backdrop-blur-md text-ivory border border-white/20 font-semibold",
    hover: "hover:bg-white/20",
    active: "active:bg-white/30",
    disabled: "disabled:bg-white/5 disabled:text-ivory/50",
  },
  // Wine: Accent action
  wine: {
    base: "bg-wine text-ivory font-semibold",
    hover: "hover:bg-wine-dark",
    active: "active:bg-wine-dark",
    disabled: "disabled:bg-wine/50 disabled:text-ivory/50",
  },
} as const;

// Button sizes
export const buttonSizes = {
  sm: {
    padding: "px-4 py-2",
    text: "text-sm",
    minHeight: "min-h-[36px]",
  },
  md: {
    padding: "px-6 py-3",
    text: "text-base",
    minHeight: "min-h-[44px]",
  },
  lg: {
    padding: "px-8 py-4",
    text: "text-lg",
    minHeight: "min-h-[52px]",
  },
  xl: {
    padding: "px-10 py-5",
    text: "text-xl",
    minHeight: "min-h-[60px]",
  },
} as const;

// ============================================
// SECTION PADDING (Responsive)
// ============================================
export const sectionPadding = {
  x: "px-4 sm:px-6 lg:px-8",
  y: {
    sm: "py-8 sm:py-10 md:py-12",
    md: "py-12 sm:py-16 md:py-20",
    lg: "py-16 sm:py-20 md:py-24 lg:py-28",
  },
} as const;

// ============================================
// TRANSITIONS
// ============================================
export const transitions = {
  fast: "transition-all duration-150 ease-out",
  normal: "transition-all duration-300 ease-out",
  slow: "transition-all duration-500 ease-out",
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================
export const zIndex = {
  base: "0",
  dropdown: "10",
  sticky: "20",
  fixed: "30",
  overlay: "40",
  modal: "50",
  popover: "60",
  toast: "70",
} as const;

// ============================================
// TAILWIND CLASS HELPERS
// ============================================

/** Card styles with soft UI tokens */
export const cardStyles = {
  base: "rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-beige/30",
  // Enhanced glass cards
  glass: "rounded-[2rem] glass-card",
  glassStrong: "rounded-[2rem] glass-card-strong",
  frosted: "rounded-[2rem] frosted-glass",
  overlay: "rounded-[2rem] glass-overlay",
  hover: "hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300",
} as const;

/** Section container styles */
export const containerStyles = {
  narrow: "max-w-2xl mx-auto",
  default: "max-w-5xl mx-auto",
  wide: "max-w-6xl mx-auto",
  full: "max-w-7xl mx-auto",
} as const;

/** Floater frame styles */
export const floaterStyles = {
  frame: "p-8 sm:p-10 lg:p-12 rounded-[2rem] border-[6px] border-beige/30",
  glass: "bg-white/60 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.06)]",
} as const;

/** Text styles */
export const textStyles = {
  // Headlines (Holiday font)
  h1: "font-headline text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight",
  h2: "font-headline text-2xl sm:text-3xl lg:text-4xl font-bold",
  h3: "font-headline text-xl sm:text-2xl font-bold",
  h4: "font-headline text-lg sm:text-xl font-semibold",
  // Subheaders (Roca Two font)
  subheader: "font-subheader text-base sm:text-lg font-semibold",
  subheaderLg: "font-subheader text-lg sm:text-xl font-semibold",
  // Body (Be Vietnam Pro)
  body: "font-body text-base leading-relaxed",
  bodyLg: "font-body text-lg sm:text-xl leading-relaxed",
  bodySm: "font-body text-sm leading-relaxed",
  // Accent (The Seasons)
  quote: "font-accent text-lg sm:text-xl italic",
  signature: "font-accent text-xl sm:text-2xl",
  // Utility
  label: "font-subheader text-xs sm:text-sm uppercase tracking-wider",
  caption: "font-body text-xs text-forest/60",
} as const;
