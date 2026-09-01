"use client";

import { useState } from "react";
import { TRIP } from "@/lib/trip/itinerary";
import TropicalHero from "./TropicalHero";
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
    <div className="trip-root flex h-[100dvh] justify-center overflow-hidden">
      <div className="trip-shell flex h-full w-full max-w-[560px] flex-col overflow-hidden">
        <TropicalHero countdown={countdown} />

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
                    background: on ? "var(--t-sea)" : "transparent",
                    color: on ? "#fff" : "var(--t-muted)",
                    boxShadow: on
                      ? "0 6px 16px -8px rgba(15,179,163,0.9)"
                      : undefined,
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
    </div>
  );
}
