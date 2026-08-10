import type { Class } from "@/types/schedule";

export type ClassListEntry = {
  id: string;
  classId: Class["id"];
  className: string;
  instructorName: string;
  startTime: string;
  repeatOn: string[];
};

export const mockClassListEntries: ClassListEntry[] = [
  {
    id: "class-list-1",
    classId: "class-1",
    className: "Advanced CrossFit",
    instructorName: "Betty White",
    startTime: "07:00",
    repeatOn: ["Mon", "Wed", "Fri"],
  },
  {
    id: "class-list-2",
    classId: "class-2",
    className: "Basic Crossfit",
    instructorName: "No staff specified",
    startTime: "07:00",
    repeatOn: ["Tue", "Thu"],
  },
  {
    id: "class-list-3",
    classId: "class-3",
    className: "Salsa",
    instructorName: "Betty White",
    startTime: "18:00",
    repeatOn: ["Sat"],
  },
];
