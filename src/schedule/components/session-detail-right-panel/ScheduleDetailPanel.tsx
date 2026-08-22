import { useState } from "react";
import { MoreVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/i18n";
import { formatTime } from "@/lib/date.utils";
import { Bookings } from "@/schedule/components/session-detail-right-panel/Bookings";
import { CancelSessionDialog } from "@/schedule/components/cancel-session-dialog/CancelSessionDialog";
import { EditSessionDialog } from "@/schedule/components/edit-session-dialog/EditSessionDialog";
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
  const { dateLocale, t } = useI18n();
  const [cancelSessionDialogOpen, setCancelSessionDialogOpen] = useState(false);

  if (!entry) {
    return (
      <div className="flex min-h-80 flex-1 items-center justify-center rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        {t("schedule.selectClass")}
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
            {formatTime(new Date(session.startAt), dateLocale)} {className}
          </h2>
          <span className="text-sm text-muted-foreground">
            {session.durationMinutes} {t("schedule.minuteShort")} ·{" "}
            {instructorName}
          </span>
        </div>

        {classHasStarted ? (
          <span
            className={
              classHasEnded
                ? "inline-flex h-8 shrink-0 items-center rounded-md bg-muted/50 px-3 text-sm font-medium text-secondary-foreground"
                : "inline-flex h-8 shrink-0 items-center gap-2 rounded-md bg-blue-50 px-3 text-sm font-medium text-blue-800"
            }
          >
            {classHasEnded ? null : (
              <span
                className="size-1.5 rounded-full bg-blue-600"
                aria-hidden="true"
              />
            )}
            {classHasEnded ? t("schedule.completed") : t("schedule.inProgress")}
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            <EditSessionDialog
              entry={entry}
              instructors={instructors}
              onSave={onSaveClass}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("common.moreActions")}
                >
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setCancelSessionDialogOpen(true)}
                >
                  {t("class.cancelSession")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <CancelSessionDialog
              entry={entry}
              onConfirm={onCancelSession}
              open={cancelSessionDialogOpen}
              onOpenChange={setCancelSessionDialogOpen}
              trigger={null}
            />
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
              / {session.capacity} {t("schedule.booked")}
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
        reservations={reservations}
        classHasEnded={classHasEnded}
        onCheckIn={onCheckIn}
        onUndoCheckIn={onUndoCheckIn}
        onCancelBooking={onCancelBooking}
      />
    </div>
  );
}
