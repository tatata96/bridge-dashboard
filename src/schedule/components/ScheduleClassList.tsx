import type { ClassSessionResponse } from "@/api/class-sessions/class-sessions.types";
import { cn } from "@/lib/classnames.utils";
import { useI18n } from "@/i18n/i18n";
import { formatTime, ISTANBUL_TIME_ZONE } from "@/lib/date.utils";

export function ScheduleClassList({
  sessions,
  selectedSessionId,
  onSelectSession,
}: {
  sessions: ClassSessionResponse[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
}) {
  const { dateLocale, t } = useI18n();

  return (
    <ul className="flex min-w-0 flex-1 divide-x divide-border overflow-x-auto rounded-lg border border-border bg-background xl:flex-col xl:divide-x-0 xl:divide-y xl:overflow-x-visible xl:overflow-y-auto">
      {sessions.map((session) => {
        const isSelected = session.id === selectedSessionId;

        return (
          <li key={session.id} className="w-48 shrink-0 xl:w-auto xl:shrink">
            <button
              type="button"
              onClick={() => onSelectSession(session.id)}
              aria-current={isSelected ? "true" : undefined}
              className={cn(
                "flex h-full w-full cursor-pointer items-start justify-between gap-3 border-b-2 border-transparent px-4 py-3 text-left transition-colors hover:bg-primary/20 xl:border-b-0 xl:border-l-2",
                isSelected &&
                  "border-b-primary bg-primary/20 xl:border-l-primary",
              )}
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {formatTime(
                    new Date(session.startAt),
                    dateLocale,
                    ISTANBUL_TIME_ZONE,
                  )}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {session.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {session.venueName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {session.instructorName ?? t("classes.noInstructorAssigned")}
                </span>
              </div>
              {/* No bookings API yet, so nothing is reserved. */}
              <span className="text-sm text-muted-foreground">
                0/{session.totalCapacity}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
