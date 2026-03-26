import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface BookingPayload { name: string; email: string; phone: string; }

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendAdminNotification(booking: BookingPayload) {
  if (!process.env.SMTP_USER) {
    console.warn("[book-call] SMTP not configured — skipping admin email");
    return;
  }
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Glow Up Academy" <${process.env.SMTP_USER}>`,
    to: process.env.TRANSFORM_NOTIFY_EMAIL ?? process.env.ADMIN_NOTIFY_EMAIL ?? "thedmkcompany@gmail.com",
    subject: `📅 New Strategy Call Booking — ${booking.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#fafafa;border-radius:12px;border:1px solid #e5e7eb;">
        <h2 style="margin:0 0 4px;color:#111;">New Strategy Call Booking</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Someone just booked via your website.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:12px 0;color:#6b7280;width:100px;">Name</td><td style="padding:12px 0;font-weight:600;color:#111;">${booking.name}</td></tr>
          <tr style="border-top:1px solid #f3f4f6;"><td style="padding:12px 0;color:#6b7280;">Email</td><td style="padding:12px 0;"><a href="mailto:${booking.email}" style="color:#b8860b;">${booking.email}</a></td></tr>
          <tr style="border-top:1px solid #f3f4f6;"><td style="padding:12px 0;color:#6b7280;">Phone</td><td style="padding:12px 0;"><a href="tel:${booking.phone}" style="color:#b8860b;">${booking.phone}</a></td></tr>
        </table>
        <div style="margin-top:24px;padding:14px 16px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
          <p style="margin:0;font-size:13px;color:#92400e;">⚡ Check your Calendly dashboard for the exact slot they picked.</p>
        </div>
        <p style="margin-top:20px;font-size:11px;color:#9ca3af;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST · gua.thedmk.online/book-call</p>
      </div>`,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingPayload = await req.json();
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "name, email and phone are required" }, { status: 400 });
    }
    const adminResult = await Promise.allSettled([sendAdminNotification(body)]);
    if (adminResult[0]?.status === "rejected") console.error("[book-call] Admin email failed:", adminResult[0].reason);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[book-call] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

