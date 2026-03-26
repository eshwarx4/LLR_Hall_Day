"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";
import { RangoliDivider } from "./festive-elements";
import type { RsvpStatus } from "@/lib/types";

interface RsvpFormProps {
  onSubmit: (name: string, status: RsvpStatus) => Promise<void>;
}

const rsvpOptions: { value: RsvpStatus; label: string; emoji: string; sublabel: string; gradient: string; shadow: string }[] = [
  {
    value: "yes",
    label: "Hell yes!",
    emoji: "🔥",
    sublabel: "I'll be there, no cap",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    shadow: "shadow-orange-500/30",
  },
  {
    value: "maybe",
    label: "Maybe",
    emoji: "🤔",
    sublabel: "Trying my best to make it",
    gradient: "from-amber-600 via-yellow-500 to-lime-500",
    shadow: "shadow-amber-500/30",
  },
  {
    value: "no",
    label: "Can't make it",
    emoji: "😢",
    sublabel: "Next time for sure",
    gradient: "from-gray-500 to-gray-600",
    shadow: "shadow-gray-500/20",
  },
];

export default function RsvpForm({ onSubmit }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Drop your name first!"); return; }
    if (name.trim().length < 2) { setError("That's too short — real name please!"); return; }
    if (!status) { setError("Pick one — we won't judge 😄"); return; }
    setError("");
    setLoading(true);
    try {
      await onSubmit(name.trim(), status);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center max-w-sm"
          >
            <motion.div
              className="relative w-28 h-28 mx-auto mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
            >
              <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${
                status === "yes" ? "from-orange-500 to-amber-600" : status === "maybe" ? "from-amber-500 to-yellow-600" : "from-gray-500 to-gray-600"
              } flex items-center justify-center shadow-2xl`}>
                <span className="text-5xl">
                  {status === "yes" ? "🪷" : status === "maybe" ? "🤞" : "💙"}
                </span>
              </div>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl font-black text-white mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {status === "yes" ? "You're in! 🎉" : status === "maybe" ? "Noted! 🤞" : "We'll miss you 😢"}
            </motion.h2>

            <motion.p
              className="text-amber-200/40 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {status === "yes"
                ? <>{name.split(" ")[0]}, <span className="text-amber-200/60">{EVENT_CONFIG.eventName}</span> just got 10x better!</>
                : status === "maybe"
                ? <>We really hope to see you, {name.split(" ")[0]}!</>
                : <>Maybe next time, {name.split(" ")[0]}. You{"'"}ll be missed.</>}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md"
          >
            <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <motion.span
                className="text-5xl block mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                🙏
              </motion.span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Who{"'"}s this?</h2>
              <p className="text-amber-200/30 text-sm">Drop your name & let us know if you{"'"}re pulling up</p>
            </motion.div>

            <RangoliDivider />

            {/* Name input */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8 relative">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && status && handleSubmit()}
                maxLength={50}
                className="relative w-full px-6 py-5 rounded-2xl glass-strong text-white placeholder-white/20 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all duration-300"
                aria-label="Your name"
                autoComplete="name"
              />
            </motion.div>

            {/* RSVP Cards */}
            <motion.div className="space-y-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <p className="text-amber-300/25 text-xs font-medium uppercase tracking-widest mb-4 text-center">
                Are you coming?
              </p>
              {rsvpOptions.map((option, i) => {
                const isSelected = status === option.value;
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => { setStatus(option.value); setError(""); }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 text-left group ${
                      isSelected
                        ? `bg-gradient-to-r ${option.gradient} border-transparent text-white shadow-xl ${option.shadow}`
                        : "glass border-orange-500/5 hover:border-orange-500/10 text-white/70"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    aria-pressed={isSelected}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <div className="flex-1">
                      <span className="font-bold text-base block">{option.label}</span>
                      <span className={`text-xs ${isSelected ? "text-white/70" : "text-white/25"}`}>{option.sublabel}</span>
                    </div>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <Check size={16} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0 }} className="mb-4">
                  <p className="text-red-400 text-sm text-center glass px-4 py-2.5 rounded-xl">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl blur-xl opacity-30" />
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className="relative w-full py-5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 btn-gradient text-white font-bold text-lg shadow-2xl disabled:opacity-50 transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <Loader2 size={24} className="animate-spin mx-auto" /> : (
                  <span className="flex items-center justify-center gap-2">
                    {EVENT_CONFIG.cta.rsvp}
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                  </span>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
