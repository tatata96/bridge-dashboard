export type ClassPlanRecurrenceType = "RECURRING" | "ONE_TIME";

export type ClassPlanStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export type ClassPlanResponse = {
  id: string;
  classTypeId: string;
  venueId: string;
  instructorId: string | null;
  title: string;
  description: string | null;
  recurrenceType: ClassPlanRecurrenceType;
  // YYYY-MM-DD, a calendar date in the venue's timezone.
  startDate: string;
  endDate: string | null;
  // ISO weekdays: Monday = 1 ... Sunday = 7. Empty for ONE_TIME plans.
  weekdays: number[];
  // HH:mm in the venue's local timezone.
  startTime: string;
  durationMinutes: number;
  totalCapacity: number;
  classistaCapacity: number;
  status: ClassPlanStatus;
  // ISO 8601 strings (Date serialized as JSON).
  createdAt: string;
  updatedAt: string;
};

// Dates are YYYY-MM-DD and `startTime` is HH:mm, both interpreted in the
// venue's local timezone, so they must not be converted to UTC. The backend
// supplies partnerId, title, status and timezone, and generates the sessions.
// - ONE_TIME: omit `endDate` and `weekdays`.
export type CreateClassPlanRequest = {
  classTypeId: string;
  venueId: string;
  instructorId?: string | null;
  description?: string | null;
  recurrenceType: ClassPlanRecurrenceType;
  startDate: string;
  endDate?: string;
  // ISO weekdays: Monday = 1 ... Sunday = 7.
  weekdays?: number[];
  startTime: string;
  durationMinutes: number;
  totalCapacity: number;
  classistaCapacity: number;
};
