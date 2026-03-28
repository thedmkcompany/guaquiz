import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function getAdminCredentials() {
  return {
    user: process.env.ADMIN_USER || "",
    pass: process.env.ADMIN_PASSWORD || "",
  };
}

export function areAdminCredentialsConfigured(): boolean {
  const { user, pass } = getAdminCredentials();
  return Boolean(user && pass);
}

export function verifyAdminCredentials(user: string, pass: string): boolean {
  const expected = getAdminCredentials();
  if (!expected.user || !expected.pass) return false;
  return timingSafeEqualString(user, expected.user) && timingSafeEqualString(pass, expected.pass);
}

export function createAdminSessionValue(user: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!secret) return "";
  return sha256(`${user}:${secret}`);
}

export function isValidAdminSession(sessionValue: string | undefined): boolean {
  if (!sessionValue) return false;
  const { user } = getAdminCredentials();
  if (!user) return false;
  const expected = createAdminSessionValue(user);
  if (!expected) return false;
  return timingSafeEqualString(sessionValue, expected);
}

export function hashManagedUserPassword(password: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  return sha256(`${password}:${secret}`);
}

