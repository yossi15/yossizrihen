import type { Category } from "./types";

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; color: string }
> = {
  chabad: { label: 'בתי חב"ד', icon: "✡", color: "#6ea8ff" },
  kosher: { label: "כשר", icon: "🍽", color: "#4ade80" },
  temple: { label: "מקדשים", icon: "🛕", color: "#ffb35c" },
  beach: { label: "חופים", icon: "🏖", color: "#2bd4bd" },
  nature: { label: "טבע ומפלים", icon: "🌴", color: "#8bd450" },
  party: { label: "לילה", icon: "🔊", color: "#ff6b57" },
  market: { label: "שווקים", icon: "🏮", color: "#f472b6" },
  viewpoint: { label: "תצפיות", icon: "⛰", color: "#c4b5fd" },
  boat: { label: "ימי שייט", icon: "⛵", color: "#38bdf8" },
  transport: { label: "תחבורה", icon: "✈", color: "#94a3b8" },
};

export const CATEGORY_ORDER: Category[] = [
  "chabad",
  "kosher",
  "beach",
  "boat",
  "temple",
  "nature",
  "viewpoint",
  "party",
  "market",
  "transport",
];
