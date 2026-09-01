"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/trip/categories";
import { PLACES } from "@/lib/trip/places";
import { REGIONS } from "@/lib/trip/regions";
import type { Category, Place, RegionId } from "@/lib/trip/types";
import AddPlaceDialog from "./AddPlaceDialog";
import PlaceSheet from "./PlaceSheet";

// Leaflet נוגע ב-window, ולכן נטען רק בדפדפן
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-[var(--t-muted)]">
      טוען מפה…
    </div>
  ),
});

type Props = {
  saved: string[];
  onToggleSave: (id: string) => void;
  customPlaces: Place[];
  onAddPlace: (place: Omit<Place, "id" | "custom">) => void;
  onRemovePlace: (id: string) => void;
};

export default function MapScreen({
  saved,
  onToggleSave,
  customPlaces,
  onAddPlace,
  onRemovePlace,
}: Props) {
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [cats, setCats] = useState<Category[]>([]);
  const [onlySaved, setOnlySaved] = useState(false);
  const [onlyMine, setOnlyMine] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pickMode, setPickMode] = useState(false);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const all = useMemo(() => [...customPlaces, ...PLACES], [customPlaces]);

  const places = useMemo(
    () =>
      all.filter(
        (p) =>
          (region === "all" || p.region === region) &&
          (cats.length === 0 || cats.includes(p.category)) &&
          (!onlySaved || saved.includes(p.id)) &&
          (!onlyMine || p.custom === true),
      ),
    [all, region, cats, onlySaved, onlyMine, saved],
  );

  const selected = places.find((p) => p.id === selectedId) ?? null;

  function toggleCat(c: Category) {
    setCats((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
    setSelectedId(null);
  }

  const handlePick = useCallback((lat: number, lng: number) => {
    setPicked({ lat, lng });
    setPickMode(false);
    setDialogOpen(true);
  }, []);

  return (
    <div className="flex h-full flex-col pt-1">
      <div className="shrink-0 space-y-2 px-4 pb-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            data-on={region === "all"}
            onClick={() => {
              setRegion("all");
              setSelectedId(null);
            }}
            className="trip-chip shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold"
          >
            הכל
          </button>
          {REGIONS.map((r) => (
            <button
              key={r.id}
              data-on={region === r.id}
              onClick={() => {
                setRegion(r.id);
                setSelectedId(null);
              }}
              className="trip-chip shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold"
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            data-on={onlyMine}
            onClick={() => setOnlyMine((v) => !v)}
            className="trip-chip trip-chip-soft shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
          >
            שלי{customPlaces.length > 0 ? ` ${customPlaces.length}` : ""}
          </button>
          <button
            data-on={onlySaved}
            onClick={() => setOnlySaved((v) => !v)}
            className="trip-chip trip-chip-soft shrink-0 rounded-full px-3 py-1.5 text-xs"
          >
            ★ שמורים{saved.length > 0 ? ` ${saved.length}` : ""}
          </button>
          {CATEGORY_ORDER.map((c) => (
            <button
              key={c}
              data-on={cats.includes(c)}
              onClick={() => toggleCat(c)}
              className="trip-chip shrink-0 rounded-full px-3 py-1.5 text-xs"
            >
              <span
                style={{
                  color: cats.includes(c) ? "#fff" : CATEGORY_META[c].color,
                }}
              >
                {CATEGORY_META[c].icon}
              </span>{" "}
              {CATEGORY_META[c].label}
            </button>
          ))}
        </div>
      </div>

      <div className="trip-card relative mx-4 mb-1 min-h-0 flex-1 overflow-hidden">
        <MapView
          places={places}
          selectedId={selectedId}
          onSelect={setSelectedId}
          focusRegion={region}
          pickMode={pickMode}
          onPick={handlePick}
        />

        <div className="pointer-events-none absolute start-3 top-3 z-[500] rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--t-ink)] shadow-sm backdrop-blur">
          {places.length} מקומות
        </div>

        {pickMode && (
          <div className="absolute inset-x-3 top-3 z-[600] flex items-center justify-between gap-2 rounded-full bg-[var(--t-ink)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
            <span>לחצו על המפה כדי לסמן את המקום</span>
            <button
              onClick={() => {
                setPickMode(false);
                setDialogOpen(true);
              }}
              className="shrink-0 text-xs underline"
            >
              ביטול
            </button>
          </div>
        )}

        {!pickMode && !selected && (
          <button
            onClick={() => {
              setPicked(null);
              setDialogOpen(true);
            }}
            className="absolute bottom-4 end-4 z-[600] flex items-center gap-2 rounded-full bg-[var(--t-coral)] px-4 py-3 text-sm font-bold text-white shadow-lg"
          >
            <span className="text-lg leading-none">+</span>
            מקום שלי
          </button>
        )}

        {selected && (
          <PlaceSheet
            place={selected}
            onClose={() => setSelectedId(null)}
            saved={saved.includes(selected.id)}
            onToggleSave={() => onToggleSave(selected.id)}
            onRemove={
              selected.custom
                ? () => {
                    onRemovePlace(selected.id);
                    setSelectedId(null);
                  }
                : undefined
            }
          />
        )}
      </div>

      {dialogOpen && (
        <AddPlaceDialog
          picked={picked}
          defaultRegion={region === "all" ? "phuket" : region}
          onRequestPick={() => {
            setDialogOpen(false);
            setPicked(null);
            setPickMode(true);
          }}
          onClose={() => {
            setDialogOpen(false);
            setPicked(null);
          }}
          onAdd={onAddPlace}
        />
      )}
    </div>
  );
}
