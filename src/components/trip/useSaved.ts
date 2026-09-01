"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "thailand2026:saved";
const EMPTY: string[] = [];

let cachedRaw: string | null = null;
let cachedValue: string[] = EMPTY;
const listeners = new Set<() => void>();

/** קורא מה-localStorage ושומר הפניה יציבה, כדי ש-useSyncExternalStore לא ילולאה */
function readSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // אחסון חסום (גלישה פרטית) — ממשיכים בלי שמירה
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as string[]) : EMPTY;
    } catch {
      cachedValue = EMPTY;
    }
  }
  return cachedValue;
}

function serverSnapshot(): string[] {
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

/** מקומות שמורים — נשמרים בדפדפן של המשתמש בלבד */
export function useSaved() {
  const saved = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot);

  const toggle = useCallback((id: string) => {
    const current = readSnapshot();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    const raw = JSON.stringify(next);
    try {
      localStorage.setItem(KEY, raw);
    } catch {
      // ממשיכים בזיכרון בלבד
    }
    cachedRaw = raw;
    cachedValue = next;
    for (const listener of listeners) listener();
  }, []);

  return { saved, toggle };
}

const noopSubscribe = () => () => {};

/** true רק אחרי הידרציה — למניעת פער בין שרת לדפדפן */
export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
