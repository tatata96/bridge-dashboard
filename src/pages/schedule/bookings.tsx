import { useState } from "react";
import { CalendarIcon, MoreVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIconBadge } from "@/components/ui/status-icon-badge";
import { AttendeesFilterPopover } from "@/pages/schedule/attendees-filter";
import {
  defaultAttendeesFilter,
  type AttendeesFilter,
} from "@/pages/schedule/attendees-filter.types";
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

export function Bookings({ reservations }: { reservations: Reservation[] }) {
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
    <div className="flex flex-1 flex-col gap-4">
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
              <BookingRow key={reservation.id} reservation={reservation} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function BookingRow({ reservation }: { reservation: Reservation }) {
  const attendanceVariant =
    reservation.status === "attended"
      ? "check"
      : reservation.status === "no_show" ||
          reservation.status === "late_cancelled"
        ? "cross"
        : null;
  const attendanceLabel =
    attendanceVariant === "check" ? "Attended" : "No-show";

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
          {reservation.clientName.charAt(0)}
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {reservation.clientName}
          </span>
          <span className="text-xs text-muted-foreground">
            {reservation.clientTotalVisits}x total visits
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {attendanceVariant ? (
          <StatusIconBadge
            variant={attendanceVariant}
            label={attendanceLabel}
          />
        ) : null}
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
