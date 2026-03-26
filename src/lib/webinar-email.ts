import nodemailer from "nodemailer";

export interface WebinarEmailContext {
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  sessionDateIso?: string | null;
  paymentId?: string;
  gateway?: "razorpay" | "payu";
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function formatSessionLine(sessionDateIso?: string | null) {
  if (!sessionDateIso) return "";
  const dt = new Date(sessionDateIso);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
}

export async function sendWebinarPaymentEmails(ctx: WebinarEmailContext): Promise<{
  customer: "sent" | "skipped" | "failed";
  internal: "sent" | "skipped" | "failed";
}> {
  if (!process.env.SMTP_USER) {
    console.warn("[webinar-email] SMTP not configured — skipping emails");
    return { customer: "skipped", internal: "skipped" };
  }

  const toInternal = process.env.WEBINAR_NOTIFY_EMAIL ?? "thedmkbiz@gmail.com";
  const transporter = createTransporter();
  const sessionLine = formatSessionLine(ctx.sessionDateIso);
  const markCalendarLine = sessionLine ? sessionLine : "Sunday, 12 p.m. sharp";

  const customerHtml = `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#fafafa;border-radius:12px;border:1px solid #e5e7eb;">
      <p style="margin:0 0 14px;color:#111;font-size:14px;line-height:1.7;">
        Hello gorgeous,
      </p>
      <p style="margin:0 0 14px;color:#111;font-size:14px;line-height:1.7;">
        Congratulations on taking the first step to your glow up journey.
      </p>
      <p style="margin:0 0 14px;color:#111;font-size:14px;line-height:1.7;">
        You are officially registered for the Glow Up Academy Masterclass. We could not be more excited to have you in the room.
      </p>
      <p style="margin:0 0 18px;color:#111;font-size:14px;line-height:1.7;">
        Mark your calendar: <strong>${markCalendarLine}</strong>. More details are headed your way soon, so keep an eye on your inbox.
      </p>

      <div style="margin:20px 0 12px;">
        <p style="margin:0 0 10px;color:#111;font-weight:700;letter-spacing:0.02em;">WHAT TO BRING</p>
        <div style="margin:0;color:#111;font-size:14px;line-height:1.85;">
          <div>✦ That cute outfit you&apos;ve been saving for the right occasion (this is it)</div>
          <div>✦ A workout outfit. We&apos;re moving.</div>
          <div>✦ A comfy outfit for when you want to settle in</div>
          <div>✦ A notebook and pen. You&apos;ll want to write this down.</div>
        </div>
      </div>

      <p style="margin:18px 0 0;color:#111;font-size:14px;line-height:1.7;">
        This Sunday is going to be something special. We cannot wait to see you there.
      </p>

      <p style="margin:18px 0 0;color:#111;font-size:14px;line-height:1.7;">
        With love,<br/>
        Disha &amp; The Glow Up Academy Team
      </p>
    </div>`;

  const internalHtml = `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#fafafa;border-radius:12px;border:1px solid #e5e7eb;">
      <h2 style="margin:0 0 6px;color:#111;">New Webinar Payment</h2>
      <p style="margin:0 0 18px;color:#6b7280;font-size:14px;">A user has paid for Webinar.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:10px 0;color:#6b7280;width:110px;">Name</td><td style="padding:10px 0;font-weight:600;color:#111;">${ctx.customerName || "-"}</td></tr>
        <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Email</td><td style="padding:10px 0;"><a href="mailto:${ctx.customerEmail}" style="color:#b8860b;">${ctx.customerEmail}</a></td></tr>
        ${ctx.customerPhone ? `<tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Phone</td><td style="padding:10px 0;">${ctx.customerPhone}</td></tr>` : ""}
        ${sessionLine ? `<tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Session</td><td style="padding:10px 0;">${sessionLine}</td></tr>` : ""}
        ${ctx.paymentId ? `<tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;">Payment</td><td style="padding:10px 0;">${ctx.gateway || ""} ${ctx.paymentId}</td></tr>` : ""}
      </table>
      <p style="margin-top:22px;font-size:12px;color:#9ca3af;">
        ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST · Webinar payment webhook
      </p>
    </div>`;

  let customer: "sent" | "failed" = "sent";
  let internal: "sent" | "failed" = "sent";

  try {
    await transporter.sendMail({
      from: `"Glow Up Academy" <${process.env.SMTP_USER}>`,
      to: ctx.customerEmail,
      subject: "You’re officially registered — Glow Up Academy Masterclass",
      html: customerHtml,
    });
  } catch (e) {
    customer = "failed";
    console.error("[webinar-email] Customer email failed:", e);
  }

  try {
    await transporter.sendMail({
      from: `"Glow Up Academy" <${process.env.SMTP_USER}>`,
      to: toInternal,
      subject: `✅ Webinar payment received — ${ctx.customerName || ctx.customerEmail}`,
      html: internalHtml,
    });
  } catch (e) {
    internal = "failed";
    console.error("[webinar-email] Internal email failed:", e);
  }

  return { customer, internal };
}

