import { useQuery } from "@tanstack/react-query";

import type { ClassistaUser } from "@/api/auth/auth.types";
import { apiFetch } from "@/lib/network/api-client";

// The backend guard creates the Classista user row on first call.
export function fetchMe() {
  return apiFetch<ClassistaUser>("/auth/me");
}

export const meQueryKey = (userId: string) => ["auth", "me", userId] as const;

// Keyed by the Supabase user id so each identity has its own cache entry.
// fetchMe doesn't use the id: apiFetch reads the token from the session.
export function useMeQuery(userId: string | undefined) {
  return useQuery({
    queryKey: meQueryKey(userId ?? ""),
    queryFn: fetchMe,
    enabled: !!userId,
  });
}
