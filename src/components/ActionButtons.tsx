"use client";

import { eventConfig } from "@/lib/event";

function buildIcsContent() {
  const dt = eventConfig.date;
  const end = new Date(dt.getTime() + 4 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invite//HE",
    "BEGIN:VEVENT",
    `UID:${dt.getTime()}@wedding`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(dt)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:החתונה של ${eventConfig.groomName} ו${eventConfig.brideName}`,
    `LOCATION:${eventConfig.venue}, ${eventConfig.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function ActionButtons() {
  const handleCalendar = () => {
    const blob = new Blob([buildIcsContent()], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
      <a
        href={eventConfig.wazeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-[var(--cream-soft)]/80 glass-dark px-5 py-3 text-sm font-medium tracking-[0.15em] text-[var(--cream-soft)] hover:bg-[var(--cream-soft)] hover:text-[var(--sea-deep)] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2C7 2 3 5.5 3 10c0 3 2 5.5 5 7l-1 4 5-3c.3 0 .7.1 1 .1 5 0 9-3.5 9-8s-4-8-10-8z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
        ניווט ב-Waze
      </a>
      <button
        type="button"
        onClick={handleCalendar}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[var(--sea-deep)] px-5 py-3 text-sm tracking-[0.15em] text-[var(--cream-soft)] hover:bg-[var(--sea)] transition-colors border border-[var(--sea)]/60"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        הוספה ליומן
      </button>
    </div>
  );
}
