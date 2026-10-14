import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  ClassPlanResponse,
  CreateClassPlanRequest,
} from "@/api/class-plans/class-plans.types";
import { apiFetch } from "@/lib/network/api-client";

// Like the other partner keys it is not user-scoped: AuthContext clears the
// whole cache when the user changes.
export const classPlansQueryKey = ["partner", "class-plans"] as const;

export function fetchClassPlans() {
  return apiFetch<ClassPlanResponse[]>("/partner/class-plans");
}

export function useClassPlansQuery() {
  return useQuery({
    queryKey: classPlansQueryKey,
    queryFn: fetchClassPlans,
  });
}

export function createClassPlan(request: CreateClassPlanRequest) {
  return apiFetch<ClassPlanResponse>("/partner/class-plans", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function useCreateClassPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassPlan,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: classPlansQueryKey });
    },
  });
}
