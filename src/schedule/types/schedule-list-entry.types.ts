import type { ClassSession } from "@/types/schedule";

// Old mock-model shape, now used only by the unused session and pause dialogs.
// The live Schedule list uses ClassSessionResponse instead. Remove it when
// those dialogs are reworked on the real session and class plan APIs.
export type ScheduleListEntry = {
  session: ClassSession;
  className: string;
  venueName: string;
  instructorName: string;
};
