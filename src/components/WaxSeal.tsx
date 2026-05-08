"use client";

import { motion } from "framer-motion";

type Props = {
  initials?: string;
  onClick?: () => void;
  isOpening?: boolean;
};

export default function WaxSeal({ initials = "Y&R", onClick, isOpening = false }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isOpening}
      aria-label="פתח את ההזמנה"
      className="relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--cream)] rounded-full"
      initial={{ scale: 0, rotate: -90 }}
      animate={
        isOpening
          ? { scale: [1, 1.15, 0], rotate: [0, 12, 60], opacity: [1, 1, 0] }
          : { scale: 1, rotate: 0 }
      }
      transition={
        isOpening
          ? { duration: 0.9, ease: [0.4, 0, 0.2, 1], times: [0, 0.3, 1] }
          : { type: "spring", stiffness: 120, damping: 14, delay: 0.6 }
      }
      whileHover={!isOpening ? { scale: 1.06 } : undefined}
      whileTap={!isOpening ? { scale: 0.95 } : undefined}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--wax)] blur-2xl opacity-50"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <svg
        viewBox="0 0 200 200"
        className="relative w-32 h-32 sm:w-40 sm:h-40 drop-shadow-[0_8px_24px_rgba(122,31,26,0.45)]"
        aria-hidden
      >
        <defs>
          <radialGradient id="waxBody" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#e85a4f" />
            <stop offset="35%" stopColor="#b9342c" />
            <stop offset="100%" stopColor="#5e1612" />
          </radialGradient>
          <radialGradient id="waxHighlight" cx="30%" cy="25%" r="30%">
            <stop offset="0%" stopColor="rgba(255,220,210,0.85)" />
            <stop offset="100%" stopColor="rgba(255,220,210,0)" />
          </radialGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e7d4a3" />
            <stop offset="50%" stopColor="#c9a961" />
            <stop offset="100%" stopColor="#8b6a2e" />
          </linearGradient>
        </defs>

        {/* Drips around edge */}
        <path
          d="M 100 6
             Q 130 4, 152 18
             Q 178 28, 188 58
             Q 198 92, 184 128
             Q 174 162, 142 184
             Q 112 198, 78 188
             Q 42 178, 22 148
             Q 4 116, 12 78
             Q 22 42, 52 22
             Q 76 8, 100 6 Z"
          fill="url(#waxBody)"
        />

        {/* Highlight */}
        <ellipse cx="78" cy="68" rx="38" ry="26" fill="url(#waxHighlight)" />

        {/* Inner ring */}
        <circle
          cx="100"
          cy="100"
          r="62"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <circle
          cx="100"
          cy="100"
          r="56"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Tiny stars */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = 100 + Math.cos(rad) * 70;
          const y = 100 + Math.sin(rad) * 70;
          return (
            <circle
              key={angle}
              cx={x}
              cy={y}
              r="1.4"
              fill="url(#goldGrad)"
              opacity="0.7"
            />
          );
        })}

        {/* Monogram */}
        <text
          x="100"
          y="118"
          textAnchor="middle"
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="46"
          fontStyle="italic"
          fontWeight="600"
          fill="url(#goldGrad)"
          style={{ letterSpacing: "-0.02em" }}
        >
          {initials}
        </text>
      </svg>

      {/* Click hint */}
      {!isOpening && (
        <motion.div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs tracking-[0.3em] uppercase text-[var(--gold-deep)] shimmer"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          לחצו לפתיחה
        </motion.div>
      )}
    </motion.button>
  );
}
