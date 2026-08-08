import { Separator } from "@/components/ui/separator";
import { formatTime } from "@/lib/date.utils";
import { Bookings } from "@/pages/schedule/bookings";
import { CancelClassButton } from "@/pages/schedule/cancel-class-button";
import { EditStaffModal } from "@/pages/schedule/edit-staff-modal";
import type { ScheduleListEntry } from "@/pages/schedule/schedule-class-list";
import type { Instructor, Reservation } from "@/types/schedule";

export function ScheduleDetailPanel({
  entry,
  reservations,
  instructors,
  onSaveInstructor,
  onCancelSession,
}: {
  entry: ScheduleListEntry | undefined;
  reservations: Reservation[];
  instructors: Instructor[];
  onSaveInstructor: (sessionId: string, instructorId: string | null) => void;
  onCancelSession: (sessionId: string) => void;
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-semibold text-foreground">
            {formatTime(new Date(session.startAt))} {className}
          </h2>
          <span className="text-sm text-muted-foreground">
            {session.durationMinutes} min · {instructorName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <EditStaffModal
            entry={entry}
            instructors={instructors}
            onSave={onSaveInstructor}
          />

          <CancelClassButton entry={entry} onConfirm={onCancelSession} />
        </div>
      </div>

      <Separator />

      <Bookings reservations={reservations} />
    </div>
  );
}
