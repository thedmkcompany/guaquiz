import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionRegistrationLink } from '@/lib/razorpay';
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit';
import { getProgramById } from '@/lib/programs';

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
    const { planId, name, email, phone, programId, paymentMethod } = body;

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

    // Calculate maxAmount based on program price and payment method
    // UPI has government limit of ₹15,000 per transaction
    // Cards/emandate can handle full program price
    const programPrice = program.price;
    const maxAmount = paymentMethod === 'upi'
      ? Math.min(programPrice, 15000)  // Respect UPI government limit
      : programPrice;  // Full amount for cards/emandate

    console.log('[Razorpay Registration] Creating link for program:', {
      programId: program.id,
      programName: program.name,
      programPrice,
      paymentMethod: paymentMethod || 'customer choice',
      calculatedMaxAmount: maxAmount,
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
      notes: {
        program_id: programId || '',
        program_name: program.name,
        program_price: String(programPrice),
        created_at: new Date().toISOString(),
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
