import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatTime } from "@/lib/date.utils";
import { Bookings } from "@/pages/schedule/bookings";
import { CancelSessionButton } from "@/pages/schedule/cancel-session-button";
import { EditClassModal } from "@/pages/schedule/edit-class-modal";
import type { ScheduleListEntry } from "@/pages/schedule/schedule-class-list";
import type { Instructor, Reservation } from "@/types/schedule";

export function ScheduleDetailPanel({
  entry,
  reservations,
  instructors,
  onSaveClass,
  onCancelSession,
  onCheckIn,
  classHasEnded,
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
  classHasEnded: boolean;
}) {
  if (!entry) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        Select a class to see its details.
      </div>
    );
  }

  const { session, className, instructorName } = entry;
  const spotsLeft = session.capacity - session.reservedCount;
  const bookedPercent =
    session.capacity > 0 ? (session.reservedCount / session.capacity) * 100 : 0;

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-semibold text-foreground">
            {formatTime(new Date(session.startAt))} {className}
          </h2>
          <span className="text-sm text-muted-foreground">
            {session.durationMinutes} min · {instructorName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <EditClassModal
            entry={entry}
            instructors={instructors}
            onSave={onSaveClass}
          />

          <span className="h-4 w-px bg-border" aria-hidden="true" />

          <CancelSessionButton entry={entry} onConfirm={onCancelSession} />
        </div>
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
      />
    </div>
  );
}
