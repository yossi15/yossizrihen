"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Place } from "@/lib/trip/types";

const KEY = "thailand2026:myplaces";
const EMPTY: Place[] = [];

let cachedRaw: string | null = null;
let cachedValue: Place[] = EMPTY;
const listeners = new Set<() => void>();

function readSnapshot(): Place[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // אחסון חסום — ממשיכים בלי מקומות שמורים
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? (JSON.parse(raw) as Place[]) : EMPTY;
      cachedValue = Array.isArray(parsed) ? parsed : EMPTY;
    } catch {
      cachedValue = EMPTY;
    }
  }
  return cachedValue;
}

function serverSnapshot(): Place[] {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function commit(next: Place[]) {
  const raw = JSON.stringify(next);
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    // ממשיכים בזיכרון בלבד
  }
  cachedRaw = raw;
  cachedValue = next;
  for (const listener of listeners) listener();
}

/** המקומות שהמשתמש הוסיף — נשמרים בדפדפן שלו בלבד */
export function useCustomPlaces() {
  const places = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot);

  const add = useCallback((place: Omit<Place, "id" | "custom">) => {
    const id = `my-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    commit([...readSnapshot(), { ...place, id, custom: true }]);
    return id;
  }, []);

  const remove = useCallback((id: string) => {
    commit(readSnapshot().filter((p) => p.id !== id));
  }, []);

  return { customPlaces: places, add, remove };
}
