"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function TestimonialForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [text, setText] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload(file: File | undefined) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setProfileImageUrl(dataUrl);
  }

  async function handleVideoUpload(file: File | undefined) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setVideoUrl(dataUrl);
  }

  async function addNew() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/program-manager/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          program,
          text,
          profileImageUrl,
          videoUrl,
          pinned,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Failed to add testimonial.");
        return;
      }
      router.push("/program-manager/testimonials");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#cdbf9a] bg-white p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-[#7e0f1d] font-semibold">
        Add New Testimonial
      </p>
      <p className="mt-1 text-sm text-[#0f3c36]/70">
        Text and video can both be added. Nothing is mandatory.
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="rounded-xl border border-[#e6dcc2] bg-[#fff8ea] p-4">
          <p className="text-xs font-semibold text-[#7e0f1d] uppercase tracking-[0.08em]">
            Profile Image
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#7e0f1d]/40 bg-[#f7f3e8] flex items-center justify-center text-xs text-[#7e0f1d]/70">
              {profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileImageUrl} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                "No image"
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#123b34] mb-1">
                Upload profile photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void handleImageUpload(e.target.files?.[0])}
                className="block w-full text-xs text-[#123b34]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#123b34] mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#123b34] mb-1">Program</label>
              <input
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#123b34] mb-1">Text Testimonial</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#123b34] mb-1">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => void handleVideoUpload(e.target.files?.[0])}
              className="block w-full text-xs text-[#123b34]"
            />
            {videoUrl ? (
              <video src={videoUrl} controls className="mt-3 w-full max-w-md rounded-xl border border-[#e6dcc2]" />
            ) : null}
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-[#123b34]">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 rounded border-[#cdbf9a]"
            />
            Pin this testimonial
          </label>

          {error ? <p className="text-sm text-[#9b2335]">{error}</p> : null}

          <button
            type="button"
            onClick={() => void addNew()}
            disabled={saving}
            className="rounded-lg bg-[#7e0f1d] text-[#f7f3e8] px-4 py-2.5 font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save testimonial"}
          </button>
        </div>
      </div>
    </section>
  );
}

