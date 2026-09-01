"use client";

import { useState } from "react";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/trip/categories";
import { hebDate, parseLatLng } from "@/lib/trip/format";
import { ITINERARY } from "@/lib/trip/itinerary";
import { REGIONS } from "@/lib/trip/regions";
import type { Category, Place, RegionId } from "@/lib/trip/types";

type Props = {
  /** נקודה שנבחרה בלחיצה על המפה, אם יש */
  picked: { lat: number; lng: number } | null;
  onRequestPick: () => void;
  onClose: () => void;
  onAdd: (place: Omit<Place, "id" | "custom">) => void;
  defaultRegion: RegionId;
};

const field =
  "w-full rounded-xl border border-[var(--t-line)] bg-[var(--t-paper)] px-3 py-2.5 text-sm outline-none focus:border-[var(--t-ink)]";

export default function AddPlaceDialog({
  picked,
  onRequestPick,
  onClose,
  onAdd,
  defaultRegion,
}: Props) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState<RegionId>(defaultRegion);
  const [category, setCategory] = useState<Category>("beach");
  const [dayDate, setDayDate] = useState("");
  const [coords, setCoords] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const parsed = picked ?? parseLatLng(coords);

  function submit() {
    if (!name.trim()) {
      setError("צריך שם למקום");
      return;
    }
    if (!parsed) {
      setError("צריך מיקום — הדביקו קישור מגוגל מפות, קואורדינטות, או בחרו על המפה");
      return;
    }
    onAdd({
      name: name.trim(),
      nameEn: name.trim(),
      region,
      category,
      lat: parsed.lat,
      lng: parsed.lng,
      hook: note.trim() || "מקום שהוספתי",
      note: note.trim() || undefined,
      dayDate: dayDate || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[900] flex items-end justify-center bg-[rgba(20,49,60,0.35)] p-3 sm:items-center">
      <div className="trip-rise max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">
            הוספת מקום משלי
          </h2>
          <button
            onClick={onClose}
            aria-label="סגירה"
            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--t-line)] text-[var(--t-muted)]"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-[var(--t-muted)]">
              שם המקום
            </span>
            <input
              className={field}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="למשל: המסעדה שהמליצו עליה בקארון"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-[var(--t-muted)]">
                עיר
              </span>
              <select
                className={field}
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionId)}
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-bold text-[var(--t-muted)]">
                קטגוריה
              </span>
              <select
                className={field}
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-[var(--t-muted)]">
              לשייך ליום במסלול (לא חובה)
            </span>
            <select
              className={field}
              value={dayDate}
              onChange={(e) => setDayDate(e.target.value)}
            >
              <option value="">בלי יום מסוים</option>
              {ITINERARY.map((d) => (
                <option key={d.date} value={d.date}>
                  {hebDate(d.date).short} — {d.title}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-1 block text-xs font-bold text-[var(--t-muted)]">
              מיקום
            </span>
            {picked ? (
              <div className="flex items-center justify-between rounded-xl bg-[var(--t-teal)]/10 px-3 py-2.5 text-sm">
                <span className="font-semibold text-[var(--t-teal)]">
                  נבחר על המפה · {picked.lat.toFixed(4)}, {picked.lng.toFixed(4)}
                </span>
                <button
                  onClick={onRequestPick}
                  className="text-xs font-semibold underline"
                >
                  שינוי
                </button>
              </div>
            ) : (
              <>
                <input
                  className={field}
                  value={coords}
                  onChange={(e) => setCoords(e.target.value)}
                  placeholder="הדביקו קישור מגוגל מפות, או 7.8460, 98.2940"
                  dir="ltr"
                />
                <button
                  onClick={onRequestPick}
                  className="mt-2 w-full rounded-xl border border-[var(--t-line)] py-2.5 text-sm font-semibold"
                >
                  או בחרו נקודה על המפה
                </button>
                {coords && !parsed && (
                  <p className="mt-1.5 text-xs text-[var(--t-coral)]">
                    לא זיהיתי קואורדינטות. קישור מקוצר (maps.app.goo.gl) לא
                    עובד — פתחו אותו ואז העתיקו את הכתובת המלאה.
                  </p>
                )}
              </>
            )}
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-bold text-[var(--t-muted)]">
              הערה (לא חובה)
            </span>
            <textarea
              className={`${field} min-h-[72px] resize-y`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="למה שמרתי את זה, מה להזמין, מתי הכי טוב להגיע…"
            />
          </label>

          {error && (
            <p className="text-sm font-semibold text-[var(--t-coral)]">
              {error}
            </p>
          )}

          <button
            onClick={submit}
            className="w-full rounded-full bg-[var(--t-ink)] py-3 text-sm font-bold text-white"
          >
            הוספה למסלול
          </button>
          <p className="text-center text-[11px] text-[var(--t-muted)]">
            המקומות שלכם נשמרים בדפדפן הזה בלבד.
          </p>
        </div>
      </div>
    </div>
  );
}
