import { useMemo } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getPagePath } from "@/config/navigation";
import { useI18n } from "@/i18n/i18n";
import { addDays, formatTime } from "@/lib/date.utils";
import { mockClassSessions } from "@/schedule/data/schedule.mock-data";
import type { ClassSession } from "@/types/schedule";

function formatSessionDate(value: string, locale: string) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";

  return `${weekday} ${day} ${month}`.trim();
}

function getClassSessionSummary(sessions: ClassSession[]) {
  const totalReservations = sessions.reduce(
    (total, session) => total + session.reservedCount,
    0,
  );
  const totalCapacity = sessions.reduce(
    (total, session) => total + session.capacity,
    0,
  );
  const averageFill =
    totalCapacity > 0
      ? Math.round((totalReservations / totalCapacity) * 100)
      : 0;

  return {
    count: sessions.length,
    averageFill,
  };
}

export function ClassSessionsCard({ classId }: { classId: string }) {
  const { t, dateLocale } = useI18n();
  const now = new Date();
  const eightWeeksAgo = addDays(now, -56);

  const sessions = useMemo(
    () =>
      mockClassSessions
        .filter((session) => session.classId === classId)
        .sort(
          (a, b) =>
            new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
        ),
    [classId],
  );
  const recentSessions = sessions.filter(
    (session) =>
      new Date(session.startAt) >= eightWeeksAgo &&
      new Date(session.startAt) < now,
  );
  const upcomingSessions = sessions.filter(
    (session) => new Date(session.startAt) >= now,
  );
  const pastSessions = recentSessions
    .toSorted(
      (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime(),
    )
    .slice(0, 3);
  const { count, averageFill } = getClassSessionSummary(recentSessions);

  return (
    <aside className="w-full rounded-lg border border-border bg-background p-4 sm:p-6 xl:sticky xl:top-4">
      <h3 className="text-base font-semibold text-foreground">
        {t("classes.sessionsCardTitle")}
      </h3>
      <p className="mt-1 text-sm font-medium text-muted-foreground">
        {t("classes.sessionsCardWindow")}
      </p>
      <p className="text-sm font-semibold text-muted-foreground">
        {t("classes.sessionsCardSummary", {
          count,
          average: averageFill,
        })}
      </p>

      <div className="mt-4 divide-y divide-border border-y border-border">
        {upcomingSessions.length === 0 && pastSessions.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            {t("classes.sessionsCardEmpty")}
          </p>
        ) : (
          <>
            {upcomingSessions.length > 0 && (
              <>
                <div className="py-3 text-sm font-medium text-muted-foreground">
                  {t("classes.sessionsCardUpcoming")}
                </div>

                {upcomingSessions.slice(0, 2).map((session) => (
                  <SessionCardRow
                    key={session.id}
                    session={session}
                    locale={dateLocale}
                  />
                ))}
              </>
            )}

            {pastSessions.length > 0 && (
              <div className="py-3 text-sm font-medium text-muted-foreground">
                {t("classes.sessionsCardPast")}
              </div>
            )}

            {pastSessions.map((session) => (
              <SessionCardRow
                key={session.id}
                session={session}
                locale={dateLocale}
                muted
              />
            ))}
          </>
        )}
      </div>

      <Button
        asChild
        variant="link"
        className="mt-4 h-auto p-0 text-sm font-semibold"
      >
        <Link to={getPagePath("schedule")}>
          {t("classes.viewSessions")}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </Button>
    </aside>
  );
}

function SessionCardRow({
  session,
  locale,
  muted = false,
}: {
  session: ClassSession;
  locale: string;
  muted?: boolean;
}) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 py-3 text-sm">
      <span
        className={
          muted
            ? "min-w-0 font-semibold text-muted-foreground"
            : "min-w-0 font-semibold text-foreground"
        }
      >
        {formatSessionDate(session.startAt, locale)} ·{" "}
        {formatTime(new Date(session.startAt), locale)}
      </span>
      <span
        className={
          muted
            ? "shrink-0 font-semibold text-muted-foreground"
            : "shrink-0 font-semibold text-foreground"
        }
      >
        {session.reservedCount}/{session.capacity}
      </span>
    </div>
  );
}
