import { useState } from "react";
import { PencilIcon } from "lucide-react";

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

  const isDirty =
    instructorId !== session.instructorId || capacity !== session.capacity;
  const spotsLeft = capacity - session.reservedCount;
  const isAtFloor = capacity <= session.reservedCount;

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
          Edit this class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit this class</DialogTitle>
          <DialogDescription>
            Update the staff or capacity for this session.
          </DialogDescription>
        </DialogHeader>

        <ClassSessionSummary entry={entry} />

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-muted-foreground">
            Instructor
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
                No staff specified
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
            Capacity
          </span>
          <NumberStepper
            value={capacity}
            onChange={setCapacity}
            min={session.reservedCount}
            label="Capacity"
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
              ? `${session.reservedCount} already booked — can't go lower`
              : `${session.reservedCount} booked · ${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left`}
          </span>
        </div>

        <DialogFooter>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
