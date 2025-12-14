# Quiz Quick Reference Guide

Quick lookup for common quiz-related tasks and configurations.

## Key Files

| File | Purpose |
|------|---------|
| `src/components/quiz/quiz.tsx` | Main quiz component |
| `src/components/quiz/quiz-option.tsx` | Individual option (memoized) |
| `src/lib/quiz-data.ts` | Questions and scoring |
| `src/lib/wix-crm.ts` | Wix CRM integration |
| `src/app/api/quiz/submit/route.ts` | Lead submission endpoint |
| `src/app/globals.css` | Quiz-specific styles |

## Environment Variables

```bash
# Required for Wix CRM integration
WIX_API_KEY=your_api_key_here
WIX_SITE_ID=your_site_id_here

# Optional
WIX_AUTOMATION_WEBHOOK_URL=https://...
```

## Configuration Constants

### Retry Logic
```typescript
// src/lib/wix-crm.ts
MAX_RETRIES = 3              // Number of retry attempts
INITIAL_RETRY_DELAY = 1000   // 1 second base delay
REQUEST_TIMEOUT = 10000      // 10 seconds per request
```

### API Timeout
```typescript
// src/app/api/quiz/submit/route.ts
API_TIMEOUT = 25000          // 25 seconds (under Vercel 30s limit)
```

### Quiz Flow
```typescript
// src/components/quiz/quiz.tsx
TOTAL_QUESTIONS = 8          // Total quiz questions
TRANSITION_AFTER_Q = 3       // Show transition screen after Q3
```

## Wix CRM Labels

Labels are **auto-created** if they don't exist. The following labels are used:

- `Lead` - Applied to all quiz submissions
- `Essentials` - Program recommendation
- `Trial` - Program recommendation
- `Circle` - Program recommendation
- `Transform` - Program recommendation

Labels are dynamically created via `findOrCreateLabel()` function.

## API Endpoints

### POST /api/quiz/submit

**Minimal Request:**
```bash
curl -X POST http://localhost:3000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "whatsapp": "+1234567890",
    "recommendation": "trial"
  }'
```

**Full Request:**
```bash
curl -X POST http://localhost:3000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

## Quiz Screens

1. **intro** - Welcome screen
2. **question** - Question with options (8 times)
3. **transition-after-q3** - Mid-quiz motivation
4. **loading** - Processing animation
5. **lead-capture** - Form for name/email/WhatsApp
6. **→ Navigate to results page**

## Scoring Algorithm

Each answer has score weights:
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

**Recommendation:** Highest total score wins

## CSS Classes

### Quiz Container
```css
.quiz-fullscreen          /* Full-screen overlay */
.quiz-option-selected     /* Selected option style */
.quiz-option-unselected   /* Unselected option style */
```

### Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  /* Animations disabled for users who prefer reduced motion */
}
```

## Common Tasks

### Add a New Question

1. Edit `src/lib/quiz-data.ts`
2. Add question object with id, text, subtext, options
3. Add scores to each option
4. Update `TOTAL_QUESTIONS` in `quiz.tsx`
5. Test scoring algorithm

### Change Wix Labels

1. Labels are auto-created, no manual setup needed
2. Update program display name capitalization in `createQuizLead` function
3. Test with sample submission - check logs for "Created new Wix label"

### Modify Retry Configuration

Edit `src/lib/wix-crm.ts`:
```typescript
const MAX_RETRIES = 5;              // Change retry count
const INITIAL_RETRY_DELAY = 2000;   // Change base delay
const REQUEST_TIMEOUT = 15000;      // Change timeout
```

### Add Analytics Tracking

In `src/components/quiz/quiz.tsx`, add tracking to handlers:
```typescript
const handleOptionSelect = useCallback((optionId: string) => {
  // Track answer
  analytics.track('quiz_answer_selected', {
    questionId: currentQuestion.id,
    optionId,
  });

  // ... existing code
}, [currentQuestionIndex]);
```

## Performance Optimizations

### React Memoization
```typescript
// Memoized component
export const QuizOption = memo(function QuizOption(props) { ... });

// Memoized callback
const handleClick = useCallback(() => { ... }, [deps]);

// Memoized value
const value = useMemo(() => expensiveComputation(), [deps]);
```

### CSS GPU Acceleration
```css
.element {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform, opacity;
}
```

## Debugging

### Check Wix CRM Connection
```typescript
import { isWixConfigured } from '@/lib/wix-crm';

if (!isWixConfigured()) {
  console.error('Wix not configured!');
}
```

### Monitor API Performance
```typescript
// Already implemented in route.ts
console.log(`Quiz submit completed in ${duration}ms`);
```

### Test Retry Logic
```bash
# Temporarily set invalid API key to trigger retries
WIX_API_KEY=invalid npm run dev
```

## Browser DevTools

### Performance Tab
1. Record while completing quiz
2. Look for long tasks (>50ms)
3. Check animation frame rate (60fps target)

### Network Tab
1. Monitor `/api/quiz/submit` call
2. Check response time (<1s ideal)
3. Verify retry attempts in console

### React DevTools
1. Enable "Highlight updates"
2. Check for excessive re-renders
3. Verify memo optimizations working

## Testing Checklist

- [ ] Complete full quiz (8 questions)
- [ ] Verify transition after Q3
- [ ] Check loading animation
- [ ] Submit lead capture form
- [ ] Verify Wix contact created
- [ ] Check correct labels applied
- [ ] Test on mobile device
- [ ] Test with slow network (Chrome DevTools)
- [ ] Test with Wix API disabled (graceful degradation)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Quiz won't submit | Check console, verify Wix env vars |
| Slow performance | Check Chrome Performance tab |
| Labels not in Wix | Check API key has label creation permission |
| Retry logic not working | Check server logs for error details |
| Timeout errors | Increase API_TIMEOUT or REQUEST_TIMEOUT |

## File Sizes

Keep bundle size small:
- Quiz component: ~15KB
- Quiz data: ~5KB
- Wix CRM lib: ~8KB

Check with:
```bash
npm run build
# Check route sizes in output
```

## TypeScript Types

### QuizLeadData
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

### QuizQuestion
```typescript
interface QuizQuestion {
  id: string;
  text: string;
  subtext?: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
}
```

## Next Steps

- [ ] Add analytics tracking
- [ ] Implement A/B testing
- [ ] Add email notifications
- [ ] Create admin dashboard
- [ ] Add multi-language support
