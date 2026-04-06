import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  findLeadByEmail,
  isSupabaseConfigured,
  storeQuizLead,
  updateExistingLead,
} from "@/lib/supabase";

interface LeadPayload {
  name: string; email: string; phone: string;
  company?: string; challenge?: string;
  interestedInTransform?: boolean; interestedInStrategy?: boolean;
  recommendation?: string;
  referralSource?: string;
  quizAnswers?: unknown;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendLeadEmail(lead: LeadPayload) {
  if (!process.env.SMTP_USER) { console.warn("[chat/lead] SMTP not configured"); return "skipped"; }
  const isTransform = !!(lead.interestedInTransform || lead.interestedInStrategy);
  const to = isTransform
    ? (process.env.TRANSFORM_NOTIFY_EMAIL ?? process.env.ADMIN_NOTIFY_EMAIL ?? "thedmkcompany@gmail.com")
    : (process.env.WEBINAR_NOTIFY_EMAIL ?? process.env.ADMIN_NOTIFY_EMAIL ?? "thedmkbiz@gmail.com");
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Glow Up Academy" <${process.env.SMTP_USER}>`,
    to,
    subject: `🔥 New ${isTransform ? "Strategy Call" : "Chat"} Lead — ${lead.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#fafafa;border-radius:12px;border:1px solid #e5e7eb;">
        <h2 style="margin:0 0 4px;color:#111;">New Lead from Chat</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">${isTransform ? "Interested in Transform / Strategy Call" : "General enquiry"}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:10px 0;color:#6b7280;width:110px;">Name</td><td style="padding:10px 0;font-weight:600;color:#111;">${lead.name}</td></tr>
          <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Email</td><td style="padding:10px 0;"><a href="mailto:${lead.email}" style="color:#b8860b;">${lead.email}</a></td></tr>
          <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Phone</td><td style="padding:10px 0;"><a href="tel:${lead.phone}" style="color:#b8860b;">${lead.phone}</a></td></tr>
          ${lead.company ? `<tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Company</td><td style="padding:10px 0;color:#111;">${lead.company}</td></tr>` : ""}
          ${lead.challenge ? `<tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Challenge</td><td style="padding:10px 0;color:#111;">${lead.challenge}</td></tr>` : ""}
        </table>
        <div style="margin-top:24px;padding:14px 16px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
          <p style="margin:0;font-size:13px;color:#92400e;">⚡ Reach out within 1 hour for the best conversion rate.</p>
        </div>
        <p style="margin-top:20px;font-size:11px;color:#9ca3af;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST · Glow Up Academy chat widget</p>
      </div>`,
  });
  return "sent";
}

export async function POST(req: NextRequest) {
  try {
    const lead: LeadPayload = await req.json();
    if (!lead.name || !lead.email || !lead.phone) {
      return NextResponse.json({ error: "name, email and phone are required" }, { status: 400 });
    }

    const phone = lead.phone.replace(/\D/g, "");
    const destination = phone.startsWith("91") ? phone : `91${phone}`;
    const normalizedEmail = lead.email.trim().toLowerCase();
    const results: Record<string, unknown> = {};

    // 1. Persist lead in Supabase (source of truth in production)
    if (isSupabaseConfigured()) {
      const recommendation =
        lead.recommendation ??
        (lead.interestedInTransform || lead.interestedInStrategy ? "transform" : "essentials");
      const existingLead = await findLeadByEmail(normalizedEmail);
      if (existingLead?.id) {
        const updateResult = await updateExistingLead(existingLead.id, {
          name: lead.name.trim(),
          email: normalizedEmail,
          whatsapp: destination,
          recommendation,
          referral_source: lead.referralSource ?? "chat_widget",
          quiz_answers: (lead.quizAnswers as never) ?? existingLead.quiz_answers,
        });
        results.supabase = updateResult.success ? "updated" : `failed: ${updateResult.error ?? "unknown error"}`;
      } else {
        const insertResult = await storeQuizLead({
          name: lead.name.trim(),
          email: normalizedEmail,
          whatsapp: destination,
          recommendation,
          referral_source: lead.referralSource ?? "chat_widget",
          quiz_answers: (lead.quizAnswers as never) ?? null,
        });
        results.supabase = insertResult.success ? "inserted" : `failed: ${insertResult.error ?? "unknown error"}`;
      }
    } else {
      results.supabase = "skipped_not_configured";
    }

    // 2. AISensy WhatsApp
    const campaignName = process.env.AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY ?? process.env.AISENSY_CAMPAIGN_WELCOME;
    if (campaignName) {
      const baseUrl = process.env.AISENSY_BASE_URL ?? "https://backend.aisensy.com";
      const aiRes = await fetch(`${baseUrl}/campaign/send-template/v2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: process.env.AISENSY_API_KEY, campaignName, destination,
          userName: lead.name, templateParams: [lead.name, lead.company ?? "", lead.challenge ?? ""],
          source: "Sales Chat", media: {}, buttons: [], carouselCards: [], location: {},
        }),
      });
      results.aisensy = aiRes.ok ? "sent" : "failed";
    } else { results.aisensy = "skipped"; }

    // 3. Email notification
    results.email = await sendLeadEmail({ ...lead, phone: destination });

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("[chat/lead] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
