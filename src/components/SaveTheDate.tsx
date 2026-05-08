"use client";

import { motion } from "framer-motion";
import { eventConfig } from "@/lib/event";

const HERO_PHOTO = "/hero-chuppah.jpg";

type Props = {
  onContinue: () => void;
};

export default function SaveTheDate({ onContinue }: Props) {
  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[var(--cream)] px-5 py-10">
      {/* Soft sunset wash at the top */}
      <div
        className="absolute inset-x-0 top-0 h-2/3 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 65%, rgba(244,168,107,0.22) 0%, rgba(244,168,107,0.08) 35%, transparent 65%)",
        }}
        aria-hidden
      />

      {/* Top brand mark */}
      <motion.div
        className="relative z-10 flex flex-col items-center mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <WaveMark className="w-12 h-12 text-[var(--sea-deep)]" />
        <p className="font-serif text-[var(--sea-deep)] text-2xl mt-2 tracking-wide">
          {eventConfig.venue}
        </p>
        <p className="text-[10px] tracking-[0.5em] text-[var(--ink-soft)] uppercase mt-0.5">
          {eventConfig.venueTagline}
        </p>
      </motion.div>

      {/* Hero illustration card */}
      <motion.div
        className="relative w-full max-w-md aspect-[4/5] rounded-sm overflow-hidden shadow-[0_30px_80px_-25px_rgba(22,49,62,0.5),0_15px_40px_-15px_rgba(22,49,62,0.3)]"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
      >
        {/* SVG fallback first; real photo (if file present) painted on top */}
        <BeachScene className="absolute inset-0 w-full h-full" />
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_PHOTO})` }}
          aria-hidden
        />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />

        {/* Top label */}
        <motion.p
          className="absolute top-6 inset-x-0 text-center text-[10px] tracking-[0.55em] text-white/85 uppercase z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          together with their families
        </motion.p>

        {/* Bottom content */}
        <div className="absolute bottom-0 inset-x-0 p-7 flex flex-col items-center text-center z-10">
          <motion.h1
            className="font-serif italic text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            style={{ fontSize: "clamp(2.5rem, 11vw, 3.75rem)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Save the Date
          </motion.h1>

          <motion.div
            className="flex items-center gap-3 mt-3"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 1.4 }}
          >
            <span className="block w-10 h-px bg-white/70" />
            <Diamond />
            <span className="block w-10 h-px bg-white/70" />
          </motion.div>

          <motion.p
            className="font-serif text-white mt-3 leading-tight"
            style={{ fontSize: "clamp(1.4rem, 5.5vw, 1.85rem)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            {eventConfig.groomName}
            <span className="italic mx-2 text-[var(--gold-light)]">&amp;</span>
            {eventConfig.brideName}
          </motion.p>

          <motion.div
            dir="ltr"
            className="flex items-baseline gap-3 mt-5 text-white"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.8 }}
          >
            <span className="font-serif text-4xl sm:text-5xl tabular-nums">
              24
            </span>
            <span className="font-serif text-2xl text-[var(--gold-light)]">
              ·
            </span>
            <span className="font-serif text-4xl sm:text-5xl tabular-nums">
              06
            </span>
            <span className="font-serif text-2xl text-[var(--gold-light)]">
              ·
            </span>
            <span className="font-serif text-4xl sm:text-5xl tabular-nums">
              26
            </span>
          </motion.div>

          <motion.p
            className="text-[11px] tracking-[0.4em] text-white/85 uppercase mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            {eventConfig.venueSubtitle}
          </motion.p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.button
        type="button"
        onClick={onContinue}
        className="relative z-10 mt-7 inline-flex items-center gap-2 rounded-none border border-[var(--sea-deep)] bg-[var(--sea-deep)] px-7 py-3 text-xs tracking-[0.35em] text-[var(--cream-soft)] uppercase hover:bg-transparent hover:text-[var(--sea-deep)] transition-colors"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.2 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        להזמנה המלאה
        <span aria-hidden>←</span>
      </motion.button>
    </div>
  );
}

function Diamond() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden className="shrink-0">
      <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="#e7d4a3" />
    </svg>
  );
}

function WaveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <circle
        cx="30"
        cy="30"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M 14 32 Q 22 26, 30 32 T 46 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M 16 38 Q 23 33, 30 38 T 44 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function BeachScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d4a5e" />
          <stop offset="20%" stopColor="#7a6a6e" />
          <stop offset="45%" stopColor="#e0936a" />
          <stop offset="62%" stopColor="#f4b67a" />
          <stop offset="75%" stopColor="#f8d896" />
          <stop offset="100%" stopColor="#f4a86b" />
        </linearGradient>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff5d8" stopOpacity="1" />
          <stop offset="50%" stopColor="#ffd896" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f4a86b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4a52" />
          <stop offset="50%" stopColor="#3a4a52" />
          <stop offset="100%" stopColor="#1f2a32" />
        </linearGradient>
        <linearGradient id="curtain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf5ea" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e8dcc4" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="340" fill="url(#skyGrad)" />

      {/* Sun glow */}
      <circle cx="200" cy="285" r="100" fill="url(#sunGrad)" />
      <ellipse
        cx="200"
        cy="290"
        rx="38"
        ry="38"
        fill="#fff5d8"
        opacity="0.85"
      />

      {/* Tree silhouettes left */}
      <g fill="#1a1610" opacity="0.85">
        <path d="M -5 200 Q 30 120, 55 180 Q 75 130, 90 200 Q 65 220, 50 230 Q 30 235, 10 230 Q -5 220, -5 200 Z" />
        <rect x="40" y="220" width="3" height="80" />
        <path d="M 30 320 L 60 320 Q 50 280, 42 220" />
      </g>

      {/* Tree silhouettes right */}
      <g fill="#1a1610" opacity="0.85">
        <path d="M 305 200 Q 340 120, 365 180 Q 385 140, 405 195 Q 405 230, 380 235 Q 350 235, 320 230 Q 305 220, 305 200 Z" />
        <rect x="355" y="225" width="3" height="80" />
      </g>
      <g fill="#1a1610" opacity="0.7">
        <path d="M 360 100 Q 380 60, 395 105 Q 410 80, 415 130 Q 405 140, 380 135 Q 365 130, 360 100 Z" />
      </g>

      {/* Sea */}
      <rect y="320" width="400" height="50" fill="url(#seaGrad)" />
      {/* Sun reflection on sea */}
      <ellipse cx="200" cy="325" rx="55" ry="3" fill="#fff5d8" opacity="0.6" />
      <ellipse cx="200" cy="335" rx="80" ry="2" fill="#fff5d8" opacity="0.4" />
      <ellipse cx="200" cy="345" rx="100" ry="1.5" fill="#fff5d8" opacity="0.25" />
      {/* Wave hints */}
      <path
        d="M 0 350 Q 50 348, 100 350 T 200 350 T 300 350 T 400 350"
        stroke="rgba(255,245,216,0.2)"
        strokeWidth="0.6"
        fill="none"
      />
      <path
        d="M 0 358 Q 50 357, 100 358 T 200 358 T 300 358 T 400 358"
        stroke="rgba(255,245,216,0.15)"
        strokeWidth="0.5"
        fill="none"
      />

      {/* Stage / floor */}
      <rect y="370" width="400" height="130" fill="#2a2018" />
      <rect y="370" width="400" height="6" fill="#1a1410" />

      {/* Round chuppah platform */}
      <ellipse cx="200" cy="380" rx="105" ry="12" fill="#1a1410" />
      <ellipse cx="200" cy="378" rx="100" ry="9" fill="#3a2e22" />

      {/* Two columns */}
      <g>
        <rect x="135" y="225" width="9" height="155" fill="#fbf5ea" opacity="0.92" />
        <rect x="133" y="222" width="13" height="6" fill="#fbf5ea" />
        <rect x="133" y="378" width="13" height="6" fill="#fbf5ea" />
      </g>
      <g>
        <rect x="256" y="225" width="9" height="155" fill="#fbf5ea" opacity="0.92" />
        <rect x="254" y="222" width="13" height="6" fill="#fbf5ea" />
        <rect x="254" y="378" width="13" height="6" fill="#fbf5ea" />
      </g>

      {/* Round arch top — ellipse outline */}
      <ellipse
        cx="200"
        cy="225"
        rx="65"
        ry="14"
        fill="none"
        stroke="#fbf5ea"
        strokeWidth="2.5"
        opacity="0.95"
      />
      {/* Inner ring */}
      <ellipse
        cx="200"
        cy="225"
        rx="58"
        ry="11"
        fill="none"
        stroke="#fbf5ea"
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* Hanging curtains - flowing drapes */}
      <path
        d="M 145 230 Q 138 280, 142 330 Q 148 360, 155 380 L 175 380 Q 168 350, 165 310 Q 163 270, 160 230 Z"
        fill="url(#curtain)"
        opacity="0.92"
      />
      <path
        d="M 240 230 Q 237 270, 235 310 Q 232 350, 225 380 L 245 380 Q 252 360, 258 330 Q 262 280, 255 230 Z"
        fill="url(#curtain)"
        opacity="0.92"
      />

      {/* Center curtain hint behind */}
      <path
        d="M 175 225 Q 180 280, 185 350 Q 195 380, 200 380 Q 205 380, 215 350 Q 220 280, 225 225 Z"
        fill="rgba(251,245,234,0.35)"
      />

      {/* Curtain folds */}
      <path d="M 152 240 Q 150 300, 165 380" stroke="rgba(58,40,30,0.15)" strokeWidth="0.6" fill="none" />
      <path d="M 248 240 Q 250 300, 235 380" stroke="rgba(58,40,30,0.15)" strokeWidth="0.6" fill="none" />

      {/* Top knot/tieback decoration */}
      <circle cx="200" cy="218" r="3" fill="#c9a961" />
    </svg>
  );
}
