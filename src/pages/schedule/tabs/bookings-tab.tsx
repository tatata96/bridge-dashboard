import {
  CalendarIcon,
  MoreVerticalIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import { StatusIconBadge } from "@/components/ui/status-icon-badge";
import { TabsContent } from "@/components/ui/tabs";
import type { Reservation } from "@/types/schedule";

export function BookingsTab({ reservations }: { reservations: Reservation[] }) {
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

  return (
    <TabsContent value="bookings" className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Total Users" value={totalUsers} />
        <StatTile label="Returning Users" value={returningUsers} />
        <StatTile label="New Users" value={newUsers} />
      </div>

      <div className="flex flex-1 flex-col rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-foreground">
            Attendees
          </span>
          <div className="flex items-center gap-3 text-muted-foreground">
            <SlidersHorizontalIcon className="size-4" />
          </div>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {reservations.map((reservation) => (
            <BookingRow key={reservation.id} reservation={reservation} />
          ))}
        </ul>
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
          <StatusIconBadge variant={attendanceVariant} />
        ) : null}
        <MoreVerticalIcon className="size-4 text-muted-foreground" />
      </div>
    </li>
  );
}
