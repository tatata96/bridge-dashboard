import { useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/i18n";
import { cancellationReasons } from "@/schedule/constants/cancellation-reasons";
import type { Reservation } from "@/types/schedule";

export function CancelBookingModal({
  reservation,
  open,
  onOpenChange,
  onConfirm,
}: {
  reservation: Reservation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reservationId: string) => void;
}) {
  const [cancellationReason, setCancellationReason] = useState(
    cancellationReasons[0].value,
  );
  const firstName = reservation.clientName.split(" ")[0];
  const { t } = useI18n();

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (nextOpen) {
      setCancellationReason(cancellationReasons[0].value);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t("bookings.cancelBooking")}
      body={t("bookings.cancelBookingDescription", { name: firstName })}
      cancelLabel={t("bookings.keepBooking")}
      confirmLabel={t("bookings.cancelBooking")}
      tone="destructive"
      onConfirm={() => {
        onConfirm(reservation.id);
        handleOpenChange(false);
      }}
    >
      <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
        <p className="font-medium text-foreground">{reservation.clientName}</p>
        <p className="text-muted-foreground">
          {t("bookings.totalVisits", {
            count: reservation.clientTotalVisits,
          })}
        </p>
      </div>

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
