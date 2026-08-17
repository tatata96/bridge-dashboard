import type { TranslationKey } from "@/i18n/i18n";

export const cancellationReasons = [
  { value: "low-attendance", labelKey: "class.reason.lowAttendance" },
  {
    value: "instructor-unavailable",
    labelKey: "class.reason.instructorUnavailable",
  },
  { value: "facility-issue", labelKey: "class.reason.facilityIssue" },
  { value: "schedule-conflict", labelKey: "class.reason.scheduleConflict" },
  { value: "other", labelKey: "class.reason.other" },
] satisfies { value: string; labelKey: TranslationKey }[];
