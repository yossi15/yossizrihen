export type RegionId = "bangkok" | "samui" | "phangan" | "phuket" | "phiphi";

export type Category =
  | "chabad"
  | "kosher"
  | "temple"
  | "beach"
  | "nature"
  | "party"
  | "market"
  | "viewpoint"
  | "boat"
  | "transport";

export type Place = {
  id: string;
  name: string;
  nameEn: string;
  region: RegionId;
  category: Category;
  lat: number;
  lng: number;
  /** קו אחד שמסביר למה זה שווה */
  hook: string;
  details?: string;
  /** טיפ תרמילאי אמיתי */
  tip?: string;
  /** מחיר משוער בבאט תאילנדי, או 0 לחינם */
  priceThb?: number;
  /** כמה זמן להקצות */
  duration?: string;
  /** קואורדינטות משוערות — לאמת לפני שנוסעים */
  approx?: boolean;
  phone?: string;
  /** שעות פתיחה כפי שפורסמו — תמיד לאמת לפני נסיעה */
  hours?: string;
  /** כתובת מלאה */
  address?: string;
  url?: string;
  /** מקום שהמשתמש הוסיף בעצמו — נשמר בדפדפן בלבד */
  custom?: boolean;
  /** הערה אישית */
  note?: string;
  /** שיוך ליום ספציפי במסלול (ISO) */
  dayDate?: string;
};

export type Region = {
  id: RegionId;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  zoom: number;
  color: string;
  blurb: string;
};

export type DayPlan = {
  /** ISO date */
  date: string;
  region: RegionId;
  title: string;
  /** מזהי מקומות מ-places */
  places: string[];
  notes?: string[];
  /** מעבר בין ערים באותו יום */
  move?: string;
  /** יום עם שבת/חג */
  holy?: boolean;
};
