# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 (App Router) quiz funnel for Glow Up Academy — a fitness/wellness brand. Users complete an 8-question quiz, get a personalized program recommendation, and can purchase via Razorpay (primary) or PayU (fallback). Leads are stored in Supabase first, then synced to Wix CRM asynchronously.

## Commands

```bash
npm run dev              # Dev server (Turbopack) at localhost:3000
npm run build            # Production build
npm run lint             # ESLint (flat config, v9)
npm test                 # Vitest single run
npm run test:watch       # Vitest watch mode
npm run test:coverage    # Coverage with v8 provider
npm run test:connections # Integration tests (scripts/test-integrations.js)
npm run upload-cdn       # Upload images to Vercel Blob CDN
```

Run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

### Core Data Flow

```
Quiz → Supabase (immediate, ~50ms) → Wix CRM sync (background, fire-and-forget)
                                    → Cron retry at 6 AM UTC for failures
```

No lead is lost — Supabase is the source of truth. Wix sync failures are retried automatically via `/api/quiz/retry-sync` (Vercel cron in `vercel.json`).

### Payment Flow

```
Results page → Checkout → Create order (Razorpay/PayU)
            → Payment modal → Verify signature (HMAC-SHA256)
            → Store in Supabase → Sync to Wix → Thank you page
```

Razorpay is primary. PayU is fallback. Prices are validated server-side against program definitions in `src/lib/programs.ts`.

### Key Directories

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — React components organized by domain (quiz/, checkout/, results/, landing/, ui/)
- `src/lib/` — Business logic: quiz scoring, program definitions, payment processing, CRM integration, rate limiting, validation
- `src/types/` — TypeScript type definitions (index.ts for core, payment.ts for payments)
- `src/__tests__/` — Test suite (Vitest + happy-dom)
- `docs/` — Integration guides, quiz implementation docs, API reference
- `scripts/` — CDN upload, integration tests, payment flow tests
- `supabase/migrations/` — SQL migration files for quiz_leads table

### Important Files

- `src/lib/quiz-data.ts` — Quiz questions, options, and weighted scoring algorithm
- `src/lib/programs.ts` — All 5 program definitions with pricing, features, Wix/Razorpay plan IDs
- `src/lib/wix-crm.ts` — Wix CRM integration (contacts, labels, pricing plans) with retry/backoff
- `src/lib/razorpay.ts` / `src/lib/payu.ts` — Payment gateway wrappers
- `src/lib/supabase.ts` — Supabase client and helper functions
- `src/lib/payment-api.ts` — Shared payment validation and utilities
- `src/lib/rate-limit.ts` — IP and email-based rate limiting
- `src/lib/validation.ts` — Zod schemas for all inputs
- `src/lib/cdn.ts` — `getCDNUrl()` for Vercel Blob image serving with local fallback
- `src/lib/aisensy.ts` — AISensy WhatsApp messaging (welcome, payment confirmations, reminders)
- `src/lib/seo-config.ts` — Site metadata and SEO configuration
- `src/lib/structured-data.ts` — JSON-LD structured data for pages
- `src/app/globals.css` — Design system: CSS custom properties for brand colors, typography, spacing

## Tech Stack

- **Next.js 16** with App Router and React 19
- **TypeScript 5** (strict mode), path alias `@/*` → `./src/*`
- **Tailwind CSS 4** via `@tailwindcss/postcss` (no tailwind.config.js)
- **Zod 4** for runtime validation
- **Supabase** (PostgreSQL) — single `quiz_leads` table, service role key (server-side only)
- **Razorpay** + **PayU** — dual payment gateways
- **Wix CRM** — lead management with auto-created labels and pricing plan assignment
- **Vercel Blob** — CDN for optimized images
- **Vitest** — unit tests with happy-dom, MSW for API mocking
- **Upstash Redis** — rate limiting backend

## Programs

5 products with different pricing models:

| ID | Price | Type |
|----|-------|------|
| essentials | ₹1,999 | Subscription (monthly) |
| webinar | ₹199 | One-time |
| circle | ₹3,499 | One-time |
| transform-strategy | ₹1,999 | One-time |
| transform | ₹1,20,000 | One-time |

Program definitions are the single source of truth for pricing validation.

## Conventions

- All dates use IST (Indian Standard Time) — see `src/lib/date-utils.ts`
- PII (email, phone, IP) is masked in all logs
- API error responses use standardized format from `src/lib/api-error-handler.ts`
- Rate limits: payment create 10/15min (IP), payment verify 20/15min (IP), payment 5/hr (email), webhooks 100/min
- Admin routes (`/api/admin/*`) use basic auth; cron routes use Bearer token from `CRON_SECRET`
- Webhook handlers verify HMAC-SHA256 signatures and deduplicate via `src/lib/webhook-store.ts`
- Brand fonts: Roca Two (`--font-roca-two`, headlines), Be Vietnam Pro (`--font-be-vietnam`, body), The Seasons (`--font-the-seasons`, accent quotes)
- Brand colors: Forest Green `--color-forest` (#012D26), Wine `--color-wine` (#800000), Gold `--color-gold` (#D4AF37)
- Images: use `getCDNUrl('/images/...')` from `@/lib/cdn` — serves from Vercel Blob CDN with local fallback
- Classname merging: use `cn()` from `@/lib/utils` (clsx + tailwind-merge)

## Environment Variables

Copy `.env.example` to `.env.local`. Key groups: Wix CRM credentials, Razorpay keys, PayU keys, Supabase URL/key, admin credentials, cron secret, GTM IDs. See `.env.example` for the full list (~150 variables including per-program Wix plan IDs).
