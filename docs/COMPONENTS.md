# Component Documentation

Reference for React components in the DMK Quiz application.

## Component Structure

```
src/components/
├── quiz/              # Quiz flow components
├── checkout/          # Payment components
├── results/           # Results page components
├── landing/           # Landing page components
├── support/           # Support widgets
├── analytics/         # Analytics integration
└── ui/                # Shared UI components
```

---

## Quiz Components

### Quiz

**Location**: `src/components/quiz/quiz.tsx`

Main quiz component that orchestrates the entire quiz flow.

**Props**: None (self-contained)

**Flow States**:
1. `intro` - Welcome screen
2. `question` - Question display (Q1-Q8)
3. `transition-after-q3` - Mid-quiz engagement screen
4. `loading` - Analysis animation
5. `lead-capture` - Name/email/phone form

**Usage**:

```tsx
import { Quiz } from '@/components/quiz/quiz';

export default function QuizPage() {
  return <Quiz />;
}
```

**State Management**:
- Answers stored in React state during quiz
- Final response saved to localStorage
- Lead data submitted to `/api/quiz/submit`

---

### QuizOption

**Location**: `src/components/quiz/quiz-option.tsx`

Individual quiz option button with selection state.

**Props**:

```typescript
interface QuizOptionProps {
  /** Option data from quiz-data.ts */
  option: {
    id: string;
    text: string;
    description?: string;
  };
  /** Whether this option is currently selected */
  isSelected: boolean;
  /** Click handler */
  onSelect: () => void;
}
```

**Usage**:

```tsx
<QuizOption
  option={{ id: 'q1-a', text: 'Option A', description: 'Details' }}
  isSelected={selectedIds.includes('q1-a')}
  onSelect={() => handleSelect('q1-a')}
/>
```

---

## Checkout Components

### RazorpayCheckout

**Location**: `src/components/checkout/RazorpayCheckout.tsx`

Razorpay payment integration component.

**Props**:

```typescript
interface RazorpayCheckoutProps {
  /** Program to purchase */
  program: Program;
  /** Customer information (pre-filled from quiz) */
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  /** Success callback */
  onSuccess: (paymentId: string) => void;
  /** Error callback */
  onError: (error: Error) => void;
}
```

**Flow**:
1. Create order via `/api/payment/razorpay/create-order`
2. Open Razorpay checkout popup
3. Verify signature via `/api/payment/razorpay/verify`
4. Call onSuccess or onError

---

### PayUCheckout

**Location**: `src/components/checkout/PayUCheckout.tsx`

PayU payment integration (fallback gateway).

**Props**:

```typescript
interface PayUCheckoutProps {
  program: Program;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
}
```

**Flow**:
1. Get form data from `/api/payment/payu/initiate`
2. Submit form to PayU payment page
3. PayU redirects to callback URL

---

## Results Components

### BenefitCard

**Location**: `src/components/results/BenefitCard.tsx`

Displays a program benefit with icon.

```tsx
<BenefitCard
  icon={<CheckIcon />}
  title="Lifetime Access"
  description="Access all content forever"
/>
```

---

### FAQItem

**Location**: `src/components/results/FAQItem.tsx`

Expandable FAQ accordion item.

```tsx
<FAQItem
  question="What's included?"
  answer="Everything you need..."
  isOpen={openIndex === 0}
  onToggle={() => setOpenIndex(0)}
/>
```

---

### TestimonialCard

**Location**: `src/components/results/TestimonialCard.tsx`

Customer testimonial with photo and quote.

```tsx
<TestimonialCard
  name="Jane Doe"
  image="/images/testimonials/jane.jpg"
  quote="This program changed my life..."
  program="Circle"
/>
```

---

### PillarCard

**Location**: `src/components/results/PillarCard.tsx`

Core pillar/feature card for program details.

```tsx
<PillarCard
  icon={<FitnessIcon />}
  title="Fitness"
  description="Transform your body with personalized workouts"
/>
```

---

### TimelineItem

**Location**: `src/components/results/TimelineItem.tsx`

Program timeline/roadmap step.

```tsx
<TimelineItem
  week="Week 1-2"
  title="Foundation"
  description="Build your baseline habits"
  isActive={currentWeek <= 2}
/>
```

---

## Landing Components

### CTAButton

**Location**: `src/components/landing/CTAButton.tsx`

Call-to-action button with variants.

```tsx
<CTAButton
  href="/quiz"
  variant="primary"
  size="large"
>
  Take the Quiz
</CTAButton>
```

**Variants**: `primary`, `secondary`, `outline`
**Sizes**: `small`, `medium`, `large`

---

### Section

**Location**: `src/components/landing/Section.tsx`

Page section wrapper with consistent spacing.

```tsx
<Section background="gradient" padding="large">
  <SectionHeading>Our Programs</SectionHeading>
  {/* Content */}
</Section>
```

---

### StatBlock

**Location**: `src/components/landing/StatBlock.tsx`

Statistics display with number animation.

```tsx
<StatBlock
  value={5000}
  suffix="+"
  label="Women Transformed"
  animate={true}
/>
```

---

## UI Components

### Header

**Location**: `src/components/ui/header.tsx`

Site navigation header with mobile menu.

```tsx
<Header transparent={isHeroSection} />
```

**Features**:
- Responsive navigation
- Mobile hamburger menu
- Transparent mode for hero sections
- Logo with home link

---

### Footer

**Location**: `src/components/ui/footer.tsx`

Site footer with links and contact info.

```tsx
<Footer />
```

**Sections**:
- Navigation links
- Legal links (Privacy, Terms, Refund)
- Contact information
- Social media links

---

### Button

**Location**: `src/components/ui/button.tsx`

Reusable button with variants.

```tsx
<Button variant="primary" size="md" loading={isLoading}>
  Submit
</Button>
```

**Props**:

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

---

### Progress

**Location**: `src/components/ui/progress.tsx`

Progress bar component (used in quiz).

```tsx
<Progress value={62.5} max={100} />
```

---

### FeminineDecorations

**Location**: `src/components/ui/feminine-decorations.tsx`

Decorative background elements for brand styling.

```tsx
<FeminineDecorations variant="blobs" opacity={0.1} />
```

**Variants**: `blobs`, `circles`, `gradient`

---

## Support Components

### WhatsAppButton

**Location**: `src/components/support/whatsapp-button.tsx`

Floating WhatsApp support button.

```tsx
<WhatsAppButton phoneNumber="+919876543210" />
```

**Features**:
- Fixed position (bottom-right)
- Click to open WhatsApp chat
- Pre-filled message support

---

### CalendlyEmbed

**Location**: `src/components/support/calendly-embed.tsx`

Embedded Calendly booking widget.

```tsx
<CalendlyEmbed url="https://calendly.com/your-link" />
```

---

## Analytics Components

### GoogleTagManager

**Location**: `src/components/analytics/google-tag-manager.tsx`

GTM integration with client and server components.

```tsx
// In layout.tsx
<GoogleTagManager containerId="GTM-XXXXX" />
```

---

## Component Best Practices

### 1. Props Interface Documentation

Always define and export prop interfaces:

```typescript
/**
 * Props for MyComponent
 */
export interface MyComponentProps {
  /** Brief description */
  propName: string;
}
```

### 2. Default Props

Use destructuring defaults:

```typescript
function MyComponent({
  variant = 'primary',
  size = 'md',
}: MyComponentProps) {
  // ...
}
```

### 3. Event Handlers

Prefix with `on` and use `handle` internally:

```typescript
interface Props {
  onSelect: (id: string) => void;
}

function Component({ onSelect }: Props) {
  const handleClick = (id: string) => {
    // Internal logic
    onSelect(id);
  };
}
```

### 4. Loading States

Always handle loading states:

```tsx
function Component() {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Skeleton />;
  }

  return <Content />;
}
```

### 5. Error Boundaries

Wrap complex components:

```tsx
<ErrorBoundary fallback={<ErrorMessage />}>
  <ComplexComponent />
</ErrorBoundary>
```

---

## Adding New Components

1. Create component file in appropriate directory
2. Add TypeScript interface for props
3. Add JSDoc documentation
4. Export from directory index.ts (if exists)
5. Add to this documentation

```typescript
/**
 * MyComponent - Brief description
 *
 * @component
 * @example
 * ```tsx
 * <MyComponent prop="value" />
 * ```
 */
export interface MyComponentProps {
  /** Prop description */
  prop: string;
}

export function MyComponent({ prop }: MyComponentProps) {
  return <div>{prop}</div>;
}
```
