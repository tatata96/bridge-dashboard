import type { CreateClassPlanRequest } from "@/api/class-plans/class-plans.types";
import { weekdayIsoNumbers, weekdays } from "@/config/class-labels";
import { formatYmd } from "@/lib/date.utils";
import type { ClassSchedule, Weekday } from "@/types/classes";

const minutesPerDay = 24 * 60;

export type ClassPlanFormValues = {
  recurrence: ClassSchedule["type"];
  classTypeId: string;
  venueId: string;
  startDate: Date;
  endDate: Date | null;
  repeatOn: Weekday[];
  // "HH:mm", a wall-clock time at the venue.
  startTime: string;
  durationMinutes: number;
  totalCapacity: number;
  classistaCapacity: number;
};

export function isPositiveInteger(value: number) {
  return Number.isInteger(value) && value > 0;
}

// A class may end exactly at midnight, but not run past it.
export function endsByMidnight(startTime: string, durationMinutes: number) {
  const [hours = "0", minutes = "0"] = startTime.split(":");
  const startMinutes = Number(hours) * 60 + Number(minutes);

  return startMinutes + durationMinutes <= minutesPerDay;
}

// Dates and the start time are sent as the venue-local values the user picked,
// so nothing here converts to UTC. Instructor is left out until its picker
// exists, and the backend supplies partnerId, title, status and timezone.
export function buildCreateClassPlanRequest(
  values: ClassPlanFormValues,
): CreateClassPlanRequest {
  const request = {
    classTypeId: values.classTypeId,
    venueId: values.venueId,
    startDate: formatYmd(values.startDate),
    startTime: values.startTime,
    durationMinutes: values.durationMinutes,
    totalCapacity: values.totalCapacity,
    classistaCapacity: values.classistaCapacity,
  };

  if (values.recurrence === "one_time") {
    return { ...request, recurrenceType: "ONE_TIME" };
  }

  return {
    ...request,
    recurrenceType: "RECURRING",
    // Monday-first order, so the payload doesn't depend on click order.
    weekdays: weekdays
      .filter((day) => values.repeatOn.includes(day))
      .map((day) => weekdayIsoNumbers[day]),
    ...(values.endDate ? { endDate: formatYmd(values.endDate) } : {}),
  };
}
