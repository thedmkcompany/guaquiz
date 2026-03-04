import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionRegistrationLink } from '@/lib/razorpay';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit';
import { getProgramById } from '@/lib/programs';
import { planMismatchError } from '@/lib/payment-api';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = await checkRateLimit(
      `subscription-registration:${clientIp}`,
      RATE_LIMITS.PAYMENT_CREATE
    );

    if (!rateLimitCheck.allowed) {
      return rateLimitResponse(rateLimitCheck.resetIn);
    }

    const body = await request.json();
    const { planId, name, email, phone, programId, paymentMethod, callbackUrl } = body;

    // Validation - Required fields
    if (!planId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone validation - Indian format (+91 prefix or 10 digits)
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Must be Indian mobile number.' },
        { status: 400 }
      );
    }

    // Get program details to calculate correct maxAmount
    const program = getProgramById(programId);
    if (!program) {
      console.error('[Razorpay Registration] Invalid program ID:', programId);
      return NextResponse.json(
        { error: 'Invalid program' },
        { status: 400 }
      );
    }

    // Verify planId matches program's configured plan (security: prevent plan substitution)
    if (program.razorpayPlanId && planId !== program.razorpayPlanId) {
      return planMismatchError({
        programId: program.id,
        expectedPlanId: program.razorpayPlanId,
        receivedPlanId: planId,
        clientIP: clientIp,
        email: email,
      });
    }

    // Use program price as the mandate max amount
    // This ensures customers see the actual subscription amount, not a scary high number
    // - Essentials: ₹1,999/month mandate
    // - Circle: ₹3,999 mandate
    // Note: UPI has RBI limit of ₹15,000, but our programs are below this
    const maxAmount = program.price;

    console.log('[Razorpay Registration] Creating link for program:', {
      programId: program.id,
      programName: program.name,
      programPrice: program.price,
      mandateMaxAmount: maxAmount,
      paymentMethod: paymentMethod || 'customer choice',
    });

    // Create registration link
    const registrationLink = await createSubscriptionRegistrationLink({
      planId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      paymentMethod: paymentMethod || undefined, // Let customer choose if not specified
      maxAmount,
      totalCount: 12,
      callbackUrl: callbackUrl || undefined,
      notes: {
        programId: programId || '',
        programName: program.name,
        customerEmail: email,
        customerName: name,
        customerPhone: cleanPhone,
        programPrice: String(program.price),
      },
    });

    return NextResponse.json({
      success: true,
      registrationLinkId: registrationLink.id,
      shortUrl: registrationLink.short_url,
      status: registrationLink.status,
      expiresAt: registrationLink.expire_by,
    });

  } catch (error) {
    console.error('[Razorpay Registration] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create registration link' },
      { status: 500 }
    );
  }
}
