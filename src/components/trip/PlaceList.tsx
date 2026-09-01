"use client";

import { CATEGORY_META } from "@/lib/trip/categories";
import { directionsUrl } from "@/lib/trip/format";
import { REGIONS } from "@/lib/trip/regions";
import type { Place } from "@/lib/trip/types";

type Props = {
  places: Place[];
  saved: string[];
  onToggleSave: (id: string) => void;
  onRemovePlace: (id: string) => void;
};

/** רשימה מקובצת לפי אזור — הדרך היחידה לראות מקומות שיושבים באותה כתובת */
export default function PlaceList({
  places,
  saved,
  onToggleSave,
  onRemovePlace,
}: Props) {
  const groups = REGIONS.map((r) => ({
    region: r,
    items: places.filter((p) => p.region === r.id),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-[var(--t-muted)]">
        אין מקומות שמתאימים לסינון הזה.
      </p>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-3">
      {groups.map(({ region, items }) => (
        <section key={region.id} className="mb-4">
          <h3 className="mb-2 flex items-center gap-2 px-1 text-[13px] font-extrabold">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: region.color }}
            />
            {region.name}
            <span className="font-normal text-[var(--t-muted)]">
              {items.length}
            </span>
          </h3>

          <ul className="space-y-2">
            {items.map((p) => {
              const meta = CATEGORY_META[p.category];
              const isSaved = saved.includes(p.id);
              return (
                <li
                  key={p.id}
                  className="rounded-2xl border border-[var(--t-line)] bg-white p-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm"
                      style={{ background: `${meta.color}22`, color: meta.color }}
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14.5px] font-bold leading-snug">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--t-ink-2)]">
                        {p.hook}
                      </p>
                      {p.hours && (
                        <p className="mt-1 text-[12px] text-[var(--t-muted)]">
                          🕐 {p.hours}
                        </p>
                      )}
                      {p.address && (
                        <p className="mt-0.5 text-[12px] text-[var(--t-muted)]">
                          {p.address}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onToggleSave(p.id)}
                      aria-label={`שמירת ${p.name}`}
                      aria-pressed={isSaved}
                      className="shrink-0 px-1 text-base"
                      style={{
                        color: isSaved ? "var(--t-coral)" : "var(--t-muted)",
                      }}
                    >
                      {isSaved ? "★" : "☆"}
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
                    <a
                      href={directionsUrl(p.lat, p.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[var(--t-paper)] px-3 py-1 font-semibold"
                    >
                      ניווט
                    </a>
                    {p.phone && (
                      <a
                        href={`tel:${p.phone.replace(/[^+\d]/g, "")}`}
                        dir="ltr"
                        className="rounded-full bg-[var(--t-paper)] px-3 py-1 font-semibold text-[var(--t-teal)]"
                      >
                        {p.phone}
                      </a>
                    )}
                    {p.priceThb !== undefined && p.priceThb > 0 && (
                      <span className="text-[var(--t-muted)]">
                        ~{p.priceThb} ฿
                      </span>
                    )}
                    {p.approx && (
                      <span className="text-[var(--t-coral)]">
                        מיקום משוער
                      </span>
                    )}
                    {p.custom && (
                      <button
                        onClick={() => onRemovePlace(p.id)}
                        className="text-[var(--t-muted)] underline"
                      >
                        מחיקה
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <p className="px-1 pb-2 text-[11px] text-[var(--t-muted)]">
        {places.length} מקומות
      </p>
    </div>
  );
}
