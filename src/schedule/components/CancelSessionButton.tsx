import { type ReactNode, useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/i18n";
import { ClassSessionSummary } from "@/schedule/components/ClassSessionSummary";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";
import { cancellationReasons } from "@/schedule/constants/cancellation-reasons";

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
  const attendeeCount = entry.session.reservedCount;
  const refundCredits = attendeeCount * 2;
  const attendeeLabel = t(
    attendeeCount === 1 ? "class.attendee" : "class.attendees",
  );
  const creditLabel = t(refundCredits === 1 ? "class.credit" : "class.credits");
  function handleOpenChange(nextOpen: boolean) {
    if (open === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
    if (nextOpen) {
      setCancellationReason(cancellationReasons[0].value);
    }
  }

  return (
    <ConfirmDialog
      open={open ?? uncontrolledOpen}
      onOpenChange={handleOpenChange}
      trigger={
        trigger === null
          ? null
          : (trigger ?? (
              <Button type="button" variant="destructive-link" size="sm">
                {t("class.cancelSession")}
              </Button>
            ))
      }
      title={t("class.cancelQuestion")}
      body={
        attendeeCount > 0
          ? `${t("class.cancelDescription", {
              attendeeCount,
              attendeeLabel,
              creditCount: refundCredits,
              creditLabel,
            })}\n${t("class.cantBeUndone")}`
          : undefined
      }
      cancelLabel={t("class.keepSession")}
      confirmLabel={t("class.cancelSession")}
      tone="destructive"
      onConfirm={() => {
        onConfirm(entry.session.id);
        handleOpenChange(false);
      }}
    >
      <ClassSessionSummary entry={entry} showDate />

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
    </ConfirmDialog>
  );
}
