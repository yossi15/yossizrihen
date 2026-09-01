import { TRIP } from "@/lib/trip/itinerary";

/** כותרת הים של האפליקציה — שמש, דקל וגלים מצוירים ב-SVG */
export default function TropicalHero({
  countdown,
}: {
  countdown: number | null;
}) {
  return (
    <header className="trip-hero shrink-0 px-5 pb-7 pt-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
            ים · ג׳ונגל · חול
          </p>
          <h1 className="mt-1 text-[32px] font-extrabold leading-none tracking-tight drop-shadow-sm">
            תאילנד
            <span className="ms-2 text-white/55">2026</span>
          </h1>
          <p className="mt-2 text-[13px] text-white/85">
            24.9 — 11.10 · {TRIP.days} ימים · 5 יעדים
          </p>
        </div>

        {countdown !== null && countdown > 0 && (
          <div className="trip-glass grid h-[64px] w-[64px] shrink-0 place-items-center rounded-full">
            <span className="text-[23px] font-extrabold leading-none tabular-nums">
              {countdown}
            </span>
            <span className="text-[9px] tracking-wide text-white/75">ימים</span>
          </div>
        )}
      </div>

      <svg
        className="trip-wave-back"
        viewBox="0 0 400 26"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 16c40 0 52-9 84-9s46 11 80 11 48-11 80-11 44 9 76 9 44-7 80-9v22H0z"
          fill="#ffffff"
        />
      </svg>

      <svg
        className="trip-wave"
        viewBox="0 0 400 26"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 14c34 0 46-10 76-10s44 12 76 12 46-12 78-12 44 10 76 10 48-8 94-10v22H0z"
          fill="var(--t-paper)"
        />
      </svg>
    </header>
  );
}
