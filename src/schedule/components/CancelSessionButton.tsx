import { useRef, useState } from "react";

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
import { ClassSessionSummary } from "@/schedule/components/ClassSessionSummary";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";

const cancellationReasons = [
  "Low attendance",
  "Instructor unavailable",
  "Facility issue",
  "Schedule conflict",
  "Other",
];

export function CancelSessionButton({
  entry,
  onConfirm,
}: {
  entry: ScheduleListEntry;
  onConfirm: (sessionId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState(
    cancellationReasons[0],
  );
  const keepSessionButtonRef = useRef<HTMLButtonElement>(null);
  const attendeeCount = entry.session.reservedCount;
  const refundCredits = attendeeCount * 2;
  const attendeeLabel = attendeeCount === 1 ? "attendee" : "attendees";
  const creditLabel = refundCredits === 1 ? "credit" : "credits";

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setCancellationReason(cancellationReasons[0]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive-link" size="sm">
          Cancel session
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          keepSessionButtonRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cancel this session?</DialogTitle>
          {attendeeCount > 0 ? (
            <DialogDescription>
              {attendeeCount} {attendeeLabel} will be notified and refunded{" "}
              {refundCredits} {creditLabel}. <br />
              This can't be undone.
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <ClassSessionSummary entry={entry} />

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-muted-foreground">
            Cancellation reason
          </span>
          <Select
            value={cancellationReason}
            onValueChange={setCancellationReason}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cancellationReasons.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <DialogFooter>
          <Button
            ref={keepSessionButtonRef}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Keep session
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
            Cancel session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
