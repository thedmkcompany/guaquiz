"use client";

import { useState } from "react";

interface DraftTestimonial {
  id: string;
  name: string;
  program: string;
  text: string;
  profileImageUrl: string;
  videoUrl: string;
  createdAt: string;
}

export default function TestimonialManager() {
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [text, setText] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [items, setItems] = useState<DraftTestimonial[]>([]);
  const [error, setError] = useState("");

  function onProfileImageChange(file: File | undefined) {
    if (!file) return;
    setProfileImageUrl(URL.createObjectURL(file));
  }

  function onVideoChange(file: File | undefined) {
    if (!file) return;
    setVideoUrl(URL.createObjectURL(file));
  }

  function resetForm() {
    setName("");
    setProgram("");
    setText("");
    setProfileImageUrl("");
    setVideoUrl("");
  }

  function addTestimonial() {
    setError("");
    const entry: DraftTestimonial = {
      id: crypto.randomUUID(),
      name: name.trim() || "Anonymous",
      program: program.trim() || "Not specified",
      text: text.trim(),
      profileImageUrl,
      videoUrl,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [entry, ...prev]);
    resetForm();
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#cdbf9a] bg-white p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-[#7e0f1d] font-semibold">
        Testimonial Manager
      </p>
      <h2 className="mt-1 text-2xl font-headline text-[#123b34]">
        Add New Testimonial
      </h2>
      <p className="mt-1 text-sm text-[#0f3c36]/70">
        Add text, video, or both one below another. Nothing is mandatory.
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="rounded-xl border border-[#e6dcc2] bg-[#fff8ea] p-4">
          <p className="text-xs font-semibold text-[#7e0f1d] uppercase tracking-[0.08em]">
            Profile Preview
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#7e0f1d]/40 bg-[#f7f3e8] flex items-center justify-center text-xs text-[#7e0f1d]/70">
              {profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImageUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                "No image"
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#123b34] mb-1">
                Upload profile image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onProfileImageChange(e.target.files?.[0])}
                className="block w-full text-xs text-[#123b34]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#123b34] mb-1">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2"
                placeholder="e.g. Aanya Sharma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#123b34] mb-1">
                Program
              </label>
              <input
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2"
                placeholder="e.g. Circle"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#123b34] mb-1">
              Text Testimonial
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2"
              placeholder="Write testimonial text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#123b34] mb-1">
              Upload Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => onVideoChange(e.target.files?.[0])}
              className="block w-full text-xs text-[#123b34]"
            />
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="mt-3 w-full max-w-md rounded-xl border border-[#e6dcc2]"
              />
            ) : null}
          </div>

          {error ? <p className="text-sm text-[#9b2335]">{error}</p> : null}

          <button
            type="button"
            onClick={addTestimonial}
            className="rounded-lg bg-[#7e0f1d] text-[#f7f3e8] px-4 py-2.5 font-semibold"
          >
            Add Testimonial
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[#123b34]">Added Testimonials</h3>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-[#0f3c36]/65">
            No testimonials added yet.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[#e6dcc2] bg-[#fffaf1] p-4"
              >
                <div className="flex items-center gap-3">
                  {item.profileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.profileImageUrl}
                      alt={item.name}
                      className="h-12 w-12 rounded-full object-cover border border-[#cdbf9a]"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full border border-[#cdbf9a] bg-[#f7f3e8] flex items-center justify-center text-[10px] text-[#7e0f1d]/70">
                      No image
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#123b34]">{item.name}</p>
                    <p className="text-xs text-[#0f3c36]/60">{item.program}</p>
                  </div>
                </div>

                {item.text ? (
                  <p className="mt-3 text-sm text-[#123b34]/85 leading-relaxed">{item.text}</p>
                ) : null}
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    controls
                    className="mt-3 w-full rounded-lg border border-[#e6dcc2]"
                  />
                ) : null}

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="mt-3 text-xs text-[#9b2335] underline"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
