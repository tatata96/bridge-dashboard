import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatTime } from "@/lib/date.utils";
import { Bookings } from "@/schedule/components/Bookings";
import { CancelSessionButton } from "@/schedule/components/CancelSessionButton";
import { EditClassModal } from "@/schedule/components/EditClassModal";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";
import type { Instructor, Reservation } from "@/types/schedule";

export function ScheduleDetailPanel({
  entry,
  reservations,
  instructors,
  onSaveClass,
  onCancelSession,
  onCheckIn,
  onUndoCheckIn,
  onCancelBooking,
  classHasEnded,
  classHasStarted,
}: {
  entry: ScheduleListEntry | undefined;
  reservations: Reservation[];
  instructors: Instructor[];
  onSaveClass: (
    sessionId: string,
    changes: { instructorId: string | null; capacity: number },
  ) => void;
  onCancelSession: (sessionId: string) => void;
  onCheckIn: (reservationId: string) => void;
  onUndoCheckIn: (reservationId: string) => void;
  onCancelBooking: (reservationId: string) => void;
  classHasEnded: boolean;
  classHasStarted: boolean;
}) {
  if (!entry) {
    return (
      <div className="flex min-h-80 flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        Select a class to see its details.
      </div>
    );
  }

  const { session, className, instructorName } = entry;
  const spotsLeft = session.capacity - session.reservedCount;
  const bookedPercent =
    session.capacity > 0 ? (session.reservedCount / session.capacity) * 100 : 0;

  return (
    <div className="flex min-h-80 min-w-0 flex-1 flex-col gap-4 rounded-lg border border-border bg-background p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="text-base font-semibold text-foreground">
            {formatTime(new Date(session.startAt))} {className}
          </h2>
          <span className="text-sm text-muted-foreground">
            {session.durationMinutes} min · {instructorName}
          </span>
        </div>

        {classHasStarted ? (
          <span className="inline-flex h-8 shrink-0 items-center rounded-full border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground">
            {classHasEnded ? "Completed" : "In progress"}
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <EditClassModal
              entry={entry}
              instructors={instructors}
              onSave={onSaveClass}
            />

            <span
              className="hidden h-4 w-px bg-border sm:block"
              aria-hidden="true"
            />

            <CancelSessionButton entry={entry} onConfirm={onCancelSession} />
          </div>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground">
            <span className="font-semibold">{session.reservedCount}</span>
            <span className="text-muted-foreground">
              {" "}
              / {session.capacity} booked
            </span>
          </span>
          <span className="text-muted-foreground">
            {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
          </span>
        </div>
        <Progress value={bookedPercent} />
      </div>

      <Bookings
        reservations={reservations}
        classHasEnded={classHasEnded}
        onCheckIn={onCheckIn}
        onUndoCheckIn={onUndoCheckIn}
        onCancelBooking={onCancelBooking}
      />
    </div>
  );
}
