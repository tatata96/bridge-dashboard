import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/i18n";
import { addDays, isSameDay } from "@/lib/date.utils";
import {
  ScheduleClassList,
  type ScheduleListEntry,
} from "@/schedule/components/ScheduleClassList";
import { ScheduleDetailPanel } from "@/schedule/components/ScheduleDetailPanel";
import {
  mockClassSessions,
  mockInstructors,
  mockReservations,
} from "@/schedule/data/schedule.mock-data";
import { ScheduleToolbar } from "@/schedule/components/ScheduleToolbar";
import {
  classesById,
  getInstructorName,
  hasSessionEnded,
  hasSessionStarted,
} from "@/schedule/utils/schedule.utils";
import type { ClassSession } from "@/types/schedule";

export function SchedulePage() {
  const { toast } = useToast();
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [sessions, setSessions] = useState(() => mockClassSessions);
  const [reservations, setReservations] = useState(() => mockReservations);

  function getVisibleSessions(sourceSessions: ClassSession[]) {
    return sourceSessions
      .filter((session) => isSameDay(new Date(session.startAt), selectedDate))
      .filter((session) => {
        if (typeFilter === "all") return true;
        return classesById.get(session.classId)?.classTypeId === typeFilter;
      })
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      );
  }

  function updateSessionClass(
    sessionId: string,
    changes: { instructorId: string | null; capacity: number },
  ) {
    const originalSession = sessions.find(
      (session) => session.id === sessionId,
    );
    if (!originalSession) {
      console.warn(`Cannot update missing session: ${sessionId}`);
      return;
    }
    if (hasSessionStarted(originalSession)) return;

    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, ...changes } : session,
      ),
    );

    const changeMessages: string[] = [];
    if (changes.capacity !== originalSession.capacity) {
      changeMessages.push(
        t("toast.capacityChanged", {
          from: originalSession.capacity,
          to: changes.capacity,
        }),
      );
    }
    if (changes.instructorId !== originalSession.instructorId) {
      changeMessages.push(
        t("toast.instructorChanged", {
          instructor: getInstructorName(changes.instructorId),
        }),
      );
    }

    toast({
      title: changeMessages.join(". ") || t("toast.classChangesSaved"),
      action: {
        label: t("common.undo"),
        onClick: () => {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === sessionId ? originalSession : session,
            ),
          );
          setSelectedSessionId(sessionId);
        },
      },
    });
  }

  function cancelSession(sessionId: string) {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;
    if (hasSessionStarted(session)) return;

    const visibleSessions = getVisibleSessions(sessions);
    const cancelledIndex = visibleSessions.findIndex((s) => s.id === sessionId);
    const nextVisibleSessions = visibleSessions.filter(
      (session) => session.id !== sessionId,
    );
    const nextSelectedSession =
      nextVisibleSessions[cancelledIndex] ??
      nextVisibleSessions[cancelledIndex - 1] ??
      null;

    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    setSelectedSessionId(nextSelectedSession?.id ?? null);

    toast({
      title: t("toast.sessionCancelled"),
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
      title: t("toast.checkedIn", { name: firstName }),
      action: {
        label: t("common.undo"),
        onClick: () => undoCheckInReservation(reservationId),
      },
    });
  }

  function undoCheckInReservation(reservationId: string) {
    const reservation = reservations.find((r) => r.id === reservationId);

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: "booked" } : r,
      ),
    );

    if (!reservation) return;

    const firstName = reservation.clientName.split(" ")[0];
    toast({
      title: t("toast.checkInUndone", { name: firstName }),
    });
  }

  function cancelBooking(reservationId: string) {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) return;

    const firstName = reservation.clientName.split(" ")[0];

    setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== reservation.sessionId) return session;

        return {
          ...session,
          reservedCount: Math.max(0, session.reservedCount - 1),
        };
      }),
    );

    toast({
      title: t("toast.bookingCancelled", { name: firstName }),
      action: {
        label: t("common.undo"),
        onClick: () => {
          setReservations((prev) =>
            prev.some((r) => r.id === reservationId)
              ? prev
              : [...prev, reservation],
          );
          setSessions((prev) =>
            prev.map((session) => {
              if (session.id !== reservation.sessionId) return session;

              return {
                ...session,
                reservedCount: session.reservedCount + 1,
              };
            }),
          );
        },
      },
    });
  }

  const entries: ScheduleListEntry[] = getVisibleSessions(sessions).map(
    (session) => ({
      session,
      className:
        classesById.get(session.classId)?.name ?? t("schedule.unknownClass"),
      instructorName: getInstructorName(session.instructorId),
    }),
  );

  const selectedEntry =
    entries.find((entry) => entry.session.id === selectedSessionId) ??
    entries[0];

  const selectedEntryReservations = selectedEntry
    ? reservations.filter(
        (reservation) => reservation.sessionId === selectedEntry.session.id,
      )
    : [];

  const classHasEnded = selectedEntry
    ? hasSessionEnded(selectedEntry.session)
    : false;
  const classHasStarted = selectedEntry
    ? hasSessionStarted(selectedEntry.session)
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
          onUndoCheckIn={undoCheckInReservation}
          onCancelBooking={cancelBooking}
          classHasEnded={classHasEnded}
          classHasStarted={classHasStarted}
        />
      </div>
    </main>
  );
}
