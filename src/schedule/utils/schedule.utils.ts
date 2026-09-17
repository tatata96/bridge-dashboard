import type { CategoryId } from "@/config/class-types";
import {
  mockClassPlans,
  mockClassTypesById,
} from "@/classes/data/classes.mock-data";
import type { TranslationKey } from "@/i18n/i18n";
import { mockInstructors } from "@/schedule/data/schedule.mock-data";
import type { ClassSession } from "@/types/schedule";
import { mockVenuesById } from "@/venues/data/venues.mock-data";

type Translate = (key: TranslationKey) => string;

export const classPlansById = new Map(
  mockClassPlans.map((classPlan) => [classPlan.id, classPlan]),
);
export const classTypesById = mockClassTypesById;
export const instructorsById = new Map(mockInstructors.map((i) => [i.id, i]));
export const venuesById = mockVenuesById;

export function hasSessionStarted(session: ClassSession) {
  return Date.now() >= new Date(session.startAt).getTime();
}

export function hasSessionEnded(session: ClassSession) {
  return (
    Date.now() >=
    new Date(session.startAt).getTime() + session.durationMinutes * 60_000
  );
}

export function getInstructorName(instructorId: string | null, t: Translate) {
  if (!instructorId) return t("classes.noInstructorAssigned");
  return (
    instructorsById.get(instructorId)?.name ?? t("classes.unknownInstructor")
  );
}

export function getClassPlanName(classPlanId: string, t: Translate) {
  const classPlan = classPlansById.get(classPlanId);
  if (!classPlan) return t("schedule.unknownClass");

  return (
    classTypesById.get(classPlan.classTypeId)?.name ??
    t("schedule.unknownClass")
  );
}

export function getClassPlanCategoryId(classPlanId: string): CategoryId | null {
  const classPlan = classPlansById.get(classPlanId);
  if (!classPlan) return null;

  return classTypesById.get(classPlan.classTypeId)?.categoryId ?? null;
}

export function getSessionVenueName(session: ClassSession, t: Translate) {
  return venuesById.get(session.venueId)?.name ?? t("venues.unknownVenue");
}
