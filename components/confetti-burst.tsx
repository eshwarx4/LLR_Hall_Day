"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiBurst() {
  useEffect(() => {
    // Festive colors — saffron, marigold, green, red
    const colors = ["#FF6F00", "#FFB300", "#FFD54F", "#2E7D32", "#B71C1C", "#FF8F00", "#FFA726"];

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors });

    const end = Date.now() + 3000;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.65 }, colors, scalar: 1.2 });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.65 }, colors, scalar: 1.2 });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    setTimeout(() => {
      confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.5 }, colors, scalar: 1.5 });
    }, 500);
  }, []);

  return null;
}
