"use client";

import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  program: string;
  text: string;
  profileImageUrl: string;
  videoUrl: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialsList({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [items, setItems] = useState<Testimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Testimonial>>({});

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/program-manager/testimonials");
      const data = (await res.json()) as { testimonials?: Testimonial[]; error?: string };
      if (!res.ok) {
        setError(data.error || "Failed to load testimonials");
        return;
      }
      setItems(data.testimonials || []);
    } catch {
      setError("Network error while loading testimonials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setItems(initialTestimonials);
  }, [initialTestimonials]);

  function startEdit(item: Testimonial) {
    setEditingId(item.id);
    setDraft(item);
  }

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch(`/api/program-manager/testimonials/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = (await res.json()) as { testimonial?: Testimonial; error?: string };
    if (!res.ok || !data.testimonial) {
      setError(data.error || "Failed to save edits");
      return;
    }
    setItems((prev) => prev.map((t) => (t.id === editingId ? data.testimonial! : t)));
    setEditingId(null);
    setDraft({});
  }

  if (loading) return <p className="text-sm text-[#0f3c36]/70">Loading testimonials...</p>;

  return (
    <section className="rounded-2xl border border-[#cdbf9a] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-headline text-[#123b34]">Current Testimonials</h2>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-[#cdbf9a] px-3 py-2 text-sm text-[#123b34] hover:bg-[#f7f3e8]"
        >
          Refresh
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-[#9b2335]">{error}</p> : null}
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[#0f3c36]/70">No testimonials yet.</p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {items.map((item) => {
            const editing = editingId === item.id;
            const value = editing ? { ...item, ...draft } : item;
            return (
              <article key={item.id} className="rounded-xl border border-[#e6dcc2] bg-[#fffaf1] p-4">
                {value.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={value.profileImageUrl} alt={value.name} className="h-12 w-12 rounded-full object-cover border border-[#cdbf9a]" />
                ) : (
                  <div className="h-12 w-12 rounded-full border border-[#cdbf9a] bg-[#f7f3e8] flex items-center justify-center text-[10px] text-[#7e0f1d]/70">
                    No image
                  </div>
                )}

                {editing ? (
                  <div className="mt-3 space-y-2">
                    <input
                      value={value.name}
                      onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2 text-sm"
                    />
                    <input
                      value={value.program}
                      onChange={(e) => setDraft((prev) => ({ ...prev, program: e.target.value }))}
                      className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2 text-sm"
                    />
                    <textarea
                      value={value.text}
                      onChange={(e) => setDraft((prev) => ({ ...prev, text: e.target.value }))}
                      rows={3}
                      className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2 text-sm"
                    />
                    <label className="inline-flex items-center gap-2 text-sm text-[#123b34]">
                      <input
                        type="checkbox"
                        checked={Boolean(value.pinned)}
                        onChange={(e) => setDraft((prev) => ({ ...prev, pinned: e.target.checked }))}
                        className="h-4 w-4 rounded border-[#cdbf9a]"
                      />
                      Pin this testimonial
                    </label>
                    <input
                      value={value.videoUrl}
                      onChange={(e) => setDraft((prev) => ({ ...prev, videoUrl: e.target.value }))}
                      className="w-full rounded-lg border border-[#cdbf9a] px-3 py-2 text-sm"
                      placeholder="Video URL / data URL"
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => void saveEdit()} className="rounded-lg bg-[#7e0f1d] text-[#f7f3e8] px-3 py-2 text-sm">Save</button>
                      <button type="button" onClick={() => { setEditingId(null); setDraft({}); }} className="rounded-lg border border-[#cdbf9a] px-3 py-2 text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="font-semibold text-[#123b34]">{value.name}</p>
                    <p className="text-xs text-[#0f3c36]/60">{value.program}</p>
                    {value.pinned ? (
                      <span className="mt-1 inline-block rounded-full bg-[#7e0f1d]/10 text-[#7e0f1d] text-[10px] font-semibold px-2 py-0.5 uppercase tracking-[0.08em]">
                        Pinned
                      </span>
                    ) : null}
                    {value.text ? <p className="mt-2 text-sm text-[#123b34]/85">{value.text}</p> : null}
                    {value.videoUrl ? <video src={value.videoUrl} controls className="mt-3 w-full rounded-lg border border-[#e6dcc2]" /> : null}
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="mt-3 text-xs text-[#7e0f1d] underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

