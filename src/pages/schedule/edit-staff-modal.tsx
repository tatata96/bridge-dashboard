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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassSessionSummary } from "@/pages/schedule/class-session-summary";
import type { ScheduleListEntry } from "@/pages/schedule/schedule-class-list";
import type { Instructor } from "@/types/schedule";

const UNASSIGNED_INSTRUCTOR = "unassigned";

export function EditStaffModal({
  entry,
  instructors,
  onSave,
}: {
  entry: ScheduleListEntry;
  instructors: Instructor[];
  onSave: (sessionId: string, instructorId: string | null) => void;
}) {
  const { session } = entry;
  const [open, setOpen] = useState(false);
  const [instructorId, setInstructorId] = useState(session.instructorId);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setInstructorId(session.instructorId);
  }

  function handleSave() {
    onSave(session.id, instructorId);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <PencilIcon />
          Edit staff
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit staff</DialogTitle>
          <DialogDescription>Who should teach this class?</DialogDescription>
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

        <DialogFooter>
          <Button type="button" size="sm" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
