"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Check } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";
import type { RsvpStatus } from "@/lib/types";

interface InvitationCardProps {
  name: string;
  status: RsvpStatus;
  onContinue: () => void;
}

export default function InvitationCard({ name, status, onContinue }: InvitationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const firstName = name.split(" ")[0];

  const handleShare = async () => {
    const text = `I'm ${status === "yes" ? "going" : "maybe going"} to ${EVENT_CONFIG.eventName}! 🪷✨ #LLRHallDay`;
    if (navigator.share) {
      try {
        await navigator.share({ title: EVENT_CONFIG.eventName, text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    // Dynamic import to keep bundle small
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#1a0f0a",
      scale: 3,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `${EVENT_CONFIG.eventName.replace(/\s/g, "-")}-invite.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-10">
      {/* ===== THE CARD ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotateX: 15 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
        className="w-full max-w-[340px] perspective-1000"
      >
        <div
          ref={cardRef}
          className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl shadow-orange-900/30"
          style={{ background: "linear-gradient(160deg, #2a1a0e 0%, #1a0f0a 40%, #0f0a06 100%)" }}
        >
          {/* Decorative top pattern */}
          <div className="relative h-3 w-full bg-gradient-to-r from-orange-700 via-amber-500 to-orange-700" />

          {/* Toran SVG inside card */}
          <svg viewBox="0 0 340 35" className="w-full" preserveAspectRatio="none">
            <path d="M0,5 Q42,20 85,7 Q127,22 170,8 Q212,22 255,7 Q297,20 340,5" fill="none" stroke="#5D4037" strokeWidth="1.2" opacity="0.6" />
            {[42, 85, 127, 170, 212, 255, 297].map((cx, i) => (
              <g key={i}>
                <ellipse cx={cx - 5} cy={15} rx="3.5" ry="10" fill="#2E7D32" opacity="0.8" transform={`rotate(-22,${cx - 5},15)`} />
                <ellipse cx={cx + 5} cy={15} rx="3.5" ry="10" fill="#388E3C" opacity="0.8" transform={`rotate(22,${cx + 5},15)`} />
                {i % 2 === 0 && <circle cx={cx} cy={28} r="5" fill="#FFB300" opacity="0.9" />}
                {i % 2 === 0 && <circle cx={cx} cy={28} r="3" fill="#FFD54F" />}
              </g>
            ))}
          </svg>

          {/* Card body */}
          <div className="px-6 pb-6 pt-2 text-center">
            {/* Diyas */}
            <div className="flex justify-center gap-10 mb-3">
              <motion.span className="text-xl" animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>🪔</motion.span>
              <motion.span className="text-xl" animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>🪔</motion.span>
            </div>

            {/* Festival label */}
            <p className="text-amber-400/40 text-[9px] tracking-[0.3em] uppercase font-semibold mb-3">
              {EVENT_CONFIG.festivalName} Celebration
            </p>

            {/* Event name */}
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-black text-white mb-1 drop-shadow-lg">
              {EVENT_CONFIG.eventName}
            </h2>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-3">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-500/40" />
              <span className="text-amber-400 text-xs">🪷</span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-500/40" />
            </div>

            {/* Personalized name — the star of the card */}
            <p className="text-amber-300/50 text-xs tracking-wider mb-1.5">
              {status === "yes" ? "This certifies that" : "Hoping to see"}
            </p>
            <motion.h3
              className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 bg-clip-text text-transparent mb-1.5 py-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {name}
            </motion.h3>
            <p className="text-amber-300/40 text-xs tracking-wider mb-4">
              {status === "yes"
                ? "will be gracing us with their presence"
                : "at the celebrations"}
            </p>

            {/* Status badge */}
            <motion.div
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold mb-5 ${
                status === "yes"
                  ? "bg-orange-500/15 text-orange-300 border border-orange-500/25"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              {status === "yes" ? "🔥 Confirmed" : "🤞 Maybe"}
            </motion.div>

            {/* Event details grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <div className="py-2.5 px-3 rounded-xl bg-white/3 border border-white/5">
                <p className="text-amber-300/25 text-[8px] uppercase tracking-widest mb-0.5">Date</p>
                <p className="text-white/70 text-xs font-semibold">{EVENT_CONFIG.eventDateDisplay}</p>
              </div>
              <div className="py-2.5 px-3 rounded-xl bg-white/3 border border-white/5">
                <p className="text-amber-300/25 text-[8px] uppercase tracking-widest mb-0.5">Time</p>
                <p className="text-white/70 text-xs font-semibold">{EVENT_CONFIG.eventTimeDisplay}</p>
              </div>
            </div>

            {/* Venue */}
            <div className="py-2.5 px-3 rounded-xl bg-white/3 border border-white/5 mb-5">
              <p className="text-amber-300/25 text-[8px] uppercase tracking-widest mb-0.5">Venue</p>
              <p className="text-white/70 text-xs font-semibold">Lala Lajpat Rai Hall of Residence</p>
              <p className="text-white/35 text-[10px]">{EVENT_CONFIG.subtitle}</p>
            </div>

            {/* Activities row */}
            <div className="flex justify-center gap-3 mb-4">
              {["🎵", "💃", "🍕", "🎮", "🎤"].map((e, i) => (
                <motion.span
                  key={i}
                  className="text-lg"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
                >
                  {e}
                </motion.span>
              ))}
            </div>

            {/* Bottom flowers */}
            <div className="flex justify-center gap-0.5 mb-2">
              {"🌼🌸🌼🌸🌼🌸🌼".split("").map((f, i) => (
                <motion.span
                  key={i}
                  className="text-xs"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2.5, delay: i * 0.1, repeat: Infinity }}
                >
                  {f}
                </motion.span>
              ))}
            </div>

            {/* Footer */}
            <p className="text-amber-500/15 text-[8px] tracking-wider mt-2">
              {EVENT_CONFIG.hallName} • {EVENT_CONFIG.subtitle} • {EVENT_CONFIG.eventDateDisplay}
            </p>
          </div>

          {/* Bottom decorative strip */}
          <div className="h-2 w-full bg-gradient-to-r from-orange-700 via-amber-500 to-orange-700" />
        </div>
      </motion.div>

      {/* ===== ACTION BUTTONS ===== */}
      <motion.div
        className="flex items-center gap-3 mt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {/* Download */}
        <motion.button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <Download size={16} />
          Save
        </motion.button>

        {/* Share */}
        <motion.button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
          {copied ? "Copied!" : "Share"}
        </motion.button>
      </motion.div>

      {/* ===== PERSONALIZED MESSAGE ===== */}
      <motion.p
        className="text-amber-200/30 text-sm mt-6 text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {status === "yes"
          ? `${firstName}, you just made Hall Day 10x better! 🔥`
          : `We really hope to see you, ${firstName}! 🤞`}
      </motion.p>

      {/* ===== CONTINUE BUTTON ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-6 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl blur-xl opacity-25" />
        <motion.button
          onClick={onContinue}
          className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white font-bold text-base shadow-2xl border border-amber-400/20"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue →
        </motion.button>
      </motion.div>
    </section>
  );
}
