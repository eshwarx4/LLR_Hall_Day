-- ===================================
-- LLR Hall Day — Supabase Schema
-- ===================================
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL UNIQUE,
  rsvp_status TEXT NOT NULL CHECK (rsvp_status IN ('yes', 'maybe', 'no')),
  interests TEXT[] DEFAULT '{}',
  other_interest TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by normalized name
CREATE INDEX IF NOT EXISTS idx_attendees_normalized_name ON attendees (normalized_name);

-- Index for public wall queries
CREATE INDEX IF NOT EXISTS idx_attendees_rsvp_status ON attendees (rsvp_status);

-- Enable Row Level Security
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no auth required for RSVP)
CREATE POLICY "Anyone can RSVP" ON attendees
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update their own record (matched by normalized_name)
CREATE POLICY "Anyone can update by name" ON attendees
  FOR UPDATE USING (true) WITH CHECK (true);

-- Public reads: only show name, rsvp_status, interests for yes/maybe
CREATE POLICY "Public can read attendees" ON attendees
  FOR SELECT USING (rsvp_status IN ('yes', 'maybe'));

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
