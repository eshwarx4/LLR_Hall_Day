import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { EVENT_CONFIG } from "@/lib/config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: `${EVENT_CONFIG.eventName} — You're Invited!`,
  description: `${EVENT_CONFIG.tagline} RSVP now for ${EVENT_CONFIG.eventName} at ${EVENT_CONFIG.subtitle}!`,
  openGraph: {
    title: `${EVENT_CONFIG.eventName} — You're Invited!`,
    description: EVENT_CONFIG.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050510",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${playfair.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <div className="bg-mesh" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
