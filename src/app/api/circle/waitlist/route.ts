import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const DEFAULT_TO = "thedmkcompany@gmail.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/**
 * Circle waitlist: sends name, email, phone, optional message to ops inbox.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "name, email, and phone are required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }

    const to = process.env.CIRCLE_WAITLIST_EMAIL?.trim() || DEFAULT_TO;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("[circle/waitlist] SMTP not configured");
      return NextResponse.json(
        { error: "Server email is not configured. Try again later or DM us on Instagram." },
        { status: 503 }
      );
    }

    const transporter = createTransporter();
    const ts = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    await transporter.sendMail({
      from: `"Glow Up Academy" <${process.env.SMTP_USER}>`,
      to,
      replyTo: email,
      subject: `CIRCLE waitlist — ${name}`,
      text: [
        "New Circle waitlist request",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        "Message:",
        message || "(none)",
        "",
        `${ts} IST · /circle waitlist form`,
      ].join("\n"),
      html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:24px;background:#fafafa;border-radius:12px;border:1px solid #e5e7eb;">
        <h2 style="margin:0 0 8px;color:#111;">Circle waitlist</h2>
        <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">Someone requested to join the Circle waitlist.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#6b7280;width:100px;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
        </table>
        ${message ? `<p style="margin-top:16px;"><strong>Message</strong></p><p style="color:#374151;">${escapeHtml(message)}</p>` : ""}
        <p style="margin-top:20px;font-size:11px;color:#9ca3af;">${escapeHtml(ts)} IST · Glow Up Academy</p>
      </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[circle/waitlist]", e);
    return NextResponse.json({ error: "Could not send. Please try again." }, { status: 500 });
  }
}
