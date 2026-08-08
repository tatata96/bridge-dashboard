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
import { TabsContent } from "@/components/ui/tabs";
import { AttendeesFilterPopover } from "@/pages/schedule/tabs/attendees-filter";
import {
  defaultAttendeesFilter,
  type AttendeesFilter,
} from "@/pages/schedule/tabs/attendees-filter.types";
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

export function BookingsTab({ reservations }: { reservations: Reservation[] }) {
  const [filter, setFilter] = useState<AttendeesFilter>(defaultAttendeesFilter);

  if (reservations.length === 0) {
    return (
      <TabsContent
        value="bookings"
        className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground"
      >
        <CalendarIcon className="size-8 text-muted-foreground/50" />
        <p>This class has no reservations.</p>
        <p>Please check back later.</p>
      </TabsContent>
    );
  }

  const totalUsers = reservations.length;
  const newUsers = reservations.filter(
    (reservation) => reservation.clientTotalVisits === 1,
  ).length;
  const returningUsers = totalUsers - newUsers;

  const filteredReservations = reservations.filter((reservation) =>
    matchesFilter(reservation, filter),
  );

  return (
    <TabsContent value="bookings" className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Total Users" value={totalUsers} />
        <StatTile label="Returning Users" value={returningUsers} />
        <StatTile label="New Users" value={newUsers} />
      </div>

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
    </TabsContent>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-border py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-foreground">{value}</span>
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
