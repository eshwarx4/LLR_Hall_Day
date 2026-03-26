// Simple in-memory rate limiter (per IP, per window)
// Resets on server restart. For production, use Redis or Upstash.

const requests = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10; // max 10 requests per minute per IP

export function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  requests.forEach((val, key) => {
    if (now > val.resetAt) requests.delete(key);
  });
}, 5 * 60_000);
