import type { CategoryResponse } from "@/api/categories/categories.types";
import type { ClassSessionResponse } from "@/api/class-sessions/class-sessions.types";
import { getTopLevelCategoryId } from "@/classes/utils/class-plans.utils";

export const ALL_FILTER_VALUE = "all";

// Cancelled sessions are hidden; the API's chronological order is kept.
export function getActiveSessions(sessions: ClassSessionResponse[]) {
  return sessions.filter((session) => session.status !== "CANCELLED");
}

// The session's category is a leaf, while the toolbar filters by top-level
// category.
export function filterSessions(
  sessions: ClassSessionResponse[],
  filters: { categoryId: string; venueId: string },
  categories: CategoryResponse[],
) {
  return sessions.filter(
    (session) =>
      (filters.categoryId === ALL_FILTER_VALUE ||
        getTopLevelCategoryId(categories, session.categoryId) ===
          filters.categoryId) &&
      (filters.venueId === ALL_FILTER_VALUE ||
        session.venueId === filters.venueId),
  );
}

export function getSessionDurationMinutes(session: ClassSessionResponse) {
  return Math.round(
    (new Date(session.endAt).getTime() - new Date(session.startAt).getTime()) /
      60_000,
  );
}

export function hasSessionStarted(session: ClassSessionResponse) {
  return Date.now() >= new Date(session.startAt).getTime();
}

export function hasSessionEnded(session: ClassSessionResponse) {
  return (
    session.status === "COMPLETED" ||
    Date.now() >= new Date(session.endAt).getTime()
  );
}
