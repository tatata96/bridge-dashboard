import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  ClassTypeResponse,
  ClassTypeStatus,
  CreateClassTypeRequest,
  UpdateClassTypeRequest,
} from "@/api/class-types/class-types.types";
import { ApiError, apiFetch } from "@/lib/network/api-client";

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

// Every mutation refreshes both lists through the shared key prefix, because
// a change can move a type between them or within the name-sorted order.
function useRefetchClassTypeLists() {
  const queryClient = useQueryClient();

  return function refetchClassTypeLists() {
    void queryClient.invalidateQueries({ queryKey: classTypesQueryKey });
  };
}

export function createClassType(request: CreateClassTypeRequest) {
  return apiFetch<ClassTypeResponse>("/partner/class-types", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function useCreateClassTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassType,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: classTypesQueryKey });
    },
  });
}

export function updateClassType(
  classTypeId: string,
  request: UpdateClassTypeRequest,
) {
  return apiFetch<ClassTypeResponse>(`/partner/class-types/${classTypeId}`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}

export function useUpdateClassTypeMutation() {
  const refetchClassTypeLists = useRefetchClassTypeLists();

  return useMutation({
    mutationFn: ({
      classTypeId,
      request,
    }: {
      classTypeId: string;
      request: UpdateClassTypeRequest;
    }) => updateClassType(classTypeId, request),
    onSuccess: refetchClassTypeLists,
    // 404 (gone) and 409 (archived elsewhere) mean the cached lists are
    // stale, so refresh them behind the error message.
    onError: (error) => {
      if (
        error instanceof ApiError &&
        (error.status === 404 || error.status === 409)
      ) {
        refetchClassTypeLists();
      }
    },
  });
}

export function archiveClassType(classTypeId: string) {
  return apiFetch<ClassTypeResponse>(
    `/partner/class-types/${classTypeId}/archive`,
    { method: "POST" },
  );
}

export function useArchiveClassTypeMutation() {
  const refetchClassTypeLists = useRefetchClassTypeLists();

  return useMutation({
    mutationFn: archiveClassType,
    // The type moves from the active list to the archived one, so both lists
    // are refetched.
    onSuccess: refetchClassTypeLists,
    // 404: it is gone, so the cached lists are stale.
    onError: (error) => {
      if (error instanceof ApiError && error.status === 404) {
        refetchClassTypeLists();
      }
    },
  });
}
