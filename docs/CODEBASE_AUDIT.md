# Codebase Audit Report: DMK Quiz Application

**Date:** Tuesday, 16 December 2025
**Scope:** Architecture, Backend Integrations (Wix, Razorpay), Security, and Code Quality.

---

## 1. Architecture Overview
The application is a modern **Next.js (App Router)** project built with performance and reliability in mind. It uses a **Hybrid Architecture**:

*   **Frontend**: React Server Components (RSC) for static content and Client Components for interactive features (Quiz).
*   **Backend**: Next.js API Routes act as the orchestration layer between the client, database, and external services.
*   **Database**: **Supabase** is the primary source of truth for leads and payment status.
*   **Integrations**:
    *   **Wix CRM**: Secondary system of record for marketing and customer management.
    *   **Razorpay**: Payment gateway for one-time and subscription payments.

---

## 2. Key Components Analysis

### A. Quiz Engine (`src/components/quiz/quiz.tsx`)
*   **State Management**: Efficient use of local state with `localStorage` persistence to prevent data loss on browser refresh.
*   **User Experience**: Polished transitions and loading states.
*   **Data Flow**: Submits data to `/api/quiz/submit` and gracefully handles failures (user is redirected to results even if CRM sync fails).

### B. Lead Submission & Sync (`src/app/api/quiz/submit/route.ts`)
*   **Reliability Pattern**: Implements a "Supabase First" strategy.
    1.  **Write to Supabase**: Guaranteed persistence.
    2.  **Async Sync to Wix**: Fire-and-forget background process using `waitUntil` (or promise floating).
    3.  **Status Update**: Updates Supabase with the sync result (`synced` / `failed`).
*   **Resilience**: This pattern ensures no leads are lost during Wix downtime or API timeouts.

### C. Payment & Webhooks (`src/lib/razorpay.ts`, `src/app/api/webhooks/razorpay/route.ts`)
*   **Security**: Verifies webhook signatures to prevent replay and spoofing attacks.
*   **Lifecycle Management**: Handles complex subscription states (`active`, `halted`, `cancelled`, `completed`) and synchronizes them with Wix orders (pausing/resuming/cancelling Wix plans accordingly).
*   **Deduplication**: Checks `x-razorpay-event-id` to prevent processing duplicate webhook events.

### D. Wix Integration (`src/lib/wix-crm.ts`)
*   **Robustness**: Includes retry logic with exponential backoff for API calls.
*   **Optimization**: Caches Wix labels in memory to reduce API calls.
*   **Edge Case Handling**: Explicitly handles race conditions (e.g., contact already exists) and API quirks (lowercase field keys).

---

## 3. Security & Code Quality

### Security
*   **Rate Limiting**: Implemented in `src/lib/rate-limit.ts` using a sliding window algorithm.
    *   *Note: Currently in-memory, which is not shared across serverless function instances.*
*   **Validation**: Input validation using `zod` and custom helpers in `src/lib/validation.ts`.
*   **PII Protection**: Helper functions to mask email/phone in logs.

### Code Quality
*   **TypeScript**: Strong typing throughout, though dependent on manual generation for Supabase types.
*   **Modularity**: Excellent separation of concerns. Logic is well-encapsulated in `src/lib`.
*   **Comments**: High-quality documentation comments (JSDoc) explaining *why* decisions were made.

---

## 4. Recommendations for Improvement

| Priority | Category | Recommendation | Reasoning |
| :--- | :--- | :--- | :--- |
| **High** | **Scalability** | **Migrate Rate Limiting to Redis** | The current in-memory rate limiter is per-instance. On Vercel, this means limits reset frequently and aren't shared, making them ineffective against distributed attacks. |
| **Medium** | **DevOps** | **Automate Type Generation** | Add a pre-commit hook or CI step to run `npm run gen-types`. Relying on manual updates risks type definitions drifting from the database schema. |
| **Medium** | **Observability** | **Centralized Error Tracking** | Replace `console.error` with a service like Sentry. This is critical for catching silent failures in background sync jobs. |
| **Low** | **Maintainability** | **Centralized Config** | Move hardcoded values (retry counts, timeouts, cache TTLs) from individual files to a central `src/config.ts` or environment variables. |

---

## 5. Conclusion
The codebase is healthy, professional, and production-ready for a single-instance or small-scale deployment. The integration logic is particularly impressive in its handling of failure scenarios. The primary area for future investment is moving shared state (rate limits) to a persistent store like Redis.
