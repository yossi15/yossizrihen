"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export default function Countdown({ target }: { target: Date }) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft(target));
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "ימים", value: time?.days },
    { label: "שעות", value: time?.hours },
    { label: "דקות", value: time?.minutes },
    { label: "שניות", value: time?.seconds },
  ];

  return (
    <motion.div
      className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-md bg-[var(--cream-soft)] border border-[var(--gold)]/30 py-3 px-1 sm:px-2 shadow-sm"
        >
          <span className="font-serif text-2xl sm:text-3xl text-[var(--sea-deep)] tabular-nums leading-none">
            {value !== undefined ? String(value).padStart(2, "0") : "––"}
          </span>
          <span className="mt-1 text-[10px] sm:text-xs tracking-[0.2em] text-[var(--ink-soft)]">
            {label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
