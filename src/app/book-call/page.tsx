"use client";
import { useState } from "react";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL_TRANSFORM ?? "https://calendly.com/thedmk";

export default function BookCallPage() {
  const [step, setStep] = useState<"form" | "calendly">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setStep("calendly");
    } catch {
      setError("Something went wrong. Please try again or email tech.thedmk@gmail.com.");
    } finally {
      setLoading(false);
    }
  };

  const calendlyPrefilled = `${CALENDLY_URL}?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}`;

  return (
    <main style={{ minHeight: "100vh", background: "#FDFAF5", padding: "60px 16px 80px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ display: "inline-block", padding: "4px 14px", background: "#FEF3C7", color: "#92400E", borderRadius: 99, fontSize: 12, fontWeight: 500, marginBottom: 16, border: "1px solid #FDE68A" }}>
            Free · 30 Minutes
          </span>
          <h1 style={{ fontSize: "clamp(26px,5vw,36px)", fontWeight: 700, color: "#111", margin: "0 0 12px", fontFamily: "var(--font-roca, Georgia, serif)", lineHeight: 1.2 }}>
            Book Your Strategy Call
          </h1>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.65, margin: "0 auto", maxWidth: 420 }}>
            Tell us a little about yourself, then pick a time that works for you. Disha's team will map out your personalised transformation plan on the call.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 0, marginBottom: 32 }}>
          <StepDot number={1} label="Your Details" active={step === "form"} done={step !== "form"} />
          <div style={{ flex: 1, height: 2, background: "#E5E7EB", marginTop: 15, maxWidth: 80 }} />
          <StepDot number={2} label="Pick a Time" active={step === "calendly"} done={false} />
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 4px 32px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6" }}>
          {step === "form" && (
            <form onSubmit={handleSubmit}>
              {(["name", "email", "phone"] as const).map((field) => (
                <div key={field} style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                    {field === "name" ? "Full Name" : field === "email" ? "Email Address" : "Phone Number"}
                  </label>
                  <input
                    name={field}
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    placeholder={field === "name" ? "Priya Sharma" : field === "email" ? "priya@gmail.com" : "+91 98765 43210"}
                    value={form[field]}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 14, color: "#111", outline: "none", background: "#FAFAFA", boxSizing: "border-box" as const }}
                    autoComplete="on"
                  />
                </div>
              ))}
              {error && (
                <p style={{ color: "#DC2626", fontSize: 13, marginBottom: 12, padding: "10px 14px", background: "#FEF2F2", borderRadius: 8, border: "1px solid #FECACA" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "13px 20px", background: "#C9A84C", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 8 }}
              >
                {loading ? "Sending…" : "Continue to Calendar →"}
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 12 }}>No spam. We'll only contact you about your call.</p>
            </form>
          )}

          {step === "calendly" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #BBF7D0", marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#22C55E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                  ✓
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#15803D" }}>Details received!</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6B7280" }}>Book your slot below — Calendly will email you the meeting link after you schedule.</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px" }}>Now pick a date and time that works for you:</p>
              <iframe
                src={calendlyPrefilled}
                style={{ width: "100%", height: 620, borderRadius: 12, border: "1px solid #F3F4F6" }}
                frameBorder="0"
                title="Book a strategy call"
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function StepDot({ number, label, active, done }: { number: number; label: string; active: boolean; done: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "column" as const }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? "#C9A84C" : active ? "#111" : "#e5e7eb", color: done || active ? "#fff" : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>
        {done ? "✓" : number}
      </div>
      <span style={{ fontSize: 12, color: active ? "#111" : done ? "#C9A84C" : "#9ca3af", fontWeight: active ? 500 : 400 }}>{label}</span>
    </div>
  );
}

