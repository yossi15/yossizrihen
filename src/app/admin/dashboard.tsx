"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GuestWithRsvp, Stats } from "@/lib/repo";

const DIETARY_LABELS: Record<string, string> = {
  vegan: "טבעוני",
  vegetarian: "צמחוני",
  kosher: "כשר",
  gluten_free: "ללא גלוטן",
  lactose_free: "ללא לקטוז",
  nut_allergy: "אגוזים",
};

type Filter = "all" | "pending" | "yes" | "no";

export default function AdminDashboard({
  initialGuests,
  initialStats,
}: {
  initialGuests: GuestWithRsvp[];
  initialStats: Stats;
}) {
  const [guests, setGuests] = useState(initialGuests);
  const [stats, setStats] = useState(initialStats);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<GuestWithRsvp | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [siteOrigin, setSiteOrigin] = useState("");

  useEffect(() => {
    setSiteOrigin(window.location.origin);
  }, []);

  const refresh = async () => {
    const [gRes, sRes] = await Promise.all([
      fetch("/api/admin/guests"),
      fetch("/api/admin/stats"),
    ]);
    if (gRes.ok) setGuests((await gRes.json()).guests);
    if (sRes.ok) setStats(await sRes.json());
  };

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      if (search && !g.name.includes(search) && !(g.phone || "").includes(search))
        return false;
      if (filter === "pending") return !g.rsvp;
      if (filter === "yes") return g.rsvp?.attending === "yes";
      if (filter === "no") return g.rsvp?.attending === "no";
      return true;
    });
  }, [guests, search, filter]);

  const dietarySummary = useMemo(() => {
    return Object.entries(stats.dietary_counts).sort((a, b) => b[1] - a[1]);
  }, [stats]);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-6xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-3xl">ניהול הזמנות</h1>
          <p className="text-sm text-white/55">החתונה של אלירן ו-ונסה</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/admin/export"
            className="px-3 py-2 text-sm rounded border border-white/15 hover:bg-white/5"
          >
            ייצוא CSV
          </a>
          <button
            onClick={logout}
            className="px-3 py-2 text-sm rounded border border-white/15 hover:bg-white/5"
          >
            יציאה
          </button>
        </div>
      </header>

      {/* Stats grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="אורחים מוזמנים" value={stats.total_invited} />
        <Stat
          label="אישרו הגעה"
          value={stats.confirmed_heads}
          accent="green"
        />
        <Stat label="לא יגיעו" value={stats.attending_no} accent="red" />
        <Stat label="ממתינים לתשובה" value={stats.pending} accent="yellow" />
      </section>

      {dietarySummary.length > 0 && (
        <section className="mb-6 bg-[#1a2530] border border-white/10 rounded-md p-4">
          <p className="text-xs tracking-[0.3em] text-white/55 mb-2">
            העדפות תזונה (לפי מספר סועדים)
          </p>
          <div className="flex flex-wrap gap-2">
            {dietarySummary.map(([k, v]) => (
              <span
                key={k}
                className="px-3 py-1 text-sm rounded-full bg-[var(--gold-deep)]/30 border border-[var(--gold)]/40"
              >
                {DIETARY_LABELS[k] ?? k}: {v}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Toolbar */}
      <section className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם/טלפון"
          className="bg-[#1a2530] border border-white/15 rounded px-3 py-2 text-sm flex-1 min-w-[180px] outline-none focus:border-[var(--gold)]"
        />
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label={`הכל (${guests.length})`}
        />
        <FilterChip
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
          label={`ממתינים (${stats.pending})`}
        />
        <FilterChip
          active={filter === "yes"}
          onClick={() => setFilter("yes")}
          label={`מגיעים (${stats.attending_yes})`}
        />
        <FilterChip
          active={filter === "no"}
          onClick={() => setFilter("no")}
          label={`לא מגיעים (${stats.attending_no})`}
        />
        <button
          onClick={() => setShowAdd(true)}
          className="px-3 py-2 text-sm rounded bg-[var(--gold-deep)] hover:bg-[var(--gold)]"
        >
          + אורח חדש
        </button>
        <ImportButton onDone={refresh} />
      </section>

      {/* Guest table */}
      <section className="bg-[#1a2530] border border-white/10 rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-white/55 text-right">
            <tr>
              <th className="p-3">שם</th>
              <th className="p-3">טלפון</th>
              <th className="p-3">הוזמנו</th>
              <th className="p-3">סטטוס</th>
              <th className="p-3">מגיעים</th>
              <th className="p-3">העדפות</th>
              <th className="p-3">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <GuestRow
                key={g.id}
                g={g}
                origin={siteOrigin}
                onEdit={() => setEditing(g)}
                onDelete={async () => {
                  if (!confirm(`למחוק את ${g.name}?`)) return;
                  await fetch(`/api/admin/guests/${g.id}`, { method: "DELETE" });
                  refresh();
                }}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-white/40">
                  אין אורחים להצגה
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {(showAdd || editing) && (
        <GuestModal
          guest={editing}
          onClose={() => {
            setShowAdd(false);
            setEditing(null);
          }}
          onSaved={() => {
            setShowAdd(false);
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "green" | "red" | "yellow";
}) {
  const color =
    accent === "green"
      ? "text-emerald-300"
      : accent === "red"
        ? "text-red-300"
        : accent === "yellow"
          ? "text-amber-300"
          : "text-white";
  return (
    <div className="bg-[#1a2530] border border-white/10 rounded-md p-4">
      <p className="text-xs tracking-[0.25em] text-white/55 mb-1">{label}</p>
      <p className={`font-serif text-3xl ${color}`}>{value}</p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm rounded border transition-colors ${
        active
          ? "bg-[var(--gold-deep)] border-[var(--gold-deep)]"
          : "border-white/15 hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}

function GuestRow({
  g,
  origin,
  onEdit,
  onDelete,
}: {
  g: GuestWithRsvp;
  origin: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const link = `${origin}/i/${g.id}`;
  const dietary = g.rsvp?.dietary
    ? safeParseDietary(g.rsvp.dietary)
        .map((d) => DIETARY_LABELS[d] ?? d)
        .join(", ")
    : "";

  const status = !g.rsvp
    ? { label: "ממתין", color: "bg-amber-400/20 text-amber-200 border-amber-400/40" }
    : g.rsvp.attending === "yes"
      ? { label: "מגיע", color: "bg-emerald-400/20 text-emerald-200 border-emerald-400/40" }
      : g.rsvp.attending === "no"
        ? { label: "לא מגיע", color: "bg-red-400/20 text-red-200 border-red-400/40" }
        : { label: "אולי", color: "bg-blue-400/20 text-blue-200 border-blue-400/40" };

  return (
    <tr className="border-t border-white/5">
      <td className="p-3 font-serif">{g.name}</td>
      <td className="p-3 text-white/70" dir="ltr">
        {g.phone || "—"}
      </td>
      <td className="p-3">{g.invited_count}</td>
      <td className="p-3">
        <span className={`px-2 py-0.5 text-xs rounded border ${status.color}`}>
          {status.label}
        </span>
      </td>
      <td className="p-3">{g.rsvp?.guests_count ?? "—"}</td>
      <td className="p-3 text-white/70 text-xs">{dietary || "—"}</td>
      <td className="p-3">
        <div className="flex flex-wrap gap-1">
          <WhatsAppButton guest={g} link={link} />
          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="px-2 py-1 text-xs rounded border border-white/15 hover:bg-white/5"
            title={link}
          >
            העתק קישור
          </button>
          <button
            onClick={onEdit}
            className="px-2 py-1 text-xs rounded border border-white/15 hover:bg-white/5"
          >
            ערוך
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 text-xs rounded border border-red-400/30 hover:bg-red-400/10 text-red-300"
          >
            מחק
          </button>
        </div>
      </td>
    </tr>
  );
}

function safeParseDietary(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function WhatsAppButton({ guest, link }: { guest: GuestWithRsvp; link: string }) {
  const phone = (guest.phone || "").replace(/\D/g, "");
  // Israeli numbers: convert leading 0 to country code 972
  const intl = phone.startsWith("0") ? `972${phone.slice(1)}` : phone;
  const message = `היי ${guest.name}, מזמינים אותך לחתונה שלנו! ✨\nכל הפרטים והאישור הגעה כאן: ${link}`;
  const url = intl
    ? `https://wa.me/${intl}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="px-2 py-1 text-xs rounded bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-100"
    >
      וואטסאפ
    </a>
  );
}

function ImportButton({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          const text = await file.text();
          const res = await fetch("/api/admin/import", {
            method: "POST",
            headers: { "Content-Type": "text/csv" },
            body: text,
          });
          setBusy(false);
          if (!res.ok) {
            alert("ייבוא נכשל: " + (await res.text()));
            return;
          }
          const { added, errors } = await res.json();
          alert(`נוספו ${added} אורחים${errors?.length ? `\nשגיאות:\n${errors.join("\n")}` : ""}`);
          if (ref.current) ref.current.value = "";
          onDone();
        }}
      />
      <button
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="px-3 py-2 text-sm rounded border border-white/15 hover:bg-white/5 disabled:opacity-60"
      >
        {busy ? "מייבא…" : "ייבוא CSV"}
      </button>
    </>
  );
}

function GuestModal({
  guest,
  onClose,
  onSaved,
}: {
  guest: GuestWithRsvp | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(guest?.name ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [count, setCount] = useState(guest?.invited_count ?? 1);
  const [side, setSide] = useState<string>(guest?.side ?? "");
  const [groupLabel, setGroupLabel] = useState(guest?.group_label ?? "");
  const [notes, setNotes] = useState(guest?.notes ?? "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!name.trim()) return alert("חסר שם");
    setBusy(true);
    const body = {
      name: name.trim(),
      phone: phone.trim() || null,
      invited_count: count,
      side: side || null,
      group_label: groupLabel.trim() || null,
      notes: notes.trim() || null,
    };
    const res = guest
      ? await fetch(`/api/admin/guests/${guest.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/admin/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
    setBusy(false);
    if (!res.ok) return alert("שמירה נכשלה");
    onSaved();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a2530] border border-white/10 rounded-md w-full max-w-md p-6 flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-xl mb-2">
          {guest ? "עריכת אורח" : "אורח חדש"}
        </h2>
        <ModalField label="שם">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#0f1620] border border-white/15 rounded px-3 py-2 outline-none focus:border-[var(--gold)]"
          />
        </ModalField>
        <ModalField label="טלפון">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            className="w-full bg-[#0f1620] border border-white/15 rounded px-3 py-2 outline-none focus:border-[var(--gold)]"
            placeholder="050-0000000"
          />
        </ModalField>
        <div className="grid grid-cols-2 gap-3">
          <ModalField label="כמות שהוזמנו">
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              className="w-full bg-[#0f1620] border border-white/15 rounded px-3 py-2 outline-none focus:border-[var(--gold)]"
            />
          </ModalField>
          <ModalField label="צד">
            <select
              value={side}
              onChange={(e) => setSide(e.target.value)}
              className="w-full bg-[#0f1620] border border-white/15 rounded px-3 py-2 outline-none focus:border-[var(--gold)]"
            >
              <option value="">—</option>
              <option value="groom">חתן</option>
              <option value="bride">כלה</option>
              <option value="both">משותף</option>
            </select>
          </ModalField>
        </div>
        <ModalField label="קבוצה (משפחה / חברים / עבודה...)">
          <input
            value={groupLabel}
            onChange={(e) => setGroupLabel(e.target.value)}
            className="w-full bg-[#0f1620] border border-white/15 rounded px-3 py-2 outline-none focus:border-[var(--gold)]"
          />
        </ModalField>
        <ModalField label="הערות">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-[#0f1620] border border-white/15 rounded px-3 py-2 outline-none focus:border-[var(--gold)] resize-none"
          />
        </ModalField>
        <div className="flex gap-2 mt-2">
          <button
            onClick={save}
            disabled={busy}
            className="flex-1 px-4 py-2 rounded bg-[var(--gold-deep)] hover:bg-[var(--gold)] disabled:opacity-60"
          >
            {busy ? "שומר…" : "שמירה"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-white/15 hover:bg-white/5"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs tracking-[0.2em] text-white/55">{label}</span>
      {children}
    </label>
  );
}
