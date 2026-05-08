"use client";

import { motion, type Variants } from "framer-motion";
import Countdown from "./Countdown";
import ActionButtons from "./ActionButtons";
import RsvpForm from "./RsvpForm";
import { eventConfig } from "@/lib/event";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

export default function Invitation() {
  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[var(--cream)] via-[var(--cream-soft)] to-[var(--cream)] py-12 sm:py-20 px-5">
      <div className="max-w-md mx-auto flex flex-col items-center text-center gap-12">
        {/* Header */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-[10px] tracking-[0.5em] text-[var(--gold-deep)] uppercase">
            מתחתנים
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl gold-text leading-tight">
            {eventConfig.groomNameHe}
            <span className="block italic text-3xl sm:text-4xl my-2 text-[var(--ink-soft)]">
              &amp;
            </span>
            {eventConfig.brideNameHe}
          </h1>
          <div className="w-32 h-px gold-divider mt-2" />
          <p className="font-serif italic text-lg text-[var(--ink-soft)] mt-3 leading-relaxed">
            “{eventConfig.quote}”
          </p>
        </motion.section>

        {/* Event details */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.4}
          className="flex flex-col gap-3 items-center"
        >
          <Detail label="התאריך" value={eventConfig.dateLabel} />
          <Detail label="השעה" value={eventConfig.timeLabel} />
          <Detail
            label="המקום"
            value={
              <>
                <span className="block">{eventConfig.venue}</span>
                <span className="block text-sm text-[var(--ink-soft)]">
                  {eventConfig.address}
                </span>
              </>
            }
          />
        </motion.section>

        {/* Countdown */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.6}
          className="w-full"
        >
          <p className="text-[10px] tracking-[0.5em] text-[var(--gold-deep)] uppercase mb-4">
            הספירה לאחור
          </p>
          <Countdown target={eventConfig.date} />
        </motion.section>

        {/* Action buttons */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.8}
          className="w-full"
        >
          <ActionButtons />
        </motion.section>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px gold-divider" />
          <span className="font-serif italic text-[var(--gold-deep)]">RSVP</span>
          <div className="flex-1 h-px gold-divider" />
        </div>

        {/* RSVP */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="w-full"
        >
          <p className="font-serif text-2xl gold-text mb-1">אישור הגעה</p>
          <p className="text-sm text-[var(--ink-soft)] mb-6">
            נשמח לראותכם — אנא אשרו הגעה
          </p>
          <RsvpForm />
        </motion.section>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.2}
          className="text-[10px] tracking-[0.4em] text-[var(--ink-soft)]/70 uppercase mt-4"
        >
          באהבה · {eventConfig.groomNameHe} ו{eventConfig.brideNameHe}
        </motion.p>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] tracking-[0.4em] text-[var(--gold-deep)] uppercase">
        {label}
      </span>
      <div className="font-serif text-xl text-[var(--ink)]">{value}</div>
    </div>
  );
}
