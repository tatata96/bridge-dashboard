import type { ClassSessionResponse } from "@/api/class-sessions/class-sessions.types";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/i18n";
import { formatTime, ISTANBUL_TIME_ZONE } from "@/lib/date.utils";
import { Bookings } from "@/schedule/components/session-detail-right-panel/Bookings";
import {
  getSessionDurationMinutes,
  hasSessionEnded,
  hasSessionStarted,
} from "@/schedule/utils/schedule-sessions.utils";

function noop() {}

// Editing, cancelling, bookings and attendance come back once their APIs are
// connected. Until then nobody has booked, so the attendees list stays empty.
export function ScheduleDetailPanel({
  session,
}: {
  session: ClassSessionResponse | undefined;
}) {
  const { dateLocale, t } = useI18n();

  if (!session) {
    return (
      <div className="flex min-h-80 flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        {t("schedule.selectClass")}
      </div>
    );
  }

  const hasEnded = hasSessionEnded(session);
  const hasStarted = hasSessionStarted(session);
  const instructorName =
    session.instructorName ?? t("classes.noInstructorAssigned");
  const reservedCount = 0;
  const spotsLeft = session.totalCapacity - reservedCount;
  const bookedPercent =
    session.totalCapacity > 0
      ? (reservedCount / session.totalCapacity) * 100
      : 0;

  return (
    <div className="flex min-h-80 min-w-0 flex-1 flex-col gap-4 rounded-lg border border-border bg-background p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="text-base font-semibold text-foreground">
            {formatTime(
              new Date(session.startAt),
              dateLocale,
              ISTANBUL_TIME_ZONE,
            )}{" "}
            {session.title}
          </h2>
          <span className="text-sm text-muted-foreground">
            {session.venueName} · {getSessionDurationMinutes(session)}{" "}
            {t("schedule.minuteShort")} · {instructorName}
          </span>
        </div>

        {hasStarted ? (
          <span
            className={
              hasEnded
                ? "inline-flex h-8 shrink-0 items-center rounded-md bg-muted/50 px-3 text-sm font-medium text-secondary-foreground"
                : "inline-flex h-8 shrink-0 items-center gap-2 rounded-md bg-blue-50 px-3 text-sm font-medium text-blue-800"
            }
          >
            {hasEnded ? null : (
              <span
                className="size-1.5 rounded-full bg-blue-600"
                aria-hidden="true"
              />
            )}
            {hasEnded ? t("schedule.completed") : t("schedule.inProgress")}
          </span>
        ) : null}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground">
            <span className="font-semibold">{reservedCount}</span>
            <span className="text-muted-foreground">
              {" "}
              / {session.totalCapacity} {t("schedule.booked")}
            </span>
          </span>
          <span className="text-muted-foreground">
            {spotsLeft}{" "}
            {t(spotsLeft === 1 ? "schedule.spotLeft" : "schedule.spotsLeft")}
          </span>
        </div>
        <Progress value={bookedPercent} />
      </div>

      <Bookings
        reservations={[]}
        classHasEnded={hasEnded}
        onCheckIn={noop}
        onUndoCheckIn={noop}
        onCancelBooking={noop}
      />
    </div>
  );
}
