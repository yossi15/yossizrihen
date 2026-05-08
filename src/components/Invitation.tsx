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

const HERO_PHOTO = "/hero-chuppah.jpg";

export default function Invitation() {
  return (
    <main className="relative min-h-[100dvh] sunset-bg overflow-hidden">
      {/* Hero photo band at top */}
      <HeroPhoto src={HERO_PHOTO} />

      <div className="relative z-10 max-w-md mx-auto px-5 pt-[280px] sm:pt-[380px] pb-16 flex flex-col items-center text-center gap-10">
        {/* Header card */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="glass rounded-sm w-full px-7 py-9 flex flex-col items-center gap-3 shadow-[0_25px_60px_-25px_rgba(22,49,62,0.55)]"
        >
          <p className="text-[10px] tracking-[0.5em] text-[var(--gold-deep)] uppercase">
            מתחתנים
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-[var(--sea-deep)] leading-tight">
            {eventConfig.groomNameHe}
            <span className="block italic text-3xl sm:text-4xl my-2 text-[var(--gold-deep)]">
              &amp;
            </span>
            {eventConfig.brideNameHe}
          </h1>
          <div className="w-32 h-px gold-divider mt-2" />
          <p className="font-serif italic text-lg text-[var(--ink-soft)] mt-3 leading-relaxed">
            “{eventConfig.quote}”
          </p>
        </motion.section>

        <Waves />

        {/* Event details */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.4}
          className="glass-dark rounded-sm w-full px-7 py-8 flex flex-col gap-5 items-center"
        >
          <Detail label="התאריך" value={eventConfig.dateLabel} />
          <Detail label="השעה" value={eventConfig.timeLabel} />
          <Detail
            label="המקום"
            value={
              <>
                <span className="block">{eventConfig.venue}</span>
                <span className="block text-sm text-[var(--cream-soft)]/85 mt-0.5">
                  {eventConfig.venueSubtitle}
                </span>
                <span className="block text-xs text-[var(--cream-soft)]/70 mt-0.5">
                  {eventConfig.address}
                </span>
              </>
            }
            light
          />
        </motion.section>

        <Waves />

        {/* Countdown */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.6}
          className="w-full"
        >
          <p className="text-[10px] tracking-[0.5em] text-[var(--cream-soft)] uppercase mb-4 drop-shadow">
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
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--cream-soft)]/70 to-[var(--cream-soft)]/70" />
          <span className="font-serif italic text-[var(--cream-soft)] drop-shadow">RSVP</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--cream-soft)]/70 to-[var(--cream-soft)]/70" />
        </div>

        {/* RSVP */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="glass rounded-sm w-full px-6 py-8"
        >
          <p className="font-serif text-2xl text-[var(--sea-deep)] mb-1">אישור הגעה</p>
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
          className="text-[10px] tracking-[0.4em] text-[var(--cream-soft)]/85 uppercase mt-2 drop-shadow"
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
  light = false,
}: {
  label: string;
  value: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-[10px] tracking-[0.4em] uppercase ${
        light ? "text-[var(--gold-light)]" : "text-[var(--gold-deep)]"
      }`}>
        {label}
      </span>
      <div className={`font-serif text-xl ${
        light ? "text-[var(--cream-soft)]" : "text-[var(--ink)]"
      }`}>
        {value}
      </div>
    </div>
  );
}

function Waves() {
  return (
    <svg
      viewBox="0 0 400 24"
      className="w-full max-w-xs h-6 wave-anim"
      aria-hidden
    >
      <path
        d="M 0 12 Q 25 4, 50 12 T 100 12 T 150 12 T 200 12 T 250 12 T 300 12 T 350 12 T 400 12"
        stroke="rgba(251,245,234,0.7)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 0 18 Q 25 10, 50 18 T 100 18 T 150 18 T 200 18 T 250 18 T 300 18 T 350 18 T 400 18"
        stroke="rgba(251,245,234,0.4)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeroPhoto({ src }: { src: string }) {
  return (
    <div className="absolute inset-x-0 top-0 h-[320px] sm:h-[420px] pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
        aria-hidden
      />
      {/* Top vignette so menu/text reads, plus bottom fade into the gradient body */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1f2a44]/40 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#a86555]" />
    </div>
  );
}

function HeroScene() {
  return (
    <div className="absolute inset-x-0 top-0 h-[280px] sm:h-[340px] pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 800 340"
        className="w-full h-full"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="invSun" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="#fff5d8" stopOpacity="1" />
            <stop offset="40%" stopColor="#fbd197" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f4a86b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="invSea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a4a52" />
            <stop offset="50%" stopColor="#3a4a52" />
            <stop offset="100%" stopColor="#1f2a32" />
          </linearGradient>
          <linearGradient id="invCurtain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbf5ea" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#e8dcc4" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Sun glow */}
        <circle cx="400" cy="220" r="180" fill="url(#invSun)" />
        <ellipse cx="400" cy="225" rx="55" ry="55" fill="#fff5d8" opacity="0.85" />

        {/* Tree silhouettes - left */}
        <g fill="#1a1610" opacity="0.85">
          <path d="M 30 150 Q 70 70, 110 140 Q 140 80, 170 145 Q 175 175, 150 185 Q 110 195, 70 188 Q 35 180, 30 150 Z" />
          <rect x="95" y="180" width="4" height="80" />
          <path d="M 80 270 L 115 270 Q 105 220, 96 180" stroke="#1a1610" strokeWidth="2" fill="none" />
        </g>

        {/* Tree silhouettes - right */}
        <g fill="#1a1610" opacity="0.85">
          <path d="M 630 145 Q 670 65, 710 140 Q 745 75, 775 145 Q 780 180, 750 190 Q 710 195, 670 188 Q 635 180, 630 145 Z" />
          <rect x="700" y="180" width="4" height="80" />
        </g>

        {/* Far tree silhouette */}
        <g fill="#1a1610" opacity="0.6">
          <path d="M 720 50 Q 745 15, 765 55 Q 785 30, 790 80 Q 780 92, 755 88 Q 735 82, 720 50 Z" />
        </g>

        {/* Sea horizon band */}
        <rect y="245" width="800" height="35" fill="url(#invSea)" />
        <ellipse cx="400" cy="250" rx="80" ry="3" fill="#fff5d8" opacity="0.55" />
        <ellipse cx="400" cy="258" rx="120" ry="2" fill="#fff5d8" opacity="0.35" />

        {/* Beach/sand foreground */}
        <rect y="280" width="800" height="60" fill="#2a2018" />
        <rect y="280" width="800" height="4" fill="#1a1410" />
        <ellipse cx="400" cy="288" rx="200" ry="10" fill="#1a1410" />
        <ellipse cx="400" cy="287" rx="190" ry="7" fill="#3a2e22" />

        {/* Round chuppah - columns */}
        <rect x="335" y="155" width="9" height="135" fill="#fbf5ea" opacity="0.92" />
        <rect x="333" y="152" width="13" height="6" fill="#fbf5ea" />
        <rect x="333" y="288" width="13" height="6" fill="#fbf5ea" />

        <rect x="456" y="155" width="9" height="135" fill="#fbf5ea" opacity="0.92" />
        <rect x="454" y="152" width="13" height="6" fill="#fbf5ea" />
        <rect x="454" y="288" width="13" height="6" fill="#fbf5ea" />

        {/* Top ring of chuppah */}
        <ellipse cx="400" cy="155" rx="65" ry="14" fill="none" stroke="#fbf5ea" strokeWidth="2.5" opacity="0.95" />
        <ellipse cx="400" cy="155" rx="58" ry="11" fill="none" stroke="#fbf5ea" strokeWidth="0.8" opacity="0.6" />

        {/* Curtains */}
        <path d="M 345 160 Q 338 210, 342 260 Q 348 285, 355 290 L 375 290 Q 368 260, 365 230 Q 363 195, 360 160 Z" fill="url(#invCurtain)" opacity="0.92" />
        <path d="M 440 160 Q 437 200, 435 230 Q 432 270, 425 290 L 445 290 Q 452 285, 458 260 Q 462 210, 455 160 Z" fill="url(#invCurtain)" opacity="0.92" />
        <path d="M 375 155 Q 380 215, 385 270 Q 395 290, 400 290 Q 405 290, 415 270 Q 420 215, 425 155 Z" fill="rgba(251,245,234,0.35)" />

        {/* Crown bead */}
        <circle cx="400" cy="148" r="3" fill="#c9a961" />
      </svg>

      {/* Soft fade to body */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#5a4a62]/0" />
    </div>
  );
}
