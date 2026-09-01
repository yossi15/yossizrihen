"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { CATEGORY_META } from "@/lib/trip/categories";
import { REGION_BY_ID } from "@/lib/trip/regions";
import type { Place, RegionId } from "@/lib/trip/types";

type Props = {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  focusRegion: RegionId | "all";
  /** מצב בחירת נקודה — לחיצה על המפה מחזירה קואורדינטות */
  pickMode?: boolean;
  onPick?: (lat: number, lng: number) => void;
};

export default function MapView({
  places,
  selectedId,
  onSelect,
  focusRegion,
  pickMode = false,
  onPick,
}: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef(new Map<string, Marker>());
  const leaflet = useRef<typeof import("leaflet") | null>(null);
  const [ready, setReady] = useState(false);

  // אתחול המפה פעם אחת, אחרי שה-DOM קיים
  useEffect(() => {
    let cancelled = false;
    const markerStore = markers.current;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !holder.current || map.current) return;
      leaflet.current = L;
      const m = L.map(holder.current, {
        center: [10.5, 99.5],
        zoom: 6,
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
          attribution: "&copy; OpenStreetMap &copy; CARTO",
        },
      ).addTo(m);
      map.current = m;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markerStore.clear();
    };
  }, []);

  // סנכרון סמנים עם הרשימה המסוננת
  useEffect(() => {
    const L = leaflet.current;
    const m = map.current;
    if (!L || !m || !ready) return;

    const wanted = new Set(places.map((p) => p.id));
    for (const [id, marker] of markers.current) {
      if (!wanted.has(id)) {
        marker.remove();
        markers.current.delete(id);
      }
    }

    for (const place of places) {
      if (markers.current.has(place.id)) continue;
      const meta = CATEGORY_META[place.category];
      const icon = L.divIcon({
        className: "",
        html: `<div class="trip-pin${place.custom ? " trip-pin-mine" : ""}" style="background:${meta.color}"><span>${meta.icon}</span></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
      const marker = L.marker([place.lat, place.lng], {
        icon,
        title: place.name,
      })
        .addTo(m)
        .on("click", () => onSelect(place.id));
      markers.current.set(place.id, marker);
    }
  }, [places, ready, onSelect]);

  // הדגשת הסמן הנבחר
  useEffect(() => {
    for (const [id, marker] of markers.current) {
      const el = marker.getElement()?.querySelector<HTMLElement>(".trip-pin");
      if (el) el.dataset.active = String(id === selectedId);
    }
    const m = map.current;
    if (!m || !selectedId) return;
    const place = places.find((p) => p.id === selectedId);
    if (!place) return;
    // מזיזים את הנקודה לשליש העליון כדי שגיליון הפרטים לא יכסה אותה
    const zoom = Math.max(m.getZoom(), 12);
    const point = m.project([place.lat, place.lng], zoom);
    point.y += m.getSize().y * 0.2;
    m.flyTo(m.unproject(point, zoom), zoom, { duration: 0.6 });
  }, [selectedId, places]);

  // מצב בחירת נקודה
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;
    const container = m.getContainer();
    container.style.cursor = pickMode ? "crosshair" : "";
    if (!pickMode || !onPick) return;
    const handler = (e: { latlng: { lat: number; lng: number } }) =>
      onPick(e.latlng.lat, e.latlng.lng);
    m.on("click", handler);
    return () => {
      m.off("click", handler);
      container.style.cursor = "";
    };
  }, [pickMode, onPick, ready]);

  // מעבר בין אזורים
  useEffect(() => {
    const L = leaflet.current;
    const m = map.current;
    if (!L || !m || !ready) return;
    if (focusRegion === "all") {
      if (places.length) {
        m.fitBounds(
          L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number])),
          { padding: [50, 50], maxZoom: 10 },
        );
      } else {
        m.setView([10.5, 99.5], 6);
      }
      return;
    }
    const r = REGION_BY_ID[focusRegion];
    m.flyTo([r.lat, r.lng], r.zoom, { duration: 0.8 });
  }, [focusRegion, ready, places]);

  return (
    <div className="relative h-full w-full">
      <div ref={holder} className="h-full w-full" />
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-[var(--t-muted)] text-sm">
          טוען מפה…
        </div>
      )}
    </div>
  );
}
