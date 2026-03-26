export type RsvpStatus = "yes" | "maybe" | "no";

export interface Attendee {
  id: string;
  name: string;
  normalized_name: string;
  rsvp_status: RsvpStatus;
  interests: string[];
  other_interest: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendeePublic {
  name: string;
  rsvp_status: RsvpStatus;
  interests: string[];
}

export interface RsvpPayload {
  name: string;
  rsvp_status: RsvpStatus;
}

export interface InterestsPayload {
  name: string;
  interests: string[];
  other_interest?: string;
}

export interface AttendeeStats {
  total: number;
  coming: number;
  maybe: number;
}
