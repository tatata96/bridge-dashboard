import type { CategoryId } from "@/config/class-types";
import {
  mockClassPlans,
  mockClassTypesById,
} from "@/classes/data/classes.mock-data";
import { mockInstructors } from "@/schedule/data/schedule.mock-data";
import type { ClassSession } from "@/types/schedule";

export const classPlansById = new Map(
  mockClassPlans.map((classPlan) => [classPlan.id, classPlan]),
);
export const classTypesById = mockClassTypesById;
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
  if (!instructorId) return "Eğitmen atanmadı";
  return instructorsById.get(instructorId)?.name ?? "Bilinmeyen eğitmen";
}

export function getClassPlanName(
  classPlanId: string,
  unknownClassLabel: string,
) {
  const classPlan = classPlansById.get(classPlanId);
  if (!classPlan) return unknownClassLabel;

  return classTypesById.get(classPlan.classTypeId)?.name ?? unknownClassLabel;
}

export function getClassPlanCategoryId(classPlanId: string): CategoryId | null {
  const classPlan = classPlansById.get(classPlanId);
  if (!classPlan) return null;

  return classTypesById.get(classPlan.classTypeId)?.categoryId ?? null;
}
