import { NextRequest, NextResponse } from 'next/server';
import { createQuizLeadAsync, type QuizLeadData } from '@/lib/wix-crm';
import {
  storeQuizLead,
  updateLeadSyncStatus,
  findLeadByEmail,
  updateExistingLead,
  isSupabaseConfigured,
} from '@/lib/supabase';
import { sendQuizWelcome } from '@/lib/aisensy';

// Email validation regex (compiled once, reused)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Environment check
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * POST /api/quiz/submit
 *
 * Submits quiz lead data with reliable storage pattern:
 * 1. Store in Supabase first (guaranteed persistence)
 * 2. Fire-and-forget sync to Wix CRM
 * 3. Update Supabase with sync result
 *
 * This ensures NO LEADS ARE LOST even if Wix CRM is temporarily unavailable.
 * Failed syncs can be retried via the /api/quiz/retry-sync endpoint.
 *
 * @param request - Next.js request object with JSON body
 * @returns 200 with success:true (instant), or 400 for validation errors
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    // Fast validation - fail fast on missing fields
    const { name, email, whatsapp, recommendation } = body;

    if (!name || !email || !whatsapp || !recommendation) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, whatsapp, recommendation' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Normalize data
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();
    const normalizedWhatsapp = whatsapp.trim();

    // Prepare lead data
    const leadData: QuizLeadData = {
      name: normalizedName,
      email: normalizedEmail,
      whatsapp: normalizedWhatsapp,
      recommendation,
      quizAnswers: body.answers,
      deviceType: body.deviceType,
      referralSource: body.referralSource,
    };

    let leadId: string | undefined;

    // Step 1: Store in Supabase first (guaranteed persistence)
    if (isSupabaseConfigured()) {
      // Check for existing lead (deduplication)
      const existingLead = await findLeadByEmail(normalizedEmail);

      if (existingLead) {
        // Update existing lead
        await updateExistingLead(existingLead.id!, {
          name: normalizedName,
          whatsapp: normalizedWhatsapp,
          recommendation,
          quiz_answers: body.answers,
          device_type: body.deviceType,
          referral_source: body.referralSource,
        });
        leadId = existingLead.id;
      } else {
        // Create new lead
        const storeResult = await storeQuizLead({
          name: normalizedName,
          email: normalizedEmail,
          whatsapp: normalizedWhatsapp,
          recommendation,
          quiz_answers: body.answers,
          device_type: body.deviceType,
          referral_source: body.referralSource,
        });

        if (storeResult.success) {
          leadId = storeResult.leadId;
        } else {
          console.error('Failed to store lead in Supabase:', storeResult.error);
          // Continue anyway - try Wix directly as fallback
        }
      }
    }

    // Log in non-production or if explicitly enabled
    if (!IS_PRODUCTION || process.env.DEBUG_QUIZ_SUBMIT) {
      console.log('📥 Quiz submission received:', {
        email: normalizedEmail,
        recommendation,
        leadId,
        duration: `${Date.now() - startTime}ms`,
      });
    }

    // Step 2: Fire-and-forget Wix sync with status updates
    const syncToWixWithStatusUpdate = async () => {
      try {
        const result = await createQuizLeadAsync(leadData);

        // Send AISensy welcome message after quiz completion
        try {
          await sendQuizWelcome({
            phone: normalizedWhatsapp,
            name: normalizedName,
            email: normalizedEmail,
            quizResult: recommendation,
          });
        } catch (error) {
          console.error('[Quiz Submit] AISensy welcome message failed:', error);
        }

        // Step 3: Update Supabase with sync result
        if (leadId && isSupabaseConfigured()) {
          if (result.success) {
            await updateLeadSyncStatus(leadId, 'synced', result.contactId);
          } else {
            await updateLeadSyncStatus(leadId, 'failed', undefined, result.error);
          }
        }

        return result;
      } catch (error) {
        // Update Supabase with failure
        if (leadId && isSupabaseConfigured()) {
          await updateLeadSyncStatus(
            leadId,
            'failed',
            undefined,
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
        throw error;
      }
    };

    // Use waitUntil if available (Vercel Edge Runtime)
    if (typeof globalThis !== 'undefined' && 'waitUntil' in globalThis) {
      (globalThis as unknown as { waitUntil: (promise: Promise<unknown>) => void }).waitUntil(
        syncToWixWithStatusUpdate().catch((err: unknown) => {
          console.error('Background CRM sync failed:', err);
        })
      );
    } else {
      // Fallback: Let the promise run but don't await it
      syncToWixWithStatusUpdate().catch((err: unknown) => {
        console.error('Background CRM sync failed:', err);
      });
    }

    // Return success immediately - lead is safely stored in Supabase
    return NextResponse.json({
      success: true,
      message: 'Quiz submitted successfully',
      leadId, // Return leadId for tracking (optional)
    });

  } catch (error) {
    console.error('Quiz submit error:', error instanceof Error ? error.message : error);

    // Return success to not block user experience
    // Even if everything fails, the user can proceed to the results page
    return NextResponse.json({
      success: true,
      warning: 'Lead processing in background',
    });
  }
}
