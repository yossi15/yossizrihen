import { NextResponse } from "next/server";
import { upsertRsvp, getGuest, createGuest } from "@/lib/repo";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "missing name" }, { status: 400 });
  }

  const guestsCount = Math.max(0, Math.min(20, Number(body.guests) || 1));
  const attending: "yes" | "no" | "maybe" =
    body.attending === "no" ? "no" : body.attending === "maybe" ? "maybe" : "yes";
  const phone = String(body.phone ?? "").trim() || null;
  const message = String(body.message ?? "").trim() || null;
  const dietary = Array.isArray(body.dietary)
    ? body.dietary.filter((d: unknown) => typeof d === "string")
    : [];

  // If a token is provided, attach to that guest. Otherwise, walk-in: create one.
  let guestId: string | null = body.token ? String(body.token) : null;
  if (guestId) {
    const g = getGuest(guestId);
    if (!g) {
      return NextResponse.json({ error: "invalid token" }, { status: 404 });
    }
  } else {
    const g = createGuest({
      name,
      phone,
      invited_count: guestsCount || 1,
      group_label: "ללא קישור",
    });
    guestId = g.id;
  }

  upsertRsvp({
    guest_id: guestId,
    attending,
    guests_count: attending === "yes" ? guestsCount : 0,
    dietary,
    message,
  });

  return NextResponse.json({ ok: true });
}
