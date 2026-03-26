"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Falling flower petals
const petalEmojis = ["🌸", "🪷", "🌺", "🌼"];

interface Petal {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export function FallingPetals({ count = 12 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: petalEmojis[Math.floor(Math.random() * petalEmojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 8,
        size: 10 + Math.random() * 8,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute opacity-40"
          style={{ left: `${petal.x}%`, fontSize: petal.size, top: -30 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(petal.id) * 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {petal.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// Mango leaf toran — hand-drawn SVG style with hanging marigolds
export function MangoLeafToran({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg viewBox="0 0 400 55" className="w-full h-auto" preserveAspectRatio="none">
        {/* Main string / rope */}
        <path
          d="M-5,8 Q40,28 80,10 Q120,32 160,12 Q200,30 240,10 Q280,32 320,12 Q360,28 405,8"
          fill="none"
          stroke="#5D4037"
          strokeWidth="1.5"
          opacity="0.7"
        />

        {/* Leaf pairs + marigolds */}
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((cx, i) => {
          const cy = i % 2 === 0 ? 18 : 22;
          return (
            <g key={i}>
              {/* Left leaf */}
              <ellipse
                cx={cx - 7}
                cy={cy + 6}
                rx="4.5"
                ry="12"
                fill="#2E7D32"
                opacity="0.85"
                transform={`rotate(-25, ${cx - 7}, ${cy + 6})`}
              />
              {/* Left leaf vein */}
              <line
                x1={cx - 7}
                y1={cy - 2}
                x2={cx - 7}
                y2={cy + 15}
                stroke="#1B5E20"
                strokeWidth="0.5"
                opacity="0.4"
                transform={`rotate(-25, ${cx - 7}, ${cy + 6})`}
              />
              {/* Right leaf */}
              <ellipse
                cx={cx + 7}
                cy={cy + 6}
                rx="4.5"
                ry="12"
                fill="#388E3C"
                opacity="0.85"
                transform={`rotate(25, ${cx + 7}, ${cy + 6})`}
              />
              {/* Right leaf vein */}
              <line
                x1={cx + 7}
                y1={cy - 2}
                x2={cx + 7}
                y2={cy + 15}
                stroke="#1B5E20"
                strokeWidth="0.5"
                opacity="0.4"
                transform={`rotate(25, ${cx + 7}, ${cy + 6})`}
              />
              {/* Marigold flower (every other leaf pair) */}
              {i % 2 === 0 && (
                <g>
                  {/* Outer petals */}
                  <circle cx={cx} cy={cy + 24} r="7" fill="#FF8F00" opacity="0.9" />
                  {/* Inner ring */}
                  <circle cx={cx} cy={cy + 24} r="4.5" fill="#FFB300" opacity="0.95" />
                  {/* Center */}
                  <circle cx={cx} cy={cy + 24} r="2.5" fill="#FFD54F" />
                  {/* Connecting thread */}
                  <line x1={cx} y1={cy + 4} x2={cx} y2={cy + 17} stroke="#5D4037" strokeWidth="0.8" opacity="0.5" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Decorative diya (oil lamp)
export function Diya({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,179,0,0.6), transparent)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <span className="text-2xl">🪔</span>
    </div>
  );
}

// Rangoli-style decorative divider
export function RangoliDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-400/30" />
      <motion.span
        className="text-amber-400/50 text-base"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        ✦
      </motion.span>
      <span className="text-amber-300/40 text-[6px]">●</span>
      <motion.span
        className="text-sm"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        🪷
      </motion.span>
      <span className="text-amber-300/40 text-[6px]">●</span>
      <motion.span
        className="text-amber-400/50 text-base"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        ✦
      </motion.span>
      <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-400/30" />
    </div>
  );
}
