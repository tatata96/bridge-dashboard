import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel booking</DialogTitle>
          <DialogDescription>
            {firstName} will be notified and 2 credits refunded. The spot
            reopens.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="font-medium text-foreground">
            {reservation.clientName}
          </p>
          <p className="text-muted-foreground">
            {reservation.clientTotalVisits}x total visits
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Keep booking
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
            Cancel booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
