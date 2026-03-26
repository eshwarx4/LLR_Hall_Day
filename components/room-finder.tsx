"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, ExternalLink, ChevronRight, ChevronLeft, Loader2, X } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getDistanceMeters, getProximityStatus, type ProximityStatus } from "@/lib/utils";
import HallMap from "./hall-map";
import { RangoliDivider } from "./festive-elements";

function StepNavigator({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const maxStep = EVENT_CONFIG.manualDirections.length - 1;

  return (
    <div className="space-y-6">
      <HallMap activeStep={step} />

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-strong rounded-2xl p-5 border border-orange-500/5">
        <div className="flex items-start gap-4">
          <span className="text-3xl">{EVENT_CONFIG.manualDirections[step].icon}</span>
          <div className="flex-1">
            <p className="text-white font-bold text-base mb-1">Step {step + 1}: {EVENT_CONFIG.manualDirections[step].title}</p>
            <p className="text-amber-200/35 text-sm leading-relaxed">{EVENT_CONFIG.manualDirections[step].description}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-3">
        <motion.button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          className="flex-1 py-3.5 rounded-2xl glass-strong text-white/50 font-medium text-sm disabled:opacity-30 flex items-center justify-center gap-1"
          whileTap={{ scale: 0.97 }}>
          <ChevronLeft size={16} /> Back
        </motion.button>
        {step < maxStep ? (
          <motion.button onClick={() => setStep(step + 1)}
            className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-1 shadow-lg shadow-orange-500/20"
            whileTap={{ scale: 0.97 }} whileHover={{ y: -1 }}>
            Next Step <ChevronRight size={16} />
          </motion.button>
        ) : (
          <motion.button onClick={onDone}
            className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-1 shadow-lg shadow-green-500/20"
            whileTap={{ scale: 0.97 }} initial={{ scale: 0.95 }} animate={{ scale: [0.95, 1.02, 1] }}>
            I{"'"}m Here! 🎉
          </motion.button>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        {EVENT_CONFIG.manualDirections.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? "bg-orange-400 w-6" : i < step ? "bg-orange-400/40" : "bg-white/10"}`} />
        ))}
      </div>
    </div>
  );
}

function WelcomeState() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} className="text-center py-8">
      <motion.div className="text-7xl mb-6" animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🪷</motion.div>
      <h3 className="text-2xl font-black text-white mb-2">Welcome to {EVENT_CONFIG.roomNumber}!</h3>
      <p className="text-amber-200/40">You made it! Happy {EVENT_CONFIG.festivalName} & {EVENT_CONFIG.eventName}! 🥳</p>
      <div className="mt-4 flex justify-center gap-1 text-lg">
        {"🌸🌺🌼🌸🌺🌼🌸".split("").map((f, i) => (
          <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}>{f}</motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function ProximityResult({ proximity, distance }: { proximity: ProximityStatus; distance: number }) {
  const [showMap, setShowMap] = useState(false);
  const [arrived, setArrived] = useState(false);
  const dist = distance > 1000 ? `${(distance / 1000).toFixed(1)} km away` : `${Math.round(distance)}m away`;

  if (arrived) return <WelcomeState />;

  if (proximity === "very_close") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-6">
          <motion.p className="text-5xl mb-3" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}>🏃</motion.p>
          <h3 className="text-xl font-black text-white mb-1">You{"'"}re super close!</h3>
          <p className="text-amber-200/40 text-sm">{dist} — follow the map below!</p>
        </div>
        <StepNavigator onDone={() => setArrived(true)} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center mb-6">
        <p className="text-5xl mb-3">{proximity === "nearby" ? "🚶" : "📍"}</p>
        <h3 className="text-xl font-black text-white mb-1">
          {proximity === "nearby" ? "Almost there!" : `Head to ${EVENT_CONFIG.hallName} first`}
        </h3>
        <p className="text-amber-200/40 text-sm">{dist}</p>
      </div>
      <a href={EVENT_CONFIG.mapsLink} target="_blank" rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl ${proximity === "far" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-base shadow-2xl" : "glass-strong text-blue-400 font-semibold text-sm"} mb-4 transition-colors`}>
        {proximity === "far" ? <Navigation size={18} /> : <ExternalLink size={16} />}
        {EVENT_CONFIG.cta.openMaps}
      </a>
      <button onClick={() => setShowMap(true)} className="w-full text-amber-200/25 text-sm py-2 hover:text-amber-200/40 transition-colors flex items-center justify-center gap-1 mb-4">
        {showMap ? "Hide" : "See"} the hall map <ChevronRight size={14} />
      </button>
      <AnimatePresence>
        {showMap && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <StepNavigator onDone={() => setArrived(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RoomFinder() {
  const [activated, setActivated] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [arrived, setArrived] = useState(false);
  const geo = useGeolocation();

  const proximity = geo.latitude && geo.longitude
    ? getProximityStatus(getDistanceMeters(geo.latitude, geo.longitude, EVENT_CONFIG.hallCoordinates.latitude, EVENT_CONFIG.hallCoordinates.longitude), EVENT_CONFIG.proximityThresholds)
    : null;
  const distance = geo.latitude && geo.longitude
    ? getDistanceMeters(geo.latitude, geo.longitude, EVENT_CONFIG.hallCoordinates.latitude, EVENT_CONFIG.hallCoordinates.longitude)
    : 0;

  if (arrived) return <section className="px-6 py-16"><WelcomeState /></section>;

  return (
    <section className="min-h-[80dvh] flex flex-col items-center px-6 py-16">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="text-center mb-10">
          <motion.div className="relative w-20 h-20 mx-auto mb-5" whileInView={{ rotate: [0, -5, 5, 0] }} viewport={{ once: true }}>
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <MapPin size={32} className="text-white" />
            </div>
            <motion.div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-black text-black"
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>!</motion.div>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Find {EVENT_CONFIG.roomNumber}</h2>
          <p className="text-amber-200/30 text-sm">Lost in the hall? Follow the pixel map!</p>
        </div>

        <RangoliDivider />

        <AnimatePresence mode="wait">
          {!activated && !showManual ? (
            <motion.div key="cta" exit={{ opacity: 0 }} className="space-y-3">
              <motion.div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-xl opacity-30" />
                <motion.button onClick={() => { setActivated(true); geo.requestLocation(); }}
                  className="relative w-full py-5 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 btn-gradient text-white font-bold text-lg shadow-2xl transition-all"
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <span className="flex items-center justify-center gap-2"><Navigation size={20} />{EVENT_CONFIG.cta.roomFinder}</span>
                </motion.button>
              </motion.div>
              <button onClick={() => setShowManual(true)} className="w-full text-amber-200/20 text-sm py-2 hover:text-amber-200/35 transition-colors flex items-center justify-center gap-1">
                Just show me the map <ChevronRight size={14} />
              </button>
            </motion.div>
          ) : showManual && !activated ? (
            <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <a href={EVENT_CONFIG.mapsLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl glass-strong text-blue-400 font-semibold text-sm mb-6">
                <ExternalLink size={16} />{EVENT_CONFIG.cta.openMaps}
              </a>
              <StepNavigator onDone={() => setArrived(true)} />
            </motion.div>
          ) : geo.loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Loader2 size={36} className="animate-spin text-orange-400 mx-auto mb-4" />
              <p className="text-amber-200/40 font-medium">Getting your location...</p>
            </motion.div>
          ) : geo.error || geo.unsupported || geo.permissionDenied ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-sm mb-6">
                <X size={16} className="shrink-0" />
                <span>{geo.unsupported ? "Browser doesn't support location." : geo.permissionDenied ? "Location access denied." : "Couldn't get location."}</span>
              </div>
              <p className="text-amber-200/30 text-sm text-center mb-4">No worries — use the pixel map:</p>
              <a href={EVENT_CONFIG.mapsLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl glass-strong text-blue-400 font-semibold text-sm mb-6">
                <ExternalLink size={16} />{EVENT_CONFIG.cta.openMaps}
              </a>
              <StepNavigator onDone={() => setArrived(true)} />
            </motion.div>
          ) : proximity ? (
            <ProximityResult key="result" proximity={proximity} distance={distance} />
          ) : null}
        </AnimatePresence>

        <motion.div className="text-center mt-16 pt-8 border-t border-amber-500/5" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-amber-200/10 text-xs">Room {EVENT_CONFIG.roomNumber} · {EVENT_CONFIG.hallName} · IIT Kharagpur</p>
          <p className="text-amber-200/7 text-xs mt-1">Made with 🪷 for {EVENT_CONFIG.festivalName} & Hall Day</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
