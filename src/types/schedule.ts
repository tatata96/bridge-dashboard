import type { APP_NAME } from "@/config/constants";
import type { Class } from "@/types/classes";

export type Instructor = {
  id: string;
  name: string;
};

export type ClassSession = {
  id: string;
  classId: Class["id"];
  instructorId: string | null; // null => "No Staff Specified"
  startAt: string; // ISO 8601 datetime
  durationMinutes: number;
  capacity: number;
  reservedCount: number;
  classCapacity: number; // spots allocated to the Classiva marketplace
  classReservedCount: number; // of classCapacity, how many are currently booked
};

export type BookingSource = typeof APP_NAME | "direct";
export type ReservationStatus =
  "booked" | "attended" | "no_show" | "late_cancelled";

export type Reservation = {
  id: string;
  sessionId: string;
  clientName: string;
  clientTotalVisits: number; // this client's all-time visit count, including this booking
  bookingSource: BookingSource;
  status: ReservationStatus;
  bookedAt: string; // ISO 8601 datetime
};
