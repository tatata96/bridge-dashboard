import type { APP_NAME } from "@/config/constants";
import type { ClassPlan } from "@/types/classes";
import type { Venue } from "@/types/venues";

export type Instructor = {
  id: string;
  name: string;
  venueIds: Venue["id"][];
};

export type ClassSession = {
  id: string;
  classPlanId: ClassPlan["id"];
  venueId: Venue["id"];
  instructorId: string | null; // null => "No Staff Specified"
  startAt: string; // ISO 8601 datetime
  durationMinutes: number;
  capacity: number;
  reservedCount: number;
  status: SessionStatus;
};

export type SessionStatus = "scheduled" | "cancelled" | "completed";
export type BookingSource = typeof APP_NAME;
export type BookingStatus =
  | "booked"
  | "attended"
  | "no_show"
  | "cancelled"
  | "late_cancelled"
  | "cancelled_by_partner";

export type Reservation = {
  id: string;
  sessionId: string;
  clientName: string;
  clientTotalVisits: number; // this client's all-time visit count, including this booking
  bookingSource: BookingSource;
  status: BookingStatus;
  bookedAt: string; // ISO 8601 datetime
};
