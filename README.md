# DMK Quiz - Glow Up Academy

A Next.js 16 full-stack application that powers an AI-driven quiz funnel for personalized transformation program recommendations, with integrated payment processing and CRM synchronization.

## Features

- **Smart Quiz Engine** - 8-question assessment with weighted scoring algorithm
- **Program Recommendations** - Personalized suggestions based on goals, budget, and timeline
- **Dual Payment Gateways** - Razorpay (primary) and PayU (fallback) integration
- **CRM Integration** - Automatic lead sync to Wix CRM with retry mechanism
- **Lead Persistence** - Supabase storage with fire-and-forget sync pattern
- **Rate Limiting** - IP and email-based protection against abuse
- **Security** - Price validation, signature verification, PII masking

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | Supabase (PostgreSQL) |
| Payments | Razorpay, PayU |
| CRM | Wix |
| Validation | Zod |
| Testing | Vitest, Playwright |

## Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/dmk-quiz-updated.git
cd dmk-quiz-updated

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Development

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm test         # Run unit tests
npm run test:e2e # Run E2E tests
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── quiz/          # Quiz submission & retry sync
│   │   ├── payment/       # Razorpay & PayU endpoints
│   │   ├── webhooks/      # Payment webhook handlers
│   │   ├── admin/         # Admin dashboard endpoints
│   │   └── health/        # Health check endpoint
│   ├── quiz/              # Quiz page
│   ├── results/[slug]/    # Dynamic results pages
│   ├── checkout/          # Checkout & success pages
│   └── ...                # Other pages
├── components/            # React components
│   ├── quiz/              # Quiz UI components
│   ├── checkout/          # Payment components
│   ├── results/           # Results page components
│   ├── landing/           # Landing page components
│   └── ui/                # Shared UI components
├── lib/                   # Core business logic
│   ├── quiz-data.ts       # Quiz questions & scoring
│   ├── programs.ts        # Program definitions & pricing
│   ├── payment-api.ts     # Payment validation & helpers
│   ├── wix-crm.ts         # Wix CRM integration
│   ├── razorpay.ts        # Razorpay SDK wrapper
│   ├── rate-limit.ts      # Rate limiting utilities
│   ├── supabase.ts        # Database client
│   └── lead-storage.ts    # Client-side storage
├── types/                 # TypeScript definitions
│   ├── index.ts           # Core types
│   └── payment.ts         # Payment types
└── __tests__/             # Test suite
```

## Environment Variables

Create a `.env.local` file with the following:

```bash
# Wix CRM
WIX_API_KEY=your_wix_api_key
WIX_SITE_ID=your_wix_site_id
WIX_PLAN_ID_ESSENTIALS=your_plan_id
WIX_PLAN_ID_WEBINAR=your_plan_id
WIX_PLAN_ID_CIRCLE=your_plan_id
WIX_PLAN_ID_TRANSFORM=your_plan_id

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# PayU (Optional - Fallback)
PAYU_MERCHANT_KEY=your_merchant_key
PAYU_MERCHANT_SALT=your_salt

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Dashboard
ADMIN_USER=admin
ADMIN_PASSWORD=your_secure_password

# Cron Jobs
CRON_SECRET=your_cron_secret
```

See [.env.example](.env.example) for the complete list.

## Programs

| Program | Price | Description |
|---------|-------|-------------|
| Essentials | ₹2,499 | Self-paced entry-level program |
| Webinar | ₹499 | Low-commitment taster experience |
| Circle | ₹4,499 | Community-driven group coaching |
| Transform Strategy | ₹9,999 | 1:1 strategy session (credited to Transform) |
| Transform | ₹1,99,999 | High-ticket 1:1 transformation |

## API Routes

### Quiz

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/quiz/submit` | POST | Submit quiz answers and lead data |
| `/api/quiz/retry-sync` | POST | Retry failed Wix CRM syncs (cron) |

### Payments

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payment/razorpay/create-order` | POST | Create Razorpay payment order |
| `/api/payment/razorpay/create-subscription` | POST | Create recurring subscription |
| `/api/payment/razorpay/verify` | POST | Verify payment signature |
| `/api/payment/payu/initiate` | POST | Initiate PayU payment |
| `/api/payment/payu/callback` | POST | Handle PayU callback |

### Webhooks

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/razorpay` | POST | Razorpay payment events |
| `/api/webhooks/payu` | POST | PayU payment callbacks |

### Admin

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/sync-status` | GET | View lead sync status |
| `/api/health` | GET | Health check |

## Quiz Scoring Algorithm

The quiz uses a weighted scoring system:

1. Each answer adds points to program scores (essentials, webinar, circle, transform)
2. Edge cases are handled:
   - High budget + low time → disqualify Transform
   - Circle/Webinar tie + "started/stopped" history → favor Webinar
3. Tie-breaker priority: transform > webinar > circle > essentials
4. Negative scores capped at 0

See [Quiz Implementation Guide](./docs/QUIZ-IMPLEMENTATION.md) for details.

## Architecture Patterns

### Fire-and-Forget Lead Sync

```
Quiz Submit → Store in Supabase (immediate)
           → Async Wix sync (background)
           → Cron retries failures
```

Benefits:
- User sees instant response (~50ms vs 3-8s)
- No leads lost even if Wix is down
- Automatic retry with exponential backoff

### Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| Payment create (IP) | 10 | 15 min |
| Payment verify (IP) | 20 | 15 min |
| Payment (email) | 5 | 1 hour |
| Webhooks | 100 | 1 min |

### Security

- Price validation against program definitions
- HMAC-SHA256 signature verification
- PII masking in logs (email, IP, phone)
- Environment variable secrets
- Admin routes protected with basic auth

## Documentation

- [Quiz Implementation Guide](./docs/QUIZ-IMPLEMENTATION.md) - Comprehensive quiz docs
- [Quiz Quick Reference](./docs/QUIZ-QUICK-REFERENCE.md) - Quick lookup
- [Integration Overview](./docs/integration/) - Payment & CRM integration

### Integration Guides

- [Wix Setup](./docs/integration/01-WIX-SETUP.md)
- [Razorpay Setup](./docs/integration/02-RAZORPAY-SETUP.md)
- [PayU Setup](./docs/integration/03-PAYUMONEY-SETUP.md)
- [Environment Variables](./docs/integration/05-ENVIRONMENT-VARIABLES.md)
- [Testing Checklist](./docs/integration/06-TESTING-CHECKLIST.md)

## Testing

```bash
# Unit tests
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage

# E2E tests
npm run test:e2e      # Headless
npm run test:e2e:ui   # With UI
```

## Deployment

Optimized for Vercel deployment:

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy (auto-deploys on push to main)

```bash
# Manual deployment
vercel --prod
```

## Common Tasks

### Add a new quiz question

Edit `src/lib/quiz-data.ts`:

```typescript
{
  id: "q9",
  question: "Your question here?",
  options: [
    {
      id: "q9-a",
      text: "Option A",
      scores: { essentials: 5, webinar: 0, circle: 0, transform: 0 },
    },
    // ...
  ],
}
```

### Change program pricing

Edit `src/lib/programs.ts`:

```typescript
{
  id: "circle",
  price: 4999, // New price
  // ...
}
```

### Add custom Wix fields

1. Create field in Wix CRM dashboard
2. Add to `createContact()` in `src/lib/wix-crm.ts`

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Run `npm run lint && npm test`
4. Submit PR

## License

MIT

---

Built with Next.js, deployed on Vercel.
