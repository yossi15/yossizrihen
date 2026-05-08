import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteGuest, updateGuest } from "@/lib/repo";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = updateGuest(id, {
    name: body.name,
    phone: body.phone ?? null,
    invited_count: body.invited_count,
    side: body.side ?? null,
    group_label: body.group_label ?? null,
    table_id: body.table_id ?? null,
    notes: body.notes ?? null,
  });
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ guest: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = deleteGuest(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
