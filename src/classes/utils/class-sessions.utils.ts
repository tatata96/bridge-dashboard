import type { ClassSession } from "@/types/schedule";

export function getUpcomingSessionSummary(
  sessions: ClassSession[],
  entryId: string,
) {
  const now = Date.now();
  const upcomingSessions = sessions.filter(
    (session) =>
      session.classId === entryId && new Date(session.startAt).getTime() > now,
  );

  return {
    sessionCount: upcomingSessions.length,
    bookingCount: upcomingSessions.reduce(
      (count, session) => count + session.reservedCount,
      0,
    ),
  };
}
