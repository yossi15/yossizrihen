"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import WaxSeal from "./WaxSeal";

type Props = {
  onOpen: () => void;
  initials?: string;
};

export default function Envelope({ onOpen, initials = "Y&R" }: Props) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(onOpen, 1700);
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--cream)] via-[var(--cream-soft)] to-[var(--cream)] px-4">
      {/* Decorative gold flourishes */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        aria-hidden
      >
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-px gold-divider" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-px gold-divider" />
      </motion.div>

      <motion.div
        className="relative w-full max-w-md aspect-[5/3.5]"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{
          opacity: 1,
          scale: isOpening ? 1.04 : 1,
          y: isOpening ? -20 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Envelope body */}
        <div
          className="absolute inset-0 rounded-md shadow-[0_30px_60px_-20px_rgba(58,49,40,0.4),0_18px_36px_-18px_rgba(58,49,40,0.3)]"
          style={{
            background:
              "linear-gradient(135deg, #f4e9d2 0%, #ead7b1 50%, #d4be8f 100%)",
          }}
        >
          {/* Inner border */}
          <div className="absolute inset-3 border border-[var(--gold)]/40 rounded-sm" />
          <div className="absolute inset-4 border border-[var(--gold)]/20 rounded-sm" />
        </div>

        {/* Bottom triangles (envelope folds) */}
        <svg
          viewBox="0 0 500 350"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Left fold */}
          <polygon
            points="0,0 0,350 250,175"
            fill="rgba(58,49,40,0.06)"
          />
          {/* Right fold */}
          <polygon
            points="500,0 500,350 250,175"
            fill="rgba(58,49,40,0.06)"
          />
          {/* Bottom fold */}
          <polygon
            points="0,350 500,350 250,175"
            fill="rgba(58,49,40,0.1)"
          />
        </svg>

        {/* Top flap */}
        <motion.div
          className="absolute inset-x-0 top-0 origin-top"
          style={{ transformPerspective: 1200 }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: isOpening ? -178 : 0 }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.6 }}
        >
          <svg
            viewBox="0 0 500 250"
            className="w-full h-auto block drop-shadow-[0_2px_4px_rgba(58,49,40,0.15)]"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f4e9d2" />
                <stop offset="100%" stopColor="#d4be8f" />
              </linearGradient>
              <linearGradient id="flapBack" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbf5ea" />
                <stop offset="100%" stopColor="#ead7b1" />
              </linearGradient>
            </defs>
            <polygon
              points="0,0 500,0 250,250"
              fill="url(#flapGrad)"
              stroke="rgba(201,169,97,0.5)"
              strokeWidth="1"
            />
            <polygon
              points="0,0 500,0 250,250"
              fill="url(#flapBack)"
              opacity="0"
            />
          </svg>
        </motion.div>

        {/* Wax seal centered on envelope where flap meets */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="pointer-events-auto -translate-y-2">
            <WaxSeal
              initials={initials}
              onClick={handleClick}
              isOpening={isOpening}
            />
          </div>
        </div>
      </motion.div>

      {/* Subtle instruction */}
      <AnimatePresence>
        {!isOpening && (
          <motion.p
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--ink-soft)] text-xs tracking-[0.4em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            הוזמנתם
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
