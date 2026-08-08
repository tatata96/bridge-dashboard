import { useState } from "react";

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
import { ClassSessionSummary } from "@/pages/schedule/class-session-summary";
import type { ScheduleListEntry } from "@/pages/schedule/schedule-class-list";

export function CancelClassButton({
  entry,
  onConfirm,
}: {
  entry: ScheduleListEntry;
  onConfirm: (sessionId: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" size="sm">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel class</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this class? This can't be undone.
          </DialogDescription>
        </DialogHeader>

        <ClassSessionSummary entry={entry} />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Keep class
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm(entry.session.id);
              setOpen(false);
            }}
          >
            Cancel class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
