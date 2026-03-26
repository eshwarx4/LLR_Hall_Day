"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EVENT_CONFIG } from "@/lib/config";

interface HallMapProps {
  activeStep: number;
  showCharacter?: boolean;
}

// Character position per step (percentage x, y on the map)
const charPath = [
  { x: 50, y: 90 },  // 0: outside at road
  { x: 50, y: 72 },  // 1: at entrance
  { x: 50, y: 52 },  // 2: at staircase
  { x: 35, y: 32 },  // 3: 2nd floor left turn
  { x: 22, y: 22 },  // 4: corridor walking
  { x: 22, y: 15 },  // 5: at B-206!
];

// Pixel sprite of a person (CSS based)
function PixelSprite({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <motion.div
      className="absolute z-40"
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: "spring", stiffness: 80, damping: 14, mass: 1 }}
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        {/* Name label like Gather */}
        {label && (
          <div className="bg-black/70 text-white text-[8px] px-2 py-0.5 rounded-full mb-1 whitespace-nowrap font-bold border border-green-400/40">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1" />
            {label}
          </div>
        )}
        {/* Pixel character body */}
        <div className="relative w-6 h-8">
          {/* Head */}
          <div className="absolute top-0 left-1 w-4 h-4 bg-amber-200 rounded-sm border border-amber-400/50" />
          {/* Eyes */}
          <div className="absolute top-1 left-1.5 w-1 h-1 bg-gray-800 rounded-full" />
          <div className="absolute top-1 left-3 w-1 h-1 bg-gray-800 rounded-full" />
          {/* Body */}
          <div className="absolute top-4 left-0.5 w-5 h-3 bg-blue-500 rounded-sm" />
          {/* Legs */}
          <div className="absolute top-7 left-1 w-1.5 h-1.5 bg-gray-700 rounded-sm" />
          <div className="absolute top-7 left-3 w-1.5 h-1.5 bg-gray-700 rounded-sm" />
        </div>
        {/* Shadow */}
        <div className="w-5 h-1 bg-black/20 rounded-full mt-0.5" />
      </motion.div>
    </motion.div>
  );
}

// Pixel furniture items
function PixelBed({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <div className="w-5 h-3 bg-blue-300/60 border border-blue-400/40 rounded-sm" />
      <div className="w-1.5 h-1 bg-white/60 rounded-sm absolute top-0.5 left-0.5" />
    </div>
  );
}

function PixelDesk({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="w-4 h-2.5 bg-amber-700/50 border border-amber-800/40 rounded-sm" />
      <div className="w-2 h-1.5 bg-gray-400/40 rounded-sm absolute -top-1 left-1" /> {/* monitor */}
    </div>
  );
}

function PixelPlant({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="text-[10px]">🌿</div>
    </div>
  );
}

function PixelDiya({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="text-[9px]">🪔</div>
    </motion.div>
  );
}

export default function HallMap({ activeStep, showCharacter = true }: HallMapProps) {
  const [step, setStep] = useState(0);
  useEffect(() => { setStep(Math.min(activeStep, charPath.length - 1)); }, [activeStep]);
  const pos = charPath[step];

  const rooms = [
    { name: "B-201", x: 10, y: 8, target: false },
    { name: "B-202", x: 25, y: 8, target: false },
    { name: "B-203", x: 40, y: 8, target: false },
    { name: "B-204", x: 55, y: 8, target: false },
    { name: "B-205", x: 10, y: 20, target: false },
    { name: "B-206", x: 25, y: 20, target: true },
    { name: "B-207", x: 40, y: 20, target: false },
    { name: "B-208", x: 55, y: 20, target: false },
    { name: "B-209", x: 70, y: 8, target: false },
    { name: "B-210", x: 70, y: 20, target: false },
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-500/15 shadow-2xl shadow-orange-500/10">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b0e] via-[#1a1510] to-[#12100e]" />

      {/* Pixel grid floor overlay */}
      <div className="absolute inset-0 pixel-floor opacity-30" />

      {/* === 2ND FLOOR AREA (top portion) === */}
      <div className="absolute left-[5%] right-[5%] top-[3%] bottom-[35%]">
        {/* Floor background */}
        <div className="absolute inset-0 bg-amber-900/10 rounded-xl border border-amber-500/10">
          {/* Floor label */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-900/60 text-amber-200/60 text-[8px] px-3 py-0.5 rounded-full font-bold whitespace-nowrap border border-amber-500/15">
            🏛️ 2ND FLOOR — B WING
          </div>
        </div>

        {/* Rooms */}
        {rooms.map((room) => (
          <motion.div
            key={room.name}
            className={`absolute w-[12%] h-[28%] rounded-md flex flex-col items-center justify-center ${
              room.target ? "pixel-room-active" : "pixel-room"
            }`}
            style={{ left: `${room.x}%`, top: `${room.y}%` }}
            animate={
              room.target && step >= 4
                ? { boxShadow: ["0 0 0 rgba(255,179,0,0)", "0 0 20px rgba(255,179,0,0.5)", "0 0 0 rgba(255,179,0,0)"] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className={`text-[6px] sm:text-[7px] font-bold ${room.target ? "text-amber-300" : "text-white/25"}`}>
              {room.name}
            </span>
            {room.target && (
              <motion.span
                className="text-[8px] mt-0.5"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⭐
              </motion.span>
            )}
          </motion.div>
        ))}

        {/* Corridor in the middle */}
        <div className="absolute left-0 right-0 top-[38%] h-[18%] bg-amber-800/5 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-[1px] bg-amber-500/10" />
            <span className="text-[5px] sm:text-[6px] text-amber-300/20 tracking-[3px] uppercase font-bold">Corridor</span>
            <div className="w-8 h-[1px] bg-amber-500/10" />
          </div>
        </div>

        {/* Furniture in some rooms */}
        <PixelBed x={12} y={10} />
        <PixelBed x={27} y={22} />
        <PixelDesk x={42} y={10} />
        <PixelDesk x={57} y={22} />
        <PixelBed x={72} y={10} flip />

        {/* Festive decorations */}
        <PixelDiya x={8} y={35} />
        <PixelDiya x={85} y={35} />
        <PixelPlant x={5} y={60} />
        <PixelPlant x={88} y={60} />

        {/* Mango leaf toran on corridor */}
        <div className="absolute left-[5%] right-[5%] top-[36%] flex justify-center">
          <div className="flex gap-0.5 text-[6px]">
            {"🥭🌿🥭🌿🥭🌿🥭🌿🥭".split("").map((e, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
              >
                {e}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* === STAIRCASE AREA (middle) === */}
      <motion.div
        className="absolute left-[35%] right-[35%] top-[50%] bottom-[40%] rounded-lg flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, rgba(255,152,0,0.08), rgba(255,152,0,0.03))", border: "1.5px solid rgba(255,152,0,0.15)" }}
        animate={step === 2 ? { borderColor: ["rgba(255,152,0,0.15)", "rgba(255,152,0,0.5)", "rgba(255,152,0,0.15)"] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-[14px]">🪜</span>
        <span className="text-[5px] text-amber-300/40 font-bold mt-0.5">STAIRS</span>
        <span className="text-[4px] text-amber-300/20">↑ 2F</span>
      </motion.div>

      {/* === GROUND FLOOR (lower middle) === */}
      <div className="absolute left-[10%] right-[10%] top-[62%] bottom-[25%] bg-amber-800/5 rounded-xl border border-white/5">
        <div className="flex items-center justify-center h-full gap-4">
          <span className="text-[8px] text-white/15">Ground Floor</span>
        </div>
        {/* Some static NPC sprites */}
        <div className="absolute bottom-2 left-4 text-[8px]">🧑‍🤝‍🧑</div>
        <div className="absolute top-2 right-4 text-[8px]">🪑</div>
        <PixelDiya x={85} y={10} />
        <PixelPlant x={3} y={50} />
      </div>

      {/* === ENTRANCE === */}
      <motion.div
        className="absolute left-[30%] right-[30%] bottom-[18%] h-[7%] rounded-lg flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, rgba(46,125,50,0.1), rgba(46,125,50,0.04))", border: "2px solid rgba(46,125,50,0.2)" }}
        animate={step <= 1 ? { borderColor: ["rgba(46,125,50,0.2)", "rgba(46,125,50,0.6)", "rgba(46,125,50,0.2)"] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-[7px] sm:text-[8px] text-green-300/70 font-bold">🚪 ENTRANCE</span>
      </motion.div>

      {/* Marigolds at entrance */}
      <div className="absolute left-[20%] right-[20%] bottom-[17%] flex justify-center gap-0.5 text-[5px]">
        {"🌼🌸🌼🌸🌼🌸🌼".split("").map((f, i) => (
          <motion.span key={i} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}>
            {f}
          </motion.span>
        ))}
      </div>

      {/* === ROAD === */}
      <div className="absolute left-0 right-0 bottom-0 h-[14%] bg-gray-700/20 flex items-center justify-center">
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-center gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-5 h-[1.5px] bg-amber-500/15 rounded" />
          ))}
        </div>
        <span className="absolute bottom-1 text-[6px] text-white/10 font-bold tracking-wider">ROAD</span>
        {/* Trees at road */}
        <span className="absolute left-3 top-0 text-sm">🌳</span>
        <span className="absolute right-3 top-0 text-sm">🌳</span>
      </div>

      {/* Direction arrow hints */}
      <AnimatePresence>
        {step >= 1 && step <= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-[60%] -translate-x-1/2 text-amber-400 text-sm font-bold"
          >
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }}>↑</motion.div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute left-[30%] top-[35%] text-amber-400 text-sm font-bold"
          >
            <motion.div animate={{ x: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }}>←</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated player character */}
      {showCharacter && <PixelSprite x={pos.x} y={pos.y} label="You" />}

      {/* Bottom HUD overlay - step info */}
      <div className="absolute bottom-[15%] left-2 right-2 glass-strong rounded-xl px-3 py-2 flex items-center gap-2 z-30">
        <span className="text-sm">{EVENT_CONFIG.manualDirections[step]?.icon || "📍"}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] sm:text-[10px] text-amber-100/80 font-bold truncate">
            {EVENT_CONFIG.manualDirections[step]?.title || "Start"}
          </p>
          <p className="text-[7px] sm:text-[8px] text-white/30 truncate">
            {EVENT_CONFIG.manualDirections[step]?.description || "Begin journey"}
          </p>
        </div>
        <span className="text-[8px] text-amber-400/40 font-mono bg-black/30 px-1.5 py-0.5 rounded">{step + 1}/{EVENT_CONFIG.manualDirections.length}</span>
      </div>
    </div>
  );
}
