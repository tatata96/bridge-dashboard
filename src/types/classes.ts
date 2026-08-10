export type ClassStatus = "active" | "paused";

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type Class = {
  id: string;
  name: string; // e.g. "Advanced CrossFit"
  category: string; // e.g. "CrossFit", "Salsa" - drives the Type filter dropdown
  labels: string[]; // e.g. "Beginner friendly", "New"
  status: ClassStatus;
};

export type ClassRecurrence = {
  id: string;
  classId: Class["id"];
  instructorId: string | null;
  startTime: string; // HH:mm local business time
  durationMinutes: number;
  repeatOn: Weekday[];
  capacity: number;
};

export type ClassFilters = {
  classId: string;
  instructorId: string;
};

export type ClassListEntry = {
  id: string;
  classId: Class["id"];
  className: string;
  status: ClassStatus;
  instructorId: string | null;
  instructorName: string;
  startTime: string;
  repeatOn: Weekday[];
  capacity: number;
};
