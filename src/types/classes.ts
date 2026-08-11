import type { CategoryId } from "@/config/class-types";

export type ClassStatus = "active" | "paused";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ClassSchedule =
  | {
      type: "recurring";
      repeatOn: Weekday[];
      startDate: string; // YYYY-MM-DD
      endDate: string | null; // null means no planned end date
    }
  | {
      type: "one_time";
      date: string; // YYYY-MM-DD
    };

export type ClassPlan = {
  id: string;
  name: string;
  classTypeId: ClassType["id"];
  status: ClassStatus;
  instructorId: string | null;
  schedule: ClassSchedule;
  startTime: string; // HH:mm local business time
  durationMinutes: number;
  capacity: number;
};

export type ClassType = {
  id: string;
  name: string;
  categoryId: CategoryId;
  description: string;
};

export type ClassFilters = {
  classId: string;
  instructorId: string;
};
