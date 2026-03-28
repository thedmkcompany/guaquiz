import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { hashManagedUserPassword } from "@/lib/admin-auth";

export type ManagedUserRole = "coach" | "program_manager" | "admin_assistant";

export interface ManagedUserRecord {
  id: string;
  username: string;
  role: ManagedUserRole;
  passwordHash: string;
  createdAt: string;
}

export interface ManagedUserPublic {
  id: string;
  username: string;
  role: ManagedUserRole;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "portal-users.json");

async function ensureStoreExists(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf8");
  }
}

async function readUsersUnsafe(): Promise<ManagedUserRecord[]> {
  await ensureStoreExists();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as ManagedUserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsersUnsafe(users: ManagedUserRecord[]): Promise<void> {
  await ensureStoreExists();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function listManagedUsers(): Promise<ManagedUserPublic[]> {
  const users = await readUsersUnsafe();
  return users.map(({ passwordHash: _passwordHash, ...publicUser }) => publicUser);
}

export async function addManagedUser(input: {
  username: string;
  password: string;
  role: ManagedUserRole;
}): Promise<{ ok: true; user: ManagedUserPublic } | { ok: false; error: string }> {
  const username = input.username.trim();
  if (!username) return { ok: false, error: "Username is required." };
  if (input.password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const users = await readUsersUnsafe();
  const exists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
  if (exists) return { ok: false, error: "Username already exists." };

  const record: ManagedUserRecord = {
    id: crypto.randomUUID(),
    username,
    role: input.role,
    passwordHash: hashManagedUserPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  users.unshift(record);
  await writeUsersUnsafe(users);

  const { passwordHash: _passwordHash, ...publicUser } = record;
  return { ok: true, user: publicUser };
}

