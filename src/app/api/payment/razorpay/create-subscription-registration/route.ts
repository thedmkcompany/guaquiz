import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionRegistrationLink } from '@/lib/razorpay';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitResult = await rateLimit(identifier, 5, 60000); // 5 requests per minute

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { planId, name, email, phone, programId, paymentMethod } = body;

    // Validation
    if (!planId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create registration link
    const registrationLink = await createSubscriptionRegistrationLink({
      planId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      paymentMethod: paymentMethod || undefined, // Let customer choose if not specified
      maxAmount: 15000, // Safe default, adjust per program if needed
      totalCount: 12,
      notes: {
        program_id: programId || '',
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
