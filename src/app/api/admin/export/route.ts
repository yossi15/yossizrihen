import { isAdmin } from "@/lib/auth";
import { listGuests } from "@/lib/repo";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const guests = listGuests();
  const headers = [
    "id",
    "name",
    "phone",
    "invited_count",
    "side",
    "group_label",
    "notes",
    "attending",
    "guests_count",
    "dietary",
    "message",
    "submitted_at",
  ];
  const lines = [headers.join(",")];
  for (const g of guests) {
    lines.push(
      [
        g.id,
        g.name,
        g.phone ?? "",
        g.invited_count,
        g.side ?? "",
        g.group_label ?? "",
        g.notes ?? "",
        g.rsvp?.attending ?? "",
        g.rsvp?.guests_count ?? "",
        g.rsvp?.dietary ?? "",
        g.rsvp?.message ?? "",
        g.rsvp?.submitted_at ?? "",
      ]
        .map(csv)
        .join(","),
    );
  }
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=guests-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`,
    },
  });
}

function csv(v: unknown): string {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
