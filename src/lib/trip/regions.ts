import type { Region } from "./types";

export const REGIONS: Region[] = [
  {
    id: "bangkok",
    name: "בנגקוק",
    nameEn: "Bangkok",
    lat: 13.7525,
    lng: 100.4975,
    zoom: 12,
    color: "#f0a04b",
    blurb:
      "נחיתה, ג'ט לג ורחוב קאו סאן. מקדשים ביום, שווקי לילה בערב, ובית חב\"ד במרחק הליכה מקאו סאן.",
  },
  {
    id: "samui",
    name: "קוסמוי",
    nameEn: "Koh Samui",
    lat: 9.512,
    lng: 100.013,
    zoom: 11,
    color: "#2bb3a3",
    blurb:
      "האי הכי נוח לוגיסטית במפרץ: כביש טבעתי אחד, חופים טובים, בית חב\"ד בצ'אוונג ושייט לאנג ת'ונג.",
  },
  {
    id: "phangan",
    name: "קופנגן",
    nameEn: "Koh Phangan",
    lat: 9.735,
    lng: 100.015,
    zoom: 11,
    color: "#e4572e",
    blurb:
      "פול מון, מפלים וג'ונגל. יותר גס ויותר כיף מסמוי, וגם כאן יש בית חב\"ד.",
  },
  {
    id: "phuket",
    name: "פוקט",
    nameEn: "Phuket",
    lat: 7.88,
    lng: 98.35,
    zoom: 10,
    color: "#4a7bd6",
    blurb:
      "בסיס לצד האנדמן: שקיעות בפרומטפ, באנגלה רואד בפאטונג, והשער לפאנג נגה ולפי פי.",
  },
  {
    id: "phiphi",
    name: "קו פי פי",
    nameEn: "Koh Phi Phi",
    lat: 7.74,
    lng: 98.778,
    zoom: 12,
    color: "#9b5de5",
    blurb:
      "צוקי סיד, מאיה ביי ותצפית האי. בלי חב\"ד ובלי כשרות — להביא אוכל מפוקט.",
  },
];

export const REGION_BY_ID = Object.fromEntries(
  REGIONS.map((r) => [r.id, r]),
) as Record<Region["id"], Region>;
