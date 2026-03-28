"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProgramManagerLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/program-manager/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push("/program-manager");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3e8] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#cdbf9a] bg-[#fff8ea] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <p className="text-xs uppercase tracking-[0.14em] text-[#7e0f1d] font-semibold">
          Program Manager
        </p>
        <h1 className="mt-2 text-2xl font-headline text-[#123b34]">Login</h1>
        <p className="mt-1 text-sm text-[#0f3c36]/70">
          Enter your credentials to access the manager portal.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#123b34] mb-1">
              Username
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#7e0f1d]/30"
              required
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium text-[#123b34]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs font-medium text-[#7e0f1d] hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#7e0f1d]/30"
              required
            />
          </div>

          {error && <p className="text-sm text-[#9b2335]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#7e0f1d] text-[#f7f3e8] py-2.5 font-semibold hover:bg-[#6b0c18] transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
