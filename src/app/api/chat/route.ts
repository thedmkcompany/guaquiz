import { NextRequest, NextResponse } from "next/server";
import { matchKnowledgeBase, SITE_KNOWLEDGE_SUMMARY } from "@/lib/chat-knowledge-base";
import { findLeadByEmail } from "@/lib/supabase";
import { checkRateLimit, getClientIP, RATE_LIMITS, rateLimitResponse } from "@/lib/rate-limit";

/** Allow long Claude calls on Vercel (requires appropriate plan for >10s). */
export const maxDuration = 60;

function isPaidContentQuestion(message: string): boolean {
  const msg = message.toLowerCase();
  const PAID_KEYWORDS: Array<RegExp> = [
    /my plan/,
    /habit tracker/,
    /habit/,
    /habit tracker/,
    /level[- ]up/,
    /goal getter/,
    /fuel her rule/,
    /hot glow/,
    /points?/,
    /leaderboard/,
    /step counter/,
    /zoom link/,
    /class link/,
    /replay/,
    /recorded/,
    /unlock/,
    /onboarding/,
    /login/,
    /app /,
    /mobile app/,
  ];

  return PAID_KEYWORDS.some((re) => re.test(msg));
}

async function getPaidStatusByEmail(userEmail?: string): Promise<boolean> {
  if (!userEmail) return false;
  const lead = await findLeadByEmail(userEmail);
  return lead?.payment_status === "paid";
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit chat usage per IP to control abuse/cost.
    // In local dev, allow chat to work even if Upstash Redis is not configured.
    const isDev = process.env.NODE_ENV !== "production";
    const hasRedisConfig =
      !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!isDev || hasRedisConfig) {
      const clientIP = getClientIP(req);
      const rateLimit = await checkRateLimit(`chat_${clientIP}`, RATE_LIMITS.CHAT);
      if (!rateLimit.allowed) {
        return rateLimitResponse(rateLimit.resetIn);
      }
    }

    const { messages, userEmail } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }
    const userText: string = messages[messages.length - 1]?.content ?? "";
    const paidQuestion = isPaidContentQuestion(userText);
    const isPaidUser = await getPaidStatusByEmail(userEmail);
    const accessSystem = `
== USER ACCESS CONTROL ==
UserPaidStatus: ${isPaidUser ? "paid" : "unpaid"}
PaidQuestionDetected: ${paidQuestion ? "yes" : "no"}

If PaidQuestionDetected is "yes" and UserPaidStatus is "unpaid":
- Do NOT claim they have access to in-app features or paid content.
- Ask them which plan they want (24 Day Challenge / Circle / Transform) and direct them to checkout for paid paths, or /circle for the Circle waitlist.
- Keep replies warm and concise (2–4 sentences) and follow the lead collection rule.
`;

    // Prefer internal KB first for non-paid-content questions.
    // Claude is used as a fallback when KB has no match or when paid gating logic is needed.
    if (!paidQuestion) {
      const kbAnswer = matchKnowledgeBase(userText);
      if (kbAnswer) {
        console.log("[chat/route] KB hit — skipping Claude API");
        return NextResponse.json({ content: kbAnswer, source: "kb" });
      }
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("[chat/route] ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        {
          content:
            "I'm sorry — the assistant isn't fully configured yet. Please try again later or use the contact page.",
          source: "error",
          error: "AI not configured",
        },
        { status: 503 }
      );
    }

    console.log("[chat/route] Calling Claude API");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SITE_KNOWLEDGE_SUMMARY + accessSystem,
        messages,
      }),
    });

    if (!response.ok) {
      console.error("[chat/route] Anthropic error:", await response.text());
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const content = data?.content?.find((b: { type: string }) => b.type === "text")?.text ?? "I'm sorry, I had trouble responding. Please try again!";
    return NextResponse.json({ content, source: "claude" });
  } catch (error) {
    console.error("[chat/route] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
