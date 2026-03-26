"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserCheck, HelpCircle, Flame } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";
import { RangoliDivider } from "./festive-elements";
import type { AttendeePublic, AttendeeStats } from "@/lib/types";

const avatarGradients = [
  "from-orange-500 to-amber-500",
  "from-red-500 to-pink-500",
  "from-amber-500 to-yellow-500",
  "from-green-600 to-emerald-500",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-green-500",
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
];

function getGradient(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarGradients[Math.abs(h) % avatarGradients.length];
}

function AnimCounter({ value, label, icon: Icon, gradient }: { value: number; label: string; icon: React.ElementType; gradient: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    let n = 0;
    const step = Math.max(1, Math.floor(value / 20));
    const t = setInterval(() => { n += step; if (n >= value) { setDisplay(value); clearInterval(t); } else setDisplay(n); }, 40);
    return () => clearInterval(t);
  }, [value]);
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="glass-strong rounded-2xl p-5 text-center relative overflow-hidden group border border-orange-500/5">
      <Icon size={20} className="text-amber-300/30 mx-auto mb-2" />
      <p className={`text-3xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{display}</p>
      <p className="text-amber-200/25 text-xs mt-1 uppercase tracking-wider font-medium">{label}</p>
    </motion.div>
  );
}

export default function AttendeeWall() {
  const [attendees, setAttendees] = useState<AttendeePublic[]>([]);
  const [stats, setStats] = useState<AttendeeStats>({ total: 0, coming: 0, maybe: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attendees").then(r => r.json()).then(d => {
      setAttendees(d.attendees || []);
      setStats(d.stats || { total: 0, coming: 0, maybe: 0 });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-[80dvh] flex flex-col items-center px-6 py-16">
      <motion.div className="w-full max-w-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <motion.div className="text-center mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <motion.span className="text-5xl block mb-4" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring" }}>🤙</motion.span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">{EVENT_CONFIG.attendeeWall.title}</h2>
          <p className="text-amber-200/30 text-sm">See who{"'"}s pulling up to {EVENT_CONFIG.eventName}</p>
        </motion.div>

        <RangoliDivider />

        <div className="grid grid-cols-3 gap-3 mb-10">
          <AnimCounter value={stats.total} label="Total" icon={Users} gradient="from-orange-400 to-amber-400" />
          <AnimCounter value={stats.coming} label={EVENT_CONFIG.attendeeWall.comingLabel} icon={UserCheck} gradient="from-green-400 to-emerald-400" />
          <AnimCounter value={stats.maybe} label={EVENT_CONFIG.attendeeWall.maybeLabel} icon={HelpCircle} gradient="from-yellow-400 to-orange-400" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-amber-200/20 text-sm">Loading the squad...</p>
          </div>
        ) : attendees.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl mb-4">👀</motion.div>
            <p className="text-white/25 text-lg font-medium mb-1">No one yet...</p>
            <p className="text-white/15 text-sm">{EVENT_CONFIG.attendeeWall.emptyMessage}</p>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 py-2 mb-2">
              <Flame size={14} className="text-orange-400" />
              <span className="text-amber-200/25 text-xs font-medium">{attendees.length} {attendees.length === 1 ? "person" : "people"} showing up</span>
              <Flame size={14} className="text-orange-400" />
            </motion.div>
            <AnimatePresence>
              {attendees.map((a, i) => (
                <motion.div key={`${a.name}-${i}`}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: Math.min(i * 0.05, 0.6), type: "spring", stiffness: 300 }}
                  className="glass rounded-2xl overflow-hidden group hover:border-orange-500/10 transition-all duration-300">
                  <div className="flex items-center gap-3.5 px-4 py-3.5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(a.name)} flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg`}>
                      {a.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{a.name}</p>
                      {a.interests.length > 0 && (
                        <p className="text-white/20 text-xs mt-0.5 truncate">
                          {a.interests.map(id => EVENT_CONFIG.interests.find(i => i.id === id)).filter(Boolean).map(i => `${i!.emoji} ${i!.label}`).join(" · ")}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-xl font-semibold shrink-0 ${
                      a.rsvp_status === "yes" ? "bg-orange-500/10 text-orange-300 border border-orange-500/20" : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    }`}>
                      {a.rsvp_status === "yes" ? "Coming 🔥" : "Maybe 🤞"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </section>
  );
}
