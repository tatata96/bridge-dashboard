import { useState } from "react";
import { InfoIcon, PencilIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NumberStepper } from "@/components/ui/number-stepper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPagePath } from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";
import { cn } from "@/lib/classnames.utils";
import { ClassSessionSummary } from "@/schedule/components/session-detail-right-panel/ClassSessionSummary";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";
import type { Instructor } from "@/types/schedule";

const UNASSIGNED_INSTRUCTOR = "unassigned";

export function EditSessionDialog({
  entry,
  instructors,
  onSave,
}: {
  entry: ScheduleListEntry;
  instructors: Instructor[];
  onSave: (
    sessionId: string,
    changes: { instructorId: string | null; capacity: number },
  ) => void;
}) {
  const { session } = entry;
  const [open, setOpen] = useState(false);
  const [instructorId, setInstructorId] = useState(session.instructorId);
  const [capacity, setCapacity] = useState(session.capacity);
  const { t } = useI18n();

  const isDirty =
    instructorId !== session.instructorId || capacity !== session.capacity;
  const instructorChanged = instructorId !== session.instructorId;
  const shouldNotifyAttendees = instructorChanged && session.reservedCount > 0;
  console.log(session.reservedCount);
  const spotsLeft = capacity - session.reservedCount;
  const isAtFloor = capacity <= session.reservedCount;
  const spotLabel = t(spotsLeft === 1 ? "schedule.spot" : "schedule.spots");
  const notifyAttendeesMessage = t(
    session.reservedCount === 1
      ? "dialog.notifyAttendees_one"
      : "dialog.notifyAttendees",
    { n: session.reservedCount },
  );
  const [scopeNoticePrefix, scopeNoticeLink, scopeNoticeSuffix] =
    t("dialog.scopeNotice").split("**");
  const classPlanEditPath = `${getPagePath("classes")}/${session.classId}/edit`;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setInstructorId(session.instructorId);
      setCapacity(session.capacity);
    }
  }

  function handleSave() {
    onSave(session.id, { instructorId, capacity });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <PencilIcon />
          {t("class.edit")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("class.edit")}</DialogTitle>
          <DialogDescription>{t("class.editDescription")}</DialogDescription>
        </DialogHeader>

        <ClassSessionSummary entry={entry} />

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
          <InfoIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span>
            {scopeNoticePrefix}
            <Link
              to={classPlanEditPath}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {scopeNoticeLink}
            </Link>
            {scopeNoticeSuffix}
          </span>
        </p>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-muted-foreground">
            {t("class.instructor")}
          </span>
          <Select
            value={instructorId ?? UNASSIGNED_INSTRUCTOR}
            onValueChange={(value) =>
              setInstructorId(value === UNASSIGNED_INSTRUCTOR ? null : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED_INSTRUCTOR}>
                {t("class.noStaff")}
              </SelectItem>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-muted-foreground">
            {t("class.capacity")}
          </span>
          <NumberStepper
            value={capacity}
            onChange={setCapacity}
            min={session.reservedCount}
            label={t("class.capacity")}
          />
          <span
            className={cn(
              "text-xs",
              isAtFloor
                ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground",
            )}
            aria-live="polite"
          >
            {isAtFloor
              ? t("class.alreadyBookedCantGoLower", {
                  count: session.reservedCount,
                })
              : t("class.bookedSpotsLeft", {
                  booked: session.reservedCount,
                  spotsLeft,
                  spotLabel,
                })}
          </span>
        </div>

        <DialogFooter className="flex-col items-stretch gap-2 sm:items-end">
          <p
            className={cn(
              "flex min-h-5 items-center gap-1.5 text-xs text-muted-foreground transition-opacity",
              shouldNotifyAttendees ? "opacity-100" : "opacity-0",
            )}
            aria-live="polite"
          >
            {shouldNotifyAttendees && (
              <>
                <InfoIcon className="size-3.5 shrink-0" aria-hidden="true" />
                <span>{notifyAttendeesMessage}</span>
              </>
            )}
          </p>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
          >
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
