import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createGuest } from "@/lib/repo";

export const runtime = "nodejs";

// Accepts a CSV body with headers: name, phone, invited_count, side, group_label, notes
// `name` is required. All others optional. Empty rows skipped.
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const text = await req.text();
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return NextResponse.json({ error: "empty file" }, { status: 400 });
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (key: string) => header.indexOf(key);

  const cols = {
    name: idx("name") >= 0 ? idx("name") : idx("שם"),
    phone: idx("phone") >= 0 ? idx("phone") : idx("טלפון"),
    invited_count:
      idx("invited_count") >= 0 ? idx("invited_count") : idx("כמות"),
    side: idx("side") >= 0 ? idx("side") : idx("צד"),
    group_label: idx("group_label") >= 0 ? idx("group_label") : idx("קבוצה"),
    notes: idx("notes") >= 0 ? idx("notes") : idx("הערות"),
  };

  if (cols.name < 0) {
    return NextResponse.json(
      { error: "missing required 'name' column" },
      { status: 400 },
    );
  }

  let added = 0;
  const errors: string[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = (row[cols.name] || "").trim();
    if (!name) continue;
    try {
      createGuest({
        name,
        phone: cols.phone >= 0 ? row[cols.phone] || null : null,
        invited_count:
          cols.invited_count >= 0
            ? parseInt(row[cols.invited_count] || "1", 10) || 1
            : 1,
        side:
          cols.side >= 0
            ? (mapSide(row[cols.side]) as "groom" | "bride" | "both" | null)
            : null,
        group_label: cols.group_label >= 0 ? row[cols.group_label] || null : null,
        notes: cols.notes >= 0 ? row[cols.notes] || null : null,
      });
      added++;
    } catch (e) {
      errors.push(`row ${i + 1}: ${(e as Error).message}`);
    }
  }
  return NextResponse.json({ added, errors });
}

function mapSide(raw: string | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  if (["groom", "חתן"].includes(s)) return "groom";
  if (["bride", "כלה"].includes(s)) return "bride";
  if (["both", "משותף", "שניהם"].includes(s)) return "both";
  return null;
}

// Minimal CSV parser supporting quoted fields, commas, and newlines.
function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (inQuotes) {
      if (c === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 0 && !(r.length === 1 && r[0] === ""));
}
