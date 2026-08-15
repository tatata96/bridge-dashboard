import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useI18n } from "@/i18n/i18n";
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
  const firstName = reservation.clientName.split(" ")[0];
  const { t } = useI18n();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("bookings.cancelBooking")}
      body={t("bookings.cancelBookingDescription", { name: firstName })}
      cancelLabel={t("bookings.keepBooking")}
      confirmLabel={t("bookings.cancelBooking")}
      tone="destructive"
      onConfirm={() => {
        onConfirm(reservation.id);
        onOpenChange(false);
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
    </ConfirmDialog>
  );
}
