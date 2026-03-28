import crypto from "crypto";

export const PROGRAM_MANAGER_COOKIE = "pm_session";

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

/** Comma-separated usernames, or legacy single PROGRAM_MANAGER_USER. */
export function getAllowedProgramManagerUsernames(): string[] {
  const multi = process.env.PROGRAM_MANAGER_USERS?.trim();
  if (multi) {
    return multi
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const single = process.env.PROGRAM_MANAGER_USER?.trim();
  return single ? [single] : [];
}

export function getProgramManagerPassword(): string {
  return process.env.PROGRAM_MANAGER_PASSWORD || "";
}

export function areProgramManagerCredentialsConfigured(): boolean {
  const users = getAllowedProgramManagerUsernames();
  const pass = getProgramManagerPassword();
  return users.length > 0 && Boolean(pass);
}

export function verifyProgramManagerCredentials(user: string, pass: string): boolean {
  const expectedPass = getProgramManagerPassword();
  if (!expectedPass) return false;
  if (!timingSafeEqualString(pass, expectedPass)) return false;

  const allowed = getAllowedProgramManagerUsernames();
  if (allowed.length === 0) return false;

  return allowed.some((u) => timingSafeEqualString(user, u));
}

export function createProgramManagerSessionValue(user: string): string {
  const secret = process.env.PROGRAM_MANAGER_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!secret) return "";
  return sha256(`${user}:${secret}`);
}

export function isValidProgramManagerSession(sessionValue: string | undefined): boolean {
  if (!sessionValue) return false;
  const allowed = getAllowedProgramManagerUsernames();
  if (allowed.length === 0) return false;

  for (const u of allowed) {
    const expected = createProgramManagerSessionValue(u);
    if (expected && timingSafeEqualString(sessionValue, expected)) return true;
  }
  return false;
}
