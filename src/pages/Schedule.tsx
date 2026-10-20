import { useState } from "react";

import { useCategoriesQuery } from "@/api/categories/categories.api";
import { useClassSessionsQuery } from "@/api/class-sessions/class-sessions.api";
import { useVenuesQuery } from "@/api/venues/venues.api";
import { useI18n } from "@/i18n/i18n";
import {
  addDays,
  formatYmd,
  getTodayInTimeZone,
  ISTANBUL_TIME_ZONE,
} from "@/lib/date.utils";
import { ScheduleClassList } from "@/schedule/components/ScheduleClassList";
import {
  ScheduleListError,
  ScheduleListLoading,
  ScheduleListMessage,
  ScheduleRefreshError,
} from "@/schedule/components/ScheduleListStates";
import { ScheduleDetailPanel } from "@/schedule/components/session-detail-right-panel/ScheduleDetailPanel";
import { ScheduleToolbar } from "@/schedule/components/session-detail-right-panel/ScheduleToolbar";
import {
  ALL_FILTER_VALUE,
  filterSessions,
  getActiveSessions,
} from "@/schedule/utils/schedule-sessions.utils";

export function SchedulePage() {
  const { t } = useI18n();
  // A local Date holding the Istanbul calendar date, which is what the API
  // reads; the day boundaries themselves are the backend's job.
  const [selectedDate, setSelectedDate] = useState(() =>
    getTodayInTimeZone(ISTANBUL_TIME_ZONE),
  );
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER_VALUE);
  const [venueFilter, setVenueFilter] = useState(ALL_FILTER_VALUE);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const sessionsQuery = useClassSessionsQuery(formatYmd(selectedDate));
  const categoriesQuery = useCategoriesQuery();
  const venuesQuery = useVenuesQuery();

  const categories = categoriesQuery.data ?? [];
  const activeSessions = getActiveSessions(sessionsQuery.data ?? []);
  const visibleSessions = filterSessions(
    activeSessions,
    { categoryId: typeFilter, venueId: venueFilter },
    categories,
  );

  // If the selected session is gone after a date or filter change, fall back
  // to the first visible one (or none, which shows the empty detail state).
  const selectedSession =
    visibleSessions.find((session) => session.id === selectedSessionId) ??
    visibleSessions[0];

  function renderSessionList() {
    // Each date has its own query, so a newly selected date is pending until
    // its sessions arrive instead of showing the previous day's.
    if (sessionsQuery.isPending) {
      return <ScheduleListLoading />;
    }

    if (!sessionsQuery.data) {
      return (
        <ScheduleListError
          onRetry={() => void sessionsQuery.refetch()}
          isRetrying={sessionsQuery.isFetching}
        />
      );
    }

    if (activeSessions.length === 0) {
      return <ScheduleListMessage message={t("schedule.noClasses")} />;
    }

    if (visibleSessions.length === 0) {
      return <ScheduleListMessage message={t("schedule.noMatches")} />;
    }

    return (
      <ScheduleClassList
        sessions={visibleSessions}
        selectedSessionId={selectedSession?.id ?? null}
        onSelectSession={setSelectedSessionId}
      />
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <ScheduleToolbar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onPrevDay={() => setSelectedDate((date) => addDays(date, -1))}
        onNextDay={() => setSelectedDate((date) => addDays(date, 1))}
        categories={categories}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        venues={venuesQuery.data ?? []}
        venueFilter={venueFilter}
        onVenueFilterChange={setVenueFilter}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col xl:w-[clamp(22rem,34vw,39rem)] xl:flex-none">
          {sessionsQuery.isError && sessionsQuery.data ? (
            <ScheduleRefreshError
              onRetry={() => void sessionsQuery.refetch()}
              isRetrying={sessionsQuery.isFetching}
            />
          ) : null}
          {renderSessionList()}
        </div>
        <ScheduleDetailPanel session={selectedSession} />
      </div>
    </main>
  );
}
