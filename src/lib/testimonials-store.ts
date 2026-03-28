import fs from "fs/promises";
import path from "path";
import { DEFAULT_TESTIMONIALS } from "@/lib/default-testimonials";

export interface TestimonialRecord {
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

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "testimonials.json");

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.writeFile(FILE_PATH, "[]", "utf8");
  }
}

async function readAllUnsafe(): Promise<TestimonialRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(FILE_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw) as TestimonialRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAllUnsafe(items: TestimonialRecord[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(FILE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function listTestimonials(): Promise<TestimonialRecord[]> {
  const items = await readAllUnsafe();
  const normalizedItems = items.map((item) => ({
    ...item,
    pinned: Boolean(item.pinned),
  }));
  const merged = [...normalizedItems, ...DEFAULT_TESTIMONIALS];
  return merged.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function addTestimonial(input: {
  name?: string;
  program?: string;
  text?: string;
  profileImageUrl?: string;
  videoUrl?: string;
  pinned?: boolean;
}): Promise<TestimonialRecord> {
  const now = new Date().toISOString();
  const item: TestimonialRecord = {
    id: crypto.randomUUID(),
    name: input.name?.trim() || "Anonymous",
    program: input.program?.trim() || "Not specified",
    text: input.text?.trim() || "",
    profileImageUrl: input.profileImageUrl || "",
    videoUrl: input.videoUrl || "",
    pinned: Boolean(input.pinned),
    createdAt: now,
    updatedAt: now,
  };
  const items = await readAllUnsafe();
  items.unshift(item);
  await writeAllUnsafe(items);
  return item;
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Omit<TestimonialRecord, "id" | "createdAt" | "updatedAt">>
): Promise<TestimonialRecord | null> {
  const items = await readAllUnsafe();
  const idx = items.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const current = items[idx];
  const updated: TestimonialRecord = {
    ...current,
    name: patch.name?.trim() || current.name,
    program: patch.program?.trim() || current.program,
    text: patch.text ?? current.text,
    profileImageUrl: patch.profileImageUrl ?? current.profileImageUrl,
    videoUrl: patch.videoUrl ?? current.videoUrl,
    pinned: typeof patch.pinned === "boolean" ? patch.pinned : current.pinned,
    updatedAt: new Date().toISOString(),
  };
  items[idx] = updated;
  await writeAllUnsafe(items);
  return updated;
}

