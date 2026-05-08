import { createHmac } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "wedding_admin";
const ENV_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SECRET = process.env.ADMIN_SECRET || "wedding-secret-change-me";

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function makeToken(): string {
  const ts = Date.now().toString();
  return `${ts}.${sign(ts)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return false;
  if (sign(ts) !== sig) return false;
  const age = Date.now() - parseInt(ts, 10);
  return age < 1000 * 60 * 60 * 24 * 30; // 30 days
}

export function checkPassword(input: string): boolean {
  return input === ENV_PASSWORD;
}

export const ADMIN_COOKIE = COOKIE_NAME;

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return verifyToken(c.get(COOKIE_NAME)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Response("Unauthorized", { status: 401 });
  }
}
