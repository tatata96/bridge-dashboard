import { useQuery } from "@tanstack/react-query";

import type {
  ClassTypeResponse,
  ClassTypeStatus,
} from "@/api/class-types/class-types.types";
import { apiFetch } from "@/lib/network/api-client";

// Prefix shared by the active and archived lists, so a mutation can
// invalidate both with one call. Like the other partner keys it is not
// user-scoped: AuthContext clears the whole cache when the user changes.
export const classTypesQueryKey = ["partner", "class-types"] as const;

export const classTypesListQueryKey = (status: ClassTypeStatus) =>
  [...classTypesQueryKey, status] as const;

export function fetchClassTypes(status: ClassTypeStatus) {
  // The backend returns active types unless told otherwise.
  const query = status === "archived" ? "?isActive=false" : "";

  return apiFetch<ClassTypeResponse[]>(`/partner/class-types${query}`);
}

export function useClassTypesQuery(status: ClassTypeStatus) {
  return useQuery({
    queryKey: classTypesListQueryKey(status),
    queryFn: () => fetchClassTypes(status),
  });
}
