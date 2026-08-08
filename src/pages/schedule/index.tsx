import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { addDays, isSameDay } from "@/lib/date.utils";
import {
  ScheduleClassList,
  type ScheduleListEntry,
} from "@/pages/schedule/schedule-class-list";
import { ScheduleDetailPanel } from "@/pages/schedule/schedule-detail-panel";
import {
  mockClasses,
  mockClassSessions,
  mockInstructors,
  mockReservations,
} from "@/pages/schedule/schedule.mock-data";
import { ScheduleToolbar } from "@/pages/schedule/schedule-toolbar";

const classesById = new Map(mockClasses.map((c) => [c.id, c]));
const instructorsById = new Map(mockInstructors.map((i) => [i.id, i]));

export function SchedulePage() {
  const { toast } = useToast();
  const [now] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [sessions, setSessions] = useState(() => mockClassSessions);
  const [reservations, setReservations] = useState(() => mockReservations);

  function updateSessionClass(
    sessionId: string,
    changes: { instructorId: string | null; capacity: number },
  ) {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, ...changes } : session,
      ),
    );
  }

  function cancelSession(sessionId: string) {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  }

  function checkInReservation(reservationId: string) {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) return;

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: "attended" } : r,
      ),
    );

    const firstName = reservation.clientName.split(" ")[0];
    toast({
      title: `${firstName} checked in`,
      action: {
        label: "Undo",
        onClick: () => {
          setReservations((prev) =>
            prev.map((r) =>
              r.id === reservationId ? { ...r, status: "booked" } : r,
            ),
          );
        },
      },
    });
  }

  const entries: ScheduleListEntry[] = sessions
    .filter((session) => isSameDay(new Date(session.startAt), selectedDate))
    .filter((session) => {
      if (typeFilter === "all") return true;
      return (
        classesById.get(session.classId)?.category.toLowerCase() === typeFilter
      );
    })
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    )
    .map((session) => ({
      session,
      className: classesById.get(session.classId)?.name ?? "Unknown class",
      instructorName: session.instructorId
        ? (instructorsById.get(session.instructorId)?.name ??
          "Unknown instructor")
        : "No Staff Specified",
    }));

  const selectedEntry =
    entries.find((entry) => entry.session.id === selectedSessionId) ??
    entries[0];

  const selectedEntryReservations = selectedEntry
    ? reservations.filter(
        (reservation) => reservation.sessionId === selectedEntry.session.id,
      )
    : [];

  const classHasEnded = selectedEntry
    ? now.getTime() >=
      new Date(selectedEntry.session.startAt).getTime() +
        selectedEntry.session.durationMinutes * 60_000
    : false;

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <ScheduleToolbar
        selectedDate={selectedDate}
        onPrevDay={() => setSelectedDate((date) => addDays(date, -1))}
        onNextDay={() => setSelectedDate((date) => addDays(date, 1))}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <div className="flex flex-1 gap-4">
        <div className="flex w-full max-w-md flex-col">
          <ScheduleClassList
            entries={entries}
            selectedSessionId={selectedEntry?.session.id ?? null}
            onSelectSession={setSelectedSessionId}
          />
        </div>
        <ScheduleDetailPanel
          entry={selectedEntry}
          reservations={selectedEntryReservations}
          instructors={mockInstructors}
          onSaveClass={updateSessionClass}
          onCancelSession={cancelSession}
          onCheckIn={checkInReservation}
          classHasEnded={classHasEnded}
        />
      </div>
    </main>
  );
}
