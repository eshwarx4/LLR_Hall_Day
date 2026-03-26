"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { EVENT_CONFIG } from "@/lib/config";
import Countdown from "./countdown";
import { MangoLeafToran } from "./festive-elements";

interface LandingHeroProps {
  onContinue: () => void;
}

const activities = [
  { emoji: "🎵", label: "Music" },
  { emoji: "💃", label: "Dance" },
  { emoji: "🍕", label: "Food" },
  { emoji: "🎮", label: "Games" },
  { emoji: "🎤", label: "Open Mic" },
  { emoji: "🏆", label: "Competitions" },
];

export default function LandingHero({ onContinue }: LandingHeroProps) {
  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      {/* ===== HALL PHOTO BACKGROUND with Ken Burns ===== */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ scale: [1, 1.06, 1.03] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/hall.jpg"
          alt="Lala Lajpat Rai Hall of Residence"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
      </motion.div>

      {/* Overlays for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/20 to-black/85" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#1a0f0a] via-transparent to-transparent" />

      {/* ===== MANGO LEAF TORAN ===== */}
      <div className="relative z-10">
        <MangoLeafToran />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
        {/* Festival badge */}
        <motion.div
          className="flex items-center gap-4 mb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span className="text-xl" animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }}>🪔</motion.span>
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-amber-300/15">
            <span className="text-[11px] font-medium text-amber-200/80 tracking-wider">
              🪷 {EVENT_CONFIG.festivalName} Special 🪷
            </span>
          </div>
          <motion.span className="text-xl" animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>🪔</motion.span>
        </motion.div>

        {/* ===== INVITATION TEXT ===== */}
        <motion.p
          className="text-amber-200/70 text-sm tracking-[0.25em] uppercase font-medium mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          You{"'"}re Invited to
        </motion.p>

        {/* ===== TITLE ===== */}
        <motion.h1
          className="font-[family-name:var(--font-playfair)] text-center leading-[1.05] mb-3"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-[3.2rem] sm:text-7xl font-black text-white drop-shadow-2xl">
            LLR Hall Day
          </span>
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          className="flex items-center gap-2.5 mb-3"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-400/50" />
          <span className="text-amber-300/60 text-[10px]">✦</span>
          <span className="text-sm">🪷</span>
          <span className="text-amber-300/60 text-[10px]">✦</span>
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-400/50" />
        </motion.div>

        {/* Hall name + college */}
        <motion.p
          className="text-white/60 text-sm font-medium mb-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        >
          Lala Lajpat Rai Hall of Residence
        </motion.p>
        <motion.p
          className="text-white/35 text-xs mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {EVENT_CONFIG.subtitle}
        </motion.p>

        {/* ===== DATE PILL ===== */}
        <motion.div
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/8 backdrop-blur-md border border-white/10 mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <span className="text-xs">🗓️</span>
          <span className="text-[13px] font-semibold text-amber-100/90">{EVENT_CONFIG.eventDateDisplay}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-amber-300/30" />
          <span className="text-[13px] text-amber-200/50">{EVENT_CONFIG.eventTimeDisplay}</span>
        </motion.div>

        {/* ===== COUNTDOWN ===== */}
        <motion.div
          className="mb-7"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Countdown />
        </motion.div>

        {/* ===== ACTIVITIES PLANNED ===== */}
        <motion.div
          className="w-full max-w-xs mb-7"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <p className="text-amber-300/30 text-[10px] uppercase tracking-[0.2em] text-center font-semibold mb-3">
            What{"'"}s Happening
          </p>
          <div className="grid grid-cols-3 gap-2">
            {activities.map((a, i) => (
              <motion.div
                key={a.label}
                className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.07 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <motion.span
                  className="text-lg"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {a.emoji}
                </motion.span>
                <span className="text-[10px] text-white/50 font-medium">{a.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== CTA BUTTON ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 150 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-2xl opacity-35" />
          <motion.button
            onClick={onContinue}
            className="relative px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white font-bold text-base shadow-2xl shadow-orange-900/40 border border-amber-400/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {EVENT_CONFIG.cta.hero}
          </motion.button>
        </motion.div>

        {/* Bottom flowers */}
        <motion.div
          className="flex justify-center items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.8 }}
        >
          {"🌼🌸🌼🌸🌼🌸🌼".split("").map((f, i) => (
            <motion.span
              key={i}
              className="text-sm"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }}
            >
              {f}
            </motion.span>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.p
          className="mt-3 text-white/20 text-[9px] tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            ↓ Tap to RSVP
          </motion.span>
        </motion.p>
      </div>

      {/* Bottom gold strip */}
      <div className="relative z-10">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      </div>
    </section>
  );
}
