"use client";

import { useState } from "react";
import { INFO } from "@/lib/trip/info";

export default function InfoScreen() {
  const [open, setOpen] = useState<string>(INFO[0].id);

  return (
    <div className="space-y-2.5 px-4 pb-6 pt-1">
      {INFO.map((section) => {
        const isOpen = open === section.id;
        return (
          <div key={section.id} className="trip-card overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? "" : section.id)}
              className="flex w-full items-center gap-3 p-3.5 text-right"
            >
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--t-coral)]/10 text-[15px] text-[var(--t-coral)]">
                {section.icon}
              </span>
              <span className="flex-1 text-[15px] font-bold tracking-tight">
                {section.title}
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--t-paper-2)] text-sm text-[var(--t-muted)]">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="trip-rise divide-y divide-[var(--t-line)] border-t border-[var(--t-line)]">
                {section.items.map((item) => (
                  <div key={item.q} className="p-3.5">
                    <p className="text-[13.5px] font-bold text-[var(--t-teal)]">
                      {item.q}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--t-ink-2)]">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <p className="px-2 pt-3 text-[11.5px] leading-relaxed text-[var(--t-muted)]">
        המידע נאסף לתכנון בלבד. מחירים, שעות ומיקומים בתאילנד משתנים תכופות —
        מקומות שמסומנים &quot;מיקום משוער&quot; חייבים אימות בגוגל מפות, ובתי
        חב&quot;ד ומסעדות כשרות חייבים אימות טלפוני לפני נסיעה.
      </p>
    </div>
  );
}
