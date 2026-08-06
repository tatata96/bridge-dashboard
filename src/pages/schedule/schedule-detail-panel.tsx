import { formatTime } from "@/lib/date.utils";
import type { ScheduleListEntry } from "@/pages/schedule/schedule-class-list";

export function ScheduleDetailPanel({
  entry,
}: {
  entry: ScheduleListEntry | undefined;
}) {
  if (!entry) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        Select a class to see its details.
      </div>
    );
  }

  const { session, className, instructorName } = entry;

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-lg border border-border bg-background p-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            {formatTime(new Date(session.startAt))}
          </span>
          <span className="text-sm text-muted-foreground">
            {session.durationMinutes} min
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground">
            {className}
          </span>
          <span className="text-sm text-muted-foreground">
            {instructorName}
          </span>
        </div>
      </div>
    </div>
  );
}
