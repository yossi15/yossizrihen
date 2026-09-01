"use client";

import { hebDate, directionsUrl } from "@/lib/trip/format";
import { HOLY_BLOCKS, timesFor } from "@/lib/trip/shabbat";
import { PLACES } from "@/lib/trip/places";
import { REGION_BY_ID } from "@/lib/trip/regions";

const KOSHER_PLACES = PLACES.filter(
  (p) => p.category === "chabad" || p.category === "kosher",
);

export default function KosherScreen() {
  return (
    <div className="space-y-3.5 px-4 pb-6 pt-1">
      <section className="trip-card p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--t-teal)]">
          תשרי תשפ&quot;ז
        </p>
        <h2 className="mt-1 text-[17px] font-extrabold tracking-tight">
          לוח שבתות וחגים בטיול
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--t-ink-2)]">
          הטיול נופל בתוך תשרי תשפ&quot;ז — סוכות נכנס כבר ביום השני שלכם.
          הזמנים מחושבים לשקיעה במקום עצמו: נרות 18 דקות לפני השקיעה, צאת
          הכוכבים 40 דקות אחריה. לאימות סופי מול לוח מקומי.
        </p>
      </section>

      {HOLY_BLOCKS.map((b) => {
        const t = timesFor(b.region, b.startDate, b.endDate);
        const region = REGION_BY_ID[b.region];
        const isChag = b.id !== "cholhamoed";
        return (
          <section key={b.id} className="trip-card overflow-hidden">
            <div
              className="flex items-center justify-between p-4"
              style={{
                background: isChag
                  ? "linear-gradient(270deg, rgba(124,92,255,0.14), rgba(124,92,255,0.03))"
                  : "linear-gradient(270deg, rgba(14,156,138,0.14), rgba(14,156,138,0.03))",
              }}
            >
              <div>
                <h3 className="text-[16px] font-extrabold tracking-tight">{b.title}</h3>
                <p className="text-xs text-[var(--t-muted)]">{b.subtitle}</p>
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                style={{ background: region.color }}
              >
                {region.name}
              </span>
            </div>

            {isChag && (
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[var(--t-line)] border-y border-[var(--t-line)] bg-[var(--t-paper)] text-center">
                <div className="p-3">
                  <p className="text-[11px] text-[var(--t-muted)]">
                    נרות {hebDate(b.startDate).short}
                  </p>
                  <p className="mt-0.5 text-xl font-extrabold tabular-nums">
                    {t.candles}
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-[var(--t-muted)]">שקיעה</p>
                  <p className="mt-0.5 text-xl font-bold tabular-nums text-[var(--t-muted)]">
                    {t.sunsetIn}
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-[var(--t-muted)]">
                    צאת {hebDate(b.endDate).short}
                  </p>
                  <p className="mt-0.5 text-xl font-extrabold tabular-nums">
                    {t.havdalah}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 p-4">
              <div>
                <p className="mb-1 text-[11px] font-semibold tracking-wide text-[var(--t-teal)]">
                  מה זה אומר
                </p>
                <ul className="space-y-1">
                  {b.what.map((w) => (
                    <li key={w} className="text-[13.5px] leading-relaxed text-[var(--t-ink-2)]">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold tracking-wide text-[var(--t-coral)]">
                  לתכנון
                </p>
                <ul className="space-y-1">
                  {b.planning.map((w) => (
                    <li
                      key={w}
                      className="flex gap-2 text-[13.5px] leading-relaxed text-[var(--t-ink-2)]"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--t-coral)]" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="inline-block rounded-full bg-[var(--t-paper-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--t-muted)]">
                {b.lengthLabel}
              </p>
            </div>
          </section>
        );
      })}

      <section className="trip-card p-4">
        <h2 className="text-[17px] font-extrabold tracking-tight">
          בתי חב&quot;ד ומסעדות כשרות
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--t-muted)]">
          בתאילנד הכשרות היא כמעט כולה של חב&quot;ד. המיקומים והשעות משתנים בין
          עונות — תמיד לאמת בטלפון או באתר לפני שנוסעים, ולהירשם מראש לסעודות חג.
        </p>
        <ul className="mt-3 space-y-2">
          {KOSHER_PLACES.map((p) => (
            <li
              key={p.id}
              className="flex items-start gap-3 rounded-2xl bg-[var(--t-paper)] p-3"
            >
              <span className="text-lg leading-none">
                {p.category === "chabad" ? "✡" : "🍽"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold">{p.name}</p>
                <p className="text-xs text-[var(--t-muted)]">
                  {REGION_BY_ID[p.region].name} · {p.hook}
                </p>
                {p.tip && (
                  <p className="mt-1 text-xs leading-relaxed text-[var(--t-coral)]">
                    {p.tip}
                  </p>
                )}
              </div>
              <a
                href={directionsUrl(p.lat, p.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full border border-[var(--t-line)] bg-white px-3 py-1.5 text-xs font-semibold"
              >
                מפה
              </a>
            </li>
          ))}
        </ul>
        <a
          href="https://www.chabadthailand.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-full py-3 text-center text-sm font-bold text-white"
          style={{ background: "var(--t-sea)" }}
        >
          אתר חב&quot;ד תאילנד — שעות וזמנים מעודכנים
        </a>
      </section>
    </div>
  );
}
