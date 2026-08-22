import { weekdayIndexes } from "@/config/class-labels";
import { atTime, dateFromYmdString } from "@/lib/date.utils";
import type { ScheduleListEntry } from "@/schedule/components/ScheduleClassList";
import type { ClassPlan } from "@/types/classes";
import type { ClassSession } from "@/types/schedule";
import type { Instructor } from "@/types/schedule";

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

function getNextClassPlanStart(entry: ClassPlan) {
  const [hours = "0", minutes = "0"] = entry.startTime.split(":");

  if (entry.schedule.type === "one_time") {
    return atTime(
      dateFromYmdString(entry.schedule.date),
      Number(hours),
      Number(minutes),
    );
  }

  if (entry.schedule.repeatOn.length === 0) {
    return atTime(new Date(), Number(hours), Number(minutes));
  }

  const now = new Date();
  const startDate = dateFromYmdString(entry.schedule.startDate);
  const searchStart = now > startDate ? now : startDate;
  const selectedWeekdayIndexes = entry.schedule.repeatOn.map(
    (day) => weekdayIndexes[day],
  );

  let nextStart: Date | null = null;

  for (let offset = 0; offset < 7; offset += 1) {
    const candidateDate = new Date(searchStart);
    candidateDate.setDate(searchStart.getDate() + offset);

    if (!selectedWeekdayIndexes.includes(candidateDate.getDay())) continue;

    const candidateStart = atTime(
      candidateDate,
      Number(hours),
      Number(minutes),
    );

    if (candidateStart.getTime() <= now.getTime()) continue;

    nextStart = candidateStart;
    break;
  }

  if (nextStart) return nextStart;

  return atTime(searchStart, Number(hours), Number(minutes));
}

export function getClassPlanSummaryEntry(
  entry: ClassPlan,
  sessions: ClassSession[],
  instructors: Instructor[],
  noInstructorLabel: string,
  unknownInstructorLabel: string,
): ScheduleListEntry {
  const now = Date.now();
  const upcomingSession = sessions
    .filter(
      (session) =>
        session.classId === entry.id &&
        new Date(session.startAt).getTime() > now,
    )
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    )[0];
  const instructorName = entry.instructorId
    ? (instructors.find((instructor) => instructor.id === entry.instructorId)
        ?.name ?? unknownInstructorLabel)
    : noInstructorLabel;

  return {
    session: upcomingSession ?? {
      id: `${entry.id}-plan-summary`,
      classId: entry.id,
      instructorId: entry.instructorId,
      startAt: getNextClassPlanStart(entry).toISOString(),
      durationMinutes: entry.durationMinutes,
      capacity: entry.capacity,
      reservedCount: 0,
    },
    className: entry.name,
    instructorName,
  };
}
