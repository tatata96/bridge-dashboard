import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("bookings.cancelBooking")}</DialogTitle>
          <DialogDescription>
            {t("bookings.cancelBookingDescription", { name: firstName })}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="font-medium text-foreground">
            {reservation.clientName}
          </p>
          <p className="text-muted-foreground">
            {t("bookings.totalVisits", {
              count: reservation.clientTotalVisits,
            })}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {t("bookings.keepBooking")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm(reservation.id);
              onOpenChange(false);
            }}
          >
            {t("bookings.cancelBooking")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
