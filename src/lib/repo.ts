import { customAlphabet } from "nanoid";
import { db } from "./db";

const newId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

export type Guest = {
  id: string;
  name: string;
  phone: string | null;
  invited_count: number;
  side: "groom" | "bride" | "both" | null;
  group_label: string | null;
  table_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Rsvp = {
  id: string;
  guest_id: string;
  attending: "yes" | "no" | "maybe";
  guests_count: number;
  dietary: string | null;
  message: string | null;
  submitted_at: string;
  updated_at: string;
};

export type GuestWithRsvp = Guest & {
  rsvp: Rsvp | null;
};

export type DietaryPref =
  | "vegan"
  | "vegetarian"
  | "kosher"
  | "gluten_free"
  | "lactose_free"
  | "nut_allergy";

export const DIETARY_LABELS: Record<DietaryPref, string> = {
  vegan: "טבעוני",
  vegetarian: "צמחוני",
  kosher: "כשר",
  gluten_free: "ללא גלוטן",
  lactose_free: "ללא לקטוז",
  nut_allergy: "אלרגיה לאגוזים",
};

// ----- Guests -----

export function createGuest(input: {
  name: string;
  phone?: string | null;
  invited_count?: number;
  side?: Guest["side"];
  group_label?: string | null;
  notes?: string | null;
}): Guest {
  const id = newId();
  db()
    .prepare(
      `INSERT INTO guests (id, name, phone, invited_count, side, group_label, notes)
       VALUES (@id, @name, @phone, @invited_count, @side, @group_label, @notes)`,
    )
    .run({
      id,
      name: input.name.trim(),
      phone: input.phone?.trim() || null,
      invited_count: input.invited_count ?? 1,
      side: input.side ?? null,
      group_label: input.group_label?.trim() || null,
      notes: input.notes?.trim() || null,
    });
  return getGuest(id)!;
}

export function getGuest(id: string): Guest | null {
  return (
    (db().prepare("SELECT * FROM guests WHERE id = ?").get(id) as Guest) ||
    null
  );
}

export function listGuests(): GuestWithRsvp[] {
  const rows = db()
    .prepare(
      `SELECT g.*,
              r.id           AS r_id,
              r.attending    AS r_attending,
              r.guests_count AS r_guests_count,
              r.dietary      AS r_dietary,
              r.message      AS r_message,
              r.submitted_at AS r_submitted_at,
              r.updated_at   AS r_updated_at
       FROM guests g
       LEFT JOIN rsvps r ON r.guest_id = g.id
       ORDER BY g.created_at DESC`,
    )
    .all() as Array<Record<string, unknown>>;

  return rows.map((row) => {
    const rsvp: Rsvp | null = row.r_id
      ? {
          id: row.r_id as string,
          guest_id: row.id as string,
          attending: row.r_attending as Rsvp["attending"],
          guests_count: row.r_guests_count as number,
          dietary: (row.r_dietary as string) ?? null,
          message: (row.r_message as string) ?? null,
          submitted_at: row.r_submitted_at as string,
          updated_at: row.r_updated_at as string,
        }
      : null;
    return {
      id: row.id as string,
      name: row.name as string,
      phone: (row.phone as string) ?? null,
      invited_count: row.invited_count as number,
      side: (row.side as Guest["side"]) ?? null,
      group_label: (row.group_label as string) ?? null,
      table_id: (row.table_id as string) ?? null,
      notes: (row.notes as string) ?? null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      rsvp,
    };
  });
}

export function updateGuest(
  id: string,
  patch: Partial<Pick<Guest, "name" | "phone" | "invited_count" | "side" | "group_label" | "table_id" | "notes">>,
): Guest | null {
  const existing = getGuest(id);
  if (!existing) return null;
  const merged = { ...existing, ...patch };
  db()
    .prepare(
      `UPDATE guests
         SET name=@name, phone=@phone, invited_count=@invited_count,
             side=@side, group_label=@group_label, table_id=@table_id, notes=@notes,
             updated_at=CURRENT_TIMESTAMP
       WHERE id=@id`,
    )
    .run({
      id,
      name: merged.name,
      phone: merged.phone ?? null,
      invited_count: merged.invited_count,
      side: merged.side ?? null,
      group_label: merged.group_label ?? null,
      table_id: merged.table_id ?? null,
      notes: merged.notes ?? null,
    });
  return getGuest(id);
}

export function deleteGuest(id: string): boolean {
  const info = db().prepare("DELETE FROM guests WHERE id = ?").run(id);
  return info.changes > 0;
}

// ----- RSVPs -----

export function upsertRsvp(input: {
  guest_id: string;
  attending: Rsvp["attending"];
  guests_count: number;
  dietary?: DietaryPref[] | null;
  message?: string | null;
}): Rsvp {
  const existing = db()
    .prepare("SELECT * FROM rsvps WHERE guest_id = ?")
    .get(input.guest_id) as Rsvp | undefined;

  const dietary = input.dietary?.length ? JSON.stringify(input.dietary) : null;

  if (existing) {
    db()
      .prepare(
        `UPDATE rsvps
           SET attending=@attending, guests_count=@guests_count,
               dietary=@dietary, message=@message, updated_at=CURRENT_TIMESTAMP
         WHERE id=@id`,
      )
      .run({
        id: existing.id,
        attending: input.attending,
        guests_count: input.guests_count,
        dietary,
        message: input.message ?? null,
      });
    return db()
      .prepare("SELECT * FROM rsvps WHERE id = ?")
      .get(existing.id) as Rsvp;
  }

  const id = newId();
  db()
    .prepare(
      `INSERT INTO rsvps (id, guest_id, attending, guests_count, dietary, message)
       VALUES (@id, @guest_id, @attending, @guests_count, @dietary, @message)`,
    )
    .run({
      id,
      guest_id: input.guest_id,
      attending: input.attending,
      guests_count: input.guests_count,
      dietary,
      message: input.message ?? null,
    });
  return db().prepare("SELECT * FROM rsvps WHERE id = ?").get(id) as Rsvp;
}

// ----- Stats -----

export type Stats = {
  total_guests: number;
  total_invited: number;
  responded: number;
  attending_yes: number;
  attending_no: number;
  attending_maybe: number;
  pending: number;
  confirmed_heads: number;
  dietary_counts: Record<string, number>;
};

export function stats(): Stats {
  const d = db();
  const guests = d.prepare("SELECT * FROM guests").all() as Guest[];
  const rsvps = d.prepare("SELECT * FROM rsvps").all() as Rsvp[];

  const rsvpByGuest = new Map(rsvps.map((r) => [r.guest_id, r]));
  let confirmedHeads = 0;
  let yes = 0,
    no = 0,
    maybe = 0;
  const dietaryCounts: Record<string, number> = {};

  for (const g of guests) {
    const r = rsvpByGuest.get(g.id);
    if (!r) continue;
    if (r.attending === "yes") {
      yes++;
      confirmedHeads += r.guests_count;
    } else if (r.attending === "no") {
      no++;
    } else {
      maybe++;
    }
    if (r.dietary) {
      try {
        const arr = JSON.parse(r.dietary) as string[];
        for (const tag of arr) {
          dietaryCounts[tag] = (dietaryCounts[tag] || 0) + r.guests_count;
        }
      } catch {}
    }
  }

  return {
    total_guests: guests.length,
    total_invited: guests.reduce((s, g) => s + g.invited_count, 0),
    responded: rsvps.length,
    attending_yes: yes,
    attending_no: no,
    attending_maybe: maybe,
    pending: guests.length - rsvps.length,
    confirmed_heads: confirmedHeads,
    dietary_counts: dietaryCounts,
  };
}

// ----- Tables -----

export type GuestTable = {
  id: string;
  number: number;
  capacity: number;
  label: string | null;
  notes: string | null;
};

export function listTables(): GuestTable[] {
  return db().prepare("SELECT * FROM tables ORDER BY number").all() as GuestTable[];
}

export function createTable(input: {
  number: number;
  capacity?: number;
  label?: string | null;
  notes?: string | null;
}): GuestTable {
  const id = newId();
  db()
    .prepare(
      `INSERT INTO tables (id, number, capacity, label, notes)
       VALUES (@id, @number, @capacity, @label, @notes)`,
    )
    .run({
      id,
      number: input.number,
      capacity: input.capacity ?? 12,
      label: input.label ?? null,
      notes: input.notes ?? null,
    });
  return db().prepare("SELECT * FROM tables WHERE id = ?").get(id) as GuestTable;
}

export function deleteTable(id: string): boolean {
  return db().prepare("DELETE FROM tables WHERE id = ?").run(id).changes > 0;
}
