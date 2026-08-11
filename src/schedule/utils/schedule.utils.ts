import { mockClasses } from "@/classes/data/classes.mock-data";
import { mockInstructors } from "@/schedule/data/schedule.mock-data";
import type { ClassSession } from "@/types/schedule";

export const classesById = new Map(mockClasses.map((c) => [c.id, c]));
export const instructorsById = new Map(mockInstructors.map((i) => [i.id, i]));

export function hasSessionStarted(session: ClassSession) {
  return Date.now() >= new Date(session.startAt).getTime();
}

export function hasSessionEnded(session: ClassSession) {
  return (
    Date.now() >=
    new Date(session.startAt).getTime() + session.durationMinutes * 60_000
  );
}

export function getInstructorName(instructorId: string | null) {
  if (!instructorId) return "No staff specified";
  return instructorsById.get(instructorId)?.name ?? "Unknown instructor";
}
