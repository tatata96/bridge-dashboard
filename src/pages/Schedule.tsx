import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { addDays, isSameDay } from "@/lib/date.utils";
import {
  ScheduleClassList,
  type ScheduleListEntry,
} from "@/schedule/components/ScheduleClassList";
import { ScheduleDetailPanel } from "@/schedule/components/ScheduleDetailPanel";
import {
  mockClasses,
  mockClassSessions,
  mockInstructors,
  mockReservations,
} from "@/schedule/data/schedule.mock-data";
import { ScheduleToolbar } from "@/schedule/components/ScheduleToolbar";

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
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    setSessions((prev) => prev.filter((session) => session.id !== sessionId));

    toast({
      title: "Session cancelled",
      action: {
        label: "Undo",
        onClick: () => {
          setSessions((prev) =>
            prev.some((s) => s.id === sessionId) ? prev : [...prev, session],
          );
          setSelectedSessionId(sessionId);
        },
      },
    });
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
    <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <ScheduleToolbar
        selectedDate={selectedDate}
        onPrevDay={() => setSelectedDate((date) => addDays(date, -1))}
        onNextDay={() => setSelectedDate((date) => addDays(date, 1))}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col xl:w-[clamp(22rem,34vw,39rem)] xl:flex-none">
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
