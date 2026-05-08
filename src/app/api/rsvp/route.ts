import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Rsvp = {
  name: string;
  phone?: string;
  guests: number;
  attending: "yes" | "no";
  submittedAt: string;
};

const STORE = path.join(process.cwd(), ".rsvp-store.json");

async function readAll(): Promise<Rsvp[]> {
  try {
    const raw = await fs.readFile(STORE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "missing name" }, { status: 400 });
  }
  const entry: Rsvp = {
    name,
    phone: String(body.phone ?? "").trim() || undefined,
    guests: Math.max(1, Math.min(20, Number(body.guests) || 1)),
    attending: body.attending === "no" ? "no" : "yes",
    submittedAt: new Date().toISOString(),
  };
  const all = await readAll();
  all.push(entry);
  await fs.writeFile(STORE, JSON.stringify(all, null, 2), "utf8");
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const all = await readAll();
  return NextResponse.json({ count: all.length });
}
