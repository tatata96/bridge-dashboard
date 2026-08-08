import { useState } from "react";
import { CalendarIcon, CheckIcon, MoreVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/classnames.utils";
import { AttendeesFilterPopover } from "@/schedule/components/AttendeesFilter";
import {
  defaultAttendeesFilter,
  type AttendeesFilter,
} from "@/schedule/types/attendees-filter.types";
import type { Reservation } from "@/types/schedule";

function matchesFilter(reservation: Reservation, filter: AttendeesFilter) {
  const statusMatches =
    filter.status === "all"
      ? true
      : filter.status === "unmarked"
        ? reservation.status === "booked"
        : filter.status === "attended"
          ? reservation.status === "attended"
          : reservation.status === "no_show" ||
            reservation.status === "late_cancelled";

  const userTypeMatches =
    filter.userType === "all" ||
    (filter.userType === "new"
      ? reservation.clientTotalVisits === 1
      : reservation.clientTotalVisits > 1);

  return statusMatches && userTypeMatches;
}

export function Bookings({
  reservations,
  classHasEnded,
  onCheckIn,
}: {
  reservations: Reservation[];
  classHasEnded: boolean;
  onCheckIn: (reservationId: string) => void;
}) {
  const [filter, setFilter] = useState<AttendeesFilter>(defaultAttendeesFilter);

  if (reservations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <CalendarIcon className="size-8 text-muted-foreground/50" />
        <p>This class has no reservations.</p>
        <p>Please check back later.</p>
      </div>
    );
  }

  const filteredReservations = reservations.filter((reservation) =>
    matchesFilter(reservation, filter),
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Attendees</h3>
          <div className="flex items-center gap-3 text-muted-foreground">
            <AttendeesFilterPopover filter={filter} onApply={setFilter} />
          </div>
        </div>
        {filteredReservations.length === 0 ? (
          <p className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
            No attendees match the selected filters.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {filteredReservations.map((reservation) => (
              <BookingRow
                key={reservation.id}
                reservation={reservation}
                classHasEnded={classHasEnded}
                onCheckIn={onCheckIn}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function BookingRow({
  reservation,
  classHasEnded,
  onCheckIn,
}: {
  reservation: Reservation;
  classHasEnded: boolean;
  onCheckIn: (reservationId: string) => void;
}) {
  return (
    <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
          {reservation.clientName.charAt(0)}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-sm font-medium text-foreground">
            {reservation.clientName}
          </span>
          <span className="text-xs text-muted-foreground">
            {reservation.clientTotalVisits}x total visits
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
        <AttendanceStatus
          reservation={reservation}
          classHasEnded={classHasEnded}
          onCheckIn={onCheckIn}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="More actions"
            >
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>No actions yet</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}

function AttendanceStatus({
  reservation,
  classHasEnded,
  onCheckIn,
}: {
  reservation: Reservation;
  classHasEnded: boolean;
  onCheckIn: (reservationId: string) => void;
}) {
  if (reservation.status === "attended") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
          "bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400",
        )}
      >
        <CheckIcon className="size-3.5" aria-hidden="true" />
        Checked in
      </span>
    );
  }

  if (reservation.status === "booked" && !classHasEnded) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onCheckIn(reservation.id)}
      >
        Check in
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      Not checked in
    </span>
  );
}
