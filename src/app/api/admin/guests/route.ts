import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createGuest, listGuests } from "@/lib/repo";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ guests: listGuests() });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "missing name" }, { status: 400 });
  }
  const guest = createGuest({
    name,
    phone: body.phone ?? null,
    invited_count: Number(body.invited_count) || 1,
    side: body.side ?? null,
    group_label: body.group_label ?? null,
    notes: body.notes ?? null,
  });
  return NextResponse.json({ guest });
}
