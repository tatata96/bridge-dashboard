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
      <div className="flex min-h-24 flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        No classes scheduled for this day.
      </div>
    );
  }

  return (
    <ul className="flex min-w-0 flex-1 divide-x divide-border overflow-x-auto rounded-lg border border-border bg-background xl:flex-col xl:divide-x-0 xl:divide-y xl:overflow-x-visible xl:overflow-y-auto">
      {entries.map(({ session, className, instructorName }) => {
        const isSelected = session.id === selectedSessionId;

        return (
          <li key={session.id} className="w-48 shrink-0 xl:w-auto xl:shrink">
            <button
              type="button"
              onClick={() => onSelectSession(session.id)}
              aria-current={isSelected ? "true" : undefined}
              className={cn(
                "flex h-full w-full cursor-pointer items-start justify-between gap-3 border-b-2 border-transparent px-4 py-3 text-left transition-colors hover:bg-muted/50 xl:border-b-0 xl:border-l-2",
                isSelected &&
                  "border-b-primary bg-muted/40 xl:border-l-primary",
              )}
            >
              <div className="flex min-w-0 flex-col gap-0.5">
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
