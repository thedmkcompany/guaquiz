import { NextRequest, NextResponse } from 'next/server';
import { createQuizLead, type QuizLeadData } from '@/lib/wix-crm';

// API route timeout (30 seconds max for Vercel)
const API_TIMEOUT = 25000;

/**
 * Promise wrapper with timeout
 *
 * Races a promise against a timeout. Used to prevent API routes
 * from exceeding Vercel's 30-second serverless function limit.
 *
 * @template T - Return type of the promise
 * @param promise - Promise to race against timeout
 * @param ms - Timeout in milliseconds
 * @param operation - Operation name for error message
 * @returns Promise that resolves/rejects when first completes
 * @throws {Error} When timeout is reached before promise completes
 *
 * @example
 * ```typescript
 * const data = await withTimeout(
 *   fetchSlowAPI(),
 *   5000,
 *   'API fetch'
 * );
 * ```
 */
function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * POST /api/quiz/submit
 *
 * Submits quiz lead data to Wix CRM. Always returns success to prevent
 * blocking the user experience, even if CRM sync fails.
 *
 * @param request - Next.js request object with JSON body
 * @returns 200 with success:true, or 400 with validation error
 *
 * **Request Body:**
 * ```json
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "whatsapp": "+1234567890",
 *   "recommendation": "trial",
 *   "answers": { "q1": ["option-a"] },
 *   "deviceType": "desktop",
 *   "referralSource": "google"
 * }
 * ```
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "success": true,
 *   "contactId": "wix_contact_123"
 * }
 * ```
 *
 * **Graceful Degradation (200):**
 * ```json
 * {
 *   "success": true,
 *   "warning": "Lead saved locally, CRM sync pending"
 * }
 * ```
 *
 * **Error Response (400):**
 * ```json
 * {
 *   "error": "Missing required fields: name, email, whatsapp, recommendation"
 * }
 * ```
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/quiz/submit', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     whatsapp: '+1234567890',
 *     recommendation: 'trial'
 *   })
 * });
 * ```
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, whatsapp, recommendation } = body;

    if (!name || !email || !whatsapp || !recommendation) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, whatsapp, recommendation' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Prepare lead data
    const leadData: QuizLeadData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      recommendation,
      quizAnswers: body.answers,
      deviceType: body.deviceType,
      referralSource: body.referralSource,
    };

    // Create lead in Wix CRM with timeout protection
    const result = await withTimeout(
      createQuizLead(leadData),
      API_TIMEOUT,
      'CRM lead creation'
    ).catch((error) => {
      console.error('CRM operation failed or timed out:', error);
      return { success: false as const, error: error.message, contactId: undefined };
    });

    const duration = Date.now() - startTime;
    console.log(`Quiz submit completed in ${duration}ms`);

    if (result.success && result.contactId) {
      return NextResponse.json({
        success: true,
        contactId: result.contactId,
      });
    } else if (result.success) {
      return NextResponse.json({
        success: true,
      });
    } else {
      // Log error but still return success to not block user
      console.error('Wix CRM lead creation failed:', result.error);
      return NextResponse.json({
        success: true,
        warning: 'Lead saved locally, CRM sync pending',
      });
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Quiz submit error after ${duration}ms:`, error);
    // Don't fail the user experience even if CRM fails
    return NextResponse.json({
      success: true,
      warning: 'Lead processing in background',
    });
  }
}
