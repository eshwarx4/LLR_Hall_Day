"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EVENT_CONFIG } from "@/lib/config";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = new Date(EVENT_CONFIG.eventDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/8 flex items-center justify-center">
        <motion.span
          key={value}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl sm:text-2xl font-bold text-amber-100/90 tabular-nums"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="text-[9px] text-amber-300/25 mt-1.5 uppercase tracking-widest font-medium">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="h-14" />;

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <Unit value={time.days} label="Days" />
      <span className="text-amber-300/15 text-lg font-light mt-[-16px]">:</span>
      <Unit value={time.hours} label="Hrs" />
      <span className="text-amber-300/15 text-lg font-light mt-[-16px]">:</span>
      <Unit value={time.minutes} label="Min" />
      <span className="text-amber-300/15 text-lg font-light mt-[-16px]">:</span>
      <Unit value={time.seconds} label="Sec" />
    </div>
  );
}
