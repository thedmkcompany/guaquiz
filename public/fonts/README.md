# Custom Fonts Setup

## Required Fonts for Glow Up Academy

### 1. Holiday (Headlines)
- **Usage**: Main headlines, hero text, luxe emphasis
- **Style**: Luxe feminine serif
- **Files needed**: `holiday-regular.woff2`, `holiday-bold.woff2`

### 2. Roca Two (Sub-Headers)
- **Usage**: Sub-headers, section titles, CTAs
- **Style**: Modern geometric sans
- **Files needed**: `roca-two-regular.woff2`, `roca-two-medium.woff2`, `roca-two-bold.woff2`

### 3. Be Vietnam Pro (Body) ✅
- **Status**: Already loaded via Google Fonts
- **Usage**: Body text, descriptions, UI elements

## How to Add Custom Fonts

1. Place your `.woff2` font files in this directory (`public/fonts/`)

2. Add the `@font-face` declarations to `src/app/globals.css`:

```css
@font-face {
  font-family: 'Holiday';
  src: url('/fonts/holiday-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Holiday';
  src: url('/fonts/holiday-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roca Two';
  src: url('/fonts/roca-two-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roca Two';
  src: url('/fonts/roca-two-medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roca Two';
  src: url('/fonts/roca-two-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

3. Update the CSS variables in `globals.css`:

```css
:root {
  --font-headline: 'Holiday', 'Playfair Display', Georgia, serif;
  --font-subheader: 'Roca Two', 'Poppins', sans-serif;
}
```

## Current Fallbacks

Until custom fonts are added, the site uses:
- **Holiday** → Playfair Display (Google Fonts)
- **Roca Two** → Poppins (Google Fonts)
- **Be Vietnam Pro** → Loaded from Google Fonts ✅
