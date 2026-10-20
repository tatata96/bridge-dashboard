import { useQuery } from "@tanstack/react-query";

import type { ClassSessionResponse } from "@/api/class-sessions/class-sessions.types";
import { apiFetch } from "@/lib/network/api-client";

// Prefix shared by every daily list, so a mutation can invalidate them all
// with one call. Like the other partner keys it is not user-scoped:
// AuthContext clears the whole cache when the user changes.
export const classSessionsQueryKey = ["partner", "class-sessions"] as const;

export const classSessionsByDateQueryKey = (date: string) =>
  [...classSessionsQueryKey, date] as const;

// `date` is a YYYY-MM-DD calendar date. The backend reads it as an Istanbul
// day and returns that day's sessions earliest first, cancelled ones included.
export function fetchClassSessions(date: string) {
  return apiFetch<ClassSessionResponse[]>(
    `/partner/class-sessions?date=${encodeURIComponent(date)}`,
  );
}

export function useClassSessionsQuery(date: string) {
  return useQuery({
    queryKey: classSessionsByDateQueryKey(date),
    queryFn: () => fetchClassSessions(date),
  });
}
