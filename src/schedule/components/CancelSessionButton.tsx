import { type ReactNode, useRef, useState } from "react";

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
import { useI18n, type TranslationKey } from "@/i18n/i18n";
import { ClassSessionSummary } from "@/schedule/components/ClassSessionSummary";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";

const cancellationReasons = [
  { value: "low-attendance", labelKey: "class.reason.lowAttendance" },
  {
    value: "instructor-unavailable",
    labelKey: "class.reason.instructorUnavailable",
  },
  { value: "facility-issue", labelKey: "class.reason.facilityIssue" },
  { value: "schedule-conflict", labelKey: "class.reason.scheduleConflict" },
  { value: "other", labelKey: "class.reason.other" },
] satisfies { value: string; labelKey: TranslationKey }[];

export function CancelSessionButton({
  entry,
  onConfirm,
  open,
  onOpenChange,
  trigger,
}: {
  entry: ScheduleListEntry;
  onConfirm: (sessionId: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode | null;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState(
    cancellationReasons[0].value,
  );
  const { t } = useI18n();
  const keepSessionButtonRef = useRef<HTMLButtonElement>(null);
  const attendeeCount = entry.session.reservedCount;
  const refundCredits = attendeeCount * 2;
  const attendeeLabel = t(
    attendeeCount === 1 ? "class.attendee" : "class.attendees",
  );
  const creditLabel = t(refundCredits === 1 ? "class.credit" : "class.credits");
  const isControlled = open !== undefined;
  const dialogOpen = open ?? uncontrolledOpen;

  function handleOpenChange(nextOpen: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
    if (nextOpen) {
      setCancellationReason(cancellationReasons[0].value);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger !== null ? (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button type="button" variant="destructive-link" size="sm">
              {t("class.cancelSession")}
            </Button>
          )}
        </DialogTrigger>
      ) : null}
      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          keepSessionButtonRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("class.cancelQuestion")}</DialogTitle>
          {attendeeCount > 0 ? (
            <DialogDescription>
              {t("class.cancelDescription", {
                attendeeCount,
                attendeeLabel,
                creditCount: refundCredits,
                creditLabel,
              })}
              <br />
              {t("class.cantBeUndone")}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <ClassSessionSummary entry={entry} />

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-muted-foreground">
            {t("class.cancellationReason")}
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
                <SelectItem key={reason.value} value={reason.value}>
                  {t(reason.labelKey)}
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
            onClick={() => handleOpenChange(false)}
          >
            {t("class.keepSession")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm(entry.session.id);
              handleOpenChange(false);
            }}
          >
            {t("class.cancelSession")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
