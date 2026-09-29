import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { meQueryKey } from "@/api/auth/auth.api";
import type {
  PartnerBusinessProfileResponse,
  PartnerOnboardingRequest,
  PartnerOnboardingResponse,
} from "@/api/partners/partners.types";
import { useAuth } from "@/auth/AuthContext";
import { ApiError, apiFetch } from "@/lib/network/api-client";

export function submitPartnerOnboarding(request: PartnerOnboardingRequest) {
  return apiFetch<PartnerOnboardingResponse>("/partners/onboarding", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function usePartnerOnboardingMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Onboarding changes the user's partner, so /auth/me must be refetched.
  // Returning the promise keeps the mutation pending until the refetch
  // finishes, so the UI never sees a settled POST with a stale `partner: null`.
  function refetchMe() {
    if (!user) return;

    return queryClient.invalidateQueries({
      queryKey: meQueryKey(user.id),
    });
  }

  return useMutation({
    mutationFn: submitPartnerOnboarding,
    onSuccess: refetchMe,
    // 409 means the user already completed onboarding, so the cached
    // `partner: null` is stale. Refetch and let PartnerGate redirect.
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        return refetchMe();
      }
    },
  });
}

export function useBusinessProfileQuery() {
  return useQuery({
    queryKey: ["partner", "business-profile"],
    queryFn: () =>
      apiFetch<PartnerBusinessProfileResponse>("/partner/business-profile"),
  });
}
