import { REGION_BY_ID } from "./regions";
import type { RegionId } from "./types";

/** תאילנד היא UTC+7 בלי שעון קיץ */
const TZ_OFFSET_HOURS = 7;

/**
 * חישוב שקיעה לפי האלגוריתם של NOAA.
 * מחזיר דקות מחצות מקומי, או null אם אין שקיעה באותו יום (לא רלוונטי בתאילנד).
 */
function sunsetMinutesLocal(date: Date, lat: number, lng: number): number | null {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);

  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1 + 0.5);
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const latRad = (lat * Math.PI) / 180;
  const zenith = (90.833 * Math.PI) / 180;
  const cosHa =
    Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl)) -
    Math.tan(latRad) * Math.tan(decl);
  if (cosHa < -1 || cosHa > 1) return null;

  const haDeg = (Math.acos(cosHa) * 180) / Math.PI;
  // NOAA: חצות שמש ב-UTC, ואז חצי יום קדימה (קו אורך חיובי מזרחה)
  const solarNoonUtc = 720 - 4 * lng - eqTime;
  return solarNoonUtc + 4 * haDeg + TZ_OFFSET_HOURS * 60;
}

function fmt(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export type ShabbatTimes = {
  /** ISO של יום הכניסה */
  inDate: string;
  /** ISO של יום היציאה */
  outDate: string;
  region: RegionId;
  regionName: string;
  /** הדלקת נרות — 18 דקות לפני השקיעה */
  candles: string;
  sunsetIn: string;
  /** צאת הכוכבים — 40 דקות אחרי השקיעה */
  havdalah: string;
};

export function timesFor(
  region: RegionId,
  inDateIso: string,
  outDateIso: string,
): ShabbatTimes {
  const r = REGION_BY_ID[region];
  const sunIn = sunsetMinutesLocal(new Date(`${inDateIso}T12:00:00Z`), r.lat, r.lng) ?? 1080;
  const sunOut = sunsetMinutesLocal(new Date(`${outDateIso}T12:00:00Z`), r.lat, r.lng) ?? 1080;
  return {
    inDate: inDateIso,
    outDate: outDateIso,
    region,
    regionName: r.name,
    candles: fmt(sunIn - 18),
    sunsetIn: fmt(sunIn),
    havdalah: fmt(sunOut + 40),
  };
}

export type HolyBlock = {
  id: string;
  title: string;
  subtitle: string;
  /** התאריך שבו נכנסים */
  startDate: string;
  /** התאריך שבו יוצאים */
  endDate: string;
  /** כמה ימים רצופים סגורים */
  lengthLabel: string;
  region: RegionId;
  what: string[];
  planning: string[];
};

/**
 * לוח החגים והשבתות של הטיול (24.9.2026 – 11.10.2026, תשרי תשפ"ז).
 * שימו לב: בחו"ל שומרים יומיים של יום טוב.
 */
export const HOLY_BLOCKS: HolyBlock[] = [
  {
    id: "sukkot",
    title: "סוכות + שבת",
    subtitle: "ליל שישי 25.9 → מוצ\"ש 26.9",
    startDate: "2026-09-25",
    endDate: "2026-09-26",
    lengthLabel: "25 שעות רצופות",
    region: "phuket",
    what: [
      "שישי 25.9 הוא ערב סוכות — יום טוב נכנס בכניסת שבת ונמשך ברצף לשבת.",
      "היום השני שלכם בטיול, בפוקט. בית חב\"ד קארון במרחק הליכה מהחוף.",
      "י\"ד תשרי - ט\"ו תשרי תשפ\"ז.",
    ],
    planning: [
      "להירשם לסעודות בבית חב\"ד קארון כבר ביום הנחיתה, 24.9.",
      "למשוך מזומן ולקנות מים ואוכל בחמישי. בשבת וחג אין כספומט ואין גראב.",
      "לא לתכנן סיור סירה ל-25.9 — צריך להיות בקארון עד 16:00.",
    ],
  },
  {
    id: "cholhamoed",
    title: "חול המועד סוכות",
    subtitle: "ראשון 27.9 → חמישי 1.10",
    startDate: "2026-09-27",
    endDate: "2026-10-01",
    lengthLabel: "5 ימים פתוחים",
    region: "phuket",
    what: [
      "ימי חול לכל דבר — כל האטרקציות, המעבורות והסיורים פתוחים.",
      "אצלכם: פאנג נגה, קו פי פי, העיר העתיקה, והמעבר לסמוי ב-30.9.",
    ],
    planning: [
      "זה החלון היחיד לימי שייט מפוקט. לא לדחות אותם — אחרי 2.10 נסגרים שלושה ימים.",
      "בבתי חב\"ד יש סוכה — אפשר לאכול בסוכה גם באמצע השבוע.",
    ],
  },
  {
    id: "shmini",
    title: "שמיני עצרת + שבת + שמחת תורה",
    subtitle: "ליל שישי 2.10 → מוצאי ראשון 4.10",
    startDate: "2026-10-02",
    endDate: "2026-10-04",
    lengthLabel: "כ-50 שעות רצופות",
    region: "samui",
    what: [
      "הבלוק הארוך של הטיול: יום טוב נכנס בשישי בערב, ממשיך לשבת, ומיד ליום טוב שני של שמחת תורה בראשון.",
      "בחו\"ל שומרים יומיים — זה לא נגמר במוצ\"ש אלא רק במוצאי ראשון 4.10.",
      "כ\"א - כ\"ג תשרי תשפ\"ז.",
    ],
    planning: [
      "המעבר שלכם לקופנגן מתוכנן ל-4.10 — וזה יום טוב. אי אפשר לנסוע במשך היום, והמעבורת האחרונה יוצאת לפני צאת החג.",
      "ההמלצה: להישאר בסמוי גם בלילה של 4.10 ולעבור בבוקר 5.10.",
      "לא לתכנן פה סיור, מעבורת או טיסה פנימית.",
      "לקנות אוכל, מים ומזומן לשלושה ימים ביום חמישי 1.10.",
      "שמחת תורה בחב\"ד בחו\"ל זו חוויה — הקפות עם כל הישראלים באי.",
    ],
  },
  {
    id: "shabbat-bereshit",
    title: "שבת בראשית",
    subtitle: "ליל שישי 9.10 → מוצ\"ש 10.10",
    startDate: "2026-10-09",
    endDate: "2026-10-10",
    lengthLabel: "25 שעות",
    region: "bangkok",
    what: [
      "השבת האחרונה, בבנגקוק, יום אחרי הטיסה מסמוי.",
      "כ\"ח - כ\"ט תשרי תשפ\"ז.",
    ],
    planning: [
      "הטיסה סמוי→בנגקוק היא בבוקר 9.10, שהוא ערב שבת. לקחת את הראשונה שיש ולא להשאיר מרווח קטן.",
      "לישון ברמבוטרי או בקאו סאן — בית חב\"ד במרחק הליכה, ובשבת אין תחבורה.",
      "לארוז לפני השבת. במוצ\"ש נשאר רק ערב אחד.",
    ],
  },
];
