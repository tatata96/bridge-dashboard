import type { Class, ClassRecurrence } from "@/types/classes";

export const mockClasses: Class[] = [
  {
    id: "class-1",
    name: "Advanced CrossFit",
    category: "CrossFit",
    labels: [],
    status: "active",
  },
  {
    id: "class-2",
    name: "Basic Crossfit",
    category: "CrossFit",
    labels: [],
    status: "active",
  },
  {
    id: "class-3",
    name: "Salsa",
    category: "Dance",
    labels: [],
    status: "paused",
  },
];

export const mockClassRecurrences: ClassRecurrence[] = [
  {
    id: "class-recurrence-1",
    classId: "class-1",
    instructorId: "instructor-1",
    startTime: "07:00",
    durationMinutes: 60,
    repeatOn: ["Mon", "Wed", "Fri"],
    capacity: 8,
  },
  {
    id: "class-recurrence-2",
    classId: "class-2",
    instructorId: null,
    startTime: "07:00",
    durationMinutes: 60,
    repeatOn: ["Tue", "Thu"],
    capacity: 6,
  },
  {
    id: "class-recurrence-3",
    classId: "class-3",
    instructorId: "instructor-1",
    startTime: "18:00",
    durationMinutes: 60,
    repeatOn: ["Sat"],
    capacity: 10,
  },
];
