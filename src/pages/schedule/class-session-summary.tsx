import { formatTime } from "@/lib/date.utils";
import type { ScheduleListEntry } from "@/pages/schedule/schedule-class-list";

export function ClassSessionSummary({ entry }: { entry: ScheduleListEntry }) {
  const { session, className, instructorName } = entry;

  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-muted/50 px-3 py-2.5 text-sm">
      <span className="font-medium text-foreground">{className}</span>
      <span className="text-muted-foreground">
        {instructorName} · {formatTime(new Date(session.startAt))}
      </span>
    </div>
  );
}
