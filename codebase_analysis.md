# Comprehensive Codebase Analysis: Glow Up Academy Quiz Funnel

**Audit Date**: 2026-02-26
**Auditors**: Security Engineer, Performance Engineer, Refactoring Expert, System Architect

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Detailed Directory Structure Analysis](#2-detailed-directory-structure-analysis)
3. [File-by-File Breakdown](#3-file-by-file-breakdown)
4. [API Endpoints Analysis](#4-api-endpoints-analysis)
5. [Architecture Deep Dive](#5-architecture-deep-dive)
6. [Environment & Setup Analysis](#6-environment--setup-analysis)
7. [Technology Stack Breakdown](#7-technology-stack-breakdown)
8. [Visual Architecture Diagram](#8-visual-architecture-diagram)
9. [Security Audit](#9-security-audit)
10. [Performance Audit](#10-performance-audit)
11. [Code Quality Audit](#11-code-quality-audit)
12. [Infrastructure & DevOps Audit](#12-infrastructure--devops-audit)
13. [Key Insights & Recommendations](#13-key-insights--recommendations)

---

## 1. Project Overview

**Project Type**: Full-stack Next.js web application — a quiz-driven sales funnel

**Description**: Glow Up Academy is a fitness/wellness brand. Users complete an 8-question quiz, receive a personalized program recommendation (from 5 products), and can purchase via Razorpay (primary) or PayU (fallback). Leads are stored in Supabase immediately, then synced to Wix CRM asynchronously.

**Architecture Pattern**: Monolithic Next.js App Router application with serverless API routes, external service integrations (Supabase, Wix CRM, Razorpay, PayU, Upstash Redis, Vercel Blob CDN), and a cron-based retry system.

**Languages**: TypeScript 5 (strict mode), CSS (Tailwind CSS 4), SQL (Supabase migrations)

**Programs/Products**:

| ID | Price | Type |
|----|-------|------|
| essentials | ₹2,499/mo | Subscription |
| webinar | ₹499 | One-time |
| circle | ₹4,499 | One-time |
| transform-strategy | ₹9,999 | One-time |
| transform | ₹1,99,999 | One-time |

---

## 2. Detailed Directory Structure Analysis

```
guaquiz/
├── .claude/              # Claude Code agent configs and custom commands
│   ├── agents/           # Specialized agent definitions (12 agents)
│   └── commands/         # Custom slash commands (api/, misc/, supabase/, ui/)
├── .github/workflows/    # GitHub Actions (retry-sync cron only)
├── docs/                 # Documentation (integration guides, audit reports)
│   ├── integration/      # Step-by-step setup guides (Wix, Razorpay, PayU, etc.)
│   └── legal/            # Legal page content (privacy, terms, refund)
├── public/               # Static assets
│   ├── brand-logos/      # ~30 partner/client logos
│   ├── fonts/            # Brand fonts (Roca Two, Be Vietnam Pro, The Seasons)
│   └── images/           # Product images organized by program (circle/, DMK/, transform/)
├── scripts/              # Utility scripts (CDN upload, integration tests, payment tests)
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   │   ├── about/        # About page
│   │   ├── admin/        # Admin dashboard (sync status)
│   │   ├── api/          # API routes (payment, quiz, webhooks, health, admin)
│   │   ├── book-call/    # Calendly booking page
│   │   ├── checkout/     # Checkout flow (main, success, failed)
│   │   ├── circle/       # Circle program landing page
│   │   ├── contact/      # Contact page
│   │   ├── privacy/      # Privacy policy
│   │   ├── programs/     # All programs listing
│   │   ├── quiz/         # Quiz page
│   │   ├── refund/       # Refund policy
│   │   ├── results/[slug]/ # Dynamic result pages per program
│   │   ├── terms/        # Terms of service
│   │   └── transform/    # Transform program landing page
│   ├── components/       # React components
│   │   ├── analytics/    # Google Tag Manager
│   │   ├── checkout/     # Payment components (Razorpay, PayU, thank-you pages)
│   │   ├── landing/      # Landing page primitives (CTA, sections, stats)
│   │   ├── quiz/         # Quiz UI (quiz.tsx, quiz-option.tsx)
│   │   ├── results/      # Result page components (cards, timeline, FAQ)
│   │   ├── seo/          # Structured data / JSON-LD
│   │   ├── support/      # Calendly embed, WhatsApp button
│   │   └── ui/           # Shared UI components (header, footer, button, etc.)
│   ├── lib/              # Business logic and utilities (~22 modules)
│   └── types/            # TypeScript type definitions
└── supabase/migrations/  # SQL migrations for quiz_leads table (5 files)
```

### Key Directory Relationships

- `src/app/quiz/` → `src/components/quiz/` → `src/lib/quiz-data.ts` (scoring) → `src/lib/programs.ts` (recommendations)
- `src/app/results/[slug]/` → `src/lib/results-data.ts` + `src/lib/lead-storage.ts` (client-side state)
- `src/app/checkout/` → `src/components/checkout/` → `src/app/api/payment/` → `src/lib/razorpay.ts` / `src/lib/payu.ts`
- `src/app/api/quiz/submit/` → `src/lib/supabase.ts` → `src/lib/wix-crm.ts` (async sync)
- `src/app/api/webhooks/` → `src/lib/webhook-store.ts` (dedup) + `src/lib/supabase.ts` (update)

---

## 3. File-by-File Breakdown

### Core Application Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout: fonts, GTM, SpeedInsights, metadata |
| `src/app/page.tsx` | Landing page (homepage) |
| `src/app/quiz/page.tsx` | Quiz wrapper page |
| `src/app/results/[slug]/page.tsx` | Dynamic results with `generateStaticParams` |
| `src/app/checkout/checkout-client.tsx` | Unified checkout flow for all programs |
| `src/app/circle/page.tsx` | Circle program landing (~800 lines) |
| `src/app/transform/page.tsx` | Transform program landing (~700 lines) |

### Business Logic (src/lib/)

| File | Purpose |
|------|---------|
| `quiz-data.ts` | Quiz questions, options, weighted scoring algorithm |
| `programs.ts` | 5 program definitions (pricing, features, Wix/Razorpay IDs) |
| `results-data.ts` | Content data for result pages |
| `supabase.ts` | Supabase client, CRUD for quiz_leads |
| `wix-crm.ts` | Wix CRM integration (contacts, labels, pricing plans) with retry/backoff |
| `razorpay.ts` | Razorpay SDK wrapper (orders, subscriptions, verification) |
| `payu.ts` | PayU integration (hash generation, verification) |
| `payment-api.ts` | Shared payment validation, Zod schemas, rate limiting wrapper |
| `rate-limit.ts` | Upstash Redis rate limiter (IP + email based) |
| `webhook-store.ts` | Redis-based webhook deduplication |
| `validation.ts` | Zod schemas, PII masking utilities |
| `lead-storage.ts` | Client-side localStorage for quiz responses |
| `date-utils.ts` | IST date calculations for program start dates |
| `cdn.ts` | Vercel Blob CDN URL mapping with local fallback |
| `api-error-handler.ts` | Centralized error classes and response helpers |
| `seo-config.ts` | SEO metadata for all pages |
| `structured-data.ts` | JSON-LD structured data generators |
| `design-tokens.ts` | Brand spacing/color tokens (unused) |
| `constants.ts` | API error codes, HTTP status, limits (unused) |
| `rate-limit-middleware.ts` | Rate limiting middleware (unused) |
| `aisensy.ts` | AISensy WhatsApp API integration |

### Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js config: image domains, package optimizations, headers |
| `tsconfig.json` | TypeScript strict mode, path alias `@/*` → `src/*` |
| `eslint.config.mjs` | ESLint flat config (v9) |
| `postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` |
| `vitest.config.ts` | Vitest with happy-dom environment |
| `vercel.json` | Vercel deployment: cron jobs, headers |
| `components.json` | shadcn/ui configuration |

### Database Migrations

| File | Purpose |
|------|---------|
| `001_create_quiz_leads.sql` | Base table: name, email, phone, quiz results, scores |
| `20241215_add_payment_fields.sql` | Payment status, gateway, transaction ID |
| `20241216_add_subscription_tracking.sql` | Subscription ID, plan ID, registration status |
| `20241217_add_program_start_date.sql` | Program start date field |
| `20251217095917_add_start_date_option.sql` | Start date option selection |

---

## 4. API Endpoints Analysis

### Quiz & Lead Management

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/quiz/submit` | POST | None | Store quiz lead in Supabase, sync to Wix, send WhatsApp |
| `/api/quiz/retry-sync` | POST | Bearer (CRON_SECRET) | Retry failed Wix CRM syncs |
| `/api/quiz/retry-sync` | GET | Bearer (CRON_SECRET) | List pending sync leads |

### Payment (Razorpay)

| Endpoint | Method | Auth | Rate Limited | Purpose |
|----------|--------|------|--------------|---------|
| `/api/payment/razorpay/create-order` | POST | None | 10/15min IP, 5/hr email | Create Razorpay order |
| `/api/payment/razorpay/verify` | POST | None | 20/15min IP | Verify payment signature |
| `/api/payment/razorpay/create-subscription` | POST | None | Yes | Create subscription |
| `/api/payment/razorpay/create-subscription-registration` | POST | None | Yes | Create subscription registration link |

### Payment (PayU)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/payment/payu/initiate` | POST | None | Generate PayU payment hash |
| `/api/payment/payu/callback` | POST | Hash verified | Handle PayU redirect callback |

### Webhooks

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/webhooks/razorpay` | POST | HMAC-SHA256 | Process Razorpay events |
| `/api/webhooks/payu` | POST | Auth header + hash | Process PayU events |

### Admin & Monitoring

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/admin/sync-status` | GET | Basic Auth | Dashboard data for sync status |
| `/api/health` | GET | None | System health check |
| `/api/og` | GET | None | Dynamic OG image generation (Edge) |

### Authentication Patterns

- **Payment routes**: Rate limited by IP and email via Upstash Redis
- **Webhook routes**: HMAC-SHA256 signature verification + Redis deduplication
- **Admin routes**: HTTP Basic Auth (`ADMIN_USER`/`ADMIN_PASSWORD`)
- **Cron routes**: Bearer token (`CRON_SECRET`)
- **Quiz submit**: No authentication or rate limiting (vulnerability)

---

## 5. Architecture Deep Dive

### Core Data Flow

```
User → Quiz (8 questions) → Lead Capture Form
                                    │
                                    ▼
                           POST /api/quiz/submit
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              Supabase         Wix CRM sync    AISensy WhatsApp
              (immediate)      (fire-and-forget) (fire-and-forget)
                    │               │
                    │          [on failure]
                    │               ▼
                    │        Retry cron (6 AM UTC)
                    │        Max 5 attempts
                    ▼
              Results Page → Checkout → Payment Gateway
                                           │
                              ┌─────────────┼──────────────┐
                              ▼             ▼              ▼
                         Create Order  Verify Signature  Webhook
                              │             │              │
                              ▼             ▼              ▼
                         Razorpay/PayU  Update Supabase  Sync to Wix
```

### Key Design Patterns

1. **Source of Truth**: Supabase is the canonical data store. Wix CRM sync is secondary.
2. **Fire-and-Forget**: Wix sync and WhatsApp notifications don't block the user flow.
3. **Fail-Open Rate Limiting**: If Redis is down, requests are allowed through (availability over security).
4. **Webhook Deduplication**: Redis-based event ID tracking prevents duplicate processing.
5. **Client-Side State**: Quiz answers stored in localStorage, migrated across sessions via `lead-storage.ts`.
6. **Server-Side Price Validation**: All payment amounts validated against `programs.ts` definitions.

### Module Dependency Graph

```
quiz.tsx ──► quiz-data.ts ──► programs.ts
                                  │
result-page-client.tsx ──► results-data.ts ──► programs.ts
                                                    │
checkout-client.tsx ──────────────────────────► programs.ts
        │                                           │
        ├──► RazorpayCheckout.tsx ──► /api/payment/razorpay/*
        └──► PayUCheckout.tsx ──────► /api/payment/payu/*
                                          │
                                          ├──► razorpay.ts / payu.ts
                                          ├──► payment-api.ts (validation)
                                          ├──► rate-limit.ts (Redis)
                                          └──► supabase.ts ──► wix-crm.ts
```

---

## 6. Environment & Setup Analysis

### Required Environment Variables (~30+ variables)

**Supabase**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
**Razorpay**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, per-program plan IDs
**PayU**: `PAYU_MERCHANT_KEY`, `PAYU_SALT`, `PAYU_WEBHOOK_SECRET`
**Wix CRM**: `WIX_API_KEY`, `WIX_SITE_ID`, `WIX_ACCOUNT_ID`, per-program label/plan IDs
**Admin**: `ADMIN_USER`, `ADMIN_PASSWORD`, `CRON_SECRET`
**Redis**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
**CDN**: `NEXT_PUBLIC_BLOB_BASE_URL`
**Analytics**: GTM container IDs
**AISensy**: WhatsApp API credentials

### Setup Process

```bash
git clone <repo>
cp .env.example .env.local    # Configure all env vars
npm install
npm run dev                    # Turbopack dev server at localhost:3000
```

### Development Workflow

- `npm run dev` — Turbopack dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm test` — Vitest (no tests currently exist)
- Deploy via Vercel (auto-deploy on push to main)

---

## 7. Technology Stack Breakdown

### Runtime & Framework

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16 | App Router, API routes, SSG/SSR |
| React | 19 | UI rendering |
| TypeScript | 5 | Type safety (strict mode) |
| Node.js | 18+ | Server runtime |

### Styling & UI

| Technology | Purpose |
|-----------|---------|
| Tailwind CSS 4 | Utility-first CSS (via `@tailwindcss/postcss`) |
| lucide-react | Icon library |
| class-variance-authority | Component variants |
| tailwind-merge | Conditional class merging |

### Data & Storage

| Technology | Purpose |
|-----------|---------|
| Supabase (PostgreSQL) | Primary data store (quiz_leads table) |
| Upstash Redis | Rate limiting, webhook deduplication |
| Vercel Blob | CDN for optimized images |
| localStorage | Client-side quiz state persistence |

### Payments

| Technology | Purpose |
|-----------|---------|
| Razorpay | Primary payment gateway (orders + subscriptions) |
| PayU | Fallback payment gateway |

### External Services

| Technology | Purpose |
|-----------|---------|
| Wix CRM | Lead management, labels, pricing plans |
| AISensy | WhatsApp message automation |
| Google Tag Manager | Analytics |
| Calendly | Call booking |

### Validation & Security

| Technology | Purpose |
|-----------|---------|
| Zod 4 | Runtime input validation |
| crypto (Node.js) | HMAC-SHA256 for webhook verification |

### Build & Test

| Technology | Purpose |
|-----------|---------|
| Turbopack | Dev server bundler |
| ESLint 9 | Code linting (flat config) |
| Vitest | Test runner (configured, no tests written) |
| happy-dom | Test environment |

### Deployment

| Technology | Purpose |
|-----------|---------|
| Vercel | Hosting, serverless functions, cron jobs |
| GitHub Actions | Supplementary cron (retry-sync) |

---

## 8. Visual Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                            │
│                                                                      │
│  ┌──────────┐   ┌──────────────┐   ┌────────────┐   ┌────────────┐ │
│  │ Quiz Page │──►│ Results Page  │──►│  Checkout  │──►│  Success   │ │
│  │ (quiz.tsx)│   │ (3 variants) │   │  (unified) │   │   Page     │ │
│  └──────────┘   └──────────────┘   └─────┬──────┘   └────────────┘ │
│       │              │                     │                         │
│       │         localStorage          Razorpay SDK                   │
│       │         (lead-storage)        / PayU redirect                │
└───────┼──────────────┼─────────────────────┼─────────────────────────┘
        │              │                     │
════════╪══════════════╪═════════════════════╪═══════════════════════════
        │              │                     │
┌───────▼──────────────▼─────────────────────▼─────────────────────────┐
│                     NEXT.JS API ROUTES (Vercel Serverless)           │
│                                                                      │
│  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────────┐    │
│  │ /api/quiz/  │  │ /api/payment/    │  │ /api/webhooks/       │    │
│  │  submit     │  │  razorpay/*      │  │  razorpay (HMAC)     │    │
│  │  retry-sync │  │  payu/*          │  │  payu (hash + auth)  │    │
│  └──────┬──────┘  └────────┬─────────┘  └──────────┬───────────┘    │
│         │                  │                        │                │
│  ┌──────▼──────────────────▼────────────────────────▼──────────┐    │
│  │                    BUSINESS LOGIC LAYER                      │    │
│  │  quiz-data.ts │ programs.ts │ payment-api.ts │ validation.ts│    │
│  │  date-utils.ts│ razorpay.ts │ payu.ts        │ rate-limit.ts│    │
│  └──────┬──────────────────┬────────────────────────┬──────────┘    │
│         │                  │                        │                │
└─────────┼──────────────────┼────────────────────────┼────────────────┘
          │                  │                        │
══════════╪══════════════════╪════════════════════════╪══════════════════
          │                  │                        │
┌─────────▼──────┐  ┌───────▼────────┐  ┌───────────▼──────────────┐
│   SUPABASE     │  │ UPSTASH REDIS  │  │   EXTERNAL SERVICES      │
│  (PostgreSQL)  │  │                │  │                          │
│  ┌───────────┐ │  │ • Rate limits  │  │ • Razorpay API           │
│  │quiz_leads │ │  │ • Webhook IDs  │  │ • PayU API               │
│  │  table    │ │  │ • Event dedup  │  │ • Wix CRM (async sync)   │
│  └───────────┘ │  │                │  │ • AISensy (WhatsApp)     │
│                │  │                │  │ • Vercel Blob (CDN)      │
└────────────────┘  └────────────────┘  │ • Calendly               │
                                        │ • Google Tag Manager     │
                                        └──────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                        CRON / SCHEDULED JOBS                         │
│                                                                      │
│  Vercel Cron (daily 6 AM UTC) ──► /api/quiz/retry-sync              │
│  GitHub Actions (every 15 min) ──► /api/quiz/retry-sync (redundant) │
│                                                                      │
│  Purpose: Retry failed Wix CRM syncs (max 5 attempts per lead)      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 9. Security Audit

### CRITICAL Findings

#### C1. Rate Limiting Fails Open When Redis Unavailable
**Files**: `src/lib/rate-limit.ts:114-121`, `src/lib/webhook-store.ts:64-68`

Both the rate limiter and webhook deduplication store allow ALL requests through if Redis is unavailable. An attacker who can cause Redis connection failures bypasses all protections — payment endpoint flooding, webhook replay attacks, and unlimited order creation become possible.

**Remediation**: Change to fail-closed for payment-critical endpoints (return 503). Add in-memory fallback for webhook deduplication.

#### C2. PayU Webhook Auth Uses Timing-Vulnerable String Comparison
**File**: `src/lib/payu.ts:122-127`

The `verifyWebhookAuth` function uses plain `===` comparison, leaking the secret via timing side-channel attacks.

**Remediation**: Use `crypto.timingSafeEqual` with Buffer conversion.

#### C3. Admin Auth Credentials Compared Without Timing-Safe Equality
**File**: `src/app/api/admin/sync-status/route.ts:35`

Username and password compared with `===`. Default username is `'admin'`.

**Remediation**: Use `crypto.timingSafeEqual`. Remove default username. Add rate limiting to admin auth.

### HIGH Findings

#### H1. Quiz Submit Endpoint Has No Rate Limiting
**File**: `src/app/api/quiz/submit/route.ts`

No rate limiting means attackers can flood the database, trigger unlimited WhatsApp messages (cost), and overwhelm Wix CRM sync.

**Remediation**: Add IP-based (10/15min) and email-based (3/hr) rate limiting. Consider CAPTCHA.

#### H2. Retry-Sync Endpoint Leaks Unmasked Emails
**File**: `src/app/api/quiz/retry-sync/route.ts:85,94,159-160`

Full email addresses returned in API responses and logged in error messages. The `maskEmail` utility exists but isn't used here.

#### H3. Health Check Exposes Infrastructure Without Auth
**File**: `src/app/api/health/route.ts`

Reveals which payment gateways are configured, Supabase/Wix connection status, `NODE_ENV`, and detailed error messages — all unauthenticated.

#### H4. Missing Security Headers (CSP, X-Frame-Options, HSTS)
**File**: `next.config.ts`

No Content-Security-Policy, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy. Critical for a payment application (clickjacking risk).

#### H5. Customer Email Exposed in URL on Success Page Redirect
**Files**: `src/components/checkout/RazorpayCheckout.tsx:113-118`, `src/app/checkout/success/success-client.tsx:12-13`

Email in URL query string is logged in access logs, visible in browser history, leaked via Referer header.

#### H6. Razorpay Webhook Processes Events Without Event ID
**File**: `src/app/api/webhooks/razorpay/route.ts:56-62`

When `x-razorpay-event-id` header is absent, webhook processes without deduplication — enabling replay attacks.

### MEDIUM Findings

| # | Issue | File |
|---|-------|------|
| M1 | Quiz submit returns `success: true` on complete failure | `api/quiz/submit/route.ts:185-194` |
| M2 | Quiz submit logs full email in non-production | `api/quiz/submit/route.ts:112-119` |
| M3 | PayU callback redirects without origin validation | `api/payment/payu/callback/route.ts:60-68` |
| M4 | Supabase client created with empty credentials | `lib/supabase.ts:5-22` |
| M5 | `dangerouslySetInnerHTML` used in multiple components | `feminine-decorations.tsx:106`, `essentials-result-client.tsx:60` |
| M6 | Admin route loads ALL quiz leads into memory | `api/admin/sync-status/route.ts:59-89` |
| M7 | Cron secret compared without timing-safe equality | `api/quiz/retry-sync/route.ts:20-27` |

### LOW Findings

| # | Issue | File |
|---|-------|------|
| L1 | Receipt IDs use `Math.random()` (not crypto-secure) | `razorpay.ts:317`, `payu.ts:107` |
| L2 | Lead storage uses unencrypted `localStorage` for PII | `lib/lead-storage.ts` |
| L3 | Webhooks return 200 on processing errors (no retry) | `webhooks/razorpay/route.ts:78`, `webhooks/payu/route.ts:98` |
| L4 | `.env.example` contains PayU test credentials | `.env.example:111-112` |

---

## 10. Performance Audit

### HIGH Impact

#### P1. Continuous Body Gradient Animation
**File**: `src/app/globals.css:206-215`

`animation: gradientBG 15s ease infinite` on `<body>` forces continuous GPU compositing on every page. ~1-2ms per-frame cost on mobile.

**Fix**: Remove animation or restrict to hero section only.

#### P2. 80 `backdrop-filter: blur()` Occurrences Across 23 Files
**Files**: Multiple — glass-card, frosted-glass, glass-overlay classes

`backdrop-filter` is one of the most expensive CSS properties, forcing per-frame blur recalculation during scroll. The sticky header uses it on every scroll frame.

**Fix**: Replace header `backdrop-filter` with solid semi-transparent background. Limit `backdrop-filter` to 2-3 prominent elements per page.

#### P3. Circle & Transform Pages Are Entirely `use client` (~800 lines each)
**Files**: `src/app/circle/page.tsx`, `src/app/transform/page.tsx`

100% static content (testimonials, pricing, FAQs) shipped as JavaScript. Cannot be statically generated. Bad FCP, bad SEO.

**Fix**: Extract static content to server component shell. Wrap only interactive elements (FAQ, payment, date selector) as client islands.

#### P4. Result Page Client Components Are Monolithic
**Files**: `src/app/results/[slug]/result-page-client.tsx`, `essentials-result-client.tsx`, `webinar-result-client.tsx`

`generateStaticParams()` correctly creates static routes, but then delegates everything to `use client` components, defeating static generation benefits.

#### P5. LogoLoop.tsx Runs Continuous `requestAnimationFrame` Loop
**File**: `src/components/LogoLoop.tsx` (400 lines)

JS-driven animation using rAF, `ResizeObserver`, manual DOM manipulation. `MobileLogoLoop.tsx` already demonstrates a simpler CSS-only approach.

**Fix**: Replace with CSS-only animation or add IntersectionObserver to pause when off-screen.

#### P6. The Seasons Font Served as .otf Instead of .woff2
**File**: `public/fonts/the-seasons.otf`

OTF is ~40% larger than WOFF2. Plus unused fonts (`BeVietnamPro-Regular.ttf`, `HolidayFree.otf`) ship as static assets.

#### P7. LCP Hero Image Preload URL Hardcoded and Fragile
**File**: `src/app/layout.tsx:67-72`

Hardcoded `/_next/image?url=...&w=640&q=80` only preloads one size variant and breaks if CDN URL changes.

**Fix**: Use `priority` prop on the hero `<Image>` component instead.

### MEDIUM Impact

| # | Issue | File |
|---|-------|------|
| P8 | `use client` on pure presentational components (BenefitCard, PillarCard) | `results/BenefitCard.tsx`, `results/PillarCard.tsx` |
| P9 | lucide-react icons across 20 files (8-16KB JS per page) | Multiple files |
| P10 | Permanent `will-change` in CSS (wastes GPU memory) | `globals.css:778,841,863` |
| P11 | DecorativeBlobs `animate-pulse` + `blur-3xl` continuous repaint | `ui/decorative-blobs.tsx` |
| P12 | Header logo uses `priority` on every page | `ui/header.tsx:83,122` |
| P13 | GTM React wrapper adds unnecessary client JS overhead | `analytics/google-tag-manager.tsx` |

### LOW Impact

| # | Issue | File |
|---|-------|------|
| P14 | Razorpay SDK `lazyOnload` shows "Loading..." on checkout | `checkout/RazorpayCheckout.tsx:248` |
| P15 | `console.log` in production checkout render path | `checkout/checkout-client.tsx:103,112,387,397` |
| P16 | MobileLogoLoop renders 24 Image elements for loop | `MobileLogoLoop.tsx` |

### Priority Remediation (Quick Wins)

1. Remove body gradient animation (1 CSS line)
2. Convert `the-seasons.otf` to `.woff2` (one-time)
3. Remove permanent `will-change` (delete 3 lines)
4. Remove `animate-pulse` from DecorativeBlobs (delete 2 props)
5. Remove `priority` from header logo (delete 2 props)
6. Replace hardcoded LCP preload with `priority` on hero Image (delete 6 lines)
7. Remove `console.log` from checkout-client (delete 4 lines)
8. Replace `backdrop-filter` on sticky header with solid background (1 CSS change)

---

## 11. Code Quality Audit

### TypeScript Issues

| # | Issue | File | Severity |
|---|-------|------|----------|
| T1 | `any` type on Razorpay registration config | `lib/razorpay.ts:141` | Low |
| T2 | Loose `{ [programId: string]: number }` instead of typed union | `types/index.ts:65-67,91`, `lib/quiz-data.ts:319` | Medium |
| T3 | Unchecked type assertions (`as StoredQuizResponse`, `as QuizAnswers`) | `quiz/quiz.tsx:179`, `result-page-client.tsx:45` | Medium |

**Recommendation**: Create `type ProgramId = 'essentials' | 'webinar' | 'circle' | 'transform'` and use `Record<ProgramId, number>` throughout.

### Code Duplication

| # | What's Duplicated | Where | Fix |
|---|-------------------|-------|-----|
| D1 | `formatPrice()` — 3 identical implementations | `programs.ts:269`, `RazorpayCheckout.tsx:90-96`, `PayUCheckout.tsx:63-69` | Import from `programs.ts` |
| D2 | Quiz answer initialization from storage | 3 result page clients | Extract `useQuizAnswers()` hook |
| D3 | Personalized insights section (4 cards) | `result-page-client.tsx:263-321`, `essentials-result-client.tsx:189-269` | Extract `<PersonalizedInsights>` component |
| D4 | FAQ toggle state | 3 result page clients | Extract `useAccordion()` hook or self-managing FAQItem |
| D5 | `migrateLegacyStorage()` called in 5 locations | 5 separate page/component files | Call once in root layout |

### Dead Code (3 Files)

| File | Status | Action |
|------|--------|--------|
| `src/lib/constants.ts` | Defines API_ERRORS, HTTP_STATUS, etc. — **zero imports** | Remove or start using |
| `src/lib/design-tokens.ts` | Defines spacing/color tokens — **zero imports** | Remove (Tailwind handles this) |
| `src/lib/rate-limit-middleware.ts` | Rate limiting middleware — **zero imports** | Remove (superseded by `payment-api.ts`) |

### Duplicate Error Systems

Two independent `errorResponse` functions exist:
- `src/lib/payment-api.ts:176` — supports `details` parameter
- `src/lib/api-error-handler.ts:145` — has the error class hierarchy

**Recommendation**: Consolidate into `api-error-handler.ts`.

### Test Coverage: ZERO

Despite Vitest being configured with `happy-dom`, **no test files exist** in the codebase.

**Priority testing targets**:

| Priority | Module | Why |
|----------|--------|-----|
| P0 | `quiz-data.ts` — `calculateQuizResult` | Core scoring with edge cases (capping, tie-breaking, commitment boost) |
| P0 | `payment-api.ts` — `validatePaymentWithProgram` | Security-critical: prevents price manipulation |
| P0 | `date-utils.ts` — IST date calculations | Time-sensitive edge cases (Monday 5:59 AM vs 6:01 AM IST) |
| P1 | `validation.ts` — `maskEmail`, `maskIP`, `maskPhone` | PII protection correctness |
| P1 | `programs.ts` — `getProgramById`, `formatPrice` | Foundational lookups |
| P2 | `rate-limit.ts` — `checkRateLimit` | Rate limiting correctness (mock Redis) |

### Magic Numbers

| Location | Value | Should Be |
|----------|-------|-----------|
| `quiz-data.ts:356` | `+15` commitment boost, `10` proximity threshold | Named constants |
| `supabase.ts:135` | `.lt('wix_sync_attempts', 5)` | `MAX_WIX_SYNC_RETRIES` constant |
| `RazorpayCheckout.tsx:184` | `'#800000'` brand wine color | Import from design tokens |
| `RazorpayCheckout.tsx:249` | Razorpay SDK URL hardcoded | Named constant |

### Component Architecture Issues

| Issue | Details |
|-------|---------|
| Monolithic result pages | 445-700 lines each; should extract shared sections |
| Monolithic landing pages | Circle (~800 lines), Transform (~700 lines); data mixed with UI |
| Good: Quiz component | Well-structured despite 700 lines; could extract `LeadCaptureForm` |
| Good: Business logic separation | `quiz-data.ts`, `programs.ts`, `date-utils.ts` are clean |

---

## 12. Infrastructure & DevOps Audit

### P0 — CRITICAL

#### I1. No CI/CD Pipeline
**File**: `.github/workflows/retry-sync.yml`

The only GitHub Actions workflow is the retry-sync cron. **No automated lint, test, type-check, or build** runs on pull requests. Broken code can deploy directly to production.

**Fix**: Create `.github/workflows/ci.yml` gating merges on lint + type-check + test + build.

#### I2. No Error Monitoring
No Sentry or equivalent. `api-error-handler.ts` only uses `console.error`. In serverless Vercel, logs are ephemeral — payment failures go undetected until a customer complains.

**Fix**: Integrate Sentry. Instrument `handleAPIError`, payment routes, and retry-sync cron.

#### I3. Missing Security Headers
(Covered in Security Audit H4)

#### I4. PII Leaking in Production Logs
**Files**: `src/lib/supabase.ts:259,479`, `src/app/api/quiz/retry-sync/route.ts:94`, `src/lib/wix-crm.ts:726,732,792,1107,1327`

Raw email and phone numbers logged in plaintext despite `maskEmail`/`maskPhone` utilities existing.

### P1 — HIGH

#### I5. Duplicate Cron Systems
**Vercel cron**: daily at 6 AM UTC. **GitHub Actions**: every 15 minutes (96x/day). These are redundant and can race-condition.

**Fix**: Pick one mechanism. Vercel Cron is simpler for Vercel apps.

#### I6. No Supabase Connection Pooling
**File**: `src/lib/supabase.ts`

Module-level singleton without pooling config. Serverless cold-starts exhaust connection limits under load. Also, `updateLeadSyncStatus` has a read-then-write race condition.

**Fix**: Use Supabase connection pooler URL (port 6543). Use SQL increment for sync attempts.

#### I7. Manual Database Migration Process
**Files**: `supabase/migrations/`

Inconsistent naming conventions (numeric, date, timestamp prefixes). No migration runner — comments say "Run in Supabase SQL Editor."

**Fix**: Use `supabase db push` in deployment pipeline. Standardize timestamp naming.

### P2 — MEDIUM

| # | Issue | Impact |
|---|-------|--------|
| I8 | Rate limiting fail-open with no alerting | Silent security degradation |
| I9 | Health check lacks Redis, Razorpay checks | Incomplete monitoring |
| I10 | CDN paths with spaces, hardcoded at module load | URL encoding issues, build-time baking |
| I11 | No Next.js middleware for global protections | No bot detection, geo restriction, request tracing |

### P3 — LOW

| # | Issue |
|---|-------|
| I12 | No staging environment (preview deploys hit production DB) |
| I13 | No database backup strategy documented |
| I14 | No observability beyond logs (no metrics, traces, dashboards) |
| I15 | Weak disaster recovery (Supabase down = total funnel loss) |

### Disaster Recovery Matrix

| Service | If Down | Current Mitigation | Gap |
|---------|---------|-------------------|-----|
| Supabase | No lead storage, no payments | None | Total funnel failure |
| Wix CRM | Leads not synced | Retry cron (max 5) | Leads abandoned after 5 retries |
| Razorpay | No payments | PayU fallback | Client must manually switch |
| Upstash Redis | No rate limiting, no webhook dedup | Fail-open | Silent security degradation |
| Vercel Blob | Missing images | Local file fallback | Only if local files in build |

---

## 13. Key Insights & Recommendations

### Overall Assessment

The codebase demonstrates **strong architectural decisions** (Supabase as source of truth, async CRM sync, dual payment gateways, server-side price validation) but has significant gaps in **operational infrastructure** (no CI/CD, no monitoring, no tests) and **performance optimization** (excessive client-side JS, continuous animations, missing static generation).

### Top 10 Priority Actions

| # | Action | Category | Effort | Impact |
|---|--------|----------|--------|--------|
| 1 | **Add CI/CD pipeline** (lint, type-check, test, build) | Infrastructure | Medium | Critical |
| 2 | **Add security headers** (CSP, HSTS, X-Frame-Options) | Security | Low | Critical |
| 3 | **Add Sentry error monitoring** | Infrastructure | Medium | Critical |
| 4 | **Add rate limiting to quiz submit** | Security | Low | High |
| 5 | **Use `crypto.timingSafeEqual` for all auth comparisons** | Security | Low | High |
| 6 | **Write unit tests for scoring, payments, dates** | Quality | High | High |
| 7 | **Convert Circle/Transform/Result pages to server+client islands** | Performance | High | High |
| 8 | **Remove body gradient animation and reduce `backdrop-filter`** | Performance | Low | High |
| 9 | **Fix PII leaking in logs** (use existing mask utilities) | Security | Low | Medium |
| 10 | **Remove dead code** (constants.ts, design-tokens.ts, rate-limit-middleware.ts) | Quality | Low | Low |

### Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Architecture** | 8/10 | Sound data flow, good separation of concerns, proper async patterns |
| **Security** | 5/10 | Good payment verification, but fail-open rate limiting, timing attacks, missing headers |
| **Performance** | 4/10 | Continuous animations, monolithic client components, no static generation |
| **Code Quality** | 6/10 | Clean TypeScript, good patterns, but duplication, dead code, no tests |
| **Infrastructure** | 3/10 | No CI/CD, no monitoring, no alerting, manual migrations |
| **Test Coverage** | 0/10 | Zero test files despite Vitest being configured |
| **Documentation** | 7/10 | Good CLAUDE.md, integration docs, but missing operational runbooks |

### Conclusion

The application is well-architected at the code level but under-invested in operational maturity. The highest-ROI improvements are the low-effort security fixes (headers, timing-safe comparisons, quiz rate limiting) and the CI/CD pipeline. Performance improvements (server/client component splitting) require more effort but will significantly improve conversion metrics through faster page loads on the critical path.

---

*Generated by Claude Code superpowers audit — Security Engineer, Performance Engineer, Refactoring Expert, System Architect*
