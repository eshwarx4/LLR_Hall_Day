"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingHero from "@/components/landing-hero";
import RsvpForm from "@/components/rsvp-form";
import InvitationCard from "@/components/invitation-card";
import InterestPicker from "@/components/interest-picker";
import AttendeeWall from "@/components/attendee-wall";
import RoomFinder from "@/components/room-finder";
import ConfettiBurst from "@/components/confetti-burst";
import { FallingPetals } from "@/components/festive-elements";
import type { RsvpStatus } from "@/lib/types";

type Step = "hero" | "rsvp" | "card" | "interests" | "wall" | "finder";

const STEPS: Step[] = ["hero", "rsvp", "card", "interests", "wall", "finder"];

export default function Home() {
  const [step, setStep] = useState<Step>("hero");
  const [userName, setUserName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  // Sync step with URL hash for browser back/forward
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Step;
    if (hash && STEPS.includes(hash)) {
      setStep(hash);
    }

    const onPopState = () => {
      const h = window.location.hash.replace("#", "") as Step;
      if (h && STEPS.includes(h)) {
        const oldIdx = STEPS.indexOf(step);
        const newIdx = STEPS.indexOf(h);
        setDirection(newIdx >= oldIdx ? 1 : -1);
        setStep(h);
      } else {
        setDirection(-1);
        setStep("hero");
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [step]);

  const goTo = useCallback((next: Step) => {
    const oldIdx = STEPS.indexOf(step);
    const newIdx = STEPS.indexOf(next);
    setDirection(newIdx >= oldIdx ? 1 : -1);
    setStep(next);
    window.history.pushState(null, "", `#${next}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  const goBack = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) {
      // Skip "card" when going back if no RSVP data
      let prevIdx = idx - 1;
      if (STEPS[prevIdx] === "card" && (!rsvpStatus || rsvpStatus === "no")) {
        prevIdx--;
      }
      if (prevIdx >= 0) goTo(STEPS[prevIdx]);
    }
  }, [step, rsvpStatus, goTo]);

  const handleRsvp = async (name: string, status: RsvpStatus) => {
    setUserName(name);
    setRsvpStatus(status);
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rsvp_status: status }),
      });
    } catch {}

    if (status === "yes" || status === "maybe") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }

    setTimeout(() => goTo(status === "no" ? "wall" : "card"), 1800);
  };

  const handleInterests = async (interests: string[], otherInterest?: string) => {
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, rsvp_status: rsvpStatus, interests, other_interest: otherInterest }),
      });
    } catch {}
    setTimeout(() => goTo("wall"), 1500);
  };

  const renderStep = () => {
    switch (step) {
      case "hero":
        return <LandingHero onContinue={() => goTo("rsvp")} />;
      case "rsvp":
        return <RsvpForm onSubmit={handleRsvp} />;
      case "card":
        if (rsvpStatus && rsvpStatus !== "no") {
          return <InvitationCard name={userName} status={rsvpStatus} onContinue={() => goTo("interests")} />;
        }
        return null;
      case "interests":
        return <InterestPicker onSubmit={handleInterests} onSkip={() => goTo("wall")} />;
      case "wall":
        return (
          <>
            <AttendeeWall />
            <div className="flex justify-center px-6 pb-20">
              <motion.div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-xl opacity-30" />
                <motion.button
                  onClick={() => goTo("finder")}
                  className="relative px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 btn-gradient text-white font-bold text-lg shadow-2xl transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  Find B-206 🧭
                </motion.button>
              </motion.div>
            </div>
          </>
        );
      case "finder":
        return <RoomFinder />;
    }
  };

  const showBackButton = step !== "hero";

  return (
    <div className="relative min-h-[100dvh]">
      <FallingPetals count={12} />
      {showConfetti && <ConfettiBurst />}

      {/* Back button */}
      <AnimatePresence>
        {showBackButton && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={goBack}
            className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-colors"
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
