"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ChevronRight } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";
import { RangoliDivider } from "./festive-elements";

interface InterestPickerProps {
  onSubmit: (interests: string[], otherInterest?: string) => Promise<void>;
  onSkip: () => void;
}

export default function InterestPicker({ onSubmit, onSkip }: InterestPickerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const [showOther, setShowOther] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const handleSubmit = async () => {
    setLoading(true);
    try { await onSubmit(selected, otherText.trim() || undefined); } catch {}
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[60dvh] flex flex-col items-center justify-center px-6 py-16">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/30">
          <span className="text-4xl">🪷</span>
        </motion.div>
        <p className="text-amber-200/50 text-lg text-center font-medium">Saved your picks! 🎯</p>
      </motion.section>
    );
  }

  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <motion.span className="text-5xl block mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>🎯</motion.span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">What{"'"}s your vibe?</h2>
          <p className="text-amber-200/30 text-sm">Pick what you{"'"}re hyped about — select all that apply</p>
        </motion.div>

        <RangoliDivider />

        <div className="grid grid-cols-2 gap-3 mb-8">
          {EVENT_CONFIG.interests.map((interest, i) => {
            const isSelected = selected.includes(interest.id);
            return (
              <motion.button
                key={interest.id}
                onClick={() => toggle(interest.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 300 }}
                className={`relative flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? "glass-strong border-orange-500/30 shadow-lg shadow-orange-500/10"
                    : "glass border-white/5 hover:border-orange-500/10"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.93 }}
              >
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </motion.div>
                )}
                <motion.span className="text-3xl" animate={isSelected ? { scale: [1, 1.3, 1] } : {}}>{interest.emoji}</motion.span>
                <span className={`font-semibold text-sm ${isSelected ? "text-amber-200" : "text-white/40"}`}>{interest.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Hype meter */}
        {selected.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-amber-300/25 text-xs mb-2 uppercase tracking-widest">Hype Level</p>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <motion.div key={level}
                    className={`w-8 h-2 rounded-full ${level <= selected.length ? "bg-gradient-to-r from-orange-500 to-amber-400" : "bg-white/5"}`}
                    initial={level <= selected.length ? { scaleX: 0 } : {}}
                    animate={{ scaleX: 1 }}
                  />
                ))}
              </div>
              <p className="text-amber-200/30 text-xs mt-2">
                {selected.length === 1 ? "Just getting started 👀" : selected.length <= 3 ? "Good vibes incoming 🌊" : selected.length <= 5 ? "Now we're talking! 🔥" : "Maximum hype 🚀"}
              </p>
            </div>
          </motion.div>
        )}

        <button onClick={() => setShowOther(!showOther)} className="text-amber-300/25 text-sm mb-3 hover:text-amber-300/40 transition-colors flex items-center gap-1">
          <span>✏️</span> Something else?
        </button>

        <AnimatePresence>
          {showOther && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <input type="text" placeholder="What else are you excited for?" value={otherText} onChange={(e) => setOtherText(e.target.value)}
                maxLength={100} className="w-full px-5 py-4 rounded-2xl glass-strong text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-3 mt-4">
          <motion.div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl blur-xl opacity-25" />
            <motion.button onClick={handleSubmit} disabled={loading}
              className="relative w-full py-5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 btn-gradient text-white font-bold text-lg shadow-2xl disabled:opacity-50 transition-all"
              whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              {loading ? <Loader2 size={24} className="animate-spin mx-auto" /> : EVENT_CONFIG.cta.interests}
            </motion.button>
          </motion.div>
          <button onClick={onSkip} className="text-white/15 text-sm py-2 hover:text-white/30 transition-colors flex items-center justify-center gap-1">
            Skip for now <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
