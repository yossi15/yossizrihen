"use client";

import { useState } from "react";
import { CATEGORY_META } from "@/lib/trip/categories";
import { hebDate, directionsUrl } from "@/lib/trip/format";
import { BASES, ITINERARY } from "@/lib/trip/itinerary";
import { PLACE_BY_ID } from "@/lib/trip/places";
import { REGION_BY_ID } from "@/lib/trip/regions";
import type { Place } from "@/lib/trip/types";

type Props = {
  saved: string[];
  onToggleSave: (id: string) => void;
  customPlaces: Place[];
  onRemovePlace: (id: string) => void;
};

export default function ItineraryScreen({
  saved,
  onToggleSave,
  customPlaces,
  onRemovePlace,
}: Props) {
  const [open, setOpen] = useState<string | null>(ITINERARY[0].date);
  const unassigned = customPlaces.filter((p) => !p.dayDate);

  return (
    <div className="px-4 pb-6 pt-1">
      <div className="trip-card mb-4 p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--t-coral)]">
          הבסיסים שלכם
        </p>
        <ul className="mt-2 space-y-1">
          {BASES.map((b) => (
            <li
              key={`${b.from}-${b.region}`}
              className="flex items-center gap-2 text-[13.5px]"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: REGION_BY_ID[b.region].color }}
              />
              <span className="font-bold">{REGION_BY_ID[b.region].name}</span>
              <span className="text-[var(--t-muted)]">
                {hebDate(b.from).short}–{hebDate(b.to).short} · {b.nights}{" "}
                לילות
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--t-ink-2)]">
          שלוש נקודות שדורשות תשומת לב, וכולן מסומנות בימים עצמם: סוכות ושבת
          ב-25-26.9 בפוקט, הבלוק של שלושה ימי חג בקוסמוי ב-2-4.10 (המעבר
          לקופנגן ב-4.10 הוא יום טוב), והמעבר לבנגקוק ב-9.10 שהוא ערב שבת.
        </p>
      </div>

      <div className="trip-rail relative space-y-2.5">
        {ITINERARY.map((day, i) => {
          const d = hebDate(day.date);
          const region = REGION_BY_ID[day.region];
          const isOpen = open === day.date;
          const mine = customPlaces.filter((p) => p.dayDate === day.date);
          return (
            <div key={day.date} className="relative ps-[62px]">
              <span
                className="absolute start-[13px] top-3 grid h-[30px] w-[30px] place-items-center rounded-full text-[11px] font-extrabold ring-4 ring-[var(--t-paper)]"
                style={{ background: region.color, color: "#fff" }}
              >
                {i + 1}
              </span>

              <div
                className="trip-card overflow-hidden"
                style={
                  day.holy
                    ? { borderColor: "rgba(124,92,255,0.35)" }
                    : undefined
                }
              >
                <button
                  onClick={() => setOpen(isOpen ? null : day.date)}
                  className="flex w-full items-center gap-3 p-3.5 text-right"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[15px] font-bold tracking-tight">
                        {day.title}
                      </span>
                      {day.holy && (
                        <span className="rounded-full bg-[var(--t-violet)]/12 px-2 py-0.5 text-[10px] font-bold text-[var(--t-violet)]">
                          שבת / חג
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-[var(--t-muted)]">
                      יום {d.weekday} · {d.short} · {region.name}
                    </span>
                    {day.move && (
                      <span className="mt-1.5 inline-block rounded-full bg-[var(--t-paper-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--t-ink-2)]">
                        ✈ {day.move}
                      </span>
                    )}
                    {mine.length > 0 && (
                      <span className="mt-1.5 ms-1.5 inline-block rounded-full bg-[var(--t-coral)]/12 px-2.5 py-1 text-[11px] font-bold text-[var(--t-coral)]">
                        +{mine.length} שלי
                      </span>
                    )}
                  </span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--t-paper-2)] text-sm text-[var(--t-muted)]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="trip-rise space-y-3 border-t border-[var(--t-line)] p-3.5">
                    {day.notes && (
                      <ul className="space-y-1.5">
                        {day.notes.map((n) => (
                          <li
                            key={n}
                            className="flex gap-2 text-[13.5px] leading-relaxed text-[var(--t-ink-2)]"
                          >
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--t-coral)]" />
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {mine.length > 0 && (
                      <div className="rounded-2xl bg-[var(--t-coral)]/8 p-3">
                        <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--t-coral)]">
                          המקומות שלי ליום הזה
                        </p>
                        <ul className="space-y-1.5">
                          {mine.map((p) => (
                            <li key={p.id} className="text-[13px]">
                              <a
                                href={directionsUrl(p.lat, p.lng)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold hover:underline"
                              >
                                {CATEGORY_META[p.category].icon} {p.name}
                              </a>
                              {p.note && (
                                <span className="text-[var(--t-ink-2)]">
                                  {" — "}
                                  {p.note}
                                </span>
                              )}
                              <button
                                onClick={() => onRemovePlace(p.id)}
                                className="ms-2 text-[11px] text-[var(--t-muted)] underline"
                              >
                                מחיקה
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {day.places.map((id) => {
                        const p = PLACE_BY_ID[id];
                        if (!p) return null;
                        const meta = CATEGORY_META[p.category];
                        const isSaved = saved.includes(id);
                        return (
                          <span
                            key={id}
                            className="flex items-center gap-1.5 rounded-full bg-[var(--t-paper)] py-1.5 pe-1.5 ps-2.5 text-[12px] font-medium"
                          >
                            <span style={{ color: meta.color }}>
                              {meta.icon}
                            </span>
                            <a
                              href={directionsUrl(p.lat, p.lng)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {p.name}
                            </a>
                            <button
                              onClick={() => onToggleSave(id)}
                              aria-label={`שמירת ${p.name}`}
                              aria-pressed={isSaved}
                              className="px-1 text-[13px]"
                              style={
                                isSaved
                                  ? { color: "var(--t-coral)" }
                                  : { color: "var(--t-muted)" }
                              }
                            >
                              {isSaved ? "★" : "☆"}
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {unassigned.length > 0 && (
        <div className="trip-card mt-4 p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--t-coral)]">
            המקומות שלי בלי יום משויך
          </p>
          <ul className="mt-2 space-y-2">
            {unassigned.map((p) => (
              <li
                key={p.id}
                className="flex items-start gap-2 rounded-2xl bg-[var(--t-paper)] p-3 text-[13px]"
              >
                <span style={{ color: CATEGORY_META[p.category].color }}>
                  {CATEGORY_META[p.category].icon}
                </span>
                <span className="min-w-0 flex-1">
                  <a
                    href={directionsUrl(p.lat, p.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold hover:underline"
                  >
                    {p.name}
                  </a>
                  <span className="block text-[12px] text-[var(--t-muted)]">
                    {REGION_BY_ID[p.region].name}
                    {p.note ? ` · ${p.note}` : ""}
                  </span>
                </span>
                <button
                  onClick={() => onRemovePlace(p.id)}
                  className="shrink-0 text-[11px] text-[var(--t-muted)] underline"
                >
                  מחיקה
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
