"use client";

import { useState } from "react";
import { TRIP } from "@/lib/trip/itinerary";
import { daysUntil } from "@/lib/trip/format";
import { useIsClient, useSaved } from "./useSaved";
import { useCustomPlaces } from "./useCustomPlaces";
import MapScreen from "./MapScreen";
import ItineraryScreen from "./ItineraryScreen";
import KosherScreen from "./KosherScreen";
import InfoScreen from "./InfoScreen";

type Tab = "map" | "days" | "kosher" | "info";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "map", label: "מפה", icon: "◎" },
  { id: "days", label: "מסלול", icon: "▤" },
  { id: "kosher", label: "כשרות", icon: "✡" },
  { id: "info", label: "מידע", icon: "◆" },
];

export default function TripApp() {
  const [tab, setTab] = useState<Tab>("map");
  const { saved, toggle } = useSaved();
  const { customPlaces, add, remove } = useCustomPlaces();
  // נספר רק בדפדפן כדי שה-SSR וההידרציה יסכימו
  const isClient = useIsClient();
  const countdown = isClient ? daysUntil(TRIP.start) : null;

  return (
    <div className="trip-root flex h-[100dvh] flex-col overflow-hidden">
      <header className="shrink-0 px-5 pb-3 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--t-coral)]">
              המסלול שלנו
            </p>
            <h1 className="mt-0.5 text-[30px] font-extrabold leading-none tracking-tight">
              תאילנד
              <span className="ms-2 text-[var(--t-muted)]">2026</span>
            </h1>
            <p className="mt-1.5 text-[13px] text-[var(--t-muted)]">
              24.9 — 11.10 · {TRIP.days} ימים · 5 יעדים
            </p>
          </div>
          {countdown !== null && countdown > 0 && (
            <div className="grid h-[62px] w-[62px] shrink-0 place-items-center rounded-2xl bg-[var(--t-ink)] text-white">
              <span className="text-[22px] font-extrabold leading-none tabular-nums">
                {countdown}
              </span>
              <span className="text-[9px] tracking-wide text-white/60">
                ימים
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {tab === "map" && (
          <MapScreen
            saved={saved}
            onToggleSave={toggle}
            customPlaces={customPlaces}
            onAddPlace={add}
            onRemovePlace={remove}
          />
        )}
        {tab === "days" && (
          <ItineraryScreen
            saved={saved}
            onToggleSave={toggle}
            customPlaces={customPlaces}
            onRemovePlace={remove}
          />
        )}
        {tab === "kosher" && <KosherScreen />}
        {tab === "info" && <InfoScreen />}
      </main>

      <nav className="shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <div className="trip-card mx-auto grid max-w-md grid-cols-4 rounded-full p-1.5">
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={on ? "page" : undefined}
                className="flex flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-semibold transition-colors"
                style={{
                  background: on ? "var(--t-ink)" : "transparent",
                  color: on ? "#fff" : "var(--t-muted)",
                }}
              >
                <span className="text-base leading-none">{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
