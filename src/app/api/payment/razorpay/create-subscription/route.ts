import { NextRequest, NextResponse } from 'next/server';
import { createSubscription, getPublicKey } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      planId, // Razorpay Plan ID (must be created in Razorpay dashboard or via API)
      programId,
      programName,
      customerEmail,
      customerName,
      customerPhone,
      totalCount, // Total billing cycles
    } = body;

    // Validate required fields
    if (!planId || !programId || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, programId, customerEmail, customerName' },
        { status: 400 }
      );
    }

    // Create subscription
    const subscription = await createSubscription({
      planId,
      totalCount: totalCount || 12, // Default 12 billing cycles
      customerNotify: true,
      notes: {
        programId,
        programName: programName || programId,
        customerEmail,
        customerName,
        customerPhone: customerPhone || '',
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      planId: subscription.plan_id,
      status: subscription.status,
      shortUrl: subscription.short_url, // Razorpay hosted checkout URL
      keyId: getPublicKey(),
    });
  } catch (error) {
    console.error('Razorpay create subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
