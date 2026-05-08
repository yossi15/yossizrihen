"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "idle" | "submitting" | "success" | "error";

type Guest = {
  token: string;
  name: string;
  invitedCount: number;
};

const DIETARY_OPTIONS = [
  { id: "vegan", label: "טבעוני" },
  { id: "vegetarian", label: "צמחוני" },
  { id: "gluten_free", label: "ללא גלוטן" },
  { id: "lactose_free", label: "ללא לקטוז" },
  { id: "nut_allergy", label: "אלרגיה לאגוזים" },
] as const;

export default function RsvpForm({ guest }: { guest?: Guest }) {
  const [name, setName] = useState(guest?.name ?? "");
  const [guests, setGuests] = useState(guest?.invitedCount ?? 1);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [phone, setPhone] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const toggleDietary = (id: string) =>
    setDietary((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("נא להזין שם");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: guest?.token,
          name,
          guests,
          attending,
          phone,
          dietary: attending === "yes" ? dietary : [],
          message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("אירעה שגיאה. נסו שוב.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 px-6 rounded-md bg-[var(--cream-soft)] border border-[var(--gold)]/40"
          >
            <p className="font-serif text-2xl text-[var(--sea-deep)] mb-2">תודה רבה</p>
            <p className="text-sm text-[var(--ink-soft)]">
              אישור ההגעה התקבל. נתראה בשמחות!
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <Field label="שם מלא">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-[var(--gold)]/40 bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--gold-deep)] focus:ring-1 focus:ring-[var(--gold-deep)]"
                placeholder="הקלידו את שמכם"
                autoComplete="name"
                readOnly={!!guest}
              />
            </Field>

            <Field label="טלפון (לא חובה)">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-[var(--gold)]/40 bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--gold-deep)] focus:ring-1 focus:ring-[var(--gold-deep)]"
                placeholder="050-0000000"
                autoComplete="tel"
                dir="ltr"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="מגיעים?">
                <div className="grid grid-cols-2 gap-1 rounded-md border border-[var(--gold)]/40 bg-[var(--cream-soft)] p-1">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    className={`py-2 rounded text-sm transition-colors ${
                      attending === "yes"
                        ? "bg-[var(--gold-deep)] text-white"
                        : "text-[var(--ink-soft)]"
                    }`}
                  >
                    כן
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className={`py-2 rounded text-sm transition-colors ${
                      attending === "no"
                        ? "bg-[var(--gold-deep)] text-white"
                        : "text-[var(--ink-soft)]"
                    }`}
                  >
                    לא
                  </button>
                </div>
              </Field>

              <Field label="מספר אורחים">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value) || 1)}
                  className="w-full rounded-md border border-[var(--gold)]/40 bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--gold-deep)] focus:ring-1 focus:ring-[var(--gold-deep)]"
                  disabled={attending === "no"}
                />
              </Field>
            </div>

            {attending === "yes" && (
              <Field label="העדפות תזונה (לא חובה)">
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((opt) => {
                    const active = dietary.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleDietary(opt.id)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          active
                            ? "bg-[var(--gold-deep)] text-white border-[var(--gold-deep)]"
                            : "bg-[var(--cream-soft)] text-[var(--ink-soft)] border-[var(--gold)]/40 hover:border-[var(--gold-deep)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
            )}

            <Field label="הערה / ברכה (לא חובה)">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-[var(--gold)]/40 bg-[var(--cream-soft)] px-4 py-3 outline-none focus:border-[var(--gold-deep)] focus:ring-1 focus:ring-[var(--gold-deep)] resize-none"
                placeholder="מחכים לראותכם..."
              />
            </Field>

            {error && (
              <p className="text-sm text-[var(--wax)] text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 rounded-md bg-[var(--gold-deep)] px-6 py-3.5 text-sm tracking-[0.25em] text-white hover:bg-[var(--gold)] transition-colors disabled:opacity-60"
            >
              {status === "submitting" ? "שולח…" : "אישור הגעה"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs tracking-[0.2em] text-[var(--ink-soft)] uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
