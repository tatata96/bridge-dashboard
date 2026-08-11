import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { InfoNotice } from "@/components/ui/info-notice";
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
import { ClassSessionSummary } from "@/schedule/components/ClassSessionSummary";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";
import type { Instructor } from "@/types/schedule";

const UNASSIGNED_INSTRUCTOR = "unassigned";

export function EditClassModal({
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
  const spotsLeft = capacity - session.reservedCount;
  const isAtFloor = capacity <= session.reservedCount;
  const spotLabel = t(spotsLeft === 1 ? "schedule.spot" : "schedule.spots");

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
        <Button type="button" variant="outline" size="sm">
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

        <InfoNotice>
          <p>
            {t("class.editAppliesToSingleSession")}{" "}
            {t("class.editRecurringPrefix")}
            <Link
              to={getPagePath("classes")}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {t("class.editRecurringLink")}
            </Link>
            {t("class.editRecurringSuffix")}
          </p>
        </InfoNotice>

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

        <DialogFooter>
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
