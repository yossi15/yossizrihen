"use client";

import { motion } from "framer-motion";
import { eventConfig } from "@/lib/event";

type Props = {
  onContinue: () => void;
};

export default function SaveTheDate({ onContinue }: Props) {
  return (
    <div className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f4e9d2] via-[#fbf5ea] to-[#ead7b1] px-4 py-8">
      {/* Subtle paper texture via repeating radial gradients */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(201,169,97,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(168,132,58,0.06) 0%, transparent 40%)",
        }}
        aria-hidden
      />

      {/* The card */}
      <motion.div
        className="relative w-full max-w-md aspect-[5/7] rounded-[2px] shadow-[0_30px_80px_-20px_rgba(58,49,40,0.45),0_15px_40px_-15px_rgba(58,49,40,0.3)] overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #fbf5ea 0%, #f4e9d2 50%, #ead7b1 100%)",
        }}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Outer gold frame */}
        <div className="absolute inset-4 border border-[var(--gold-deep)]/50 rounded-[1px]" />
        <div className="absolute inset-5 border border-[var(--gold)]/30 rounded-[1px]" />

        {/* Corner flourishes */}
        <CornerFlourish className="absolute top-3 left-3 w-14 h-14" />
        <CornerFlourish className="absolute top-3 right-3 w-14 h-14 scale-x-[-1]" />
        <CornerFlourish className="absolute bottom-3 left-3 w-14 h-14 scale-y-[-1]" />
        <CornerFlourish className="absolute bottom-3 right-3 w-14 h-14 scale-x-[-1] scale-y-[-1]" />

        {/* Card content */}
        <div className="relative h-full flex flex-col items-center text-center px-8 pt-12 pb-10">
          {/* Top: small label */}
          <motion.p
            className="text-[10px] tracking-[0.6em] text-[var(--gold-deep)] uppercase mb-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            together with their families
          </motion.p>

          {/* Save the Date — script */}
          <motion.h1
            className="font-serif italic gold-text leading-none mt-3"
            style={{ fontSize: "clamp(2.75rem, 12vw, 4rem)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Save the Date
          </motion.h1>

          {/* Ornamental separator */}
          <motion.div
            className="flex items-center gap-2 mt-4"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
          >
            <Sprig className="w-10 h-3" />
            <Diamond />
            <Sprig className="w-10 h-3 scale-x-[-1]" />
          </motion.div>

          {/* Center illustration */}
          <motion.div
            className="my-5 w-full flex justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <ChuppahIllustration className="w-44 h-32" />
          </motion.div>

          {/* Names */}
          <motion.p
            className="font-serif text-[var(--ink)] leading-tight"
            style={{ fontSize: "clamp(1.5rem, 6vw, 2rem)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            {eventConfig.groomName}
            <span className="block italic text-2xl my-1 text-[var(--gold-deep)]">
              &amp;
            </span>
            {eventConfig.brideName}
          </motion.p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Date row */}
          <motion.div
            className="flex items-stretch gap-3 mt-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.5 }}
          >
            <DateBox value="24" label="יום" />
            <div className="self-center font-serif gold-text text-3xl">·</div>
            <DateBox value="06" label="חודש" />
            <div className="self-center font-serif gold-text text-3xl">·</div>
            <DateBox value="26" label="שנה" />
          </motion.div>

          {/* Bottom flourish + label */}
          <motion.div
            className="mt-5 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.7 }}
          >
            <div className="flex items-center gap-2">
              <span className="block w-12 h-px bg-[var(--gold)]" />
              <Diamond small />
              <span className="block w-12 h-px bg-[var(--gold)]" />
            </div>
            <p className="font-serif tracking-[0.4em] text-sm text-[var(--gold-deep)] uppercase mt-3">
              The Wedding
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA below card */}
      <motion.button
        type="button"
        onClick={onContinue}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-[var(--gold)] bg-[var(--cream-soft)]/80 backdrop-blur px-6 py-2.5 text-xs tracking-[0.3em] text-[var(--gold-deep)] uppercase hover:bg-[var(--gold)] hover:text-white transition-colors shadow-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.1 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        להזמנה המלאה
        <span aria-hidden>←</span>
      </motion.button>
    </div>
  );
}

function DateBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="font-serif gold-text leading-none tabular-nums"
        style={{ fontSize: "clamp(2rem, 8vw, 2.5rem)" }}
      >
        {value}
      </span>
      <span className="mt-1 text-[9px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
        {label}
      </span>
    </div>
  );
}

function Diamond({ small = false }: { small?: boolean }) {
  const size = small ? 8 : 12;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      aria-hidden
      className="shrink-0"
    >
      <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="var(--gold-deep)" />
      <path d="M7 3 L11 7 L7 11 L3 7 Z" fill="var(--gold-light)" />
    </svg>
  );
}

function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 14" className={className} aria-hidden>
      <path
        d="M 2 7 Q 20 7, 40 7 T 78 7"
        stroke="var(--gold-deep)"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Leaves */}
      {[15, 28, 42, 56, 68].map((cx, i) => (
        <g key={i} transform={`translate(${cx}, 7)`}>
          <ellipse
            cx="0"
            cy="-3"
            rx="3"
            ry="1.5"
            transform="rotate(-30)"
            fill="var(--gold)"
            opacity="0.85"
          />
          <ellipse
            cx="0"
            cy="3"
            rx="3"
            ry="1.5"
            transform="rotate(30)"
            fill="var(--gold)"
            opacity="0.85"
          />
        </g>
      ))}
    </svg>
  );
}

function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <defs>
        <linearGradient id="cornerGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a8843a" />
          <stop offset="50%" stopColor="#c9a961" />
          <stop offset="100%" stopColor="#e7d4a3" />
        </linearGradient>
      </defs>
      {/* Curl */}
      <path
        d="M 8 8 Q 8 28 28 28 Q 38 28 38 18 Q 38 12 32 12 Q 26 12 26 18"
        stroke="url(#cornerGrad)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Inner curl */}
      <path
        d="M 12 12 Q 12 22 22 22"
        stroke="url(#cornerGrad)"
        strokeWidth="0.8"
        fill="none"
        opacity="0.7"
      />
      {/* Tiny leaves */}
      <ellipse cx="34" cy="22" rx="3" ry="1.2" transform="rotate(-30 34 22)" fill="url(#cornerGrad)" />
      <ellipse cx="22" cy="34" rx="3" ry="1.2" transform="rotate(60 22 34)" fill="url(#cornerGrad)" />
      <circle cx="38" cy="18" r="1.2" fill="url(#cornerGrad)" />
    </svg>
  );
}

function ChuppahIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 140" className={className} aria-hidden>
      <defs>
        <linearGradient id="archGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7d4a3" />
          <stop offset="50%" stopColor="#c9a961" />
          <stop offset="100%" stopColor="#a8843a" />
        </linearGradient>
        <radialGradient id="sunRise" cx="50%" cy="80%" r="70%">
          <stop offset="0%" stopColor="#fff4d2" stopOpacity="1" />
          <stop offset="35%" stopColor="#f8d896" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#f4b35e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f4b35e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7d4a3" />
          <stop offset="100%" stopColor="#a8843a" />
        </linearGradient>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfd9dc" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#2f5a6e" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Sea (below horizon) */}
      <rect x="0" y="115" width="200" height="25" fill="url(#seaGrad)" />

      {/* Sun glow behind arch */}
      <ellipse cx="100" cy="115" rx="85" ry="55" fill="url(#sunRise)" />

      {/* Sun reflection on water */}
      <ellipse cx="100" cy="118" rx="14" ry="2" fill="#fff4d2" opacity="0.65" />
      <ellipse cx="100" cy="124" rx="20" ry="1.2" fill="#fff4d2" opacity="0.4" />
      <ellipse cx="100" cy="130" rx="26" ry="0.9" fill="#fff4d2" opacity="0.25" />

      {/* Wave hints */}
      <path
        d="M 0 120 Q 25 119, 50 120 T 100 120 T 150 120 T 200 120"
        stroke="rgba(47,90,110,0.3)"
        strokeWidth="0.4"
        fill="none"
      />
      <path
        d="M 0 126 Q 25 125, 50 126 T 100 126 T 150 126 T 200 126"
        stroke="rgba(47,90,110,0.25)"
        strokeWidth="0.3"
        fill="none"
      />

      {/* Horizon line */}
      <line
        x1="0"
        y1="115"
        x2="200"
        y2="115"
        stroke="var(--gold-deep)"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Round arch / chuppah */}
      {/* Pillars */}
      <line x1="65" y1="115" x2="65" y2="55" stroke="url(#archGold)" strokeWidth="1.5" />
      <line x1="135" y1="115" x2="135" y2="55" stroke="url(#archGold)" strokeWidth="1.5" />
      {/* Top arc */}
      <path
        d="M 65 55 Q 100 25, 135 55"
        stroke="url(#archGold)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner arc highlight */}
      <path
        d="M 70 56 Q 100 32, 130 56"
        stroke="url(#archGold)"
        strokeWidth="0.6"
        fill="none"
        opacity="0.6"
      />

      {/* Floral cluster on top of arch */}
      {[
        { cx: 75, cy: 50, r: 3.5 },
        { cx: 85, cy: 42, r: 4 },
        { cx: 95, cy: 36, r: 4.2 },
        { cx: 105, cy: 34, r: 4.5 },
        { cx: 115, cy: 38, r: 4 },
        { cx: 125, cy: 46, r: 3.8 },
        { cx: 100, cy: 28, r: 3.8 },
        { cx: 90, cy: 32, r: 3.4 },
        { cx: 110, cy: 30, r: 3.6 },
      ].map((flower, i) => (
        <g key={i}>
          <circle
            cx={flower.cx}
            cy={flower.cy}
            r={flower.r}
            fill="url(#leafGrad)"
            opacity="0.85"
          />
          <circle
            cx={flower.cx}
            cy={flower.cy}
            r={flower.r * 0.45}
            fill="#fbf5ea"
            opacity="0.9"
          />
        </g>
      ))}

      {/* Hanging leaves from arch */}
      <path d="M 70 56 Q 72 65, 68 75" stroke="url(#leafGrad)" strokeWidth="0.5" fill="none" />
      <path d="M 130 56 Q 128 65, 132 75" stroke="url(#leafGrad)" strokeWidth="0.5" fill="none" />

      {/* Drape curtains hint */}
      <path
        d="M 65 60 Q 60 90, 58 115 L 62 115 Q 64 90, 68 60"
        fill="rgba(251,245,234,0.8)"
        stroke="var(--gold)"
        strokeWidth="0.3"
      />
      <path
        d="M 135 60 Q 140 90, 142 115 L 138 115 Q 136 90, 132 60"
        fill="rgba(251,245,234,0.8)"
        stroke="var(--gold)"
        strokeWidth="0.3"
      />

      {/* Lanterns at the path */}
      {[35, 50, 150, 165].map((x, i) => (
        <g key={i}>
          <rect x={x - 1.5} y="105" width="3" height="6" fill="url(#archGold)" />
          <circle cx={x} cy="103" r="1.2" fill="#fff4d2" opacity="0.9" />
        </g>
      ))}

      {/* Pathway dots */}
      {[80, 90, 100, 110, 120].map((x, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={120 + i * 0.5}
          rx="1.5"
          ry="0.4"
          fill="var(--gold-deep)"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}
