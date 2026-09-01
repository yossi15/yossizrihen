const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export function hebDate(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return {
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    weekday: DAY_NAMES[d.getUTCDay()],
    short: `${d.getUTCDate()}.${d.getUTCMonth() + 1}`,
  };
}

export function mapsUrl(lat: number, lng: number, label: string) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=&hl=he#${encodeURIComponent(label)}`;
}

export function directionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function daysUntil(iso: string, now = new Date()) {
  const target = new Date(`${iso}T00:00:00+07:00`).getTime();
  return Math.ceil((target - now.getTime()) / 86400000);
}

/**
 * מחלץ קואורדינטות מטקסט חופשי: קישור של גוגל מפות או "lat, lng".
 * מחזיר null אם לא נמצא זוג תקין.
 */
export function parseLatLng(input: string): { lat: number; lng: number } | null {
  const text = input.trim();
  if (!text) return null;

  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/, // /maps/@13.75,100.49,15z
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // מזהה מקום בקישור ארוך
    /[?&]q=(-?\d+\.\d+)%2C\s*(-?\d+\.\d+)/i,
    /[?&](?:q|query|ll|daddr|destination)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/i,
    /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/, // "13.75, 100.49"
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng };
    }
  }
  return null;
}
