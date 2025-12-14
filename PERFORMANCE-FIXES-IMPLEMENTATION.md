# Performance Fixes - Implementation Guide

Quick reference for implementing critical performance optimizations from the audit.

---

## Priority 1: Image Optimization (CRITICAL - 90% size reduction)

### Step 1: Install Dependencies
```bash
npm install sharp --save-dev
```

### Step 2: Create Image Optimization Script
Create `/scripts/optimize-brand-logos.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/brand-logos');
const outputDir = path.join(__dirname, '../public/brand-logos-optimized');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir);

files.forEach(file => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

    sharp(inputPath)
      .resize(200, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`✅ Optimized: ${file} -> ${path.basename(outputPath)}`))
      .catch(err => console.error(`❌ Error optimizing ${file}:`, err));
  }
});
```

### Step 3: Run Optimization
```bash
node scripts/optimize-brand-logos.js
```

### Step 4: Update Logo Paths
**File:** `/src/components/MobileLogoLoop.tsx`

**Replace lines 9-22:**
```tsx
const logoItems: LogoItem[] = [
  { src: '/brand-logos-optimized/Bosch-Logo.webp', alt: 'Bosch', width: 200, height: 56 },
  { src: '/brand-logos-optimized/RedBull logo.webp', alt: 'Red Bull', width: 200, height: 56 },
  { src: '/brand-logos-optimized/Airtel-Logo-2010-present.webp', alt: 'Airtel', width: 200, height: 56 },
  { src: '/brand-logos-optimized/Vodafone_Logo.webp', alt: 'Vodafone', width: 200, height: 56 },
  { src: '/brand-logos-optimized/Tech_Mahindra_New_Logo.svg.webp', alt: 'Tech Mahindra', width: 200, height: 56 },
  { src: '/brand-logos-optimized/ISB _ 20 Final Logo_Blue Clr Logo.webp', alt: 'ISB', width: 200, height: 56 },
  { src: '/brand-logos-optimized/NIFT_official_logo.webp', alt: 'NIFT', width: 200, height: 56 },
  { src: '/brand-logos-optimized/GMR_Group_(logo).svg.webp', alt: 'GMR Group', width: 200, height: 56 },
  { src: '/brand-logos-optimized/Fourth_Partner_Energy_logo.webp', alt: 'Fourth Partner Energy', width: 200, height: 56 },
  { src: '/brand-logos-optimized/Pine_Labs_Logo.webp', alt: 'Pine Labs', width: 200, height: 56 },
  { src: '/brand-logos-optimized/Advintek_Logo_PNG_.webp', alt: 'Advintek', width: 200, height: 56 },
  { src: '/brand-logos-optimized/icai logo_egal_download.webp', alt: 'ICAI', width: 200, height: 56 },
];
```

### Step 5: Update LogoLoop to Use Next/Image
**File:** `/src/components/LogoLoop.tsx`

**Add import at line 1:**
```tsx
import Image from 'next/image';
```

**Replace lines 322-333:**
```tsx
{/* Replace the img tag with: */}
<Image
  src={item.src}
  srcSet={item.srcSet}
  width={item.width || 200}
  height={item.height || 56}
  alt={item.alt ?? ''}
  title={item.title}
  loading="lazy"
  quality={80}
  sizes="(max-width: 768px) 100px, 200px"
  draggable={false}
  style={{ objectFit: 'contain' }}
/>
```

**Expected Result:** Image load time: 3-5s → 0.5-1s (80% faster)

---

## Priority 2: Add React Memoization (Prevent Unnecessary Re-renders)

### Fix 1: Memoize Quiz Component
**File:** `/src/components/quiz/quiz.tsx`

**Change line 36:**
```tsx
// FROM:
export function Quiz() {

// TO:
import { memo } from 'react'; // Add to imports at top

export const Quiz = memo(function Quiz() {
  // ... existing code
}); // Close memo wrapper at end
```

### Fix 2: Memoize QuizOption Component
**File:** `/src/components/quiz/quiz-option.tsx`

**Wrap entire export:**
```tsx
import { memo } from 'react';

export const QuizOption = memo(function QuizOption({
  label,
  text,
  description,
  isSelected,
  onSelect,
}: QuizOptionProps) {
  // ... existing code
});
```

### Fix 3: Memoize Result Page Components
**Files:**
- `/src/app/results/[slug]/trial-result-client.tsx`
- `/src/app/results/[slug]/transform-result-client.tsx`
- `/src/app/results/[slug]/essentials-result-client.tsx`

**Add to each:**
```tsx
import { memo } from 'react';

// Wrap export:
export const TrialResultClient = memo(function TrialResultClient({ program }: TrialResultClientProps) {
  // ... existing code
});
```

**Expected Result:** 20-30% reduction in render time during quiz navigation

---

## Priority 3: Fix setTimeout Memory Leak

### Fix: Add Cleanup to Quiz Component
**File:** `/src/components/quiz/quiz.tsx`

**Add ref after line 55:**
```tsx
// After: const quizResponseRef = useRef<QuizResponse | null>(null);

// Add this:
const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
```

**Update handleOptionSelect (lines 189-205):**
```tsx
// Auto-advance for single-select questions after a brief delay
if (!isMultiSelect) {
  // Clear any existing timeout first
  if (autoAdvanceTimeoutRef.current) {
    clearTimeout(autoAdvanceTimeoutRef.current);
  }

  autoAdvanceTimeoutRef.current = setTimeout(() => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      const nextIndex = currentQuestionIndex + 1;
      // Show transition screen after Q3 (index 2)
      if (currentQuestionIndex === 2) {
        setCurrentQuestionIndex(nextIndex);
        setScreen("transition-after-q3");
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    } else {
      // Last question - go to loading screen
      setScreen("loading");
    }
  }, 300);
}
```

**Add cleanup effect after handleSkipLead (around line 308):**
```tsx
// Cleanup timeout on unmount
useEffect(() => {
  return () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
  };
}, []);
```

**Expected Result:** No memory leaks when navigating away from quiz

---

## Priority 4: Implement Code Splitting

### Fix 1: Dynamic Import Analytics
**File:** `/src/app/layout.tsx`

**Replace lines 5-8:**
```tsx
// FROM:
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics";

// TO:
import dynamic from 'next/dynamic';

const GoogleTagManager = dynamic(() =>
  import('@/components/analytics').then(mod => ({ default: mod.GoogleTagManager })),
  { ssr: false }
);

const GoogleTagManagerNoScript = dynamic(() =>
  import('@/components/analytics').then(mod => ({ default: mod.GoogleTagManagerNoScript })),
  { ssr: false }
);
```

### Fix 2: Dynamic Import Heavy Components
**File:** `/src/app/page.tsx`

**Replace lines 9-11:**
```tsx
// FROM:
import { MobileLogoLoop } from "@/components/MobileLogoLoop";
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
import { Footer } from "@/components/ui/footer";

// TO:
import dynamic from 'next/dynamic';

const MobileLogoLoop = dynamic(
  () => import('@/components/MobileLogoLoop').then(mod => ({ default: mod.MobileLogoLoop })),
  {
    loading: () => <div className="h-20 bg-white/60 backdrop-blur-sm border-b border-white/30 md:hidden" />,
    ssr: true
  }
);

const Footer = dynamic(() =>
  import('@/components/ui/footer').then(mod => ({ default: mod.Footer })),
  { ssr: true }
);

// DecorativeBlobs can stay static - it's small
import { DecorativeBlobs } from "@/components/ui/decorative-blobs";
```

**Expected Result:** Initial bundle size reduction: ~800KB → ~500KB (37% smaller)

---

## Priority 5: Configure Next.js Optimizations

### Update next.config.ts
**File:** `/next.config.ts`

**Replace entire file:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,

  // Headers for caching
  async headers() {
    return [
      {
        source: '/brand-logos-optimized/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
```

**Expected Result:** Better caching, smaller CSS bundle

---

## Priority 6: Add Preconnect Headers

### Update Layout Head
**File:** `/src/app/layout.tsx`

**Replace lines 81-83:**
```tsx
<head>
  <link rel="preconnect" href="https://checkout.razorpay.com" />
  <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
  <link rel="preconnect" href="https://www.googletagmanager.com" />
  <GoogleTagManager />
</head>
```

**Expected Result:** Faster third-party script loading

---

## Priority 7: Optimize CSS Animations

### Add will-change to Gradient Animation
**File:** `/src/app/globals.css`

**Update line 538-548:**
```css
.bg-gradient-pastel {
  background: linear-gradient(
    135deg,
    var(--color-ivory) 0%,
    var(--color-beige-light) 30%,
    var(--color-ivory) 60%,
    var(--color-beige-light) 100%
  );
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  will-change: background-position; /* ADD THIS LINE */
}
```

**Expected Result:** Smoother background gradient animation

---

## Priority 8: Move Inline Data to Separate Files

### Step 1: Create Data Files
**Create:** `/src/lib/homepage-data.ts`

```typescript
export const testimonials = [
  {
    quote: "I went from inconsistent and unmotivated to unstoppable in 90 days. Disha taught me that discipline is the real luxury.",
    name: "Priya M.",
    location: "Mumbai",
    role: "Marketing Director",
    age: 29,
    imagePlaceholder: "[Photo of woman, confident pose]",
  },
  {
    quote: "Finally, I feel confident in my body AND my life. This isn't just fitness—it's complete transformation.",
    name: "Meera S.",
    location: "London",
    role: "NRI, Finance Professional",
    age: 27,
    imagePlaceholder: "[Photo of woman, empowered energy]",
  },
  {
    quote: "The structure I needed without the pressure I dreaded. I show up for myself now—not from guilt, from love.",
    name: "Rhea K.",
    location: "Bangalore",
    role: "Entrepreneur",
    age: 30,
    imagePlaceholder: "[Photo of woman, radiant smile]",
  },
];

export const stats = [
  { value: "4,500+", label: "Fitness sessions conducted" },
  { value: "15,000+", label: "Women trained globally" },
  { value: "40K+", label: "Instagram community" },
];
```

### Step 2: Update Homepage
**File:** `/src/app/page.tsx`

**Replace lines 22-54:**
```tsx
// FROM:
const testimonials = [ /* ... */ ];
const stats = [ /* ... */ ];

// TO:
import { testimonials, stats } from '@/lib/homepage-data';
```

**Expected Result:** Smaller component file, better tree-shaking

---

## Verification & Testing

### 1. Build the App
```bash
npm run build
```

Check output for bundle sizes.

### 2. Run Lighthouse
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

Target scores:
- Performance: 90+
- Best Practices: 95+
- Accessibility: 100
- SEO: 100

### 3. Check Bundle Size
```bash
ANALYZE=true npm run build
```

(After installing bundle analyzer from audit)

### 4. Test Quiz Performance
1. Open Chrome DevTools
2. Go to Performance tab
3. Record quiz interaction
4. Check for:
   - Frame rate: Consistent 60fps
   - Long tasks: <50ms
   - Memory leaks: No increasing memory over time

---

## Expected Overall Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| First Contentful Paint | 2.5s | 1.2s | 52% faster |
| Largest Contentful Paint | 4.0s | 2.0s | 50% faster |
| Time to Interactive | 5.0s | 2.5s | 50% faster |
| Bundle Size (gzipped) | 800KB | 500KB | 37% smaller |
| Image Load Time | 3-5s | 0.5-1s | 80% faster |
| Lighthouse Score | 65-75 | 90-95 | 25% higher |

---

## Deployment Checklist

- [ ] Image optimization script run
- [ ] All brand logos converted to WebP
- [ ] next/image implemented in LogoLoop
- [ ] React memo added to Quiz and result components
- [ ] setTimeout cleanup implemented
- [ ] Dynamic imports added to layout and homepage
- [ ] next.config.ts updated
- [ ] Preconnect headers added
- [ ] CSS will-change added
- [ ] Inline data moved to separate files
- [ ] Build successful with no errors
- [ ] Lighthouse score 90+
- [ ] Quiz animations smooth at 60fps
- [ ] No memory leaks in DevTools
- [ ] Mobile performance tested

---

**Implementation Time:** 4-6 hours for all Priority 1-8 fixes

**Recommended Order:**
1. Image optimization (1 hour)
2. React memoization (30 min)
3. setTimeout cleanup (15 min)
4. Code splitting (45 min)
5. next.config.ts (15 min)
6. Preconnect headers (5 min)
7. CSS optimizations (10 min)
8. Move inline data (30 min)

---

*Last Updated: 2025-12-14*
