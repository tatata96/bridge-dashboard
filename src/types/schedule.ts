export type Instructor = {
  id: string;
  name: string;
};

export type Class = {
  id: string;
  name: string; // e.g. "Advanced CrossFit"
  category: string; // e.g. "CrossFit", "Salsa" — drives the Type filter dropdown
  labels: string[]; // e.g. "Beginner friendly", "New"
};

export type ClassSession = {
  id: string;
  classId: string;
  instructorId: string | null; // null => "No Staff Specified"
  startAt: string; // ISO 8601 datetime
  durationMinutes: number;
  capacity: number;
  reservedCount: number;
  classPassCapacity: number; // spots allocated to the ClassPass marketplace
  classPassReservedCount: number; // of classPassCapacity, how many are currently booked
};

export type BookingSource = "classpass" | "direct";
export type ReservationStatus =
  "booked" | "attended" | "no_show" | "late_cancelled";

export type Reservation = {
  id: string;
  sessionId: string;
  clientName: string;
  bookingSource: BookingSource;
  status: ReservationStatus;
  bookedAt: string; // ISO 8601 datetime
};
