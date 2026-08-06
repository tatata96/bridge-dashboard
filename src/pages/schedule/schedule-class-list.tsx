import { cn } from "@/lib/classnames.utils";
import { formatTime } from "@/lib/date.utils";
import type { ClassSession } from "@/types/schedule";

export type ScheduleListEntry = {
  session: ClassSession;
  className: string;
  instructorName: string;
};

export function ScheduleClassList({
  entries,
  selectedSessionId,
  onSelectSession,
}: {
  entries: ScheduleListEntry[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
}) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        No classes scheduled for this day.
      </div>
    );
  }

  return (
    <ul className="flex flex-1 flex-col divide-y divide-border overflow-y-auto rounded-lg border border-border bg-background">
      {entries.map(({ session, className, instructorName }) => {
        const isSelected = session.id === selectedSessionId;

        return (
          <li key={session.id}>
            <button
              type="button"
              onClick={() => onSelectSession(session.id)}
              aria-current={isSelected ? "true" : undefined}
              className={cn(
                "flex w-full cursor-pointer items-start justify-between gap-3 border-l-2 border-transparent px-4 py-3 text-left transition-colors hover:bg-muted/50",
                isSelected && "border-l-primary bg-muted/40",
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {formatTime(new Date(session.startAt))}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {className}
                </span>
                <span className="text-sm text-muted-foreground">
                  {instructorName}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {session.reservedCount}/{session.capacity}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
