import { atTime } from "@/lib/date.utils";
import type { Class, ClassSession, Instructor } from "@/types/schedule";

const today = new Date();

export const mockInstructors: Instructor[] = [
  { id: "instructor-1", name: "Betty White" },
];

export const mockClasses: Class[] = [
  {
    id: "class-1",
    name: "Advanced CrossFit",
    category: "CrossFit",
    labels: [],
  },
  { id: "class-2", name: "Basic Crossfit", category: "CrossFit", labels: [] },
  { id: "class-3", name: "Salsa", category: "Dance", labels: [] },
];

export const mockClassSessions: ClassSession[] = [
  {
    id: "session-1",
    classId: "class-1",
    instructorId: "instructor-1",
    startAt: atTime(today, 7, 0).toISOString(),
    durationMinutes: 60,
    capacity: 3,
    reservedCount: 0,
    classPassCapacity: 3,
    classPassReservedCount: 0,
  },
  {
    id: "session-2",
    classId: "class-2",
    instructorId: null,
    startAt: atTime(today, 7, 0).toISOString(),
    durationMinutes: 60,
    capacity: 5,
    reservedCount: 0,
    classPassCapacity: 5,
    classPassReservedCount: 0,
  },
  {
    id: "session-3",
    classId: "class-3",
    instructorId: "instructor-1",
    startAt: atTime(today, 7, 0).toISOString(),
    durationMinutes: 60,
    capacity: 3,
    reservedCount: 0,
    classPassCapacity: 3,
    classPassReservedCount: 0,
  },
  {
    id: "session-4",
    classId: "class-1",
    instructorId: "instructor-1",
    startAt: atTime(today, 8, 0).toISOString(),
    durationMinutes: 60,
    capacity: 10,
    reservedCount: 0,
    classPassCapacity: 10,
    classPassReservedCount: 0,
  },
  {
    id: "session-5",
    classId: "class-1",
    instructorId: "instructor-1",
    startAt: atTime(today, 11, 45).toISOString(),
    durationMinutes: 60,
    capacity: 4,
    reservedCount: 0,
    classPassCapacity: 4,
    classPassReservedCount: 0,
  },
];
