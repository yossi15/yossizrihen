"use client";

import { CATEGORY_META } from "@/lib/trip/categories";
import { REGION_BY_ID } from "@/lib/trip/regions";
import { directionsUrl } from "@/lib/trip/format";
import type { Place } from "@/lib/trip/types";

type Props = {
  place: Place;
  onClose: () => void;
  saved: boolean;
  onToggleSave: () => void;
  /** קיים רק למקומות שהמשתמש הוסיף */
  onRemove?: () => void;
};

export default function PlaceSheet({
  place,
  onClose,
  saved,
  onToggleSave,
  onRemove,
}: Props) {
  const meta = CATEGORY_META[place.category];
  const region = REGION_BY_ID[place.region];

  return (
    <div className="trip-rise absolute inset-x-2 bottom-2 z-[600] max-h-[58%] overflow-y-auto rounded-3xl border border-[var(--t-line)] bg-white p-4 shadow-[0_-4px_40px_-12px_rgba(20,49,60,0.35)] sm:inset-x-auto sm:bottom-3 sm:end-3 sm:w-[380px]">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg"
          style={{ background: `${meta.color}1f`, color: meta.color }}
        >
          {meta.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[19px] font-extrabold leading-tight tracking-tight">
            {place.name}
          </h3>
          <p className="text-xs text-[var(--t-muted)]">
            {place.custom ? "המקום שלי" : place.nameEn} · {region.name}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="סגירה"
          className="grid h-8 w-8 place-items-center rounded-full border border-[var(--t-line)] text-[var(--t-muted)] hover:bg-[var(--t-paper-2)]"
        >
          ✕
        </button>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed">{place.hook}</p>

      {place.details && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--t-muted)]">
          {place.details}
        </p>
      )}

      {place.tip && (
        <div className="mt-3 rounded-2xl bg-[var(--t-paper)] p-3">
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--t-coral)]">
            טיפ
          </p>
          <p className="text-sm leading-relaxed">{place.tip}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--t-muted)]">
        {place.duration && (
          <span className="rounded-full bg-[var(--t-paper-2)] px-2.5 py-1">
            ⏱ {place.duration}
          </span>
        )}
        {place.priceThb !== undefined && (
          <span className="rounded-full bg-[var(--t-paper-2)] px-2.5 py-1">
            {place.priceThb === 0 ? "חינם" : `~${place.priceThb} ฿`}
          </span>
        )}
        {place.approx && (
          <span className="rounded-full bg-[var(--t-coral)]/10 px-2.5 py-1 font-semibold text-[var(--t-coral)]">
            מיקום משוער — לאמת
          </span>
        )}
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="mt-3 text-xs font-semibold text-[var(--t-coral)] underline"
        >
          מחיקת המקום
        </button>
      )}

      <div className="mt-4 flex gap-2">
        <a
          href={directionsUrl(place.lat, place.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full py-3 text-center text-sm font-bold text-white"
          style={{
            background: "var(--t-sea)",
            boxShadow: "0 8px 20px -10px rgba(15,179,163,0.95)",
          }}
        >
          ניווט בגוגל מפות
        </a>
        {place.url && (
          <a
            href={place.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--t-line)] px-4 py-3 text-sm font-semibold"
          >
            אתר
          </a>
        )}
        <button
          onClick={onToggleSave}
          aria-pressed={saved}
          className="rounded-full border border-[var(--t-line)] px-4 py-3 text-sm"
          style={saved ? { color: "var(--t-coral)" } : undefined}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
