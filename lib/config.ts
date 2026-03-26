// ===================================
// CENTRAL CONFIG — Edit this file to customize the entire site
// ===================================

export const EVENT_CONFIG = {
  // Event basics
  eventName: "LLR Hall Day",
  hallName: "LLR Hall",
  tagline: "The biggest day of the year. Your hall. Your people. Your vibe.",
  subtitle: "IIT Kharagpur",
  festivalName: "Sri Rama Navami",

  // Date & time (ISO format)
  eventDate: "2026-03-27T19:30:00+05:30",
  eventDateDisplay: "27th March, Friday",
  eventTimeDisplay: "7:30 PM onwards",

  // Room info
  roomNumber: "B-206",
  hostName: "Eshwar",

  // Hall coordinates (used for proximity detection)
  hallCoordinates: {
    latitude: 22.3149,
    longitude: 87.3105,
  },

  // Proximity thresholds in meters
  proximityThresholds: {
    veryClose: 100,
    nearby: 500,
    far: 5000,
  },

  // Manual directions to room B-206
  manualDirections: [
    {
      step: 1,
      icon: "🚪",
      title: "Enter LLR Hall",
      description: "Walk to the main entrance of LLR Hall from the road side.",
    },
    {
      step: 2,
      icon: "🪜",
      title: "Take the staircase",
      description: "Go to the central staircase near the entrance. Head up to the 2nd floor.",
    },
    {
      step: 3,
      icon: "👈",
      title: "Turn left on 2nd floor",
      description: "Once on the 2nd floor, turn left into the B-wing corridor.",
    },
    {
      step: 4,
      icon: "🚶",
      title: "Walk down the corridor",
      description: "Walk along the corridor. B-206 is on your right side, about 6 rooms down.",
    },
    {
      step: 5,
      icon: "🎉",
      title: "You're here!",
      description: "Welcome to B-206! Knock or just walk in — the door's open for Hall Day!",
    },
  ],

  // Google Maps link for navigation
  mapsLink: "https://maps.google.com/?q=22.3149,87.3105&ll=22.3149,87.3105&z=17",

  // Interest options
  interests: [
    { id: "music", label: "Music", emoji: "🎵" },
    { id: "food", label: "Food", emoji: "🍕" },
    { id: "games", label: "Games", emoji: "🎮" },
    { id: "chilling", label: "Chilling", emoji: "😎" },
    { id: "friends", label: "Meeting Friends", emoji: "🤝" },
    { id: "vibes", label: "Hall Vibes", emoji: "✨" },
  ],

  // CTA labels
  cta: {
    hero: "Count Me In! 🪷",
    rsvp: "Lock it in",
    interests: "Save my picks",
    roomFinder: "Find B-206 🧭",
    openMaps: "Open in Google Maps",
  },

  // Share text
  shareText: "Yo! LLR Hall Day is happening on Sri Rama Navami! 🪷 Check out this invite and RSVP →",

  // Attendee wall
  attendeeWall: {
    title: "The Squad So Far",
    emptyMessage: "Be the first one to RSVP! 🚀",
    comingLabel: "Coming",
    maybeLabel: "Maybe",
  },
} as const;
