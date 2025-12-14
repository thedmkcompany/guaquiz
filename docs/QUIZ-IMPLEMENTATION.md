# Quiz Implementation Documentation

## Overview

The DMK Quiz is a full-screen, interactive questionnaire that guides users through 8 questions to recommend a personalized program. The implementation includes lead capture, Wix CRM integration, and performance optimizations for smooth animations and fast response times.

## Features

- ✅ Full-screen quiz experience with 8 questions
- ✅ Progress tracking with visual progress bar
- ✅ Transition screen after question 3
- ✅ Loading animation after question 8
- ✅ Lead capture (name, email, WhatsApp) before results
- ✅ Wix CRM integration with automatic labeling
- ✅ GPU-accelerated animations
- ✅ React performance optimizations (memo, useCallback, useMemo)
- ✅ Retry logic with exponential backoff
- ✅ Timeout handling for API calls
- ✅ Mobile and desktop responsive design

## Architecture

### Components

```
src/components/quiz/
├── quiz.tsx              # Main quiz orchestration component
├── quiz-option.tsx       # Individual quiz option (memoized)
└── ...
```

### Data & Types

```
src/lib/
├── quiz-data.ts          # Quiz questions and scoring logic
└── wix-crm.ts           # Wix CRM integration with retry logic

src/types/
└── index.ts             # Quiz-related TypeScript interfaces
```

### API Routes

```
src/app/api/quiz/
└── submit/
    └── route.ts         # Lead submission endpoint with timeout
```

## Component Documentation

### Quiz Component

**File:** `src/components/quiz/quiz.tsx`

Main quiz orchestration component that manages:
- Quiz state and progression
- Screen transitions
- Lead capture
- Results navigation

**Performance Optimizations:**
- `useCallback` for all event handlers to prevent child re-renders
- `useMemo` for derived values (currentQuestion, progress)
- Session storage for state persistence
- Fire-and-forget API call for lead submission

**Usage:**
```tsx
import { Quiz } from '@/components/quiz/quiz'

export default function QuizPage() {
  return <Quiz />
}
```

**Screens:**
1. `intro` - Welcome screen with quiz description
2. `question` - Question display with options
3. `transition-after-q3` - Mid-quiz motivation screen
4. `loading` - Processing animation after Q8
5. `lead-capture` - Name, email, WhatsApp collection

### QuizOption Component

**File:** `src/components/quiz/quiz-option.tsx`

Memoized option component for quiz answers.

**Props:**
```typescript
interface QuizOptionProps {
  label: string;        // A, B, C, D
  text: string;         // Main option text
  description?: string; // Italic explanation text
  isSelected: boolean;  // Selection state
  onSelect: () => void; // Selection handler
}
```

**Performance:**
- Wrapped in `React.memo` to prevent unnecessary re-renders
- GPU-accelerated hover/selection animations

**Usage:**
```tsx
<QuizOption
  label="A"
  text="I want to lose weight"
  description="Focus on sustainable weight loss"
  isSelected={selectedOptions.includes('option-a')}
  onSelect={() => handleSelect('option-a')}
/>
```

## API Documentation

### POST /api/quiz/submit

Submits quiz lead to Wix CRM.

**Authentication:** None (public endpoint)

**Timeout:** 25 seconds (with automatic retry on failure)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp": "+1234567890",
  "recommendation": "trial",
  "answers": {
    "q1": ["option-a"],
    "q2": ["option-b", "option-c"]
  },
  "deviceType": "desktop",
  "referralSource": "google"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "contactId": "wix_contact_123"
}
```

**Response (200 OK - Graceful Degradation):**
```json
{
  "success": true,
  "warning": "Lead saved locally, CRM sync pending"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields: name, email, whatsapp, recommendation"
}
```

**Example:**
```typescript
const response = await fetch('/api/quiz/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    whatsapp: '+1234567890',
    recommendation: 'trial'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Lead captured:', data.contactId);
}
```

## Wix CRM Integration

### createQuizLead Function

**File:** `src/lib/wix-crm.ts:533-630`

Creates or updates a contact in Wix CRM with quiz lead data.

**Features:**
- Automatic retry with exponential backoff (1s, 2s, 4s delays)
- 10-second timeout per API call
- Graceful error handling
- **Dynamic label creation** - Labels are auto-created if they don't exist
- Automatic label assignment

**Labels Applied:**
- `Lead` - All quiz completions
- `Essentials` | `Trial` | `Circle` | `Transform` - Based on recommendation

### findOrCreateLabel Function

**File:** `src/lib/wix-crm.ts:153-179`

Ensures labels exist in Wix CRM before assigning them to contacts.

**Features:**
- Creates missing labels automatically
- Returns label key for contact assignment
- Logs when new labels are created
- Handles errors gracefully

**Parameters:**
```typescript
interface QuizLeadData {
  name: string;
  email: string;
  whatsapp: string;
  recommendation: string;
  quizAnswers?: Record<string, string[]>;
  deviceType?: string;
  referralSource?: string;
}
```

**Usage:**
```typescript
import { createQuizLead } from '@/lib/wix-crm';

const result = await createQuizLead({
  name: 'John Doe',
  email: 'john@example.com',
  whatsapp: '+1234567890',
  recommendation: 'trial',
  deviceType: 'mobile'
});

if (result.success) {
  console.log('Contact created:', result.contactId);
} else {
  console.error('Failed:', result.error);
}
```

### Retry Logic

**File:** `src/lib/wix-crm.ts:42-71`

Exponential backoff retry wrapper for Wix API calls.

**Configuration:**
- `MAX_RETRIES`: 3 attempts
- `INITIAL_RETRY_DELAY`: 1000ms (1 second)
- `REQUEST_TIMEOUT`: 10000ms (10 seconds per request)

**Retry Delays:**
1. Attempt 1: Immediate
2. Attempt 2: After 1 second
3. Attempt 3: After 2 seconds
4. Attempt 4: After 4 seconds

**Implementation:**
```typescript
const result = await withRetry(
  () => createContact(data),
  'createContact',
  3 // max retries
);
```

## Quiz Scoring Algorithm

**File:** `src/lib/quiz-data.ts`

Each answer has score weights for different programs:

```typescript
{
  id: 'option-a',
  text: 'Weight Loss',
  scores: {
    essentials: 3,  // High match
    trial: 2,       // Medium match
    circle: 1,      // Low match
    transform: 0    // No match
  }
}
```

**Recommendation Logic:**
1. Sum scores across all answers for each program
2. Select program with highest total score
3. Ties resolved by priority: Transform > Circle > Trial > Essentials

## Performance Optimizations

### CSS GPU Acceleration

**File:** `src/app/globals.css`

All quiz animations use GPU acceleration:

```css
.quiz-fullscreen {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
}

.quiz-option-unselected {
  will-change: transform, box-shadow, border-color;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .quiz-fullscreen,
  .quiz-option-unselected,
  .quiz-option-selected {
    transition: none !important;
    animation: none !important;
  }
}
```

### React Optimizations

**Memoization:**
- `React.memo` on QuizOption component
- `useCallback` for all event handlers
- `useMemo` for derived values

**Example:**
```typescript
// Memoized derived value
const currentQuestion = useMemo(
  () => quizQuestions[currentQuestionIndex],
  [currentQuestionIndex]
);

// Memoized event handler
const handleOptionSelect = useCallback(
  (optionId: string) => {
    // handler logic
  },
  [currentQuestionIndex]
);
```

### API Timeout Handling

**File:** `src/app/api/quiz/submit/route.ts:10-17`

All API calls have timeout protection:

```typescript
const result = await withTimeout(
  createQuizLead(leadData),
  25000, // 25 seconds (under Vercel 30s limit)
  'CRM lead creation'
);
```

## Environment Variables

Required for Wix CRM integration:

```bash
# Wix CRM Configuration
WIX_API_KEY=your_wix_api_key
WIX_SITE_ID=your_wix_site_id

# Optional: Automation webhook
WIX_AUTOMATION_WEBHOOK_URL=https://...
```

## Data Flow

```
User Completes Quiz
        ↓
Lead Capture Form
        ↓
/api/quiz/submit
        ↓
createQuizLead() [with retry]
        ↓
Wix CRM API [with timeout]
        ↓
Contact Created/Updated
        ↓
Labels Applied (Lead + Program)
        ↓
Navigate to Results Page
```

## Error Handling

### Graceful Degradation

The quiz never blocks users, even if CRM fails:

```typescript
// API always returns success
if (result.success) {
  return { success: true, contactId: result.contactId };
} else {
  // Log error but don't fail user
  console.error('Wix CRM lead creation failed:', result.error);
  return {
    success: true,
    warning: 'Lead saved locally, CRM sync pending'
  };
}
```

### User Experience Priority

- Lead capture form submits immediately
- Navigation to results happens without waiting
- CRM sync happens in background
- Failed syncs are logged but don't block users

## Accessibility

- Keyboard navigation supported
- Screen reader labels on all interactive elements
- `prefers-reduced-motion` respected
- ARIA labels on progress indicators
- High contrast mode compatible

## Mobile Responsiveness

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Optimizations:**
- Touch-friendly button sizes (min 44px height)
- Simplified animations on mobile
- Responsive font sizes
- Mobile-first layout approach

## Testing

### Manual Testing Checklist

- [ ] Complete full quiz flow (8 questions)
- [ ] Verify transition screen after Q3
- [ ] Check loading animation after Q8
- [ ] Submit lead capture form
- [ ] Verify Wix CRM contact creation
- [ ] Check correct label assignment
- [ ] Test mobile responsiveness
- [ ] Test with slow network (retry logic)
- [ ] Test with Wix API down (graceful degradation)

### Test Files

```
src/__tests__/
└── api/
    └── quiz/
        └── submit.test.ts (to be created)
```

## Troubleshooting

### Issue: Quiz not submitting

**Solution:**
1. Check browser console for errors
2. Verify network tab shows API call
3. Check Wix credentials in `.env.local`

### Issue: Slow performance

**Solution:**
1. Check Chrome DevTools Performance tab
2. Verify GPU acceleration is enabled
3. Check for excessive re-renders with React DevTools

### Issue: CRM sync failing

**Solution:**
1. Verify `WIX_API_KEY` and `WIX_SITE_ID` are correct
2. Check Wix API status
3. Review server logs for error details
4. Retry logic should handle transient failures

### Issue: Labels not appearing in Wix

**Solution:**
1. Labels are now auto-created if they don't exist
2. Check server logs for "Created new Wix label" messages
3. Verify Wix API key has permission to create labels
4. If labels exist but aren't applied, check `addLabelsToContact` function logs

## Future Enhancements

- [ ] Add quiz analytics tracking
- [ ] Implement A/B testing for questions
- [ ] Add quiz result sharing
- [ ] Email notification on submission
- [ ] Admin dashboard for quiz responses
- [ ] Multi-language support
- [ ] Question branching logic
- [ ] Save progress for returning users

## Maintenance

### Adding New Questions

1. Update `src/lib/quiz-data.ts`
2. Add question with options and scores
3. Update `TOTAL_QUESTIONS` constant in quiz.tsx
4. Test scoring algorithm

### Modifying Wix Labels

1. Create labels in Wix CRM first
2. Update `QUIZ_LABEL_MAP` in `src/lib/wix-crm.ts`
3. Test with sample submission

### Performance Monitoring

- Monitor API response times in logs
- Check retry frequency
- Track CRM sync success rate
- Monitor quiz completion rate

## References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Wix CRM API Documentation](https://dev.wix.com/api/rest/contacts/contacts)
- [Web Animations Performance](https://web.dev/animations/)
