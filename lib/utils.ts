import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function sanitizeDisplayName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[<>\"'&]/g, "")
    .slice(0, 50);
}

/**
 * Calculate distance between two coordinates in meters using Haversine formula
 */
export function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export type ProximityStatus = "very_close" | "nearby" | "far";

export function getProximityStatus(
  distanceMeters: number,
  thresholds: { veryClose: number; nearby: number }
): ProximityStatus {
  if (distanceMeters <= thresholds.veryClose) return "very_close";
  if (distanceMeters <= thresholds.nearby) return "nearby";
  return "far";
}
