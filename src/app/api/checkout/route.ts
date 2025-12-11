import { NextRequest, NextResponse } from "next/server";
import { checkout } from "@wix/ecom";
import { createWixClient, WIX_STORES_APP_ID } from "@/lib/wix-client";
import { getProgramById } from "@/lib/programs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { programId } = body;

    if (!programId) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 }
      );
    }

    const program = getProgramById(programId);

    if (!program) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      );
    }

    if (!program.wixProductId) {
      return NextResponse.json(
        { error: "Product not configured in Wix" },
        { status: 400 }
      );
    }

    const wixClient = createWixClient();

    // Create a checkout with the product
    const checkoutResponse = await wixClient.checkout.createCheckout({
      lineItems: [
        {
          catalogReference: {
            catalogItemId: program.wixProductId,
            appId: WIX_STORES_APP_ID,
          },
          quantity: 1,
        },
      ],
      channelType: checkout.ChannelType.OTHER_PLATFORM,
    });

    if (!checkoutResponse._id) {
      return NextResponse.json(
        { error: "Failed to create checkout" },
        { status: 500 }
      );
    }

    // Create redirect session to Wix checkout page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const redirectSession = await wixClient.redirects.createRedirectSession({
      ecomCheckout: {
        checkoutId: checkoutResponse._id,
      },
      callbacks: {
        postFlowUrl: `${baseUrl}/checkout/success`,
        thankYouPageUrl: `${baseUrl}/checkout/success`,
      },
    });

    const redirectUrl = redirectSession.redirectSession?.fullUrl;

    if (!redirectUrl) {
      return NextResponse.json(
        { error: "Failed to create redirect session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: redirectUrl,
      checkoutId: checkoutResponse._id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
